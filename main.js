const output = document.getElementById('output');
const input = document.getElementById('input');
const terminal = document.getElementById('terminal');
const cursor = document.querySelector('.cursor');
const customCursor = document.getElementById('custom-cursor');

// Texto Som //
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playKeySound() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 500;
    oscillator.type = 'triangle';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.0001);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.05);
}

// Processar comando //
function processCommand(cmd) {
    cmd = cmd.trim();
    if (!cmd) return;

    addOutput(`> ${cmd}`, 'command-line');

    // Comando Histórico //
    commandHistory.push(cmd);
    if (commandHistory.length > 50) {
        commandHistory.shift();
    }
    saveHistory();
    historyIndex = commandHistory.length;

    const parts = cmd.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Executar //
    if (commands[command]) {
        if (command === 'clear') {
            clearTerminal();
        } else if (command === 'clearstorage') {
            const result = commands[command].execute(args);
            addOutput(result, 'info');
            setTimeout(() => {
                location.reload();
            }, 2000);
        } else if (command === 'exit') {
            const result = commands[command].execute(args);
            addOutput(result, 'info');
            setTimeout(() => {
                if (confirm('Deseja realmente sair?')) {
                    window.close();
                }
            }, 500);
        } else {
            const result = commands[command].execute(args);
            if (result) {
                addOutput(result, 'success');
            }
        }
    }
}

// Histórico //
let commandHistory = [];
let historyIndex = -1;

function loadHistory() {
    const saved = localStorage.getItem('terminalHistory');
    if (saved) {
        commandHistory = JSON.parse(saved);
    }
}

function saveHistory() {
    localStorage.setItem('terminalHistory', JSON.stringify(commandHistory));
}

function loadSavedOutput() {
    const savedOutput = localStorage.getItem('terminalOutput');
    if (savedOutput) {
        output.innerHTML = savedOutput;
        scrollToBottom();
    }
}

function saveOutput() {
    localStorage.setItem('terminalOutput', output.innerHTML);
}

// Eventos //
input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const cmd = input.value;
        processCommand(cmd);
        input.value = '';
        updateCursorPosition();
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex > 0) {
            historyIndex--;
            input.value = commandHistory[historyIndex] || '';
            updateCursorPosition();
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            input.value = commandHistory[historyIndex] || '';
            updateCursorPosition();
        } else {
            historyIndex = commandHistory.length;
            input.value = '';
            updateCursorPosition();
        }
    } else if (e.key === 'Tab') {
        e.preventDefault();
        const partial = input.value.toLowerCase();
        if (partial) {
            const matches = Object.keys(commands).filter(cmd => cmd.startsWith(partial));
            if (matches.length === 1) {
                input.value = matches[0];
                updateCursorPosition();
            } else if (matches.length > 1) {
                addOutput('Comandos disponíveis: ' + matches.join(', '), 'info');
            }
        }
    }
});

// Cursor De Texto //
function updateCursorPosition() {
    const span = document.createElement('span');
    span.style.font = window.getComputedStyle(input).font;
    span.style.visibility = 'hidden';
    span.style.position = 'absolute';
    span.textContent = input.value.substring(0, input.selectionStart) || '';
    document.body.appendChild(span);
    
    const textWidth = span.offsetWidth;
    document.body.removeChild(span);
    
    const promptWidth = parseFloat(window.getComputedStyle(document.querySelector('.prompt')).width) || 20;
    cursor.style.left = `${textWidth + promptWidth + 10}px`;
}

input.addEventListener('input', updateCursorPosition);
input.addEventListener('keydown', updateCursorPosition);
input.addEventListener('keyup', updateCursorPosition);
input.addEventListener('select', updateCursorPosition);

// Efeito de digitação //
function addOutputTyping(text, className = 'output-line', speed = 1) {
    const line = document.createElement('div');
    line.className = className;
    output.appendChild(line);
    
    let i = 0;
    const charsPerFrame = 3;
    const typeInterval = setInterval(() => {
        if (i < text.length) {
            const chunk = text.substring(i, i + charsPerFrame);
            line.textContent += chunk;
            i += charsPerFrame;
            scrollToBottom();
            playKeySound();
        } else {
            clearInterval(typeInterval);
            saveOutput();
        }
    }, speed);
}

function addOutput(text, className = 'output-line', useTyping = true) {
    if (useTyping && className !== 'command-line') {
        addOutputTyping(text, className);
    } else {
        const line = document.createElement('div');
        line.className = className;
        line.textContent = text;
        output.appendChild(line);
        scrollToBottom();
        saveOutput();
    }
}

// Block no Rato //
document.addEventListener('mousedown', (e) => {
    e.preventDefault();
});

document.addEventListener('click', (e) => {
    e.preventDefault();
});

document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Auto Scroll //
function scrollToBottom() {
    terminal.scrollTop = terminal.scrollHeight;
}

// Outros //

window.addEventListener('DOMContentLoaded', () => {
    loadHistory();
    loadSavedOutput();
    displayWelcome();
    input.focus();
    updateCursorPosition();
});

function displayWelcome() {
    if (!localStorage.getItem('terminalOutput')) {
        addOutputTyping(welcomeMessage, 'welcome-text');
    }
}

function addOutputHTML(html, className = 'output-line') {
    const line = document.createElement('div');
    line.className = className;
    line.innerHTML = html;
    output.appendChild(line);
    scrollToBottom();
    saveOutput();
}

function clearTerminal() {
    output.innerHTML = '';
    localStorage.removeItem('terminalOutput');
    addOutput('Terminal limpo.', 'info');
}