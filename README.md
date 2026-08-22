# Bell EQ Frequency Response Visualizer

インストール不要の単一HTML版です。

## 使い方

1. [`index.html`](index.html)をダウンロード
2. ファイルをダブルクリック
3. Chromeで開く

Node.js、Next.js、Webサーバー、外部ライブラリは必要ありません。`index.html`が画面とSVG描画を、`biquad.js`が読みやすく分離した音響計算を担当します。

## ファイル

- `index.html`: UI、CSS、スライダー操作、SVG描画
- `biquad.js`: Web表示用の係数・周波数応答計算。係数名はRNBOとの対応が分かる`feedforward` / `feedback`
- `rnbo-codebox.rnboscript`: RNBOの`codebox~`へコピーできるDSP実装

## RNBOへ移植する

[`rnbo-codebox.rnboscript`](rnbo-codebox.rnboscript)をRNBOの`codebox~`へ貼り付けます。

- `in1`: 入力信号
- `out1`: Bell EQ処理後の信号
- Parameters: `frequency`、`gainDb`、`q`
- Sample Rate: RNBOの組み込み定数`samplerate`を使用

RNBOの`biquad.next(input, a0, a1, a2, b1, b2)`では、`a0/a1/a2`がフィードフォワード、`b1/b2`がフィードバックです。Webコードでは混同を避けるため、役割をそのまま`feedforward0..2`、`feedback1..2`と表記しています。

## 操作範囲

- Center Frequency: 20 Hz〜20 kHz（対数スケール）
- Gain: -18〜+18 dB
- Q: 0.1〜10
- Sample Rate: 48 kHz

初期値は1 kHz、+6 dB、Q = 1です。
