import{_ as b,p as B,u as N,r as m,q as R,s as $,v as F,m as r,o as n,c as i,b as l,w as u,d as I,x as L,a as t,t as o,F as V,y as E,n as p,z as S}from"./LVjYQMdl.js";import{L as T}from"./CkOKT_tB.js";import{u as A}from"./CS4oBRU5.js";const D={key:0},U={class:"title"},q={class:"product-container"},z=["src"],G={class:"name-text"},M={class:"status-text"},O={class:"description-text"},Y={class:"price-text"},j={__name:"CategoriesProducts",setup(v){const _=S(),d=B(),f=N(),{id:g}=d.params,c=m(null),x=m(null),h=async()=>{try{const{data:e}=await A(`${_.public.API_BASE_URL}/categories/${g}`,"$VwRbTnsYDN");c.value=e.value}catch(e){x.value=e}},y=R(()=>{var e;return((e=c.value)==null?void 0:e.products.filter(s=>!s.deleted))||[]}),k=e=>e;return $(async()=>{await F(),await h()}),(e,s)=>{const C=r("v-icon"),w=r("v-card"),P=r("v-container");return c.value?(n(),i("div",D,[l(C,{class:"exit-icon",onClick:s[0]||(s[0]=a=>L(f).back())},{default:u(()=>s[1]||(s[1]=[I("mdi-arrow-left")])),_:1}),l(w,null,{default:u(()=>[t("h1",U,o(c.value.name),1)]),_:1}),s[2]||(s[2]=t("div",{class:"subtitle"},[t("h2",null,"Productos")],-1)),t("div",q,[(n(!0),i(V,null,E(y.value,a=>(n(),i("div",{class:"product-item",key:a.id},[t("div",null,[t("img",{class:"product-image",src:k(a.imagePath1)},null,8,z)]),t("h1",G,o(a.name),1),t("p",M,"Estado "+o(a.status),1),t("p",O,o(a.description),1),t("p",Y,o(a.price),1)]))),128))])])):(n(),p(P,{key:1},{default:u(()=>[l(T)]),_:1}))}}},H=b(j,[["__scopeId","data-v-f6407704"]]),W={__name:"[id]",setup(v){return(_,d)=>(n(),p(H))}};export{W as default};
