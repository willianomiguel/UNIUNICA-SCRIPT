"""Alinhamento forçado (wav2vec2 + CTC) para refinar o tempo de cada palavra.

O Whisper costuma "esticar" palavras por cima de pausas e de "ééé". Aqui cada
palavra é realinhada ao áudio, então tudo que não é fala transcrita vira
intervalo e pode ser cortado.

Uso: python align.py audio16k.wav palavras.json
(reescreve o JSON com s/e refinados; o tempo original fica em ws/we)
"""
import json
import re
import sys
import wave

import numpy as np
import torch
from num2words import num2words
from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor

MODEL = "jonatasgrosman/wav2vec2-large-xlsr-53-portuguese"
SR = 16000


def spell(word, vocab):
    w = re.sub(r"\d+", lambda m: " " + num2words(int(m.group()), lang="pt_BR") + " ", word.lower())
    return "".join(c for c in w if c in vocab and c != "|")


def trellis_path(em, tokens):
    T, J = em.shape[0], len(tokens)
    tr = np.full((T, J), -np.inf, dtype=np.float32)
    tr[0, 0] = 0
    tr[1:, 0] = np.cumsum(em[1:, 0])
    if J > 1:
        tr[-J + 1:, 0] = np.inf
    tok = np.array(tokens)
    for t in range(T - 1):
        tr[t + 1, 1:] = np.maximum(tr[t, 1:] + em[t, 0], tr[t, :-1] + em[t, tok[1:]])
    t, j, path = T - 1, J - 1, [(J - 1, T - 1)]
    while j > 0 and t > 0:
        stayed = tr[t - 1, j] + em[t - 1, 0]
        changed = tr[t - 1, j - 1] + em[t - 1, tok[j]]
        t -= 1
        if changed > stayed:
            j -= 1
        path.append((j, t))
    return path[::-1]


def align_chunk(model, proc, audio, t0, words, vocab):
    with torch.inference_mode():
        x = proc(audio, sampling_rate=SR, return_tensors="pt").input_values
        em = torch.log_softmax(model(x).logits[0], -1).numpy()
    stride = len(audio) / SR / em.shape[0]
    text = "|" + "|".join(spell(w["w"], vocab) for w in words) + "|"
    tokens = [vocab[c] for c in text]
    if em.shape[0] < len(tokens):
        return
    path = trellis_path(em, tokens)
    # para cada posição de token: primeiro e último frame que caem nela
    span = {}
    for j, t in path:
        a, b = span.get(j, (t, t))
        span[j] = (min(a, t), max(b, t))
    pos = 1
    for w in words:
        n = len(spell(w["w"], vocab))
        if n == 0:
            pos += 1
            continue
        first, last = span.get(pos), span.get(pos + n - 1)
        if first and last:
            w["ws"], w["we"] = w["s"], w["e"]
            w["s"] = round(t0 + first[0] * stride, 3)
            w["e"] = round(t0 + (last[1] + 1) * stride, 3)
        pos += n + 1


def main():
    wav_path, json_path = sys.argv[1], sys.argv[2]
    data = json.load(open(json_path))
    words = data["words"]
    with wave.open(wav_path) as f:
        assert f.getframerate() == SR
        audio = np.frombuffer(f.readframes(f.getnframes()), np.int16).astype(np.float32) / 32768
    proc = Wav2Vec2Processor.from_pretrained(MODEL)
    model = Wav2Vec2ForCTC.from_pretrained(MODEL).eval()
    vocab = proc.tokenizer.get_vocab()
    torch.set_num_threads(4)

    chunks, cur = [], []
    for w in words:
        if cur and (w["s"] - cur[-1]["e"] > 1.0 or w["e"] - cur[0]["s"] > 12):
            chunks.append(cur)
            cur = []
        cur.append(w)
    chunks.append(cur)
    for k, ch in enumerate(chunks):
        a = max(0.0, ch[0]["s"] - 0.4)
        b = min(len(audio) / SR, ch[-1]["e"] + 0.4)
        align_chunk(model, proc, audio[int(a * SR):int(b * SR)], a, ch, vocab)
        print(f"\r{k + 1}/{len(chunks)}", end="", flush=True)
    json.dump(data, open(json_path, "w"), ensure_ascii=False, indent=0)
    print(" ok")


if __name__ == "__main__":
    main()
