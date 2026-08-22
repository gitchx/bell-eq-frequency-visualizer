# Bell EQ Frequency Response Visualizer

インストール不要の単一HTML版です。

## 使い方

1. [`index.html`](index.html)をダウンロード
2. ファイルをダブルクリック
3. Chromeで開く

Node.js、Next.js、Webサーバー、外部ライブラリは必要ありません。CSS、JavaScript、biquad係数計算、`20 * log10(|H(e^jw)|)`の周波数応答計算、SVG描画をすべて`index.html`内に収めています。

## 操作範囲

- Center Frequency: 20 Hz〜20 kHz（対数スケール）
- Gain: -18〜+18 dB
- Q: 0.1〜10
- Sample Rate: 48 kHz

初期値は1 kHz、+6 dB、Q = 1です。
