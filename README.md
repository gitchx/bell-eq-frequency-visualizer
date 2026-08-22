# Bell EQ Frequency Response Visualizer

インストール不要の単一HTML版です。

## 使い方

1. [`index.html`](index.html)をダウンロード
2. ファイルをダブルクリック
3. Chromeで開く

Node.js、Next.js、Webサーバー、外部ライブラリは必要ありません。音響計算と描画処理は別々のJavaScriptファイルに分けています。

## ファイル

- `index.html`: 画面構造とCSS
- `biquad.js`: Bell EQ係数と周波数応答の音響計算
- `visualizer.js`: スライダー操作、座標変換、SVGグリッドとカーブの描画

`biquad.js`は係数名を`feedforward0..2`、`feedback1..2`としており、RNBOのbiquadへ対応づけやすい構成です。RNBO専用スクリプトは含めていません。

## 操作範囲

- Center Frequency: 20 Hz〜20 kHz（対数スケール）
- Gain: -18〜+18 dB
- Q: 0.1〜10
- Sample Rate: 48 kHz

初期値は1 kHz、+6 dB、Q = 1です。
