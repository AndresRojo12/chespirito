import{_ as G,r as f,E as H,q as h,s as B,c as g,x as k,b as e,D as C,a as l,n as O,w as i,d as j,t as Y,F as J,u as K,p as Q,m as o,o as p,C as d,a6 as X,a7 as Z,z as ee}from"./Bi-YAAcS.js";import{u as te}from"./CxN-Xvzn.js";import{S as oe}from"./DOYwHpwi.js";import{L as ne}from"./DKrGet5X.js";const se={key:0},ae={key:1},re={class:"footer"},le={class:"footer-bottom"},ie={__name:"default",setup(ce){const S=ee(),c=te(),v=f(null),u=K(),b=Q(),{mdAndUp:y}=H(),a=f(!1),n=f(!0),m=h(()=>y.value),A=h(()=>n.value?55:155);B(()=>{c.loadUserFromStorage(),a.value=m.value&&c.isAuthenticated});const x=async()=>{try{const t=localStorage.getItem("token"),_=await(await fetch(`${S.public.API_BASE_URL}auth/me`,{headers:{Authorization:`Bearer ${t}`}})).json();v.value=_}catch(t){console.log(t)}};B(async()=>{await x()});const E=()=>{n.value=!1},I=()=>{n.value=!0},D=h(()=>["/user/gestion","/product/list","/sales/list","/inventory/list"].includes(b.path)),V=()=>{a.value=!a.value,n.value=!a.value},L=()=>{u.push("/user/gestion")},M=()=>{u.push("/product/list")},N=()=>{u.push("/sales/list")},P=()=>{u.push("/inventory/list")},R=()=>{oe.fire({title:"¿Seguro quieres cerrar sesión?",icon:"question",showCancelButton:!0,confirmButtonText:"Si,cerrar sesión",cancelButtonText:"Cancelar",confirmButtonColor:"#1179E1",cancelButtonColor:"#2B2B2C",background:"#f2f2f2",color:"#333333",iconColor:"#1179E1"}).then(t=>{t.isConfirmed&&U()})},U=()=>{c.logout(),u.push("/")};return(t,s)=>{const _=o("v-app-bar-nav-icon"),r=o("v-list-item"),w=o("v-list"),F=o("v-divider"),T=o("v-navigation-drawer"),$=o("v-container"),q=o("v-main"),z=o("v-app");return p(),g(J,null,[k(c).loading?(p(),g("div",se,[e(ne)])):C("",!0),k(c).isAuthenticated?(p(),g("div",ae,[l("div",null,[D.value?(p(),O(_,{key:0,class:"icon-navbar",onClick:V,app:""})):C("",!0),s[2]||(s[2]=l("h1",{class:"title"},"ANTIGÜEDADES CHESPIRITO",-1)),e(z,null,{default:i(()=>[e(T,{modelValue:a.value,"onUpdate:modelValue":s[0]||(s[0]=W=>a.value=W),app:"",fixed:"",width:A.value,rail:n.value,"expand-on-hover":m.value,temporary:!m.value,onMouseenter:E,onMouseleave:I},{default:i(()=>[e(w,null,{default:i(()=>[e(r,{class:"buttons",title:`${v.value?v.value.role:"Usuario"}`,"prepend-icon":"mdi-account-circle"},null,8,["title"])]),_:1}),e(F),e(w,{density:"compact",nav:""},{default:i(()=>[e(r,{class:"buttons",title:"Inicio","prepend-icon":"mdi-home-city",onClick:d(L,["prevent"])}),e(r,{class:"buttons",title:"Productos","prepend-icon":"mdi-cash",onClick:d(M,["prevent"])}),e(r,{class:"buttons",title:"Ventas","prepend-icon":"mdi-elevation-rise",onClick:d(N,["prevent"])}),e(r,{class:"buttons",title:"Inventarios","prepend-icon":"mdi-clipboard-text",onClick:d(P,["prevent"])}),e(r,{class:"buttons",title:"Salir","prepend-icon":"mdi-logout",onClick:d(R,["prevent"])})]),_:1})]),_:1},8,["modelValue","width","rail","expand-on-hover","temporary"]),e(q,{class:X({"main-expanded":n.value,"main-collapsed":!n.value}),app:""},{default:i(()=>[e($,{fluid:""},{default:i(()=>[Z(t.$slots,"default",{},void 0,!0)]),_:3})]),_:3},8,["class"])]),_:3}),l("footer",re,[l("div",null,[l("div",le,[j(Y(new Date().getFullYear())+" — ",1),s[1]||(s[1]=l("strong",null,"Antigüedades Chespirito",-1))])])])])])):C("",!0)],64)}}},me=G(ie,[["__scopeId","data-v-15549164"]]);export{me as default};
