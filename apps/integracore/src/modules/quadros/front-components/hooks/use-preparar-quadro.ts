import { useEffect, useState } from 'react';
import { RestApiClient } from 'integra-client-sdk/rest';

import { cenaDoConteudoLegado } from 'src/modules/quadros/utils/cena-do-conteudo-legado.util';
import { normalizarCenaQuadro } from 'src/modules/quadros/utils/normalizar-cena-quadro.util';
import { normalizarConteudoQuadro } from 'src/modules/quadros/utils/normalizar-conteudo-quadro.util';

export type PreparoQuadro = { tipo: 'carregando' } | { tipo: 'erro'; mensagem: string } | { tipo: 'pronto' };

const registroDaResposta = (resposta: unknown): Record<string, unknown> | null => {
  const data = (resposta as { data?: Record<string, unknown> } | null)?.data;
  const registro = data && typeof data === 'object' ? Object.values(data)[0] : null;

  return registro && typeof registro === 'object' ? (registro as Record<string, unknown>) : null;
};

// Quadro de antes do Excalidraw: grava a cena convertida uma vez, antes de abrir o editor.
export const usePrepararQuadro = (recordId: string | null): PreparoQuadro => {
  const [preparo, setPreparo] = useState<PreparoQuadro>({ tipo: 'carregando' });

  useEffect(() => {
    if (recordId === null) {
      setPreparo({ tipo: 'erro', mensagem: 'Abra o quadro pela página do registro.' });

      return;
    }

    let ativo = true;
    const cliente = new RestApiClient();

    const preparar = async () => {
      const registro = registroDaResposta(await cliente.get(`/rest/quadros/${recordId}`, { query: { depth: 0 } }));

      if (registro === null) {
        throw new Error('Quadro não encontrado.');
      }

      const legado = normalizarConteudoQuadro(registro.conteudo);

      if (normalizarCenaQuadro(registro.cena) === null && legado.elementos.length > 0) {
        const cena = cenaDoConteudoLegado(legado, { agora: Date.now(), aleatorio: Math.random });

        await cliente.patch(`/rest/quadros/${recordId}`, { cena });
      }
    };

    setPreparo({ tipo: 'carregando' });
    preparar()
      .then(() => ativo && setPreparo({ tipo: 'pronto' }))
      .catch((erro: unknown) => {
        if (ativo) {
          setPreparo({
            tipo: 'erro',
            mensagem: erro instanceof Error && erro.message === 'Quadro não encontrado.' ? erro.message : 'Não foi possível abrir o quadro.',
          });
        }
      });

    return () => {
      ativo = false;
    };
  }, [recordId]);

  return preparo;
};
