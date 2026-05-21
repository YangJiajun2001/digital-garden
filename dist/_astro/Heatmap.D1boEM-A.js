import{j as t}from"./jsx-runtime.s5l94Kta.js";import{r as i}from"./index.Dkaqzkgy.js";function z({items:w}){const[r,p]=i.useState(null),T=i.useRef(null),y=i.useRef(0),v=i.useMemo(()=>{const e=new Date,o=new Date(e);o.setFullYear(o.getFullYear()-1);const n={};w.forEach(l=>{const g=new Date(l.pubDate).toISOString().split("T")[0],u=l.content.length;n[g]=(n[g]||0)+u});const a=[],s=new Date(o);for(;s<=e;){const l=s.toISOString().split("T")[0];a.push({date:l,count:n[l]||0}),s.setDate(s.getDate()+1)}return a},[w]),E=e=>e===0?"bg-gray-800":e<100?"bg-green-800":e<500?"bg-green-600":e<1e3?"bg-green-500":"bg-green-400",j=["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],I=["日","一","二","三","四","五","六"],c=14,x=3,k=c+x,d=[],O=v.length;let N=-1;for(let e=0;e<O;e+=7){const o=v.slice(e,e+7),a=new Date(o[0]?.date||new Date).getMonth(),s=a!==N?j[a]:"";d.push({monthLabel:s,monthOffset:a,days:o}),N=a}const L=i.useMemo(()=>{const e=[],o=d.length,n=new Date(d[0]?.days[0]?.date||new Date);for(let a=0;a<12;a++){const s=(n.getMonth()+a)%12,l=n.getFullYear()+(n.getMonth()+a>=12?1:0),M=new Date(l,s,1),g=new Date(l,s+1,1),u=Math.floor((M.getTime()-n.getTime())/(10080*60*1e3)),C=Math.floor((g.getTime()-n.getTime())/(10080*60*1e3)),b=Math.floor((u+C)/2);b>=0&&b<o&&e.push({label:j[s],left:b*k+k/2-12})}return e},[d]),m=130,W=56,D=8,f=12,h=i.useCallback((e,o)=>{const n=window.innerWidth;let a=e-m/2,s=o-W-D-f,l="top";return a<8?a=8:a+m>n-8&&(a=n-m-8),s<f&&(s=o+D+f,l="bottom"),{x:a,y:s,position:l}},[]),Y=i.useCallback((e,o,n)=>{const{x:a,y:s,position:l}=h(e.clientX,e.clientY);p({date:o,count:n,x:a,y:s,position:l})},[h]),S=i.useCallback(e=>{p(o=>{if(!o)return null;const{x:n,y:a,position:s}=h(e.clientX,e.clientY);return{...o,x:n,y:a,position:s}})},[h]),$=i.useCallback(()=>{p(null)},[]);return i.useEffect(()=>{const e=()=>{r&&p(o=>o||null)};return window.addEventListener("scroll",e,{passive:!0}),()=>window.removeEventListener("scroll",e)},[r]),i.useEffect(()=>()=>{y.current&&cancelAnimationFrame(y.current)},[]),t.jsxs("div",{className:"w-full",children:[t.jsx("style",{children:`
        .heatmap-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 16px;
          width: 100%;
          overflow-x: auto;
          overflow-y: hidden;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        
        .heatmap-wrapper::-webkit-scrollbar {
          display: none;
        }

        .heatmap-inner {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          min-width: max-content;
        }

        .heatmap-legend {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
          align-self: center;
        }

        .legend-text {
          font-size: 12px;
          color: #9ca3af;
          font-weight: 500;
        }

        .legend-colors {
          display: flex;
          gap: 4px;
        }

        .legend-cell {
          width: 14px;
          height: 14px;
          border-radius: 3px;
        }

        .heatmap-container {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .weekday-column {
          display: flex;
          flex-direction: column;
          gap: ${x}px;
          padding-top: 28px;
          flex-shrink: 0;
        }

        .weekday-item {
          height: ${c}px;
          line-height: ${c}px;
          font-size: 11px;
          color: #6b7280;
          font-weight: 500;
          text-align: right;
          min-width: 20px;
        }

        .heatmap-grid-wrapper {
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .month-labels {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 24px;
          display: flex;
          align-items: flex-end;
        }

        .month-label {
          position: absolute;
          font-size: 11px;
          color: #6b7280;
          font-weight: 500;
          white-space: nowrap;
        }

        .week-columns {
          display: flex;
          gap: ${x}px;
          padding-top: 28px;
        }

        .week-column {
          display: flex;
          flex-direction: column;
          gap: ${x}px;
        }

        .day-cell {
          width: ${c}px;
          height: ${c}px;
          border-radius: 3px;
          cursor: pointer;
          transition: all 0.15s ease;
          flex-shrink: 0;
        }

        .day-cell:hover {
          transform: scale(1.3);
          box-shadow: 0 0 8px rgba(74, 222, 128, 0.4);
        }

        .tooltip {
          position: fixed;
          z-index: 9999;
          padding: 8px 12px;
          background: rgba(17, 24, 39, 0.95);
          backdrop-filter: blur(12px);
          border-radius: 8px;
          font-size: 12px;
          color: #f9fafb;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(75, 85, 99, 0.5);
          pointer-events: none;
          white-space: nowrap;
          width: ${m}px;
          opacity: 1;
          transition: opacity 0.15s ease, transform 0.15s ease;
        }

        .tooltip-date {
          color: #9ca3af;
          margin-bottom: 4px;
          font-size: 11px;
        }

        .tooltip-count {
          color: #4ade80;
          font-weight: 600;
          font-size: 13px;
        }

        .tooltip-arrow {
          position: absolute;
          left: 50%;
          bottom: -4px;
          transform: translateX(-50%) rotate(45deg);
          width: 8px;
          height: 8px;
          background: rgba(17, 24, 39, 0.95);
          border-right: 1px solid rgba(75, 85, 99, 0.5);
          border-bottom: 1px solid rgba(75, 85, 99, 0.5);
        }

        .tooltip-below {
          transform: translateY(4px);
        }

        .tooltip-below .tooltip-arrow {
          top: -4px;
          bottom: auto;
          transform: translateX(-50%) rotate(-135deg);
          border-right: 1px solid rgba(75, 85, 99, 0.5);
          border-bottom: none;
          border-top: 1px solid rgba(75, 85, 99, 0.5);
        }

        .tooltip-enter {
          opacity: 0;
          transform: translateY(-8px);
        }

        .tooltip-enter-active {
          opacity: 1;
          transform: translateY(0);
        }

        .tooltip-exit {
          opacity: 1;
          transform: translateY(0);
        }

        .tooltip-exit-active {
          opacity: 0;
          transform: translateY(-8px);
        }
      `}),t.jsx("div",{className:"heatmap-wrapper",children:t.jsxs("div",{className:"heatmap-inner",children:[t.jsxs("div",{className:"heatmap-legend",children:[t.jsx("span",{className:"legend-text",children:"少"}),t.jsxs("div",{className:"legend-colors",children:[t.jsx("div",{className:"legend-cell bg-gray-800"}),t.jsx("div",{className:"legend-cell bg-green-800"}),t.jsx("div",{className:"legend-cell bg-green-600"}),t.jsx("div",{className:"legend-cell bg-green-500"}),t.jsx("div",{className:"legend-cell bg-green-400"})]}),t.jsx("span",{className:"legend-text",children:"多"})]}),t.jsxs("div",{className:"heatmap-container",children:[t.jsx("div",{className:"weekday-column",children:I.map((e,o)=>t.jsx("div",{className:"weekday-item",children:e},o))}),t.jsxs("div",{className:"heatmap-grid-wrapper",children:[t.jsx("div",{className:"month-labels",children:L.map((e,o)=>t.jsx("div",{className:"month-label",style:{left:`${e.left}px`},children:e.label},o))}),t.jsx("div",{className:"week-columns",children:d.map((e,o)=>t.jsx("div",{className:"week-column",children:e.days.map((n,a)=>t.jsx("div",{className:`day-cell ${E(n.count)}`,onMouseEnter:s=>Y(s,n.date,n.count),onMouseMove:S,onMouseLeave:$},a))},o))})]})]})]})}),r&&t.jsxs("div",{ref:T,className:`tooltip ${r.position==="bottom"?"tooltip-below":""}`,style:{left:r.x,top:r.y},children:[t.jsx("div",{className:"tooltip-date",children:r.date}),t.jsxs("div",{className:"tooltip-count",children:["灌溉了 ",r.count," 字"]}),t.jsx("div",{className:"tooltip-arrow"})]})]})}export{z as default};
