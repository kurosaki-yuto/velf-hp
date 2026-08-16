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
    stampTimer = setTimeout(function () { stampOverlay.hidden = true; }, 3400);
  });
}

// スプラッシュはアニメーション後に完全除去
const splash = document.getElementById('splash');
if (splash) {
  setTimeout(function () { splash.remove(); }, 3100);
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
  const cta = card.querySelector('.card-cta');
  const internal = cta && !/^https?:/.test(cta.getAttribute('href'));

  card.addEventListener('click', function (e) {
    if (e.target.closest('a')) return;

    // シミュレーターがある製品は、DMではなくそちらへ送る
    if (internal) {
      location.href = cta.getAttribute('href');
      return;
    }

    const nameEl = card.querySelector('.card-name');
    const name = nameEl ? nameEl.textContent.trim() : '';
    const msg = '「' + name + '」の件でオーダー相談したいです。';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(msg).catch(function () {});
    }
    showToast('相談メッセージをコピーしました。開いたDMに貼り付けて送ってください');
    window.open(IG_DM, '_blank', 'noopener');
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

// ============ 先行案内リスト ============
// 送信先。Google Apps Script の Web App URL などを入れると有効になる。
// 空のままだと登録内容を Instagram DM へ引き渡すフォールバックで動く。
const RESERVE_ENDPOINT = '';

const reserveForm = document.getElementById('reserveForm');
const reserveDone = document.getElementById('reserveDone');
const reserveItem = document.getElementById('reserveItem');

// 製品名のセレクトを商品一覧から自動生成（商品が増えても直さなくていい）
if (reserveItem) {
  document.querySelectorAll('.card-name').forEach(function (el) {
    const opt = document.createElement('option');
    opt.value = el.textContent.trim();
    opt.textContent = el.textContent.trim();
    reserveItem.appendChild(opt);
  });
}

if (reserveForm) {
  reserveForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const emailEl = document.getElementById('reserveEmail');
    const email = emailEl.value.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!valid) {
      emailEl.classList.add('is-error');
      showToast('メールアドレスをご確認ください');
      emailEl.focus();
      return;
    }
    emailEl.classList.remove('is-error');

    const payload = {
      email: email,
      name: document.getElementById('reserveName').value.trim(),
      item: reserveItem.value,
      source: location.pathname,
      at: new Date().toISOString()
    };

    const btn = reserveForm.querySelector('.reserve-btn');
    btn.disabled = true;

    function finish() {
      reserveForm.hidden = true;
      reserveDone.hidden = false;
      reserveDone.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    if (RESERVE_ENDPOINT) {
      fetch(RESERVE_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      }).then(finish).catch(function () {
        btn.disabled = false;
        showToast('送信できませんでした。時間をおいてお試しください');
      });
    } else {
      // 送信先が未設定の間は DM に内容を引き渡す
      const msg =
        '先行案内リストに登録したいです。\n' +
        'メール: ' + payload.email +
        (payload.name ? '\nお名前: ' + payload.name : '') +
        (payload.item ? '\n気になっている製品: ' + payload.item : '');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(msg).catch(function () {});
      }
      showToast('登録内容をコピーしました。開いたDMに貼り付けて送ってください');
      window.open(IG_DM, '_blank', 'noopener');
      finish();
    }
  });
}

// ============ 全面スタートまでのカウントダウン ============
// 8/27 の0時（日本時間）に0になる。ローンチまで常時表示する。
const LAUNCH_AT = new Date('2026-08-27T00:00:00+09:00');

const countdown = document.getElementById('countdown');

if (countdown) {
  function tick() {
    const now = new Date();
    const left = LAUNCH_AT - now;

    if (left <= 0) {
      countdown.hidden = true;
      return true;
    }
    countdown.hidden = false;
    const sec = Math.floor(left / 1000);
    const pad = function (n) { return String(n).padStart(2, '0'); };
    document.getElementById('cdDays').textContent = Math.floor(sec / 86400);
    document.getElementById('cdHours').textContent = pad(Math.floor(sec / 3600) % 24);
    document.getElementById('cdMins').textContent = pad(Math.floor(sec / 60) % 60);
    document.getElementById('cdSecs').textContent = pad(sec % 60);
    return false;
  }

  if (!tick()) {
    const timer = setInterval(function () {
      if (tick()) clearInterval(timer);
    }, 1000);
  }
}
