// =====================
// CARD SYSTEM
// =====================
const cards = document.querySelectorAll(".set-card");

cards.forEach(card => {
  const title = card.dataset.title || "";
  const assets = JSON.parse(card.dataset.assets || "[]");
  const experiences = JSON.parse(card.dataset.experiences || "[]");
  const socials = JSON.parse(card.dataset.social || "[]");

  // =====================
  // ASSETS
  // =====================
  let assetsHTML = "";
  let videoHTML = "";

  assets.forEach(asset => {

    // IMAGE (GRID)
    if (asset.type === "image") {
      assetsHTML += `
        <div class="responsive">
          <div class="gallery">
            <a href="${asset.src}" target="_blank">
              <img src="${asset.src}" style="width:100%;height:100%;object-fit:cover;">
            </a>
          </div>
        </div>
      `;
    }

    // VIDEO (FULL WIDTH)
    if (asset.type === "video") {
      videoHTML += `
        <div style="margin-bottom:10px;">
          <video controls style="width:100%;border-radius:10px;">
            <source src="${asset.src}" type="video/mp4">
          </video>
        </div>
      `;
    }

  });

  // =====================
  // EXPERIENCES
  // =====================
  let experienceHTML = "";

  experiences.forEach(exp => {
    experienceHTML += `
      <span class="badge rounded-pill me-1 mb-1 text-dark" style="border: 1px solid #9c9c9c; padding: 0.5rem;">${exp.name}</span>
    `;
  });

  // =====================
  // SOCIAL
  // =====================
  let socialHTML = "";

  socials.forEach(social => {
    socialHTML += `
      <div class="social-item">
        <a href="${social.url}" target="_blank" class="d-block text-decoration-none">
          
          <button class="btn btn-sm social-btn w-100 d-flex align-items-center gap-2 flex-column">
            
            ${social.icon ? `
              <img src="${social.icon}" 
                  style="width:20px;height:20px;object-fit:contain;">
            ` : ""}

            ${social.name ? `<span>${social.name}</span>` : ""}

          </button>

        </a>
      </div>
    `;
  });

  // =====================
  // RENDER CARD
  // =====================
  card.innerHTML = `
    
    <!-- TITLE + IMAGE -->
    <div class="card-body">
      <p class="h6">${title}</p>

      ${assetsHTML ? `
      <div style="padding-top:15px; padding-right:15px;">
        ${assetsHTML}
      </div>
      ` : ""}
    </div>

    <!-- VIDEO FULL -->
    ${videoHTML ? `
    <div class="card-body">
      ${videoHTML}
    </div>
    ` : ""}

    <!-- EXPERIENCE -->
    ${experienceHTML ? `
    <div style="padding-left:15px; padding-right:15px; padding-bottom:15px;">
      <p style="top:10px; position:relative;">Experience</p>
      ${experienceHTML}
    </div>
    ` : ""}

    <!-- SOCIAL -->
    ${socialHTML ? `
    <div style="padding-left:15px; padding-right:15px; padding-bottom:15px;">
      <div class="d-flex flex-wrap gap-2">
        ${socialHTML}
      </div>
    </div>
    ` : ""}

  `;
});