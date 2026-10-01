"""Modo "pessoa falando" (talking head) para anúncio vertical.

Reaproveita o corte, as legendas e o tratamento de voz do render.py e troca a
composição: vídeo em tela cheia com punch-in alternado a cada corte, respiro
de zoom nas palavras-chave e grafismos de venda (selos de número, lista de
recursos aparecendo conforme a fala, fluxo em etapas e botão de CTA).

Uso:
  python talking.py PLANO.json --raw DIR_BRUTO --assets DIR_ASSETS --out SAIDA.mp4
"""
import argparse
import json
import math
import os
import subprocess

from PIL import Image, ImageDraw, ImageFilter

import render as R

W, H, FPS = R.W, R.H, R.FPS
TAIL = 0.8   # segura o último quadro com o CTA na tela


def find_out(ws, phrase, nth=0):
    """Momento (no vídeo editado) em que a frase começa a ser dita."""
    target = [R.norm(t) for t in phrase.split() if R.norm(t)]
    keys = [R.norm(w["w"]) for w in ws]
    hits = [i for i in range(len(ws) - len(target) + 1) if keys[i:i + len(target)] == target]
    if len(hits) <= nth:
        raise SystemExit(f"frase não encontrada no vídeo editado: {phrase!r}")
    return ws[hits[nth]]["s"]


def pill(assets, text, size, fg, bg, pad=(34, 18), weight="Black", radius=None, shadow=True):
    f = R.font(assets, weight, size)
    tw = int(ImageDraw.Draw(Image.new("L", (1, 1))).textlength(text, font=f))
    w, h = tw + 2 * pad[0], size + 2 * pad[1]
    img = Image.new("RGBA", (w + 16, h + 16))
    d = ImageDraw.Draw(img)
    r = radius if radius is not None else h // 2
    if shadow:
        d.rounded_rectangle((8, 12, w + 8, h + 12), r, fill=(0, 0, 0, 120))
    d.rounded_rectangle((0, 0, w, h), r, fill=bg)
    d.text((w / 2, h / 2 + size * 0.04), text, font=f, fill=fg, anchor="mm")
    return img


def stat_card(assets, big, small, color):
    fb, fs = R.font(assets, "Black", 120), R.font(assets, "ExtraBold", 44)
    d0 = ImageDraw.Draw(Image.new("L", (1, 1)))
    w = int(max(d0.textlength(big, font=fb), d0.textlength(small, font=fs))) + 90
    h = 250
    img = Image.new("RGBA", (w + 16, h + 16))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((8, 12, w + 8, h + 12), 36, fill=(0, 0, 0, 130))
    d.rounded_rectangle((0, 0, w, h), 36, fill=(15, 15, 18, 235), outline=color, width=5)
    d.text((w / 2, 100), big, font=fb, fill=color, anchor="mm")
    d.text((w / 2, 200), small, font=fs, fill=(255, 255, 255), anchor="mm")
    return img.rotate(-3, expand=True, resample=Image.BICUBIC)


def paste_scaled(frame, img, cx, cy, s, alpha=1.0):
    if s <= 0.02 or alpha <= 0.02:
        return
    im = img.resize((max(1, int(img.width * s)), max(1, int(img.height * s))), Image.BICUBIC)
    if alpha < 1:
        a = im.getchannel("A").point(lambda v: int(v * alpha))
        im.putalpha(a)
    frame.paste(im, (int(cx - im.width / 2), int(cy - im.height / 2)), im)


def pop_scale(d, dur, t_in=0.28, t_out=0.22):
    """Escala de entrada com overshoot e saída rápida."""
    if d < 0 or d > dur:
        return 0.0
    s = R.ease_out_back(min(1.0, d / t_in))
    if dur - d < t_out:
        s *= R.ease_in_out((dur - d) / t_out)
    return s


def build_overlays(plan, ws, total, assets):
    """Converte o plano de grafismos em (início, fim, desenhar(frame, t))."""
    acc = tuple(plan.get("accent", R.ACCENT))
    green = tuple(plan.get("accent2", R.GREEN))
    end = total + TAIL
    out, pops = [], []
    for ov in plan["overlays"]:
        kind = ov["type"]
        t0 = find_out(ws, ov["at"], ov.get("nth", 0))
        if kind in ("title", "stat"):
            dur = ov.get("dur", 1.6)
            img = (pill(assets, ov["text"], ov.get("size", 92), (15, 15, 15), acc + (255,))
                   if kind == "title" else stat_card(assets, ov["big"], ov["small"], acc))
            x, y = ov.get("pos", (540, 330))

            def draw(fr, t, img=img, t0=t0, dur=dur, x=x, y=y):
                paste_scaled(fr, img, x, y, pop_scale(t - t0, dur))
            out.append((t0, t0 + dur, draw))
            pops.append(t0)
        elif kind == "chips":
            # itens que entram um a um e ficam empilhados em grade até 'until'
            t1 = find_out(ws, ov["until"]) if "until" in ov else t0 + ov.get("dur", 6)
            items = []
            for it in ov["items"]:
                ti = find_out(ws, it["at"], it.get("nth", 0))
                img = pill(assets, "✓ " + it["text"] if ov.get("check") else it["text"],
                           ov.get("size", 46), (255, 255, 255), (15, 15, 18, 230),
                           pad=(26, 14), weight="ExtraBold", radius=22)
                items.append((ti, img))
                pops.append(ti)
            cols, y0, row_h = ov.get("cols", 3), ov.get("y", 150), ov.get("row_h", 96)
            arrows = ov.get("arrows", False)

            def draw(fr, t, items=items, t1=t1, cols=cols, y0=y0, row_h=row_h, arrows=arrows):
                fade = 1.0 if t < t1 else 1 - R.ease_in_out((t - t1) / 0.25)
                if fade <= 0:
                    return
                n = len(items)
                for k, (ti, img) in enumerate(items):
                    row, col = divmod(k, cols)
                    in_row = min(cols, n - row * cols)
                    cell = W / in_row
                    cx = cell * (col + 0.5)
                    cy = y0 + row * row_h
                    s = R.ease_out_back(min(1.0, max(0.0, (t - ti) / 0.25))) if t >= ti else 0
                    paste_scaled(fr, img, cx, cy, s * (0.96 if img.width > cell - 10 else 1.0)
                                 * min(1.0, (cell - 12) / img.width), fade)
                    if arrows and k + 1 < n and t >= items[k + 1][0]:
                        d = ImageDraw.Draw(fr)
                        ax = cell * (col + 1)
                        d.polygon([(ax - 12, cy - 16), (ax + 12, cy), (ax - 12, cy + 16)],
                                  fill=acc)
            out.append((t0, t1 + 0.3, draw))
        elif kind == "cta":
            img = pill(assets, ov["text"], ov.get("size", 70), (15, 15, 15), green + (255,),
                       pad=(48, 26))
            x, y = ov.get("pos", (540, 1640))
            f_arrow = ov.get("arrow", True)

            def draw(fr, t, img=img, t0=t0, x=x, y=y, f_arrow=f_arrow):
                d = t - t0
                if d < 0:
                    return
                s = R.ease_out_back(min(1.0, d / 0.3)) * (1 + 0.04 * math.sin(d * 7))
                paste_scaled(fr, img, x, y, s)
                if f_arrow and d > 0.3:
                    ay = y + img.height / 2 + 30 + 14 * abs(math.sin(d * 5))
                    dd = ImageDraw.Draw(fr)
                    dd.polygon([(x - 34, ay), (x + 34, ay), (x, ay + 40)], fill=green)
            out.append((t0, end + 1, draw))
            pops.append(t0)
    return out, pops


def compose(plan, pieces, ws, total, cut_mp4, enc_cmd, assets):
    src_w, src_h = plan["src_size"]
    fcx, fcy = plan.get("face_center", (0.5, 0.38))
    hl = {R.norm(h) for h in plan["highlight"]}
    emph = [w["s"] for w in ws if R.norm(w["w"]) in hl]
    overlays, _ = build_overlays(plan, ws, total, assets)
    zooms = plan.get("punch", [1.0, 1.14])

    dec = subprocess.Popen(["ffmpeg", "-loglevel", "error", "-i", cut_mp4, "-vf",
                            "eq=contrast=1.05:saturation=1.12,unsharp=5:5:0.4",
                            "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
    enc = subprocess.Popen(enc_cmd, stdin=subprocess.PIPE)
    n_frames = int(round(total * FPS))
    pi, raw, frame = 0, None, None
    for n in range(n_frames + int(TAIL * FPS)):
        t = n / FPS
        if n < n_frames:
            nxt = dec.stdout.read(src_w * src_h * 3)
            if len(nxt) == src_w * src_h * 3:
                raw = nxt
        src = Image.frombuffer("RGB", (src_w, src_h), raw)
        while pi + 1 < len(pieces) and pieces[pi + 1]["t"] <= t:
            pi += 1
        e = 0.0
        for es in emph:
            d = t - es
            if -0.1 < d < 0.9:
                e = max(e, R.ease_in_out((d + 0.1) / 0.25) * (1 - R.ease_in_out((d - 0.5) / 0.4)))
        zoom = zooms[pi % len(zooms)] * (1 + 0.035 * e)
        # recorte 9:16 em volta do rosto
        cw, ch = src_w / zoom, src_h / zoom
        x0 = min(max(fcx * src_w - cw / 2, 0), src_w - cw)
        y0 = min(max(fcy * src_h - ch / 2.6, 0), src_h - ch)
        frame = src.crop((x0, y0, x0 + cw, y0 + ch)).resize((W, H), Image.LANCZOS)
        for a, b, draw in overlays:
            if a - 0.05 <= t <= b:
                draw(frame, t)
        ImageDraw.Draw(frame).rectangle((0, 0, int(W * t / (total + TAIL)), 9),
                                        fill=tuple(plan.get("accent", R.ACCENT)))
        enc.stdin.write(frame.tobytes())
    enc.stdin.close()
    enc.wait()
    dec.kill()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("plan")
    ap.add_argument("--raw", required=True)
    ap.add_argument("--assets", required=True)
    ap.add_argument("--music", default="Funky_Chunk.mp3")
    ap.add_argument("--music-vol", type=float, default=0.16)
    ap.add_argument("--out", required=True)
    args = ap.parse_args()

    plan = json.load(open(args.plan))
    base = os.path.splitext(os.path.join(args.raw, plan["source"]))[0]
    words = json.load(open(base + ".words.json"))["words"]
    pieces, seg_words, total = R.build_pieces(plan, words)
    ws = R.out_words(pieces, seg_words)
    work = os.path.splitext(args.out)[0] + "_work"
    os.makedirs(work, exist_ok=True)
    print(f"{len(pieces)} cortes, duração {total:.1f}s")

    src = os.path.join(args.raw, plan["source"])
    fc, cat = [], ""
    for k, p in enumerate(pieces):
        d = p["b"] - p["a"]
        fc.append(f"[0:v]trim={p['a']:.4f}:{p['b']:.4f},setpts=PTS-STARTPTS[v{k}]")
        fc.append(f"[0:a]atrim={p['a']:.4f}:{p['b']:.4f},asetpts=PTS-STARTPTS,"
                  f"afade=t=in:d=0.012,afade=t=out:st={max(0, d - 0.015):.4f}:d=0.015[a{k}]")
        cat += f"[v{k}][a{k}]"
    fc.append(f"{cat}concat=n={len(pieces)}:v=1:a=1[v][a]")
    cut_mp4 = os.path.join(work, "cut.mkv")
    R.run(["ffmpeg", "-y", "-loglevel", "error", "-i", src, "-filter_complex", ";".join(fc),
           "-map", "[v]", "-map", "[a]", "-r", str(FPS), "-c:v", "libx264", "-crf", "12",
           "-preset", "veryfast", "-c:a", "pcm_s16le", cut_mp4])
    probe = R.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
                   "stream=width,height", "-of", "csv=p=0", cut_mp4]).stdout.strip().split(",")
    plan["src_size"] = [int(probe[0]), int(probe[1])]

    _, pops = build_overlays(plan, ws, total, args.assets)
    full = total + TAIL
    mix = os.path.join(work, "mix.wav")
    pop = ("aevalsrc='0.6*sin(2*PI*(500+2600*t)*t)*exp(-28*t)':d=0.16:s=48000,"
           "highpass=f=300,volume=0.5")
    fa = [f"[0:a]highpass=f=80,afftdn=nf=-30,acompressor=threshold=-22dB:ratio=3:attack=5:"
          f"release=90:makeup=3,loudnorm=I=-14:TP=-1.5:LRA=7,apad=whole_dur={full:.3f},"
          f"asplit=2[voz][key]",
          f"[1:a]atrim=0:{full:.3f},volume={args.music_vol},afade=t=in:d=0.4,"
          f"afade=t=out:st={full - 1.2:.3f}:d=1.2[mus]",
          "[mus][key]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=300[duck]"]
    labels = ["[voz]", "[duck]"]
    for k, pt in enumerate(sorted(set(round(p, 2) for p in pops))):
        ms = int(max(0, pt - 0.02) * 1000)
        fa.append(f"{pop},adelay={ms}|{ms},aformat=channel_layouts=stereo[p{k}]")
        labels.append(f"[p{k}]")
    fa.append(f"{''.join(labels)}amix=inputs={len(labels)}:normalize=0:duration=first,"
              f"alimiter=limit=0.95[out]")
    R.run(["ffmpeg", "-y", "-loglevel", "error", "-i", cut_mp4,
           "-stream_loop", "-1", "-i", os.path.join(args.assets, args.music),
           "-filter_complex", ";".join(fa), "-map", "[out]", "-ar", "48000", "-ac", "2", mix])

    R.CAPTION_Y = plan.get("caption_y", 1330)
    ass = os.path.join(work, "captions.ass")
    R.write_ass(ass, ws, plan["highlight"], total)
    json.dump({"pieces": pieces, "words": ws}, open(os.path.join(work, "timeline.json"), "w"),
              ensure_ascii=False, indent=1)

    enc_cmd = ["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24",
               "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-i", mix,
               "-vf", f"ass={ass}:fontsdir={args.assets}",
               "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-pix_fmt", "yuv420p",
               "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", args.out]
    compose(plan, pieces, ws, total, cut_mp4, enc_cmd, args.assets)
    print("pronto:", args.out)


if __name__ == "__main__":
    main()
