/ FishiMod Loader
(function() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: #111; color: white; z-index: 999999;
        display: flex; align-items: center; justify-content: center;
        font-family: monospace; text-align: center;
    `;
    overlay.innerHTML = `
        <div>
            <h1 style="font-size: 2.5rem; margin-bottom: 2rem;">FishiMod</h1>
            <div style="width: 50px; height: 50px; border: 4px solid #333; border-top: 4px solid white; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
            <p>Carregando módulo...</p>
            <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
        </div>
    `;
    document.body.appendChild(overlay);
    
    fetch("https://raw.githubusercontent.com/fishixzschool/FishiMod/refs/heads/main/RaposaIA.js")
        .then(t => t.text())
        .then(code => {
            setTimeout(() => {
                overlay.remove();
                eval(code);
            }, 2000);
        })
        .catch(err => {
            overlay.innerHTML = '<div><h1 style="color: #ff6b6b;">Erro ao carregar FishiMod</h1><p>' + err.message + '</p></div>';
        });
})();
