(function() {

    if (!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)) {

        alert("❌ FISHIMOD SCRIPTS | Falha ao Injetar!\n\nEste script foi projetado para funcionar apenas no site do Khan Academy.");

        window.location.href = "https://pt.khanacademy.org/";

        return;

    }

    let settings = JSON.parse(localStorage.getItem('fishiMOD')) || {

        autoAnswer: {
            enabled: true,
            speed: 'normal'
        },

        videoSpoof: {
            enabled: true
        },

        questionSpoof: {
            enabled: true
        },

        minuteFarm: {
            enabled: true
        },

    };

    const saveSettings = () => localStorage.setItem('fishiMOD', JSON.stringify(settings));

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    const loadScript = async (url) => new Promise((resolve) => {

        const script = document.createElement('script');

        script.src = url;

        script.onload = resolve;

        document.head.appendChild(script);

    });

    const showSplashScreen = () => {

        const splash = document.createElement('div');

        splash.innerHTML = `

            <div style="text-align:center; font-weight:bold; font-size:32px;">

                <span class="splash-moon">FISHI </span><span class="splash-scripts">MOD</span>

            </div>

            <div class="splash-credits">by FishiMod</div>

        `;

        splash.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background-color:#FFF;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:99999;opacity:0;transition:opacity 0.5s ease;user-select:none;font-family:sans-serif;color:#000;";

        document.body.appendChild(splash);

        setTimeout(() => {
            splash.style.opacity = '1';
        }, 10);

        setTimeout(() => {

            splash.style.opacity = '0';

            setTimeout(() => splash.remove(), 500);

        }, 2800);

    };

    let Toastify;

    const createToastNode = (text, duration) => {

        const node = document.createElement('div');

        node.style.position = 'relative';

        node.style.paddingBottom = '8px';

        node.innerHTML = `<div>${text}</div><div class="toast-progress-bar" style="animation-duration: ${duration}ms;"></div>`;

        return node;

    };

    const sendToast = (text, duration = 3000) => {

        if (Toastify) {

            Toastify({

                node: createToastNode(text, duration),
                duration: duration,
                gravity: 'bottom',
                position: 'center',

                style: {
                    background: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(5px)",
                    color: "#000",
                    borderRadius: "8px",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                    border: "1px solid rgba(0, 0, 0, 0.1)",
                    fontFamily: "sans-serif",
                    padding: "10px 15px 0 15px",
                    textAlign: "center"
                }

            }).showToast();

        }

    };

    function buildMenu() {

        const icons = {

            menu: `<svg class="ms-icon" viewBox="0 0 24 24"><path d="M12 2.5C7.2 2.5 3.5 6.2 3.5 11c0 3.1 1.7 5.8 4.2 7.2c-.3-1.1.1-2.2 1-3c.8-.7 1.5-1.5 1.5-2.6c0-1.4-1.1-2.5-2.5-2.5c-.7 0-1.3.3-1.7.8c-.4.4-.3 1 .1 1.3c.4.3 1 .2 1.3-.2c.2-.2.2-.5 0-.7c-.6-.6-1.5-.6-2.1 0c-.8.8-.8 2.1 0 2.9c.8.8 2.1.8 2.9 0c.2-.2.3-.4.3-.7c0-.9-.7-1.6-1.6-1.6c-.5 0-.9.2-1.2.5c-.5.5-.6 1.3-.3 2c.4 1.2 1.5 2.1 2.8 2.1c2.1 0 3.8-1.7 3.8-3.8c0-1.6-1-3-2.4-3.5c1.1-.3 2 .7 2 1.9c0 .7-.3 1.3-.7 1.7c-.4.4-.3 1 .1 1.3s1 .4 1.3.1c.4-.4.4-1 .1-1.3c-.6-.6-1.5-.6-2.1 0c-.8.8-.8 2.1 0 2.9c.4.4.9.6 1.4.6c2.1 0 3.8-1.7 3.8-3.8c0-4.8-3.7-8.5-8.5-8.5z"/></svg>`,

            autoAnswer: `<svg class="ms-icon" viewBox="0 0 24 24"><path d="m10.6 16.6-3.3-3.3a.9.9 0 0 1 1.3-1.3l2.7 2.7l5.7-5.7a.9.9 0 0 1 1.3 1.3L11.9 16.6a.9.9 0 0 1-1.3 0zM12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z"/></svg>`,

            video: `<svg class="ms-icon" viewBox="0 0 24 24"><path d="M17.5 11.1L8.5 5.4c-.5-.3-1 .1-1 .7v11.8c0 .6.5 1 1 .7l9-5.7c.4-.3.4-.9 0-1.2zM20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/></svg>`,

            question: `<svg class="ms-icon" viewBox="0 0 24 24"><path d="M12 2C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7V17c0 .6.4 1 1 1h6c.6 0 1-.4 1-1v-2.3c1.8-1.2 3-3.4 3-5.7C19 5.1 15.9 2 12 2zm1 13h-2v-2h2v2zm0-4h-2V7h2v4z"/></svg>`,

            minutes: `<svg class="ms-icon" viewBox="0 0 24 24"><path d="M12 2c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4 12.5c0 .3-.2.5-.5.5h-7c-.3 0-.5-.2-.5-.5v-1c0-.3.2-.5.5-.5h7c.3 0 .5.2.5.5v1zM12 8c-.3 0-.5-.2-.5-.5v-1c0-.3.2-.5.5-.5s.5.2.5.5v1c0 .3-.2.5-.5.5zm4 0c-.3 0-.5-.2-.5-.5v-1c0-.3.2-.5.5-.5s.5.2.5.5v1c0 .3-.2.5-.5.5zM8 8c-.3 0-.5-.2-.5-.5v-1c0-.3.2-.5.5-.5s.5.2.5.5v1c0 .3-.2.5-.5.5z"/></svg>`,

            github: `<svg class="ms-icon" viewBox="0 0 24 24"><path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.5-1.4-1.3-1.8-1.3-1.8-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 1.7 2.6 1.2 3.2.9.1-.7.4-1.2.7-1.5-2.5-.3-5.1-1.2-5.1-5.5 0-1.2.4-2.2 1.2-3-.1-.3-.5-1.4.1-3 0 0 1-.3 3.2 1.2a11 11 0 0 1 6 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.7.1 3 1 .8 1.2 1.8 1.2 3 0 4.3-2.6 5.2-5.1 5.5.4.3.8 1 .8 1.9v2.8c0 .3.2.7.8.6A12 12 0 0 0 12 .3z"/></svg>`,

            discord: `<svg class="ms-icon" viewBox="0 0 24 24"><path d="M19.5 0h-15A2.5 2.5 0 0 0 2 2.5v16A2.5 2.5 0 0 0 4.5 21H16l4.5-4.5V2.5A2.5 2.5 0 0 0 19.5 0zM8.5 12.5a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm7 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/></svg>`

        };

        const menuContainer = document.createElement('div');

        menuContainer.innerHTML = `<div id="ms-menu-toggle">${icons.menu}</div><div id="ms-menu" class="hidden"><div class="ms-header"><span>FISHI</span><span style="color:#fff; font-weight: 900;">MOD</span></div><div class="ms-content"><div class="ms-option"><div class="ms-label">${icons.autoAnswer}<span>Respostas Automáticas</span></div><label class="ms-switch"><input type="checkbox" id="ms-autoAnswer-toggle"><span class="ms-slider"></span></label></div><div class="ms-speed-selector"><div class="ms-speed-btn" data-speed="safe">Lenta</div><div class="ms-speed-btn" data-speed="normal">Normal</div><div class="ms-speed-btn" data-speed="insta">Rápida</div></div><div class="ms-warning" id="ms-speed-warning">Aviso: A velocidade 'Rápida' pode não contabilizar os minutos.</div><div class="ms-divider"></div><div class="ms-option"><div class="ms-label">${icons.video}<span>Completar Vídeos</span></div><label class="ms-switch"><input type="checkbox" id="ms-videoSpoof-toggle"><span class="ms-slider"></span></label></div><div class="ms-option"><div class="ms-label">${icons.question}<span>Revelar Respostas</span></div><label class="ms-switch"><input type="checkbox" id="ms-questionSpoof-toggle"><span class="ms-slider"></span></label></div><div class="ms-option"><div class="ms-label">${icons.minutes}<span>Farm de Minutos</span></div><label class="ms-switch"><input type="checkbox" id="ms-minuteFarm-toggle"><span class="ms-slider"></span></label></div></div><div class="ms-footer"><div class="ms-credits">by FishiMod</div><div class="ms-socials"><a href="https://github.com/fishixzschool" target="_blank">${icons.github}</a><a href="https://discord.gg/FishiMod" target="_blank">${icons.discord}</a></div></div></div>`;

        document.body.appendChild(menuContainer);

        document.head.appendChild(Object.assign(document.createElement('style'), {
            innerHTML: `

#ms-menu-toggle{position:fixed;bottom:20px;right:20px;width:50px;height:50px;background-color:#fff;border:2px solid #111;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:10000;transition:transform .3s ease; box-shadow: 0 3px 10px rgba(0,0,0,0.2);}

#ms-menu-toggle:hover{transform:scale(1.1) rotate(15deg)}

#ms-menu-toggle .ms-icon path {fill: #111;}

#ms-menu{position:fixed;bottom:80px;right:20px;width:280px;background-color:rgba(255, 255, 255, 0.9);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-radius:12px;border:1px solid rgba(0,0,0,0.15);box-shadow:0 5px 20px rgba(0,0,0,0.2);z-index:9999;font-family:sans-serif;color:#1e1e1e;overflow:hidden;transition:opacity .3s ease,transform .3s ease;transform-origin:bottom right}

#ms-menu.hidden{opacity:0;transform:scale(.9);pointer-events:none}

.ms-header{padding:10px;background:linear-gradient(to right, #333, #111);color:#fff;font-size:18px;font-weight:700;text-align:center;}

.ms-content{padding:12px}

.ms-option{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}

.ms-speed-selector{display:flex;justify-content:space-between;gap:5px;margin:8px 0}

.ms-speed-btn{flex-grow:1;text-align:center;padding:5px;background-color:#e0e0e0;border-radius:6px;cursor:pointer;transition:all .2s ease;color:#333;}

.ms-speed-btn:hover{transform:translateY(-2px);background-color:#d0d0d0;}

.ms-speed-btn.active{background-color:#333;font-weight:700;color:#fff;}

.ms-warning{font-size:10px;color:#888;text-align:center;margin-top:5px;display:none;line-height:1.2}

.ms-warning.visible{display:block}

.ms-divider{height:1px;background-color:rgba(0,0,0,0.1);margin:12px 0}

.ms-label{display:flex;align-items:center;gap:10px}

.ms-icon{width:20px;height:20px}

.ms-icon path {fill: #1e1e1e;}

.ms-switch{position:relative;display:inline-block;width:44px;height:24px}

.ms-switch input{opacity:0;width:0;height:0}

.ms-slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#ccc;transition:.4s;border-radius:34px}

.ms-slider:before{position:absolute;content:"";height:18px;width:18px;left:3px;bottom:3px;background-color:#fff;transition:.4s;border-radius:50%;box-shadow: 0 1px 3px rgba(0,0,0,0.4);}

input:checked+.ms-slider{background-color:#333}

input:checked+.ms-slider:before{transform:translateX(20px)}

.ms-footer{display:flex;align-items:center;justify-content:space-between;background-color:rgba(0,0,0,0.05);padding:8px 12px;}

.ms-credits{font-size:10px;color:#555;}

.ms-socials{display:flex;justify-content:center;gap:15px}

.ms-socials a{color:#333;opacity:.7;transition:opacity .2s ease}

.ms-socials a:hover{opacity:1}

.ms-socials svg{width:22px;height:22px}

.ms-socials .ms-icon path {fill: #333;}

`
        }));

        const ui = {
            autoAnswer: document.getElementById('ms-autoAnswer-toggle'),
            speedBtns: document.querySelectorAll('.ms-speed-btn'),
            speedWarning: document.getElementById('ms-speed-warning'),
            videoSpoof: document.getElementById('ms-videoSpoof-toggle'),
            questionSpoof: document.getElementById('ms-questionSpoof-toggle'),
            minuteFarm: document.getElementById('ms-minuteFarm-toggle'),
            menuToggle: document.getElementById('ms-menu-toggle'),
            menu: document.getElementById('ms-menu')
        };

        const updateUI = () => {
            ui.autoAnswer.checked = settings.autoAnswer.enabled;
            ui.videoSpoof.checked = settings.videoSpoof.enabled;
            ui.questionSpoof.checked = settings.questionSpoof.enabled;
            ui.minuteFarm.checked = settings.minuteFarm.enabled;
            ui.speedBtns.forEach(b => b.classList.remove('active'));
            const a = document.querySelector(`.ms-speed-btn[data-speed="${settings.autoAnswer.speed}"]`);
            if (a) a.classList.add('active');
            ui.speedWarning.classList.toggle('visible', settings.autoAnswer.speed === 'insta');
        };

        ui.menuToggle.addEventListener('click', () => ui.menu.classList.toggle('hidden'));

        ui.autoAnswer.addEventListener('change', e => {
            settings.autoAnswer.enabled = e.target.checked;
            saveSettings();
            sendToast(`Respostas Automáticas: ${e.target.checked?'Ativadas':'Desativadas'}`);
            if (e.target.checked) runAutoAnswer();
        });

        ui.speedBtns.forEach(b => b.addEventListener('click', () => {
            settings.autoAnswer.speed = b.dataset.speed;
            saveSettings();
            updateUI();
        }));

        ui.videoSpoof.addEventListener('change', e => {
            settings.videoSpoof.enabled = e.target.checked;
            saveSettings();
            sendToast(`Completar Vídeos: ${e.target.checked?'Ativado':'Desativado'}`);
        });

        ui.questionSpoof.addEventListener('change', e => {
            settings.questionSpoof.enabled = e.target.checked;
            saveSettings();
            sendToast(`Revelar Respostas: ${e.target.checked?'Ativado':'Desativado'}`);
        });

        ui.minuteFarm.addEventListener('change', e => {
            settings.minuteFarm.enabled = e.target.checked;
            saveSettings();
            sendToast(`Farm de Minutos: ${e.target.checked?'Ativado':'Desativado'}`);
        });

        updateUI();

    }



    async function runAutoAnswer() {

        const speedMap = {
            safe: 5000,
            normal: 1500,
            insta: 50
        };

        const answerSelector = '[data-testid="choice-icon__library-choice-icon"]';

        const nextSelectors = ['[data-testid="exercise-check-answer"]', '[data-testid="exercise-next-question"]', '._1udzurba', '._awve9b'];

        while (settings.autoAnswer.enabled) {

            const waitTime = speedMap[settings.autoAnswer.speed] || 1500;

            if (document.querySelector(answerSelector)) {

                const answerEl = document.querySelector(answerSelector);

                if (answerEl) answerEl.click();



                await delay(waitTime);

                if (!settings.autoAnswer.enabled) return;

                const nextEl = document.querySelector(nextSelectors.find(s => document.querySelector(s)));

                if (nextEl) {

                    if (nextEl.innerText.includes("Mostrar resumo")) sendToast("Exercício Finalizado com Sucesso!");

                    nextEl.click();

                }

            }

            await delay(1000);

        }

    }



    const startActiveFarmer = () => {
        setInterval(() => {
            fetch("/api/internal/graphql/earnEnergyPoints", {
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    operationName: "earnEnergyPoints",
                    variables: {
                        input: {}
                    },
                    query: "mutation earnEnergyPoints($input: EarnEnergyPointsInput!) {\n  earnEnergyPoints(input: $input) {\n    pointsEarned\n    __typename\n  }\n}\n"
                }),
                method: "POST"
            });
        }, 45000);
    };

    const originalFetch = window.fetch;
    window.fetch = async function(a, b) {
        const c = a instanceof Request ? a.url : a;
        let d = b?.body ? String(b.body) : a instanceof Request ? await a.clone().text() : null;
        if (settings.minuteFarm.enabled && c.includes("mark_conversions") && d?.includes("termination_event")) return Promise.resolve(new Response(null, {
            status: 204
        }));
        if (settings.videoSpoof.enabled && d?.includes('"operationName":"updateUserVideoProgress"')) try {
            let e = JSON.parse(d);
            const f = e.variables.input;
            f.secondsWatched = f.durationSeconds;
            f.lastSecondWatched = f.durationSeconds;
            const g = JSON.stringify(e);
            a instanceof Request ? a = new Request(a, {
                body: g
            }) : b.body = g;
            sendToast("Vídeo Marcado como Concluído.")
        } catch (h) {}
        const i = await originalFetch.apply(this, a instanceof Request ? [a] : [a, b]);
        if (settings.questionSpoof.enabled && c.includes("/graphql/")) try {
            const j = i.clone();
            let k = await j.json();
            if (k?.data?.assessmentItem?.item?.itemData) {
                let l = JSON.parse(k.data.assessmentItem.item.itemData);
                if (l.question.content[0] === l.question.content[0].toUpperCase()) {
                    l.answerArea = {
                        calculator: !1
                    };
                    l.question.content = `A resposta foi revelada. [[☃ radio 1]]`;
                    l.question.widgets = {
                        "radio 1": {
                            type: "radio",
                            options: {
                                choices: [{
                                    content: "Resposta correta.",
                                    correct: !0
                                }, {
                                    content: "Incorreta.",
                                    correct: !1
                                }]
                            }
                        }
                    };
                    k.data.assessmentItem.item.itemData = JSON.stringify(l);
                    sendToast("Resposta Correta Revelada.");
                    return new Response(JSON.stringify(k), {
                        status: i.status,
                        statusText: i.statusText,
                        headers: i.headers
                    })
                }
            }
        } catch (m) {}
        return i
    };

    (async () => {

        const toastifyCSS = document.createElement('link');
        toastifyCSS.rel = 'stylesheet';
        toastifyCSS.href = 'https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css';

        const customStyles = document.createElement('style');
        customStyles.innerHTML = `

@keyframes slideInLeft{from{transform:translateX(-30px);opacity:0}to{transform:translateX(0);opacity:1}}

@keyframes slideInRight{from{transform:translateX(30px);opacity:0}to{transform:translateX(0);opacity:1}}

@keyframes fadeIn{from{opacity:0}to{opacity:1}}

.splash-moon{animation:slideInLeft .8s ease-out forwards; display:inline-block;}

.splash-scripts{animation:slideInRight .8s ease-out forwards; animation-delay:.2s; display:inline-block; font-weight: 900;}

.splash-credits{font-size:14px;color:#555;margin-top:5px;opacity:0;animation:fadeIn 1s ease-out 1s forwards}

@keyframes progress-deplete{from{width:100%}to{width:0%}}

.toast-progress-bar{position:absolute;bottom:0;left:0;height:3px;background-color:#333;animation:progress-deplete linear}

`;

        document.head.appendChild(toastifyCSS);
        document.head.appendChild(customStyles);

        showSplashScreen();

        await loadScript('https://cdn.jsdelivr.net/npm/toastify-js').then(() => Toastify = window.Toastify);

        console.clear();

        buildMenu();

        startActiveFarmer();

        if (settings.autoAnswer.enabled) runAutoAnswer();

        setTimeout(() => {
            sendToast("FishiMod Carregado com Sucesso!");
            setTimeout(() => {
                sendToast("Dica: Pausas entre as respostas ajudam a registrar os minutos.", 5000)
            }, 1000)
        }, 2900);

    })();

})();
