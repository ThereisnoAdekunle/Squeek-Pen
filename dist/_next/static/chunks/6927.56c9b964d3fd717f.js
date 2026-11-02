"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[6927],{330:(e,n,r)=>{r.d(n,{g:()=>a});var t=r(7564);function a(e,n="wei"){return t.Xq(e,n)}},6906:(e,n,r)=>{r.d(n,{A:()=>d});var t=r(12115);let a=e=>{let n=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,n,r)=>r?r.toUpperCase():n.toLowerCase());return n.charAt(0).toUpperCase()+n.slice(1)},i=(...e)=>e.filter((e,n,r)=>!!e&&""!==e.trim()&&r.indexOf(e)===n).join(" ").trim();var s={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let o=(0,t.forwardRef)(({color:e="currentColor",size:n=24,strokeWidth:r=2,absoluteStrokeWidth:a,className:o="",children:d,iconNode:l,...c},u)=>(0,t.createElement)("svg",{ref:u,...s,width:n,height:n,stroke:e,strokeWidth:a?24*Number(r)/Number(n):r,className:i("lucide",o),...!d&&!(e=>{for(let n in e)if(n.startsWith("aria-")||"role"===n||"title"===n)return!0})(c)&&{"aria-hidden":"true"},...c},[...l.map(([e,n])=>(0,t.createElement)(e,n)),...Array.isArray(d)?d:[d]])),d=(e,n)=>{let r=(0,t.forwardRef)(({className:r,...s},d)=>(0,t.createElement)(o,{ref:d,iconNode:n,className:i(`lucide-${a(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,r),...s}));return r.displayName=a(e),r}},25139:(e,n,r)=>{r.d(n,{A:()=>t});let t=(0,r(6906).A)("copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]])},37403:(e,n,r)=>{r.d(n,{L:()=>i});var t=r(51862);let a=(0,t.i7)`
  from, to {
    background: var(--privy-color-foreground-4);
    color: var(--privy-color-foreground-4);
  }

  50% {
    background: var(--privy-color-foreground-accent);
    color: var(--privy-color-foreground-accent);
  }
`,i=(0,t.AH)`
  ${e=>e.$isLoading?(0,t.AH)`
          width: 35%;
          animation: ${a} 2s linear infinite;
          border-radius: var(--privy-border-radius-sm);
        `:""}
`},67118:(e,n,r)=>{r.r(n),r.d(n,{AwaitingSolToEvmBridgingScreen:()=>I,default:()=>I});var t=r(95155),a=r(33187),i=r(12115),s=r(330),o=r(66522),d=r(8336),l=r(92987),c=r(29781),u=r(58132),p=r(98590),h=r(17611),g=r(37857),f=r(10482),v=r(69704),m=r(71448),w=r(89367),y=r(50218),b=r(29441),x=r(21391),C=r(4104),A=r(8147),S=r(85329);let I={component:function(){let e=(0,h.a)(),{closePrivyModal:n,createAnalyticsEvent:r,connectors:I}=(0,v.u)(),{navigate:T,setModalData:N,data:j}=(0,m.u)(),E=(0,h.a)(),k=(0,i.useRef)(!1),[F,U]=(0,i.useState)(!1),[$,P]=(0,i.useState)(!1),[z,R]=(0,i.useState)(null),[W,L]=(0,i.useState)(),[_,B]=(0,i.useState)();if(!j?.funding||"ethereum"!==j.funding.chainType)throw Error("Invalid funding data");let{amount:D,connectedWallet:M,chain:H,solanaChain:O,isUSDC:q}=j.funding,V=j.funding.address,X=j.funding.erc20Address,Z=j.funding.isUSDC?"USDC":H.nativeCurrency.symbol,Q=(0,i.useMemo)(()=>"solana"===M?.type?M.provider:function({connectors:e,connectedWalletAddress:n}){let r=e.find(e=>"solana"===e.chainType&&e.wallets.some(e=>e.address===n)),t=r?.wallet.accounts.find(e=>e.address===n);if(!r||!t)throw new g.P("Unable to find source wallet connector");return new o.WWh({wallet:r.wallet,account:t})}({connectors:I,connectedWalletAddress:M?.address||""}),[M,I]),Y=(0,i.useMemo)(()=>{let n=(0,b.g)(x.S);if(!n)throw new g.P("Unable to load solana plugin");let r=e.solanaRpcs["solana:mainnet"];if(!r)throw new g.P("Unable to load mainnet RPC");return n.getSolanaRpcClient({rpc:r.rpc,rpcSubscriptions:r.rpcSubscriptions,chain:"solana:mainnet",blockExplorerUrl:r.blockExplorerUrl??"https://explorer.solana.com"})},[]),G=(0,f.e)((0,S.t)(Q?.standardWallet.name||"unknown")),J=G?.name||"wallet";return(0,i.useEffect)(()=>{(async function(){if(!Q||!H||k.current)return;let e=(0,b.g)(x.S);if(!e)return void R(new g.P("Unable to solana plugin"));k.current=!0,H?.testnet&&console.warn("Solana testnets are not supported for bridging");let n=q?1e6*parseFloat(D):(0,s.g)(D),r=await (0,y.g)({isTestnet:!!H.testnet,input:(0,y.t)({appId:E.id,amount:n.toString(),user:Q.address,recipient:V,destinationChainId:H.id,originChainId:y.c,originCurrency:q?y.e:y.b,destinationCurrency:q?X:void 0})}).catch(console.error);if(!r)return void R(new g.P(`Unable to fetch quotes for bridging. Wallet ${(0,C.o)(Q.address)} does not have enough funds.`,void 0,g.a.INSUFFICIENT_BALANCE));let t=await e.createTransactionFromRelayQuote({quote:r,source:Q.address,solanaClient:Y});if(t)try{U(!0);let n=await e.simulateTransaction({solanaClient:Y,tx:t});if(n.hasError)return n.hasFunds?(console.error("Transaction failed:",n.error),void R(new g.P("Something went wrong",void 0,g.a.TRANSACTION_FAILURE))):void R(new g.P(`Wallet ${(0,C.o)(Q?.address)} does not have enough funds. ${r.details.currencyIn.amountFormatted} ${Z} are needed to complete the transaction.`,void 0,g.a.INSUFFICIENT_BALANCE));let{signature:a}=await Q.signAndSendTransaction({chain:"solana:mainnet",transaction:t}),i=e.getAddressFromBuffer(a);L(i),B("pending")}catch(e){if(console.error(e),/user rejected the request/gi.test(e.message||""))return void R(new g.P("Transaction was rejected by the user",void 0,g.a.TRANSACTION_FAILURE));R(new g.P("Something went wrong",void 0,g.a.TRANSACTION_FAILURE))}else R(new g.P(`Unable to select bridge option from quotes. Wallet ${(0,C.o)(Q.address)} does not have enough funds.`,void 0,g.a.INSUFFICIENT_BALANCE))})().catch(console.error)},[]),(0,y.u)({transactionHash:W,isTestnet:!1,bridgingStatus:_,setBridgingStatus:B,onSuccess({transactionHash:e}){U(!1),P(!0),r({eventName:w.O,payload:{provider:"external",status:"success",txHash:e,address:Q.address,chainType:"solana",clusterName:O,token:"SOL",destinationAddress:V,destinationChainId:H.id,destinationChainType:"ethereum",destinationValue:D,destinationToken:q?"USDC":"ETH"}})},onFailure({error:e}){U(!1),R(e)}}),(0,i.useEffect)(()=>{if(!$)return;let e=setTimeout(n,h.X);return()=>clearTimeout(e)},[$]),(0,i.useEffect)(()=>{z&&(N({funding:j?.funding,solanaFundingData:j?.solanaFundingData,sendTransaction:j?.sendTransaction,errorModalData:{error:z,previousScreen:"TransferFromWalletScreen"}}),T("ErrorScreen",!1))},[z]),$?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(u.t,{}),(0,t.jsx)(d.b,{}),(0,t.jsxs)(d.c,{children:[(0,t.jsx)(a.A,{color:"var(--privy-color-success)",width:"64px",height:"64px"}),(0,t.jsx)(c.C,{title:"Success!",description:`You’ve successfully added ${D} ${Z} to your ${E.name} wallet. It may take a minute before the funds are available to use.`})]}),(0,t.jsx)(d.R,{}),(0,t.jsx)(l.B,{})]}):F&&Q?(0,t.jsx)(A.T,{walletClientType:(0,S.t)(Q?.standardWallet.name||"unknown"),displayName:J,addressToFund:V,isBridging:F,isErc20Flow:!1,chainId:H.id,chainName:H.name,totalPriceInUsd:void 0,totalPriceInNativeCurrency:void 0,gasPriceInUsd:void 0,gasPriceInNativeCurrency:void 0}):(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(u.t,{}),(0,t.jsx)(p.N,{}),(0,t.jsx)("div",{style:{marginTop:"1rem"}}),(0,t.jsx)(l.B,{})]})}}},83026:(e,n,r)=>{r.d(n,{A:()=>t});let t=(0,r(6906).A)("check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]])},98590:(e,n,r)=>{r.d(n,{N:()=>i});var t=r(95155),a=r(51862);let i=({size:e,centerIcon:n})=>(0,t.jsx)(s,{$size:e,children:(0,t.jsxs)(o,{children:[(0,t.jsx)(l,{}),(0,t.jsx)(c,{}),n?(0,t.jsx)(d,{children:n}):null]})}),s=a.I4.div`
  --spinner-size: ${e=>e.$size?e.$size:"96px"};

  display: inline-flex;
  justify-content: center;
  align-items: center;

  @media all and (display-mode: standalone) {
    margin-bottom: 30px;
  }
`,o=a.I4.div`
  position: relative;
  height: var(--spinner-size);
  width: var(--spinner-size);

  opacity: 1;
  animation: fadein 200ms ease;
`,d=a.I4.div`
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
`,l=a.I4.div`
  position: absolute;
  inset: 0;
  width: var(--spinner-size);
  height: var(--spinner-size);

  && {
    border: 4px solid var(--privy-color-border-default);
    border-radius: 50%;
  }
`,c=a.I4.div`
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