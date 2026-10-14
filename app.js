const canvas = document.getElementById("sky");
const ctx = canvas.getContext("2d");
const scenes = [...document.querySelectorAll(".scene")];
const form = document.getElementById("secret-form");
const secret = document.getElementById("secret");
const hint = document.getElementById("hint");

const stars = [];
const petals = [];
const WORD = "defdef";

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function seed() {
  stars.length = 0;
  petals.length = 0;
  const count = Math.min(140, Math.floor((canvas.width * canvas.height) / 9000));
  for (let i = 0; i < count; i += 1) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.3,
      a: Math.random(),
      s: Math.random() * 0.02 + 0.004,
    });
  }
  for (let i = 0; i < 18; i += 1) {
    petals.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 7 + 4,
      v: Math.random() * 0.45 + 0.15,
      w: Math.random() * 0.02 + 0.008,
      t: Math.random() * Math.PI * 2,
    });
  }
}

function drawPetal(p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(Math.sin(p.t) * 0.6);
  ctx.fillStyle = "rgba(239, 198, 188, 0.22)";
  ctx.beginPath();
  ctx.ellipse(0, 0, p.r * 0.55, p.r, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function tick() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
  g.addColorStop(0, "#1b0c14");
  g.addColorStop(1, "#0a0508");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const star of stars) {
    star.a += star.s;
    ctx.globalAlpha = 0.35 + Math.abs(Math.sin(star.a)) * 0.65;
    ctx.fillStyle = "#f7efe6";
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  for (const petal of petals) {
    petal.t += petal.w;
    petal.y += petal.v;
    petal.x += Math.sin(petal.t) * 0.4;
    if (petal.y > canvas.height + 12) {
      petal.y = -12;
      petal.x = Math.random() * canvas.width;
    }
    drawPetal(petal);
  }

  requestAnimationFrame(tick);
}

function show(id) {
  scenes.forEach((scene) => {
    const on = scene.dataset.scene === id;
    if (on) {
      scene.hidden = false;
      scene.classList.add("is-active");
    } else {
      scene.classList.remove("is-active");
      scene.hidden = true;
    }
  });
}

document.querySelectorAll("[data-next]").forEach((btn) => {
  btn.addEventListener("click", () => show(btn.dataset.next));
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = secret.value.trim().toLowerCase().replace(/\s+/g, "");
  if (value === WORD) {
    hint.hidden = true;
    show("letter");
    return;
  }
  hint.hidden = false;
  hint.textContent =
    value.includes("def") || value.includes("defne")
      ? "Yaklaştın… kalbin biliyor."
      : "O söz. İkimizin. Küçük harflerle bile yeter.";
  secret.focus();
});

document.getElementById("replay").addEventListener("click", () => {
  secret.value = "";
  hint.hidden = true;
  show("gate");
});

window.addEventListener("resize", () => {
  resize();
  seed();
});

resize();
seed();
tick();
