"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[4977],{1057:(e,r,n)=>{n.d(r,{W:()=>b});var t=n(95155),a=n(83026),i=n(25139),o=n(12115),s=n(51862),d=n(10218),l=n(98910),c=n(16137),u=n(71452),p=n(68753);let f=(0,s.I4)(p.B)`
  && {
    padding: 0.75rem;
    height: 56px;
  }
`,g=s.I4.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`,h=s.I4.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`,m=s.I4.div`
  font-size: 12px;
  line-height: 1rem;
  color: var(--privy-color-foreground-3);
`,v=(0,s.I4)(c.L)`
  text-align: left;
  margin-bottom: 0.5rem;
`,x=(0,s.I4)(l.E)`
  margin-top: 0.25rem;
`,y=(0,s.I4)(d.S)`
  && {
    gap: 0.375rem;
    font-size: 14px;
  }
`,b=({errMsg:e,balance:r,address:n,className:s,title:d,showCopyButton:l=!1})=>{let[c,p]=(0,o.useState)(!1);return(0,o.useEffect)(()=>{if(c){let e=setTimeout(()=>p(!1),3e3);return()=>clearTimeout(e)}},[c]),(0,t.jsxs)("div",{children:[d&&(0,t.jsx)(v,{children:d}),(0,t.jsx)(f,{className:s,$state:e?"error":void 0,children:(0,t.jsxs)(g,{children:[(0,t.jsxs)(h,{children:[(0,t.jsx)(u.A,{address:n,showCopyIcon:!1}),void 0!==r&&(0,t.jsx)(m,{children:r})]}),l&&(0,t.jsx)(y,{onClick:function(e){e.stopPropagation(),navigator.clipboard.writeText(n).then(()=>p(!0)).catch(console.error)},size:"sm",children:(0,t.jsxs)(t.Fragment,c?{children:["Copied",(0,t.jsx)(a.A,{size:14})]}:{children:["Copy",(0,t.jsx)(i.A,{size:14})]})})]})}),e&&(0,t.jsx)(x,{children:e})]})}},6906:(e,r,n)=>{n.d(r,{A:()=>d});var t=n(12115);let a=e=>{let r=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,r,n)=>n?n.toUpperCase():r.toLowerCase());return r.charAt(0).toUpperCase()+r.slice(1)},i=(...e)=>e.filter((e,r,n)=>!!e&&""!==e.trim()&&n.indexOf(e)===r).join(" ").trim();var o={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let s=(0,t.forwardRef)(({color:e="currentColor",size:r=24,strokeWidth:n=2,absoluteStrokeWidth:a,className:s="",children:d,iconNode:l,...c},u)=>(0,t.createElement)("svg",{ref:u,...o,width:r,height:r,stroke:e,strokeWidth:a?24*Number(n)/Number(r):n,className:i("lucide",s),...!d&&!(e=>{for(let r in e)if(r.startsWith("aria-")||"role"===r||"title"===r)return!0})(c)&&{"aria-hidden":"true"},...c},[...l.map(([e,r])=>(0,t.createElement)(e,r)),...Array.isArray(d)?d:[d]])),d=(e,r)=>{let n=(0,t.forwardRef)(({className:n,...o},d)=>(0,t.createElement)(s,{ref:d,iconNode:r,className:i(`lucide-${a(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,n),...o}));return n.displayName=a(e),n}},8336:(e,r,n)=>{n.d(r,{B:()=>a,C:()=>s,F:()=>l,H:()=>o,R:()=>f,S:()=>u,a:()=>c,b:()=>p,c:()=>d,d:()=>g,e:()=>i});var t=n(51862);let a=t.I4.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  margin-top: auto;
  gap: 16px;
  flex-grow: 100;
`,i=t.I4.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  width: 100%;
`,o=t.I4.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`,s=(0,t.I4)(i)`
  padding: 20px 0;
`,d=(0,t.I4)(i)`
  gap: 16px;
`,l=t.I4.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`,c=t.I4.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;t.I4.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;let u=t.I4.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  text-align: left;
  gap: 8px;
  padding: 16px;
  margin-top: 16px;
  margin-bottom: 16px;
  width: 100%;
  background: var(--privy-color-background-2);
  border-radius: var(--privy-border-radius-md);
  && h4 {
    color: var(--privy-color-foreground-3);
    font-size: 14px;
    text-decoration: underline;
    font-weight: 500;
  }
  && p {
    color: var(--privy-color-foreground-3);
    font-size: 14px;
  }
`,p=t.I4.div`
  height: 16px;
`,f=t.I4.div`
  height: 12px;
`;t.I4.div`
  position: relative;
`;let g=t.I4.div`
  height: ${e=>e.height??"12"}px;
`;t.I4.div`
  background-color: var(--privy-color-accent);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border-color: white;
  border-width: 2px !important;
`},16137:(e,r,n)=>{n.d(r,{L:()=>a});var t=n(51862);let a=t.I4.span`
  color: var(--privy-color-foreground-3);
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.125rem; /* 150% */
`},18892:(e,r,n)=>{n.d(r,{u:()=>d});var t=n(12115),a=n(76713),i=n(65760),o=n(18201),s=n(69704);function d({rpcConfig:e,appId:r,address:n,chain:l}){let{chains:c}=(0,s.u)(),[u,p]=(0,t.useState)(0n),[f,g]=(0,t.useState)(!1),h=(0,t.useMemo)(()=>{let n=l||c[0];if(n)return(0,a.l)({chain:l,transport:(0,i.L)((0,o.a)(n,e,r))})},[l,e,r]),m=(0,t.useCallback)(async()=>{if(!n||!h)return;g(!0);let e=await h.getBalance({address:n}).catch(console.error);return e?(p(e),g(!1),e):void 0},[h,n,p]);return(0,t.useEffect)(()=>{m().catch(console.error)},[]),{balance:u,isLoading:f,reloadBalance:m}}},20223:(e,r,n)=>{n.d(r,{I:()=>s});var t=n(95155),a=n(12115);let i=a.forwardRef(function({title:e,titleId:r,...n},t){return a.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:t,"aria-labelledby":r},n),e?a.createElement("title",{id:r},e):null,a.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"}))});var o=n(51862);let s=({children:e,theme:r,className:n})=>(0,t.jsxs)(d,{$theme:r,className:n,children:[(0,t.jsx)(i,{width:"16px",height:"16px",color:"var(--privy-color-foreground-2)",strokeWidth:2,style:{flexShrink:0}}),(0,t.jsx)(l,{$theme:r,children:e})]}),d=o.I4.div`
  display: flex;
  gap: 0.5rem;
  background-color: var(--privy-color-info-bg);
  border: 1px solid var(--privy-color-border-info);
  align-items: flex-start;
  padding: 0.75rem;
  border-radius: 0.5rem;
  overflow: clip;
  width: 100%;
`,l=o.I4.div`
  color: ${e=>"dark"===e.$theme?"var(--privy-color-foreground-2)":"var(--privy-color-foreground)"};
  flex: 1;
  text-align: left;

  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.125rem;
  font-feature-settings:
    'calt' 0,
    'kern' 0;
`},22189:(e,r,n)=>{n.d(r,{a:()=>i,g:()=>a});var t=n(41982);function a(e,r=6,n=!1,t=!1){let i=(parseFloat(e.toString())/1e9).toFixed(r).replace(/0+$/,"").replace(/\.$/,""),o=t?"":" SOL";return n?`${i}${o}`:`${"0"===i?"<0.001":i}${o}`}function i({amount:e,fee:r,tokenPrice:n,isUsdc:o}){let s=BigInt(Math.floor(parseFloat(e)*10**(o?6:9))),d=o?s:s+r;return{fundingAmountInBaseUnit:s,fundingAmountInUsd:n?(0,t.g)(s,n):void 0,totalPriceInUsd:n?(0,t.g)(d,n):void 0,totalPriceInNativeCurrency:a(d),feePriceInNativeCurrency:a(r),feePriceInUsd:n?(0,t.g)(r,n):void 0}}},24977:(e,r,n)=>{n.r(r),n.d(r,{ManualTransferScreen:()=>F,default:()=>F});var t=n(95155),a=n(12115),i=n(19559),o=n(66522),s=n(10218),d=n(8336),l=n(92987),c=n(79756),u=n(58132),p=n(20223),f=n(61992),g=n(40135),h=n(1057),m=n(17611),v=n(10482),x=n(69704),y=n(71448),b=n(18892),C=n(88927),w=n(89367),S=n(74842),I=n(69066),j=n(92339),k=n(22189),A=n(45595),T=n(4104);let F={component:()=>{let{wallets:e}=(0,C.u)(),{connectors:r}=(0,x.u)(),n=r.filter(v.b).flatMap(e=>e.wallets),{data:F,setModalData:M,navigate:E,lastScreen:N}=(0,y.u)(),{rpcConfig:z,appId:B,createAnalyticsEvent:$,closePrivyModal:L}=(0,x.u)(),P=(0,m.a)(),[U,J]=(0,a.useState)(void 0),[Z,H]=(0,a.useState)(!1),O=F?.funding,{reloadBalance:W}=(0,b.u)({rpcConfig:z,appId:B,address:"ethereum"===O.chainType?O.address:void 0,chain:"ethereum"===O.chainType?O.chain:void 0}),R="solana"===O.chainType,V=R?O.isUSDC?"USDC":"SOL":O.erc20Address?O.erc20ContractInfo?.symbol:O.chain.nativeCurrency.symbol,G=R?n.find(({address:e})=>e===O.address):e.find(({address:e})=>(0,T.c)(e)===(0,T.c)(O.address));if(!O)return M({errorModalData:{error:Error("Couldn't find funding config"),previousScreen:N||"FundingMethodSelectionScreen"},funding:F?.funding,solanaFundingData:F?.solanaFundingData,sendTransaction:F?.sendTransaction}),E("ErrorScreen"),(0,t.jsx)(t.Fragment,{});(0,a.useEffect)(()=>{let e=R?async function(){if("solana"!==O.chainType)return;let e=P.solanaRpcs[O.chain];e?(O.isUSDC?async function({rpc:e,address:r,mintAddress:n}){let t=await e.getTokenAccountsByOwner(r,{mint:n},{encoding:"jsonParsed",commitment:"confirmed"}).send(),a=t.value[0]?.account;return a?BigInt(a.data.parsed.info.tokenAmount.amount):0n}({rpc:e.rpc,address:O.address,mintAddress:(0,j.g)(O.chain)}):(0,S.p)({rpc:e.rpc,address:O.address})).then(e=>{let r=BigInt(e);U&&r>U&&(H(!0),$({eventName:w.O,payload:{provider:"manual",status:"success",chainType:"solana",address:G?.address,value:O.isUSDC?(0,i.J)(r-U,6):(0,i.J)(r-U,9),token:O.isUSDC?"USDC":"SOL"}})),J(r)}):console.warn("Unable to load solana rpc, skipping balance")}:async function(){"ethereum"===O.chainType&&(async()=>{if(!O.erc20Address)return await W()??BigInt(0);{let{balance:e}=await (0,A.g)({chain:O.chain,address:O.address,erc20Address:O.erc20Address,rpcConfig:z,appId:B});return e}})().then(e=>{U&&e>U&&(H(!0),$({eventName:w.O,payload:{provider:"manual",status:"success",chainType:"ethereum",address:G?.address,chainId:O.chain.id,value:(0,i.J)(e-U,O.erc20ContractInfo?.decimals??18),token:O.erc20ContractInfo?.symbol??O.erc20Address??"ETH"}})),J(e)}).catch(()=>J(void 0))},r=setInterval(e,2e3);return e(),()=>clearInterval(r)},[U]);let _=(0,a.useMemo)(()=>null==U?"":O.isUSDC?(0,o.NJJ)({amount:U,decimals:6}):R?(0,k.g)(U,3,!0,!0):null!=O.erc20ContractInfo?.decimals?(0,o.NJJ)({amount:U,decimals:O.erc20ContractInfo.decimals}):(0,o.vjn)({wei:U}),[U,R,O]),q="ethereum"===O.chainType?O.chain.name:(0,I.g)(O.chain),Y=(0,a.useMemo)(()=>""===O.uiConfig?.receiveFundsTitle?null:(0,t.jsx)(g.T,{children:O.uiConfig?.receiveFundsTitle??`Receive ${O.amount} ${V??""}`.trim()}),[O.uiConfig?.receiveFundsTitle,O.amount,V]),Q=(0,a.useMemo)(()=>""===O.uiConfig?.receiveFundsSubtitle?null:(0,t.jsx)(f.S,{children:O.uiConfig?.receiveFundsSubtitle??`Scan this code or copy your wallet address to receive funds on ${q}.`}),[O.uiConfig?.receiveFundsSubtitle,q]),K="solana"===O.chainType&&O.isUSDC&&(0,j.g)(O.chain)?`?spl-token=${(0,j.g)(O.chain)}`:"";return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(u.t,{}),Y,Q,(0,t.jsxs)(d.F,{style:{gap:"1rem",margin:Y||Q?"1rem 0":"0"},children:[(0,t.jsx)(c.Q,{url:`${O.chainType}:${O.address}${K}`,size:200,squareLogoElement:D}),(0,t.jsxs)(p.I,{theme:P.appearance.palette.colorScheme,children:["Make sure to send funds on ",q,"."]}),(0,t.jsx)(h.W,{title:"Your wallet",errMsg:void 0,showCopyButton:!0,balance:`${_} ${V}`,address:O.address}),Z&&(0,t.jsx)(s.P,{onClick:()=>L({shouldCallAuthOnSuccess:!1,isSuccess:!0}),children:"Continue"})]}),(0,t.jsx)(l.B,{})]})}},D=({...e})=>(0,t.jsx)(S.B,{color:"black",...e})},25139:(e,r,n)=>{n.d(r,{A:()=>t});let t=(0,n(6906).A)("copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]])},30007:(e,r,n)=>{n.d(r,{A:()=>s,D:()=>c,J:()=>l,L:()=>t,R:()=>d,S:()=>a,T:()=>o,a:()=>i});let t=1e9,a="11111111111111111111111111111111",i="TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",o="TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",s="ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",d=["CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C","CPMDWBwJDtYax9qW7AyRuVC19Cc4L4Vcy4n2BHAbHkCW"],l=["JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4"],c={"solana:mainnet":{EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v:{symbol:"USDC",decimals:6,address:"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"},Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB:{symbol:"USDT",decimals:6,address:"Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"},So11111111111111111111111111111111111111112:{symbol:"SOL",decimals:9,address:"So11111111111111111111111111111111111111112"}},"solana:devnet":{"4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU":{symbol:"USDC",decimals:6,address:"4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"},EJwZgeZrdC8TXTQbQBoL6bfuAnFUUy1PVCMB4DYPzVaS:{symbol:"USDT",decimals:6,address:"EJwZgeZrdC8TXTQbQBoL6bfuAnFUUy1PVCMB4DYPzVaS"},So11111111111111111111111111111111111111112:{symbol:"SOL",decimals:9,address:"So11111111111111111111111111111111111111112"}},"solana:testnet":{}}},40135:(e,r,n)=>{n.d(r,{T:()=>a});var t=n(51862);let a=t.I4.span`
  color: var(--privy-color-foreground);
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.875rem; /* 166.667% */
  text-align: center;
`},41982:(e,r,n)=>{n.d(r,{g:()=>a});var t=n(30007);function a(e,r){let n=parseFloat(e.toString())/t.L,a=i.format(r*n);return"$0.00"===a?"<$0.01":a}let i=new Intl.NumberFormat(void 0,{style:"currency",currency:"USD",maximumFractionDigits:2})},45595:(e,r,n)=>{n.d(r,{g:()=>o});var t=n(76713),a=n(65760),i=n(18201);let o=async({chain:e,address:r,appId:n,rpcConfig:o,erc20Address:d})=>{let l=(0,t.l)({chain:e,transport:(0,a.L)((0,i.a)(e,o,n))});return{balance:await l.readContract({address:d,abi:s,functionName:"balanceOf",args:[r]}).catch(()=>0n),chain:e}},s=[{constant:!0,inputs:[{name:"_owner",type:"address"}],name:"balanceOf",outputs:[{name:"balance",type:"uint256"}],payable:!1,stateMutability:"view",type:"function"}]},58132:(e,r,n)=>{n.d(r,{t:()=>o});var t=n(95155),a=n(71448),i=n(10218);function o({title:e}){let{currentScreen:r,navigateBack:n,navigate:s,data:d,setModalData:l}=(0,a.u)();return(0,t.jsx)(i.M,{title:e,backFn:"ManualTransferScreen"===r?n:r===d?.funding?.methodScreen?d.funding.comingFromSendTransactionScreen?()=>s("SendTransactionScreen"):void 0:d?.funding?.methodScreen?()=>{let e=d.funding;e.usingDefaultFundingMethod&&(e.usingDefaultFundingMethod=!1),l({funding:e,solanaFundingData:d?.solanaFundingData}),s(e.methodScreen)}:void 0})}},61992:(e,r,n)=>{n.d(r,{S:()=>a});var t=n(51862);let a=t.I4.span`
  margin-top: 4px;
  color: var(--privy-color-foreground);
  text-align: center;

  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.375rem; /* 157.143% */

  && a {
    color: var(--privy-color-accent);
  }
`},68753:(e,r,n)=>{n.d(r,{B:()=>i,a:()=>a});var t=n(51862);let a=(0,t.AH)`
  && {
    border-width: 1px;
    padding: 0.5rem 1rem;
  }

  width: 100%;
  text-align: left;
  border: solid 1px var(--privy-color-foreground-4);
  border-radius: var(--privy-border-radius-md);
  display: flex;
  justify-content: space-between;
  align-items: center;

  ${e=>"error"===e.$state?"\n        border-color: var(--privy-color-error);\n        background: var(--privy-color-error-bg);\n      ":""}
`,i=t.I4.div`
  ${a}
`},69066:(e,r,n)=>{n.d(r,{g:()=>t});function t(e){switch(e){case"solana:mainnet":return"Solana";case"solana:devnet":return"Devnet";case"solana:testnet":return"Testnet"}}},71452:(e,r,n)=>{n.d(r,{A:()=>c});var t=n(95155),a=n(83026),i=n(25139),o=n(12115),s=n(51862),d=n(4104),l=n(10218);let c=({address:e,showCopyIcon:r,url:n,className:s})=>{let[c,g]=(0,o.useState)(!1);function h(r){r.stopPropagation(),navigator.clipboard.writeText(e).then(()=>g(!0)).catch(console.error)}return(0,o.useEffect)(()=>{if(c){let e=setTimeout(()=>g(!1),3e3);return()=>clearTimeout(e)}},[c]),(0,t.jsxs)(u,n?{children:[(0,t.jsx)(f,{title:e,className:s,href:`${n}/address/${e}`,target:"_blank",children:(0,d.c)(e)}),r&&(0,t.jsx)(l.S,{onClick:h,size:"sm",style:{gap:"0.375rem"},children:(0,t.jsxs)(t.Fragment,c?{children:["Copied",(0,t.jsx)(a.A,{size:16})]}:{children:["Copy",(0,t.jsx)(i.A,{size:16})]})})]}:{children:[(0,t.jsx)(p,{title:e,className:s,children:(0,d.c)(e)}),r&&(0,t.jsx)(l.S,{onClick:h,size:"sm",style:{gap:"0.375rem",fontSize:"14px"},children:(0,t.jsxs)(t.Fragment,c?{children:["Copied",(0,t.jsx)(a.A,{size:14})]}:{children:["Copy",(0,t.jsx)(i.A,{size:14})]})})]})},u=s.I4.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
`,p=s.I4.span`
  font-size: 14px;
  font-weight: 500;
  color: var(--privy-color-foreground);
`,f=s.I4.a`
  font-size: 14px;
  color: var(--privy-color-foreground);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`},83026:(e,r,n)=>{n.d(r,{A:()=>t});let t=(0,n(6906).A)("check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]])},89367:(e,r,n)=>{n.d(r,{O:()=>t});let t="sdk_fiat_on_ramp_completed_with_status"},92339:(e,r,n)=>{n.d(r,{g:()=>a});var t=n(30007);function a(e){let[r]=Object.entries(t.D[e]).find(([e,r])=>"USDC"===r.symbol)??[];return r}},98910:(e,r,n)=>{n.d(r,{E:()=>a});var t=n(51862);let a=t.I4.span`
  text-align: left;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.125rem; /* 150% */

  color: var(--privy-color-error);
`}}]);