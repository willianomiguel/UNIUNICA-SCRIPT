"""Editor automático de vídeo de vendas (v1).

Entrada: vídeo bruto + transcrição palavra a palavra + plano de edição (JSON).
Saída: vídeo vertical 1080x1920 com cortes secos, zoom na tela, rosto em
círculo, legendas animadas, stickers, barra de progresso, trilha com ducking
e cartão de CTA no final.

Uso:
  python render.py PLANO.json --raw DIR_BRUTO --assets DIR_ASSETS --out SAIDA.mp4
"""
import argparse
import json
import math
import os
import re
import subprocess
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

FPS = 30
W, H = 1080, 1920
SRC_W, SRC_H = 1280, 720

PANEL = (40, 590, 1000, 750)          # x, y, w, h do painel da tela (4:3)
BUBBLE_C, BUBBLE_R = (540, 335), 200  # centro e raio do rosto
CAPTION_Y = 1500
ACCENT = (255, 212, 0)
GREEN = (61, 255, 122)
OUTRO_SECS = 3.0
XFADE = 0.35                          # transição entre regiões de tela


# ---------------------------------------------------------------- utilidades
def norm(s):
    return re.sub(r"[^\wà-úÀ-Ú]", "", s.lower())


def ease_out_back(x):
    c1, c3 = 1.70158, 2.70158
    return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2


def ease_in_out(x):
    return 0.5 - 0.5 * math.cos(math.pi * max(0.0, min(1.0, x)))


def font(assets, name, size):
    return ImageFont.truetype(os.path.join(assets, f"Poppins-{name}.ttf"), size)


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        sys.exit(f"falhou: {' '.join(cmd[:6])}...\n{r.stderr[-2000:]}")
    return r


# ------------------------------------------------------------- decisão de corte
def find_phrase(words, phrase, start=0):
    target = [norm(t) for t in phrase.split() if norm(t)]
    keys = [norm(w["w"]) for w in words]
    for i in range(start, len(words) - len(target) + 1):
        if keys[i:i + len(target)] == target:
            return i, i + len(target) - 1
    sys.exit(f"frase não encontrada na transcrição: {phrase!r}")


GAP_KEEP = 0.25   # pausa natural mantida entre palavras
PAD_IN, PAD_OUT = 0.05, 0.09


def build_pieces(plan, words):
    """Trechos do bruto que entram no vídeo: só as palavras do roteiro,
    com as pausas longas (e tudo que não foi transcrito, tipo "ééé") cortadas."""
    pieces, seg_words = [], []
    for si, seg in enumerate(plan["segments"]):
        after = next((k for k, w in enumerate(words) if w["s"] >= seg.get("after", 0)), 0)
        i, _ = find_phrase(words, seg["from"], after)
        _, j = find_phrase(words, seg["to"], i)
        ws = words[i:j + 1]
        cur = [ws[0]["s"] - PAD_IN, ws[0]["e"] + PAD_OUT]
        spans = []
        for prev, w in zip(ws, ws[1:]):
            if w["s"] - prev["e"] <= GAP_KEEP:
                cur[1] = w["e"] + PAD_OUT
            else:
                spans.append(cur)
                cur = [w["s"] - PAD_IN, w["e"] + PAD_OUT]
        spans.append(cur)
        for k0, k1 in spans:
            k0, k1 = round(k0 * FPS) / FPS, round(k1 * FPS) / FPS
            if k1 - k0 >= 0.1:
                pieces.append({"seg": si, "a": max(0.0, k0), "b": k1})
        seg_words.append(ws)
    t = 0.0
    for p in pieces:
        p["t"] = t
        t += p["b"] - p["a"]
    return pieces, seg_words, t


def map_time(pieces, si, ts, end=False):
    cand = [p for p in pieces if p["seg"] == si]
    for p in cand:
        if p["a"] <= ts <= p["b"]:
            return p["t"] + ts - p["a"]
    if end:   # termina dentro de silêncio cortado: fim do trecho anterior
        prev = [p for p in cand if p["b"] <= ts]
        return (prev[-1]["t"] + prev[-1]["b"] - prev[-1]["a"]) if prev else cand[0]["t"]
    nxt = [p for p in cand if p["a"] >= ts]
    return nxt[0]["t"] if nxt else cand[-1]["t"] + cand[-1]["b"] - cand[-1]["a"]


def out_words(pieces, seg_words):
    res = []
    for si, ws in enumerate(seg_words):
        for w in ws:
            s = map_time(pieces, si, w["s"])
            e = max(s + 0.08, map_time(pieces, si, w["e"], end=True))
            res.append({"w": w["w"], "s": s, "e": e, "seg": si})
    for k in range(len(res) - 1):          # sem sobreposição
        res[k]["e"] = min(res[k]["e"], max(res[k]["s"] + 0.05, res[k + 1]["s"]))
    return res


# ---------------------------------------------------------------- legendas ASS
def ass_time(t):
    cs = int(round(t * 100))
    return f"{cs // 360000}:{cs // 6000 % 60:02d}:{cs // 100 % 60:02d}.{cs % 100:02d}"


def chunk_words(ws):
    chunks, cur = [], []
    for k, w in enumerate(ws):
        if cur:
            text = " ".join(x["w"] for x in cur + [w])
            gap = w["s"] - cur[-1]["e"]
            if len(cur) >= 3 or len(text) > 18 or gap > 0.35 or cur[-1]["w"][-1] in ".,?!" \
                    or w["seg"] != cur[-1]["seg"]:
                chunks.append(cur)
                cur = []
        cur.append(w)
    if cur:
        chunks.append(cur)
    return chunks


def write_ass(path, ws, highlight, total):
    hl = {norm(h) for h in highlight}
    head = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {W}
PlayResY: {H}
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Cap,Poppins Black,96,&H00FFFFFF,&H00FFFFFF,&H00000000,&H96000000,0,0,0,0,100,100,0,0,1,7,4,5,40,40,0,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    lines = []
    chunks = chunk_words(ws)
    for ci, ch in enumerate(chunks):
        c_end = ch[-1]["e"] + 0.12
        if ci + 1 < len(chunks):
            c_end = min(c_end, chunks[ci + 1][0]["s"] - 0.03)
        for k, w in enumerate(ch):
            s = w["s"] if k else w["s"] - 0.03
            e = ch[k + 1]["s"] if k + 1 < len(ch) else c_end
            parts = []
            for m, x in enumerate(ch):
                word = x["w"].upper().rstrip(",.")
                if m == k:
                    col = "&H7AFF3D&" if norm(x["w"]) in hl else "&H00D4FF&"
                    parts.append("{\\c" + col + "\\fscx78\\fscy78\\t(0,90,\\fscx116\\fscy116)"
                                 "\\t(90,170,\\fscx106\\fscy106)}" + word + "{\\r}")
                else:
                    parts.append(word)
            intro = "{\\fad(60,0)}" if k == 0 else ""
            lines.append(f"Dialogue: 0,{ass_time(max(0, s))},{ass_time(min(e, total))},Cap,,0,0,0,,"
                         f"{{\\pos(540,{CAPTION_Y})}}{intro}" + " ".join(parts))
    with open(path, "w") as f:
        f.write(head + "\n".join(lines) + "\n")


# --------------------------------------------------------------- camadas fixas
def rounded_mask(w, h, r):
    m = Image.new("L", (w, h), 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, w - 1, h - 1), r, fill=255)
    return m


def make_static(assets, plan):
    bg = Image.new("RGB", (W, H))
    y = np.linspace(0, 1, H)[:, None]
    top, bot = np.array([18, 20, 34]), np.array([4, 4, 8])
    arr = (top * (1 - y) + bot * y)[:, None, :].repeat(W, 1).reshape(H, W, 3)
    xx, yy = np.meshgrid(np.arange(W), np.arange(H))
    glow = np.exp(-(((xx - 540) / 520) ** 2 + ((yy - 900) / 620) ** 2))
    arr = arr + glow[..., None] * np.array([38, 30, 4])
    bg = Image.fromarray(arr.clip(0, 255).astype(np.uint8))

    # sombra do painel
    px, py, pw, ph = PANEL
    sh = Image.new("L", (W, H), 0)
    ImageDraw.Draw(sh).rounded_rectangle((px, py + 18, px + pw, py + ph + 18), 30, fill=170)
    sh = sh.filter(ImageFilter.GaussianBlur(28))
    bg.paste((0, 0, 0), (0, 0), sh)

    # selo no topo
    d = ImageDraw.Draw(bg)
    f = font(assets, "SemiBold", 34)
    tw = d.textlength(plan["badge"], font=f)
    d.rounded_rectangle((540 - tw / 2 - 26, 46, 540 + tw / 2 + 26, 100), 27, fill=(30, 30, 40),
                        outline=ACCENT, width=2)
    d.text((540, 73), plan["badge"], font=f, fill=(255, 255, 255), anchor="mm")

    panel_mask = rounded_mask(pw, ph, 28)
    border = Image.new("RGBA", (pw, ph))
    ImageDraw.Draw(border).rounded_rectangle((0, 0, pw - 1, ph - 1), 28,
                                             outline=(255, 255, 255, 60), width=3)
    d2 = 2 * BUBBLE_R
    bubble_mask = Image.new("L", (d2, d2), 0)
    ImageDraw.Draw(bubble_mask).ellipse((0, 0, d2 - 1, d2 - 1), fill=255)
    ring = Image.new("RGBA", (d2 + 40, d2 + 40))
    rd = ImageDraw.Draw(ring)
    rd.ellipse((4, 4, d2 + 35, d2 + 35), outline=(0, 0, 0, 120), width=10)
    rd.ellipse((12, 12, d2 + 27, d2 + 27), outline=ACCENT + (255,), width=8)
    return bg, panel_mask, border, bubble_mask, ring


def make_sticker(assets, text):
    f = font(assets, "Black", 58)
    tw = int(ImageDraw.Draw(Image.new("L", (1, 1))).textlength(text, font=f))
    img = Image.new("RGBA", (tw + 80, 120))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((8, 14, tw + 72, 106), 22, fill=(0, 0, 0, 140))
    d.rounded_rectangle((0, 6, tw + 64, 98), 22, fill=ACCENT + (255,))
    d.text((tw / 2 + 32, 52), text, font=f, fill=(15, 15, 15), anchor="mm")
    return img.rotate(6, expand=True, resample=Image.BICUBIC)


# ------------------------------------------------------------------ composição
def crop_rect(region, zoom):
    x, y, w, h = region
    cx, cy = x + w / 2, y + h / 2
    aspect = PANEL[2] / PANEL[3]          # encaixa a região no formato do painel
    if w / h > aspect:
        h = w / aspect
    else:
        w = h * aspect
    if h > SRC_H:
        h, w = SRC_H, SRC_H * aspect
    if w > SRC_W:
        w, h = SRC_W, SRC_W / aspect
    w, h = w / zoom, h / zoom
    x0 = min(max(cx - w / 2, 0), SRC_W - w)
    y0 = min(max(cy - h / 2, 0), SRC_H - h)
    return (x0, y0, x0 + w, y0 + h)


def lerp_rect(a, b, k):
    return [a[i] + (b[i] - a[i]) * k for i in range(4)]


def compose(args, plan, pieces, ws, total, cut_mp4, out_raw_cmd):
    bg, panel_mask, border, bubble_mask, ring = make_static(args.assets, plan)
    regions = plan["regions"]
    seg_region = [regions[s["region"]] for s in plan["segments"]]
    hl = {norm(h) for h in plan["highlight"]}

    stickers = []
    for si, seg in enumerate(plan["segments"]):
        st = seg.get("sticker")
        if st:
            w = next(w for w in ws if w["seg"] == si and norm(w["w"]) == norm(st["at"]))
            stickers.append((w["s"], make_sticker(args.assets, st["text"])))

    emph = [w["s"] for w in ws if norm(w["w"]) in hl]

    # quando a região muda: início da transição
    changes = []
    for k in range(1, len(pieces)):
        r0, r1 = seg_region[pieces[k - 1]["seg"]], seg_region[pieces[k]["seg"]]
        if r0 != r1:
            changes.append((pieces[k]["t"], r0, r1))

    dec = subprocess.Popen(["ffmpeg", "-loglevel", "error", "-i", cut_mp4, "-f", "rawvideo",
                            "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
    enc = subprocess.Popen(out_raw_cmd, stdin=subprocess.PIPE)
    fx, fy, fw, fh = plan["webcam_face"]
    px, py, pw, ph = PANEL
    n_main = int(round(total * FPS))
    last = None
    piece_idx = 0
    for n in range(n_main):
        t = n / FPS
        raw = dec.stdout.read(SRC_W * SRC_H * 3)
        if len(raw) < SRC_W * SRC_H * 3:
            raw = last
        last = raw
        src = Image.frombuffer("RGB", (SRC_W, SRC_H), raw)
        while piece_idx + 1 < len(pieces) and pieces[piece_idx + 1]["t"] <= t:
            piece_idx += 1
        p = pieces[piece_idx]

        # zoom: punch-in alternado a cada corte + respiro nas palavras-chave
        punch = 1.0 if piece_idx % 2 == 0 else 1.08
        e = 0.0
        for es in emph:
            d = t - es
            if -0.1 < d < 0.9:
                e = max(e, ease_in_out((d + 0.1) / 0.25) * (1 - ease_in_out((d - 0.5) / 0.4)))
        zoom = punch * (1 + 0.06 * e)

        region = seg_region[p["seg"]]
        rect = crop_rect(region, zoom)
        for ct, r0, r1 in changes:
            if ct <= t < ct + XFADE:
                k = ease_in_out((t - ct) / XFADE)
                rect = lerp_rect(crop_rect(r0, zoom), crop_rect(r1, zoom), k)

        frame = bg.copy()
        panel = src.crop(tuple(int(v) for v in rect)).resize((pw, ph), Image.LANCZOS)
        frame.paste(panel, (px, py), panel_mask)
        frame.paste(border, (px, py), border)

        fz = 1.0 if piece_idx % 2 == 0 else 1.12
        cw, chh = fw / fz, fh / fz
        face = src.crop((fx + (fw - cw) / 2, fy + (fh - chh) / 3, fx + (fw + cw) / 2,
                         fy + (fh - chh) / 3 + chh))
        face = face.resize((2 * BUBBLE_R, 2 * BUBBLE_R), Image.LANCZOS)
        face = face.filter(ImageFilter.UnsharpMask(radius=2, percent=60, threshold=2))
        bx, by = BUBBLE_C[0] - BUBBLE_R, BUBBLE_C[1] - BUBBLE_R
        frame.paste(ring, (bx - 20, by - 20), ring)
        frame.paste(face, (bx, by), bubble_mask)

        for st, img in stickers:
            d = t - st
            if 0 <= d < 1.4:
                s = ease_out_back(min(1, d / 0.3)) * (1 - ease_in_out((d - 1.15) / 0.25))
                if s > 0.02:
                    im = img.resize((max(1, int(img.width * s)), max(1, int(img.height * s))))
                    cx, cy = px + pw - img.width / 2 + 10, py - 10
                    frame.paste(im, (int(cx - im.width / 2), int(cy - im.height / 2)), im)

        d = ImageDraw.Draw(frame)
        d.rectangle((0, 0, int(W * t / (total + OUTRO_SECS)), 10), fill=ACCENT)
        enc.stdin.write(frame.tobytes())

    # ---- CTA final
    last_frame = frame
    f1, f2, f3 = font(args.assets, "Black", 90), font(args.assets, "SemiBold", 54), \
        font(args.assets, "SemiBold", 26)
    for n in range(int(OUTRO_SECS * FPS)):
        t = n / FPS
        card = bg.copy()
        s = ease_out_back(min(1, t / 0.45))
        layer = Image.new("RGBA", (1000, 420))
        ld = ImageDraw.Draw(layer)
        ld.rounded_rectangle((60, 40, 940, 230), 40, fill=ACCENT + (255,))
        ld.text((500, 135), plan["cta"]["title"], font=f1, fill=(15, 15, 15), anchor="mm")
        ld.text((500, 320), plan["cta"]["subtitle"], font=f2, fill=(255, 255, 255), anchor="mm")
        if s > 0.02:
            lw, lh = int(1000 * s), int(420 * s)
            li = layer.resize((lw, lh))
            card.paste(li, (540 - lw // 2, 760 - lh // 2), li)
        cd = ImageDraw.Draw(card)
        y = 1650
        for line in wrap(plan["credit"], 62):
            cd.text((540, y), line, font=f3, fill=(170, 170, 180), anchor="mm")
            y += 38
        if t < 0.25:
            card = Image.blend(last_frame, card, t / 0.25)
        ImageDraw.Draw(card).rectangle((0, 0, int(W * (total + t) / (total + OUTRO_SECS)), 10),
                                       fill=ACCENT)
        enc.stdin.write(card.tobytes())
    enc.stdin.close()
    enc.wait()
    dec.kill()


def wrap(text, n):
    out, cur = [], ""
    for w in text.split():
        if len(cur) + len(w) + 1 > n:
            out.append(cur)
            cur = w
        else:
            cur = (cur + " " + w).strip()
    return out + [cur]


# ------------------------------------------------------------------------ main
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("plan")
    ap.add_argument("--raw", required=True)
    ap.add_argument("--assets", required=True)
    ap.add_argument("--music", default="Funky_Chunk.mp3")
    ap.add_argument("--out", required=True)
    args = ap.parse_args()

    plan = json.load(open(args.plan))
    base = os.path.splitext(os.path.join(args.raw, plan["source"]))[0]
    words = json.load(open(base + ".words.json"))["words"]
    pieces, seg_words, total = build_pieces(plan, words)
    ws = out_words(pieces, seg_words)
    work = os.path.splitext(args.out)[0] + "_work"
    os.makedirs(work, exist_ok=True)
    print(f"{len(pieces)} cortes, duração {total:.1f}s (+{OUTRO_SECS}s de CTA)")

    # 1) corte seco do bruto (vídeo + voz), na ordem do roteiro
    fc, cat = [], ""
    for k, p in enumerate(pieces):
        d = p["b"] - p["a"]
        fc.append(f"[0:v]trim={p['a']:.4f}:{p['b']:.4f},setpts=PTS-STARTPTS[v{k}]")
        fc.append(f"[0:a]atrim={p['a']:.4f}:{p['b']:.4f},asetpts=PTS-STARTPTS,"
                  f"afade=t=in:d=0.012,afade=t=out:st={max(0, d - 0.015):.4f}:d=0.015[a{k}]")
        cat += f"[v{k}][a{k}]"
    fc.append(f"{cat}concat=n={len(pieces)}:v=1:a=1[v][a]")
    cut_mp4 = os.path.join(work, "cut.mp4")
    run(["ffmpeg", "-y", "-loglevel", "error", "-i", os.path.join(args.raw, plan["source"]),
         "-filter_complex", ";".join(fc), "-map", "[v]", "-map", "[a]", "-r", str(FPS),
         "-c:v", "libx264", "-crf", "12", "-preset", "veryfast", "-c:a", "pcm_s16le",
         "-f", "matroska", cut_mp4])

    # 2) áudio: voz tratada + trilha com ducking + whooshes nas trocas de tela
    full = total + OUTRO_SECS
    changes = [pieces[k]["t"] for k in range(1, len(pieces))
               if plan["segments"][pieces[k]["seg"]]["region"] !=
               plan["segments"][pieces[k - 1]["seg"]]["region"]]
    mix = os.path.join(work, "mix.wav")
    whoosh = ("anoisesrc=c=pink:d=0.45:a=0.5,highpass=f=600,lowpass=f=5000,"
              "afade=t=in:d=0.25:curve=exp,afade=t=out:st=0.25:d=0.2,volume=0.22")
    fa = [f"[0:a]highpass=f=80,afftdn=nf=-28,acompressor=threshold=-22dB:ratio=3:attack=5:"
          f"release=90:makeup=4,loudnorm=I=-15:TP=-1.5:LRA=7,apad=whole_dur={full:.3f},"
          f"asplit=2[voz][key]",
          f"[1:a]atrim=0:{full:.3f},volume=0.22,afade=t=in:d=0.6,"
          f"afade=t=out:st={full - 1.6:.3f}:d=1.6[mus]",
          "[mus][key]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=350[duck]"]
    labels = ["[voz]", "[duck]"]
    for k, ct in enumerate(changes):
        ms = int(max(0, ct - 0.22) * 1000)
        fa.append(f"{whoosh},adelay={ms}|{ms},aresample=48000,aformat=channel_layouts=stereo[w{k}]")
        labels.append(f"[w{k}]")
    fa.append(f"{''.join(labels)}amix=inputs={len(labels)}:normalize=0:duration=first,"
              f"alimiter=limit=0.95[out]")
    run(["ffmpeg", "-y", "-loglevel", "error", "-i", cut_mp4,
         "-stream_loop", "-1", "-i", os.path.join(args.assets, args.music),
         "-filter_complex", ";".join(fa), "-map", "[out]", "-ar", "48000", "-ac", "2", mix])

    # 3) legendas
    ass = os.path.join(work, "captions.ass")
    write_ass(ass, ws, plan["highlight"], total)
    json.dump({"pieces": pieces, "words": ws}, open(os.path.join(work, "timeline.json"), "w"),
              ensure_ascii=False, indent=1)

    # 4) composição quadro a quadro + legendas + áudio -> mp4 final
    enc_cmd = ["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24",
               "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-i", mix,
               "-vf", f"ass={ass}:fontsdir={args.assets}",
               "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-pix_fmt", "yuv420p",
               "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", args.out]
    compose(args, plan, pieces, ws, total, cut_mp4, enc_cmd)
    print("pronto:", args.out)


if __name__ == "__main__":
    main()
