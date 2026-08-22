# Bell EQ Frequency Response Visualizer

Gen/Gen~で実装するBell EQを想定した、インタラクティブな周波数応答ビジュアライザーです。

- 20 Hz〜20 kHzの対数周波数軸
- Center Frequency、Gain、Qをリアルタイム操作
- RBJ Audio EQ CookbookのPeaking EQ係数
- `20 * log10(|H(e^jw)|)`を500点で計算してSVG描画
- iPhone Safari向けのレスポンシブ／タッチUI

## 開発

```bash
pnpm install
pnpm dev
```

## 他のフィルターを追加する

係数計算と周波数応答計算は [`lib/biquad.ts`](lib/biquad.ts) に分離されています。
Low-pass、High-pass、Shelfなどを追加するときは、`FilterDefinition`を満たす定義を追加します。

```ts
export const myFilter: FilterDefinition = {
  id: 'my-filter',
  label: 'My Filter',
  coefficients({ frequency, gain, q, sampleRate }) {
    // a0で正規化した係数を返す
    return { b0, b1, b2, a1, a2 };
  },
};
```

表示側では`peakingFilter`の代わりにその定義を選択します。振幅応答を求める`magnitudeDb()`とSVG描画処理はそのまま再利用できます。

## 公開版

https://bell-eq-frequency-visualizer.soma-ksg.chatgpt.site
