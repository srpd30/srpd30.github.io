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
// IMAGE QUEUE LOADER
// Max 3 bersamaan, sisanya antri
// =====================
const imageQueue = [];
let activeLoads = 0;
const MAX_CONCURRENT = 3;

function enqueueImage(img) {
    imageQueue.push(img);
    processQueue();
}

function processQueue() {
    while (activeLoads < MAX_CONCURRENT && imageQueue.length > 0) {
        const img = imageQueue.shift();
        loadImage(img);
    }
}

function loadImage(img) {
    const wrapper = img.closest('.skeleton-wrap');
    activeLoads++;

    const realSrc = img.dataset.lazySrc;
    if (!realSrc) {
        activeLoads--;
        processQueue();
        return;
    }
    img.removeAttribute('data-lazy-src');

    // Tampilkan gambar hasil compress ke <img>
    const revealImg = (src) => {
        img.src = src;
        img.addEventListener('load', () => {
            if (wrapper) {
                wrapper.classList.add('img-loaded');
                setTimeout(() => {
                    wrapper.classList.remove('is-loading');
                    wrapper.classList.remove('img-loaded');
                    img.style.clipPath = 'none';
                    img.style.opacity  = '1';
                }, 650);
            }
            activeLoads--;
            processQueue();
        }, { once: true });
        img.addEventListener('error', () => {
            if (wrapper) wrapper.classList.remove('is-loading');
            activeLoads--;
            processQueue();
        }, { once: true });
    };

    // ── Compress via Canvas sebelum ditampilkan ──
    // Max 800px lebar, quality 0.65 — tajam di layar tapi jauh lebih ringan
    const tempImg = new Image();
    tempImg.crossOrigin = 'anonymous';

    tempImg.onload = () => {
        try {
            const MAX_W   = 800;
            const MAX_H   = 600;
            const QUALITY = 0.65;

            let w = tempImg.naturalWidth;
            let h = tempImg.naturalHeight;

            // Scale down proporsional
            if (w > MAX_W) { h = Math.round(h * MAX_W / w); w = MAX_W; }
            if (h > MAX_H) { w = Math.round(w * MAX_H / h); h = MAX_H; }

            const canvas = document.createElement('canvas');
            canvas.width  = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(tempImg, 0, 0, w, h);

            const compressed = canvas.toDataURL('image/jpeg', QUALITY);
            revealImg(compressed);
        } catch (e) {
            // CORS blocked atau canvas tainted — fallback ke src asli
            revealImg(realSrc);
        }
    };

    tempImg.onerror = () => revealImg(realSrc);
    tempImg.src = realSrc;
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

    assets.forEach((asset) => {

        if (asset.type === "image-full") {
            assetsHTML += `
      <div class="skeleton-wrap full-image-wrapper is-loading"
        style="margin-bottom:15px; top:30px; aspect-ratio:16/9; overflow:hidden; border-radius:8px;">
        <img
          data-lazy-src="${asset.src}"
          decoding="async"
          style="width:100%; height:100%; object-fit:cover; clip-path:inset(0 0 100% 0);"
          alt="">
      </div>
    `;
        }

        else if (asset.type === "image") {
            assetsHTML += `
        <div class="responsive">
          <div class="skeleton-wrap gallery is-loading">
            <a href="${asset.src}" target="_blank">
              <img
                data-lazy-src="${asset.src}"
                decoding="async"
                style="width:100%;height:100%;object-fit:cover;clip-path:inset(0 0 100% 0);"
                alt="">
            </a>
          </div>
        </div>
      `;
        }

        else if (asset.type === "video") {
            videoHTML += `
        <div class="video-wrapper">
          <video controls autoplay muted loop loading="lazy">
            <source src="${asset.src}" type="video/mp4">
          </video>
        </div>
      `;
        }

        else if (asset.type === "youtube") {
            const embed = convertYouTube(asset.src);
            if (!embed) return;
            videoHTML += `
        <div class="video-wrapper">
          <iframe src="${embed}"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen loading="lazy">
          </iframe>
        </div>
      `;
        }
    });

    if (assetsHTML.includes('responsive')) {
        assetsHTML += `<div class="clearfix"></div>`;
    }

    let experienceHTML = "";
    experiences.forEach(exp => {
        experienceHTML += `
      <span class="badge rounded-pill me-1 mb-1 text-dark"
        style="border: 1px solid #9c9c9c; padding: 0.5rem;">
        ${exp.name}
      </span>
    `;
    });

    let socialHTML = "";
    socials.forEach(social => {
        socialHTML += `
      <div class="social-item">
        <a href="${social.url}" target="_blank" class="d-block text-decoration-none">
          <button class="btn btn-sm social-btn w-100 d-flex align-items-center gap-2 flex-column">
            ${social.icon ? `
              <img src="${social.icon}"
                width="20" height="20" loading="lazy" decoding="async"
                style="object-fit:contain;" alt="${social.name || ''}">
            ` : ""}
            ${social.name ? `<span>${social.name}</span>` : ""}
          </button>
        </a>
      </div>
    `;
    });

    card.innerHTML = `
    <div class="card-body">
      <p class="h6">${title}</p>
      ${assetsHTML ? `<div style="padding-top:15px; padding-right:15px;">${assetsHTML}</div>` : ""}
    </div>
    ${videoHTML ? `<div class="card-body">${videoHTML}</div>` : ""}
    ${experienceHTML ? `
    <div style="padding-left:15px; padding-right:15px; padding-bottom:15px;">
      <p style="top:10px; position:relative;">Experience</p>
      ${experienceHTML}
    </div>` : ""}
    ${socialHTML ? `
    <div style="padding-left:15px; padding-right:15px; padding-bottom:15px;">
      <div class="d-flex flex-wrap gap-2">${socialHTML}</div>
    </div>` : ""}
  `;
});

// =====================
// MULAI QUEUE — hanya gambar dekat viewport yang masuk antrian
// =====================
if ('IntersectionObserver' in window) {
    const viewObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                enqueueImage(entry.target);
                viewObserver.unobserve(entry.target);
            }
        });
    }, { rootMargin: '300px 0px' });

    document.querySelectorAll('img[data-lazy-src]').forEach(img => {
        viewObserver.observe(img);
    });
} else {
    document.querySelectorAll('img[data-lazy-src]').forEach(img => enqueueImage(img));
}

// =====================
// TIMELINE SYSTEM
// =====================
const timelines = document.querySelectorAll(".set-timeline");
timelines.forEach(item => {
    const title = item.dataset.title || "";
    const year  = item.dataset.year  || "";
    const desc  = item.dataset.desc  || "";
    const logo  = item.dataset.logo  || "";

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

// =====================
// PERSONAL PROJECTS BUTTON — CLICK TRANSITION
// Klik → animasi glitch 1 detik → navigasi
// =====================
const personalBtn = document.querySelector('.btn-glitch-personal');
if (personalBtn) {
    personalBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        this.classList.add('is-clicked');
        setTimeout(() => {
            window.location.href = href;
        }, 1000);
    });
}
