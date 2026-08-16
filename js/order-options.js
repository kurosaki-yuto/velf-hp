/* =========================================================================
   オーダーシミュレーターの中身。
   【この定数の値はすべて仮】。若林さんに実際に作れる範囲を確認して差し替える。
   - 革の種類 / 色 / ステッチ のラインナップ
   - 製品ごとの base（基本価格）と、各オプションの add（加算額）
   - 革種と色の組み合わせに制限があるか（例：ヌメ革は染色不可 等）も要確認
   ========================================================================= */

window.ORDER = {
  // 色。id は variants 画像のファイル名（<product>_<id>.jpg）と対応させている
  colors: [
    { id: 'black', label: 'ブラック', chip: '#1c1c1c', add: 0 },
    { id: 'darkbrown', label: 'ダークブラウン', chip: '#3f2a1b', add: 0 },
    { id: 'brown', label: 'ブラウン', chip: '#7a4a2b', add: 0 },
    { id: 'camel', label: 'キャメル', chip: '#b3763f', add: 0 },
    { id: 'natural', label: 'ナチュラル', chip: '#d8b483', add: 0 }
  ],

  // 全製品に共通で選べるもの
  common: [
    {
      key: 'leather',
      label: '革の種類',
      note: '同じ色でも、革が変わると硬さと育ち方が変わります。',
      options: [
        { id: 'nume', label: 'ヌメ革', add: 0, desc: '経年で飴色に育つ、いちばん変化が楽しめる革。' },
        { id: 'oil', label: 'オイルドレザー', add: 2000, desc: 'しっとり柔らかく、傷が馴染みやすい。' },
        { id: 'bridle', label: 'ブライドルレザー', add: 4000, desc: '硬く締まった英国革。使うほど艶が出る。' }
      ]
    },
    {
      key: 'stitch',
      label: 'ステッチ',
      note: '手縫いの糸の色。',
      options: [
        { id: 'natural', label: '生成り', chip: '#e6dcc8', add: 0 },
        { id: 'black', label: 'ブラック', chip: '#151515', add: 0 },
        { id: 'white', label: 'ホワイト', chip: '#f2f2f2', add: 0 },
        { id: 'yellow', label: 'イエロー', chip: '#d8ae2e', add: 0 },
        { id: 'omakase', label: 'おまかせ', chip: 'transparent', add: 0, desc: '革の色に合わせて若林が選びます。' }
      ]
    }
  ],

  products: [
    {
      id: 'belt_black', name: 'レザーベルト', base: 15000, cat: 'ベルト',
      extra: [
        {
          key: 'width', label: '幅', note: 'ベルトループの幅に合わせて。迷ったら35mm。',
          options: [
            { id: 'w30', label: '30mm', add: 0 },
            { id: 'w35', label: '35mm', add: 0 },
            { id: 'w40', label: '40mm', add: 1500 }
          ]
        },
        {
          key: 'buckle', label: 'バックル', note: '',
          options: [
            { id: 'square_silver', label: '角型 / シルバー', chip: '#b9bcc0', add: 0 },
            { id: 'square_black', label: '角型 / ブラック', chip: '#3a3a3a', add: 0 },
            { id: 'round_brass', label: 'ラウンド / 真鍮', chip: '#b08d3f', add: 1500 }
          ]
        }
      ],
      size: { label: '胴回り', unit: 'cm', placeholder: '例：82', min: 60, max: 130,
              note: 'いつも締めている位置で測ってください。分からなければ空欄で構いません。' }
    },
    {
      id: 'belt_horseshoe', name: '蹄鉄バックルベルト', base: 19000, cat: 'ベルト',
      extra: [
        {
          key: 'width', label: '幅', note: '',
          options: [
            { id: 'w35', label: '35mm', add: 0 },
            { id: 'w40', label: '40mm', add: 1500 }
          ]
        }
      ],
      size: { label: '胴回り', unit: 'cm', placeholder: '例：82', min: 60, max: 130,
              note: 'いつも締めている位置で測ってください。分からなければ空欄で構いません。' }
    },
    { id: 'trucker_wallet', name: 'トラッカーウォレット', base: 28000, cat: 'ウォレット',
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
    { id: 'key_case', name: 'キーケース', base: 8000, cat: 'ケース' },
    { id: 'card_case', name: 'カードケース', base: 6500, cat: 'ケース' },
    { id: 'glasses_case_red', name: 'メガネケース', base: 9500, cat: 'ケース' },
    { id: 'flap_case', name: 'フラップケース', base: 8500, cat: 'ケース' },
    { id: 'waist_pouch', name: 'ウエストポーチ', base: 20000, cat: '小物' },
    { id: 'watch_band', name: 'ウォッチバンド', base: 12000, cat: '小物',
      size: { label: 'ラグ幅', unit: 'mm', placeholder: '例：20', min: 12, max: 30,
              note: '時計側の取り付け幅。分からなければ機種名をご相談時にお知らせください。' } },
    { id: 'bag_charm', name: 'ミニバッグチャーム', base: 5500, cat: '小物' },
    { id: 'leather_sleeve', name: 'レザースリーブ', base: 4500, cat: '小物' }
  ]
};
