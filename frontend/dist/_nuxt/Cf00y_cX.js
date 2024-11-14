import{_ as le}from"./Hw9dA_uD.js";import{r as i,m as l,o as m,c as C,b as t,w as a,d,F as S,z as j,_ as se,A as re,s as ie,v as R,g as I,a as u,C as ce,y as ue,n as q,D as de,t as F,G as T,x as ve}from"./PexJTClo.js";import{d as _e}from"./DORaxXDF.js";import{C as me}from"./BY7HrdnX.js";import{S as z}from"./DOYwHpwi.js";import{u as G}from"./Djd6y8D_.js";import{L as ge}from"./CIAY-Gyt.js";import"./C4iS2aBk.js";const pe={__name:"CategoryDelete",props:{category:Object},emits:["deleted"],setup($,{emit:w}){const k=j(),g=$,f=w,y=i({...g.category}),x=async()=>{try{await G(`${k.public.API_BASE_URL}categories/${g.category.id}`,{method:"DELETE"},"$o02dgv0U7J")!=null?(z.fire({title:"Eliminado",text:"Categoría eliminada correctamente",icon:"success",confirmButtonText:"Aceptar"}),f("deleted",y.value.id)):(z.fire({title:"Error",text:"No se pudo eliminar la categoría",icon:"error",confirmButtonText:"Aceptar"}),f("deleted",!1,null))}catch(v){console.log("Error",v)}};return(v,s)=>{const p=l("v-card-title"),E=l("v-card-text"),V=l("v-btn"),b=l("v-card-actions");return m(),C(S,null,[t(p,{class:"headline"},{default:a(()=>s[0]||(s[0]=[d("Eliminar categoría")])),_:1}),t(E,null,{default:a(()=>s[1]||(s[1]=[d("¿Estás seguro que quieres eliminar esta categoría?")])),_:1}),t(b,null,{default:a(()=>[t(V,{color:"green darken-1",text:"",onClick:x},{default:a(()=>s[2]||(s[2]=[d("Si, eliminar")])),_:1})]),_:1})],64)}}},fe={class:"header-container"},ye={key:0,style:{"text-align":"center"}},xe={key:1,class:"category-container"},Ce=["src"],we={class:"category-info"},be={class:"text-center"},ke={__name:"InterfazUser",setup($){const w=j(),k=re(),g=i(!1),f=i(""),y=i(!1),x=i(1),v=i(10),s=i(!1),p=i(!1),E=i(null),V=i(null),b=i([]),r=i({data:[],totalPages:1}),_=async()=>{g.value=!0;try{const{data:o}=await G(`${w.public.API_BASE_URL}categories?page=${x.value}&pageSize=${v.value}`,"$CbwfwtgAsP");if(o.value)b.value=o.value.data,r.value=o.value;else throw new Error("No se recibieron datos válidos")}catch(o){console.error("Error fetching categories:",o),r.value={data:[],totalPages:1}}finally{g.value=!1}},O=o=>o;ie(async()=>{await R(),await _()});const M=_e(async o=>{if(await _(),!o.trim()){r.value={data:b.value,totalPages:r.value.totalPages},y.value=b.value.length===0;return}try{const c=await(await fetch(`${w.public.API_BASE_URL}categories/search?query=${encodeURIComponent(o.trim())}`)).json();r.value={data:c,totalPages:1},y.value=c.length===0}catch(e){console.error("Error fetching filtered categories:",e),r.value={data:[],totalPages:1},y.value=!0}},500);I(f,o=>{M(o)}),I(x,async()=>{await _()}),I(v,async()=>{await _()});const J=o=>{o&&o.id?(E.value={...o},s.value=!0):console.error("La categoría no tiene una propiedad id válida.")},H=async o=>{if(o){const e=r.value.data.findIndex(c=>c.id===o.id);e!==-1&&(r.value.data[e]=o)}await _(),s.value=!1},K=async o=>{const e=r.value.data.findIndex(c=>c.id===o);e!==-1&&r.value.data.splice(e,1),await _(),p.value=!1},Q=async()=>{await R(),await k.push("/categories/register")},W=async o=>{V.value=o,p.value=!0};return(o,e)=>{const c=l("v-btn"),X=l("v-text-field"),Y=l("v-select"),Z=l("v-alert"),ee=le,D=l("v-icon"),A=l("v-tooltip"),te=l("v-pagination"),P=l("v-container"),ae=l("v-col"),oe=l("v-row"),B=l("v-card-text"),L=l("v-card-actions"),N=l("v-card"),h=l("v-dialog");return m(),C(S,null,[u("div",null,[u("div",fe,[t(c,{onClick:ce(Q,["prevent"]),class:"register-button"},{default:a(()=>e[7]||(e[7]=[d("Registrar categoría")])),_:1}),t(X,{class:"search-field",modelValue:f.value,"onUpdate:modelValue":e[0]||(e[0]=n=>f.value=n),density:"comfortable",placeholder:"Buscar categorías","prepend-inner-icon":"mdi-magnify",variant:"solo",clearable:"","hide-details":""},null,8,["modelValue"])]),t(Y,{modelValue:v.value,"onUpdate:modelValue":e[1]||(e[1]=n=>v.value=n),class:"page-select",items:[10,20,30,40,50],label:"Seleccionar categorías por página",onChange:_},null,8,["modelValue"]),!g.value&&y.value?(m(),C("div",ye,[t(Z,{color:"#009c8c",type:"warning"},{default:a(()=>e[8]||(e[8]=[d(" No se encontraron registros. ")])),_:1})])):(m(),C("div",xe,[(m(!0),C(S,null,ue(r.value.data||[],n=>(m(),C("div",{class:"category-item",key:n.id},[u("div",null,[u("img",{class:"category-image",src:O(n.imagePath)},null,8,Ce)]),t(ee,{to:`/categories/${n.id}`},{default:a(()=>[u("button",we,[u("h3",null,F(n.name),1),u("p",null,F(n.description),1)])]),_:2},1032,["to"]),t(A,{text:"Editar"},{activator:a(({props:U})=>[t(D,T({ref_for:!0},U,{onClick:ne=>J(n),style:{color:"rgba(228, 192, 11, 0.663)"}}),{default:a(()=>e[9]||(e[9]=[d(" mdi-pencil ")])),_:2},1040,["onClick"])]),_:2},1024),t(A,{text:"Eliminar"},{activator:a(({props:U})=>[t(D,T({ref_for:!0},U,{onClick:ne=>W(n),style:{color:"darkslategrey"}}),{default:a(()=>e[10]||(e[10]=[d(" mdi-delete ")])),_:2},1040,["onClick"])]),_:2},1024)]))),128))])),u("div",be,[t(P,null,{default:a(()=>[t(oe,{justify:"center"},{default:a(()=>[t(ae,{cols:"8"},{default:a(()=>[t(P,{class:"max-width"},{default:a(()=>[t(te,{modelValue:x.value,"onUpdate:modelValue":e[2]||(e[2]=n=>x.value=n),length:r.value.totalPages||1,class:"my-4",onInput:_},null,8,["modelValue","length"])]),_:1})]),_:1})]),_:1})]),_:1}),t(h,{class:"dialog",modelValue:s.value,"onUpdate:modelValue":e[4]||(e[4]=n=>s.value=n)},{default:a(()=>[t(N,null,{default:a(()=>[e[12]||(e[12]=u("h1",{class:"dialog-title"},"Editar Categoría",-1)),t(B,null,{default:a(()=>[t(me,{category:E.value,onSave:H},null,8,["category"])]),_:1}),t(L,null,{default:a(()=>[t(c,{class:"cancel-button",text:"",onClick:e[3]||(e[3]=n=>s.value=!1)},{default:a(()=>e[11]||(e[11]=[d("Cancelar")])),_:1})]),_:1})]),_:1})]),_:1},8,["modelValue"]),t(h,{class:"dialog",modelValue:p.value,"onUpdate:modelValue":e[6]||(e[6]=n=>p.value=n)},{default:a(()=>[t(N,null,{default:a(()=>[t(B,null,{default:a(()=>[t(pe,{category:V.value,onDeleted:K},null,8,["category"])]),_:1}),t(L,null,{default:a(()=>[t(c,{color:"blue darken-1",text:"",onClick:e[5]||(e[5]=n=>p.value=!1)},{default:a(()=>e[13]||(e[13]=[d(" Cancelar ")])),_:1})]),_:1})]),_:1})]),_:1},8,["modelValue"])])]),g.value?(m(),q(P,{key:0},{default:a(()=>[t(ge)]),_:1})):de("",!0)],64)}}},Ee=se(ke,[["__scopeId","data-v-156efdb3"]]),Be={__name:"gestion",setup($){return(w,k)=>(m(),q(ve(Ee)))}};export{Be as default};
