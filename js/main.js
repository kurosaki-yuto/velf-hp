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

// スプラッシュはアニメーション後に完全除去
const splash = document.getElementById('splash');
if (splash) {
  setTimeout(function () { splash.remove(); }, 2500);
}

// 商品カードクリックでDMメッセージをコピーしてInstagram DMを開く
const IG_DM = 'https://ig.me/m/velf.__jp';
const toast = document.getElementById('toast');
let toastTimer = null;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { toast.hidden = true; }, 4000);
}

document.querySelectorAll('.card').forEach(function (card) {
  card.style.cursor = 'pointer';
  card.addEventListener('click', function (e) {
    const nameEl = card.querySelector('.card-name');
    const name = nameEl ? nameEl.textContent.trim() : '';
    const msg = '「' + name + '」の件でオーダー相談したいです。';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(msg).catch(function () {});
    }
    showToast('相談メッセージをコピーしました。開いたDMに貼り付けて送ってください');
    if (!e.target.closest('a')) {
      window.open(IG_DM, '_blank', 'noopener');
    }
  });
});

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
