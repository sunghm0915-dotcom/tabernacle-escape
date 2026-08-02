/* ============================================================
   공용 배경 파티클 (모래바람 / 금빛 먼지)
   각 페이지에서: startParticles(canvas, { color:"#d4af5a", density:60 })
   색상·개수만 바꾸면 됩니다. 그 외에는 손댈 필요 없습니다.
   ============================================================ */
function startParticles(canvas, opts) {
  opts = opts || {};
  var color = opts.color || "#d4af5a";
  var density = opts.density || 50;
  var ctx = canvas.getContext("2d");
  var w, h, dots;

  function resize() {
    w = canvas.width = canvas.clientWidth * devicePixelRatio;
    h = canvas.height = canvas.clientHeight * devicePixelRatio;
  }
  function makeDot() {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      r: (Math.random() * 1.6 + 0.4) * devicePixelRatio,
      vx: (Math.random() - 0.55) * 0.15 * devicePixelRatio,
      vy: (Math.random() - 0.5) * 0.12 * devicePixelRatio,
      a: Math.random() * 0.6 + 0.15,
      tw: Math.random() * Math.PI * 2
    };
  }
  function init() {
    resize();
    dots = [];
    for (var i = 0; i < density; i++) dots.push(makeDot());
  }
  function frame() {
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < dots.length; i++) {
      var d = dots[i];
      d.x += d.vx; d.y += d.vy; d.tw += 0.02;
      if (d.x < -10) d.x = w + 10;
      if (d.x > w + 10) d.x = -10;
      if (d.y < -10) d.y = h + 10;
      if (d.y > h + 10) d.y = -10;
      var alpha = d.a * (0.6 + 0.4 * Math.sin(d.tw));
      ctx.beginPath();
      ctx.fillStyle = hexToRgba(color, alpha);
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(frame);
  }
  function hexToRgba(hex, a) {
    var v = hex.replace("#", "");
    var r = parseInt(v.substring(0, 2), 16);
    var g = parseInt(v.substring(2, 4), 16);
    var b = parseInt(v.substring(4, 6), 16);
    return "rgba(" + r + "," + g + "," + b + "," + a + ")";
  }
  window.addEventListener("resize", resize);
  init();
  requestAnimationFrame(frame);
}
