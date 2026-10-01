import json, sys, time
from faster_whisper import WhisperModel
src, out, model_name = sys.argv[1], sys.argv[2], sys.argv[3]
t = time.time()
m = WhisperModel(model_name, device="cpu", compute_type="int8", cpu_threads=4)
segs, info = m.transcribe(src, language="pt", word_timestamps=True, vad_filter=False,
                          initial_prompt="Olá, tudo bem? Então, é... hoje eu vou mostrar.")
words = []
for s in segs:
    for w in s.words:
        words.append({"w": w.word.strip(), "s": round(w.start, 3), "e": round(w.end, 3), "p": round(w.probability, 3)})
json.dump({"duration": info.duration, "words": words}, open(out, "w"), ensure_ascii=False, indent=0)
print(f"{len(words)} palavras em {time.time()-t:.0f}s")
