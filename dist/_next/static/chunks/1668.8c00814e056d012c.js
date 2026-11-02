"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[1668],{6906:(e,r,i)=>{i.d(r,{A:()=>l});var o=i(12115);let n=e=>{let r=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,r,i)=>i?i.toUpperCase():r.toLowerCase());return r.charAt(0).toUpperCase()+r.slice(1)},t=(...e)=>e.filter((e,r,i)=>!!e&&""!==e.trim()&&i.indexOf(e)===r).join(" ").trim();var a={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let s=(0,o.forwardRef)(({color:e="currentColor",size:r=24,strokeWidth:i=2,absoluteStrokeWidth:n,className:s="",children:l,iconNode:d,...c},p)=>(0,o.createElement)("svg",{ref:p,...a,width:r,height:r,stroke:e,strokeWidth:n?24*Number(i)/Number(r):i,className:t("lucide",s),...!l&&!(e=>{for(let r in e)if(r.startsWith("aria-")||"role"===r||"title"===r)return!0})(c)&&{"aria-hidden":"true"},...c},[...d.map(([e,r])=>(0,o.createElement)(e,r)),...Array.isArray(l)?l:[l]])),l=(e,r)=>{let i=(0,o.forwardRef)(({className:i,...a},l)=>(0,o.createElement)(s,{ref:l,iconNode:r,className:t(`lucide-${n(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,i),...a}));return i.displayName=n(e),i}},9751:(e,r,i)=>{i.d(r,{S:()=>a});var o=i(95155),n=i(10218),t=i(26701);let a=({primaryCta:e,secondaryCta:r,helpText:i,footerText:a,watermark:s=!0,children:l,...d})=>{let c=e||r?(0,o.jsxs)(o.Fragment,{children:[e&&(()=>{let{label:r,...i}=e,t=i.variant||"primary";return(0,o.jsx)(n.B,{...i,variant:t,style:{width:"100%",...i.style},children:r})})(),r&&(()=>{let{label:e,...i}=r,t=i.variant||"secondary";return(0,o.jsx)(n.B,{...i,variant:t,style:{width:"100%",...i.style},children:e})})()]}):null;return(0,o.jsxs)(t.S,{id:d.id,className:d.className,children:[(0,o.jsx)(t.S.Header,{...d}),l?(0,o.jsx)(t.S.Body,{children:l}):null,i||c||s?(0,o.jsxs)(t.S.Footer,{children:[i?(0,o.jsx)(t.S.HelpText,{children:i}):null,c?(0,o.jsx)(t.S.Actions,{children:c}):null,s?(0,o.jsx)(t.S.Watermark,{}):null]}):null,a?(0,o.jsx)(t.S.FooterText,{children:a}):null]})}},26701:(e,r,i)=>{i.d(r,{S:()=>j});var o=i(95155),n=i(12115),t=i(51862),a=i(57445),s=i(92987),l=i(10218),d=i(98590);let c=t.I4.div`
  /* spacing tokens */
  --screen-space: 16px; /* base 1x = 16 */
  --screen-space-lg: calc(var(--screen-space) * 1.5); /* 24px */

  position: relative;
  overflow: hidden;
  margin: 0 calc(-1 * var(--screen-space)); /* extends over modal padding */
  height: 100%;
  border-radius: var(--privy-border-radius-lg);
`,p=t.I4.div`
  display: flex;
  flex-direction: column;
  gap: calc(var(--screen-space) * 1.5);
  width: 100%;
  background: var(--privy-color-background);
  padding: 0 var(--screen-space-lg) var(--screen-space);
  height: 100%;
  border-radius: var(--privy-border-radius-lg);
`,h=t.I4.div`
  position: relative;
  display: flex;
  flex-direction: column;
`,u=(0,t.I4)(l.M)`
  margin: 0 -8px;
`,m=t.I4.div`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;

  /* Enable scrolling */
  overflow-y: auto;

  /* Hide scrollbar but keep functionality when scrollable */
  /* Add padding for focus outline space, offset with negative margin */
  padding: 3px;
  margin: -3px;

  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-gutter: stable both-edges;
  scrollbar-width: none;
  -ms-overflow-style: none;

  /* Gradient effect for scroll indication */
  ${({$colorScheme:e})=>"light"===e?"background: linear-gradient(var(--privy-color-background), var(--privy-color-background) 70%) bottom, linear-gradient(rgba(0, 0, 0, 0) 20%, rgba(0, 0, 0, 0.06)) bottom;":"dark"===e?"background: linear-gradient(var(--privy-color-background), var(--privy-color-background) 70%) bottom, linear-gradient(rgba(255, 255, 255, 0) 20%, rgba(255, 255, 255, 0.06)) bottom;":void 0}

  background-repeat: no-repeat;
  background-size:
    100% 32px,
    100% 16px;
  background-attachment: local, scroll;
`,g=t.I4.div`
  display: flex;
  flex-direction: column;
  gap: var(--screen-space-lg);
  margin-top: 1.5rem;
`,v=t.I4.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--screen-space);
`,x=t.I4.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`,f=t.I4.h3`
  && {
    font-size: 20px;
    line-height: 32px;
    font-weight: 500;
    color: var(--privy-color-foreground);
    margin: 0;
  }
`,y=t.I4.p`
  && {
    margin: 0;
    font-size: 16px;
    font-weight: 300;
    line-height: 24px;
    color: var(--privy-color-foreground);
  }
`,b=t.I4.div`
  background: ${({$variant:e})=>{switch(e){case"success":return"var(--privy-color-success-bg)";case"warning":return"var(--privy-color-warn)";case"error":return"var(--privy-color-error-bg)";case"loading":case"logo":return"transparent";default:return"var(--privy-color-background-2)"}}};

  border-radius: 50%;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
`,k=t.I4.div`
  display: flex;
  align-items: center;
  justify-content: center;

  img,
  svg {
    max-height: 90px;
    max-width: 180px;
  }
`,w=t.I4.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 82px;

  > div {
    position: relative;
  }

  > div > :first-child {
    position: relative;
  }

  > div > :last-child {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
`,j=({children:e,...r})=>(0,o.jsx)(c,{children:(0,o.jsx)(p,{...r,children:e})}),I=t.I4.div`
  position: absolute;
  top: 0;
  left: calc(-1 * var(--screen-space-lg));
  width: calc(100% + calc(var(--screen-space-lg) * 2));
  height: 4px;
  background: var(--privy-color-background-2);
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
  overflow: hidden;
`,C=(0,t.I4)(s.B)`
  padding: 0;
  && a {
    padding: 0;
    color: var(--privy-color-foreground-3);
  }
`,E=t.I4.div`
  height: 100%;
  width: ${({pct:e})=>e}%;
  background: var(--privy-color-foreground-3);
  border-radius: 2px;
  transition: width 300ms ease-in-out;
`,S=({step:e})=>e?(0,o.jsx)(I,{children:(0,o.jsx)(E,{pct:Math.min(100,e.current/e.total*100)})}):null;j.Header=({title:e,subtitle:r,icon:i,iconVariant:n,iconLoadingStatus:t,showBack:a,onBack:s,showInfo:l,onInfo:d,showClose:c,onClose:p,step:m,headerTitle:g,eyebrow:b,...k})=>(0,o.jsxs)(h,{...k,children:[(0,o.jsx)(u,{backFn:a?s:void 0,infoFn:l?d:void 0,onClose:c?p:void 0,title:g,eyebrow:b,closeable:c}),(i||n||e||r)&&(0,o.jsxs)(v,{children:[i||n?(0,o.jsx)(j.Icon,{icon:i,variant:n,loadingStatus:t}):null,!(!e&&!r)&&(0,o.jsxs)(x,{children:[e&&(0,o.jsx)(f,{children:e}),r&&(0,o.jsx)(y,{children:r})]})]}),m&&(0,o.jsx)(S,{step:m})]}),(j.Body=n.forwardRef(({children:e,...r},i)=>(0,o.jsx)(m,{ref:i,...r,children:e}))).displayName="Screen.Body",j.Footer=({children:e,...r})=>(0,o.jsx)(g,{id:"privy-content-footer-container",...r,children:e}),j.Actions=({children:e,...r})=>(0,o.jsx)(N,{...r,children:e}),j.HelpText=({children:e,...r})=>(0,o.jsx)(T,{...r,children:e}),j.FooterText=({children:e,...r})=>(0,o.jsx)(A,{...r,children:e}),j.Watermark=()=>(0,o.jsx)(C,{}),j.Icon=({icon:e,variant:r="subtle",loadingStatus:i})=>"logo"===r&&e?(0,o.jsx)(k,"string"==typeof e?{children:(0,o.jsx)("img",{src:e,alt:""})}:n.isValidElement(e)?{children:e}:{children:n.createElement(e)}):"loading"===r?e?(0,o.jsx)(w,{children:(0,o.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"center"},children:[(0,o.jsx)(a.C,{success:i?.success,fail:i?.fail}),"string"==typeof e?(0,o.jsx)("span",{style:{background:`url('${e}') 0 0 / contain`,height:"38px",width:"38px",borderRadius:"6px",margin:"auto",backgroundSize:"contain"}}):n.isValidElement(e)?n.cloneElement(e,{style:{width:"38px",height:"38px"}}):n.createElement(e,{style:{width:"38px",height:"38px"}})]})}):(0,o.jsx)(b,{$variant:r,children:(0,o.jsx)(d.N,{size:"64px"})}):(0,o.jsx)(b,{$variant:r,children:e&&("string"==typeof e?(0,o.jsx)("img",{src:e,alt:"",style:{width:"32px",height:"32px",borderRadius:"6px"}}):n.isValidElement(e)?e:n.createElement(e,{width:32,height:32,stroke:(()=>{switch(r){case"success":return"var(--privy-color-icon-success)";case"warning":return"var(--privy-color-icon-warning)";case"error":return"var(--privy-color-icon-error)";default:return"var(--privy-color-icon-muted)"}})(),strokeWidth:2}))});let N=t.I4.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: calc(var(--screen-space) / 2);
`,T=t.I4.div`
  && {
    margin: 0;
    width: 100%;
    text-align: center;
    color: var(--privy-color-foreground-2);
    font-size: 13px;
    line-height: 20px;

    & a {
      text-decoration: underline;
    }
  }
`,A=t.I4.div`
  && {
    margin-top: -1rem;
    width: 100%;
    text-align: center;
    color: var(--privy-color-foreground-2);
    font-size: 0.6875rem; /* 11px */
    line-height: 1rem; /* 16px */
  }
`},32401:(e,r,i)=>{i.d(r,{A:()=>o});let o=(0,i(6906).A)("triangle-alert",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]])},42614:(e,r,i)=>{i.d(r,{C:()=>a,S:()=>s,W:()=>t,b:()=>n});var o=i(51862);o.I4.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`,o.I4.button`
  padding: 0.25rem;
  height: 30px;
  width: 30px;

  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--privy-border-radius-full);
  background: var(--privy-color-background-2);
`;let n=o.I4.div`
  position: relative;
  display: inline-flex;
  align-items: center;

  &::after {
    content: ' ';
    border-radius: var(--privy-border-radius-full);
    height: 6px;
    width: 6px;
    background-color: var(--privy-color-icon-success);
    position: absolute;
    right: -3px;
    top: -3px;
  }
`,t=o.I4.img`
  width: 32px;
  height: 32px;
  border-radius: 0.25rem;
  object-fit: contain;
`,a=o.I4.span`
  display: flex;
  gap: 0.25rem;
  align-items: center;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.125rem; /* 150% */
  border-radius: var(--privy-border-radius-sm);
  background-color: var(--privy-color-background-2);

  svg {
    width: 100%;
    max-width: 1rem;
    max-height: 1rem;
    stroke-width: 2;
  }
`,s=o.I4.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 24rem;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    display: none;
  }

  scrollbar-gutter: stable both-edges;
  scrollbar-width: none;
  -ms-overflow-style: none;

  ${e=>"light"===e.$colorScheme?"background: linear-gradient(var(--privy-color-background), var(--privy-color-background) 70%) bottom, linear-gradient(rgba(0, 0, 0, 0) 20%, rgba(0, 0, 0, 0.06)) bottom;":"dark"===e.$colorScheme?"background: linear-gradient(var(--privy-color-background), var(--privy-color-background) 70%) bottom, linear-gradient(rgba(255, 255, 255, 0) 20%, rgba(255, 255, 255, 0.06)) bottom;":void 0}

  background-repeat: no-repeat;
  background-size:
    100% 32px,
    100% 16px;
  background-attachment: local, scroll;
`},46700:(e,r,i)=>{i.d(r,{C:()=>a,L:()=>v,M:()=>h,N:()=>d,O:()=>g,S:()=>s,T:()=>l,a:()=>u,b:()=>c,c:()=>m,d:()=>C,e:()=>p,f:()=>x,g:()=>f,h:()=>y,i:()=>k,j:()=>b,k:()=>w,l:()=>j,m:()=>I});var o=i(51862),n=i(57445),t=i(9751);let a=(0,o.I4)(t.S)`
  #privy-content-footer-container {
    margin-top: 0;
  }
`,s=o.I4.p`
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.375rem;
  color: var(--privy-color-foreground-3);
  margin: 0.25rem 0 0;
`,l=o.I4.img`
  width: 2rem;
  height: 2rem;
  border-radius: var(--privy-border-radius-full);
  object-fit: cover;
  flex-shrink: 0;
`,d=o.I4.img`
  width: 2rem;
  height: 2rem;
  border-radius: 4px;
  object-fit: cover;
  flex-shrink: 0;
`,c=o.I4.span`
  font-weight: 500;
`,p=o.I4.span`
  font-size: 0.875rem;
  color: var(--privy-color-foreground-3);
  margin-left: auto;
`,h=o.I4.span`
  width: 2rem;
  height: 2rem;
  border-radius: var(--privy-border-radius-full);
  background-color: var(--privy-color-background-2);
  color: var(--privy-color-icon-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;

  svg {
    width: 1.125rem;
    height: 1.125rem;
  }
`,u=o.I4.span`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`,m=o.I4.span`
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: var(--privy-color-foreground-3);
`;o.I4.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  min-height: 2.25rem;
  border-radius: 6.25rem;
  border: none;
  background-color: var(--privy-color-background-2);

  input {
    flex: 1;
    border: none;
    outline: none;
    box-shadow: none;
    font-size: 0.875rem;
    line-height: 1.25rem;
    background: transparent;
    color: var(--privy-color-foreground);

    &:focus {
      outline: none;
      box-shadow: none;
    }

    &::placeholder {
      color: var(--privy-color-foreground-3);
    }
  }
`;let g=o.I4.button`
  && {
    position: relative;
    width: 100%;
    display: flex;
    gap: 0.75rem;
    align-items: center;
    padding: 0.625rem 0.75rem;
    min-height: 3.5rem;
    border: 1px solid
      ${e=>e.$selected?"var(--privy-color-icon-interactive)":"var(--privy-color-foreground-4)"};
    border-radius: var(--privy-border-radius-md);
    background-color: ${e=>e.$selected?"var(--privy-color-info-bg)":"transparent"};
    color: var(--privy-color-foreground);
    font-size: 0.875rem;
    line-height: 1.5rem;
    cursor: pointer;
    outline: none;
    box-shadow: none;
    transition:
      background-color 200ms ease,
      border-color 200ms ease;

    &:hover {
      background-color: var(--privy-color-background-2);
    }

    &:disabled {
      opacity: ${e=>e.$selected?1:.5};
      cursor: not-allowed;
    }

    &:focus {
      outline: none;
      box-shadow: none;
    }

    &:focus-visible {
      box-shadow: var(--privy-shadow-focus-ring);
    }
  }
`,v=o.I4.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 3rem 0;
`,x=o.I4.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0.5rem 0;
`,f=o.I4.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`,y=o.I4.div`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: var(--privy-border-radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background-color: ${e=>"done"===e.$status?"var(--privy-color-success-light)":"var(--privy-color-background-2)"};
`,b=o.I4.div`
  width: 2px;
  height: 1rem;
  background-color: var(--privy-color-background-2);
  margin-left: 0.6875rem;
`,k=o.I4.span`
  font-size: 0.875rem;
  color: var(--privy-color-foreground);
`;o.I4.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: var(--privy-border-radius-md);
  background-color: var(--privy-color-background-2);
  font-size: 0.8125rem;
  line-height: 1.25rem;
  color: var(--privy-color-foreground-3);
`;let w=o.I4.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8125rem;
  line-height: 1.25rem;
`,j=o.I4.span`
  color: var(--privy-color-foreground);
  font-weight: 400;
`,I=o.I4.span`
  color: var(--privy-color-foreground);
  font-weight: 500;
  text-align: right;
  max-width: 60%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`,C=(0,o.I4)(n.L)`
  && {
    margin-left: auto;
    height: 1.5rem;
    width: 1.5rem;
    border-width: 2px;
    flex-shrink: 0;
  }
`},50505:(e,r,i)=>{i.d(r,{A:()=>o});let o=(0,i(6906).A)("qr-code",[["rect",{width:"5",height:"5",x:"3",y:"3",rx:"1",key:"1tu5fj"}],["rect",{width:"5",height:"5",x:"16",y:"3",rx:"1",key:"1v8r4q"}],["rect",{width:"5",height:"5",x:"3",y:"16",rx:"1",key:"1x03jg"}],["path",{d:"M21 16h-3a2 2 0 0 0-2 2v3",key:"177gqh"}],["path",{d:"M21 21v.01",key:"ents32"}],["path",{d:"M12 7v3a2 2 0 0 1-2 2H7",key:"8crl2c"}],["path",{d:"M3 12h.01",key:"nlz23k"}],["path",{d:"M12 3h.01",key:"n36tog"}],["path",{d:"M12 16v.01",key:"133mhm"}],["path",{d:"M16 12h1",key:"1slzba"}],["path",{d:"M21 12v.01",key:"1lwtk9"}],["path",{d:"M12 21v-1",key:"1880an"}]])},70568:(e,r,i)=>{i.d(r,{A:()=>o});let o=(0,i(6906).A)("chevron-down",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]])},74488:(e,r,i)=>{i.d(r,{A:()=>o});let o=(0,i(6906).A)("hourglass",[["path",{d:"M5 22h14",key:"ehvnwv"}],["path",{d:"M5 2h14",key:"pdyrp9"}],["path",{d:"M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22",key:"1d314k"}],["path",{d:"M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2",key:"1vvvr6"}]])},83026:(e,r,i)=>{i.d(r,{A:()=>o});let o=(0,i(6906).A)("check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]])},91322:(e,r,i)=>{i.d(r,{C:()=>h,a:()=>u});var o=i(95155),n=i(83026),t=i(25139),a=i(12115),s=i(51862);let l=s.I4.button`
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 0.5rem;

  && {
    color: var(--privy-color-foreground);
    font-weight: 500;
  }

  svg {
    width: 0.875rem;
    height: 0.875rem;
  }
`,d=s.I4.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: var(--privy-color-foreground-2);
`,c=(0,s.I4)(n.A)`
  color: var(--privy-color-icon-success);
  flex-shrink: 0;
`,p=(0,s.I4)(t.A)`
  color: var(--privy-color-icon-muted);
  flex-shrink: 0;
`;function h({children:e,iconOnly:r,value:i,hideCopyIcon:n,onCopy:t,iconSize:s=14,...u}){let[m,g]=(0,a.useState)(!1);return(0,o.jsxs)(l,{...u,onClick:()=>{navigator.clipboard.writeText(i||("string"==typeof e?e:"")).then(()=>t?.()).catch(console.error),g(!0),setTimeout(()=>g(!1),1500)},children:[e," ",m?(0,o.jsxs)(d,{children:[(0,o.jsx)(c,{size:s})," ",!r&&"Copied"]}):!n&&(0,o.jsx)(p,{size:s})]})}let u=({value:e,includeChildren:r,children:i,...n})=>{let[t,s]=(0,a.useState)(!1),h=()=>{navigator.clipboard.writeText(e).catch(console.error),s(!0),setTimeout(()=>s(!1),1500)};return(0,o.jsxs)(o.Fragment,{children:[r?(0,o.jsx)(l,{...n,onClick:h,children:i}):(0,o.jsx)(o.Fragment,{children:i}),(0,o.jsx)(l,{...n,onClick:h,children:t?(0,o.jsx)(d,{children:(0,o.jsx)(c,{})}):(0,o.jsx)(p,{})})]})}},93355:(e,r,i)=>{i.d(r,{D:()=>_,a:()=>E,b:()=>N,c:()=>S,d:()=>et,e:()=>j,f:()=>C,t:()=>z,v:()=>T});var o=i(12115),n=i(95155),t=i(74488),a=i(83026),s=i(50505),l=i(6906);let d=(0,l.A)("chevron-up",[["path",{d:"m18 15-6-6-6 6",key:"153udz"}]]);var c=i(70568),p=i(32401);let h=(0,l.A)("info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]);var u=i(51862),m=i(46700),g=i(9751),v=i(10218),x=i(79756),f=i(76701),y=i(79538),b=i(9683),k=i(91322),w=i(4104);class j extends o.Component{static getDerivedStateFromError(){return{hasError:!0}}componentDidCatch(e,r){this.props.onError(e)}componentDidUpdate(e){e.resetKey!==this.props.resetKey&&this.state.hasError&&this.setState({hasError:!1})}render(){return this.state.hasError?null:this.props.children}constructor(...e){super(...e),this.state={hasError:!1}}}function I(e){return e>=1e3?new Intl.NumberFormat("en-US",{maximumFractionDigits:0}).format(Math.round(e)):e>=100?new Intl.NumberFormat("en-US",{maximumFractionDigits:1}).format(e):e>=1?new Intl.NumberFormat("en-US",{maximumFractionDigits:2}).format(e):new Intl.NumberFormat("en-US",{maximumFractionDigits:4}).format(e)}function C(e,r){let i=Number(e);if(!Number.isFinite(i)||0===i)return e;let o=null!=r?i/10**r:i;return o>=1e3?new Intl.NumberFormat("en-US",{maximumFractionDigits:2}).format(o):o>=1?new Intl.NumberFormat("en-US",{maximumFractionDigits:4}).format(o):o>=1e-4?new Intl.NumberFormat("en-US",{maximumFractionDigits:6}).format(o):new Intl.NumberFormat("en-US",{maximumSignificantDigits:4}).format(o)}function E({address:e,caip2:r,config:i}){for(let o of i.currencies){let i=o.chains.find(i=>i.caip2===r&&i.address.toLowerCase()===e.toLowerCase());if(i)return{symbol:o.symbol.toUpperCase(),decimals:i.decimals}}return{symbol:e,decimals:void 0}}function S(e,r){let i=r[e];return i?.displayName??i?.display_name??e}function N(e,r){return e.chains.filter(e=>!0===e.can_be_relay_deposit_source).map(e=>{let i=r.chains[e.caip2];return i?{caip2:e.caip2,displayName:i.displayName,iconUrl:i.iconUrl,vmType:i.vmType,currencyAddress:e.address,currencyDecimals:e.decimals}:null}).filter(e=>null!==e)}function T(e,r){if(!e.chains[r.destinationChain])return`Unsupported destination chain: "${r.destinationChain}". Check that the chain is in CAIP-2 format (e.g. "eip155:8453") and is supported for deposit addresses.`;let i=r.destinationCurrency.toLowerCase();return e.currencies.some(e=>e.chains.some(e=>e.caip2===r.destinationChain&&e.address.toLowerCase()===i))?null:`Unsupported destination currency "${r.destinationCurrency}" on chain "${r.destinationChain}". Check that this token address is supported on the specified chain.`}let A=new Set(["ROUTE_UNAVAILABLE","UNEXPECTED_STATE","TIMEOUT_WAITING_FOR_NEXT_ORDER","TIMEOUT_ORDER_COMPLETION","DEPOSIT_FAILED","DEPOSIT_REFUNDED","USER_EXITED","AMOUNT_TOO_LOW","INSUFFICIENT_LIQUIDITY","UNSUPPORTED_CHAIN","UNSUPPORTED_CURRENCY","UNSUPPORTED_ROUTE","NO_SWAP_ROUTES_FOUND","NO_INTERNAL_SWAP_ROUTES_FOUND","NO_QUOTES","SANCTIONED_WALLET_ADDRESS","REFUND_WALLET_CREATION_FAILED","DEPOSIT_ADDRESSES_NOT_ENABLED","NOT_AUTHENTICATED"]);function z(e){return A.has(e)?e:"UNKNOWN_ERROR"}let _=({trackingUrl:e,onViewBlockExplorer:r,onClose:i})=>{let o=e&&r?()=>{r(),window.open(e,"_blank","noopener,noreferrer")}:void 0;return(0,n.jsx)(g.S,{icon:t.A,iconVariant:"subtle",title:"Transfer in progress",subtitle:"Your deposit was received and the transfer is now processing.",showClose:!0,onClose:i,secondaryCta:o?{label:"View on block explorer ↗",onClick:o}:void 0,watermark:!1,children:(0,n.jsxs)(m.f,{children:[(0,n.jsxs)(m.g,{children:[(0,n.jsx)(m.h,{$status:"done",children:(0,n.jsx)(a.A,{size:14,color:"var(--privy-color-icon-success)",strokeWidth:2})}),(0,n.jsx)(m.i,{children:"Deposit received"})]}),(0,n.jsx)(m.j,{}),(0,n.jsxs)(m.g,{children:[(0,n.jsx)(m.h,{$status:"active",children:(0,n.jsx)(U,{})}),(0,n.jsx)(m.i,{children:"Bridging"})]}),(0,n.jsx)(m.j,{}),(0,n.jsxs)(m.g,{children:[(0,n.jsx)(m.h,{$status:"pending"}),(0,n.jsx)(m.i,{children:"Funds arrived"})]})]})})},U=u.I4.span`
  width: 0.75rem;
  height: 0.75rem;
  border: 2px solid var(--privy-color-foreground-3);
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;function $({address:e,onClick:r}){let[i,t]=(0,o.useState)(!1);return(0,n.jsx)(n.Fragment,{children:i?(0,n.jsx)(F,{onClick:()=>t(!1),style:{marginTop:"1.5rem"},children:(0,n.jsx)(x.Q,{url:e,size:312,hideLogo:!0})}):(0,n.jsxs)(D,{title:"Click to copy address",onClick:r,style:{marginTop:"1.5rem"},children:[(0,n.jsxs)(O,{children:[(0,n.jsx)(R,{children:"Deposit address"}),(0,n.jsx)(M,{children:e})]}),(0,n.jsx)(L,{children:(0,n.jsx)(B,{type:"button",onClick:e=>{e.stopPropagation(),t(!0)},children:(0,n.jsx)(s.A,{size:16,color:"var(--privy-color-icon-muted)"})})})]})})}let F=u.I4.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  overflow: hidden;
`,D=u.I4.div`
  display: flex;
  border-radius: var(--privy-border-radius-md);
  background: var(--privy-color-background-clicked);
  padding: 1rem;
  cursor: pointer;
  gap: 0.5rem;
`,O=u.I4.div`
  flex: 1;
  min-width: 0;
  text-align: left;
`,R=u.I4.div`
  font-size: 0.75rem;
  color: var(--privy-color-icon-muted);
  line-height: 1rem;
  margin-bottom: 0.25rem;
`,M=u.I4.div`
  word-break: break-all;
  font-size: 0.875rem;
  font-family: ui-monospace, monospace;
  font-weight: 500;
  line-height: 1.375rem;
  color: var(--privy-color-foreground);
`,L=u.I4.div`
  width: 1.5rem;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  padding-top: 0.25rem;
`,B=u.I4.button`
  && {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    border: none;
    background: transparent;
    cursor: pointer;
    outline: none;
    box-shadow: none;
    border-radius: var(--privy-border-radius-xs);

    &:hover {
      background: var(--privy-color-background);
    }

    &:focus,
    &:focus-visible {
      outline: none;
      box-shadow: none;
    }
  }
`,P=e=>/^0x/i.test(e)||e.length>16;function W({quote:e,selectedCurrency:r,selectedChain:i,destinationSymbol:t,destinationChainName:a,destinationAsset:s}){var l,h;let u,[g,v]=(0,o.useState)(!1),x=r.symbol.toUpperCase(),f=i.displayName,y=(0,o.useRef)(null);return(0,n.jsxs)(V,{children:[(0,n.jsxs)(q,{onClick:(0,o.useCallback)(()=>{let e=document.getElementById("privy-modal-content");e&&(y.current&&clearTimeout(y.current),e.style.transition="none",y.current=setTimeout(()=>{e.style.transition="",y.current=null},160)),v(e=>!e)},[]),children:[(0,n.jsxs)(H,{children:[r.logoURI&&(0,n.jsx)(m.T,{src:r.logoURI,alt:x,style:{width:"2rem",height:"2rem"}}),i.iconUrl&&(0,n.jsx)(Y,{src:i.iconUrl,alt:f})]}),(0,n.jsxs)(Q,{children:[(0,n.jsx)(X,{children:"You send"}),(0,n.jsxs)(K,{children:[x," on ",f]})]}),(0,n.jsx)(G,{children:(0,n.jsx)(g?d:c.A,{size:16})})]}),(0,n.jsx)(er,{$expanded:g,children:(0,n.jsx)(ei,{children:(0,n.jsxs)(Z,{children:[e.indicative_rate&&(0,n.jsxs)(m.k,{children:[(0,n.jsx)(m.l,{children:"Conversion rate"}),(0,n.jsxs)(m.m,{style:{display:"flex",alignItems:"center",gap:"0.25rem"},children:[(l=e.indicative_rate,h=t.toUpperCase(),Number.isFinite(u=Number(l))&&0!==u?u>=.01?`1 ${x} ≈ ${I(u)} ${h}`:`${I(1/u)} ${x} ≈ 1 ${h}`:`1 ${x} ≈ ${l} ${h}`),(0,n.jsx)(eo,{content:"Estimated rate based on current market conditions. Final execution price may vary depending on transfer size and routing."})]})]}),(0,n.jsxs)(m.k,{children:[(0,n.jsx)(m.l,{children:"Receive"}),(0,n.jsxs)(m.m,{children:[t&&!P(t)?t.toUpperCase():P(s)?(0,w.c)(s):s.toUpperCase(),a?` on ${a}`:""]})]}),null!=e.slippage_bps&&(0,n.jsxs)(m.k,{children:[(0,n.jsx)(m.l,{children:"Max slippage"}),(0,n.jsxs)(m.m,{children:[(e.slippage_bps/100).toFixed(1),"%"]})]}),e.refund_address&&(0,n.jsxs)(m.k,{children:[(0,n.jsx)(m.l,{children:"Refund address"}),(0,n.jsx)(m.m,{children:(0,n.jsx)(k.C,{value:e.refund_address,iconOnly:!0,iconSize:11,children:(0,w.c)(e.refund_address,4,4)})})]})]})})}),(0,n.jsxs)(J,{children:[(0,n.jsx)(p.A,{size:16,color:"var(--privy-color-icon-muted)",style:{flexShrink:0}}),(0,n.jsxs)(ee,{children:["Only send ",(0,n.jsx)("strong",{children:x})," on ",(0,n.jsx)("strong",{children:f}),". Other assets may be lost."]})]})]})}let V=u.I4.div`
  border-radius: var(--privy-border-radius-md);
  border: 1px solid var(--privy-color-foreground-4);
  overflow: hidden;
`,q=u.I4.button`
  && {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--privy-color-foreground);
    outline: none;
    box-shadow: none;

    &:focus,
    &:focus-visible {
      outline: none;
      box-shadow: none;
    }
  }
`,H=u.I4.span`
  position: relative;
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
`,Y=(0,u.I4)(m.N)`
  && {
    position: absolute;
    top: -0.125rem;
    right: -0.25rem;
    width: 0.75rem;
    height: 0.75rem;
    box-sizing: content-box;
    border: 1.5px solid var(--privy-color-background);
    background-color: var(--privy-color-background);
  }
`,Q=u.I4.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`,X=u.I4.span`
  font-size: 0.75rem;
  color: var(--privy-color-foreground-3);
  line-height: 1rem;
`,K=u.I4.span`
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.25rem;
`,G=u.I4.span`
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: var(--privy-border-radius-full);
  background-color: var(--privy-color-background-clicked);
  color: var(--privy-color-foreground-3);
`,Z=u.I4.div`
  display: flex;
  flex-direction: column;
  padding: 0 1rem 0.75rem;

  & > * {
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--privy-color-foreground-4);
  }

  & > *:last-child {
    border-bottom: none;
  }
`,J=u.I4.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0.75rem 0.75rem;
  padding: 0.625rem 0.75rem;
  border-radius: var(--privy-border-radius-sm);
  background: var(--privy-color-background-2);
`,ee=u.I4.span`
  font-size: 0.8125rem;
  line-height: 1.25rem;
  color: var(--privy-color-icon-muted);
  text-align: left;
`,er=u.I4.div`
  display: grid;
  grid-template-rows: ${({$expanded:e})=>e?"1fr":"0fr"};
  transition: grid-template-rows 150ms ease-out;
`,ei=u.I4.div`
  overflow: hidden;
`;function eo({content:e}){let[r,i]=(0,o.useState)(!1),{refs:t,floatingStyles:a,context:s}=(0,f.we)({open:r,onOpenChange:i,placement:"top",whileElementsMounted:y.ll,middleware:[(0,b.cY)(6),(0,b.UU)(),(0,b.BN)({padding:8})]}),l=(0,f.Mk)(s,{move:!1,handleClose:(0,f.iB)()}),d=(0,f.iQ)(s),{getReferenceProps:c,getFloatingProps:p}=(0,f.bv)([l,d,(0,f.kp)(s),(0,f.s9)(s),(0,f.It)(s,{role:"tooltip"})]),{isMounted:u,styles:m}=(0,f.DL)(s,{duration:150});return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)("button",{ref:t.setReference,type:"button","aria-label":"More information about conversion rate",style:{display:"inline-flex",alignItems:"center",justifyContent:"center",padding:0,border:"none",background:"none",color:"var(--privy-color-icon-muted)",cursor:"pointer"},...c(),children:(0,n.jsx)(h,{size:14})}),u&&(0,n.jsx)(f.XF,{root:document.getElementById("privy-modal-content")??void 0,children:(0,n.jsx)(en,{ref:t.setFloating,style:{...a,...m},...p(),children:e})})]})}let en=u.I4.div`
  max-width: 13rem;
  padding: 0.5rem 0.625rem;
  border-radius: var(--privy-border-radius-sm, 0.375rem);
  background: var(--privy-color-foreground);
  color: var(--privy-color-background);
  font-size: 0.6875rem;
  line-height: 1rem;
  font-weight: 400;
  text-align: left;
  z-index: 10;
`,et=({quote:e,selectedCurrency:r,selectedChain:i,destinationSymbol:t,destinationChainName:s,destinationAsset:l,onBack:d,onClose:c})=>{let[p,h]=(0,o.useState)(!1),u=r?.symbol?.toUpperCase()??"funds",m=i?.displayName??"",x=async()=>{p||(await navigator.clipboard.writeText(e.deposit_address),h(!0),setTimeout(()=>h(!1),2e3))};return(0,n.jsxs)(g.S,{title:`Send ${u}${m?` on ${m}`:""}`,subtitle:"Send funds to the address below. Conversion and routing handled by Relay.",showBack:!0,onBack:d,showClose:!0,onClose:c,watermark:!1,children:[(0,n.jsx)(W,{quote:e,selectedCurrency:r,selectedChain:i,destinationSymbol:t,destinationChainName:s,destinationAsset:l}),(0,n.jsx)($,{address:e.deposit_address,onClick:x}),(0,n.jsx)(v.P,{style:{marginTop:"1rem",marginBottom:"0.5rem",...p?{backgroundColor:"var(--privy-color-icon-success)",borderColor:"var(--privy-color-icon-success)"}:{}},onClick:x,children:p?(0,n.jsxs)(n.Fragment,{children:["Copied ",(0,n.jsx)(a.A,{size:16,style:{marginLeft:"0.25rem"}})]}):"Copy address"}),(0,n.jsx)(ea,{children:"Routing and bridging are handled by Relay. Privy does not control execution timing, liquidity, or transaction outcomes."})]})},ea=u.I4.p`
  && {
    margin: 0.5rem 0 0;
    font-size: 0.6875rem;
    line-height: 1.125rem;
    color: var(--privy-color-icon-muted);
    text-align: center;
  }
`},98590:(e,r,i)=>{i.d(r,{N:()=>t});var o=i(95155),n=i(51862);let t=({size:e,centerIcon:r})=>(0,o.jsx)(a,{$size:e,children:(0,o.jsxs)(s,{children:[(0,o.jsx)(d,{}),(0,o.jsx)(c,{}),r?(0,o.jsx)(l,{children:r}):null]})}),a=n.I4.div`
  --spinner-size: ${e=>e.$size?e.$size:"96px"};

  display: inline-flex;
  justify-content: center;
  align-items: center;

  @media all and (display-mode: standalone) {
    margin-bottom: 30px;
  }
`,s=n.I4.div`
  position: relative;
  height: var(--spinner-size);
  width: var(--spinner-size);

  opacity: 1;
  animation: fadein 200ms ease;
`,l=n.I4.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  svg,
  img {
    width: calc(var(--spinner-size) * 0.4);
    height: calc(var(--spinner-size) * 0.4);
    border-radius: var(--privy-border-radius-full);
  }
`,d=n.I4.div`
  position: absolute;
  inset: 0;
  width: var(--spinner-size);
  height: var(--spinner-size);

  && {
    border: 4px solid var(--privy-color-border-default);
    border-radius: 50%;
  }
`,c=n.I4.div`
  position: absolute;
  inset: 0;
  width: var(--spinner-size);
  height: var(--spinner-size);
  animation: spin 1200ms linear infinite;

  && {
    border: 4px solid;
    border-color: var(--privy-color-icon-subtle) transparent transparent transparent;
    border-radius: 50%;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`}}]);