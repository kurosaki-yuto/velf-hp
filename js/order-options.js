/* =========================================================================
   オーダーシミュレーターの中身。
   【要確認】その他の色を選んだときの追加費用は未定。若林さんに確認して
   OTHER_COLOR_NOTE と add の値を入れる。
   ========================================================================= */

window.ORDER = {
  // 色。id は variants 画像のファイル名（<product>_<id>.jpg）と対応させている
  colors: [
    { id: 'black', label: 'ブラック', chip: '#1c1c1c', add: 0 },
    { id: 'darkbrown', label: 'ダークブラウン', chip: '#3f2a1b', add: 0 },
    { id: 'natural', label: 'ナチュラル', chip: '#d8b483', add: 0 },
    { id: 'other', label: 'その他の色', chip: 'other', add: 0,
      desc: '上記以外の色をご希望の場合、革の取り寄せが必要になるため別途費用をいただきます。ご相談ください。' }
  ],

  // 全製品に共通で選べるもの
  common: [
    {
      key: 'stitch',
      label: 'ステッチ',
      note: '手縫いの糸の色。',
      options: [
        { id: 'black', label: 'ブラック', chip: '#151515', add: 0 },
        { id: 'natural', label: 'きなり', chip: '#e6dcc8', add: 0 },
        { id: 'turquoise', label: 'ターコイズブルー', chip: '#3aa6b9', add: 0 },
        { id: 'darkbrown', label: 'ダークブラウン', chip: '#3f2a1b', add: 0 },
        { id: 'other', label: 'その他の色', chip: 'other', add: 0,
          desc: '上記以外の色をご希望の場合、糸の取り寄せが必要になるため別途費用をいただきます。ご相談ください。' }
      ]
    }
  ],

  products: [
    {
      id: 'belt_black', name: 'レザーベルト', base: 8900, cat: 'ベルト',
      extra: [
        {
          key: 'width', label: '幅', note: 'ベルトループの幅に合わせて。迷ったら35mm。',
          options: [
            { id: 'w30', label: '30mm', add: 0 },
            { id: 'w35', label: '35mm', add: 0 },
            { id: 'w40', label: '40mm', add: 0 }
          ]
        },
        {
          key: 'buckle', label: 'バックル', note: '',
          options: [
            { id: 'square_silver', label: '角型 / シルバー', chip: '#b9bcc0', add: 0 },
            { id: 'square_black', label: '角型 / ブラック', chip: '#3a3a3a', add: 0 },
            { id: 'round_brass', label: 'ラウンド / 真鍮', chip: '#b08d3f', add: 0 }
          ]
        }
      ],
      size: { label: '胴回り', unit: 'cm', placeholder: '例：82', min: 60, max: 130,
              note: 'いつも締めている位置で測ってください。分からなければ空欄で構いません。' }
    },
    {
      id: 'belt_horseshoe', name: 'ブレスレット', base: 3980, cat: '小物',
      size: { label: '手首まわり', unit: 'cm', placeholder: '例：17', min: 12, max: 25,
              note: '手首のいちばん細いところを測ってください。分からなければ空欄で構いません。' }
    },
    { id: 'trucker_wallet', name: 'トラッカーウォレット', base: 14000, cat: 'ウォレット',
      extra: [
        {
          key: 'concho', label: 'コンチョ', note: '',
          options: [
            { id: 'flower_silver', label: 'フラワー / シルバー', chip: '#b9bcc0', add: 0 },
            { id: 'plain', label: 'コンチョなし', chip: 'transparent', add: 0 }
          ]
        }
      ]
    },
    { id: 'star_wallet', name: 'スタースタッズウォレット', base: 30000, cat: 'ウォレット' },
    { id: 'key_case', name: 'キーケース', base: 5000, cat: 'ケース' },
    { id: 'card_case', name: 'カードケース', base: 3980, cat: 'ケース' },
    { id: 'glasses_case_red', name: 'メガネケース', base: 5000, cat: 'ケース' },
    { id: 'waist_pouch', name: 'ウエストポーチ', base: 4000, cat: '小物' },
    { id: 'watch_band', name: 'ウォッチバンド', base: 12000, cat: '小物',
      size: { label: 'ラグ幅', unit: 'mm', placeholder: '例：20', min: 12, max: 30,
              note: '時計側の取り付け幅。分からなければ機種名をご相談時にお知らせください。' } },
    { id: 'leather_sleeve', name: 'レザースリーブ', base: 2500, cat: '小物' }
  ]
};
