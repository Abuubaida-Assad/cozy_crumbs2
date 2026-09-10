// Animated Rotating Chocolate Chip Cookie Favicon
(function() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  let faviconLink = document.querySelector("link[rel*='icon']");
  if (!faviconLink) {
    faviconLink = document.createElement('link');
    faviconLink.rel = 'icon';
    document.head.appendChild(faviconLink);
  }

  let angle = 0;

  function drawCookie(rot) {
    ctx.clearRect(0, 0, 64, 64);
    ctx.save();
    ctx.translate(32, 32);
    ctx.rotate(rot);

    // Cookie Golden Base
    ctx.beginPath();
    ctx.arc(0, 0, 26, 0, Math.PI * 2);
    ctx.fillStyle = '#D4A373';
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#93582A';
    ctx.stroke();

    // Subtle edge crumb texture
    ctx.beginPath();
    ctx.arc(-8, -20, 2.5, 0, Math.PI * 2);
    ctx.arc(16, -14, 2, 0, Math.PI * 2);
    ctx.arc(-18, 10, 2.5, 0, Math.PI * 2);
    ctx.arc(12, 18, 2, 0, Math.PI * 2);
    ctx.fillStyle = '#B88250';
    ctx.fill();

    // Dark Chocolate Chips
    const chips = [
      { x: -10, y: -10, r: 4.5 },
      { x: 8, y: -8, r: 5 },
      { x: -6, y: 10, r: 4.8 },
      { x: 10, y: 8, r: 4 },
      { x: 0, y: -2, r: 3.8 },
      { x: -16, y: -2, r: 3.5 },
      { x: 15, y: -2, r: 3.5 },
      { x: 0, y: 16, r: 3.6 },
    ];

    ctx.fillStyle = '#2B170E';
    chips.forEach(chip => {
      ctx.beginPath();
      ctx.arc(chip.x, chip.y, chip.r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
    faviconLink.href = canvas.toDataURL('image/png');
  }

  function animate() {
    angle += 0.04;
    drawCookie(angle);
    requestAnimationFrame(animate);
  }

  // Throttle animation to 30fps to save performance
  let lastTime = 0;
  function loop(time) {
    if (time - lastTime > 35) {
      angle += 0.05;
      drawCookie(angle);
      lastTime = time;
    }
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
})();
