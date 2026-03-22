// =====================
// HELPER
// =====================
function convertYouTube(url) {
  const regExp = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/;
  const match = url.match(regExp);
  return match
    ? `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=1`
    : null;
}

// =====================
// CARD SYSTEM
// =====================
const cards = document.querySelectorAll(".set-card");

cards.forEach(card => {
  const title = card.dataset.title || "";

  let assets = [];
  let experiences = [];
  let socials = [];

  try {
    assets = JSON.parse(card.dataset.assets || "[]");
    experiences = JSON.parse(card.dataset.experiences || "[]");
    socials = JSON.parse(card.dataset.social || "[]");
  } catch (e) {
    console.error("JSON error:", e);
  }

  // =====================
  // ASSETS
  // =====================
  let assetsHTML = "";
  let videoHTML = "";

  assets.forEach(asset => {

    // 🖼 IMAGE (GRID)
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

    // 🎥 VIDEO LOCAL
    if (asset.type === "video") {
      videoHTML += `
        <div class="video-wrapper">
          <video controls autoplay muted loop>
            <source src="${asset.src}" type="video/mp4">
          </video>
        </div>
      `;
    }

    // ▶️ YOUTUBE (NEW 🔥)
    if (asset.type === "youtube") {
      const embed = convertYouTube(asset.src);
      if (!embed) return;

      videoHTML += `
        <div class="video-wrapper">
          <iframe src="${embed}" 
            frameborder="0"
            allowfullscreen>
          </iframe>
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
      <span class="badge rounded-pill me-1 mb-1 text-dark" 
        style="border: 1px solid #9c9c9c; padding: 0.5rem;">
        ${exp.name}
      </span>
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

// =====================
// TIMELINE SYSTEM
// =====================
const timelines = document.querySelectorAll(".set-timeline");

timelines.forEach(item => {
  const title = item.dataset.title || "";
  const year = item.dataset.year || "";
  const desc = item.dataset.desc || "";
  const logo = item.dataset.logo || "";

  item.outerHTML = `
    <article style="padding-bottom: 70px;">
      <div class='timeline__content'>
        <h3>${title}</h3>
        <h1><time class="font-concieliancondsemital">${year}</time></h1>
        <hr />
        <p>${desc}</p>
      </div>
      <img src="${logo}" />
    </article>
  `;
});