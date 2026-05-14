// ── SHARED SIDEBAR ─────────────────────────────────────────────────────────
// Include this script on every page. It injects the sidebar DOM + styles.

(function() {
  const style = document.createElement('style');
  style.textContent = `
    #sidebar {
      position: fixed;
      top: 0; right: 0;
      width: 44px;
      height: 100%;
      z-index: 100;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    #sidebar-tab {
      writing-mode: vertical-rl;
      text-orientation: mixed;
      font-family: Arial Black, Arial, Helvetica, sans-serif;
      font-weight: 900;
      font-size: 11px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.35);
      cursor: pointer;
      user-select: none;
      padding: 12px 6px;
      transition: color 0.2s;
    }

    #sidebar-tab:hover { color: #ff2d9a; }

    #about-panel {
      position: fixed;
      top: 0; right: -320px;
      width: 300px;
      height: 100%;
      background: #0f0f0f;
      border-left: 1px solid #222;
      z-index: 99;
      transition: right 0.4s cubic-bezier(0.77,0,0.18,1);
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 40px 28px;
      box-sizing: border-box;
    }

    #about-panel.open { right: 44px; }

    #about-label {
      font-family: Arial Black, Arial, Helvetica, sans-serif;
      font-weight: 900;
      font-size: 11px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #ff2d9a;
      margin-bottom: 24px;
    }

    #about-text {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 14px;
      line-height: 1.7;
      color: rgba(255,255,255,0.7);
    }

    #about-close {
      position: absolute;
      top: 20px;
      right: 16px;
      font-family: Arial Black, Arial, sans-serif;
      font-size: 11px;
      color: rgba(255,255,255,0.3);
      cursor: pointer;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }
    #about-close:hover { color: #ff2d9a; }
  `;
  document.head.appendChild(style);

  const panel = document.createElement('div');
  panel.id = 'about-panel';
  panel.innerHTML = `
    <div id="about-close">✕ close</div>
    <div id="about-label">About</div>
    <div id="about-text">This website shows the satirical nature of instagram through typographic imagery and interaction.</div>
  `;
  document.body.appendChild(panel);

  const sidebar = document.createElement('div');
  sidebar.id = 'sidebar';
  sidebar.innerHTML = `<div id="sidebar-tab">About</div>`;
  document.body.appendChild(sidebar);

  let open = false;

  document.getElementById('sidebar-tab').addEventListener('click', function() {
    open = !open;
    panel.classList.toggle('open', open);
  });

  document.getElementById('about-close').addEventListener('click', function() {
    open = false;
    panel.classList.remove('open');
  });
})();
