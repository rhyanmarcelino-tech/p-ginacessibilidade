// Verifica suporte para a API de Reconhecimento de Voz
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    alert("Seu navegador não suporta a API de Reconhecimento de Voz. Experimente usar o Google Chrome ou Microsoft Edge.");
} else {
    const recognition = new SpeechRecognition();
    const btnVoice = document.getElementById('btn-voice');
    const voiceStatus = document.getElementById('voice-status');

    // Configurações do reconhecimento
    recognition.lang = 'pt-BR';
    recognition.continuous = true; // Continua ouvindo até ser desativado
    recognition.interimResults = false;

    let isListening = false;

    // Alternar escuta
    btnVoice.addEventListener('click', () => {
        if (!isListening) {
            recognition.start();
        } else {
            recognition.stop();
        }
    });

    // Quando a escuta inicia
    recognition.onstart = () => {
        isListening = true;
        btnVoice.classList.add('listening');
        btnVoice.querySelector('span').textContent = 'Ouvindo...';
        voiceStatus.textContent = 'Fale um comando (ex: "descer")';
    };

    // Quando a escuta encerra
    recognition.onend = () => {
        isListening = false;
        btnVoice.classList.remove('listening');
        btnVoice.querySelector('span').textContent = 'Ativar Comandos de Voz';
        voiceStatus.textContent = 'Microfone desligado';
    };

    // Processar o áudio capturado
    recognition.onresult = (event) => {
        const lastIndex = event.results.length - 1;
        const command = event.results[lastIndex][0].transcript.trim().toLowerCase();

        voiceStatus.textContent = `Comando detectado: "${command}"`;

        executarComando(command);
    };

    // Lógica para interpretar os comandos de voz
    function executarComando(comando) {
        // Rolar para Baixo / Descer
        if (comando.includes('rolar para baixo') || comando.includes('descer') || comando.includes('baixo')) {
            window.scrollBy({
                top: 450,
                behavior: 'smooth'
            });
        }
        
        // Rolar para Cima / Subir
        else if (comando.includes('rolar para cima') || comando.includes('subir') || comando.includes('cima')) {
            window.scrollBy({
                top: -450,
                behavior: 'smooth'
            });
        }

        // Navegar para seções específicas
        else if (comando.includes('início') || comando.includes('inicio') || comando.includes('topo')) {
            document.getElementById('inicio').scrollIntoView({ behavior: 'smooth' });
        }

        else if (comando.includes('sobre') || comando.includes('o rio')) {
            document.getElementById('sobre').scrollIntoView({ behavior: 'smooth' });
        }

        else if (comando.includes('impacto') || comando.includes('impactos')) {
            document.getElementById('impactos').scrollIntoView({ behavior: 'smooth' });
        }

        else if (comando.includes('ajudar') || comando.includes('como ajudar')) {
            document.getElementById('ajudar').scrollIntoView({ behavior: 'smooth' });
        }

        else if (comando.includes('fim') || comando.includes('rodapé')) {
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        }
    }

    // Tratamento de erros
    recognition.onerror = (event) => {
        console.error('Erro de reconhecimento:', event.error);
        voiceStatus.textContent = 'Erro ao reconhecer voz. Tente novamente.';
    };
}