# Editor automático de vídeo de vendas (pesquisa)

Pipeline que pega um vídeo bruto (pessoa falando, com ou sem tela do computador) e entrega um vídeo vertical 1080x1920 editado.

## Etapas

1. **Transcrição** (`editor/transcribe.py`): Whisper (faster-whisper, modelo `medium`), palavra por palavra.
2. **Alinhamento forçado** (`editor/align.py`): wav2vec2 PT-BR realinha cada palavra ao áudio. Pausas, "ééé" e ruído deixam de ficar "dentro" das palavras e podem ser cortados.
3. **Roteiro de corte** (`editor/plans/*.json`): a IA escolhe os trechos e a ordem (gancho primeiro), a região da tela que recebe zoom em cada trecho, os stickers e as palavras de destaque.
4. **Render** (`editor/render.py`):
   - cortes secos sem pausas longas, com punch-in alternado para esconder os cortes;
   - rosto em círculo e tela com zoom/pan animado entre regiões;
   - legendas palavra a palavra (palavra ativa em amarelo, palavras-chave em verde);
   - stickers, barra de progresso e cartão de CTA no final;
   - voz tratada (filtro, redução de ruído, compressor, -15 LUFS), trilha com ducking e whoosh nas trocas de tela.

## Como rodar

```bash
python -m venv .venv && . .venv/bin/activate
pip install torch torchaudio --index-url https://download.pytorch.org/whl/cpu
pip install -r editor/requirements.txt

ffmpeg -i raw/VIDEO.mp4 -ac 1 -ar 16000 raw/VIDEO.wav
python editor/transcribe.py raw/VIDEO.wav raw/VIDEO.words.json medium
python editor/align.py raw/VIDEO.wav raw/VIDEO.words.json
python editor/render.py editor/plans/VIDEO.json --raw raw --assets assets --out out/VIDEO.mp4
```

`assets/` precisa das fontes Poppins (Black, ExtraBold, SemiBold) e da trilha (`--music`).

## Exemplo

`editor/plans/lostbus.json` edita o "Lost Bus Devlog 1" de Guz013 (CC BY-SA 4.0, archive.org/details/lostbus-devlog1): de 5min51s de bruto para 55s + CTA. Trilha: "Funky Chunk", de Kevin MacLeod (CC BY 4.0).
