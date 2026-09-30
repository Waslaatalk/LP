(function (global) {
  "use strict";

  var LANG_KEY = "waslaa_locale_v1";
  var LANG_MANUAL_KEY = "waslaa_locale_manual_v1";
  var LOCALES = ["pt-BR", "es-CL", "en-US"];
  var DEFAULT_LOCALE = "pt-BR";

  /**
   * Base dos arquivos do artefato (…/files/ no preview e no /pv/:token).
   * Capturada no load do i18n.js para que paths relativos de imagem
   * não quebrem quando a página pública é servida em /pv/:token (sem <base>).
   */
  var FILES_BASE = (function () {
    var script = document.currentScript;
    if (script && script.src) {
      return script.src.replace(/[^/]+(\?.*)?(?:#.*)?$/, "");
    }
    var nodes = document.getElementsByTagName("script");
    for (var i = nodes.length - 1; i >= 0; i--) {
      var src = nodes[i].src || "";
      if (/\/(?:i18n|script)\.js(?:\?|#|$)/i.test(src)) {
        return src.replace(/[^/]+(\?.*)?(?:#.*)?$/, "");
      }
    }
    try {
      return new URL(".", document.baseURI).href;
    } catch (err) {
      return "";
    }
  })();

  function isAbsoluteAssetRef(ref) {
    if (!ref) return false;
    var t = String(ref).trim();
    return (
      /^(https?:|data:|blob:|\/\/)/i.test(t) ||
      t.charAt(0) === "/" ||
      /^[a-z]+:/i.test(t)
    );
  }

  function assetUrl(rel) {
    if (!rel) return rel;
    var s = String(rel).trim();
    if (!s || isAbsoluteAssetRef(s)) return s;
    s = s.replace(/^\.\//, "");
    try {
      return new URL(s, FILES_BASE || document.baseURI).href;
    } catch (err) {
      return s;
    }
  }

  function fixRelativeImageSrcs() {
    document.querySelectorAll("img[src]").forEach(function (el) {
      var src = el.getAttribute("src");
      if (!src || isAbsoluteAssetRef(src)) return;
      el.setAttribute("src", assetUrl(src));
    });
  }

  var images = {
    "pt-BR": {
      hero: "assets/hero-waslaa.jpg",
      camada: "assets/camada-waslaa-prisma.png",
      streaming: "assets/segmento-streaming-curso.jpg",
      mensageria: "assets/modulo-mensageria.jpg",
      mobilidade: "assets/modulo-mobilidade.png"
    },
    "es-CL": {
      hero: "assets/hero-waslaa-es-CL.jpg",
      camada: "assets/camada-waslaa-prisma-es-CL.jpg",
      streaming: "assets/segmento-streaming-curso-es-CL.jpg",
      mensageria: "assets/modulo-mensageria-es-CL.jpg",
      mobilidade: "assets/modulo-mobilidade-es-CL.jpg"
    },
    "en-US": {
      hero: "assets/hero-waslaa-en-US.jpg",
      camada: "assets/camada-waslaa-prisma-en-US.jpg",
      streaming: "assets/segmento-streaming-curso-en-US.jpg",
      mensageria: "assets/modulo-mensageria-en-US.jpg",
      mobilidade: "assets/modulo-mobilidade-en-US.jpg"
    }
  };

  var messages = {
    "pt-BR": {
      meta: {
        title: "Waslaa — Informação Acessível em Tempo Real",
        description:
          "Waslaa — recebe informações de diferentes canais e as transforma em experiências acessíveis em tempo real."
      },
      a11y: {
        skip: "Ir para o conteúdo",
        brandHome: "Waslaa — início",
        brandFooter: "Waslaa — voltar ao início",
        openMenu: "Abrir menu",
        closeMenu: "Fechar menu",
        mainNav: "Navegação principal",
        footerNav: "Rodapé",
        footerSupport: "Apoio e parceria",
        corfoSupport: "Projeto apoiado por CORFO e Gobierno de Chile (abre em nova aba)",
        langSwitcher: "Selecionar idioma",
        langPt: "Português",
        langEs: "Español (Chile)",
        langEn: "English (US)",
        themeGroup: "Tema de aparência",
        themeLight: "Claro",
        themeDark: "Escuro",
        themeToLight: "Alternar para tema claro",
        themeToDark: "Alternar para tema escuro",
        toolsGroup: "Ferramentas de acessibilidade",
        textScaleGroup: "Tamanho do texto",
        textDecrease: "Diminuir tamanho do texto",
        textIncrease: "Aumentar tamanho do texto",
        textMin: "Tamanho mínimo do texto atingido",
        textMax: "Tamanho máximo do texto atingido",
        textCurrent: "Tamanho do texto: {percent}%",
        speechGroup: "Leitura em voz alta",
        speechPlay: "Ler conteúdo em voz alta",
        speechPlayShort: "Ler",
        speechPause: "Pausar leitura",
        speechPauseShort: "Pausar",
        speechResume: "Retomar leitura",
        speechResumeShort: "Retomar",
        speechStop: "Interromper leitura",
        speechStopShort: "Parar",
        speechUnavailable: "Leitura em voz alta indisponível neste navegador",
        speechReading: "Lendo o conteúdo da página",
        speechPaused: "Leitura pausada",
        speechDone: "Leitura concluída",
        speechIdle: "",
        close: "Fechar",
        howFlow: "Fluxo da informação pela Waslaa",
        protoDemo: "Demonstração do protótipo",
        heroAlt:
          "Pessoas diversas em composição premium azul-marinho com ondas luminosas ciano e violeta: interpretação em Libras e informação acessível em tempo real.",
        camadaAlt:
          "Ilustração da Camada Waslaa: informação de diferentes canais converge para um prisma translúcido e sai como Libras, legendas, conteúdo visual, áudio e alertas acessíveis.",
        camadaCaption:
          "Informação entra na Waslaa e é transformada em diferentes formas de acesso.",
        streamingAlt:
          "Ambiente de estudo com transmissão ao vivo: legendas, janela de Libras e chat acessível na tela do notebook.",
        mensageriaAlt:
          "Pessoa usando smartphone com mensagens e resposta acessível em vídeo.",
        mobilidadeAlt:
          "Interior de aeronave com assistente virtual anunciando informação acessível: janela de Libras, legendas e passageiros recebendo o aviso.",
        appAlt:
          "Mockup do Waslaa App: smartphone com intérprete de Libras em conversa cotidiana e legenda Vamos nos encontrar na entrada."
      },
      nav: {
        how: "Como funciona",
        modules: "Módulos",
        connect: "Conexões",
        a11y: "Acessibilidade",
        talk: "Converse com a Waslaa",
        privacy: "Privacidade"
      },
      hero: {
        title: "Uma informação. Diferentes experiências acessíveis.",
        lead:
          "A Waslaa conecta informação e contexto para transformar mensagens em orientações acessíveis, adaptadas às necessidades de cada pessoa e ao momento em que a informação importa.",
        ctaSolutions: "Conheça as soluções",
        ctaTalk: "Converse com a Waslaa"
      },
      how: {
        title: "Uma camada de acessibilidade para diferentes canais.",
        lead:
          "Áudio, texto, vídeo, mensagens e dados entram pela Waslaa. A plataforma processa a informação e a entrega em formatos acessíveis de acordo com cada experiência.",
        infoLabel: "Informação",
        inAudio: "Áudio",
        inText: "Texto",
        inVideo: "Vídeo",
        inMessages: "Mensagens",
        inData: "Dados",
        coreDesc: "Processa e entrega",
        outLabel: "Experiência acessível",
        outSign: "Libras",
        outCaptions: "Legendas",
        outVisual: "Conteúdo visual",
        outAudio: "Áudio",
        outAlerts: "Alertas acessíveis"
      },
      modules: {
        title: "Uma plataforma. Diferentes formas de acesso.",
        apiStatus: "Disponível",
        apiTitle: "Leve acessibilidade para dentro do seu produto.",
        apiDesc:
          "Para streaming, cursos online, aplicativos, atendimento e plataformas digitais.",
        apiTest: "Experimente nosso protótipo em Libras",
        apiProto: "Teste nosso protótipo",
        apiIntegrate: "Fale sobre integração",
        msgStatus: "Disponível para testes",
        msgTitle: "Acessibilidade nos canais que as pessoas já usam.",
        msgDesc:
          "Mensageria para comunicação, atendimento e geração de conteúdos acessíveis.",
        msgTest: "Teste nossa mensageria",
        mobStatus: "Em desenvolvimento",
        mobDesc:
          "Informação acessível para transporte, estações, aeroportos e ambientes de alto fluxo.",
        appStatus: "Visão futura",
        appChrome: "Conversa ao vivo",
        appCaption: "Vamos nos encontrar na entrada.",
        appDesc:
          "Uma experiência móvel para tornar conversas e informações do cotidiano mais acessíveis."
      },
      connect: {
        title: "Onde a Waslaa se conecta",
        lead: "A mesma infraestrutura pode atender diferentes contextos.",
        eduTitle: "Educação",
        eduDesc: "Cursos, aulas e conteúdos digitais.",
        supportTitle: "Atendimento",
        supportDesc: "Serviços e comunicação com clientes.",
        streamTitle: "Streaming e eventos",
        streamDesc: "Conteúdo ao vivo ou sob demanda.",
        mobTitle: "Mobilidade",
        mobDesc: "Avisos, rotas e informação operacional.",
        appsTitle: "Aplicativos",
        appsDesc: "Acessibilidade integrada a produtos digitais.",
        cta: "Quero explorar um caso de uso"
      },
      law: {
        title: "Acessibilidade também é um direito.",
        lead:
          "Brasil, Chile e Estados Unidos possuem marcos legais que reconhecem o acesso à informação, à comunicação e às línguas de sinais como parte da inclusão. Referências internacionais complementam esse panorama com princípios e diretrizes técnicas de acessibilidade.",
        brTitle: "Brasil",
        br1: "Lei Brasileira de Inclusão — Lei 13.146/2015",
        br2: "Lei de Libras — Lei 10.436/2002",
        clTitle: "Chile",
        cl1: "Lei 20.422 — Igualdade de oportunidades e inclusão",
        cl2: "Lei 21.303 — Reconhecimento da Língua de Sinais Chilena",
        usTitle: "Estados Unidos",
        us1: "Americans with Disabilities Act (ADA) — em especial os Títulos II e III, sobre acesso a serviços e comunicação",
        us2: "Rehabilitation Act — Seções 504 e 508; a Seção 508 vincula-se à acessibilidade de tecnologia e informação no governo federal",
        intTitle: "Internacional",
        int1: "Convenção da ONU sobre os Direitos das Pessoas com Deficiência (CRPD/CDPD) — arts. 9 (acessibilidade) e 21 (liberdade de expressão, opinião e acesso à informação)",
        int2: "WCAG — diretriz técnica internacional de acessibilidade digital (padrão técnico, não legislação)",
        close:
          "A Waslaa transforma princípios de acessibilidade e referências regulatórias em experiências de comunicação mais inclusivas, considerando boas práticas e diretrizes aplicáveis em cada contexto."
      },
      cta: {
        title: "Onde existe informação, pode existir mais acesso.",
        lead: "Quer tornar seu produto, conteúdo ou canal mais acessível?",
        talk: "Converse com a Waslaa"
      },
      footer: {
        tagline: "Informação acessível, no momento em que importa.",
        copy: "© {year} Waslaa. Mockup interativo para demonstração.",
        corfoSupport: "Projeto apoiado por"
      },
      form: {
        leadDefault:
          "Conte o contexto da sua organização. Neste mockup, o contato fica salvo apenas neste navegador.",
        nome: "Nome completo",
        nomePh: "Seu nome",
        nomeErr: "Informe seu nome.",
        email: "E-mail profissional",
        emailPh: "voce@organizacao.com",
        emailErr: "Informe um e-mail válido.",
        org: "Organização",
        orgPh: "Empresa, órgão ou iniciativa",
        segment: "Segmento de interesse",
        segmentPh: "Selecione",
        segEdu: "Educação",
        segSupport: "Atendimento",
        segStream: "Streaming e eventos",
        segMob: "Mobilidade",
        segApps: "Aplicativos",
        segApi: "Waslaa API",
        segMsg: "Waslaa Mensagens",
        segOther: "Outro",
        message: "Mensagem",
        messagePh:
          "Em que contexto a informação precisa chegar de forma acessível?",
        messageErr: "Descreva brevemente o contexto.",
        submit: "Enviar mensagem",
        cancel: "Cancelar",
        successTitle: "Mensagem registrada",
        successBody:
          "Obrigado, {nome}. Registramos sua solicitação (“{intent}”) neste navegador. Em um produto real, nossa equipe retornaria pelo e-mail {email}.",
        viewLeads: "Ver contatos salvos neste navegador",
        close: "Fechar",
        prefixIntegrate: "Gostaria de integrar a Waslaa. Contexto: ",
        prefixCase: "Quero explorar um caso de uso. Contexto: ",
        prefixA11y: "Quero conversar sobre acessibilidade. Contexto: ",
        prefixTalk: "Contexto: "
      },
      intents: {
        conversa: {
          title: "Converse com a Waslaa",
          lead:
            "Conte o contexto da sua organização. Neste mockup, o contato fica salvo apenas neste navegador."
        },
        integrar: {
          title: "Fale sobre integração",
          lead:
            "Descreva canais e sistemas a conectar. A Waslaa API está disponível para integração em produtos digitais."
        },
        caso: {
          title: "Explorar um caso de uso",
          lead:
            "Conte o contexto em que a informação precisa chegar de forma acessível. Vamos explorar juntos."
        },
        acessibilidade: {
          title: "Falar sobre acessibilidade",
          lead: "Vamos conversar sobre acesso à informação no seu contexto."
        }
      },
      proto: {
        title: "Protótipo Waslaa API",
        lead:
          "Demonstração do fluxo disponível: a informação entra e sai em formato acessível.",
        inputLabel: "Entrada",
        inputSample:
          "“O módulo começa em cinco minutos. Acesse a sala virtual.”",
        outputLabel: "Saída acessível",
        outCaption: "Legenda",
        outCaptionDesc: " — texto sincronizado",
        outSign: "Libras",
        outSignDesc: " — janela de interpretação",
        outAudio: "Áudio",
        outAudioDesc: " — versão contextual",
        close: "Fechar",
        testApi: "Experimente nosso protótipo em Libras",
        integrate: "Fale sobre integração"
      },
      msg: {
        title: "Teste a mensageria Waslaa",
        lead:
          "Disponível para testes no WhatsApp e no Telegram — canais que as pessoas já usam.",
        waDesc:
          "Envie áudio ou texto e receba conteúdo acessível no mesmo chat.",
        tgDesc: "Mesma experiência no canal que sua equipe já utiliza.",
        previewMeta: " · conversa de demonstração",
        waIn: "Áudio · 0:12 — “A aula de hoje começa às 19h.”",
        waOut: "Waslaa · vídeo em Libras + legenda enviados",
        tgIn: "Texto — “Mudança de horário: a sessão começa às 15h.”",
        tgOut: "Waslaa · legenda + vídeo acessível entregues no Telegram",
        close: "Fechar",
        talk: "Falar sobre mensageria"
      },
      privacy: {
        title: "Princípios de privacidade",
        p1:
          "A Waslaa trata acessibilidade como direito de acesso à informação. Neste mockup, formulários são salvos apenas no localStorage do seu navegador — nenhum dado é enviado a um servidor.",
        h3: "Na visão do produto",
        li1: "Finalidade limitada: processar e entregar experiências acessíveis.",
        li2: "Minimização: apenas o necessário para o serviço contratado.",
        li3: "Sem comercialização de dados pessoais de usuários finais.",
        li4:
          "Controles claros para organizações integradoras sobre retenção e exclusão.",
        li5: "Transparência sobre o status de cada módulo e canal.",
        p2:
          "Documentação jurídica completa será publicada com os primeiros contratos comerciais.",
        ok: "Entendi"
      },
      leads: {
        title: "Contatos neste navegador",
        lead: "Dados de demonstração persistidos via localStorage.",
        empty:
          "Nenhum item ainda. Envie um formulário de contato para ver os registros locais aqui.",
        clear: "Limpar dados locais",
        close: "Fechar",
        confirmClear: "Remover todos os contatos salvos neste navegador?",
        fallbackIntent: "Contato Waslaa"
      }
    },

    "es-CL": {
      meta: {
        title: "Waslaa — Información Accesible en Tiempo Real",
        description:
          "Waslaa — recibe información de distintos canales y la transforma en experiencias accesibles en tiempo real."
      },
      a11y: {
        skip: "Ir al contenido",
        brandHome: "Waslaa — inicio",
        brandFooter: "Waslaa — volver al inicio",
        openMenu: "Abrir menú",
        closeMenu: "Cerrar menú",
        mainNav: "Navegación principal",
        footerNav: "Pie de página",
        footerSupport: "Apoyo y alianza",
        corfoSupport: "Proyecto apoyado por CORFO y Gobierno de Chile (se abre en una nueva pestaña)",
        langSwitcher: "Seleccionar idioma",
        langPt: "Português",
        langEs: "Español (Chile)",
        langEn: "English (US)",
        themeGroup: "Tema de apariencia",
        themeLight: "Claro",
        themeDark: "Oscuro",
        themeToLight: "Cambiar a tema claro",
        themeToDark: "Cambiar a tema oscuro",
        toolsGroup: "Herramientas de accesibilidad",
        textScaleGroup: "Tamaño del texto",
        textDecrease: "Disminuir tamaño del texto",
        textIncrease: "Aumentar tamaño del texto",
        textMin: "Tamaño mínimo del texto alcanzado",
        textMax: "Tamaño máximo del texto alcanzado",
        textCurrent: "Tamaño del texto: {percent}%",
        speechGroup: "Lectura en voz alta",
        speechPlay: "Leer el contenido en voz alta",
        speechPlayShort: "Leer",
        speechPause: "Pausar lectura",
        speechPauseShort: "Pausar",
        speechResume: "Reanudar lectura",
        speechResumeShort: "Reanudar",
        speechStop: "Detener lectura",
        speechStopShort: "Parar",
        speechUnavailable: "Lectura en voz alta no disponible en este navegador",
        speechReading: "Leyendo el contenido de la página",
        speechPaused: "Lectura en pausa",
        speechDone: "Lectura finalizada",
        speechIdle: "",
        close: "Cerrar",
        howFlow: "Flujo de la información por Waslaa",
        protoDemo: "Demostración del prototipo",
        heroAlt:
          "Personas diversas en composición premium azul marino con ondas luminosas cian y violeta: interpretación en LSCh e información accesible en tiempo real.",
        camadaAlt:
          "Ilustración de la Capa Waslaa: información de distintos canales converge en un prisma translúcido y sale como LSCh, subtítulos, contenido visual, audio y alertas accesibles.",
        camadaCaption:
          "La información entra en Waslaa y se transforma en distintas formas de acceso.",
        streamingAlt:
          "Entorno de estudio con transmisión en vivo: subtítulos, ventana de LSCh y chat accesible en la pantalla del notebook.",
        mensageriaAlt:
          "Persona usando un smartphone con mensajes y respuesta accesible en video.",
        mobilidadeAlt:
          "Interior de aeronave con asistente virtual anunciando información accesible: ventana de LSCh, subtítulos y pasajeros recibiendo el aviso.",
        appAlt:
          "Mockup de Waslaa App: smartphone con intérprete de LSCh en conversación cotidiana y subtítulo Vamos a encontrarnos en la entrada."
      },
      nav: {
        how: "Cómo funciona",
        modules: "Módulos",
        connect: "Conexiones",
        a11y: "Accesibilidad",
        talk: "Conversemos con Waslaa",
        privacy: "Privacidad"
      },
      hero: {
        title: "Una información. Distintas experiencias accesibles.",
        lead:
          "Waslaa conecta información y contexto para transformar mensajes en orientaciones accesibles, adaptadas a las necesidades de cada persona y al momento en que la información importa.",
        ctaSolutions: "Conoce las soluciones",
        ctaTalk: "Conversemos con Waslaa"
      },
      how: {
        title: "Una capa de accesibilidad para distintos canales.",
        lead:
          "Audio, texto, video, mensajes y datos entran por Waslaa. La plataforma procesa la información y la entrega en formatos accesibles según cada experiencia.",
        infoLabel: "Información",
        inAudio: "Audio",
        inText: "Texto",
        inVideo: "Video",
        inMessages: "Mensajes",
        inData: "Datos",
        coreDesc: "Procesa y entrega",
        outLabel: "Experiencia accesible",
        outSign: "LSCh",
        outCaptions: "Subtítulos",
        outVisual: "Contenido visual",
        outAudio: "Audio",
        outAlerts: "Alertas accesibles"
      },
      modules: {
        title: "Una plataforma. Distintas formas de acceso.",
        apiStatus: "Disponible",
        apiTitle: "Lleva la accesibilidad dentro de tu producto.",
        apiDesc:
          "Para streaming, cursos online, aplicaciones, atención y plataformas digitales.",
        apiTest: "Prueba nuestro prototipo en Libras",
        apiProto: "Prueba nuestro prototipo",
        apiIntegrate: "Hablar sobre integración",
        msgStatus: "Disponible para pruebas",
        msgTitle: "Accesibilidad en los canales que las personas ya usan.",
        msgDesc:
          "Mensajería para comunicación, atención y generación de contenidos accesibles.",
        msgTest: "Prueba nuestra mensajería",
        mobStatus: "En desarrollo",
        mobDesc:
          "Información accesible para transporte, estaciones, aeropuertos y entornos de alto flujo.",
        appStatus: "Visión futura",
        appChrome: "Conversación en vivo",
        appCaption: "Vamos a encontrarnos en la entrada.",
        appDesc:
          "Una experiencia móvil para hacer más accesibles las conversaciones y la información cotidiana."
      },
      connect: {
        title: "Dónde se conecta Waslaa",
        lead: "La misma infraestructura puede atender distintos contextos.",
        eduTitle: "Educación",
        eduDesc: "Cursos, clases y contenidos digitales.",
        supportTitle: "Atención",
        supportDesc: "Servicios y comunicación con clientes.",
        streamTitle: "Streaming y eventos",
        streamDesc: "Contenido en vivo o bajo demanda.",
        mobTitle: "Movilidad",
        mobDesc: "Avisos, rutas e información operacional.",
        appsTitle: "Aplicaciones",
        appsDesc: "Accesibilidad integrada a productos digitales.",
        cta: "Quiero explorar un caso de uso"
      },
      law: {
        title: "La accesibilidad también es un derecho.",
        lead:
          "Brasil, Chile y Estados Unidos cuentan con marcos legales que reconocen el acceso a la información, a la comunicación y a las lenguas de señas como parte de la inclusión. Referencias internacionales complementan este panorama con principios y directrices técnicas de accesibilidad.",
        brTitle: "Brasil",
        br1: "Ley Brasileña de Inclusión — Ley 13.146/2015",
        br2: "Ley de Libras — Ley 10.436/2002",
        clTitle: "Chile",
        cl1: "Ley 20.422 — Igualdad de oportunidades e inclusión",
        cl2: "Ley 21.303 — Reconocimiento de la Lengua de Señas Chilena",
        usTitle: "Estados Unidos",
        us1: "Americans with Disabilities Act (ADA) — en especial los Títulos II y III, sobre acceso a servicios y comunicación",
        us2: "Rehabilitation Act — Secciones 504 y 508; la Sección 508 se vincula a la accesibilidad de tecnología e información en el gobierno federal",
        intTitle: "Internacional",
        int1: "Convención de la ONU sobre los Derechos de las Personas con Discapacidad (CRPD/CDPD) — arts. 9 (accesibilidad) y 21 (libertad de expresión, opinión y acceso a la información)",
        int2: "WCAG — directriz técnica internacional de accesibilidad digital (estándar técnico, no legislación)",
        close:
          "Waslaa transforma principios de accesibilidad y referencias regulatorias en experiencias de comunicación más inclusivas, considerando buenas prácticas y directrices aplicables en cada contexto."
      },
      cta: {
        title: "Donde hay información, puede haber más acceso.",
        lead: "¿Quieres hacer tu producto, contenido o canal más accesible?",
        talk: "Conversemos con Waslaa"
      },
      footer: {
        tagline: "Información accesible, en el momento que importa.",
        copy: "© {year} Waslaa. Mockup interactivo para demostración.",
        corfoSupport: "Proyecto apoyado por"
      },
      form: {
        leadDefault:
          "Cuéntanos el contexto de tu organización. En este mockup, el contacto se guarda solo en este navegador.",
        nome: "Nombre completo",
        nomePh: "Tu nombre",
        nomeErr: "Indica tu nombre.",
        email: "Correo profesional",
        emailPh: "tu@organizacion.com",
        emailErr: "Indica un correo válido.",
        org: "Organización",
        orgPh: "Empresa, organismo o iniciativa",
        segment: "Segmento de interés",
        segmentPh: "Selecciona",
        segEdu: "Educación",
        segSupport: "Atención",
        segStream: "Streaming y eventos",
        segMob: "Movilidad",
        segApps: "Aplicaciones",
        segApi: "Waslaa API",
        segMsg: "Waslaa Mensajes",
        segOther: "Otro",
        message: "Mensaje",
        messagePh:
          "¿En qué contexto la información debe llegar de forma accesible?",
        messageErr: "Describe brevemente el contexto.",
        submit: "Enviar mensaje",
        cancel: "Cancelar",
        successTitle: "Mensaje registrado",
        successBody:
          "Gracias, {nome}. Registramos tu solicitud (“{intent}”) en este navegador. En un producto real, nuestro equipo respondería al correo {email}.",
        viewLeads: "Ver contactos guardados en este navegador",
        close: "Cerrar",
        prefixIntegrate: "Me gustaría integrar Waslaa. Contexto: ",
        prefixCase: "Quiero explorar un caso de uso. Contexto: ",
        prefixA11y: "Quiero conversar sobre accesibilidad. Contexto: ",
        prefixTalk: "Contexto: "
      },
      intents: {
        conversa: {
          title: "Conversemos con Waslaa",
          lead:
            "Cuéntanos el contexto de tu organización. En este mockup, el contacto se guarda solo en este navegador."
        },
        integrar: {
          title: "Hablar sobre integración",
          lead:
            "Describe canales y sistemas a conectar. Waslaa API está disponible para integración en productos digitales."
        },
        caso: {
          title: "Explorar un caso de uso",
          lead:
            "Cuéntanos el contexto en el que la información debe llegar de forma accesible. Exploremos juntos."
        },
        acessibilidade: {
          title: "Hablar sobre accesibilidad",
          lead: "Conversemos sobre el acceso a la información en tu contexto."
        }
      },
      proto: {
        title: "Prototipo Waslaa API",
        lead:
          "Demostración del flujo disponible: la información entra y sale en formato accesible.",
        inputLabel: "Entrada",
        inputSample:
          "“El módulo comienza en cinco minutos. Accede a la sala virtual.”",
        outputLabel: "Salida accesible",
        outCaption: "Subtítulo",
        outCaptionDesc: " — texto sincronizado",
        outSign: "LSCh",
        outSignDesc: " — ventana de interpretación",
        outAudio: "Audio",
        outAudioDesc: " — versión contextual",
        close: "Cerrar",
        testApi: "Prueba nuestro prototipo en Libras",
        integrate: "Hablar sobre integración"
      },
      msg: {
        title: "Prueba la mensajería Waslaa",
        lead:
          "Disponible para pruebas en WhatsApp y Telegram — canales que las personas ya usan.",
        waDesc:
          "Envía audio o texto y recibe contenido accesible en el mismo chat.",
        tgDesc: "La misma experiencia en el canal que tu equipo ya utiliza.",
        previewMeta: " · conversación de demostración",
        waIn: "Audio · 0:12 — “La clase de hoy comienza a las 19 h.”",
        waOut: "Waslaa · video en LSCh + subtítulo enviados",
        tgIn: "Texto — “Cambio de horario: la sesión comienza a las 15 h.”",
        tgOut: "Waslaa · subtítulo + video accesible entregados en Telegram",
        close: "Cerrar",
        talk: "Hablar sobre mensajería"
      },
      privacy: {
        title: "Principios de privacidad",
        p1:
          "Waslaa trata la accesibilidad como derecho de acceso a la información. En este mockup, los formularios se guardan solo en el localStorage de tu navegador — ningún dato se envía a un servidor.",
        h3: "En la visión del producto",
        li1: "Finalidad limitada: procesar y entregar experiencias accesibles.",
        li2: "Minimización: solo lo necesario para el servicio contratado.",
        li3: "Sin comercialización de datos personales de usuarios finales.",
        li4:
          "Controles claros para organizaciones integradoras sobre retención y eliminación.",
        li5: "Transparencia sobre el estado de cada módulo y canal.",
        p2:
          "La documentación jurídica completa se publicará con los primeros contratos comerciales.",
        ok: "Entendido"
      },
      leads: {
        title: "Contactos en este navegador",
        lead: "Datos de demostración persistidos vía localStorage.",
        empty:
          "Ningún elemento aún. Envía un formulario de contacto para ver los registros locales aquí.",
        clear: "Borrar datos locales",
        close: "Cerrar",
        confirmClear: "¿Eliminar todos los contactos guardados en este navegador?",
        fallbackIntent: "Contacto Waslaa"
      }
    },

    "en-US": {
      meta: {
        title: "Waslaa — Accessible Information in Real Time",
        description:
          "Waslaa — receives information from different channels and turns it into accessible experiences in real time."
      },
      a11y: {
        skip: "Skip to content",
        brandHome: "Waslaa — home",
        brandFooter: "Waslaa — back to top",
        openMenu: "Open menu",
        closeMenu: "Close menu",
        mainNav: "Main navigation",
        footerNav: "Footer",
        footerSupport: "Support and partnership",
        corfoSupport: "Project supported by CORFO and Gobierno de Chile (opens in a new tab)",
        langSwitcher: "Select language",
        langPt: "Português",
        langEs: "Español (Chile)",
        langEn: "English (US)",
        themeGroup: "Appearance theme",
        themeLight: "Light",
        themeDark: "Dark",
        themeToLight: "Switch to light theme",
        themeToDark: "Switch to dark theme",
        toolsGroup: "Accessibility tools",
        textScaleGroup: "Text size",
        textDecrease: "Decrease text size",
        textIncrease: "Increase text size",
        textMin: "Minimum text size reached",
        textMax: "Maximum text size reached",
        textCurrent: "Text size: {percent}%",
        speechGroup: "Read aloud",
        speechPlay: "Read page content aloud",
        speechPlayShort: "Read",
        speechPause: "Pause reading",
        speechPauseShort: "Pause",
        speechResume: "Resume reading",
        speechResumeShort: "Resume",
        speechStop: "Stop reading",
        speechStopShort: "Stop",
        speechUnavailable: "Read aloud is unavailable in this browser",
        speechReading: "Reading page content",
        speechPaused: "Reading paused",
        speechDone: "Reading finished",
        speechIdle: "",
        close: "Close",
        howFlow: "Information flow through Waslaa",
        protoDemo: "Prototype demonstration",
        heroAlt:
          "Diverse people in a premium navy composition with cyan and violet light waves: ASL interpretation and accessible information in real time.",
        camadaAlt:
          "Illustration of the Waslaa Layer: information from different channels converges into a translucent prism and exits as ASL, captions, visual content, audio, and accessible alerts.",
        camadaCaption:
          "Information enters Waslaa and is transformed into different forms of access.",
        streamingAlt:
          "Study environment with a live stream: captions, ASL interpreter window, and accessible chat on the laptop screen.",
        mensageriaAlt:
          "Person using a smartphone with messages and an accessible video reply.",
        mobilidadeAlt:
          "Aircraft cabin with a virtual assistant delivering accessible information: ASL window, captions, and passengers receiving the notice.",
        appAlt:
          "Waslaa App mockup: smartphone with an ASL interpreter in everyday conversation and caption Let's meet at the entrance."
      },
      nav: {
        how: "How it works",
        modules: "Modules",
        connect: "Connections",
        a11y: "Accessibility",
        talk: "Talk with Waslaa",
        privacy: "Privacy"
      },
      hero: {
        title: "One piece of information. Different accessible experiences.",
        lead:
          "Waslaa connects information and context to turn messages into accessible guidance, adapted to each person's needs and to the moment when the information matters.",
        ctaSolutions: "Explore the solutions",
        ctaTalk: "Talk with Waslaa"
      },
      how: {
        title: "An accessibility layer for different channels.",
        lead:
          "Audio, text, video, messages, and data enter through Waslaa. The platform processes the information and delivers it in accessible formats for each experience.",
        infoLabel: "Information",
        inAudio: "Audio",
        inText: "Text",
        inVideo: "Video",
        inMessages: "Messages",
        inData: "Data",
        coreDesc: "Processes and delivers",
        outLabel: "Accessible experience",
        outSign: "ASL",
        outCaptions: "Captions",
        outVisual: "Visual content",
        outAudio: "Audio",
        outAlerts: "Accessible alerts"
      },
      modules: {
        title: "One platform. Different ways to access.",
        apiStatus: "Available",
        apiTitle: "Bring accessibility into your product.",
        apiDesc:
          "For streaming, online courses, apps, customer service, and digital platforms.",
        apiTest: "Try our Prototype in Libras",
        apiProto: "Try our prototype",
        apiIntegrate: "Talk about integration",
        msgStatus: "Available for testing",
        msgTitle: "Accessibility in the channels people already use.",
        msgDesc:
          "Messaging for communication, support, and accessible content generation.",
        msgTest: "Try our messaging",
        mobStatus: "In development",
        mobDesc:
          "Accessible information for transit, stations, airports, and high-traffic environments.",
        appStatus: "Future vision",
        appChrome: "Live conversation",
        appCaption: "Let's meet at the entrance.",
        appDesc:
          "A mobile experience to make everyday conversations and information more accessible."
      },
      connect: {
        title: "Where Waslaa connects",
        lead: "The same infrastructure can serve different contexts.",
        eduTitle: "Education",
        eduDesc: "Courses, classes, and digital content.",
        supportTitle: "Customer service",
        supportDesc: "Services and customer communication.",
        streamTitle: "Streaming and events",
        streamDesc: "Live or on-demand content.",
        mobTitle: "Mobility",
        mobDesc: "Announcements, routes, and operational information.",
        appsTitle: "Apps",
        appsDesc: "Accessibility built into digital products.",
        cta: "I want to explore a use case"
      },
      law: {
        title: "Accessibility is also a right.",
        lead:
          "Brazil, Chile, and the United States have legal frameworks that recognize access to information, communication, and sign languages as part of inclusion. International references complement this landscape with principles and technical accessibility guidelines.",
        brTitle: "Brazil",
        br1: "Brazilian Inclusion Law — Law 13.146/2015",
        br2: "Libras Law — Law 10.436/2002",
        clTitle: "Chile",
        cl1: "Law 20.422 — Equal opportunity and inclusion",
        cl2: "Law 21.303 — Recognition of Chilean Sign Language",
        usTitle: "United States",
        us1: "Americans with Disabilities Act (ADA) — especially Titles II and III, covering access to services and communication",
        us2: "Rehabilitation Act — Sections 504 and 508; Section 508 addresses accessibility of technology and information in the federal government",
        intTitle: "International",
        int1: "UN Convention on the Rights of Persons with Disabilities (CRPD) — Articles 9 (accessibility) and 21 (freedom of expression, opinion, and access to information)",
        int2: "WCAG — international technical guideline for digital accessibility (a technical standard, not legislation)",
        close:
          "Waslaa turns accessibility principles and regulatory references into more inclusive communication experiences, taking into account best practices and guidelines applicable in each context."
      },
      cta: {
        title: "Where information exists, more access can exist.",
        lead: "Want to make your product, content, or channel more accessible?",
        talk: "Talk with Waslaa"
      },
      footer: {
        tagline: "Accessible information, when it matters.",
        copy: "© {year} Waslaa. Interactive mockup for demonstration.",
        corfoSupport: "Project supported by"
      },
      form: {
        leadDefault:
          "Tell us about your organization. In this mockup, the contact is saved only in this browser.",
        nome: "Full name",
        nomePh: "Your name",
        nomeErr: "Please enter your name.",
        email: "Work email",
        emailPh: "you@organization.com",
        emailErr: "Please enter a valid email.",
        org: "Organization",
        orgPh: "Company, agency, or initiative",
        segment: "Area of interest",
        segmentPh: "Select",
        segEdu: "Education",
        segSupport: "Customer service",
        segStream: "Streaming and events",
        segMob: "Mobility",
        segApps: "Apps",
        segApi: "Waslaa API",
        segMsg: "Waslaa Messages",
        segOther: "Other",
        message: "Message",
        messagePh:
          "In what context does information need to arrive in an accessible way?",
        messageErr: "Please briefly describe the context.",
        submit: "Send message",
        cancel: "Cancel",
        successTitle: "Message saved",
        successBody:
          "Thank you, {nome}. We recorded your request (“{intent}”) in this browser. In a real product, our team would follow up at {email}.",
        viewLeads: "View contacts saved in this browser",
        close: "Close",
        prefixIntegrate: "I would like to integrate Waslaa. Context: ",
        prefixCase: "I want to explore a use case. Context: ",
        prefixA11y: "I want to talk about accessibility. Context: ",
        prefixTalk: "Context: "
      },
      intents: {
        conversa: {
          title: "Talk with Waslaa",
          lead:
            "Tell us about your organization. In this mockup, the contact is saved only in this browser."
        },
        integrar: {
          title: "Talk about integration",
          lead:
            "Describe the channels and systems to connect. Waslaa API is available for integration into digital products."
        },
        caso: {
          title: "Explore a use case",
          lead:
            "Tell us the context where information needs to arrive in an accessible way. Let's explore it together."
        },
        acessibilidade: {
          title: "Talk about accessibility",
          lead: "Let's talk about access to information in your context."
        }
      },
      proto: {
        title: "Waslaa API prototype",
        lead:
          "Demo of the available flow: information comes in and goes out in an accessible format.",
        inputLabel: "Input",
        inputSample:
          "“The module starts in five minutes. Join the virtual room.”",
        outputLabel: "Accessible output",
        outCaption: "Caption",
        outCaptionDesc: " — synchronized text",
        outSign: "ASL",
        outSignDesc: " — interpretation window",
        outAudio: "Audio",
        outAudioDesc: " — contextual version",
        close: "Close",
        testApi: "Try our Prototype in Libras",
        integrate: "Talk about integration"
      },
      msg: {
        title: "Try Waslaa messaging",
        lead:
          "Available for testing on WhatsApp and Telegram — channels people already use.",
        waDesc:
          "Send audio or text and receive accessible content in the same chat.",
        tgDesc: "The same experience on the channel your team already uses.",
        previewMeta: " · demo conversation",
        waIn: "Audio · 0:12 — “Today’s class starts at 7 p.m.”",
        waOut: "Waslaa · ASL video + caption sent",
        tgIn: "Text — “Schedule change: the session starts at 3 p.m.”",
        tgOut: "Waslaa · caption + accessible video delivered on Telegram",
        close: "Close",
        talk: "Talk about messaging"
      },
      privacy: {
        title: "Privacy principles",
        p1:
          "Waslaa treats accessibility as a right to information access. In this mockup, forms are saved only in your browser’s localStorage — no data is sent to a server.",
        h3: "In the product vision",
        li1: "Limited purpose: process and deliver accessible experiences.",
        li2: "Minimization: only what is needed for the contracted service.",
        li3: "No selling of end users’ personal data.",
        li4:
          "Clear controls for integrating organizations over retention and deletion.",
        li5: "Transparency about the status of each module and channel.",
        p2:
          "Full legal documentation will be published with the first commercial contracts.",
        ok: "Got it"
      },
      leads: {
        title: "Contacts in this browser",
        lead: "Demo data persisted via localStorage.",
        empty:
          "Nothing here yet. Submit a contact form to see local records here.",
        clear: "Clear local data",
        close: "Close",
        confirmClear: "Remove all contacts saved in this browser?",
        fallbackIntent: "Waslaa contact"
      }
    }
  };

  var currentLocale = DEFAULT_LOCALE;
  var listeners = [];

  function isValidLocale(code) {
    return LOCALES.indexOf(code) !== -1;
  }

  function getMessage(locale, path) {
    var parts = path.split(".");
    var node = messages[locale];
    for (var i = 0; i < parts.length; i++) {
      if (!node || typeof node !== "object") return undefined;
      node = node[parts[i]];
    }
    return node;
  }

  function t(path, vars) {
    var value = getMessage(currentLocale, path);
    if (value == null) value = getMessage(DEFAULT_LOCALE, path);
    if (value == null) return path;
    if (typeof value !== "string") return value;
    if (!vars) return value;
    return value.replace(/\{(\w+)\}/g, function (_, key) {
      return vars[key] != null ? String(vars[key]) : "";
    });
  }

  function setText(el, value) {
    if (!el || value == null) return;
    el.textContent = value;
  }

  function applyStaticTexts() {
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (!key) return;
      var value = t(key);
      if (typeof value === "string") setText(el, value);
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-placeholder");
      var value = t(key);
      if (typeof value === "string") el.setAttribute("placeholder", value);
    });

    document.querySelectorAll("[data-i18n-aria-label]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-aria-label");
      var value = t(key);
      if (typeof value === "string") el.setAttribute("aria-label", value);
    });

    document.querySelectorAll("[data-i18n-alt]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-alt");
      var value = t(key);
      if (typeof value === "string") el.setAttribute("alt", value);
    });

    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-html");
      var value = t(key);
      if (typeof value === "string") el.innerHTML = value;
    });
  }

  function applyMeta() {
    document.documentElement.lang = currentLocale;
    document.title = t("meta.title");
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", t("meta.description"));
  }

  function bindImageFallback(el, key) {
    if (!el || !key) return;
    el.onerror = function () {
      var fallbackRel =
        (images[DEFAULT_LOCALE] && images[DEFAULT_LOCALE][key]) ||
        el.getAttribute("data-i18n-img-fallback") ||
        "";
      if (!fallbackRel) {
        el.onerror = null;
        return;
      }
      var fallbackSrc = assetUrl(fallbackRel);
      var currentSrc = el.getAttribute("src") || "";
      el.onerror = null;
      if (fallbackSrc && fallbackSrc !== currentSrc) {
        el.setAttribute("src", fallbackSrc);
      }
    };
  }

  function applyImages() {
    var map = images[currentLocale] || images[DEFAULT_LOCALE];
    var fallbackMap = images[DEFAULT_LOCALE] || {};
    document.querySelectorAll("[data-i18n-img]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-img");
      if (!key) return;
      var rel = (map && map[key]) || fallbackMap[key];
      if (!rel) return;
      el.setAttribute("src", assetUrl(rel));
      bindImageFallback(el, key);
    });
    fixRelativeImageSrcs();
  }

  function applyLangSwitcher() {
    var group = document.querySelector("[data-lang-switcher]");
    if (group) {
      group.setAttribute("aria-label", t("a11y.langSwitcher"));
    }
    document.querySelectorAll("[data-set-lang]").forEach(function (btn) {
      var code = btn.getAttribute("data-set-lang");
      var pressed = code === currentLocale;
      btn.setAttribute("aria-pressed", pressed ? "true" : "false");
      btn.classList.toggle("is-active", pressed);
      if (code === "pt-BR") btn.setAttribute("aria-label", t("a11y.langPt"));
      if (code === "es-CL") btn.setAttribute("aria-label", t("a11y.langEs"));
      if (code === "en-US") btn.setAttribute("aria-label", t("a11y.langEn"));
    });
  }

  function applyFooterCopy() {
    var copy = document.querySelector("[data-i18n-footer-copy]");
    if (!copy) return;
    var year = new Date().getFullYear();
    copy.textContent = t("footer.copy", { year: year });
  }

  function applyLocale(locale, options) {
    options = options || {};
    if (!isValidLocale(locale)) locale = DEFAULT_LOCALE;
    currentLocale = locale;
    if (options.persist !== false) {
      try {
        localStorage.setItem(LANG_KEY, locale);
        if (options.manual) {
          localStorage.setItem(LANG_MANUAL_KEY, "1");
        }
      } catch (err) {
        /* ignore quota / private mode */
      }
    }
    applyMeta();
    applyStaticTexts();
    applyImages();
    applyLangSwitcher();
    applyFooterCopy();
    listeners.forEach(function (fn) {
      try {
        fn(currentLocale);
      } catch (err) {
        /* keep applying */
      }
    });
  }

  function readStoredLocale() {
    try {
      var stored = localStorage.getItem(LANG_KEY);
      if (isValidLocale(stored)) return stored;
    } catch (err) {
      /* ignore */
    }
    return null;
  }

  function hasManualChoice() {
    try {
      return localStorage.getItem(LANG_MANUAL_KEY) === "1";
    } catch (err) {
      return false;
    }
  }

  function localeFromCountry(country) {
    var code = String(country || "").toUpperCase();
    if (code === "CL") return "es-CL";
    if (code === "US") return "en-US";
    return DEFAULT_LOCALE;
  }

  function fetchCountry(url, parser, timeoutMs) {
    var controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    var timer = setTimeout(function () {
      if (controller) controller.abort();
    }, timeoutMs || 3500);

    return fetch(url, {
      signal: controller ? controller.signal : undefined,
      credentials: "omit",
      cache: "no-store"
    })
      .then(function (res) {
        if (!res.ok) throw new Error("geo http " + res.status);
        return res.json();
      })
      .then(function (data) {
        var country = parser(data);
        if (!country) throw new Error("geo empty");
        return country;
      })
      .finally(function () {
        clearTimeout(timer);
      });
  }

  function detectLocaleByIp() {
    var sources = [
      {
        url: "https://ipapi.co/json/",
        parse: function (data) {
          return data && data.country_code;
        }
      },
      {
        url: "https://ipwho.is/",
        parse: function (data) {
          return data && data.success !== false && data.country_code;
        }
      },
      {
        url: "https://get.geojs.io/v1/ip/country.json",
        parse: function (data) {
          return data && (data.country || data.country_code);
        }
      }
    ];

    function tryAt(index) {
      if (index >= sources.length) {
        return Promise.resolve(DEFAULT_LOCALE);
      }
      var source = sources[index];
      return fetchCountry(source.url, source.parse, 3500)
        .then(function (country) {
          return localeFromCountry(country);
        })
        .catch(function () {
          return tryAt(index + 1);
        });
    }

    return tryAt(0);
  }

  function initLangSwitcher() {
    document.addEventListener("click", function (event) {
      var btn = event.target.closest("[data-set-lang]");
      if (!btn) return;
      var code = btn.getAttribute("data-set-lang");
      if (!isValidLocale(code)) return;
      applyLocale(code, { manual: true, persist: true });
    });
  }

  function bootstrap() {
    initLangSwitcher();

    var stored = readStoredLocale();
    if (stored) {
      applyLocale(stored, { persist: false });
      return Promise.resolve(stored);
    }

    applyLocale(DEFAULT_LOCALE, { persist: false });

    return detectLocaleByIp().then(function (detected) {
      if (hasManualChoice() || readStoredLocale()) {
        return readStoredLocale() || detected;
      }
      applyLocale(detected, { persist: true, manual: false });
      return detected;
    });
  }

  function onChange(fn) {
    if (typeof fn === "function") listeners.push(fn);
  }

  global.WaslaaI18n = {
    LOCALES: LOCALES,
    DEFAULT_LOCALE: DEFAULT_LOCALE,
    messages: messages,
    images: images,
    assetUrl: assetUrl,
    t: t,
    getLocale: function () {
      return currentLocale;
    },
    setLocale: function (locale, manual) {
      applyLocale(locale, { persist: true, manual: !!manual });
    },
    applyLocale: applyLocale,
    bootstrap: bootstrap,
    onChange: onChange,
    hasManualChoice: hasManualChoice
  };

  /* Corrige imgs relativas assim que o script carrega (antes do bootstrap). */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fixRelativeImageSrcs);
  } else {
    fixRelativeImageSrcs();
  }
})(window);
