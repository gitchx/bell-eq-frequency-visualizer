# Bell EQ Frequency Response Visualizer

インストール不要の単一HTML版です。

## 使い方

1. [`index.html`](index.html)をダウンロード
2. ファイルをダブルクリック
3. Chromeで開く

Node.js、Next.js、Webサーバー、外部ライブラリは必要ありません。`index.html`が画面とSVG描画を、`biquad.js`が読みやすく分離した音響計算を担当します。

## ファイル

- `index.html`: UI、CSS、スライダー操作、SVG描画
- `biquad.js`: Bell EQのbiquad係数と`20 * log10(|H(e^jw)|)`の計算

## 操作範囲

- Center Frequency: 20 Hz〜20 kHz（対数スケール）
- Gain: -18〜+18 dB
- Q: 0.1〜10
- Sample Rate: 48 kHz

初期値は1 kHz、+6 dB、Q = 1です。
