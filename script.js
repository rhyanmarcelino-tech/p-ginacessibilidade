// Web Speech API Configuration
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let isListening = false;

// DOM Element References
const micBtn = document.getElementById('mic-toggle-btn');
const btnText = document.getElementById('btn-text');
const statusText = document.getElementById('status-text');
const statusIcon = document.getElementById('status-icon');
const lastCommandSpan = document.getElementById('last-command');
const toast = document.getElementById('toast');

// Check Browser Compatibility
if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onstart = () => {
        isListening = true;
        micBtn.classList.add('listening');
        btnText.textContent = "Ouvindo...";
        statusText.textContent = "Ouvindo comandos...";
        statusIcon.innerHTML = `<i class="fa-solid fa-microphone" style="color: var(--danger);"></i>`;
        showToast("Microfone Ativado! Fale um comando.");
    };

    recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
        console.log("Comando reconhecido:", transcript);
        executeCommand(transcript);
    };

    recognition.onerror = (event) => {
        console.error("Erro no reconhecimento de voz:", event.error);
        if (event.error === 'not-allowed') {
            showToast("Permissão de microfone negada.");
        }
        stopListeningUI();
    };

    recognition.onend = () => {
        if (isListening) {
            recognition.start(); // Reconecta em caso de término acidental
        } else {
            stopListeningUI();
        }
    };
} else {
    statusText.textContent = "Sem suporte a voz. Use os botões de simulação.";
    micBtn.style.opacity = "0.5";
    micBtn.disabled = true;
}

// Toggle Microphone State
function toggleMicrophone() {
    if (!recognition) {
        showToast("Navegador sem suporte à Web Speech API. Use o Chrome ou Edge.");
        return;
    }

    if (isListening) {
        isListening = false;
        recognition.stop();
        stopListeningUI();
    } else {
        try {
            recognition.start();
        } catch (e) {
            console.warn("Reiniciando serviço de escuta...", e);
        }
    }
}

function stopListeningUI() {
    isListening = false;
    micBtn.classList.remove('listening');
    btnText.textContent = "Ativar Voz";
    statusText.textContent = "Microfone desligado";
    statusIcon.innerHTML = `<i class="fa-solid fa-microphone-slash"></i>`;
    showToast("Microfone desativado.");
}

// Command Interpreter Engine
function executeCommand(command) {
    const cmd = command.toLowerCase().trim();
    lastCommandSpan.style.display = "inline-block";
    lastCommandSpan.textContent = `🗣️ "${command}"`;

    showToast(`Comando: "${command}"`);

    // Rolagem para baixo
    if (cmd.includes("baixo") || cmd.includes("descer") || cmd.includes("avançar")) {
        window.scrollBy({ top: 450, behavior: 'smooth' });
    } 
    // Rolagem para cima
    else if (cmd.includes("cima") || cmd.includes("subir") || cmd.includes("voltar")) {
        window.scrollBy({ top: -450, behavior: 'smooth' });
    } 
    // Topo da página
    else if (cmd.includes("topo") || cmd.includes("início") || cmd.includes("inicio") || cmd.includes("começo")) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } 
    // Fim da página
    else if (cmd.includes("fim") || cmd.includes("final") || cmd.includes("rodapé")) {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    } 
    // Seção Importância
    else if (cmd.includes("importância") || cmd.includes("importancia")) {
        document.getElementById('importancia').scrollIntoView({ behavior: 'smooth' });
    } 
    // Seção Poluição
    else if (cmd.includes("poluição") || cmd.includes("poluentes") || cmd.includes("poluicao")) {
        document.getElementById('poluentes').scrollIntoView({ behavior: 'smooth' });
    } 
    // Seção Impactos
    else if (cmd.includes("impacto") || cmd.includes("impactos")) {
        document.getElementById('impactos').scrollIntoView({ behavior: 'smooth' });
    } 
    // Seção Ações / Soluções
    else if (cmd.includes("ação") || cmd.includes("ações") || cmd.includes("solução") || cmd.includes("soluções") || cmd.includes("ajudar")) {
        document.getElementById('solucoes').scrollIntoView({ behavior: 'smooth' });
    } 
    // Tema Escuro
    else if (cmd.includes("escuro") || cmd.includes("noturno")) {
        document.body.classList.add('dark-theme');
    } 
    // Tema Claro
    else if (cmd.includes("claro") || cmd.includes("diurno")) {
        document.body.classList.remove('dark-theme');
    } 
    // Leitura por Áudio (Text-To-Speech)
    else if (cmd.includes("ler") || cmd.includes("ouvir")) {
        readPageSummary();
    } 
    // Parar Áudio
    else if (cmd.includes("parar") || cmd.includes("silêncio") || cmd.includes("cala")) {
        window.speechSynthesis.cancel();
    }
}

// Text-To-Speech Function
function readPageSummary() {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const textToRead = "Página de Conscientização sobre a Poluição no Rio Paraná. O Rio Paraná é a segunda maior bacia hidrográfica da América do Sul. Suas principais ameaças são o descarte de agrotóxicos, esgoto não tratado e plásticos. Para ajudar, devemos exigir saneamento básico e reforestar as margens.";
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
    } else {
        showToast("Síntese de voz não suportada pelo seu navegador.");
    }
}

// Helper: Feedback Toast
function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}