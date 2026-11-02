"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[3587],{6906:(e,r,i)=>{i.d(r,{A:()=>s});var t=i(12115);let a=e=>{let r=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,r,i)=>i?i.toUpperCase():r.toLowerCase());return r.charAt(0).toUpperCase()+r.slice(1)},n=(...e)=>e.filter((e,r,i)=>!!e&&""!==e.trim()&&i.indexOf(e)===r).join(" ").trim();var o={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let l=(0,t.forwardRef)(({color:e="currentColor",size:r=24,strokeWidth:i=2,absoluteStrokeWidth:a,className:l="",children:s,iconNode:c,...d},p)=>(0,t.createElement)("svg",{ref:p,...o,width:r,height:r,stroke:e,strokeWidth:a?24*Number(i)/Number(r):i,className:n("lucide",l),...!s&&!(e=>{for(let r in e)if(r.startsWith("aria-")||"role"===r||"title"===r)return!0})(d)&&{"aria-hidden":"true"},...d},[...c.map(([e,r])=>(0,t.createElement)(e,r)),...Array.isArray(s)?s:[s]])),s=(e,r)=>{let i=(0,t.forwardRef)(({className:i,...o},s)=>(0,t.createElement)(l,{ref:s,iconNode:r,className:n(`lucide-${a(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,i),...o}));return i.displayName=a(e),i}},9751:(e,r,i)=>{i.d(r,{S:()=>o});var t=i(95155),a=i(10218),n=i(26701);let o=({primaryCta:e,secondaryCta:r,helpText:i,footerText:o,watermark:l=!0,children:s,...c})=>{let d=e||r?(0,t.jsxs)(t.Fragment,{children:[e&&(()=>{let{label:r,...i}=e,n=i.variant||"primary";return(0,t.jsx)(a.B,{...i,variant:n,style:{width:"100%",...i.style},children:r})})(),r&&(()=>{let{label:e,...i}=r,n=i.variant||"secondary";return(0,t.jsx)(a.B,{...i,variant:n,style:{width:"100%",...i.style},children:e})})()]}):null;return(0,t.jsxs)(n.S,{id:c.id,className:c.className,children:[(0,t.jsx)(n.S.Header,{...c}),s?(0,t.jsx)(n.S.Body,{children:s}):null,i||d||l?(0,t.jsxs)(n.S.Footer,{children:[i?(0,t.jsx)(n.S.HelpText,{children:i}):null,d?(0,t.jsx)(n.S.Actions,{children:d}):null,l?(0,t.jsx)(n.S.Watermark,{}):null]}):null,o?(0,t.jsx)(n.S.FooterText,{children:o}):null]})}},13587:(e,r,i)=>{i.r(r),i.d(r,{FarcasterConnectStatusScreen:()=>F,FarcasterConnectStatusView:()=>T,default:()=>F});var t=i(95155),a=i(12115),n=i(67884),o=i(51862),l=i(57445),s=i(87674),c=i(79756),d=i(83026),p=i(25139),h=i(10218),u=i(16137),g=i(17611),v=i(37857),x=i(69704),f=i(71448),m=i(62165),y=i(9751),b=i(84310);let w=o.I4.div`
  width: 100%;
`,j=o.I4.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem;
  height: 56px;
  background: ${e=>e.$disabled?"var(--privy-color-background-2)":"var(--privy-color-background)"};
  border: 1px solid var(--privy-color-foreground-4);
  border-radius: var(--privy-border-radius-md);

  &:hover {
    border-color: ${e=>e.$disabled?"var(--privy-color-foreground-4)":"var(--privy-color-foreground-3)"};
  }
`,k=o.I4.div`
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
`,C=o.I4.span`
  display: block;
  font-size: 16px;
  line-height: 24px;
  color: ${e=>e.$disabled?"var(--privy-color-foreground-2)":"var(--privy-color-foreground)"};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  /* Single-line truncation: as a flex item this would otherwise be floored at its
     min-content width, so min-width: 0 lets it shrink and the ellipsis land at the
     container edge. */
  min-width: 0;

  @media (min-width: 441px) {
    font-size: 14px;
    line-height: 20px;
  }
`,I=(0,o.I4)(C)`
  color: var(--privy-color-foreground-3);
  font-style: italic;
`,S=(0,o.I4)(u.L)`
  margin-bottom: 0.5rem;
`,E=(0,o.I4)(h.S)`
  && {
    gap: 0.375rem;
    font-size: 14px;
    flex-shrink: 0;
  }
`,A=({value:e,title:r,placeholder:i,className:n,showCopyButton:o=!0,truncate:l,maxLength:s=40,disabled:c=!1})=>{let[h,u]=(0,a.useState)(!1),g=l&&e?((e,r,i)=>{if((e=e.startsWith("https://")?e.slice(8):e).length<=i)return e;if("middle"===r){let r=Math.ceil(i/2)-2,t=Math.floor(i/2)-1;return`${e.slice(0,r)}...${e.slice(-t)}`}return`${e.slice(0,i-3)}...`})(e,l,s):e;return(0,a.useEffect)(()=>{if(h){let e=setTimeout(()=>u(!1),3e3);return()=>clearTimeout(e)}},[h]),(0,t.jsxs)(w,{className:n,children:[r&&(0,t.jsx)(S,{children:r}),(0,t.jsxs)(j,{$disabled:c,children:[(0,t.jsx)(k,{children:e?(0,t.jsx)(C,{$disabled:c,title:e,children:g}):(0,t.jsx)(I,{$disabled:c,children:i||"No value"})}),o&&e&&(0,t.jsx)(E,{onClick:function(r){r.stopPropagation(),navigator.clipboard.writeText(e).then(()=>u(!0)).catch(console.error)},size:"sm",children:(0,t.jsxs)(t.Fragment,h?{children:["Copied",(0,t.jsx)(d.A,{size:14})]}:{children:["Copy",(0,t.jsx)(p.A,{size:14})]})})]})]})},T=({connectUri:e,loading:r,success:i,errorMessage:a,onBack:o,onClose:d,onOpenFarcaster:p})=>(0,t.jsx)(y.S,n.Fr||r?n.un?{title:a?a.message:"Sign in with Farcaster",subtitle:a?a.detail:"To sign in with Farcaster, please open the Farcaster app.",icon:b.F,iconVariant:"loading",iconLoadingStatus:{success:i,fail:!!a},primaryCta:e&&p?{label:"Open Farcaster app",onClick:p}:void 0,onBack:o,onClose:d,watermark:!0}:{title:a?a.message:"Signing in with Farcaster",subtitle:a?a.detail:"This should only take a moment",icon:b.F,iconVariant:"loading",iconLoadingStatus:{success:i,fail:!!a},onBack:o,onClose:d,watermark:!0,children:e&&n.Fr&&(0,t.jsx)(z,{children:(0,t.jsx)(s.O,{text:"Take me to Farcaster",url:e,color:"#8a63d2"})})}:{title:"Sign in with Farcaster",subtitle:"Scan with your phone's camera to continue.",onBack:o,onClose:d,watermark:!0,children:(0,t.jsxs)($,{children:[(0,t.jsx)(_,{children:e?(0,t.jsx)(c.Q,{url:e,size:275,squareLogoElement:b.F}):(0,t.jsx)(H,{children:(0,t.jsx)(l.L,{})})}),(0,t.jsxs)(N,{children:[(0,t.jsx)(V,{children:"Or copy this link and paste it into a phone browser to open the Farcaster app."}),e&&(0,t.jsx)(A,{value:e,truncate:"end",maxLength:30,showCopyButton:!0,disabled:!0})]})]})}),F={component:()=>{let{authenticated:e,logout:r,ready:i,user:n}=(0,g.u)(),{lastScreen:o,navigate:l,navigateBack:s,setModalData:c}=(0,f.u)(),d=(0,g.a)(),{getAuthFlow:p,loginWithFarcaster:h,closePrivyModal:u,createAnalyticsEvent:y}=(0,x.u)(),[b,w]=(0,a.useState)(void 0),[j,k]=(0,a.useState)(!1),[C,I]=(0,a.useState)(!1),S=(0,a.useRef)([]),E=p(),A=E?.meta.connectUri;return(0,a.useEffect)(()=>{let e=Date.now(),r=setInterval(async()=>{let i=await E.pollForReady.execute(),t=Date.now()-e;if(i){clearInterval(r),k(!0);try{await h(),I(!0)}catch(r){let e={retryable:!1,message:"Authentication failed"};if(r?.privyErrorCode===v.a.ALLOWLIST_REJECTED)return void l("AllowlistRejectionScreen");if(r?.privyErrorCode===v.a.USER_LIMIT_REACHED)return console.error(new v.j(r).toString()),void l("UserLimitReachedScreen");if(r?.privyErrorCode===v.a.USER_DOES_NOT_EXIST)return void l("AccountNotFoundScreen");if(r?.privyErrorCode===v.a.LINKED_TO_ANOTHER_USER)e.detail=r.message??"This account has already been linked to another user.";else{if(r?.privyErrorCode===v.a.ACCOUNT_TRANSFER_REQUIRED&&r.data?.data?.nonce)return c({accountTransfer:{nonce:r.data?.data?.nonce,account:r.data?.data?.subject,displayName:r.data?.data?.account?.displayName,linkMethod:"farcaster",embeddedWalletAddress:r.data?.data?.otherUser?.embeddedWalletAddress,farcasterEmbeddedAddress:r.data?.data?.otherUser?.farcasterEmbeddedAddress}}),void l("LinkConflictScreen");r?.privyErrorCode===v.a.INVALID_CREDENTIALS?(e.retryable=!0,e.detail="Something went wrong. Try again."):r?.privyErrorCode===v.a.TOO_MANY_REQUESTS&&(e.detail="Too many requests. Please wait before trying again.")}w(e)}}else t>12e4&&(clearInterval(r),w({retryable:!0,message:"Authentication failed",detail:"The request timed out. Try again."}))},2e3);return()=>{clearInterval(r),S.current.forEach(e=>clearTimeout(e))}},[]),(0,a.useEffect)(()=>{if(i&&e&&C&&n){if(d?.legal.requireUsersAcceptTerms&&!n.hasAcceptedTerms){let e=setTimeout(()=>{l("AffirmativeConsentScreen")},g.Q);return()=>clearTimeout(e)}C&&((0,m.s)(n,d.embeddedWallets)?S.current.push(setTimeout(()=>{c({createWallet:{onSuccess:()=>{},onFailure:e=>{console.error(e),y({eventName:"embedded_wallet_creation_failure_logout",payload:{error:e,screen:"FarcasterConnectStatusScreen"}}),r()},callAuthOnSuccessOnClose:!0}}),l("EmbeddedWalletOnAccountCreateScreen")},g.Q)):S.current.push(setTimeout(()=>u({shouldCallAuthOnSuccess:!0,isSuccess:!0}),g.Q)))}},[C,i,e,n]),(0,t.jsx)(T,{connectUri:A,loading:j,success:C,errorMessage:b,onBack:o?s:void 0,onClose:u,onOpenFarcaster:()=>{A&&(window.location.href=A)}})}},z=o.I4.div`
  margin-top: 24px;
`,$=o.I4.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`,_=o.I4.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 275px;
`,N=o.I4.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`,V=o.I4.div`
  font-size: 0.875rem;
  text-align: center;
  color: var(--privy-color-foreground-2);
`,H=o.I4.div`
  position: relative;
  width: 82px;
  height: 82px;
`},16137:(e,r,i)=>{i.d(r,{L:()=>a});var t=i(51862);let a=t.I4.span`
  color: var(--privy-color-foreground-3);
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.125rem; /* 150% */
`},25139:(e,r,i)=>{i.d(r,{A:()=>t});let t=(0,i(6906).A)("copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]])},26701:(e,r,i)=>{i.d(r,{S:()=>k});var t=i(95155),a=i(12115),n=i(51862),o=i(57445),l=i(92987),s=i(10218),c=i(98590);let d=n.I4.div`
  /* spacing tokens */
  --screen-space: 16px; /* base 1x = 16 */
  --screen-space-lg: calc(var(--screen-space) * 1.5); /* 24px */

  position: relative;
  overflow: hidden;
  margin: 0 calc(-1 * var(--screen-space)); /* extends over modal padding */
  height: 100%;
  border-radius: var(--privy-border-radius-lg);
`,p=n.I4.div`
  display: flex;
  flex-direction: column;
  gap: calc(var(--screen-space) * 1.5);
  width: 100%;
  background: var(--privy-color-background);
  padding: 0 var(--screen-space-lg) var(--screen-space);
  height: 100%;
  border-radius: var(--privy-border-radius-lg);
`,h=n.I4.div`
  position: relative;
  display: flex;
  flex-direction: column;
`,u=(0,n.I4)(s.M)`
  margin: 0 -8px;
`,g=n.I4.div`
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
`,v=n.I4.div`
  display: flex;
  flex-direction: column;
  gap: var(--screen-space-lg);
  margin-top: 1.5rem;
`,x=n.I4.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--screen-space);
`,f=n.I4.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`,m=n.I4.h3`
  && {
    font-size: 20px;
    line-height: 32px;
    font-weight: 500;
    color: var(--privy-color-foreground);
    margin: 0;
  }
`,y=n.I4.p`
  && {
    margin: 0;
    font-size: 16px;
    font-weight: 300;
    line-height: 24px;
    color: var(--privy-color-foreground);
  }
`,b=n.I4.div`
  background: ${({$variant:e})=>{switch(e){case"success":return"var(--privy-color-success-bg)";case"warning":return"var(--privy-color-warn)";case"error":return"var(--privy-color-error-bg)";case"loading":case"logo":return"transparent";default:return"var(--privy-color-background-2)"}}};

  border-radius: 50%;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
`,w=n.I4.div`
  display: flex;
  align-items: center;
  justify-content: center;

  img,
  svg {
    max-height: 90px;
    max-width: 180px;
  }
`,j=n.I4.div`
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
`,k=({children:e,...r})=>(0,t.jsx)(d,{children:(0,t.jsx)(p,{...r,children:e})}),C=n.I4.div`
  position: absolute;
  top: 0;
  left: calc(-1 * var(--screen-space-lg));
  width: calc(100% + calc(var(--screen-space-lg) * 2));
  height: 4px;
  background: var(--privy-color-background-2);
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
  overflow: hidden;
`,I=(0,n.I4)(l.B)`
  padding: 0;
  && a {
    padding: 0;
    color: var(--privy-color-foreground-3);
  }
`,S=n.I4.div`
  height: 100%;
  width: ${({pct:e})=>e}%;
  background: var(--privy-color-foreground-3);
  border-radius: 2px;
  transition: width 300ms ease-in-out;
`,E=({step:e})=>e?(0,t.jsx)(C,{children:(0,t.jsx)(S,{pct:Math.min(100,e.current/e.total*100)})}):null;k.Header=({title:e,subtitle:r,icon:i,iconVariant:a,iconLoadingStatus:n,showBack:o,onBack:l,showInfo:s,onInfo:c,showClose:d,onClose:p,step:g,headerTitle:v,eyebrow:b,...w})=>(0,t.jsxs)(h,{...w,children:[(0,t.jsx)(u,{backFn:o?l:void 0,infoFn:s?c:void 0,onClose:d?p:void 0,title:v,eyebrow:b,closeable:d}),(i||a||e||r)&&(0,t.jsxs)(x,{children:[i||a?(0,t.jsx)(k.Icon,{icon:i,variant:a,loadingStatus:n}):null,!(!e&&!r)&&(0,t.jsxs)(f,{children:[e&&(0,t.jsx)(m,{children:e}),r&&(0,t.jsx)(y,{children:r})]})]}),g&&(0,t.jsx)(E,{step:g})]}),(k.Body=a.forwardRef(({children:e,...r},i)=>(0,t.jsx)(g,{ref:i,...r,children:e}))).displayName="Screen.Body",k.Footer=({children:e,...r})=>(0,t.jsx)(v,{id:"privy-content-footer-container",...r,children:e}),k.Actions=({children:e,...r})=>(0,t.jsx)(A,{...r,children:e}),k.HelpText=({children:e,...r})=>(0,t.jsx)(T,{...r,children:e}),k.FooterText=({children:e,...r})=>(0,t.jsx)(F,{...r,children:e}),k.Watermark=()=>(0,t.jsx)(I,{}),k.Icon=({icon:e,variant:r="subtle",loadingStatus:i})=>"logo"===r&&e?(0,t.jsx)(w,"string"==typeof e?{children:(0,t.jsx)("img",{src:e,alt:""})}:a.isValidElement(e)?{children:e}:{children:a.createElement(e)}):"loading"===r?e?(0,t.jsx)(j,{children:(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"center"},children:[(0,t.jsx)(o.C,{success:i?.success,fail:i?.fail}),"string"==typeof e?(0,t.jsx)("span",{style:{background:`url('${e}') 0 0 / contain`,height:"38px",width:"38px",borderRadius:"6px",margin:"auto",backgroundSize:"contain"}}):a.isValidElement(e)?a.cloneElement(e,{style:{width:"38px",height:"38px"}}):a.createElement(e,{style:{width:"38px",height:"38px"}})]})}):(0,t.jsx)(b,{$variant:r,children:(0,t.jsx)(c.N,{size:"64px"})}):(0,t.jsx)(b,{$variant:r,children:e&&("string"==typeof e?(0,t.jsx)("img",{src:e,alt:"",style:{width:"32px",height:"32px",borderRadius:"6px"}}):a.isValidElement(e)?e:a.createElement(e,{width:32,height:32,stroke:(()=>{switch(r){case"success":return"var(--privy-color-icon-success)";case"warning":return"var(--privy-color-icon-warning)";case"error":return"var(--privy-color-icon-error)";default:return"var(--privy-color-icon-muted)"}})(),strokeWidth:2}))});let A=n.I4.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: calc(var(--screen-space) / 2);
`,T=n.I4.div`
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
`,F=n.I4.div`
  && {
    margin-top: -1rem;
    width: 100%;
    text-align: center;
    color: var(--privy-color-foreground-2);
    font-size: 0.6875rem; /* 11px */
    line-height: 1rem; /* 16px */
  }
`},62165:(e,r,i)=>{i.d(r,{s:()=>a});var t=i(74842);let a=(e,r)=>(0,t.s)(e,r.ethereum.createOnLogin)||(0,t.g)(e,r.solana.createOnLogin)},83026:(e,r,i)=>{i.d(r,{A:()=>t});let t=(0,i(6906).A)("check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]])},84310:(e,r,i)=>{i.d(r,{F:()=>a});var t=i(95155);let a=e=>(0,t.jsxs)("svg",{width:"33",height:"32",viewBox:"0 0 33 32",fill:"none",xmlns:"http://www.w3.org/2000/svg",...e,children:[(0,t.jsx)("rect",{x:"0.5",width:"32",height:"32",rx:"4",fill:"#855DCD"}),(0,t.jsxs)("g",{"clip-path":"url(#clip0_1715_1960)",children:[(0,t.jsx)("path",{d:"M4.5 4H28.5V28H4.5V4Z",fill:"#855DCD"}),(0,t.jsx)("path",{d:"M11.1072 8.42105H21.6983V23.5789H20.1437V16.6357H20.1284C19.9566 14.7167 18.3542 13.2129 16.4028 13.2129C14.4514 13.2129 12.849 14.7167 12.6771 16.6357H12.6619V23.5789H11.1072V8.42105Z",fill:"white"}),(0,t.jsx)("path",{d:"M8.28943 10.5725L8.92101 12.7239H9.45542V21.4275C9.1871 21.4275 8.96959 21.6464 8.96959 21.9165V22.5032H8.87242C8.60411 22.5032 8.38659 22.7221 8.38659 22.9922V23.5789H13.8279V22.9922C13.8279 22.7221 13.6104 22.5032 13.3421 22.5032H13.2449V21.9165C13.2449 21.6464 13.0274 21.4275 12.7591 21.4275H12.1761V10.5725H8.28943Z",fill:"white"}),(0,t.jsx)("path",{d:"M20.2408 21.4275C19.9725 21.4275 19.755 21.6464 19.755 21.9165V22.5032H19.6579C19.3895 22.5032 19.172 22.7221 19.172 22.9922V23.5789H24.6133V22.9922C24.6133 22.7221 24.3958 22.5032 24.1275 22.5032H24.0303V21.9165C24.0303 21.6464 23.8128 21.4275 23.5445 21.4275V12.7239H24.0789L24.7105 10.5725H20.8238V21.4275H20.2408Z",fill:"white"})]}),(0,t.jsx)("defs",{children:(0,t.jsx)("clipPath",{id:"clip0_1715_1960",children:(0,t.jsx)("rect",{width:"24",height:"24",fill:"white",transform:"translate(4.5 4)"})})})]})},87674:(e,r,i)=>{i.d(r,{O:()=>o});var t=i(95155),a=i(12115),n=i(51862);let o=e=>{let[r,i]=(0,a.useState)(!1);return(0,t.jsx)(l,{color:e.color,href:e.url,target:"_blank",rel:"noreferrer noopener",onClick:()=>{i(!0),setTimeout(()=>i(!1),1500)},justOpened:r,children:e.text})},l=n.I4.a`
  display: flex;
  align-items: center;
  gap: 6px;

  && {
    margin: 8px 2px;
    font-size: 14px;
    color: ${e=>e.justOpened?"var(--privy-color-foreground)":e.color||"var(--privy-color-foreground-3)"};
    font-weight: ${e=>e.justOpened?500:"normal"};
    transition: color 350ms ease;

    :focus,
    :active {
      background-color: transparent;
      border: none;
      outline: none;
      box-shadow: none;
    }

    :hover {
      color: ${e=>e.justOpened?"var(--privy-color-foreground)":"var(--privy-color-foreground-2)"};
    }

    :active {
      color: var(--privy-color-foreground);
      font-weight: 500;
    }

    @media (max-width: 440px) {
      margin: 12px 2px;
    }
  }

  svg {
    width: 14px;
    height: 14px;
  }
`},98590:(e,r,i)=>{i.d(r,{N:()=>n});var t=i(95155),a=i(51862);let n=({size:e,centerIcon:r})=>(0,t.jsx)(o,{$size:e,children:(0,t.jsxs)(l,{children:[(0,t.jsx)(c,{}),(0,t.jsx)(d,{}),r?(0,t.jsx)(s,{children:r}):null]})}),o=a.I4.div`
  --spinner-size: ${e=>e.$size?e.$size:"96px"};

  display: inline-flex;
  justify-content: center;
  align-items: center;

  @media all and (display-mode: standalone) {
    margin-bottom: 30px;
  }
`,l=a.I4.div`
  position: relative;
  height: var(--spinner-size);
  width: var(--spinner-size);

  opacity: 1;
  animation: fadein 200ms ease;
`,s=a.I4.div`
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
`,c=a.I4.div`
  position: absolute;
  inset: 0;
  width: var(--spinner-size);
  height: var(--spinner-size);

  && {
    border: 4px solid var(--privy-color-border-default);
    border-radius: 50%;
  }
`,d=a.I4.div`
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