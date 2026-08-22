/* オーダーシミュレーター: 1.商品を選ぶ → 2.革を選ぶ → 3.決定する */

// ---- ドロワー（トップと同じ挙動） ----
(function () {
  const menuBtn = document.getElementById('menuBtn');
  const drawer = document.getElementById('drawer');
  const overlay = document.getElementById('drawerOverlay');
  const closeBtn = document.getElementById('drawerClose');
  if (!(menuBtn && drawer && overlay && closeBtn)) return;

  function open() {
    overlay.hidden = false;
    requestAnimationFrame(function () {
      drawer.classList.add('is-open');
      overlay.classList.add('is-open');
    });
    drawer.setAttribute('aria-hidden', 'false');
    menuBtn.setAttribute('aria-expanded', 'true');
  }
  function close() {
    drawer.classList.remove('is-open');
    overlay.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    menuBtn.setAttribute('aria-expanded', 'false');
    setTimeout(function () { overlay.hidden = true; }, 300);
  }
  menuBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) close();
  });
})();

const toast = document.getElementById('toast');
let toastTimer = null;
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { toast.hidden = true; }, 4000);
}

// ---- 状態 ----
const DATA = window.ORDER;
const state = {
  product: null,
  color: 'black',
  // 「その他の色」を選んでも写真は直前の色のまま出す
  previewColor: 'black',
  otherText: {},
  size: '', note: '', choices: {}
};

function product() {
  return DATA.products.find(function (p) { return p.id === state.product; });
}

function groups() {
  return DATA.common.concat(product().extra || []);
}

function chosen(key) {
  const g = groups().find(function (x) { return x.key === key; });
  return g.options.find(function (o) { return o.id === state.choices[key]; }) || g.options[0];
}

function colorObj() {
  return DATA.colors.find(function (c) { return c.id === state.color; });
}

function escapeText(str) {
  return String(str).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
  });
}

// 糸の色は写真に出ない。選んだステッチを画像の下にチップと文字で出して、
// 仕様の取り違えを防ぐ。
function renderStitchLine(el) {
  if (!el) return;
  const g = groups().find(function (x) { return x.key === 'stitch'; });
  if (!g) { el.hidden = true; return; }
  const o = chosen('stitch');
  const label = o.other
    ? (state.otherText.stitch || 'その他の色') + '（ご相談）'
    : o.label;
  const chipClass = 'stitch-chip' + (o.chip === 'other' ? ' is-other' : '');
  const chipStyle = (o.chip && o.chip !== 'other')
    ? ' style="background:' + escapeText(o.chip) + '"' : '';
  el.innerHTML = '<span class="' + chipClass + '"' + chipStyle + '></span>' +
    '<span>ステッチ：' + escapeText(label) + '</span>';
  el.hidden = false;
}

function variantSrc(productId, colorId) {
  return 'assets/img/variants/' + productId + '_' + colorId + '.jpg';
}

// 「その他」を選んだ項目に、希望の色を書いてもらう欄を足す
function otherField(key, onInput) {
  const box = document.createElement('div');
  box.className = 'other-field';
  box.innerHTML =
    '<label for="other-' + key + '">何色にしたいか入力してください</label>' +
    '<input type="text" id="other-' + key + '" maxlength="40" autocomplete="off">' +
    '<p class="other-fee">追加料金が必要です</p>';
  const input = box.querySelector('input');
  input.value = state.otherText[key] || '';
  input.addEventListener('input', function () {
    state.otherText[key] = this.value.trim();
    if (onInput) onInput();
  });
  return box;
}

// ---- ステップ制御 ----
function goto(n) {
  [1, 2, 3].forEach(function (i) {
    const panel = document.getElementById('panel' + i);
    panel.hidden = i !== n;
    panel.classList.toggle('is-active', i === n);
  });
  document.querySelectorAll('.step').forEach(function (el) {
    const s = Number(el.dataset.step);
    el.classList.toggle('is-current', s === n);
    el.classList.toggle('is-done', s < n);
  });
  if (n === 3) renderConfirm();
  window.scrollTo({ top: document.getElementById('steps').offsetTop - 80, behavior: 'smooth' });
}

document.querySelectorAll('[data-goto]').forEach(function (btn) {
  btn.addEventListener('click', function () { goto(Number(btn.dataset.goto)); });
});

document.querySelectorAll('.step').forEach(function (el) {
  el.addEventListener('click', function () {
    const s = Number(el.dataset.step);
    if (s === 1 || state.product) goto(s);
  });
});

// ---- ステップ1: 商品 ----
(function buildProductGrid() {
  const grid = document.getElementById('productGrid');
  DATA.products.forEach(function (p) {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'pcard';
    card.innerHTML =
      '<figure><img src="assets/img/' + p.id + '.jpg" alt="' + p.name + '" loading="lazy"></figure>' +
      '<span class="pcard-cat">' + p.cat + '</span>' +
      '<span class="pcard-name">' + p.name + '</span>' +
      '<span class="pcard-price">' +
        (p.tbd ? 'ご相談時にお見積り' : '¥' + p.base.toLocaleString() + '〜') + '</span>';
    card.addEventListener('click', function () { selectProduct(p.id); });
    grid.appendChild(card);
  });
})();

function selectProduct(id) {
  state.product = id;
  state.size = '';
  state.note = '';
  state.choices = {};
  state.otherText = {};
  groups().forEach(function (g) { state.choices[g.key] = g.options[0].id; });
  buildControls();
  renderPreview();
  goto(2);
}

// ---- ステップ2: 革と仕様 ----
function swatchButton(group, opt, onPick) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'swatch' + (opt.id === state.choices[group.key] ? ' is-active' : '');
  btn.dataset.id = opt.id;
  btn.setAttribute('role', 'radio');
  btn.setAttribute('aria-checked', opt.id === state.choices[group.key] ? 'true' : 'false');

  if (opt.chip) {
    const chip = document.createElement('span');
    chip.className = 'swatch-chip' +
      (opt.chip === 'transparent' ? ' is-none' : '') +
      (opt.chip === 'other' ? ' is-other' : '');
    if (opt.chip !== 'other') chip.style.background = opt.chip;
    btn.appendChild(chip);
  }
  const label = document.createElement('span');
  label.className = 'swatch-label';
  label.textContent = opt.label + (opt.add ? ' +' + opt.add.toLocaleString() + '円' : '');
  btn.appendChild(label);
  btn.addEventListener('click', onPick);
  return btn;
}

function buildControls() {
  const wrap = document.getElementById('builderControls');
  wrap.innerHTML = '';

  // 色（プレビュー画像に直結するので先頭に置く）
  const colorBlock = document.createElement('div');
  colorBlock.className = 'ctrl';
  colorBlock.innerHTML =
    '<div class="ctrl-head"><span class="ctrl-label">色</span>' +
    '<span class="ctrl-value" id="colorValue"></span></div>';
  const colorList = document.createElement('div');
  colorList.className = 'swatches';
  colorList.setAttribute('role', 'radiogroup');
  colorList.setAttribute('aria-label', '色');
  DATA.colors.forEach(function (c) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'swatch' + (c.id === state.color ? ' is-active' : '');
    btn.setAttribute('role', 'radio');
    btn.setAttribute('aria-checked', c.id === state.color ? 'true' : 'false');
    btn.innerHTML = (c.chip === 'other'
        ? '<span class="swatch-chip is-other"></span>'
        : '<span class="swatch-chip" style="background:' + c.chip + '"></span>') +
      '<span class="swatch-label">' + c.label + '</span>';
    btn.addEventListener('click', function () {
      state.color = c.id;
      if (c.id !== 'other') state.previewColor = c.id;
      colorList.querySelectorAll('.swatch').forEach(function (b) {
        b.classList.remove('is-active');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-checked', 'true');
      renderPreview();
    });
    colorList.appendChild(btn);
  });
  colorBlock.appendChild(colorList);
  const colorOther = otherField('color');
  colorOther.id = 'colorOther';
  colorBlock.appendChild(colorOther);
  wrap.appendChild(colorBlock);

  // 共通 + 製品ごとの選択肢
  groups().forEach(function (group) {
    const block = document.createElement('div');
    block.className = 'ctrl';
    block.innerHTML = '<div class="ctrl-head"><span class="ctrl-label">' + group.label + '</span>' +
      '<span class="ctrl-value" data-value-for="' + group.key + '"></span></div>';

    if (group.note) {
      const note = document.createElement('p');
      note.className = 'ctrl-note';
      note.textContent = group.note;
      block.appendChild(note);
    }

    const list = document.createElement('div');
    list.className = 'swatches';
    list.setAttribute('role', 'radiogroup');
    list.setAttribute('aria-label', group.label);
    group.options.forEach(function (opt) {
      const btn = swatchButton(group, opt, function () {
        state.choices[group.key] = opt.id;
        list.querySelectorAll('.swatch').forEach(function (b) {
          const on = b.dataset.id === opt.id;
          b.classList.toggle('is-active', on);
          b.setAttribute('aria-checked', on ? 'true' : 'false');
        });
        renderPreview();
      });
      list.appendChild(btn);
    });
    block.appendChild(list);

    const other = otherField(group.key, renderPreview);
    other.dataset.otherFor = group.key;
    block.appendChild(other);

    const desc = document.createElement('p');
    desc.className = 'ctrl-desc';
    desc.dataset.descFor = group.key;
    block.appendChild(desc);

    wrap.appendChild(block);
  });

  // サイズが要る製品だけ
  const size = product().size;
  if (size) {
    const block = document.createElement('div');
    block.className = 'ctrl';
    block.innerHTML =
      '<div class="ctrl-head"><span class="ctrl-label">' + size.label + '</span></div>' +
      '<p class="ctrl-note">' + size.note + '</p>' +
      '<div class="size-field"><input type="number" id="sizeInput" min="' + size.min +
      '" max="' + size.max + '" step="1" placeholder="' + size.placeholder +
      '" inputmode="numeric"><span>' + size.unit + '</span></div>';
    wrap.appendChild(block);
    block.querySelector('#sizeInput').addEventListener('input', function () {
      state.size = this.value.trim();
    });
  }
}

function renderPreview() {
  const img = document.getElementById('previewImg');
  const caption = document.getElementById('previewCaption');

  img.onerror = function () {
    // その色のバリエーション画像がまだ無いときは、元の製品写真で代替する
    img.onerror = null;
    img.src = 'assets/img/' + state.product + '.jpg';
    caption.textContent = product().name +
      '（' + colorObj().label + 'の写真は準備中のため、既存の写真を表示しています）';
  };
  img.src = variantSrc(state.product, state.previewColor);
  img.alt = product().name;
  caption.textContent = product().name;

  const cv = document.getElementById('colorValue');
  if (cv) cv.textContent = colorObj().label;

  // 「その他」を選んでいる項目だけ、入力欄を出す
  const co = document.getElementById('colorOther');
  if (co) co.classList.toggle('is-open', state.color === 'other');
  groups().forEach(function (g) {
    const box = document.querySelector('[data-other-for="' + g.key + '"]');
    if (box) box.classList.toggle('is-open', chosen(g.key).other === true);
  });

  groups().forEach(function (g) {
    const el = document.querySelector('[data-value-for="' + g.key + '"]');
    if (el) el.textContent = chosen(g.key).label;
    const d = document.querySelector('[data-desc-for="' + g.key + '"]');
    if (d) d.textContent = chosen(g.key).desc || '';
  });

  renderStitchLine(document.getElementById('previewStitch'));
}

// ---- ステップ3: 確認 ----
function total() {
  return groups().reduce(function (sum, g) {
    return sum + (chosen(g.key).add || 0);
  }, product().base + (colorObj().add || 0));
}

function renderConfirm() {
  const img = document.getElementById('confirmImg');
  img.onerror = function () {
    img.onerror = null;
    img.src = 'assets/img/' + state.product + '.jpg';
  };
  img.src = variantSrc(state.product, state.color);
  img.alt = product().name + ' ' + colorObj().label;

  renderStitchLine(document.getElementById('confirmStitch'));

  const list = document.getElementById('specList');
  list.innerHTML = '';

  function row(dt, dd) {
    const el = document.createElement('div');
    el.innerHTML = '<dt>' + dt + '</dt><dd>' + dd + '</dd>';
    list.appendChild(el);
  }

  function withOther(key, label) {
    if (!state.otherText[key]) return label + '（追加料金）';
    return state.otherText[key] + '（その他の色・追加料金）';
  }
  row('製品', product().name);
  row('色', state.color === 'other' ? withOther('color', 'その他の色') : colorObj().label);
  groups().forEach(function (g) {
    const o = chosen(g.key);
    row(g.label, o.other ? withOther(g.key, o.label) : o.label);
  });
  if (product().size) {
    row(product().size.label, state.size ? state.size + ' ' + product().size.unit : '相談して決める');
  }

  document.getElementById('specPrice').textContent =
    product().tbd ? 'ご相談時にお見積り' : '¥' + total().toLocaleString();
  renderBuyButton();
}

// 決済リンクは金額が固定なので、追加料金が出る組み合わせでは出さない。
// そのときは DM 相談だけにして、金額を詰めてから請求リンクを送る運用にする。
function renderBuyButton() {
  const buy = document.getElementById('specBuy');
  const note = document.getElementById('specBuyNote');
  if (!buy) return;

  const links = window.PAYMENT_LINKS || {};
  const url = links[state.product];
  if (!window.SHOW_BUY_BUTTON) {
    buy.hidden = true;
    note.hidden = true;
    return;
  }
  const hasOther = state.color === 'other' ||
    groups().some(function (g) { return chosen(g.key).other === true; });

  const show = Boolean(url) && !hasOther;
  buy.hidden = !show;
  note.hidden = !show;
  if (show) buy.href = url;
}

document.getElementById('orderNote').addEventListener('input', function () {
  state.note = this.value.trim();
});

function specText() {
  const lines = ['VÉLF「' + product().name + '」のオーダーで相談したいです。', ''];
  function otherLabel(key, fallback) {
    return (state.otherText[key] || fallback) + '（その他の色・追加料金）';
  }
  lines.push('色：' + (state.color === 'other'
    ? otherLabel('color', '色は相談したい') : colorObj().label));
  groups().forEach(function (g) {
    const o = chosen(g.key);
    lines.push(g.label + '：' + (o.other ? otherLabel(g.key, '色は相談したい') : o.label));
  });
  if (product().size) {
    lines.push(product().size.label + '：' +
      (state.size ? state.size + ' ' + product().size.unit : '相談して決めたい'));
  }
  if (state.note) lines.push('ご相談：' + state.note);
  lines.push('');
  lines.push(product().tbd
    ? 'サイト上の参考価格：価格は準備中のため、お見積りをお願いします'
    : 'サイト上の参考価格：¥' + total().toLocaleString());
  return lines.join('\n');
}

document.getElementById('specCta').addEventListener('click', function () {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(specText()).catch(function () {});
  }
  showToast('仕様書をコピーしました。開いたDMに貼り付けて送ってください');
  window.open('https://ig.me/m/velf.__jp', '_blank', 'noopener');
});

// URL に ?product=xxx が付いていれば、その製品から始める
(function initFromQuery() {
  const id = new URLSearchParams(location.search).get('product');
  if (id && DATA.products.some(function (p) { return p.id === id; })) {
    selectProduct(id);
  }
})();
