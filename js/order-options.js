/* =========================================================================
   オーダーシミュレーターの選択肢と価格。
   ここの中身は【すべて仮】。若林さんに実際に作れる範囲を確認して差し替える。
   - 革の種類 / 色 / バックル / ステッチ色 のラインナップ
   - base と add の金額
   確認できるまで、サイトには「仮の参考価格」と明示して出す。
   ========================================================================= */
window.ORDER_OPTIONS = {
  belt: {
    name: 'レザーベルト',
    base: 15000,
    groups: [
      {
        key: 'leather',
        label: '革',
        note: '本体に使う革を選びます。',
        options: [
          { id: 'nume', label: 'ヌメ革', color: '#c89a63', add: 0, desc: '経年で飴色に育つ、いちばん変化が楽しめる革。' },
          { id: 'oil', label: 'オイルドレザー', color: '#7a4a2b', add: 2000, desc: 'しっとり柔らかく、傷が馴染みやすい。' },
          { id: 'bridle', label: 'ブライドルレザー', color: '#3b2415', add: 4000, desc: '硬く締まった英国革。育つほど艶が出る。' }
        ]
      },
      {
        key: 'color',
        label: '色',
        note: '',
        options: [
          { id: 'black', label: 'ブラック', color: '#1c1c1c', add: 0 },
          { id: 'darkbrown', label: 'ダークブラウン', color: '#3f2a1b', add: 0 },
          { id: 'brown', label: 'ブラウン', color: '#7a4a2b', add: 0 },
          { id: 'camel', label: 'キャメル', color: '#b3763f', add: 0 },
          { id: 'natural', label: 'ナチュラル', color: '#d8b483', add: 0 },
          { id: 'navy', label: 'ネイビー', color: '#22303f', add: 1000 },
          { id: 'red', label: 'レッド', color: '#8e2230', add: 1000 }
        ]
      },
      {
        key: 'width',
        label: '幅',
        note: 'ベルトループの幅に合わせて選びます。迷ったら35mm。',
        options: [
          { id: 'w30', label: '30mm', value: 30, add: 0 },
          { id: 'w35', label: '35mm', value: 35, add: 0 },
          { id: 'w40', label: '40mm', value: 40, add: 1500 }
        ]
      },
      {
        key: 'buckle',
        label: 'バックル',
        note: '',
        options: [
          { id: 'square_silver', label: '角型 / シルバー', color: '#b9bcc0', add: 0 },
          { id: 'square_black', label: '角型 / ブラック', color: '#3a3a3a', add: 0 },
          { id: 'round_brass', label: 'ラウンド / 真鍮', color: '#b08d3f', add: 1500 },
          { id: 'horseshoe', label: '蹄鉄 / 真鍮', color: '#a8823a', add: 4000, desc: '一本ずつ手作業で成形するため、納期が長くなります。' }
        ]
      },
      {
        key: 'stitch',
        label: 'ステッチ',
        note: '手縫いの糸の色。',
        options: [
          { id: 'none', label: 'ステッチなし', color: 'transparent', add: 0 },
          { id: 'natural', label: '生成り', color: '#e6dcc8', add: 1000 },
          { id: 'black', label: 'ブラック', color: '#151515', add: 1000 },
          { id: 'white', label: 'ホワイト', color: '#f2f2f2', add: 1000 },
          { id: 'yellow', label: 'イエロー', color: '#d8ae2e', add: 1000 }
        ]
      }
    ]
  }
};
