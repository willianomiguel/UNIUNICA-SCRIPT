// Fontes servidas pelo próprio servidor (EXCALIDRAW_ASSET_PATH aponta para esta pasta).
import { cpSync } from 'node:fs';

cpSync('node_modules/@excalidraw/excalidraw/dist/prod/fonts', 'dist/fonts', { recursive: true });
cpSync('editor.htm', 'dist/editor.htm');
