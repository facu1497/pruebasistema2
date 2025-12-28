(function(){
  function fallbackUser(){
    try{
      const raw = localStorage.getItem("currentUser");
      if (!raw) return null;
      return JSON.parse(raw);
    }catch{
      return null;
    }
  }

  function resolveUser(provided){
    if (provided) return provided;
    if (typeof obtenerUsuarioActual === "function") {
      try { return obtenerUsuarioActual(); } catch { /* ignore */ }
    }
    return fallbackUser();
  }

  function formatUser(user){
    const nombre = (user && (user.nombre || user.user || user.username || user.email)) || "(sin usuario)";
    const rol = user && user.rol ? ` | Rol: ${user.rol}` : "";
    return `Usuario: ${nombre}${rol}`;
  }

  function renderUser(user){
    const label = formatUser(user);
    const headerTarget = document.getElementById("infoUsuario");
    if (headerTarget) headerTarget.textContent = label;
    const sidebarTarget = document.getElementById("infoUsuarioSidebar");
    if (sidebarTarget) sidebarTarget.textContent = label;
  }

  function markActiveNav(activePage){
    if (!activePage) return;
    const links = document.querySelectorAll('#sidebar .nav a[data-page]');
    links.forEach(link => {
      if (link.dataset.page === activePage) link.classList.add('active');
      else link.classList.remove('active');
    });
  }

  function initToggle(){
    const sidebar = document.getElementById("sidebar");
    const content = document.getElementById("content");
    const toggleBtn = document.getElementById("menuToggle");
    if (!sidebar || !toggleBtn) return;

    function toggleSidebar(){
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        sidebar.classList.toggle("open");
      } else {
        sidebar.classList.toggle("collapsed");
        if (content) content.classList.toggle("collapsed");
      }
    }

    toggleBtn.addEventListener("click", toggleSidebar);

    window.addEventListener("resize", () => {
      if (window.innerWidth <= 768) {
        sidebar.classList.remove("collapsed");
        if (content) content.classList.remove("collapsed");
      } else {
        sidebar.classList.remove("open");
      }
    });
  }

  function initCommonLayout(options = {}){
    const { activePage, currentUser } = options;
    const user = resolveUser(currentUser);
    renderUser(user);
    markActiveNav(activePage);
    initToggle();
  }

  window.initCommonLayout = initCommonLayout;
})();