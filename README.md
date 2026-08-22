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

## biquad計算の役割

Web版は音声を再生・加工しません。`BiquadFilterNode`やサンプル単位の差分方程式による実音声処理は含まれておらず、グラフ表示に必要な計算だけを行います。

### `peakingCoefficients()`

Center Frequency、Gain、Q、Sample Rateから、Bell EQの正規化済みbiquad係数を計算します。

```text
feedforward0, feedforward1, feedforward2
feedback1, feedback2
```

この関数がBell EQの形を決めます。

### `magnitudeDb()`

`peakingCoefficients()`が作った係数をbiquadの伝達関数へ代入し、指定周波数における振幅を求めます。

```text
H(e^jw) =
  (ff0 + ff1 * e^(-jw) + ff2 * e^(-j2w))
  / (1 + fb1 * e^(-jw) + fb2 * e^(-j2w))

magnitudeDb = 20 * log10(|H(e^jw)|)
```

`visualizer.js`は20 Hz〜20 kHzの500点について`magnitudeDb()`を呼び出し、結果をSVGカーブとして描画します。

```text
Frequency / Gain / Q
        ↓
peakingCoefficients()  biquad係数を作る
        ↓
magnitudeDb()          各周波数での増減量をdBで求める
        ↓
visualizer.js          SVGへ描画する
```

## 操作範囲

- Center Frequency: 20 Hz〜20 kHz（対数スケール）
- Gain: -18〜+18 dB
- Q: 0.1〜10
- Sample Rate: 48 kHz

初期値は1 kHz、+6 dB、Q = 1です。
