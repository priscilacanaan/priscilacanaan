/* =====================================================================
   Sistema de cookies (consentimento LGPD) · Priscila Canaan
   - Aviso na primeira visita: Aceitar todos / Só essenciais / Personalizar
   - Escolha guardada no navegador por 12 meses; depois o aviso volta
   - Muda de idioma junto com o site (PT / EN / ES)
   - Reabrir: qualquer elemento com  data-cookies-abrir  (ex.: link no rodapé)
   - Para ligar uma ferramenta só com consentimento, use:
       <script type="text/plain" data-categoria="analise" src="..."></script>
     Ela só é carregada se a pessoa aceitar "Medição de audiência".
     Exemplo (Google Analytics, troque G-XXXX pelo seu código):
       <script type="text/plain" data-categoria="analise" src="https://www.googletagmanager.com/gtag/js?id=G-XXXX"></script>
       <script type="text/plain" data-categoria="analise">
         window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}
         gtag('js',new Date());gtag('config','G-XXXX',{anonymize_ip:true});
       </script>
   - Outros scripts podem perguntar:  pgCookies.permitido('analise')
     e ouvir o evento:  addEventListener('pg-cookies', e => e.detail)
   ===================================================================== */
(() => {
  const CHAVE = "pg-cookies", CHAVE_PREF = "pg-cookies-pref", VERSAO = 1, VALIDADE_DIAS = 365;
  const POLITICA = "privacidade.html#cookies";

  const TXT = {
    pt: {
      titulo: "Sua privacidade", texto: "Uso cookies essenciais para o site funcionar e lembrar suas escolhas. Outros cookies só com a sua permissão.",
      todos: "Aceitar todos", essenciais: "Só essenciais", personalizar: "Personalizar", politica: "Política de privacidade",
      prefTitulo: "Preferências de cookies", prefTexto: "Escolha o que pode ser usado. Você pode mudar quando quiser pelo link “Cookies” no rodapé.",
      salvar: "Salvar escolhas", fechar: "Fechar", sempre: "Sempre ativos",
      cat: {
        essenciais: ["Essenciais", "Fazem o site funcionar e guardam suas escolhas, como o idioma e esta preferência. Não dá para desligar."],
        analise: ["Medição de audiência", "Contam visitas e páginas mais vistas, sem identificar você. Hoje o site não usa nenhuma ferramenta desse tipo."],
        marketing: ["Marketing", "Ajudariam a mostrar anúncios mais relevantes em outros sites. Hoje o site não usa nenhuma ferramenta desse tipo."]
      },
      salvo: "Preferências salvas."
    },
    en: {
      titulo: "Your privacy", texto: "I use essential cookies to make the site work and remember your choices. Other cookies only with your permission.",
      todos: "Accept all", essenciais: "Essential only", personalizar: "Customize", politica: "Privacy policy",
      prefTitulo: "Cookie preferences", prefTexto: "Choose what can be used. You can change it anytime with the “Cookies” link in the footer.",
      salvar: "Save choices", fechar: "Close", sempre: "Always on",
      cat: {
        essenciais: ["Essential", "Make the site work and store your choices, such as language and this preference. Cannot be turned off."],
        analise: ["Audience measurement", "Count visits and most viewed pages without identifying you. The site does not use any such tool today."],
        marketing: ["Marketing", "Would help show more relevant ads on other sites. The site does not use any such tool today."]
      },
      salvo: "Preferences saved."
    },
    es: {
      titulo: "Tu privacidad", texto: "Uso cookies esenciales para que el sitio funcione y recuerde tus elecciones. Otras cookies solo con tu permiso.",
      todos: "Aceptar todas", essenciais: "Solo esenciales", personalizar: "Personalizar", politica: "Política de privacidad",
      prefTitulo: "Preferencias de cookies", prefTexto: "Elige qué se puede usar. Puedes cambiarlo cuando quieras con el enlace “Cookies” del pie de página.",
      salvar: "Guardar elecciones", fechar: "Cerrar", sempre: "Siempre activas",
      cat: {
        essenciais: ["Esenciales", "Hacen que el sitio funcione y guardan tus elecciones, como el idioma y esta preferencia. No se pueden desactivar."],
        analise: ["Medición de audiencia", "Cuentan visitas y páginas más vistas sin identificarte. Hoy el sitio no usa ninguna herramienta de este tipo."],
        marketing: ["Marketing", "Ayudarían a mostrar anuncios más relevantes en otros sitios. Hoy el sitio no usa ninguna herramienta de este tipo."]
      },
      salvo: "Preferencias guardadas."
    }
  };
  const CATS = ["essenciais", "analise", "marketing"];

  /* ---------- armazenamento ---------- */
  const ler = () => {
    try {
      const p = JSON.parse(localStorage.getItem(CHAVE_PREF) || "null");
      if (!p || p.v !== VERSAO) return null;
      if (Date.now() - new Date(p.data).getTime() > VALIDADE_DIAS * 864e5) return null;
      return p;
    } catch (e) { return null; }
  };
  const gravar = (analise, marketing) => {
    const p = { v: VERSAO, data: new Date().toISOString(), essenciais: true, analise: !!analise, marketing: !!marketing };
    const resumo = analise && marketing ? "todos" : !analise && !marketing ? "essenciais" : "personalizado";
    try { localStorage.setItem(CHAVE_PREF, JSON.stringify(p)); localStorage.setItem(CHAVE, resumo); } catch (e) {}
    pref = p; aplicar(); dispatchEvent(new CustomEvent("pg-cookies", { detail: { ...p, resumo } }));
  };
  const apagar = () => { try { localStorage.removeItem(CHAVE_PREF); localStorage.removeItem(CHAVE); } catch (e) {} pref = null; };

  /* ---------- ativa scripts bloqueados ---------- */
  function aplicar(){
    document.querySelectorAll('script[type="text/plain"][data-categoria]').forEach(s => {
      if (!pref || !pref[s.dataset.categoria] || s.dataset.ativado) return;
      const n = document.createElement("script");
      [...s.attributes].forEach(a => { if (a.name !== "type") n.setAttribute(a.name, a.value); });
      if (!s.src) n.textContent = s.textContent;
      s.dataset.ativado = "1"; s.after(n);
    });
  }

  /* ---------- idioma ---------- */
  const idioma = () => { const l = (document.documentElement.lang || "pt").slice(0, 2); return TXT[l] ? l : "pt"; };

  /* ---------- visual ---------- */
  const css = `
  .pgc{--pgc-bg:var(--ink2,#17171D);--pgc-tx:var(--paper,#F5F4F0);--pgc-mut:var(--mut,#8E8E9A);--pgc-ln:var(--line,#26262F);--pgc-a:var(--violet,#7C5CFF);--pgc-b:var(--teal,#00C2A8);
    font-family:var(--sans,Inter,system-ui,sans-serif);color:var(--pgc-tx);line-height:1.5}
  .pgc *{box-sizing:border-box}
  .pgc-aviso{position:fixed;z-index:9998;left:16px;bottom:16px;width:min(440px,calc(100vw - 32px));background:var(--pgc-bg);border:1px solid var(--pgc-ln);border-radius:20px;padding:20px;box-shadow:0 24px 60px -20px rgba(0,0,0,.7);transform:translateY(20px);opacity:0;transition:transform .45s cubic-bezier(.2,.8,.2,1),opacity .45s}
  .pgc-aviso.on{transform:none;opacity:1}
  .pgc h2{font-family:var(--display,"Space Grotesk",system-ui,sans-serif);font-size:18px;margin:0 0 6px;letter-spacing:-.02em;display:flex;align-items:center;gap:10px}
  .pgc h2 svg{width:22px;height:22px;flex:none}
  .pgc p{margin:0 0 14px;color:var(--pgc-mut);font-size:14px}
  .pgc a{color:var(--pgc-tx)}
  .pgc-acoes{display:flex;flex-wrap:wrap;gap:8px}
  .pgc button{font:600 14px var(--sans,Inter,sans-serif);border-radius:999px;padding:10px 16px;min-height:44px;cursor:pointer;border:1px solid var(--pgc-ln);background:transparent;color:var(--pgc-tx);flex:1 1 auto}
  .pgc button:hover{border-color:var(--pgc-tx)}
  .pgc button.pgc-pri{background:linear-gradient(90deg,var(--pgc-a),var(--pgc-b));border:0;color:#fff}
  .pgc button:focus-visible,.pgc a:focus-visible,.pgc input:focus-visible+span{outline:3px solid var(--pgc-b);outline-offset:2px}
  .pgc-fundo{position:fixed;inset:0;z-index:9999;background:rgba(5,5,8,.72);backdrop-filter:blur(4px);display:grid;place-items:center;padding:16px}
  .pgc-modal{background:var(--pgc-bg);border:1px solid var(--pgc-ln);border-radius:24px;padding:24px;width:min(560px,100%);max-height:calc(100vh - 32px);overflow:auto}
  .pgc-cat{display:flex;gap:16px;justify-content:space-between;align-items:flex-start;padding:14px 0;border-top:1px solid var(--pgc-ln)}
  .pgc-cat b{display:block;font-size:15px;margin-bottom:2px}
  .pgc-cat p{margin:0;font-size:13px}
  .pgc-sempre{font-size:12px;color:var(--pgc-b);white-space:nowrap;padding-top:2px}
  .pgc-chave{position:relative;flex:none;width:48px;height:28px;margin-top:2px}
  .pgc-chave input{position:absolute;opacity:0;inset:0;width:100%;height:100%;margin:0;cursor:pointer;z-index:1}
  .pgc-chave span{position:absolute;inset:0;border-radius:999px;background:var(--pgc-ln);transition:background .2s}
  .pgc-chave span::after{content:"";position:absolute;top:3px;left:3px;width:22px;height:22px;border-radius:50%;background:#fff;transition:transform .2s}
  .pgc-chave input:checked+span{background:linear-gradient(90deg,var(--pgc-a),var(--pgc-b))}
  .pgc-chave input:checked+span::after{transform:translateX(20px)}
  .pgc-modal .pgc-acoes{margin-top:16px}
  .pgc-toast{position:fixed;z-index:9998;left:50%;bottom:20px;transform:translateX(-50%);background:var(--pgc-bg);border:1px solid var(--pgc-ln);border-radius:999px;padding:10px 18px;font-size:14px}
  @media(prefers-reduced-motion:reduce){.pgc-aviso{transition:none}}`;
  const icone = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M21 12.5A9 9 0 1 1 11.5 3a3 3 0 0 0 4 3.6 3 3 0 0 0 4.4 4 3 3 0 0 0 1.1 1.9Z"/><circle cx="8.5" cy="10" r="1" fill="currentColor"/><circle cx="12" cy="15.5" r="1" fill="currentColor"/><circle cx="15.5" cy="12" r="1" fill="currentColor"/></svg>`;

  let pref = ler(), aviso = null, fundo = null, voltarFoco = null;

  function mostrarAviso(){
    fecharAviso();
    const t = TXT[idioma()];
    aviso = document.createElement("section");
    aviso.className = "pgc pgc-aviso"; aviso.setAttribute("role", "region"); aviso.setAttribute("aria-label", t.titulo);
    aviso.innerHTML = `<h2>${icone}${t.titulo}</h2><p>${t.texto} <a href="${POLITICA}">${t.politica}</a>.</p>
      <div class="pgc-acoes"><button class="pgc-pri" data-a="todos">${t.todos}</button><button data-a="essenciais">${t.essenciais}</button><button data-a="pers">${t.personalizar}</button></div>`;
    aviso.addEventListener("click", e => {
      const a = e.target.closest("button")?.dataset.a; if (!a) return;
      if (a === "todos") { gravar(true, true); fecharAviso(); }
      if (a === "essenciais") { gravar(false, false); fecharAviso(); }
      if (a === "pers") abrirPreferencias();
    });
    document.body.appendChild(aviso);
    requestAnimationFrame(() => requestAnimationFrame(() => aviso && aviso.classList.add("on")));
  }
  function fecharAviso(){ if (aviso) { aviso.remove(); aviso = null; } }

  function abrirPreferencias(){
    fecharPreferencias(); voltarFoco = document.activeElement;
    const t = TXT[idioma()], atual = pref || { analise: false, marketing: false };
    fundo = document.createElement("div"); fundo.className = "pgc pgc-fundo";
    fundo.innerHTML = `<div class="pgc-modal" role="dialog" aria-modal="true" aria-labelledby="pgc-t">
      <h2 id="pgc-t">${icone}${t.prefTitulo}</h2><p>${t.prefTexto}</p>
      ${CATS.map(c => `<div class="pgc-cat"><div><b id="pgc-${c}">${t.cat[c][0]}</b><p>${t.cat[c][1]}</p></div>
        ${c === "essenciais" ? `<span class="pgc-sempre">${t.sempre}</span>` :
          `<label class="pgc-chave"><input type="checkbox" data-c="${c}" aria-labelledby="pgc-${c}" ${atual[c] ? "checked" : ""}><span></span></label>`}</div>`).join("")}
      <div class="pgc-acoes"><button class="pgc-pri" data-a="salvar">${t.salvar}</button><button data-a="todos">${t.todos}</button><button data-a="fechar">${t.fechar}</button></div></div>`;
    fundo.addEventListener("click", e => {
      if (e.target === fundo) return fecharPreferencias();
      const a = e.target.closest("button")?.dataset.a; if (!a) return;
      if (a === "fechar") return fecharPreferencias();
      if (a === "todos") gravar(true, true);
      if (a === "salvar") { const v = c => fundo.querySelector(`[data-c="${c}"]`).checked; gravar(v("analise"), v("marketing")); }
      fecharPreferencias(); fecharAviso(); avisar(t.salvo);
    });
    fundo.addEventListener("keydown", e => {
      if (e.key === "Escape") fecharPreferencias();
      if (e.key === "Tab") { const f = [...fundo.querySelectorAll("button,input,a")], i = f.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); } }
    });
    document.body.appendChild(fundo);
    fundo.querySelector("input,button").focus();
  }
  function fecharPreferencias(){ if (fundo) { fundo.remove(); fundo = null; if (voltarFoco && voltarFoco.focus) voltarFoco.focus(); } }
  function avisar(msg){ const d = document.createElement("div"); d.className = "pgc pgc-toast"; d.setAttribute("role", "status"); d.textContent = msg; document.body.appendChild(d); setTimeout(() => d.remove(), 2400); }

  /* ---------- API pública ---------- */
  window.pgCookies = {
    permitido: c => c === "essenciais" || !!(pref && pref[c]),
    escolha: () => pref,
    abrir: abrirPreferencias,
    redefinir: () => { apagar(); mostrarAviso(); }
  };

  function iniciar(){
    const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
    document.addEventListener("click", e => { const el = e.target.closest("[data-cookies-abrir]"); if (el) { e.preventDefault(); abrirPreferencias(); } });
    // acompanha a troca de idioma do site
    new MutationObserver(() => { if (aviso) mostrarAviso(); if (fundo) abrirPreferencias(); }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    if (pref) aplicar(); else setTimeout(mostrarAviso, 600);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar); else iniciar();
})();
