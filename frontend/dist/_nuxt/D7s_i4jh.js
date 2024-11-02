import{_ as Q,A as ee,r,s as te,v as le,g as ae,m as u,o as g,c as b,a as n,b as a,w as o,d as I,C as oe,F as D,y as ne,t as w,x as F,D as se,E as ue,z as re,n as de}from"./LVjYQMdl.js";import{m as P}from"./BJ_t5Q7L.js";import{I as ie}from"./I6Uv_uRz.js";import{u as S}from"./CS4oBRU5.js";import"./DOYwHpwi.js";const ce={class:"header-container"},ve={class:"text-left"},me={class:"text-left"},pe={class:"text-left"},_e={class:"text-left"},fe={key:0,style:{"text-align":"center","margin-top":"20px"}},ge={class:"text-center"},xe={__name:"InventoryGrid",setup(R){const C=re(),N=ee(),i=r([]),k=r([]),x=r([]),v=r(!1),A=r(null),m=r(1),y=r(10),E=r(1),s=r({salesId:"",productName:"",status:"",created_at:"",updated_at:""}),p=r(!1),d=async()=>{p.value=!1;try{const{data:l,error:e}=await S(`${C.public.API_BASE_URL}inventories?page=${m.value}
      &pageSize=${y.value}&status=${s.value.status}&salesId=${s.value.salesId}&productName=${s.value.productName}&createdAt=${s.value.created_at}&updatedAt=${s.value.updated_at}`,{method:"GET"},"$Rsup4iOXk2");if(e.value||!l.value){p.value=!0,i.value=[],x.value=[];return}i.value=l.value.data,E.value=l.value.totalPages,B(),x.value.length===0&&(p.value=!0)}catch(l){console.log(l),p.value=!0}},Y=async()=>{try{const{data:l,error:e}=await S(`${C.public.API_BASE_URL}sales`,{method:"GET"},"$ZIEFPrrBWB");k.value=l.value.data,B()}catch(l){console.log(l)}};te(async()=>{await le(),await Y(),await d()});const B=()=>{i.value.length>0&&k.value.length>0&&(x.value=i.value.map(l=>{const e=k.value.find(c=>c.id===l.salesId);return{...l,productName:e?e.products.name:l.sales.products.name}}))},_=l=>{m.value=l,d()};ae([m,y,s],()=>{d()});const V=l=>{s.value[l]="",_(1),d()},z=l=>{l&&l.id?(A.value={...l},v.value=!0):console.error("No se puede editar")},M=async l=>{if(l){const e=i.value.findIndex(c=>c.id===l.id);e!==-1&&(i.value[e]=l)}await d(),v.value=!1},G=()=>{N.push("/inventory/register")};return(l,e)=>{const c=u("v-btn"),T=u("v-select"),$=u("v-text-field"),f=u("v-col"),L=u("v-icon"),O=u("v-tooltip"),h=u("v-table"),j=u("v-alert"),W=u("v-pagination"),U=u("v-container"),X=u("v-row"),Z=u("v-card-text"),q=u("v-card-actions"),H=u("v-card"),J=u("v-dialog");return g(),b(D,null,[n("div",ce,[a(c,{class:"register-button",onClick:oe(G,["prevent"])},{default:o(()=>e[16]||(e[16]=[I(" Registrar Inventario ")])),_:1}),a(T,{class:"page-select",modelValue:y.value,"onUpdate:modelValue":e[0]||(e[0]=t=>y.value=t),items:[5,10,20,30,40,50,100],label:"Seleccionar datos por Página",onChange:d},null,8,["modelValue"])]),n("div",null,[a(h,null,{default:o(()=>[n("thead",null,[n("tr",null,[n("th",ve,[a(f,null,{default:o(()=>[a($,{style:{width:"200px"},modelValue:s.value.productName,"onUpdate:modelValue":e[1]||(e[1]=t=>s.value.productName=t),label:"Producto vendido",clearable:"",onInput:e[2]||(e[2]=t=>_(1)),"onClick:clear":e[3]||(e[3]=t=>V("productName"))},null,8,["modelValue"])]),_:1})]),n("th",me,[a(f,null,{default:o(()=>[a($,{style:{width:"200px"},modelValue:s.value.status,"onUpdate:modelValue":e[4]||(e[4]=t=>s.value.status=t),label:"Estado de producto",clearable:"",onInput:e[5]||(e[5]=t=>_(1)),"onClick:clear":e[6]||(e[6]=t=>V("status"))},null,8,["modelValue"])]),_:1})]),n("th",pe,[a(f,null,{default:o(()=>[a($,{style:{width:"200px"},modelValue:s.value.created_at,"onUpdate:modelValue":e[7]||(e[7]=t=>s.value.created_at=t),label:"Fecha de registro",clearable:"",onInput:e[8]||(e[8]=t=>_(1)),"onClick:clear":e[9]||(e[9]=t=>V("created_at"))},null,8,["modelValue"])]),_:1})]),n("th",_e,[a(f,null,{default:o(()=>[a($,{style:{width:"200px"},modelValue:s.value.updated_at,"onUpdate:modelValue":e[10]||(e[10]=t=>s.value.updated_at=t),label:"Fecha actualización",clearable:"",onInput:e[11]||(e[11]=t=>_(1)),"onClick:clear":e[12]||(e[12]=t=>V("updated_at"))},null,8,["modelValue"])]),_:1})]),e[17]||(e[17]=n("th",{class:"text-left"},"Acciones",-1))])]),n("tbody",null,[(g(!0),b(D,null,ne(x.value,t=>(g(),b("tr",{key:t.id},[n("td",null,w(t.productName),1),n("td",null,w(t.status),1),n("td",null,w(F(P)(t.createdAt).tz("America/Bogota").format("DD/MM/YYYY/ hh:mm A")),1),n("td",null,w(F(P)(t.updatedAt).tz("America/Bogota").format("DD/MM/YYYY/ hh:mm A")),1),a(O,{text:"Editar"},{activator:o(({props:K})=>[a(L,se({style:{color:"#009c8c"},ref_for:!0},K,{onClick:Ve=>z(t)}),{default:o(()=>e[18]||(e[18]=[I(" mdi-pencil ")])),_:2},1040,["onClick"])]),_:2},1024)]))),128))])]),_:1}),p.value?(g(),b("div",fe,[a(j,{color:"#009c8c",type:"warning"},{default:o(()=>e[19]||(e[19]=[I("No se encontraron registros.")])),_:1})])):ue("",!0)]),n("div",ge,[a(U,null,{default:o(()=>[a(X,{justify:"center"},{default:o(()=>[a(f,{col:"8"},{default:o(()=>[a(U,{class:"max-width"},{default:o(()=>[a(W,{modelValue:m.value,"onUpdate:modelValue":e[13]||(e[13]=t=>m.value=t),length:E.value,onInput:d,class:"my-4"},null,8,["modelValue","length"])]),_:1})]),_:1})]),_:1})]),_:1})]),a(J,{class:"dialog",modelValue:v.value,"onUpdate:modelValue":e[15]||(e[15]=t=>v.value=t)},{default:o(()=>[a(H,null,{default:o(()=>[e[21]||(e[21]=n("h1",{class:"dialog-title"},"Editar estado",-1)),a(Z,null,{default:o(()=>[a(ie,{inventory:A.value,onSave:M},null,8,["inventory"])]),_:1}),a(q,null,{default:o(()=>[a(c,{class:"cancel-button",text:"",onClick:e[14]||(e[14]=t=>v.value=!1)},{default:o(()=>e[20]||(e[20]=[I(" Cancelar ")])),_:1})]),_:1})]),_:1})]),_:1},8,["modelValue"])],64)}}},ye=Q(xe,[["__scopeId","data-v-8596de5f"]]),ke={__name:"list",setup(R){return(C,N)=>(g(),de(ye))}};export{ke as default};
