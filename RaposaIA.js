
// javascript:fetch("https://corsproxy.io/?url=https://raw.githubusercontent.com/fehzxkkj/Scripts-Sala-Do-Futuro-/refs/heads/main/FelcaIA.js%22).then(t=%3Et.text()).then(eval);
javascript:(() => {
    console.clear();

    // -------------------- Notificações --------------------
    class NotificationSystem {
        constructor() {
            if (!document.getElementById('custom-notification-styles')) {
                const style = document.createElement('style');
                style.id = 'custom-notification-styles';
                style.textContent = `
                    .notification-container {position:fixed;top:20px;right:20px;z-index:9999;display:flex;flex-direction:column;align-items:flex-end;pointer-events:none;}
                    .notification {background:rgba(20,20,20,0.9);color:#f0f0f0;margin-bottom:10px;padding:10px 15px;border-radius:8px;font-family:'Inter',sans-serif;font-size:13px;min-height:36px;text-align:center;display:flex;align-items:center;pointer-events:auto;opacity:0;transform:translateY(-20px);transition:opacity 0.3s ease, transform 0.3s ease;}
                    .notification.show {opacity:1;transform:translateY(0);}
                    #felcaia-ball {position:fixed;bottom:20px;right:20px;width:50px;height:50px;background:#fff;border-radius:50%;box-shadow:0 4px 10px rgba(0,0,0,0.3);cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:99999;}
                `;
                document.head.appendChild(style);
            }
            this.container = document.createElement('div');
            this.container.className = 'notification-container';
            document.body.appendChild(this.container);
        }
        show(msg,d=3000){ 
            const n = document.createElement('div');
            n.className='notification';
            n.textContent=msg;
            this.container.appendChild(n);
            n.offsetHeight;
            n.classList.add('show');
            setTimeout(() => { n.classList.remove('show'); setTimeout(()=>n.remove(),300); }, d);
        }
        success(msg,d=3000){ this.show(msg,d); }
        error(msg,d=3000){ this.show(msg,d); }
    }
    const notifications = new NotificationSystem();

    // -------------------- Prompt fixo inteligente --------------------
    const promptBase = `
Você é um aluno do ensino fundamental respondendo provas e tarefas escolares.
Regras:
1. Se a questão tiver alternativas (A, B, C, D ou E), responda SOMENTE a letra correta, sem explicação. Exemplo: "B", e as vezes tem varias alternativas correta por exemplo: B, C estão certas.
2. Se for uma questão aberta (sem alternativas), responda como um aluno do fundamental escreveria: curto, simples e natural.
3. Apenas dê a resposta final (a letra ou a frase curta).
4. Algumas perguntas difíceis voce pode explicar, mais sempre mande repsostas curtas e sempre agir naturalmente, pode dar um explicadinha mais bem natural.
5. Você se chama RaposaIA, foi desenvolvido por um Estudante do Ensino Médio do 2° Ano do Ensino Médio!
`;

    // -------------------- Painel FelcaIA --------------------
    function criarPainelIA() {
        if (document.getElementById("raposaia-panel")) {
            notifications.error("⚠️ O painel já está aberto");
            return;
        }

        const panel = document.createElement("div");
        panel.id = "raposaia-panel";
        panel.style = `
            position:fixed;bottom:20px;right:20px;width:320px;height:400px;
            background:#111;color:#fff;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.4);
            display:flex;flex-direction:column;font-family:Arial, sans-serif;z-index:99999;overflow:hidden;
        `;

        // Header
        const header = document.createElement("div");
        header.style = "background:#222;padding:10px;display:flex;justify-content:space-between;align-items:center;cursor:move;";
        
        const title = document.createElement("span");
        title.textContent = "🦊 RaposaIA";
        title.style = "font-weight:bold;";
        
        const closeBtn = document.createElement("span");
        closeBtn.textContent = "❌";
        closeBtn.style = "cursor:pointer;margin-left:10px;";

        header.appendChild(title);
        header.appendChild(closeBtn);
        panel.appendChild(header);

        // Chat container
        const chatContainer = document.createElement("div");
        chatContainer.style = "flex:1;padding:10px;overflow-y:auto;font-size:14px;";
        panel.appendChild(chatContainer);

        // Input container
        const inputContainer = document.createElement("div");
        inputContainer.style = "display:flex;border-top:1px solid #333;";

        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Digite sua pergunta...";
        input.style = "flex:1;padding:10px;border:none;outline:none;background:#222;color:#fff;";
        inputContainer.appendChild(input);

        const sendBtn = document.createElement("button");
        sendBtn.textContent = "➤";
        sendBtn.style = "padding:10px;background:#0af;color:#fff;border:none;cursor:pointer;";
        inputContainer.appendChild(sendBtn);

        panel.appendChild(inputContainer);
        document.body.appendChild(panel);

        // -------------------- Bolinha branca --------------------
        const ball = document.createElement("div");
        ball.id = "felcaia-ball";
        ball.style.display = "none";
        ball.textContent = "🦊";
        document.body.appendChild(ball);

        closeBtn.onclick = () => {
            panel.style.display = "none";
            ball.style.display = "flex";
        };

        ball.onclick = () => {
            panel.style.display = "flex";
            ball.style.display = "none";
        };

        // -------------------- Enviar Pergunta --------------------
        async function enviarPergunta() {
            if(!input.value) return;

            const pergunta = document.createElement('div');
            pergunta.textContent = 'Você: ' + input.value;
            pergunta.style.margin='5px 0';
            pergunta.style.fontWeight='bold';
            chatContainer.appendChild(pergunta);
            chatContainer.scrollTop = chatContainer.scrollHeight;

            const userMsg = input.value;
            input.value='';

            const resposta = document.createElement('div');
            resposta.textContent = 'FelcaIA: ...';
            resposta.style.margin='5px 0';
            resposta.style.color='#0af';
            chatContainer.appendChild(resposta);
            chatContainer.scrollTop = chatContainer.scrollHeight;

            try {
                const resp = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyDZacDqpCNavTURwoCoQ547eXyNa-IpgyU", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [
                            { parts: [{ text: promptBase + "\n\nPergunta: " + userMsg }] }
                        ]
                    })
                });

                const data = await resp.json();
                const respostaIA = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sem resposta da API";
                resposta.textContent = "IA: " + respostaIA.trim();

            } catch (e) {
                resposta.textContent = "IA: Erro ao conectar na API ❌";
            }

            chatContainer.scrollTop = chatContainer.scrollHeight;
        }

        // 👉 Listeners
        sendBtn.addEventListener('click', enviarPergunta);
        input.addEventListener('keypress', e => { 
            if(e.key === 'Enter') enviarPergunta(); 
        });

        // -------------------- Drag para mover o painel --------------------
        let isDragging = false, offsetX, offsetY;
        header.onmousedown = e => {
            if (e.target === closeBtn) return; // não arrastar clicando no ❌
            isDragging = true;
            offsetX = e.clientX - panel.offsetLeft;
            offsetY = e.clientY - panel.offsetTop;
        };
        document.onmousemove = e => {
            if(isDragging) {
                panel.style.left = (e.clientX - offsetX) + "px";
                panel.style.top = (e.clientY - offsetY) + "px";
                panel.style.right = "auto";
                panel.style.bottom = "auto";
            }
        };
        document.onmouseup = () => isDragging = false;

        notifications.success("✅ Painel FelcaIA aberto!");
    }

    criarPainelIA();
})();
