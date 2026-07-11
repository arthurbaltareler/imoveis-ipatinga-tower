(function () {
  const config = window.SITE_CONFIG || {};
  const imoveis = Array.isArray(window.IMOVEIS_TOWER) ? window.IMOVEIS_TOWER : [];

  const grid = document.querySelector("#property-grid");
  const summary = document.querySelector("#catalog-summary");
  const whatsLinks = Array.from(document.querySelectorAll(".js-whatsapp-link"));
  const instagramLinks = Array.from(document.querySelectorAll(".js-instagram-link"));

  function whatsappHref(message) {
    const text = encodeURIComponent(message);
    const phone = String(config.whatsappNumber || "").replace(/\D/g, "");
    if (!phone) return "#contato";
    return `https://wa.me/${phone}?text=${text}`;
  }

  function updateWhatsappLinks() {
    const message = "Olá, Lívia. Gostaria de informações sobre imóveis no Ipatinga Tower.";
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

  function propertyCard(property) {
    const tagClass = property.finalidade === "Venda" ? "tag sale" : "tag";
    const photos = Array.isArray(property.fotos) ? property.fotos : [];
    const photo = photos.length ? photos[0] : "";
    const photoStrip = photos.slice(1, 5).map((item, index) => (
      `<img src="${item}" alt="${property.titulo} - foto ${index + 2}" loading="lazy">`
    )).join("");
    const label = property.codigo || property.titulo || "Imóvel";
    const message = `Olá, Lívia. Tenho interesse em ${label} no Ipatinga Tower.`;
    const details = [
      property.area ? ["Área", property.area] : null,
      ["Localização", property.localizacao || "Ipatinga Tower"],
      ["Status", property.status || "A confirmar"],
      ["Aluguel", property.valor || "Consulte"]
    ].filter(Boolean).map(([term, value]) => (
      `<div>
        <dt>${term}</dt>
        <dd>${value}</dd>
      </div>`
    )).join("");

    return `
      <article class="property-card">
        <div class="property-media">
          ${photo ? `<img src="${photo}" alt="${property.titulo}" loading="lazy">` : "<span>Fotos em breve</span>"}
        </div>
        <div class="property-body">
          <div class="property-topline">
            <span>${label}</span>
            <span class="${tagClass}">${property.finalidade || "Consulta"}</span>
          </div>
          <h3>${property.titulo || "Imóvel no Ipatinga Tower"}</h3>
          <p>${property.descricao || "Informações em atualização."}</p>
          ${photoStrip ? `<div class="photo-strip">${photoStrip}</div>` : ""}
          <dl class="property-details">
            ${details}
          </dl>
          <a class="button button-secondary" href="${whatsappHref(message)}">Falar sobre este imóvel</a>
        </div>
      </article>
    `;
  }

  function emptyState() {
    return `
      <article class="empty-state">
        <div>
          <h3>Catálogo em atualização</h3>
          <p>As opções serão atualizadas conforme disponibilidade informada pela Lívia.</p>
        </div>
        <a class="button button-primary" href="${whatsappHref("Olá, Lívia. Gostaria de consultar imóveis disponíveis no Ipatinga Tower.")}">
          Consultar disponibilidade
        </a>
      </article>
    `;
  }

  function render() {
    const count = imoveis.length;
    const suffix = count === 1 ? "imóvel disponível" : "imóveis disponíveis";

    summary.textContent = count ? `${count} ${suffix}` : "Nenhum imóvel publicado ainda";
    grid.innerHTML = count ? imoveis.map(propertyCard).join("") : emptyState();
  }

  updateWhatsappLinks();
  updateInstagramLinks();
  render();
})();
