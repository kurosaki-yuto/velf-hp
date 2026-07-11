// 通貨切替（JPY / USD）
const RATE_USD = 150; // 1 USD = 150 JPY（固定レート・目安表示）

const select = document.getElementById('currencySelect');
const prices = document.querySelectorAll('.card-price[data-jpy]');

function formatPrice(jpy, currency) {
  if (currency === 'USD') {
    const usd = jpy / RATE_USD;
    return '$' + usd.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }
  return '¥' + jpy.toLocaleString('ja-JP');
}

function render(currency) {
  prices.forEach(function (el) {
    el.textContent = formatPrice(Number(el.dataset.jpy), currency);
  });
}

if (select) {
  const saved = localStorage.getItem('velf-currency') || 'JPY';
  select.value = saved;
  render(saved);
  select.addEventListener('change', function () {
    localStorage.setItem('velf-currency', select.value);
    render(select.value);
  });
}

// 商品カードのフェードイン
const cards = document.querySelectorAll('.card');
if ('IntersectionObserver' in window && cards.length) {
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry, i) {
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
    card.dataset.delay = (i % 3) * 120;
    observer.observe(card);
  });
} else {
  cards.forEach(function (card) { card.classList.add('is-visible'); });
}
