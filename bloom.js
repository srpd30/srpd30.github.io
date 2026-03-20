const canvas = document.getElementById('bloom-layer');
const ctx = canvas.getContext('2d');

// Layer 1
drawPlanets(ctx); // gambar planet/bloomsurface

// Layer 2 (bloom/lampu)
ctx.globalCompositeOperation = 'lighter'; // additive
ctx.filter = 'blur(20px)';
drawLamp(ctx, x, y, radius);
ctx.filter = 'none';
ctx.globalCompositeOperation = 'source-over';
