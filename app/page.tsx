'use client';
import { useId, useMemo, useState } from 'react';
import { magnitudeDb, peakingFilter } from '../lib/biquad';
const FS=48000, FMIN=20, FMAX=20000, DMIN=-24, DMAX=24;
const logToFreq=(v:number)=>FMIN*Math.pow(FMAX/FMIN,v/1000);
const freqToLog=(v:number)=>Math.log(v/FMIN)/Math.log(FMAX/FMIN)*1000;
const fmtFreq=(v:number)=>v>=1000?`${(v/1000).toFixed(v>=10000?1:2).replace(/0+$/,'').replace(/\.$/,'')} kHz`:`${Math.round(v)} Hz`;
export default function Home(){
 const [frequency,setFrequency]=useState(1000),[gain,setGain]=useState(6),[q,setQ]=useState(1),titleId=useId();
 const model=useMemo(()=>{const c=peakingFilter.coefficients({frequency,gain,q,sampleRate:FS}),points=Array.from({length:500},(_,i)=>{const x=i/499*1000,f=logToFreq(i/499*1000),y=(DMAX-magnitudeDb(c,f,FS))/(DMAX-DMIN)*430;return `${x.toFixed(2)},${y.toFixed(2)}`}).join(' '),centerX=freqToLog(frequency),centerDb=magnitudeDb(c,frequency,FS),centerY=(DMAX-centerDb)/(DMAX-DMIN)*430;return{c,points,centerX,centerY,centerDb}},[frequency,gain,q]);
 const ft=[20,50,100,200,500,1000,2000,5000,10000,20000],dt=[24,18,12,6,0,-6,-12,-18,-24];
 return <main>
  <header className="topbar"><div className="brand"><span className="brand-mark" aria-hidden="true"><i/><i/><i/></span><span>BELL / EQ</span></div><div className="top-meta"><span className="status-dot"/>PEAKING FILTER <b>Fs {FS/1000} kHz</b></div></header>
  <section className="hero" aria-labelledby={titleId}><div className="eyebrow">GEN/GEN~ BIQUAD LAB</div><div className="headline-row"><h1 id={titleId}>Frequency Response</h1><p>Interactive bell equalizer response.<br/>Drag a control. Hear the math move.</p></div>
   <div className="visualizer-card"><div className="chart-head"><div><span>MAGNITUDE</span><strong>{model.centerDb>=0?'+':''}{model.centerDb.toFixed(2)} dB</strong><small>@ {fmtFreq(frequency)}</small></div><span className="live"><i/>LIVE</span></div>
    <div className="chart-wrap"><svg viewBox="-50 -15 1090 490" role="img" aria-label={`Bell EQ response, ${fmtFreq(frequency)}, ${gain>0?'+':''}${gain.toFixed(1)} decibels, Q ${q.toFixed(2)}`} preserveAspectRatio="none"><defs><linearGradient id="curveFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ff6b35" stopOpacity=".24"/><stop offset="1" stopColor="#ff6b35" stopOpacity="0"/></linearGradient><filter id="glow"><feGaussianBlur stdDeviation="6" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
     {dt.map(v=>{const y=(DMAX-v)/(DMAX-DMIN)*430;return <g key={v}><line x1="0" y1={y} x2="1000" y2={y} className={v===0?'zero-line':'grid-line'}/><text x="-12" y={y+4} textAnchor="end" className="axis-label">{v>0?'+':''}{v}</text></g>})}
     {ft.map(f=>{const x=freqToLog(f);return <g key={f}><line x1={x} y1="0" x2={x} y2="430" className="grid-line vertical"/><text x={x} y="458" textAnchor={f===20?'start':f===20000?'end':'middle'} className="axis-label">{f>=1000?`${f/1000}k`:f}</text></g>})}
     <polygon points={`0,215 ${model.points} 1000,215`} fill="url(#curveFill)"/><polyline points={model.points} className="response-glow" filter="url(#glow)"/><polyline points={model.points} className="response-line"/><line x1={model.centerX} y1="0" x2={model.centerX} y2="430" className="cursor-line"/><circle cx={model.centerX} cy={model.centerY} r="14" className="point-ring"/><circle cx={model.centerX} cy={model.centerY} r="5" className="point-core"/></svg><span className="y-title">dB</span><span className="x-title">FREQUENCY / Hz</span></div>
    <div className="controls"><Control label="Center Frequency" value={fmtFreq(frequency)} min={0} max={1000} step={1} inputValue={freqToLog(frequency)} onChange={v=>setFrequency(logToFreq(v))}/><Control label="Gain" value={`${gain>0?'+':''}${gain.toFixed(1)} dB`} min={-18} max={18} step={.1} inputValue={gain} onChange={setGain}/><Control label="Q / Bandwidth" value={q.toFixed(2)} min={.1} max={10} step={.01} inputValue={q} onChange={setQ}/></div>
   </div>
   <div className="data-strip"><div className="formula"><span>TRANSFER FUNCTION</span><code>H(z) = (b₀ + b₁z⁻¹ + b₂z⁻²) / (1 + a₁z⁻¹ + a₂z⁻²)</code></div><div className="coefficients">{Object.entries(model.c).map(([k,v])=><div key={k}><span>{k}</span><code>{Math.abs(v)<.0000005?'0.000000':v.toFixed(6)}</code></div>)}</div></div>
  </section><footer><span>RBJ AUDIO EQ COOKBOOK</span><span>20 Hz — 20 kHz · LOGARITHMIC SCALE</span><span>20 log₁₀ |H(eʲω)|</span></footer>
 </main>
}
function Control({label,value,min,max,step,inputValue,onChange}:{label:string,value:string,min:number,max:number,step:number,inputValue:number,onChange:(v:number)=>void}){const progress=(inputValue-min)/(max-min)*100;return <label className="control"><span className="control-label">{label}</span><strong>{value}</strong><input aria-label={label} type="range" min={min} max={max} step={step} value={inputValue} onChange={e=>onChange(Number(e.target.value))} style={{'--progress':`${progress}%`} as React.CSSProperties}/><span className="range-labels"><i>{label==='Gain'?'−18 dB':label.startsWith('Q')?'0.10':'20 Hz'}</i><i>{label==='Gain'?'+18 dB':label.startsWith('Q')?'10.00':'20 kHz'}</i></span></label>}
