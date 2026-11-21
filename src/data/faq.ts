export type FaqItem = {
  question: string;
  answer: string;
};

export const faqItems: readonly FaqItem[] = [
  {
    question: 'Quanto tempo leva para desenvolver um projeto?',
    answer:
      'Depende do escopo. Uma landing page de alta conversão costuma sair em 1 a 2 semanas. Um sistema web completo, entre 4 e 12 semanas, sempre com entregas parciais a cada sprint para você acompanhar a evolução desde o início — não existe caixa-preta.',
  },
  {
    question: 'Como funciona o orçamento?',
    answer:
      'Depois de uma conversa inicial, envio uma proposta com escopo detalhado, prazo e valor fechado. Sem surpresa no meio do caminho: mudanças de escopo são discutidas e aprovadas antes de serem executadas.',
  },
  {
    question: 'Você usa IA para escrever o código? Isso afeta a qualidade?',
    answer:
      'Uso IA como ferramenta de engenharia — para acelerar tarefas repetitivas, gerar testes, revisar código e explorar alternativas de arquitetura. Cada linha que vai para produção passa por revisão humana, testes e minha responsabilidade técnica. O resultado prático é entrega mais rápida com mais cobertura de testes, não o contrário.',
  },
  {
    question: 'Você trabalha com contrato e nota fiscal?',
    answer:
      'Sim. Todo projeto tem contrato com escopo, prazos, formas de pagamento e cláusula de propriedade intelectual: o código é seu ao final da entrega.',
  },
  {
    question: 'O que acontece depois que o projeto é entregue?',
    answer:
      'Você recebe o código, a documentação e o deploy funcionando. Ofereço 30 dias de garantia para correção de bugs e, se quiser, um plano de manutenção mensal com evolução contínua e suporte.',
  },
  {
    question: 'Você atende empresas de fora da Bahia?',
    answer:
      'Atendo 100% remoto, para todo o Brasil e para clientes no exterior. Reuniões por Google Meet ou Zoom e acompanhamento diário por WhatsApp, Slack ou o canal que a sua equipe já usa.',
  },
];
