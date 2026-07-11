// リロード時は常に最上部から
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

// ドロワー開閉
const menuBtn = document.getElementById('menuBtn');
const drawer = document.getElementById('drawer');
const overlay = document.getElementById('drawerOverlay');
const closeBtn = document.getElementById('drawerClose');

function openDrawer() {
  overlay.hidden = false;
  requestAnimationFrame(function () {
    drawer.classList.add('is-open');
    overlay.classList.add('is-open');
  });
  drawer.setAttribute('aria-hidden', 'false');
  menuBtn.setAttribute('aria-expanded', 'true');
}

function closeDrawer() {
  drawer.classList.remove('is-open');
  overlay.classList.remove('is-open');
  drawer.setAttribute('aria-hidden', 'true');
  menuBtn.setAttribute('aria-expanded', 'false');
  setTimeout(function () { overlay.hidden = true; }, 300);
}

if (menuBtn && drawer && overlay && closeBtn) {
  menuBtn.addEventListener('click', openDrawer);
  closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) closeDrawer();
  });
}

// ヒーロー動画クリックでロゴ刻印アニメーション
const heroVideo = document.getElementById('heroVideo');
const stampOverlay = document.getElementById('stampOverlay');
let stampTimer = null;

if (heroVideo && stampOverlay) {
  heroVideo.addEventListener('click', function () {
    if (!stampOverlay.hidden) {
      stampOverlay.hidden = true;
      clearTimeout(stampTimer);
      return;
    }
    stampOverlay.hidden = false;
    const img = stampOverlay.querySelector('img');
    stampOverlay.style.animation = 'none';
    img.style.animation = 'none';
    void img.offsetWidth;
    stampOverlay.style.animation = '';
    img.style.animation = '';
    clearTimeout(stampTimer);
    stampTimer = setTimeout(function () { stampOverlay.hidden = true; }, 2800);
  });
}

// 商品カードのフェードイン
const cards = document.querySelectorAll('.card');
if ('IntersectionObserver' in window && cards.length) {
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.transitionDelay = (entry.target.dataset.delay || 0) + 'ms';
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  cards.forEach(function (card, i) {
    card.dataset.delay = (i % 4) * 100;
    observer.observe(card);
  });
} else {
  cards.forEach(function (card) { card.classList.add('is-visible'); });
}
