import{_ as ue,A as de,E as se,r as m,s as re,v as ie,g as ve,m as d,o as s,c as V,a as u,b as l,w as a,d as v,C as me,x as r,n as k,F as I,y as D,t as y,G as B,D as R,z as ce}from"./DkewYONJ.js";import{d as pe}from"./CVGRC5-7.js";import{m as M}from"./BAQvquOn.js";import{I as fe}from"./DYMqEkQ_.js";import{u as Z}from"./DUKX-aPY.js";import"./DOYwHpwi.js";const _e={class:"header-container"},ge={class:"text-left"},Ve={class:"text-left"},ye={class:"text-left"},$e={class:"text-left"},ke={key:2,style:{"text-align":"center","margin-top":"20px"}},xe={class:"text-center"},be={__name:"InventoryGrid",setup(q){const P=ce(),G=de(),{mdAndUp:H}=se(),j=H,x=m([]),S=m([]),f=m([]),A=m(!1),T=m(null),N=m(1),z=m(10),L=m(1),n=m({salesId:"",productName:"",status:"",created_at:"",updated_at:""}),b=m(!1),$=async()=>{b.value=!1;try{const{data:o,error:e}=await Z(`${P.public.API_BASE_URL}inventories?page=${N.value}
      &pageSize=${z.value}&status=${n.value.status}&salesId=${n.value.salesId}&productName=${n.value.productName}&createdAt=${n.value.created_at}&updatedAt=${n.value.updated_at}`,{method:"GET"},"$Rsup4iOXk2");if(e.value||!o.value){b.value=!0,x.value=[],f.value=[];return}x.value=o.value.data,L.value=o.value.totalPages,O(),f.value.length===0&&(b.value=!0)}catch(o){console.log(o),b.value=!0}},J=async()=>{try{const{data:o}=await Z(`${P.public.API_BASE_URL}sales`,{method:"GET"},"$ZIEFPrrBWB");S.value=o.value.data,O()}catch(o){console.log(o)}};re(async()=>{await ie(),await J(),await $()});const O=()=>{x.value.length>0&&S.value.length>0&&(f.value=x.value.map(o=>{const e=S.value.find(C=>C.id===o.salesId);return{...o,productName:e?e.products.name:o.sales.products.name}}))},c=pe(o=>{N.value=o,$()},500);ve([N,z,n],()=>{$()});const _=o=>{n.value[o]="",b.value=!1,c(1),$()},E=o=>{o&&o.id?(T.value={...o},A.value=!0):console.error("No se puede editar")},K=async o=>{if(o){const e=x.value.findIndex(C=>C.id===o.id);e!==-1&&(x.value[e]=o)}await $(),A.value=!1},Q=()=>{G.push("/inventory/register")};return(o,e)=>{const C=d("v-btn"),h=d("v-select"),g=d("v-text-field"),i=d("v-col"),U=d("v-icon"),Y=d("v-tooltip"),w=d("v-row"),W=d("v-table"),ee=d("v-alert"),te=d("v-pagination"),X=d("v-container"),le=d("v-card-text"),ae=d("v-card-actions"),oe=d("v-card"),ne=d("v-dialog");return s(),V(I,null,[u("div",_e,[l(C,{class:"register-button",onClick:me(Q,["prevent"])},{default:a(()=>e[28]||(e[28]=[v(" Registrar Inventario ")])),_:1}),l(h,{class:"page-select",modelValue:z.value,"onUpdate:modelValue":e[0]||(e[0]=t=>z.value=t),items:[5,10,20,30,40,50,100],label:"Seleccionar datos por Página",onChange:$},null,8,["modelValue"])]),r(j)?R("",!0):(s(),k(W,{key:0},{default:a(()=>[l(g,{modelValue:n.value.productName,"onUpdate:modelValue":e[1]||(e[1]=t=>n.value.productName=t),label:"Producto vendido",clearable:"",onInput:e[2]||(e[2]=t=>r(c)(1)),"onClick:clear":e[3]||(e[3]=t=>_("productName"))},null,8,["modelValue"]),(s(!0),V(I,null,D(f.value,t=>(s(),k(i,{key:t.id},{default:a(()=>[l(w,null,{default:a(()=>[l(i,null,{default:a(()=>[v(y(t.productName),1)]),_:2},1024),l(i,{class:"d-flex justify-end"},{default:a(()=>[l(Y,{text:"Editar"},{activator:a(({props:p})=>[l(U,B({style:{color:"#009c8c"},ref_for:!0},p,{onClick:F=>E(t)}),{default:a(()=>e[29]||(e[29]=[v(" mdi-pencil ")])),_:2},1040,["onClick"])]),_:2},1024)]),_:2},1024)]),_:2},1024)]),_:2},1024))),128)),l(g,{modelValue:n.value.status,"onUpdate:modelValue":e[4]||(e[4]=t=>n.value.status=t),label:"Estado de producto",clearable:"",onInput:e[5]||(e[5]=t=>r(c)(1)),"onClick:clear":e[6]||(e[6]=t=>_("status"))},null,8,["modelValue"]),(s(!0),V(I,null,D(f.value,t=>(s(),k(i,{key:t.id},{default:a(()=>[l(w,null,{default:a(()=>[l(i,null,{default:a(()=>[v(y(t.status),1)]),_:2},1024),l(i,{class:"d-flex justify-end"},{default:a(()=>[l(Y,{text:"Editar"},{activator:a(({props:p})=>[l(U,B({style:{color:"#009c8c"},ref_for:!0},p,{onClick:F=>E(t)}),{default:a(()=>e[30]||(e[30]=[v(" mdi-pencil ")])),_:2},1040,["onClick"])]),_:2},1024)]),_:2},1024)]),_:2},1024)]),_:2},1024))),128)),l(g,{modelValue:n.value.created_at,"onUpdate:modelValue":e[7]||(e[7]=t=>n.value.created_at=t),label:"Fecha de registro",clearable:"",onInput:e[8]||(e[8]=t=>r(c)(1)),"onClick:clear":e[9]||(e[9]=t=>_("created_at"))},null,8,["modelValue"]),(s(!0),V(I,null,D(f.value,t=>(s(),k(i,{key:t.id},{default:a(()=>[l(w,null,{default:a(()=>[l(i,null,{default:a(()=>[v(y(r(M)(t.createdAt).tz("America/Bogota").format("DD/MM/YYYY/ hh:mm A")),1)]),_:2},1024),l(i,{class:"d-flex justify-end"},{default:a(()=>[l(Y,{text:"Editar"},{activator:a(({props:p})=>[l(U,B({style:{color:"#009c8c"},ref_for:!0},p,{onClick:F=>E(t)}),{default:a(()=>e[31]||(e[31]=[v(" mdi-pencil ")])),_:2},1040,["onClick"])]),_:2},1024)]),_:2},1024)]),_:2},1024)]),_:2},1024))),128)),l(g,{modelValue:n.value.updated_at,"onUpdate:modelValue":e[10]||(e[10]=t=>n.value.updated_at=t),label:"Fecha actualización",clearable:"",onInput:e[11]||(e[11]=t=>r(c)(1)),"onClick:clear":e[12]||(e[12]=t=>_("updated_at"))},null,8,["modelValue"]),(s(!0),V(I,null,D(f.value,t=>(s(),k(i,{key:t.id},{default:a(()=>[l(w,null,{default:a(()=>[l(i,null,{default:a(()=>[v(y(t.updatedAt?r(M)(t.updatedAt).tz("America/Bogota").format("DD/MM/YYYY hh:mm A"):"No actualizado"),1)]),_:2},1024),l(i,{class:"d-flex justify-end"},{default:a(()=>[l(Y,{text:"Editar"},{activator:a(({props:p})=>[l(U,B({style:{color:"#009c8c"},ref_for:!0},p,{onClick:F=>E(t)}),{default:a(()=>e[32]||(e[32]=[v(" mdi-pencil ")])),_:2},1040,["onClick"])]),_:2},1024)]),_:2},1024)]),_:2},1024)]),_:2},1024))),128))]),_:1})),r(j)?(s(),k(W,{key:1},{default:a(()=>[u("thead",null,[u("tr",null,[u("th",ge,[l(g,{modelValue:n.value.productName,"onUpdate:modelValue":e[13]||(e[13]=t=>n.value.productName=t),label:"Producto vendido",clearable:"",onInput:e[14]||(e[14]=t=>r(c)(1)),"onClick:clear":e[15]||(e[15]=t=>_("productName"))},null,8,["modelValue"])]),u("th",Ve,[l(g,{modelValue:n.value.status,"onUpdate:modelValue":e[16]||(e[16]=t=>n.value.status=t),label:"Estado de producto",clearable:"",onInput:e[17]||(e[17]=t=>r(c)(1)),"onClick:clear":e[18]||(e[18]=t=>_("status"))},null,8,["modelValue"])]),u("th",ye,[l(g,{modelValue:n.value.created_at,"onUpdate:modelValue":e[19]||(e[19]=t=>n.value.created_at=t),label:"Fecha de registro",clearable:"",onInput:e[20]||(e[20]=t=>r(c)(1)),"onClick:clear":e[21]||(e[21]=t=>_("created_at"))},null,8,["modelValue"])]),u("th",$e,[l(g,{modelValue:n.value.updated_at,"onUpdate:modelValue":e[22]||(e[22]=t=>n.value.updated_at=t),label:"Fecha actualización",clearable:"",onInput:e[23]||(e[23]=t=>r(c)(1)),"onClick:clear":e[24]||(e[24]=t=>_("updated_at"))},null,8,["modelValue"])]),e[33]||(e[33]=u("th",{class:"text-left"},"Acciones",-1))])]),u("tbody",null,[(s(!0),V(I,null,D(f.value,t=>(s(),V("tr",{key:t.id},[u("td",null,y(t.productName),1),u("td",null,y(t.status),1),u("td",null,y(r(M)(t.createdAt).tz("America/Bogota").format("DD/MM/YYYY/ hh:mm A")),1),u("td",null,y(t.updatedAt?r(M)(t.updatedAt).tz("America/Bogota").format("DD/MM/YYYY hh:mm A"):"No actualizado"),1),u("td",null,[l(Y,{text:"Editar"},{activator:a(({props:p})=>[l(U,B({style:{color:"#009c8c"},ref_for:!0},p,{onClick:F=>E(t)}),{default:a(()=>e[34]||(e[34]=[v(" mdi-pencil ")])),_:2},1040,["onClick"])]),_:2},1024)])]))),128))])]),_:1})):R("",!0),b.value?(s(),V("div",ke,[l(ee,{color:"#009c8c",type:"warning"},{default:a(()=>e[35]||(e[35]=[v("No se encontraron registros.")])),_:1})])):R("",!0),u("div",xe,[l(X,null,{default:a(()=>[l(w,{justify:"center"},{default:a(()=>[l(i,{col:"8"},{default:a(()=>[l(X,{class:"max-width"},{default:a(()=>[l(te,{modelValue:N.value,"onUpdate:modelValue":e[25]||(e[25]=t=>N.value=t),length:L.value,onInput:$,class:"my-4"},null,8,["modelValue","length"])]),_:1})]),_:1})]),_:1})]),_:1})]),l(ne,{class:"dialog",modelValue:A.value,"onUpdate:modelValue":e[27]||(e[27]=t=>A.value=t)},{default:a(()=>[l(oe,null,{default:a(()=>[e[37]||(e[37]=u("h1",{class:"dialog-title"},"Editar estado",-1)),l(le,null,{default:a(()=>[l(fe,{inventory:T.value,onSave:K},null,8,["inventory"])]),_:1}),l(ae,null,{default:a(()=>[l(C,{class:"cancel-button",text:"",onClick:e[26]||(e[26]=t=>A.value=!1)},{default:a(()=>e[36]||(e[36]=[v(" Cancelar ")])),_:1})]),_:1})]),_:1})]),_:1},8,["modelValue"])],64)}}},Ce=ue(be,[["__scopeId","data-v-af4f07ce"]]),we={__name:"list",setup(q){return(P,G)=>(s(),k(Ce))}};export{we as default};
