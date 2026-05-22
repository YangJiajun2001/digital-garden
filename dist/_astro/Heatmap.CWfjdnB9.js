import{j as n}from"./jsx-runtime.ClP7wGfN.js";import{r as g}from"./index.DK-fsZOb.js";const y=130,E=56,u=16;function O({items:j}){const w=g.useRef(null);g.useRef(null);const b=g.useMemo(()=>{const t=new Date,e=new Date(t);e.setFullYear(e.getFullYear()-1);const s={};j.forEach(i=>{const a=new Date(i.pubDate).toISOString().split("T")[0],r=i.content.length;s[a]=(s[a]||0)+r});const o=[],l=new Date(e);for(;l<=t;){const i=l.toISOString().split("T")[0];o.push({date:i,count:s[i]||0}),l.setDate(l.getDate()+1)}return o},[j]),L=t=>t===0?"bg-gray-800":t<100?"bg-green-800":t<500?"bg-green-600":t<1e3?"bg-green-500":"bg-green-400",k=["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],T=["日","一","二","三","四","五","六"],m=14,f=3,D=m+f,h=[],M=b.length;let N=-1;for(let t=0;t<M;t+=7){const e=b.slice(t,t+7),o=new Date(e[0]?.date||new Date).getMonth(),l=o!==N?k[o]:"";h.push({monthLabel:l,monthOffset:o,days:e}),N=o}const S=g.useMemo(()=>{const t=[],e=h.length,s=new Date(h[0]?.days[0]?.date||new Date);for(let o=0;o<12;o++){const l=(s.getMonth()+o)%12,i=s.getFullYear()+(s.getMonth()+o>=12?1:0),x=new Date(i,l,1),a=new Date(i,l+1,1),r=Math.floor((x.getTime()-s.getTime())/(10080*60*1e3)),p=Math.floor((a.getTime()-s.getTime())/(10080*60*1e3)),c=Math.floor((r+p)/2);c>=0&&c<e&&t.push({label:k[l],left:c*D+D/2-12})}return t},[h]);return g.useEffect(()=>{if(!w.current)return;const t=w.current.querySelectorAll(".day-cell");let e=null;const s=()=>e||(e=document.createElement("div"),e.className="heatmap-tooltip",e.innerHTML=`
        <div class="heatmap-tooltip-date"></div>
        <div class="heatmap-tooltip-count"></div>
        <div class="heatmap-tooltip-arrow"></div>
      `,document.body.appendChild(e),e),o=(a,r)=>{if(!e)return;const p=window.innerWidth,c=window.innerHeight;let d=a+u,v=r+u;d+y>p-8&&(d=a-y-u),v+E>c-8&&(v=r-E-u),e.style.left=`${d}px`,e.style.top=`${v}px`},l=a=>{const r=a.target,p=r.getAttribute("data-date"),c=r.getAttribute("data-count");if(!p||!c)return;const d=s();d.querySelector(".heatmap-tooltip-date").textContent=p,d.querySelector(".heatmap-tooltip-count").textContent=`灌溉了 ${c} 字`,d.classList.add("visible"),o(a.clientX,a.clientY)},i=a=>{!e||!e.classList.contains("visible")||o(a.clientX,a.clientY)},x=()=>{e&&e.classList.remove("visible")};return t.forEach(a=>{a.addEventListener("mouseenter",l),a.addEventListener("mousemove",i),a.addEventListener("mouseleave",x)}),()=>{t.forEach(a=>{a.removeEventListener("mouseenter",l),a.removeEventListener("mousemove",i),a.removeEventListener("mouseleave",x)}),e&&(document.body.removeChild(e),e=null)}},[b]),n.jsxs("div",{className:"w-full relative",children:[n.jsx("style",{children:`
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
        
        .heatmap-wrapper::-webkit-scrollbar { display: none; }

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

        .legend-colors { display: flex; gap: 4px; }
        .legend-cell { width: 14px; height: 14px; border-radius: 3px; }

        .heatmap-container { display: flex; align-items: flex-start; gap: 12px; }

        .weekday-column {
          display: flex;
          flex-direction: column;
          gap: ${f}px;
          padding-top: 28px;
          flex-shrink: 0;
        }

        .weekday-item {
          height: ${m}px;
          line-height: ${m}px;
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
          gap: ${f}px;
          padding-top: 28px;
        }

        .week-column { display: flex; flex-direction: column; gap: ${f}px; }

        .day-cell {
          width: ${m}px;
          height: ${m}px;
          border-radius: 3px;
          cursor: pointer;
          transition: all 0.15s ease;
          flex-shrink: 0;
        }

        .day-cell:hover {
          transform: scale(1.3);
          box-shadow: 0 0 8px rgba(74, 222, 128, 0.4);
        }

        .heatmap-tooltip {
          position: fixed;
          z-index: 9999;
          padding: 8px 12px;
          background: rgba(17, 24, 39, 0.98);
          backdrop-filter: blur(12px);
          border-radius: 8px;
          font-size: 12px;
          color: #f9fafb;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(75, 85, 99, 0.5);
          pointer-events: none;
          white-space: nowrap;
          width: ${y}px;
          opacity: 0;
          transition: opacity 0.15s ease;
        }

        .heatmap-tooltip.visible {
          opacity: 1;
        }

        .heatmap-tooltip-date {
          color: #9ca3af;
          margin-bottom: 4px;
          font-size: 11px;
        }

        .heatmap-tooltip-count {
          color: #4ade80;
          font-weight: 600;
          font-size: 13px;
        }

        .heatmap-tooltip-arrow {
          position: absolute;
          left: -4px;
          top: 50%;
          transform: translateY(-50%) rotate(45deg);
          width: 8px;
          height: 8px;
          background: rgba(17, 24, 39, 0.98);
          border-left: 1px solid rgba(75, 85, 99, 0.5);
          border-top: 1px solid rgba(75, 85, 99, 0.5);
        }
      `}),n.jsx("div",{className:"heatmap-wrapper",children:n.jsxs("div",{className:"heatmap-inner",children:[n.jsxs("div",{className:"heatmap-legend",children:[n.jsx("span",{className:"legend-text",children:"少"}),n.jsxs("div",{className:"legend-colors",children:[n.jsx("div",{className:"legend-cell bg-gray-800"}),n.jsx("div",{className:"legend-cell bg-green-800"}),n.jsx("div",{className:"legend-cell bg-green-600"}),n.jsx("div",{className:"legend-cell bg-green-500"}),n.jsx("div",{className:"legend-cell bg-green-400"})]}),n.jsx("span",{className:"legend-text",children:"多"})]}),n.jsxs("div",{className:"heatmap-container",children:[n.jsx("div",{className:"weekday-column",children:T.map((t,e)=>n.jsx("div",{className:"weekday-item",children:t},e))}),n.jsxs("div",{className:"heatmap-grid-wrapper",children:[n.jsx("div",{className:"month-labels",children:S.map((t,e)=>n.jsx("div",{className:"month-label",style:{left:`${t.left}px`},children:t.label},e))}),n.jsx("div",{className:"week-columns",ref:w,children:h.map((t,e)=>n.jsx("div",{className:"week-column",children:t.days.map((s,o)=>n.jsx("div",{className:`day-cell ${L(s.count)}`,"data-date":s.date,"data-count":s.count},o))},e))})]})]})]})})]})}export{O as default};
