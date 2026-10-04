const CONFIG = {
  partnerName: "Layla Agustine",
  yourName: "Layla Agustine",
  // Isi jika ingin menghitung hari bersama, format: YYYY-MM-DD
  relationshipStart: "2026-01-01"
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const preloader = $("#preloader");
const giftBox = $("#giftBox");
const openGiftBtn = $("#openGiftBtn");
const surpriseSection = $("#surpriseSection");
const musicBtn = $("#musicBtn");
const bgMusic = $("#bgMusic");
const modal = $("#modal");
const modalContent = $("#modalContent");
const closeModal = $("#closeModal");
const toast = $("#toast");
const yesBtn = $("#yesBtn");
const noBtn = $("#noBtn");
const finalMessage = $("#finalMessage");

document.addEventListener("DOMContentLoaded", () => {
  $("#partnerName").textContent = CONFIG.partnerName;
  $("#yourName").textContent = CONFIG.yourName;
  calculateDays();
  createAmbientHearts();

  setTimeout(() => preloader.classList.add("hide"), 900);
});

function calculateDays() {
  const output = $("#daysTogether");
  if (!CONFIG.relationshipStart) {
    output.textContent = "∞";
    return;
  }

  const start = new Date(`${CONFIG.relationshipStart}T00:00:00`);
  const now = new Date();
  const diff = Math.floor((now - start) / 86400000);

  output.textContent = Number.isFinite(diff) && diff >= 0 ? diff : "∞";
}

function createAmbientHearts() {
  const container = $("#floatingHearts");

  setInterval(() => {
    if (document.hidden) return;

    const heart = document.createElement("span");
    heart.className = "float-heart";
    heart.textContent = Math.random() > 0.22 ? "♥" : "♡";
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.fontSize = `${12 + Math.random() * 24}px`;
    heart.style.animationDuration = `${7 + Math.random() * 7}s`;
    heart.style.animationDelay = `${Math.random() * .6}s`;
    container.appendChild(heart);

    setTimeout(() => heart.remove(), 15000);
  }, 900);
}

let giftOpened = false;

function openGift() {
  if (giftOpened) {
    surpriseSection.scrollIntoView({ behavior: "smooth" });
    return;
  }

  giftOpened = true;
  giftBox.classList.add("opening");
  openGiftBtn.textContent = "Yey! 💕";
  showToast("Kadonya dibuka! 💕");
  burstConfetti();

  setTimeout(() => {
    surpriseSection.classList.remove("hidden-section");
    surpriseSection.classList.add("show");
  }, 600);

  setTimeout(() => {
    surpriseSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 1050);
}

giftBox.addEventListener("click", openGift);
openGiftBtn.addEventListener("click", openGift);
giftBox.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    openGift();
  }
});

musicBtn.addEventListener("click", async () => {
  try {
    if (bgMusic.paused) {
      await bgMusic.play();
      musicBtn.classList.add("playing");
      musicBtn.querySelector(".music-icon").textContent = "♥";
    } else {
      bgMusic.pause();
      musicBtn.classList.remove("playing");
      musicBtn.querySelector(".music-icon").textContent = "♫";
    }
  } catch {
    showToast("Tambahkan file assets/musik.mp3 untuk musik 🎵");
  }
});

$$(".memory-card").forEach((card) => {
  card.addEventListener("click", () => {
    const type = card.dataset.type;
    const src = card.dataset.src;
    openMedia(type, src);
  });
});

function openMedia(type, src) {
  modalContent.innerHTML = "";

  if (type === "video") {
    const video = document.createElement("video");
    video.src = src;
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;

    video.addEventListener("error", () => showMissing(src));
    modalContent.appendChild(video);
  } else {
    const img = document.createElement("img");
    img.src = src;
    img.alt = "Foto kenangan";
    img.addEventListener("error", () => showMissing(src));
    modalContent.appendChild(img);
  }

  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function showMissing(src) {
  modalContent.innerHTML = `
    <div class="missing-media">
      <div style="font-size:3rem;margin-bottom:10px">💗</div>
      <h3 style="margin-bottom:10px">Media belum ditambahkan</h3>
      <p>Letakkan file <b>${src}</b> di folder website agar muncul di sini.</p>
    </div>
  `;
}

function closeMediaModal() {
  const video = modalContent.querySelector("video");
  if (video) video.pause();

  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

closeModal.addEventListener("click", closeMediaModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeMediaModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMediaModal();
});

yesBtn.addEventListener("click", () => {
  finalMessage.textContent = "Hehe, jawaban terbaik! Aku sayang kamu banyak-banyak 💗✨";
  burstConfetti(220);
  createHeartExplosion();
});

let dodgeCount = 0;
function dodgeNoButton() {
  dodgeCount += 1;
  const x = (Math.random() - .5) * 160;
  const y = (Math.random() - .5) * 90;

  noBtn.style.transform = `translate(${x}px, ${y}px) rotate(${(Math.random() - .5) * 12}deg)`;

  if (dodgeCount >= 4) {
    noBtn.textContent = "Yakin? 🥺";
  }
}

noBtn.addEventListener("mouseenter", dodgeNoButton);
noBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  dodgeNoButton();
}, { passive: false });
noBtn.addEventListener("click", () => {
  finalMessage.textContent = "Tombol ini kayaknya salah pencet deh 😌💞";
  dodgeNoButton();
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2400);
}

function createHeartExplosion() {
  for (let i = 0; i < 24; i++) {
    const heart = document.createElement("span");
    heart.textContent = "♥";
    heart.style.position = "fixed";
    heart.style.left = "50%";
    heart.style.top = "50%";
    heart.style.zIndex = "7000";
    heart.style.pointerEvents = "none";
    heart.style.color = ["#ff3f87", "#ff7daf", "#ffd1e2", "#ffffff"][Math.floor(Math.random() * 4)];
    heart.style.fontSize = `${14 + Math.random() * 26}px`;
    document.body.appendChild(heart);

    const angle = Math.random() * Math.PI * 2;
    const distance = 80 + Math.random() * 230;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    heart.animate(
      [
        { transform: "translate(-50%,-50%) scale(.5)", opacity: 1 },
        { transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1.4)`, opacity: 0 }
      ],
      { duration: 1200 + Math.random() * 600, easing: "cubic-bezier(.15,.7,.25,1)" }
    ).onfinish = () => heart.remove();
  }
}

/* Confetti ringan tanpa library */
const canvas = $("#confettiCanvas");
const ctx = canvas.getContext("2d");
let particles = [];
let confettiAnimation;

function resizeCanvas() {
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function burstConfetti(count = 150) {
  cancelAnimationFrame(confettiAnimation);

  const colors = ["#ff4f93", "#ff86b8", "#ffd15c", "#ffffff", "#ffb5d2"];
  particles = Array.from({ length: count }, () => ({
    x: innerWidth / 2,
    y: innerHeight * .35,
    vx: (Math.random() - .5) * 13,
    vy: -5 - Math.random() * 11,
    gravity: .18 + Math.random() * .12,
    size: 5 + Math.random() * 6,
    rotation: Math.random() * Math.PI,
    vr: (Math.random() - .5) * .28,
    alpha: 1,
    color: colors[Math.floor(Math.random() * colors.length)]
  }));

  animateConfetti();
}

function animateConfetti() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.vx *= .994;
    p.rotation += p.vr;
    p.alpha -= .006;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = Math.max(p.alpha, 0);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * .65);
    ctx.restore();
  });

  particles = particles.filter(p => p.alpha > 0 && p.y < innerHeight + 80);

  if (particles.length) {
    confettiAnimation = requestAnimationFrame(animateConfetti);
  } else {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
  }
}
