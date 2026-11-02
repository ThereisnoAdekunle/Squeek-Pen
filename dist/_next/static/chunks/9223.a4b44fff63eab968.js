"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[9223],{895:(e,n,t)=>{t.d(n,{C:()=>m});var o=t(95155),r=t(12115),a=t(51862),l=t(66522),i=t(35450),s=t(17611),c=t(53597),d=t(10218),u=t(69685);let h=({value:e,onChange:n})=>(0,o.jsx)("select",{value:e,onChange:n,children:l.QN3.map(e=>(0,o.jsxs)("option",{value:e.code,children:[e.code," +",e.callCode]},e.code))}),m=(0,r.forwardRef)((e,n)=>{let t=(0,s.a)(),[a,m]=(0,r.useState)(!1),{accountType:f}=(0,c.h)(),[y,j]=(0,r.useState)(""),[g,w]=(0,r.useState)(e.defaultCountry??t?.intl.defaultCountry??"US"),v=(0,l.Q7L)(y,g),b=(0,l.ZWl)(g),C=(0,l.jZ4)(g),k=(0,i.K)(g),M=!v,[S,E]=(0,r.useState)(!1),F=k.length,R=n=>{let t=n.target.value;w(t),j(""),e.onChange&&e.onChange({rawPhoneNumber:y,qualifiedPhoneNumber:(0,l.n4R)(y,t),countryCode:t,isValid:(0,l.Q7L)(y,g)})},P=(n,t)=>{try{let o=n.replace(/\D/g,"")===y.replace(/\D/g,"")?n:b.input(n);j(o),e.onChange&&e.onChange({rawPhoneNumber:o,qualifiedPhoneNumber:(0,l.n4R)(n,t),countryCode:t,isValid:(0,l.Q7L)(n,t)})}catch(e){console.error("Error processing phone number:",e)}},T=()=>{E(!0);let n=(0,l.n4R)(y,g);e.onSubmit({rawPhoneNumber:y,qualifiedPhoneNumber:n,countryCode:g,isValid:(0,l.Q7L)(y,g)}).finally(()=>E(!1))};return(0,r.useEffect)(()=>{if(e.defaultValue){let n=(0,l.oj1)(e.defaultValue);b.reset(),R({target:{value:n.countryCode}}),P(n.phone,n.countryCode)}},[e.defaultValue]),(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(p,{children:(0,o.jsxs)(x,{$callingCodeLength:F,$stacked:e.stacked,children:[(0,o.jsx)(h,{value:g,onChange:R}),(0,o.jsx)("input",{ref:n,id:"phone-number-input",className:"login-method-button",type:"tel",placeholder:C,onFocus:()=>m(!0),onChange:e=>{P(e.target.value,g)},onKeyUp:e=>{"Enter"===e.key&&T()},value:y,autoComplete:"tel"}),"phone"!==f||a||e.hideRecent?e.stacked||e.noIncludeSubmitButton?(0,o.jsx)("span",{}):(0,o.jsx)(d.E,{isSubmitting:S,onClick:T,disabled:M,children:"Submit"}):(0,o.jsx)(u.C,{color:"gray",children:"Recent"})]})}),e.stacked&&!e.noIncludeSubmitButton?(0,o.jsx)(d.P,{loading:S,loadingText:null,onClick:T,disabled:M,children:"Submit"}):null]})}),p=a.I4.div`
  width: 100%;
`,x=a.I4.label`
  --country-code-dropdown-width: calc(54px + calc(12 * ${e=>e.$callingCodeLength}px));
  --phone-input-extra-padding-left: calc(12px + calc(3 * ${e=>e.$callingCodeLength}px));
  display: block;
  position: relative;
  width: 100%;

  /* Tablet and Up */
  @media (min-width: 441px) {
    --country-code-dropdown-width: calc(52px + calc(10 * ${e=>e.$callingCodeLength}px));
  }

  && > select {
    font-size: 16px;
    height: 24px;
    position: absolute;
    margin: 13px calc(var(--country-code-dropdown-width) / 4);
    line-height: 24px;
    width: var(--country-code-dropdown-width);
    background-color: var(--privy-color-background);
    background-size: auto;
    background-position-x: right;
    cursor: pointer;

    /* Tablet and Up */
    @media (min-width: 441px) {
      font-size: 14px;
      width: var(--country-code-dropdown-width);
    }

    :focus {
      outline: none;
      box-shadow: none;
    }
  }

  && > input {
    font-size: 16px;
    line-height: 24px;
    color: var(--privy-color-foreground);

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    padding: 12px 88px 12px
      calc(var(--country-code-dropdown-width) + var(--phone-input-extra-padding-left));
    padding-right: ${e=>e.$stacked?"16px":"88px"};
    flex-grow: 1;
    background: var(--privy-color-background);
    border: 1px solid var(--privy-color-foreground-4);
    border-radius: var(--privy-border-radius-md);
    width: 100%;

    :focus {
      outline: none;
      border-color: var(--privy-color-accent);
    }

    :autofill,
    :-webkit-autofill {
      background: var(--privy-color-background);
    }

    /* Tablet and Up */
    @media (min-width: 441px) {
      font-size: 14px;
      padding-right: 78px;
    }
  }

  && > :last-child {
    right: 16px;
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
  }

  && > button:last-child {
    right: 0;
    line-height: 24px;
    padding: 13px 17px;

    :focus {
      outline: none;
      border-color: var(--privy-color-accent);
    }
  }

  && > input::placeholder {
    color: var(--privy-color-foreground-3);
  }
`},9223:(e,n,t)=>{t.r(n),t.d(n,{MfaEnrollmentFlowScreen:()=>k,default:()=>k});var o=t(95155),r=t(26798),a=t(67112),l=t(12115);let i=l.forwardRef(function({title:e,titleId:n,...t},o){return l.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor","aria-hidden":"true","data-slot":"icon",ref:o,"aria-labelledby":n},t),e?l.createElement("title",{id:n},e):null,l.createElement("path",{fillRule:"evenodd",d:"M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z",clipRule:"evenodd"}))}),s=l.forwardRef(function({title:e,titleId:n,...t},o){return l.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor","aria-hidden":"true","data-slot":"icon",ref:o,"aria-labelledby":n},t),e?l.createElement("title",{id:n},e):null,l.createElement("path",{fillRule:"evenodd",d:"M4.5 3.75a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V6.75a3 3 0 0 0-3-3h-15Zm4.125 3a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Zm-3.873 8.703a4.126 4.126 0 0 1 7.746 0 .75.75 0 0 1-.351.92 7.47 7.47 0 0 1-3.522.877 7.47 7.47 0 0 1-3.522-.877.75.75 0 0 1-.351-.92ZM15 8.25a.75.75 0 0 0 0 1.5h3.75a.75.75 0 0 0 0-1.5H15ZM14.25 12a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H15a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h3.75a.75.75 0 0 0 0-1.5H15Z",clipRule:"evenodd"}))});var c=t(10218),d=t(57445),u=t(92987),h=t(17611),m=t(69704),p=t(71448),x=t(74842),f=t(56082),y=t(33187),j=t(10099),g=t(66522),w=t(895),v=t(3445),b=t(23645);let C=({appName:e,onComplete:n,onReset:t,onClose:r})=>{let[a,i]=(0,l.useState)(""),[s,d]=(0,l.useState)(!1),[m,f]=(0,l.useState)(null),[C,k]=(0,l.useState)("enroll"),{initEnrollmentWithSms:M,submitEnrollmentWithSms:S}=(0,x.h)(),{promptMfa:E}=(0,x.u)(),{data:F}=(0,p.u)(),R=(0,h.a)();function P(){F?.mfaEnrollmentFlow?.onSuccess(),n()}return m?(0,o.jsx)(b.ErrorScreenView,{allowlistConfig:R.allowlistConfig,error:m,onBack:()=>f(null),onRetry:()=>f(null)}):(0,o.jsxs)(o.Fragment,"enroll"===C?{children:[(0,o.jsx)(c.M,{backFn:t,onClose:r},"header"),(0,o.jsx)(v.I,{style:{marginBottom:"1.5rem"},children:(0,o.jsx)(j.A,{})}),(0,o.jsx)(v.T,{children:"Set up SMS verification"}),(0,o.jsxs)(v.S,{children:["We'll text a verification code to this mobile device whenever you use your ",e," ","wallet."]}),(0,o.jsxs)(v.C,{children:[(0,o.jsx)(w.C,{onSubmit:async function({qualifiedPhoneNumber:e}){try{await E(),await M({phoneNumber:e}),i(e),k("verify")}catch(e){if((0,x.i)(e))return;f(e)}},hideRecent:!0}),(0,o.jsxs)(v.c,{children:["By providing your mobile number, you agree to receive text messages from ",R?.name,". Some carrier charges may apply"]})]}),(0,o.jsx)(u.M,{})]}:s?{children:[(0,o.jsx)(c.M,{onClose:P},"header"),(0,o.jsx)(v.I,{style:{marginBottom:"1.5rem"},children:(0,o.jsx)(y.A,{})}),(0,o.jsx)(v.T,{children:"SMS verification added"}),(0,o.jsxs)(v.S,{children:["From now on, you'll enter the verification code sent to your mobile device whenever you use your ",e," wallet."]}),(0,o.jsx)(v.B,{children:(0,o.jsx)(c.P,{onClick:P,children:"Done"})}),(0,o.jsx)(u.M,{})]}:{children:[(0,o.jsx)(c.M,{backFn:function(){"verify"===C?k("enroll"):t()},onClose:r},"header"),(0,o.jsx)(v.I,{style:{marginBottom:"1.5rem"},children:(0,o.jsx)(j.A,{})}),(0,o.jsx)(v.T,{children:"Enter enrollment code"}),(0,o.jsxs)(v.C,{children:[(0,o.jsx)(v.N,{onChange:async function(e){try{if(!e)return;await S({phoneNumber:a,mfaCode:e}),d(!0)}catch(e){if((0,x.j)(e))throw Error("You have exceeded the maximum number of attempts. Please close this window and try again in 10 seconds.");if((0,x.d)(e))throw Error("The code you entered is not valid");if((0,x.f)(e))throw Error("You have exceeded the time limit for code entry. Please try again in 30 seconds.");throw(0,x.i)(e)?Error("Verification canceled"):Error("Unknown error")}}}),(0,o.jsxs)(v.S,{children:["To continue, enter the 6-digit code sent to ",(0,o.jsx)("strong",{children:(0,g.Ds_)(a)})]})]}),(0,o.jsx)(u.M,{})]})},k={component:()=>{let{user:e,enrollInMfa:n,ready:t}=(0,h.u)(),[y,j]=(0,l.useState)(null),{unenrollWithSms:g,unenrollWithTotp:w,unenrollWithPasskey:b,submitEnrollmentWithTotp:k,initEnrollmentWithPasskey:M,submitEnrollmentWithPasskey:S,initEnrollmentWithTotp:E}=(0,x.h)(),{data:F,onUserCloseViaDialogOrKeybindRef:R}=(0,p.u)(),P=(0,h.a)(),{closePrivyModal:T}=(0,m.u)(),{promptMfa:A}=(0,x.u)(),[B,N]=(0,l.useState)(!1),[I,L]=(0,l.useState)(null),[W,U]=(0,l.useState)(null),$=()=>{T({shouldCallAuthOnSuccess:!0}),n(!1),setTimeout(()=>{j(null),L(null)},500)},[Z,V]=(0,l.useState)(!1),[O,z]=(0,l.useState)();R.current=$;let D=e?.mfaMethods.includes("sms"),Q=!!e?.phone,_=e?.mfaMethods.includes("totp"),q=e?.mfaMethods.includes("passkey"),H=D||_||q,K=e?.linkedAccounts.filter(e=>"passkey"===e.type).map(e=>e.credentialId)??[];function Y(){j(null),L(null)}async function G(){try{return await A(),!0}catch(e){return z(e),!1}}async function J(e=K){V(!0);try{return!!await G()&&(await M(),await S({credentialIds:e},{removeForLogin:F?.mfaEnrollmentFlow?.shouldUnlinkOnUnenrollMfa}),F?.mfaEnrollmentFlow?.onSuccess(),$(),!0)}catch(e){return z(e),!1}finally{V(!1)}}if((0,l.useEffect)(()=>{H&&N(!0)},[H]),!t||!e||!P)return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(c.M,{onClose:$},"header"),(0,o.jsx)(v.A,{children:(0,o.jsx)(f.M,{})}),(0,o.jsx)(v.C,{children:(0,o.jsx)(d.L,{})}),(0,o.jsx)(u.M,{})]});if("sms"===y)return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(c.M,{backFn:Y,onClose:$},"header"),(0,o.jsx)(v.I,{style:{marginBottom:"1.5rem"},children:(0,o.jsx)(r.A,{})}),(0,o.jsx)(v.T,{children:"Remove SMS verification?"}),(0,o.jsxs)(v.S,{children:["MFA adds an extra layer of security to your ",P?.name," account. Make sure you have other methods to secure your account."]}),(0,o.jsx)(v.B,{children:(0,o.jsx)(c.P,{$warn:!0,onClick:async function(){if(j(null),await G())try{await g()}catch(e){j(null)}},children:"Remove"})}),(0,o.jsx)(u.M,{})]});if("totp"===y)return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(c.M,{backFn:Y,onClose:$},"header"),(0,o.jsx)(v.I,{style:{marginBottom:"1.5rem"},children:(0,o.jsx)(r.A,{})}),(0,o.jsx)(v.T,{children:"Remove authenticator app verification?"}),(0,o.jsxs)(v.S,{children:["MFA adds an extra layer of security to your ",P?.name," account. Make sure you have other methods to secure your account."]}),(0,o.jsx)(v.B,{children:(0,o.jsx)(c.P,{$warn:!0,onClick:async function(){if(j(null),await G())try{await w()}catch(e){j(null)}},children:"Remove"})}),(0,o.jsx)(u.M,{})]});if("passkey"===y){let e=F?.mfaEnrollmentFlow?.shouldUnlinkOnUnenrollMfa??!0;return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(c.M,{backFn:Y,onClose:$},"header"),(0,o.jsx)(v.I,{style:{marginBottom:"1.5rem"},children:(0,o.jsx)(r.A,{})}),(0,o.jsx)(v.T,{children:"Are you sure you want to remove this passkey?"}),(0,o.jsx)(v.S,{children:e?"Removing your passkey will remove as both a verification method and a login method.":"Removing your passkey will remove as a verification method."}),(0,o.jsx)(v.B,{children:(0,o.jsx)(c.P,{$warn:!0,onClick:async function(){if(j(null),await G())try{await b({removeForLogin:F?.mfaEnrollmentFlow?.shouldUnlinkOnUnenrollMfa})}catch(e){j(null)}},children:"Remove"})}),(0,o.jsx)(u.M,{})]})}if(0===F.mfaEnrollmentFlow.mfaMethods.length&&!H)return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(c.M,{onClose:$},"header"),(0,o.jsx)(v.I,{style:{marginBottom:"1.5rem"},children:(0,o.jsx)(a.A,{})}),(0,o.jsx)(v.T,{children:"Add more security"}),(0,o.jsxs)(v.S,{children:[P?.name," does not have any verification methods enabled."]}),(0,o.jsx)(v.B,{children:(0,o.jsx)(c.P,{onClick:$,children:"Close"})}),(0,o.jsx)(u.M,{})]});let X=!H&&!B;return X?(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(c.M,{onClose:$},"header"),(0,o.jsx)(v.I,{style:{marginBottom:"1.5rem"},children:(0,o.jsx)(a.A,{})}),(0,o.jsx)(v.T,{children:"Transaction Protection"}),(0,o.jsx)(v.S,{children:"Set up transaction protection to add an extra layer of security to your account"}),(0,o.jsxs)(v.L,{children:[(0,o.jsxs)(v.a,{children:[(0,o.jsx)(v.b,{children:(0,o.jsx)(i,{})}),"Enable 2-Step verification for your ",P?.name," wallet."]}),(0,o.jsxs)(v.a,{children:[(0,o.jsx)(v.b,{children:(0,o.jsx)(s,{})}),"You'll be prompted to authenticate to complete transactions."]})]}),(0,o.jsxs)(v.B,{children:[(0,o.jsx)(c.P,{onClick:()=>N(!0),children:"Continue"}),(0,o.jsx)(c.S,{onClick:$,children:"Not now"})]}),(0,o.jsx)(u.M,{})]}):"sms"===I?(0,o.jsx)(C,{appName:P?.name||"Privy",onComplete:$,onReset:Y,onClose:$}):"totp"===I&&W?(0,o.jsx)(f.E,{onClose:$,onReset:Y,submitEnrollmentWithTotp:({mfaCode:e})=>(async function(e){try{return z(void 0),await k({mfaCode:e}),F?.mfaEnrollmentFlow?.onSuccess(),$()}catch(e){z(e)}finally{j(null)}})(e),totpInfo:{...W,appName:P?.name||"Privy"}}):"passkey"===I?(0,o.jsx)(f.a,{onReset:Y,onClose:$,submitEnrollmentWithPasskey:J}):(0,o.jsx)(f.b,{showIntro:X,userMfaMethods:e.mfaMethods,appMfaMethods:P.mfa.methods,userHasAuthSms:Q,backFn:function(){N(!1)},handleSelectMethod:async function(e){if("totp"!==e||await G()){if("totp"===e)return L(e),U(null),void E().then(e=>{U(e)}).catch(()=>{U(null),Y()});if("passkey"===e&&1===K.length)return await J();L(e)}},isTotpLoading:"totp"===I&&!W,isPasskeyLoading:Z,error:O,onClose:$,setRemovingMfaMethod:j})}}},33187:(e,n,t)=>{t.d(n,{A:()=>r});var o=t(12115);let r=o.forwardRef(function({title:e,titleId:n,...t},r){return o.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:r,"aria-labelledby":n},t),e?o.createElement("title",{id:n},e):null,o.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"}))})}}]);