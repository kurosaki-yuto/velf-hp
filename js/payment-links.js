/* =========================================================================
   商品ID → Stripe の Payment Link URL の対応表。

   使い方:
   1. Stripe ダッシュボードで商品ごとに Payment Link を発行する
      （決済後のリダイレクト先は設定しない。設定するとドメイン移行のときに
        リンクを1本ずつ直すことになる）
   2. 発行された https://buy.stripe.com/... を下の '' に貼る
   3. 貼った商品だけ、オーダー画面に「購入する」ボタンが出る。
      空のままの商品はこれまで通り DM 相談に流れる。

   注意: Payment Link は金額が固定。標準仕様のときだけ出す作りにしてある
   （その他の色など追加料金が発生する組み合わせを選ぶと自動で引っ込む）。
   ========================================================================= */
window.PAYMENT_LINKS = {
  belt_black: '',
  belt_horseshoe: '',
  trucker_wallet: '',
  star_wallet: '',
  key_case: '',
  card_case: '',
  glasses_case_red: '',
  waist_pouch: '',
  watch_band: '',
  leather_sleeve: ''
};
