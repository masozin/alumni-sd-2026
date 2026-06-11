/* ── PARTIKEL HOLOGRAFIK ── */
particlesJS("particles-js", {
particles: {
    number: { value: 120, density: { enable: true, value_area: 900 } },
    color: { value: ["#00d4ff", "#7c3aed", "#a78bfa", "#80eeff"] },
    shape: { type: "circle" },
    opacity: {
    value: 0.45,
    random: true,
    anim: { enable: true, speed: 0.8, opacity_min: 0.05 },
    },
    size: {
    value: 1.8,
    random: true,
    anim: { enable: true, speed: 2, size_min: 0.3 },
    },
    line_linked: {
    enable: true,
    distance: 130,
    color: "#00d4ff",
    opacity: 0.08,
    width: 1,
    },
    move: {
    enable: true,
    speed: 0.6,
    direction: "none",
    random: true,
    straight: false,
    out_mode: "out",
    bounce: false,
    },
},
interactivity: {
    detect_on: "canvas",
    events: {
    onhover: { enable: true, mode: "grab" },
    onclick: { enable: true, mode: "push" },
    resize: true,
    },
    modes: {
    grab: { distance: 140, line_linked: { opacity: 0.25 } },
    push: { particles_nb: 2 },
    },
},
retina_detect: true,
});

/* ── STATE ── */
let students = [],
cur = 0,
transitioning = false,
navDir = "next";
let ap = false,
tRaf = null,
tStart = null,
tElapsed = 0;

// ▼▼▼ PENGATURAN DURASI ▼▼▼
const AUTO = 15000; // ⏱ Durasi tiap slide (milidetik). 15000 = 15 detik
const FLIP_DELAY = 7000; // 🖼 Jeda sebelum foto ke-2 muncul (milidetik). 7000 = 7 detik
// ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

const CIRC = 2 * Math.PI * 16.5;
const flipState = {};

/* ── LOAD DATA ── */
async function load() {
try {
    const r = await fetch("data.json");
    students = await r.json();
} catch {
    students = [
    {
        nama: "Ahmad Fauzi",
        ttl: "Palembang, 15 Maret 2014",
        namaAyah: "Budi Santoso",
        namaIbu: "Sri Wahyuni",
        citaCita: "Dokter Spesialis Anak",
        pesan: "Jadilah orang yang bermanfaat bagi sesama.",
        foto: "",
        fotoCita: "",
    },
    {
        nama: "Siti Rahmawati",
        ttl: "Totorejo, 22 Juli 2014",
        namaAyah: "Rahmat Hidayat",
        namaIbu: "Nurul Fadilah",
        citaCita: "Guru Bahasa Inggris",
        pesan: "Terus belajar dan jangan pernah menyerah.",
        foto: "",
        fotoCita: "",
    },
    {
        nama: "Budi Prasetyo",
        ttl: "Totorejo, 3 Januari 2014",
        namaAyah: "Suryanto",
        namaIbu: "Dewi Lestari",
        citaCita: "Insinyur Sipil",
        pesan: "Kerja keras dan doa adalah kuncinya.",
        foto: "",
        fotoCita: "",
    },
    ];
}
students.push({ isPenutup: true });
renderCards();
buildDots();
// showCard(0, true);
renderSidebar();
}

/* ── RENDER KARTU ── */
function renderCards() {
const vp = document.getElementById("viewport");
vp.innerHTML = "";
students.forEach((s, i) => {
    const el = document.createElement("div");
    el.className = "card";
    if (s.isPenutup) {
    el.classList.add("card-closing");
    el.innerHTML = `
<div class="closing-spotlight"></div>
<div class="closing-particles">
    <div class="c-particle"></div>
    <div class="c-particle"></div>
    <div class="c-particle"></div>
</div>

<div class="closing-content ai" style="animation-delay:.1s">
    <h2 class="closing-title gold-text">Terima Kasih</h2>
    
    <div class="closing-divider">
    <span class="c-line"></span>
    <span class="c-gem">◈</span>
    <span class="c-line"></span>
    </div>

    <div class="closing-tag">Masa Depan Menanti</div>

    <p class="closing-quote">
    "Masa depan adalah milik mereka yang percaya pada keindahan impian mereka.
    Teruslah melangkah, jagalah api semangat belajarmu, dan jadilah kebanggaan
    bagi nusa dan bangsa."
    </p>
    
    <div class="closing-footer">
    <p class="closing-school">SD Negeri 01 Toto Rejo</p>
    <p class="closing-year">Tahun Ajaran 2025/2026</p>
    </div>
    
</div>
<div class="closing-qr-wrapper">
    <img src="logo/qr.png" alt="Scan Slide" class="closing-qr" 
        onerror="this.src='https://api.qrserver.com/v1/create-qr-code/?size=150x150&data='+encodeURIComponent(window.location.href)+'&color=ddb043&bgcolor=020617'">
    <p class="qr-text">Scan Slide 📸</p>
</div>`;
    } else {
    const siswaNo = i + 1;
    const initials = encodeURIComponent(s.nama);
    el.innerHTML = `
<div class="card-photo">
    <div class="photo-frame">
    <div class="photo-orbit"></div>
    <div class="photo-ring"></div>
    <div class="flip-scene" data-fi="${i}" title="Klik untuk lihat cita-cita ✨">
        <div class="flip-front">
        <img src="${s.foto}" alt="${s.nama}"
            onerror="this.onerror=null; this.src='logo/avatar.svg';">
        </div>
        <div class="flip-back">
        <img src="${s.fotoCita || s.foto}" alt="${s.nama} — ${s.citaCita}"
            onerror="this.onerror=null; this.src='logo/cita-cita.svg';">
        </div>
    </div>
    <div class="photo-dots">
        <div class="pd pa" data-pi="${i}" data-side="0" title="Sekarang"></div>
        <div class="pd"    data-pi="${i}" data-side="1" title="Masa depan"></div>
    </div>
    <div class="photo-label" id="plbl-${i}">Sekarang</div>
    </div>
</div>
<div class="card-divider"></div>
<div class="card-info">
    <div class="card-number-bg">${String(siswaNo).padStart(2, "0")}</div>
    <h2 class="s-name ai" style="animation-delay:.05s"><span class="gold-text">${s.nama}</span></h2>
    <div class="s-rule ai" style="animation-delay:.18s"></div>
    <div class="info-table">
    <div class="info-row ai" style="animation-delay:.24s">
        <span class="info-label">TTL</span>
        <span class="info-sep">◆</span>
        <span class="info-val">${s.ttl}</span>
    </div>
    <div class="info-row ai" style="animation-delay:.30s">
        <span class="info-label">Nama Ayah</span>
        <span class="info-sep">◆</span>
        <span class="info-val">${s.namaAyah}</span>
    </div>
    <div class="info-row ai" style="animation-delay:.36s">
        <span class="info-label">Nama Ibu</span>
        <span class="info-sep">◆</span>
        <span class="info-val">${s.namaIbu}</span>
    </div>
    </div>
    <div class="dream-box ai" style="animation-delay:.44s">
    <p class="dream-tag">◈ Cita-cita</p>
    <p class="dream-val">${s.citaCita}</p>
    <p class="dream-quote-tag">◈ Pesan &amp; Kesan</p>
    <p class="dream-quote">"${s.pesan}"</p>
    </div>
</div>`;
    }
    vp.appendChild(el);
});

/* Event listener flip */
document.querySelectorAll(".flip-scene").forEach((fs) => {
    fs.addEventListener("click", () => doFlip(parseInt(fs.dataset.fi)));
});
document.querySelectorAll(".pd").forEach((d) => {
    d.addEventListener("click", (e) => {
    e.stopPropagation();
    const idx = parseInt(d.dataset.pi);
    const side = parseInt(d.dataset.side);
    if (flipState[idx] !== (side === 1)) doFlip(idx);
    });
});

/* Tilt 3D pada kartu desktop */
document.querySelectorAll(".card").forEach((c) => {
    c.addEventListener("mousemove", (e) => {
    if (!c.classList.contains("active")) return;
    const r = c.getBoundingClientRect();
    const mx = (e.clientX - r.left) / r.width - 0.5;
    const my = (e.clientY - r.top) / r.height - 0.5;
    c.style.transform = `perspective(1200px) rotateY(${mx * 6}deg) rotateX(${-my * 4}deg) scale(1.01)`;
    });
    c.addEventListener("mouseleave", () => {
    c.style.transform = "";
    });
});
}

/* ── FLIP FOTO ── */
function doFlip(idx) {
flipState[idx] = !flipState[idx];
const flipped = flipState[idx];
const scene = document.querySelector(`.flip-scene[data-fi="${idx}"]`);
const lbl = document.getElementById(`plbl-${idx}`);
const dots = document.querySelectorAll(`.pd[data-pi="${idx}"]`);
if (!scene) return;
scene.classList.toggle("flipped", flipped);
if (lbl) {
    lbl.style.opacity = "0";
    setTimeout(() => {
    lbl.textContent = flipped ? "Masa depan ◈" : "Sekarang";
    lbl.style.opacity = "1";
    }, 900);
}
dots.forEach((d, i) =>
    d.classList.toggle("pa", flipped ? i === 1 : i === 0),
);
}

/* ── AUTO FLIP (7 detik setelah ganti slide) ── */
function autoFlipCheck() {
if (students[cur]?.isPenutup) return;
if (!flipState[cur]) doFlip(cur);
}

/* ── RESET FLIP ── */
function resetFlip(idx) {
const scene = document.querySelector(`.flip-scene[data-fi="${idx}"]`);
const lbl = document.getElementById(`plbl-${idx}`);
const dots = document.querySelectorAll(`.pd[data-pi="${idx}"]`);

if (scene) {
    scene.style.transition = "none"; // 1. Matikan animasi transisi CSS sementara
    scene.classList.remove("flipped");
    void scene.offsetHeight; // 2. Paksa browser menerapkan perubahan wujud instan
    scene.style.transition = ""; // 3. Kembalikan transisi CSS bawaan untuk flip otomatis nanti
}
if (lbl) {
    lbl.style.transition = "none";
    lbl.textContent = "Sekarang";
    lbl.style.opacity = "1";
    void lbl.offsetHeight;
    lbl.style.transition = "";
}
dots.forEach((d, i) => d.classList.toggle("pa", i === 0));
}

/* ── ANIMASI MASUK ULANG ── */
function replayAnimations(card) {
card.querySelectorAll(".ai").forEach((el) => {
    el.style.animation = "none";
    void el.offsetHeight;
    el.style.animation = "";
});
}

/* ── DOTS & COUNTER ── */
function buildDots() {
const wrap = document.getElementById("dotsWrap");
wrap.innerHTML = "";
if (students.length <= 18) {
    students.forEach((_, i) => {
    const d = document.createElement("div");
    d.className = "dot";
    d.addEventListener("click", () => goto(i));
    wrap.appendChild(d);
    });
}
}
function updateDots() {
document
    .querySelectorAll(".dot")
    .forEach((d, i) => d.classList.toggle("active", i === cur));
if (cur + 1 == students.length) {
    document.getElementById("slideCounter").textContent = `End`;
} else {
    document.getElementById("slideCounter").textContent =
    `${cur + 1} / ${students.length - 1}`;
}
}

/* ── SHOW SLIDE ── */
function showCard(idx, init = false) {
const cards = document.querySelectorAll(".card");
cards.forEach((c, i) => {
    if (i === idx) {
    c.classList.remove(
        "exit-left",
        "exit-right",
        "enter-right",
        "enter-left",
    );
    if (!init) {
        c.classList.add(navDir === "next" ? "enter-right" : "enter-left");
        void c.offsetWidth;
    }
    c.classList.add("active");
    replayAnimations(c);
    if (flipState[i]) {
        flipState[i] = false;
        resetFlip(i);
    }
    setTimeout(() => {
        if (cur === i) autoFlipCheck();
    }, FLIP_DELAY);
    } else {
    c.classList.remove("active", "enter-right", "enter-left");
    }
});
updateDots();
updateSidebarActive();
}

/* ── NAVIGASI ── */
function goto(idx) {
if (transitioning || idx === cur) return;
transitioning = true;
navDir = idx > cur ? "next" : "prev";
const prev = cur;
cur = idx;

// ▼▼▼ TAMBAHKAN BLOK KODE INI DI SINI, BRO! ▼▼▼
// Reset foto target secara instan di detik 0 sebelum slide mulai bergeser masuk
if (flipState[cur]) {
    flipState[cur] = false;
    resetFlip(cur);
}
// ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

const cards = document.querySelectorAll(".card");
cards[prev].classList.remove("active");
cards[prev].classList.add(
    navDir === "next" ? "exit-left" : "exit-right",
);
setTimeout(() => {
    cards[prev].classList.remove("exit-left", "exit-right");
    transitioning = false;
}, 800);
setTimeout(() => showCard(cur), 300);

// ▼ PENGKONDISIAN DI SLIDE TERAKHIR (ANTI OVERRIDE) ▼
if (cur === students.length - 1) {
    if (ap) {
    stopTimer();
    ap = false;
    }
    trFill.style.strokeDashoffset = CIRC;

    // Trik utama: Diberi jeda 50ms agar dieksekusi paling terakhir setelah
    // sisa frame animasi timer bawaan template benar-benar bersih & berhenti.
    setTimeout(() => {
    timerIcon.innerHTML = "&#8635;"; // Pasti terkunci ke ikon Reload (↻)
    }, 50);
} else {
    // Jika bukan slide terakhir, jalankan sistem normal
    if (ap) restartTimer();
    else timerIcon.innerHTML = "&#9654;";
}
// ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
}

function chg(d) {
const n = students.length;
let next = cur + d;
if (next >= n) {
    if (ap) toggleAP();
    return;
}
if (next < 0) return;
goto(next);
}

/* ── AUTOPLAY ── */
const trFill = document.getElementById("trFill");
const timerIcon = document.getElementById("timerIcon");
trFill.style.strokeDasharray = CIRC;
trFill.style.strokeDashoffset = CIRC;

function toggleAP() {
if (cur === students.length - 1) {
    location.reload(); // Muat ulang halaman dari awal
    return;
}
ap = !ap;
timerIcon.innerHTML = ap ? "&#9646;&#9646;" : "&#9654;";
if (ap) {
    startTimer();
    // TAMBAHAN: Fade in musik saat slide dilanjutkan kembali (jika tidak di-mute user)
    if (audio && !muted) fadeInAudio(800);
} else {
    stopTimer();
    trFill.style.strokeDashoffset = CIRC;
    // TAMBAHAN: Fade out musik secara halus saat slide di-pause
    if (audio) {
    fadeOutAudio(1000, () => {
        audio.pause();
    });
    }
}
}
function startTimer() {
tStart = performance.now() - tElapsed;
tRaf = requestAnimationFrame(tickTimer);
}
function stopTimer() {
if (tRaf !== null) {
    cancelAnimationFrame(tRaf);
    tRaf = null;
}
}
function restartTimer() {
stopTimer();
tElapsed = 0;
trFill.style.strokeDashoffset = CIRC;
if (ap) startTimer();
}
function tickTimer() {
const now = performance.now();
tElapsed = now - tStart;
const p = Math.min(tElapsed / AUTO, 1);
trFill.style.strokeDashoffset = CIRC * (1 - p);
if (p >= 1) {
    chg(1);
    return;
}
if (ap) tRaf = requestAnimationFrame(tickTimer);
}
document.getElementById("timerRing").addEventListener("click", toggleAP);

/* ── FULLSCREEN ── */
const ICON_ENTER = "M1 5V1h4M10 1h4v4M14 10v4h-4M5 14H1v-4";
const ICON_EXIT = "M5 1v4H1M9 1v4h4M9 13v-4h4M5 13v-4H1";
let toastTimer = null;
function showToast(msg) {
const t = document.getElementById("fs-toast");
t.textContent = msg;
t.classList.add("show");
clearTimeout(toastTimer);
toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}
function updateFsIcon() {
const fsIcon = document.getElementById("fsIcon");
const welcomeFsIcon = document.getElementById("welcomeFsIcon");
const isFs = !!document.fullscreenElement;
document
    .getElementById("fsIcon")
    .querySelector("path")
    .setAttribute("d", isFs ? ICON_EXIT : ICON_ENTER);
document
    .getElementById("welcomeFsIcon")
    .querySelector("path")
    .setAttribute("d", isFs ? ICON_EXIT : ICON_ENTER);
}
function toggleFullscreen() {
if (!document.fullscreenElement) {
    document.documentElement
    .requestFullscreen({ navigationUI: "hide" })
    .then(() => showToast("◈ Fullscreen — tekan F11 untuk keluar"))
    .catch(() => showToast("Fullscreen tidak didukung browser ini"));
} else {
    document.exitFullscreen().then(() => showToast("Keluar Fullscreen"));
}
}
document
.getElementById("fsBtn")
.addEventListener("click", toggleFullscreen);
const welcomeFsBtn = document.getElementById("welcomeFsBtn");
if (welcomeFsBtn) {
welcomeFsBtn.addEventListener("click", toggleFullscreen);
}
document.addEventListener("fullscreenchange", updateFsIcon);

/* ── MUSIK ── */
const ICON_MUSIC_ON = `<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>`;
const ICON_MUSIC_OFF = `<line x1="2" y1="2" x2="22" y2="22"/><path d="M9 9v9"/><path d="M9 18a3 3 0 1 0 0 .001"/><path d="M15 9.34V5l6-1v7"/><path d="M18 16a3 3 0 1 0 .001 0"/>`;

let audio = null,
muted = false;
const musicBtn = document.getElementById("musicBtn");

// ▼▼▼ TAMBAHAN: SISTEM FADE AUDIO CINEMATIC ▼▼▼
let fadeInterval = null;
const MAX_VOLUME = 0.3; // Batas volume maksimal bawaan template kamu

function fadeInAudio(duration = 1000) {
if (!audio) return;
clearInterval(fadeInterval);
audio.muted = false;
if (audio.paused) audio.play().catch(() => {});

let currentVol = audio.volume;
const steps = duration / 30;
const volStep = (MAX_VOLUME - currentVol) / steps;

fadeInterval = setInterval(() => {
    currentVol += volStep;
    if (currentVol >= MAX_VOLUME) {
    audio.volume = MAX_VOLUME;
    clearInterval(fadeInterval);
    } else {
    audio.volume = currentVol;
    }
}, 30);
}

function fadeOutAudio(duration = 1000, callback) {
if (!audio) {
    if (callback) callback();
    return;
}
clearInterval(fadeInterval);

let currentVol = audio.volume;
const steps = duration / 30;
const volStep = currentVol / steps;

fadeInterval = setInterval(() => {
    currentVol -= volStep;
    if (currentVol <= 0) {
    audio.volume = 0;
    clearInterval(fadeInterval);
    if (callback) callback();
    } else {
    audio.volume = currentVol;
    }
}, 30);
}
// ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

const playlist = [
"audio/lagu1.mp3",
"audio/lagu2.mp3",
"audio/lagu3.mp3",
];

let currentTrack = 0;

function initAudio() {
if (audio) return;
audio = new Audio(playlist[currentTrack]);
audio.addEventListener("ended", () => {
    currentTrack = (currentTrack + 1) % playlist.length; // lanjut ke indeks berikutnya
    audio.src = playlist[currentTrack];
    audio.play();
});
// audio.loop = true;
audio.volume = 0; // Mulai dari 0 supaya bisa di-fade in halus
muted = false;
updateMusicIcon();
}

function updateMusicIcon() {
const svg = musicBtn.querySelector("svg");
svg.innerHTML = muted ? ICON_MUSIC_OFF : ICON_MUSIC_ON;
musicBtn.style.color = muted ? "rgba(240,244,255,0.3)" : "var(--cyan)";
musicBtn.style.background = muted ? "" : "rgba(0,212,255,0.1)";
}

function toggleMusic() {
if (!audio) {
    initAudio();
    fadeInAudio(800);
    return;
}
muted = !muted;
updateMusicIcon();

if (muted) {
    // Fade out selama 0.8 detik, setelah volume 0 baru di-pause
    fadeOutAudio(800, () => {
    audio.pause();
    });
} else {
    // Hanya fade-in kembali jika slide presentasi sedang berjalan aktif (ap = true)
    // atau jika masih berada di halaman intro (selayang pandang)
    const isIntroActive = document.getElementById("introScreen") !== null;
    if (ap || isIntroActive) {
    fadeInAudio(800);
    }
}
}

musicBtn.addEventListener("click", toggleMusic);

/* ── KEYBOARD SHORTCUTS ── */
document.addEventListener("keydown", (e) => {
// 🔎 DEBUG 1: Melihat tombol apa saja yang sebenarnya sedang kamu tekan
console.log("Tombol ditekan:", e.key, "| Kode:", e.code);

// 🔎 DEBUG 2: Memastikan kursor kamu tidak sedang terjebak di dalam kolom ketikan teks
const activeEl = document.activeElement.tagName;
if (
    activeEl === "INPUT" ||
    activeEl === "TEXTAREA" ||
    document.activeElement.isContentEditable
) {
    console.warn(
    "Shortcut diabaikan karena kamu sedang mengetik di elemen:",
    activeEl,
    );
    return;
}

if (e.key === "ArrowRight" || e.key === "ArrowDown") chg(1);
else if (e.key === "ArrowLeft" || e.key === "ArrowUp") chg(-1);
else if (e.key === " ") {
    e.preventDefault();
    toggleAP();
} else if (e.key === "f" || e.key === "F") doFlip(cur);
else if (e.key === "F11") {
    e.preventDefault();
    toggleFullscreen();
}
// 🔎 DEBUG 3: Melacak apakah block M ini berhasil masuk atau tidak
else if (e.key === "m" || e.key === "M") {
    console.log(
    "👉 Tombol M terdeteksi! Mencoba memicu fungsi toggleMusic()...",
    );
    toggleMusic();
}
// tombol mula utama
else if (e.key === "Enter") {
    openSlide();
}
});

/* ── TOUCH SWIPE ── */
let tx0 = 0;
const vp = document.getElementById("viewport");
vp.addEventListener("touchstart", (e) => (tx0 = e.touches[0].clientX), {
passive: true,
});
vp.addEventListener(
"touchend",
(e) => {
    const dx = e.changedTouches[0].clientX - tx0;
    if (Math.abs(dx) > 50) chg(dx < 0 ? 1 : -1);
},
{ passive: true },
);

document.getElementById("pBtn").addEventListener("click", () => chg(-1));
document.getElementById("nBtn").addEventListener("click", () => chg(1));

/* ── SIDEBAR ── */
const sidebar = document.getElementById("studentSidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const navToggle = document.getElementById("navToggle");

function toggleSidebar() {
const isOpen = sidebar.classList.toggle("open");
sidebarOverlay.classList.toggle("open", isOpen);
navToggle.style.transform = isOpen
    ? "translateY(-50%) translateX(100%)"
    : "translateY(-50%)";
}
navToggle.addEventListener("click", toggleSidebar);
document
.getElementById("sidebarClose")
.addEventListener("click", toggleSidebar);
sidebarOverlay.addEventListener("click", toggleSidebar);

function renderSidebar() {
const list = document.getElementById("sidebarList");
list.innerHTML = "";
students.forEach((s, idx) => {
    if (s.isPenutup) return;
    const li = document.createElement("li");
    li.textContent = s.nama || `Siswa ${idx + 1}`;
    li.setAttribute("data-idx", idx);
    if (idx === cur) li.classList.add("active");
    li.addEventListener("click", () => {
    if (idx !== cur) goto(idx);
    toggleSidebar();
    });
    list.appendChild(li);
});
}

function updateSidebarActive() {
document.querySelectorAll("#sidebarList li").forEach((li) => {
    li.classList.toggle("active", parseInt(li.dataset.idx) === cur);
});
}

/* ── WELCOME SCREEN ── */
document.addEventListener("DOMContentLoaded", () => {
const welcomeScreen = document.getElementById("welcomeScreen");
const welcomeBtn = document.getElementById("welcomeBtn");
const introScreen = document.getElementById("introScreen");

// Ambil elemen tombol musik yang ada di Layar Gerbang
const welcomeMusicBtn = document.getElementById("welcomeMusicBtn");
const welcomeMusicIcon = document.getElementById("welcomeMusicIcon");

// Ikon SVG On/Off bawaan template agar visualnya sinkron
const SVG_ON = `<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>`;
const SVG_OFF = `<line x1="2" y1="2" x2="22" y2="22"/><path d="M9 9v9"/><path d="M9 18a3 3 0 1 0 0 .001"/><path d="M15 9.34V5l6-1v7"/><path d="M18 16a3 3 0 1 0 .001 0"/>`;

// 1. Event ketika user mengubah pilihan musik (Mute/Unmute) di Layar Gerbang
if (welcomeMusicBtn) {
    welcomeMusicBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // Mencegah klik tembus ke welcomeBtn
    muted = !muted; // Mengubah variabel 'muted' global

    if (muted) {
        welcomeMusicBtn.style.opacity = "0.5";
        if (welcomeMusicIcon) welcomeMusicIcon.innerHTML = SVG_OFF;
    } else {
        welcomeMusicBtn.style.opacity = "1";
        if (welcomeMusicIcon) welcomeMusicIcon.innerHTML = SVG_ON;
    }
    });
}

function openSlide() {
    const userWantsMute = muted; // Kunci status pilihan terakhir user

    welcomeScreen.classList.add("hidden");

    if (introScreen) {
    introScreen.classList.add("play-intro");
    }
    initAudio();

    // Eksekusi efek fade sinematik tepat saat HALAMAN INTRO (Selayang Pandang) muncul
    if (userWantsMute) {
    muted = true;
    if (audio) {
        audio.volume = 0;
        audio.pause();
    }
    } else {
    muted = false;
    if (audio) {
        fadeInAudio(1500); // 🔊 FADE IN PREMIUM: Musik membesar perlahan selama 1.5 detik pas tulisan Selayang Pandang muncul!
    }
    }
    updateMusicIcon();

    // Sisa kode setTimeout di bawahnya tetap sama seperti sebelumnya...
    setTimeout(() => {
    introScreen.classList.add("hidden");
    showCard(0, true);
    setTimeout(() => {
        document.getElementById("mainHeader").classList.add("visible");
    }, 200);
    setTimeout(() => {
        introScreen.remove();
        welcomeScreen.remove();
    }, 1800);

    setTimeout(() => {
        if (typeof toggleAP === "function" && !ap) {
        toggleAP();
        if (muted && audio) audio.pause();
        }
    }, 1600);
    }, 8000);
}

// 2. Event ketika tombol UTAMA "Buka Layar Pelepasan" diklik
// Event ketika tombol UTAMA "Buka Layar Pelepasan" diklik
welcomeBtn.addEventListener("click", openSlide);
});

/* ── INIT ── */
load();

if ("serviceWorker" in navigator) {
window.addEventListener("load", () => {
    navigator.serviceWorker
    .register("sw.js")
    .then((reg) => console.log("PWA aktif dan terdaftar!"))
    .catch((err) => console.log("Gagal mendaftarkan PWA", err));
});
}