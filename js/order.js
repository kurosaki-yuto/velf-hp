/* オーダーシミュレーター（ベルト） */

// ---- ドロワー（トップと同じ挙動） ----
const menuBtn = document.getElementById('menuBtn');
const drawer = document.getElementById('drawer');
const overlay = document.getElementById('drawerOverlay');
const closeBtn = document.getElementById('drawerClose');

if (menuBtn && drawer && overlay && closeBtn) {
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
  menuBtn.addEventListener('click', openDrawer);
  closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) closeDrawer();
  });
}

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
const PRODUCT = window.ORDER_OPTIONS.belt;
const state = { size: '' };
PRODUCT.groups.forEach(function (g) { state[g.key] = g.options[0].id; });

function picked(groupKey) {
  const group = PRODUCT.groups.find(function (g) { return g.key === groupKey; });
  return group.options.find(function (o) { return o.id === state[groupKey]; });
}

// ---- コントロール描画 ----
const controls = document.getElementById('builderControls');

PRODUCT.groups.forEach(function (group) {
  const block = document.createElement('div');
  block.className = 'ctrl';

  const head = document.createElement('div');
  head.className = 'ctrl-head';
  head.innerHTML = '<span class="ctrl-label">' + group.label + '</span>' +
    '<span class="ctrl-value" data-value-for="' + group.key + '"></span>';
  block.appendChild(head);

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
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'swatch' + (opt.id === state[group.key] ? ' is-active' : '');
    btn.dataset.group = group.key;
    btn.dataset.id = opt.id;
    btn.setAttribute('role', 'radio');
    btn.setAttribute('aria-checked', opt.id === state[group.key] ? 'true' : 'false');

    if (opt.color) {
      const chip = document.createElement('span');
      chip.className = 'swatch-chip' + (opt.color === 'transparent' ? ' is-none' : '');
      chip.style.background = opt.color;
      btn.appendChild(chip);
    }
    const label = document.createElement('span');
    label.className = 'swatch-label';
    label.textContent = opt.label + (opt.add ? ' +' + opt.add.toLocaleString() + '円' : '');
    btn.appendChild(label);

    btn.addEventListener('click', function () {
      state[group.key] = opt.id;
      list.querySelectorAll('.swatch').forEach(function (b) {
        const on = b.dataset.id === opt.id;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-checked', on ? 'true' : 'false');
      });
      render();
    });

    list.appendChild(btn);
  });

  block.appendChild(list);

  const desc = document.createElement('p');
  desc.className = 'ctrl-desc';
  desc.dataset.descFor = group.key;
  block.appendChild(desc);

  controls.appendChild(block);
});

// サイズは自由入力（ベルトは胴回りが要る）
const sizeBlock = document.createElement('div');
sizeBlock.className = 'ctrl';
sizeBlock.innerHTML =
  '<div class="ctrl-head"><span class="ctrl-label">サイズ</span></div>' +
  '<p class="ctrl-note">いつも締めている位置の胴回り。分からなければ空欄のままで大丈夫です。ご相談のときに測り方をご案内します。</p>' +
  '<div class="size-field"><input type="number" id="sizeInput" min="60" max="130" step="1" placeholder="例：82" inputmode="numeric"><span>cm</span></div>';
controls.appendChild(sizeBlock);
document.getElementById('sizeInput').addEventListener('input', function () {
  state.size = this.value.trim();
  render();
});

// ---- SVG 描画 ----
const svg = document.querySelector('.belt-svg');
const WIDTH_PX = { 30: 68, 35: 80, 40: 92 };

function renderSvg() {
  const leather = picked('color').color;
  const stitch = picked('stitch').color;
  const buckle = picked('buckle').color;
  const h = WIDTH_PX[picked('width').value] || 80;

  svg.style.setProperty('--leather', leather);
  svg.style.setProperty('--stitch', stitch);
  svg.style.setProperty('--buckle', buckle);

  const cy = 140;
  const top = cy - h / 2;
  const bot = cy + h / 2;
  const x0 = 150;          // バックルに隠れる側の端
  const xStraight = 770;   // 剣先が絞られはじめる位置
  const tip = 858;         // 剣先の先端

  // 本体。右端は剣先らしく尖らせる
  document.getElementById('strapBody').setAttribute('d',
    'M' + x0 + ',' + top +
    ' L' + xStraight + ',' + top +
    ' Q' + (tip - 10) + ',' + (top + 6) + ' ' + tip + ',' + cy +
    ' Q' + (tip - 10) + ',' + (bot - 6) + ' ' + xStraight + ',' + bot +
    ' L' + x0 + ',' + bot + ' Z');

  // 下辺に薄い陰を敷いてコバの厚みを出す
  document.getElementById('strapShade').setAttribute('d',
    'M' + x0 + ',' + (bot - 9) +
    ' L' + xStraight + ',' + (bot - 9) +
    ' Q' + (tip - 26) + ',' + (bot - 12) + ' ' + (tip - 6) + ',' + (cy + 8) +
    ' Q' + (tip - 12) + ',' + (bot - 4) + ' ' + xStraight + ',' + bot +
    ' L' + x0 + ',' + bot + ' Z');

  // ステッチは剣先の輪郭に沿わせる
  const inset = 11;
  const stitchOn = picked('stitch').id !== 'none';
  document.getElementById('strapStitchTop').setAttribute('d',
    stitchOn ? 'M' + (x0 + 40) + ',' + (top + inset) +
      ' L' + (xStraight - 4) + ',' + (top + inset) +
      ' Q' + (tip - 22) + ',' + (top + inset + 5) + ' ' + (tip - inset) + ',' + cy : '');
  document.getElementById('strapStitchBottom').setAttribute('d',
    stitchOn ? 'M' + (x0 + 40) + ',' + (bot - inset) +
      ' L' + (xStraight - 4) + ',' + (bot - inset) +
      ' Q' + (tip - 22) + ',' + (bot - inset - 5) + ' ' + (tip - inset) + ',' + cy : '');

  const holes = document.getElementById('holes');
  holes.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    const e = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    e.setAttribute('cx', 618 + i * 34);
    e.setAttribute('cy', cy);
    e.setAttribute('rx', 5);
    e.setAttribute('ry', 8);
    e.setAttribute('fill', 'rgba(0,0,0,0.45)');
    e.setAttribute('stroke', 'rgba(255,255,255,0.22)');
    e.setAttribute('stroke-width', '1.2');
    holes.appendChild(e);
  }

  // ベルトループ（遊革）
  const keeper = document.getElementById('keeper');
  keeper.setAttribute('x', 300);
  keeper.setAttribute('y', top - 7);
  keeper.setAttribute('width', 28);
  keeper.setAttribute('height', h + 14);

  // バックル。枠を本体より一回り大きく取り、尾錠のピンを通す
  const bh = h + 28;
  const frame = document.getElementById('buckleFrame');
  frame.setAttribute('x', 86);
  frame.setAttribute('y', cy - bh / 2);
  frame.setAttribute('width', 140);
  frame.setAttribute('height', bh);

  const pin = document.getElementById('bucklePin');
  pin.setAttribute('x', 151);
  pin.setAttribute('y', cy - bh / 2 - 6);
  pin.setAttribute('width', 10);
  pin.setAttribute('height', bh + 12);

  // 剣先に向かう尾錠の爪
  document.getElementById('buckleTongue').setAttribute('d',
    'M156,' + (cy - 8) + ' L272,' + (cy - 4.5) + ' L272,' + (cy + 4.5) + ' L156,' + (cy + 8) + ' Z');
}

// ---- 仕様と価格 ----
function total() {
  return PRODUCT.groups.reduce(function (sum, g) {
    return sum + (picked(g.key).add || 0);
  }, PRODUCT.base);
}

function renderSpec() {
  const list = document.getElementById('specList');
  list.innerHTML = '';

  PRODUCT.groups.forEach(function (g) {
    const row = document.createElement('div');
    row.innerHTML = '<dt>' + g.label + '</dt><dd>' + picked(g.key).label + '</dd>';
    list.appendChild(row);
  });

  const row = document.createElement('div');
  row.innerHTML = '<dt>サイズ</dt><dd>' + (state.size ? state.size + ' cm' : '相談して決める') + '</dd>';
  list.appendChild(row);

  document.getElementById('specPrice').textContent = '¥' + total().toLocaleString();

  PRODUCT.groups.forEach(function (g) {
    const el = document.querySelector('[data-value-for="' + g.key + '"]');
    if (el) el.textContent = picked(g.key).label;
    const desc = document.querySelector('[data-desc-for="' + g.key + '"]');
    if (desc) desc.textContent = picked(g.key).desc || '';
  });
}

function render() {
  renderSvg();
  renderSpec();
}

function specText() {
  const lines = ['VÉLF ' + PRODUCT.name + ' のオーダーで相談したいです。', ''];
  PRODUCT.groups.forEach(function (g) {
    lines.push(g.label + '：' + picked(g.key).label);
  });
  lines.push('サイズ：' + (state.size ? state.size + ' cm' : '相談して決めたい'));
  lines.push('');
  lines.push('サイト上の参考価格：¥' + total().toLocaleString());
  return lines.join('\n');
}

document.getElementById('specCta').addEventListener('click', function () {
  const text = specText();
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).catch(function () {});
  }
  showToast('仕様書をコピーしました。開いたDMに貼り付けて送ってください');
  window.open('https://ig.me/m/velf.__jp', '_blank', 'noopener');
});

render();
