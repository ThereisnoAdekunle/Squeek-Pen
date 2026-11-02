"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[3689],{1491:(e,t,n)=>{n.d(t,{f:()=>i,s:()=>o});var a=n(49071),r=n(44842);async function i({solanaClient:e,tx:t}){let n=(0,a.Ul)().decode(await (0,r.w)(t)),{value:o}=await e.rpc.getFeeForMessage(n).send();return o??0n}async function o({solanaClient:e,tx:t,replaceRecentBlockhash:n}){let{value:r}=await e.rpc.simulateTransaction((0,a.Ul)().decode(t),{commitment:"confirmed",encoding:"base64",sigVerify:!1,replaceRecentBlockhash:n}).send();if("BlockhashNotFound"===r.err&&n)throw Error("Simulation failed: Blockhash not found");return"BlockhashNotFound"===r.err?await o({solanaClient:e,tx:t,replaceRecentBlockhash:!0}):{logs:r.logs??[],error:r.err,hasError:!!r.err,hasFunds:r.logs?.every(e=>!/insufficient funds/gi.test(e)&&!/insufficient lamports/gi.test(e))??!0}}},8336:(e,t,n)=>{n.d(t,{B:()=>r,C:()=>s,F:()=>d,H:()=>o,R:()=>g,S:()=>u,a:()=>c,b:()=>f,c:()=>l,d:()=>p,e:()=>i});var a=n(51862);let r=a.I4.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  margin-top: auto;
  gap: 16px;
  flex-grow: 100;
`,i=a.I4.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  width: 100%;
`,o=a.I4.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`,s=(0,a.I4)(i)`
  padding: 20px 0;
`,l=(0,a.I4)(i)`
  gap: 16px;
`,d=a.I4.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`,c=a.I4.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;a.I4.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;let u=a.I4.div`
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
`,f=a.I4.div`
  height: 16px;
`,g=a.I4.div`
  height: 12px;
`;a.I4.div`
  position: relative;
`;let p=a.I4.div`
  height: ${e=>e.height??"12"}px;
`;a.I4.div`
  background-color: var(--privy-color-accent);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border-color: white;
  border-width: 2px !important;
`},29781:(e,t,n)=>{n.d(t,{C:()=>o,S:()=>i});var a=n(95155),r=n(51862);let i=({title:e,description:t,children:n,...r})=>(0,a.jsx)(s,{...r,children:(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)("h3",{children:e}),"string"==typeof t?(0,a.jsx)("p",{children:t}):t,n]})});(0,r.I4)(i)`
  margin-bottom: 24px;
`;let o=({title:e,description:t,icon:n,children:r,...i})=>(0,a.jsxs)(l,{...i,children:[n||null,(0,a.jsx)("h3",{children:e}),t&&"string"==typeof t?(0,a.jsx)("p",{children:t}):t,r]}),s=r.I4.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  text-align: left;
  gap: 8px;
  width: 100%;
  margin-bottom: 24px;

  && h3 {
    font-size: 17px;
    color: var(--privy-color-foreground);
  }

  /* Sugar assuming children are paragraphs. Otherwise, handling styling on your own */
  && p {
    color: var(--privy-color-foreground-2);
    font-size: 14px;
  }
`,l=(0,r.I4)(s)`
  align-items: center;
  text-align: center;
  gap: 16px;

  h3 {
    margin-bottom: 24px;
  }
`},30007:(e,t,n)=>{n.d(t,{A:()=>s,D:()=>c,J:()=>d,L:()=>a,R:()=>l,S:()=>r,T:()=>o,a:()=>i});let a=1e9,r="11111111111111111111111111111111",i="TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",o="TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",s="ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",l=["CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C","CPMDWBwJDtYax9qW7AyRuVC19Cc4L4Vcy4n2BHAbHkCW"],d=["JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4"],c={"solana:mainnet":{EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v:{symbol:"USDC",decimals:6,address:"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"},Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB:{symbol:"USDT",decimals:6,address:"Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"},So11111111111111111111111111111111111111112:{symbol:"SOL",decimals:9,address:"So11111111111111111111111111111111111111112"}},"solana:devnet":{"4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU":{symbol:"USDC",decimals:6,address:"4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"},EJwZgeZrdC8TXTQbQBoL6bfuAnFUUy1PVCMB4DYPzVaS:{symbol:"USDT",decimals:6,address:"EJwZgeZrdC8TXTQbQBoL6bfuAnFUUy1PVCMB4DYPzVaS"},So11111111111111111111111111111111111111112:{symbol:"SOL",decimals:9,address:"So11111111111111111111111111111111111111112"}},"solana:testnet":{}}},33187:(e,t,n)=>{n.d(t,{A:()=>r});var a=n(12115);let r=a.forwardRef(function({title:e,titleId:t,...n},r){return a.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:r,"aria-labelledby":t},n),e?a.createElement("title",{id:t},e):null,a.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"}))})},37403:(e,t,n)=>{n.d(t,{L:()=>i});var a=n(51862);let r=(0,a.i7)`
  from, to {
    background: var(--privy-color-foreground-4);
    color: var(--privy-color-foreground-4);
  }

  50% {
    background: var(--privy-color-foreground-accent);
    color: var(--privy-color-foreground-accent);
  }
`,i=(0,a.AH)`
  ${e=>e.$isLoading?(0,a.AH)`
          width: 35%;
          animation: ${r} 2s linear infinite;
          border-radius: var(--privy-border-radius-sm);
        `:""}
`},41982:(e,t,n)=>{n.d(t,{g:()=>r});var a=n(30007);function r(e,t){let n=parseFloat(e.toString())/a.L,r=i.format(t*n);return"$0.00"===r?"<$0.01":r}let i=new Intl.NumberFormat(void 0,{style:"currency",currency:"USD",maximumFractionDigits:2})},46531:(e,t,n)=>{n.d(t,{u:()=>i});var a=n(12115),r=n(69704);let i=({enabled:e=!0}={})=>{let{showFiatPrices:t,getUsdPriceForSol:n}=(0,r.u)(),[i,o]=(0,a.useState)(!0),[s,l]=(0,a.useState)(void 0),[d,c]=(0,a.useState)(void 0);return(0,a.useEffect)(()=>{(async()=>{if(t&&e)try{o(!0);let e=await n();e?c(e):l(Error("Unable to fetch SOL price"))}catch(e){l(e)}finally{o(!1)}else o(!1)})()},[]),{solPrice:d,isSolPriceLoading:i,solPriceError:s}}},50464:(e,t,n)=>{n.d(t,{u:()=>l});var a=n(12115),r=n(65078),i=n(17611),o=n(69704),s=n(46531);function l(e){let{tokenPrice:t,isTokenPriceLoading:n,tokenPriceError:l}=(e=>{let{showFiatPrices:t,getUsdTokenPrice:n,chains:s}=(0,o.u)(),[l,d]=(0,a.useState)(!0),[c,u]=(0,a.useState)(void 0),[f,g]=(0,a.useState)(void 0);return(0,a.useEffect)(()=>{e||=i.U;let a=(0,r.uc)(s).find(t=>t.id===Number(e));(async()=>{if(t){if(!a)return d(!1),void u(Error(`Unable to fetch token price on chain id ${e}`));try{d(!0);let e=await n(a);e?g(e):u(Error(`Unable to fetch token price on chain id ${a.id}`))}catch(e){u(e)}finally{d(!1)}}else d(!1)})()},[e]),{tokenPrice:f,isTokenPriceLoading:l,tokenPriceError:c}})("solana"===e?-1:e),{solPrice:d,isSolPriceLoading:c,solPriceError:u}=(0,s.u)({enabled:"solana"===e});return"solana"===e?{tokenPrice:d,isTokenPriceLoading:c,tokenPriceError:u}:{tokenPrice:t,isTokenPriceLoading:n,tokenPriceError:l}}},58132:(e,t,n)=>{n.d(t,{t:()=>o});var a=n(95155),r=n(71448),i=n(10218);function o({title:e}){let{currentScreen:t,navigateBack:n,navigate:s,data:l,setModalData:d}=(0,r.u)();return(0,a.jsx)(i.M,{title:e,backFn:"ManualTransferScreen"===t?n:t===l?.funding?.methodScreen?l.funding.comingFromSendTransactionScreen?()=>s("SendTransactionScreen"):void 0:l?.funding?.methodScreen?()=>{let e=l.funding;e.usingDefaultFundingMethod&&(e.usingDefaultFundingMethod=!1),d({funding:e,solanaFundingData:l?.solanaFundingData}),s(e.methodScreen)}:void 0})}},63530:(e,t,n)=>{n.d(t,{L:()=>i,V:()=>s,a:()=>o});var a=n(51862),r=n(37403);let i=a.I4.span`
  color: var(--privy-color-foreground-3);
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.375rem; /* 157.143% */
`,o=(0,a.I4)(i)`
  color: var(--privy-color-accent);
`,s=a.I4.span`
  color: var(--privy-color-foreground);
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.375rem; /* 157.143% */
  word-break: break-all;
  text-align: right;

  ${r.L}
`},64493:(e,t,n)=>{n.d(t,{I:()=>i});var a=n(95155),r=n(84122);let i=({icon:e,name:t})=>"string"==typeof e?(0,a.jsx)("img",{alt:`${t||"wallet"} logo`,src:e,style:{height:24,width:24,borderRadius:4}}):void 0===e?(0,a.jsx)(r.A,{style:{height:24,width:24}}):e?(0,a.jsx)(e,{style:{height:24,width:24}}):null},69066:(e,t,n)=>{n.d(t,{g:()=>a});function a(e){switch(e){case"solana:mainnet":return"Solana";case"solana:devnet":return"Devnet";case"solana:testnet":return"Testnet"}}},84122:(e,t,n)=>{n.d(t,{A:()=>r});var a=n(12115);let r=a.forwardRef(function({title:e,titleId:t,...n},r){return a.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:r,"aria-labelledby":t},n),e?a.createElement("title",{id:t},e):null,a.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3"}))})},84161:(e,t,n)=>{n.d(t,{R:()=>i,a:()=>r});var a=n(51862);let r=a.I4.span`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  width: 100%;
`,i=a.I4.span`
  display: flex;
  width: 100%;
  justify-content: space-between;
  gap: 0.5rem;
`},89367:(e,t,n)=>{n.d(t,{O:()=>a});let a="sdk_fiat_on_ramp_completed_with_status"},92339:(e,t,n)=>{n.d(t,{g:()=>r});var a=n(30007);function r(e){let[t]=Object.entries(a.D[e]).find(([e,t])=>"USDC"===t.symbol)??[];return t}},93689:(e,t,n)=>{n.r(t),n.d(t,{FundSolWalletWithExternalSolanaWallet:()=>K,default:()=>K});var a,r,i,o,s=n(95155),l=n(33187),d=n(12115),c=n(66522),u=n(10218),f=n(8336),g=n(92987),p=n(29781),m=n(58132),h=n(64493),v=n(98590),x=n(63530),y=n(84161);function w({rows:e}){return(0,s.jsx)(y.a,{children:e.filter(e=>!!e).map((e,t)=>null!=e.value||e.isLoading?(0,s.jsxs)(y.R,{children:[(0,s.jsx)(x.L,{children:e.label}),(0,s.jsx)(x.V,{$isLoading:e.isLoading,children:e.value})]},t):null)})}var S=n(17611),b=n(37857),A=n(69704),C=n(71448),k=n(44842),I=n(50464),j=n(89367),L=n(91442),P=n(28172),E=n(23846),F=n(37272),U=n(43451),T=((a=T||{})[a.Uninitialized=0]="Uninitialized",a[a.Initialized=1]="Initialized",a),N=((r=N||{})[r.Legacy=0]="Legacy",r[r.Current=1]="Current",r),z=((i=z||{})[i.Nonce=0]="Nonce",i),D=((o=D||{})[o.CreateAccount=0]="CreateAccount",o[o.Assign=1]="Assign",o[o.TransferSol=2]="TransferSol",o[o.CreateAccountWithSeed=3]="CreateAccountWithSeed",o[o.AdvanceNonceAccount=4]="AdvanceNonceAccount",o[o.WithdrawNonceAccount=5]="WithdrawNonceAccount",o[o.InitializeNonceAccount=6]="InitializeNonceAccount",o[o.AuthorizeNonceAccount=7]="AuthorizeNonceAccount",o[o.Allocate=8]="Allocate",o[o.AllocateWithSeed=9]="AllocateWithSeed",o[o.AssignWithSeed=10]="AssignWithSeed",o[o.TransferSolWithSeed=11]="TransferSolWithSeed",o[o.UpgradeNonceAccount=12]="UpgradeNonceAccount",o);function B(e){return!!e&&"object"==typeof e&&"address"in e&&(0,P.Pl)(e)}var W=n(50382),M=n(3744),$=n(17378),R=n(998),O=n(30007),H=n(92339),V=n(1491),Z=n(49071),_=n(69066),G=n(41982),J=n(85329);function Y(e){return BigInt(Math.floor(1e9*parseFloat(e)))}function q(e){return+Q.format(parseFloat(e.toString())/1e9)}let Q=Intl.NumberFormat(void 0,{maximumFractionDigits:8});async function X({tx:e,solanaClient:t,amount:n,asset:a,tokenPrice:r}){if(!e)return null;if("SOL"===a&&r){let a=Y(n),i=(0,G.g)(a,r),o=await (0,V.f)({solanaClient:t,tx:e});return{amountInUsd:i,feeInUsd:r?(0,G.g)(o,r):void 0,totalInUsd:(0,G.g)(a+o,r)}}if("USDC"===a&&r){let a,i="$"+n,o=await (0,V.f)({solanaClient:t,tx:e}),s=(a=parseFloat(o.toString())/O.L*r)<.01?0:a;return{amountInUsd:i,feeInUsd:(0,G.g)(o,r),totalInUsd:"$"+(parseFloat(n)+s).toFixed(2)}}if("SOL"===a){let a=Y(n),r=await (0,V.f)({solanaClient:t,tx:e});return{amountInSol:n+" SOL",feeInSol:q(r)+" SOL",totalInSol:q(a+r)+" SOL"}}return{amountInUsdc:n+" USDC",feeInSol:q(await (0,V.f)({solanaClient:t,tx:e}))+" SOL"}}let K={component:function(){let e=(0,S.a)(),{closePrivyModal:t,createAnalyticsEvent:n}=(0,A.u)(),{data:a,setModalData:r,navigate:i}=(0,C.u)(),{wallets:o}=(0,k.o)(),[x,y]=(0,d.useState)("preparing"),[T,N]=(0,d.useState)(),[z,D]=(0,d.useState)(),[q,Q]=(0,d.useState)();if(!a?.solanaFundingData)throw Error("Funding config is missing");if(!a.solanaFundingData.sourceWalletData)throw Error("Funding config is missing source wallet data");let{amount:K,asset:ee,chain:et,sourceWalletData:en,destinationAddress:ea,afterSuccessScreen:er}=a.solanaFundingData,ei=o.find(e=>e.address===en.address&&(0,J.t)(en.walletClientType)===(0,J.t)(e.standardWallet.name)),eo=(0,k.q)()(et),{tokenPrice:es,isTokenPriceLoading:el}=(0,I.u)("solana");return(0,d.useEffect)(()=>{if("preparing"!==x||el||!ei)return;let e="SOL"===ee?Y(K):BigInt(Math.floor(1e6*parseFloat(K)));D({amount:("SOL"===ee&&es?(0,G.g)(e,es):K)??K}),("SOL"===ee?async function({solanaClient:e,source:t,destination:n,amountInLamports:a}){let{value:r}=await e.rpc.getLatestBlockhash().send(),i={address:t},o=(0,W.F)((0,M.mN)({version:0}),e=>(0,P.pt)(i,e),e=>(0,M.S$)(r,e),e=>{var t;let r,o,s,l;return(0,M.az)((r=(void 0)??"11111111111111111111111111111111",o={source:{value:(t={amount:a,source:i,destination:n}).source??null,isWritable:!0},destination:{value:t.destination??null,isWritable:!0}},s={...t},Object.freeze({accounts:[(l=e=>{if(!e.value)return;let t=e.isWritable?L.Uv.WRITABLE:L.Uv.READONLY;return Object.freeze({address:function(e){if(!e)throw Error("Expected a Address.");return"object"==typeof e&&"address"in e?e.address:Array.isArray(e)?e[0]:e}(e.value),role:B(e.value)?(0,L.MR)(t):t,...B(e.value)?{signer:e.value}:{}})})(o.source),l(o.destination)],data:(0,E.FU)((0,F.a5)([["discriminator",(0,U.PL)()],["amount",(0,U.eC)()]]),e=>({...e,discriminator:2})).encode(s),programAddress:r})),e)},e=>(0,$.i5)(e));return new Uint8Array((0,$.l9)().encode(o))}({solanaClient:eo,source:ei.address,destination:ea,amountInLamports:e}):async function({solanaClient:e,source:t,destination:n,amountInBaseUnits:a}){let r=(0,H.g)(e.chain),{value:i}=await e.rpc.getLatestBlockhash().send(),o={address:t},[s]=await (0,R._mM)({mint:r,owner:t,tokenProgram:O.a}),[l]=await (0,R._mM)({mint:r,owner:n,tokenProgram:O.a}),[d,c]=await Promise.all([e.rpc.getAccountInfo(s,{commitment:"confirmed",encoding:"jsonParsed"}).send().catch(()=>null),e.rpc.getAccountInfo(l,{commitment:"confirmed",encoding:"jsonParsed"}).send().catch(()=>null)]);if(!d?.value)throw Error(`Source token account does not exist for address: ${t}`);let u=(0,R.PUP)({payer:o,ata:l,owner:n,mint:r}),f=(0,W.F)((0,M.mN)({version:0}),e=>(0,P.pt)(o,e),e=>(0,M.S$)(i,e),e=>c?.value?e:(0,M.az)(u,e),e=>(0,M.az)((0,R.Q7D)({source:s,destination:l,authority:o,amount:a}),e),e=>(0,$.i5)(e));return new Uint8Array((0,$.l9)().encode(f))}({solanaClient:eo,source:ei.address,destination:ea,amountInBaseUnits:e})).then(N).catch(e=>{y("error"),Q(e)})},[x,K,ee,et,ei,ea,el,es]),(0,d.useEffect)(()=>{"preparing"===x&&T&&X({tx:T,solanaClient:eo,amount:K,asset:ee,tokenPrice:es}).then(e=>{y("loaded"),D({amount:e?.amountInUsd??e?.amountInUsdc??e?.amountInSol??K,fee:e?.feeInUsd??e?.feeInSol,total:e?.totalInUsd??e?.totalInSol})}).catch(e=>{y("error"),Q(e)})},[T,K,ee,x,es]),(0,d.useEffect)(()=>{"error"===x&&q&&(r({errorModalData:{error:q,previousScreen:"FundSolWalletWithExternalSolanaWallet"},solanaFundingData:a.solanaFundingData}),i("ErrorScreen",!1))},[x,i]),(0,d.useEffect)(()=>{if("success"!==x)return;let e=setTimeout(er?()=>i(er):t,S.X);return()=>clearTimeout(e)},[x]),(0,s.jsxs)(s.Fragment,"success"===x?{children:[(0,s.jsx)(m.t,{}),(0,s.jsx)(f.b,{}),(0,s.jsxs)(f.c,{children:[(0,s.jsx)(l.A,{color:"var(--privy-color-success)",width:"64px",height:"64px"}),(0,s.jsx)(p.C,{title:"Success!",description:`You’ve successfully added ${K} ${ee} to your ${e.name} wallet. It may take a minute before the funds are available to use.`})]}),(0,s.jsx)(f.R,{}),(0,s.jsx)(g.B,{})]}:"preparing"===x||"loaded"===x||"sending"===x?{children:[(0,s.jsx)(m.t,{}),(0,s.jsx)(f.e,{style:{marginTop:"16px"},children:(0,s.jsx)(h.I,{icon:ei?.standardWallet.icon,name:ei?.standardWallet.name})}),(0,s.jsx)(p.C,{style:{marginTop:"8px",marginBottom:"12px"},title:"sending"===x&&ei?`Confirming with ${ei.standardWallet.name}`:"Confirm transaction"}),(0,s.jsx)(w,{rows:[{label:"Source",value:(0,c.vzB)(en.address)},{label:"Destination",value:(0,c.vzB)(ea)},{label:"Network",value:(0,_.g)(et)},{label:"Amount",value:z?.amount,isLoading:"preparing"===x},{label:"Estimated fee",value:z?.fee,isLoading:"preparing"===x},{label:"Total",value:z?.total,isLoading:"preparing"===x}]}),(0,s.jsx)(u.P,{style:{marginTop:"1rem"},loading:"preparing"===x||"sending"===x,onClick:function(){"loaded"===x&&T&&ei&&(y("sending"),(async function({transaction:e,chain:t,sourceWallet:n,solanaClient:a}){var r;let{hasFunds:i}=await (0,V.s)({solanaClient:a,tx:e});if(!i)throw new b.P(`Wallet ${(0,c.vzB)(n.address)} does not have enough funds.`,void 0,b.a.INSUFFICIENT_BALANCE);let o=(r=(await n.signAndSendTransaction({transaction:e,chain:t}).catch(e=>{throw new b.P("Transaction was rejected by the user",e,b.a.TRANSACTION_FAILURE)})).signature,(0,Z.BC)().decode(r));return await (0,k.x)({rpcSubscriptions:a.rpcSubscriptions,signature:o,timeout:2e4}),o})({solanaClient:eo,transaction:T,chain:et,sourceWallet:ei}).then(e=>{y("success"),n({eventName:j.O,payload:{provider:"external",status:"success",txHash:e,address:ei.address,value:K,chainType:"solana",clusterName:et,token:ee,destinationAddress:ea,destinationValue:K,destinationChainType:"solana",destinationClusterName:et,destinationToken:ee}})}).catch(e=>{y("error"),Q(e)}))},children:"Confirm"}),(0,s.jsx)(g.B,{})]}:{children:[(0,s.jsx)(m.t,{}),(0,s.jsx)(v.N,{}),(0,s.jsx)("div",{style:{marginTop:"1rem"}}),(0,s.jsx)(g.B,{})]})}}},98590:(e,t,n)=>{n.d(t,{N:()=>i});var a=n(95155),r=n(51862);let i=({size:e,centerIcon:t})=>(0,a.jsx)(o,{$size:e,children:(0,a.jsxs)(s,{children:[(0,a.jsx)(d,{}),(0,a.jsx)(c,{}),t?(0,a.jsx)(l,{children:t}):null]})}),o=r.I4.div`
  --spinner-size: ${e=>e.$size?e.$size:"96px"};

  display: inline-flex;
  justify-content: center;
  align-items: center;

  @media all and (display-mode: standalone) {
    margin-bottom: 30px;
  }
`,s=r.I4.div`
  position: relative;
  height: var(--spinner-size);
  width: var(--spinner-size);

  opacity: 1;
  animation: fadein 200ms ease;
`,l=r.I4.div`
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
`,d=r.I4.div`
  position: absolute;
  inset: 0;
  width: var(--spinner-size);
  height: var(--spinner-size);

  && {
    border: 4px solid var(--privy-color-border-default);
    border-radius: 50%;
  }
`,c=r.I4.div`
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