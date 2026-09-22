/* ============================================================
   Kancil Transport — Script Utama
   ============================================================ */
"use strict";

/* ---------- Tahun otomatis di footer ---------- */
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

/* ---------- Navbar: bayangan saat discroll ---------- */
const navbar = document.getElementById("navbar");
const backToTop = document.getElementById("back-to-top");

function onScrollUI() {
  const y = window.scrollY;

  if (navbar) {
    navbar.classList.toggle("scrolled", y > 20);
  }
  if (backToTop) {
    backToTop.classList.toggle("show", y > 480);
  }
}

window.addEventListener("scroll", onScrollUI, { passive: true });
onScrollUI();

/* ---------- Kembali ke atas ---------- */
if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ---------- Menu mobile (hamburger) ---------- */
const hamburger = document.getElementById("hamburger-menu");
const navMenu = document.getElementById("nav-menu");

function closeMobileMenu() {
  if (navMenu && navMenu.classList.contains("active")) {
    navMenu.classList.remove("active");
    if (hamburger) {
      hamburger.setAttribute("aria-expanded", "false");
      hamburger.setAttribute("aria-label", "Buka menu navigasi");
      hamburger.innerHTML = '<i data-feather="menu"></i>';
      if (window.feather) feather.replace();
    }
  }
}

if (hamburger && navMenu) {
  hamburger.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = navMenu.classList.toggle("active");
    hamburger.setAttribute("aria-expanded", String(isOpen));
    hamburger.setAttribute(
      "aria-label",
      isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"
    );
    hamburger.innerHTML = `<i data-feather="${isOpen ? "x" : "menu"}"></i>`;
    if (window.feather) feather.replace();
  });

  // Tutup menu saat klik di luar
  document.addEventListener("click", (e) => {
    if (navMenu.classList.contains("active") && !navMenu.contains(e.target)) {
      closeMobileMenu();
    }
  });

  // Tutup menu dengan tombol Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMobileMenu();
  });
}

/* ---------- Tutup menu mobile saat link diklik ---------- */
document.querySelectorAll("#nav-menu a").forEach((link) => {
  link.addEventListener("click", () => closeMobileMenu());
});

/* ---------- Highlight menu sesuai section aktif ---------- */
const sectionIds = ["beranda", "tentang", "menu", "faq", "kontak"];
const navLinks = Array.from(document.querySelectorAll(".navbar-nav > a[href^='#']"));

function highlightNav() {
  const scrollPos = window.scrollY + 120;
  let current = "beranda";

  sectionIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el && el.offsetTop <= scrollPos) current = id;
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
}

window.addEventListener("scroll", highlightNav, { passive: true });
highlightNav();

/* ---------- FAQ accordion ---------- */
document.querySelectorAll(".faq-question").forEach((btn) => {
  btn.addEventListener("click", () => {
    const item = btn.closest(".faq-item");
    const answer = item ? item.querySelector(".faq-answer") : null;
    if (!item || !answer) return;

    const isOpen = item.classList.contains("open");

    // Tutup semua item lain
    document.querySelectorAll(".faq-item.open").forEach((other) => {
      other.classList.remove("open");
      other.querySelector(".faq-answer").style.maxHeight = null;
      const q = other.querySelector(".faq-question");
      if (q) q.setAttribute("aria-expanded", "false");
    });

    if (!isOpen) {
      item.classList.add("open");
      answer.style.maxHeight = answer.scrollHeight + "px";
      btn.setAttribute("aria-expanded", "true");
    }
  });
});

/* ---------- Reveal saat scroll ---------- */
const revealEls = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach((el) => observer.observe(el));
} else {
  // Fallback untuk browser lama
  revealEls.forEach((el) => el.classList.add("visible"));
}

/* ---------- Semua tombol/data-wa: buka WhatsApp dengan pesan ---------- */
const WA_NUMBER = "628979524004";

document.querySelectorAll("[data-wa]").forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    const text = encodeURIComponent(el.getAttribute("data-wa") || "");
    window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, "_blank", "noopener");
  });
});

/* ---------- Form kontak → WhatsApp ---------- */
const waForm = document.getElementById("wa-form");

if (waForm) {
  waForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const get = (id) => {
      const el = document.getElementById(id);
      return el ? el.value.trim() : "";
    };

    const nama = get("nama");
    const tujuan = get("tujuan");
    const tanggal = get("tanggal");
    const pesan = get("pesan");

    // Validasi sederhana dengan pesan inline
    let valid = true;

    ["nama", "tujuan", "pesan"].forEach((id) => {
      const field = document.getElementById(id);
      if (field && !field.value.trim()) {
        field.style.borderColor = "#e11d48";
        valid = false;
      } else if (field) {
        field.style.borderColor = "";
      }
    });

    if (!valid) return;

    const tglText = tanggal ? `\nTanggal: ${tanggal}` : "";
    const text = `Halo Kancil Transport,${tglText}\nSaya ${nama} ingin melakukan pemesanan ke ${tujuan}.\n${pesan}`;
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

    window.open(url, "_blank", "noopener");
    waForm.reset();
  });
}

/* ---------- Feather icons ---------- */
if (window.feather) {
  feather.replace({ "stroke-width": 2 });
}
