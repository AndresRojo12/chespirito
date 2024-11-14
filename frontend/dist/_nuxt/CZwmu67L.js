import{_ as I,u as L,r as a,m as p,o as u,c as f,a as t,b as s,w as _,C as x,d as N,D as S,z as B,n as E}from"./Bi-YAAcS.js";import{u as U}from"./CxN-Xvzn.js";import{S as g}from"./DOYwHpwi.js";import{L as O}from"./DKrGet5X.js";const P={class:"card"},j={class:"text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"},A={key:0},R={__name:"LoginUser",setup(w){const m=B(),r=L(),b=U(),i=a(""),l=a(""),n=a(!1),c=a(!1),y=async()=>{c.value=!0;try{const o=await fetch(`${m.public.API_BASE_URL}auth/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:i.value,password:l.value})}),e=await o.json();o.ok?(b.login(e.token),c.value=!1,r.push("/user/gestion")):g.fire({icon:"error",title:"Error",text:e.message})}catch(o){console.error("Error logging in",o),g.fire({icon:"error",title:"Error",text:"Hubo un problema al iniciar sesión. Inténtalo de nuevo."})}},k=()=>{r.push("/user/change-password")},C=()=>{n.value=!n.value};return(o,e)=>{const v=p("v-text-field"),h=p("v-btn"),V=p("v-card");return u(),f("div",P,[e[6]||(e[6]=t("h1",{class:"title"},"Iniciar sesión",-1)),s(V,{class:"mx-auto pa-12 pb-8",elevation:"8","max-width":"350",rounded:"lg"},{default:_(()=>[e[5]||(e[5]=t("div",{class:"text-subtitle-1 text-medium-emphasis color-#009c8c"},[t("p",{class:"form-text"},"Correo electrónico")],-1)),s(v,{class:"input",modelValue:i.value,"onUpdate:modelValue":e[0]||(e[0]=d=>i.value=d),density:"compact",placeholder:"Dirección de correo","prepend-inner-icon":"mdi-email-outline",variant:"outlined",autocomplete:"email",name:"email",id:"email"},null,8,["modelValue"]),t("div",j,[e[3]||(e[3]=t("p",{class:"form-text"},"Contraseña",-1)),t("a",{class:"password-text text-caption text-decoration-none",href:"#",rel:"noopener noreferrer",target:"blank",onClick:x(k,["prevent"])},e[2]||(e[2]=[t("p",{class:"password-text"},"¿Olvidó su contraseña?",-1)]))]),s(v,{class:"input",modelValue:l.value,"onUpdate:modelValue":e[1]||(e[1]=d=>l.value=d),type:n.value?"text":"password","append-inner-icon":n.value?"mdi-eye-off":"mdi-eye",density:"compact",placeholder:"Ingrese su contraseña","prepend-inner-icon":"mdi-lock-outline",variant:"outlined","onClick:appendInner":C,autocomplete:"current-password",name:"password",id:"password"},null,8,["modelValue","type","append-inner-icon"]),s(h,{class:"button mb-8",size:"large",variant:"tonal",block:"",onClick:x(y,["prevent"])},{default:_(()=>e[4]||(e[4]=[N(" Iniciar ")])),_:1})]),_:1}),c.value?(u(),f("div",A,[s(O)])):S("",!0)])}}},T=I(R,[["__scopeId","data-v-33e0f7a1"]]),G={__name:"index",setup(w){return(m,r)=>(u(),E(T))}};export{G as default};
