// =====================
// HELPER
// =====================
function convertYouTube(url) {
    const regExp = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/;
    const match = url.match(regExp);
    return match ?
        `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=1` :
        null;
}

// =====================
// LAZY LOAD IMAGES
// Gambar di-load hanya saat mendekati viewport
// =====================
function setupLazyLoad() {
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '200px 0px' // mulai load 200px sebelum masuk viewport
        });

        document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
    } else {
        // Fallback: langsung load semua jika browser tidak support
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
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

            let assetsHTML = "";
            let videoHTML = "";

            // =====================
            // ASSETS LOOP
            // =====================
            assets.forEach((asset, index) => {

                        // 🔥 IMAGE FULL (THUMBNAIL BESAR)
                        if (asset.type === "image-full") {
                            assetsHTML += `
      <div class="full-image-wrapper" 
        style="margin-bottom:15px; top:30px; aspect-ratio:16/9; overflow:hidden; border-radius:8px;">
        <img 
          ${index < 3 ? `src="${asset.src}"` : `data-src="${asset.src}" src=""`}
          loading="lazy"
          decoding="async"
          style="width:100%; height:100%; object-fit:cover;">
      </div>
    `;
        }

        // 🖼 IMAGE GRID — 16:9, lazy load, clearfix
        else if (asset.type === "image") {
            assetsHTML += `
        <div class="responsive">
          <div class="gallery">
            <a href="${asset.src}" target="_blank">
              <img 
                ${index < 3 ? `src="${asset.src}"` : `data-src="${asset.src}" src=""`}
                loading="lazy"
                decoding="async"
                style="width:100%;height:100%;object-fit:cover;"
                alt="">
            </a>
          </div>
        </div>
      `;
        }

        // 🎥 VIDEO LOCAL
        else if (asset.type === "video") {
            videoHTML += `
        <div class="video-wrapper">
          <video controls autoplay muted loop loading="lazy">
            <source src="${asset.src}" type="video/mp4">
          </video>
        </div>
      `;
        }

        // ▶️ YOUTUBE
        else if (asset.type === "youtube") {
            const embed = convertYouTube(asset.src);
            if (!embed) return;

            videoHTML += `
        <div class="video-wrapper">
          <iframe src="${embed}" 
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            loading="lazy">
          </iframe>
        </div>
      `;
        }

    });

    // Tutup clearfix setelah grid image
    if (assetsHTML.includes('responsive')) {
        assetsHTML += `<div class="clearfix"></div>`;
    }

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
    // Nama selalu tampil (flex-direction: column di CSS)
    // =====================
    let socialHTML = "";

    socials.forEach(social => {
        socialHTML += `
      <div class="social-item">
        <a href="${social.url}" target="_blank" class="d-block text-decoration-none">
          <button class="btn btn-sm social-btn w-100 d-flex align-items-center gap-2 flex-column">
            
            ${social.icon ? `
              <img src="${social.icon}" 
                width="20" height="20"
                loading="lazy"
                decoding="async"
                style="object-fit:contain;"
                alt="${social.name || ''}">
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

    <!-- VIDEO -->
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

// Aktifkan lazy load setelah semua card di-render
setupLazyLoad();

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
      <img src="${logo}" loading="lazy" decoding="async" />
    </article>
  `;
});