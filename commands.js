// Mensaguem de Inicio
const welcomeMessage = `
╔════════════════════════════════════════════════════════╗
║    ROBCO INDUSTRIES (TM) TERMLINK PROTOCOL             ║
║    Bem-vindo ao Terminal New Vegas                     ║
╚════════════════════════════════════════════════════════╝

Sistema inicializado com sucesso.
Digite 'help' para ver os comandos disponíveis.
`;

// Comandos Sistema
const commands = {
    help: {
        description: 'Mostra todos os comandos disponíveis',
        execute: () => {
            return `
╔════════════════════════════════════════════════════════╗
║           COMANDOS DISPONÍVEIS                         ║
╚════════════════════════════════════════════════════════╝

  help         - Mostra esta lista de comandos
  version      - Versão atual do sistema
  clear        - Limpa o ecrã do terminal
  history      - Mostra o histórico de comandos
  time         - Mostra a data e hora atual
  echo         - Repete o texto que escreves
  about        - Informação sobre este terminal
  
Digite um comando e pressione ENTER para executar.
            `.trim();
        }
    },

//Atenção as datas e versões (especificas)
version: {
        description: 'Versão do sistema',
        execute: () => {
            return `
ROBCO Industries (TM) Termlink Protocol
Version 1.0.0 - New Vegas Edition
Build Date: November 2025
System Status: ONLINE
            `.trim();
        }
    },

clear: {
        description: 'Limpa o terminal',
        execute: () => {
            return null;
        }
    },

//Verificar se esta como ele quer
history: {
        description: 'Mostra histórico de comandos',
        execute: () => {
            const history = JSON.parse(localStorage.getItem('terminalHistory') || '[]');
            if (history.length === 0) {
                return 'Histórico vazio.';
            }
            return 'HISTÓRICO DE COMANDOS:\n' + 
                   history.map((cmd, i) => `  ${i + 1}. ${cmd}`).join('\n');
        }
    },

time: {
        description: 'Mostra data e hora',
        execute: () => {
            const now = new Date();
            return `
DATA/HORA DO SISTEMA:
  Data: ${now.toLocaleDateString('pt-BR')}
  Hora: ${now.toLocaleTimeString('pt-BR')}
            `.trim();
        }
    },

echo: {
        description: 'Repete o texto',
        execute: (args) => {
            return args.length > 0 ? args.join(' ') : 'Uso: echo <mensagem>';
        }
    },


// Adicionar mais informação
about: {
        description: 'Sobre este terminal',
        execute: () => {
            return `
╔════════════════════════════════════════════════════════╗
║         ROBCO INDUSTRIES TERMLINK v1.0                 ║
╚════════════════════════════════════════════════════════╝

Terminal operacional de Robco Industries (TM)

...

            `.trim();
        }
    },

};
