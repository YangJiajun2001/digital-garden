import{j as f}from"./jsx-runtime.s5l94Kta.js";import{r as t}from"./index.Dkaqzkgy.js";const v=()=>{const[r,m]=t.useState({x:0,y:0}),[n,a]=t.useState(!1),s=t.useRef(0),o=t.useRef({x:0,y:0});return t.useEffect(()=>{const i=e=>{o.current={x:e.clientX,y:e.clientY},n||a(!0)},c=()=>{a(!1)},u=()=>{m(e=>{const d=e.x+(o.current.x-e.x)*.08,l=e.y+(o.current.y-e.y)*.08;return{x:d,y:l}}),s.current=requestAnimationFrame(u)};return window.addEventListener("mousemove",i),document.body.addEventListener("mouseleave",c),s.current=requestAnimationFrame(u),()=>{window.removeEventListener("mousemove",i),document.body.removeEventListener("mouseleave",c),cancelAnimationFrame(s.current)}},[n]),f.jsx("div",{className:`fixed pointer-events-none z-50 transition-opacity duration-300 ${n?"opacity-100":"opacity-0"}`,style:{left:r.x,top:r.y,transform:"translate(-50%, -50%)",width:"600px",height:"600px",background:`radial-gradient(
          circle at center,
          rgba(52, 211, 153, 0.08) 0%,
          rgba(52, 211, 153, 0.04) 20%,
          rgba(52, 211, 153, 0.02) 40%,
          transparent 70%
        )`,mixBlendMode:"screen"}})};export{v as default};
