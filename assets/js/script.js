(function () {
  const config = window.SITE_CONFIG || {};
  const imoveis = Array.isArray(window.IMOVEIS_TOWER) ? window.IMOVEIS_TOWER : [];

  const grid = document.querySelector("#property-grid");
  const summary = document.querySelector("#catalog-summary");
  const catalogSearch = document.querySelector("#catalog-search");
  const heroSearch = document.querySelector("#hero-search");
  const quickSearch = document.querySelector("#quick-search");
  const filterButtons = Array.from(document.querySelectorAll(".filter-button"));
  const whatsLinks = Array.from(document.querySelectorAll(".js-whatsapp-link"));
  const instagramLinks = Array.from(document.querySelectorAll(".js-instagram-link"));

  let activeFilter = "todos";
  let query = "";

  function normalize(value) {
    return String(value || "")
      .toLocaleLowerCase("pt-BR")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function whatsappHref(message) {
    const text = encodeURIComponent(message);
    const phone = String(config.whatsappNumber || "").replace(/\D/g, "");
    if (!phone) return "#contato";
    return `https://wa.me/${phone}?text=${text}`;
  }

  function updateWhatsappLinks() {
    const message = `Olá, Lívia. Gostaria de informações sobre imóveis no Ipatinga Tower.`;
    whatsLinks.forEach((link) => {
      link.setAttribute("href", whatsappHref(message));
      if (!config.whatsappNumber) {
        link.setAttribute("title", "Configure o WhatsApp em assets/js/site-config.js");
      }
    });
  }

  function updateInstagramLinks() {
    instagramLinks.forEach((link) => {
      if (config.instagramUrl) {
        link.setAttribute("href", config.instagramUrl);
      }
    });
  }

  function matchesQuery(property) {
    const haystack = normalize([
      property.codigo,
      property.finalidade,
      property.titulo,
      property.area,
      property.andar,
      property.status,
      property.valor,
      property.descricao,
      Array.isArray(property.codigos) ? property.codigos.join(" ") : ""
    ].join(" "));
    return haystack.includes(normalize(query));
  }

  function visibleProperties() {
    return imoveis.filter((property) => {
      const matchesFilter = activeFilter === "todos" || property.finalidade === activeFilter;
      return matchesFilter && matchesQuery(property);
    });
  }

  function propertyCard(property) {
    const tagClass = property.finalidade === "Venda" ? "tag sale" : "tag";
    const photos = Array.isArray(property.fotos) ? property.fotos : [];
    const photo = photos.length ? photos[0] : "";
    const photoStrip = photos.slice(1, 5).map((item, index) => (
      `<img src="${item}" alt="${property.titulo} - foto ${index + 2}" loading="lazy">`
    )).join("");
    const codigos = Array.isArray(property.codigos) && property.codigos.length
      ? property.codigos.join(", ")
      : "";
    const isReference = property.codigoConfirmado === false;
    const message = isReference
      ? `Olá, Lívia. Tenho interesse na referência ${property.codigo} do Ipatinga Tower.`
      : `Olá, Lívia. Tenho interesse no código ${property.codigo} do Ipatinga Tower.`;
    const actionLabel = isReference ? "Consultar perfil" : "Consultar código";

    return `
      <article class="property-card">
        <div class="property-media">
          ${photo ? `<img src="${photo}" alt="${property.titulo}" loading="lazy">` : "<span>Fotos em breve</span>"}
        </div>
        <div class="property-body">
          <div class="property-topline">
            <span>${property.codigo || "Sem código"}</span>
            <span class="${tagClass}">${property.finalidade || "Consulta"}</span>
          </div>
          <h3>${property.titulo || "Sala no Ipatinga Tower"}</h3>
          <p>${property.descricao || "Informações em atualização."}</p>
          ${codigos ? `<p class="profile-codes"><strong>Códigos de referência:</strong> ${codigos}</p>` : ""}
          ${photoStrip ? `<div class="photo-strip">${photoStrip}</div>` : ""}
          <dl class="property-details">
            <div>
              <dt>Área</dt>
              <dd>${property.area || "Consulte"}</dd>
            </div>
            <div>
              <dt>Pavimento</dt>
              <dd>${property.andar || "Consulte"}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>${property.status || "A confirmar"}</dd>
            </div>
            <div>
              <dt>Valor</dt>
              <dd>${property.valor || "Consulte"}</dd>
            </div>
          </dl>
          <a class="button button-secondary" href="${whatsappHref(message)}">${actionLabel}</a>
        </div>
      </article>
    `;
  }

  function emptyState() {
    const hasQuery = Boolean(query || activeFilter !== "todos");
    const title = hasQuery ? "Nenhum imóvel encontrado" : "Catálogo em atualização";
    const text = hasQuery
      ? "Ajuste a busca ou fale com a Lívia para conferir as opções disponíveis."
      : "As salas serão cadastradas com código, fotos, metragem e observações. Por enquanto, use o contato para consultar disponibilidade.";

    return `
      <article class="empty-state">
        <div>
          <h3>${title}</h3>
          <p>${text}</p>
        </div>
        <a class="button button-primary" href="${whatsappHref("Olá, Lívia. Gostaria de consultar imóveis disponíveis no Ipatinga Tower.")}">
          Consultar disponibilidade
        </a>
      </article>
    `;
  }

  function render() {
    const properties = visibleProperties();
    const count = properties.length;
    const suffix = count === 1 ? "imóvel encontrado" : "imóveis encontrados";

    summary.textContent = imoveis.length ? `${count} ${suffix}` : "Nenhum imóvel publicado ainda";
    grid.innerHTML = count ? properties.map(propertyCard).join("") : emptyState();
  }

  function syncSearch(value) {
    query = value;
    if (catalogSearch && catalogSearch.value !== value) catalogSearch.value = value;
    if (heroSearch && heroSearch.value !== value) heroSearch.value = value;
    render();
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter || "todos";
      filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
      render();
    });
  });

  if (catalogSearch) {
    catalogSearch.addEventListener("input", (event) => syncSearch(event.target.value));
  }

  if (quickSearch) {
    quickSearch.addEventListener("submit", (event) => {
      event.preventDefault();
      syncSearch(heroSearch ? heroSearch.value : "");
      document.querySelector("#imoveis")?.scrollIntoView({ behavior: "smooth" });
    });
  }

  updateWhatsappLinks();
  updateInstagramLinks();
  render();
})();
