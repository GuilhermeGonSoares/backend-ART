export const messageGroupInitial = (customerName: string): string => {
  return `
  Fala ${customerName}, meu nome é ARTur, seja bem vindo a AdsOX! 
  
  Vou configurar alguns acessos enquanto o gerente de contas do projeto da *${customerName}* 
  chega para te dar os próximos passos, beleza? 🤝 `;
};

export const messageGroupDrive = (link: string): string => {
  return `
  Pronto, o Google Drive desse projeto está configurado! 🎉

  *Acesse pelo link abaixo:*
  ${link}
  
  Use sem moderação, se quiser ja subir os materiais da empresa nas pastas, fique à vontade!`;
};

export const messageGroupCalendly = (customerName: string): string => {
  return `
  Pra iniciar, é uma boa agendarmos uma call de apresentação, 
  tanto pra gente conhecer melhor a *${customerName}*, quanto para passarmos as próximas etapas do processo, 
  que tal? 😉

  Para agendar nosso papo, basta clicar no link abaixo e escolher a melhor data e hora pra ti!

  Link da Agenda:
  www.calendly.com/linkdaadsox

  Enviamos uma confirmação 30 minutos antes da call com o link pelo SMS. 
  `;
};
