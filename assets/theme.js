(function () {
  const root = document.documentElement;
  const controls = [...document.querySelectorAll('[data-theme-choice]')];
  const saved = localStorage.getItem('compas-theme');
  const themes = ['light', 'dark', 'contrast'];

  function applyTheme(theme) {
    if (!themes.includes(theme)) return;
    root.dataset.theme = theme;
    localStorage.setItem('compas-theme', theme);
    controls.forEach(control => {
      control.setAttribute('aria-pressed', String(control.dataset.themeChoice === theme));
    });
  }

  controls.forEach(control => {
    control.addEventListener('click', () => applyTheme(control.dataset.themeChoice));
  });
  applyTheme(saved && themes.includes(saved) ? saved : 'light');
})();
