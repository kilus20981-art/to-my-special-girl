
/* ========================================
   1. CÁC VÒNG CHỮ XOAY QUANH TRÁI TIM
======================================== */

const ringMessages = [
  {
    id: "ringOne",
    text: "CHÚC MỪNG 20/10 ✦ ANH YÊU EM ✦ ",
    count: 20
  },
  {
    id: "ringTwo",
    text: "EM LUÔN HẠNH PHÚC ♡ THƯƠNG EM ♡ ",
    count: 22
  },
  {
    id: "ringThree",
    text: "HAPPY WOMEN'S DAY ✦ FOREVER LOVE ✦ ",
    count: 24
  }
];

ringMessages.forEach(ring => {
  const container = document.getElementById(ring.id);

  for (let i = 0; i < ring.count; i++) {
    const span = document.createElement("span");
    span.textContent = ring.text[i % ring.text.length];

    const angle = (360 / ring.count) * i;

    span.style.setProperty("--angle", `${angle}deg`);
    span.style.setProperty("--radius", "var(--ring-radius, 130px)");

    container.appendChild(span);
  }
});

// Bán kính chữ khác nhau cho từng vòng
document.querySelector(".orbit-one")
  .style.setProperty("--ring-radius", "155px");

document.querySelector(".orbit-two")
  .style.setProperty("--ring-radius", "125px");

document.querySelector(".orbit-three")
  .style.setProperty("--ring-radius", "100px");


/* ========================================
   2. CHỮ BAY LIÊN TỤC TỪ TRÊN XUỐNG
======================================== */

const floatingWords = document.getElementById("floatingWords");

const messages = [
  "CHÚC MỪNG NGÀY 20/10 💗",
  "ANH YÊU EM ♡",
  "CHÚC EM LUÔN HẠNH PHÚC",
  "EM LÀ ĐIỀU ĐẶC BIỆT",
  "MONG EM LUÔN MỈM CƯỜI",
  "HAPPY WOMEN'S DAY 🌷",
  "THƯƠNG EM THẬT NHIỀU",
  "EM XỨNG ĐÁNG VỚI ĐIỀU TỐT ĐẸP",
  "YOU ARE MY FAVORITE ♡",
  "CHÚC EM LUÔN BÌNH AN",
  "GỬI EM NGÀN YÊU THƯƠNG",
  "CẢM ƠN VÌ EM ĐÃ ĐẾN",
  "MÃI TRÂN TRỌNG EM",
  "LOVE YOU FOREVER ♡",
  "🌸 20/10 VUI VẺ NHÉ EM 🌸"
];

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

function createFloatingWord() {
  if (document.hidden || reduceMotion) return;

  // Giữ số chữ vừa phải để máy không bị nặng
  while (floatingWords.children.length >= 32) {
    floatingWords.firstElementChild.remove();
  }

  const word = document.createElement("span");
  word.className = "floating-word";

  word.textContent =
    messages[Math.floor(Math.random() * messages.length)];

  word.style.left = `${Math.random() * 80 + 5}%`;
  word.style.fontSize = `${11 + Math.random() * 7}px`;
  word.style.animationDuration = `${8 + Math.random() * 8}s`;
  word.style.setProperty(
    "--drift",
    `${Math.random() * 180 - 90}px`
  );

  floatingWords.appendChild(word);

  word.addEventListener("animationend", () => {
    word.remove();
  }, { once: true });
}

if (!reduceMotion) {
  createFloatingWord();

  // Cứ 550ms tạo thêm một câu chữ
  setInterval(() => {
    if (!document.hidden) {
      createFloatingWord();
    }
  }, 550);
}


/* ========================================
   3. TRÁI TIM TẠO TỪ HẠT SÁNG
======================================== */

const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");

let width = 0;
let height = 0;
let particles = [];
let stars = [];
let animationFrame = 0;

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);

  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  createParticles();
  createStars();
}

function heartPoint(t) {
  // Công thức đường cong trái tim
  const x = 16 * Math.pow(Math.sin(t), 3);

  const y =
    13 * Math.cos(t)
    - 5 * Math.cos(2 * t)
    - 2 * Math.cos(3 * t)
    - Math.cos(4 * t);

  return { x, y };
}

function createParticles() {
  particles = [];

  const count = Math.min(
    480,
    Math.max(200, Math.floor(width * height / 2200))
  );

  const scale = Math.min(width * 0.017, height * 0.014, 12);

  for (let i = 0; i < count; i++) {
    const t = Math.random() * Math.PI * 2;
    const edge = Math.random() > 0.45;
    const point = heartPoint(t);

    const spread = edge
      ? 0.87 + Math.random() * 0.15
      : Math.sqrt(Math.random()) * 0.88;

    particles.push({
      x: point.x * scale * spread,
      y: -point.y * scale * spread,
      size: Math.random() * 1.8 + 0.5,
      alpha: Math.random() * 0.7 + 0.25,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 1.5 + 0.5,
      drift: Math.random() * 3
    });
  }
}

function createStars() {
  stars = [];

  const count = Math.min(
    150,
    Math.floor(width * height / 7000)
  );

  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.3 + 0.2,
      alpha: Math.random() * 0.6 + 0.1,
      phase: Math.random() * Math.PI * 2
    });
  }
}

let startTime = performance.now();

function drawParticles(now) {
  ctx.clearRect(0, 0, width, height);

  const time = (now - startTime) / 1000;
  const cx = width / 2;
  const cy = height * 0.43;
  const scale = Math.min(width * 0.017, height * 0.014, 12);

  // Những ngôi sao nhỏ trong nền
  stars.forEach(star => {
    const twinkle =
      star.alpha * (0.55 + 0.45 * Math.sin(time * 1.5 + star.phase));

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 183, 224, ${twinkle})`;
    ctx.fill();
  });

  // Vầng sáng mờ phía sau trái tim
  const glow = ctx.createRadialGradient(
    cx, cy, 0,
    cx, cy, scale * 21
  );

  glow.addColorStop(0, "rgba(255, 40, 145, 0.13)");
  glow.addColorStop(0.5, "rgba(200, 20, 110, 0.045)");
  glow.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = glow;
  ctx.fillRect(
    cx - scale * 21,
    cy - scale * 21,
    scale * 42,
    scale * 42
  );

  // Vẽ các hạt tạo thành trái tim
  particles.forEach(p => {
    const twinkle =
      0.45 + 0.55 * Math.sin(time * p.speed + p.phase);

    const x = cx + p.x;
    const y = cy + p.y + Math.sin(time + p.phase) * p.drift;

    ctx.beginPath();
    ctx.arc(x, y, p.size * (0.7 + twinkle * 0.5), 0, Math.PI * 2);

    ctx.shadowBlur = 5 + twinkle * 9;
    ctx.shadowColor = "#ff4ca9";

    ctx.fillStyle =
      `rgba(255, ${100 + Math.floor(twinkle * 100)}, 190, ${p.alpha * twinkle})`;

    ctx.fill();
  });

  ctx.shadowBlur = 0;

  // Một vài hạt sáng bay quanh trái tim
  for (let i = 0; i < 16; i++) {
    const angle = time * 0.28 + i * Math.PI * 2 / 16;
    const radius = scale * (17 + Math.sin(time + i) * 1.5);

    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius * 0.72;

    ctx.beginPath();
    ctx.arc(x, y, 1.2, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 160, 215, 0.75)";
    ctx.fill();
  }

  animationFrame = requestAnimationFrame(drawParticles);
}

resizeCanvas();
animationFrame = requestAnimationFrame(drawParticles);

window.addEventListener("resize", resizeCanvas);


/* ========================================
   4. CHUYỂN TRANG MƯỢT MÀ
======================================== */

const pages = document.querySelectorAll(".page");
let currentPage = "page-home";
let switching = false;

function goToPage(pageId) {
  if (switching || pageId === currentPage) return;

  const nextPage = document.getElementById(pageId);
  const oldPage = document.getElementById(currentPage);

  if (!nextPage || !oldPage) return;

  switching = true;

  oldPage.classList.remove("active");
  oldPage.classList.add("leaving");

  nextPage.classList.remove("leaving");

  // Đợi trang cũ mờ đi rồi hiện trang mới
  setTimeout(() => {
    oldPage.classList.remove("leaving");

    nextPage.classList.add("active");
    currentPage = pageId;

    // Đưa nội dung trang mới về đầu
    nextPage.scrollTop = 0;

    setTimeout(() => {
      switching = false;
    }, 650);
  }, 280);
}

document.querySelectorAll("[data-go]").forEach(button => {
  button.addEventListener("click", () => {
    goToPage(button.dataset.go);
  });
});


/* ========================================
   5. TẠM DỪNG HIỆU ỨNG KHI ẨN TAB
======================================== */

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    cancelAnimationFrame(animationFrame);
  } else {
    startTime = performance.now();
    animationFrame = requestAnimationFrame(drawParticles);
  }
});
