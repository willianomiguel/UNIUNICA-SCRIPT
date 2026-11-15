// Merged into defineApplication({ applicationVariables }) by the integrator (contract rule 4).
const VENDAS_APPLICATION_VARIABLES = {
  STRIPE_WEBHOOK_SECRET: {
    universalIdentifier: '243099a9-fd3e-45ed-b6da-7746d3e1d964',
    label: 'Stripe — segredo do webhook',
    description: 'Signing secret do endpoint de webhook na Stripe (whsec_...). Sem ele o webhook da Stripe é recusado.',
    isSecret: true,
  },
  MERCADO_PAGO_ACCESS_TOKEN: {
    universalIdentifier: '430118d3-41e2-4710-8186-734eaeda635d',
    label: 'Mercado Pago — access token',
    description: 'Access token de produção (APP_USR-...) usado para buscar os detalhes de cada pagamento notificado.',
    isSecret: true,
  },
  MERCADO_PAGO_WEBHOOK_SECRET: {
    universalIdentifier: '2da34fdc-eb1f-4403-8d61-e8724f1ee4ff',
    label: 'Mercado Pago — assinatura secreta (opcional)',
    description: 'Assinatura secreta das notificações Webhooks. Quando preenchida, o cabeçalho x-signature é validado.',
    isSecret: true,
  },
  ASAAS_WEBHOOK_TOKEN: {
    universalIdentifier: '77e5f5e3-a603-4d45-9331-06b0e1110cc9',
    label: 'Asaas — token de autenticação do webhook',
    description: 'Mesmo valor do campo "Token de autenticação" do webhook no Asaas (cabeçalho asaas-access-token).',
    isSecret: true,
  },
  PAGARME_WEBHOOK_TOKEN: {
    universalIdentifier: 'fbe90334-f5be-493d-be14-3ea27777a6ef',
    label: 'Pagar.me — token do webhook',
    description: 'Segredo aleatório incluído na URL do webhook cadastrada no Pagar.me (?token=...).',
    isSecret: true,
  },
} as const;

export default VENDAS_APPLICATION_VARIABLES;
