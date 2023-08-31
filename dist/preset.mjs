import { DefinePlugin } from 'webpack';
import E from 'yaml';
import { storage } from '@cmbr/sb-patterns';
import { toId } from '@storybook/csf';
import k, { readFileSync } from 'fs';
import P from 'path';

var d=(t=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(t,{get:(o,n)=>(typeof require<"u"?require:o)[n]}):t)(function(t){if(typeof require<"u")return require.apply(this,arguments);throw new Error('Dynamic require of "'+t+'" is not supported')});function S(t,o,n,e={}){let c=E.parse(o),r=Object.keys(c),a=r[0];if(!a)throw new Error(`No patterns found in ${t}`);let u=c[a],m=u.label??a,s=u.namespace??"",p=s;s===""&&Object.keys(e).forEach(i=>{t.startsWith(e[i])&&e[i].length>p.length&&(s=i,p=e[i]);});let g=s+"/"+m,f=[],l={title:n(g),tags:["autodocs"]};return r.forEach(i=>{let y=c[i];storage.addDefinition(i,y);let b=y.variants??{__default:{label:"Default"}};Object.keys(b).forEach(h=>{let x=b[h].label,O=x.replace(/[^a-zA-Z0-9]/g,"_"),A={id:toId(g,i+"-"+O),name:x};f.push(A);});}),{meta:l,stories:f}}var N=d("babylon"),j=d("babel-traverse").default;function Y(t=[]){return [...t,d.resolve("./configuration")]}function z(t,o){let n={},e=o.webpackAliases||{},c=o.appPath||"";return Object.keys(e).forEach(r=>{n[r]=e[r].replace(c,".");}),{...t,NAMESPACES:JSON.stringify(n)}}function X(t,o){let n=t.module?.rules||[],e=t.plugins||[];return {...t,plugins:[...e,new DefinePlugin({STORIES_CONTEXT:JSON.stringify(o.storiesContexts)})],module:{...t.module,rules:[...n,{test:/\.yml/,use:["js-yaml-loader"]},{test:/\.wingsuit\.(ts|tsx)$/,enforce:"post",use:[{loader:d.resolve("./storiesLoader")}]}]}}}var Z=async(t,o)=>{let n=o.webpackAliases||{},e={};return Object.keys(n).forEach(r=>{let a=r.replace("@","");e[a]=n[r];}),[{test:/\.wingsuit\.(ts|tsx)$/,indexer:async(r,a)=>{let u=readFileSync(r,"utf-8").toString(),m=N.parse(u,{sourceType:"module"}),s="";j(m,{VariableDeclaration(f){if(f.node.declarations[0].id.name==="patternDefinition"){let l=f.node.declarations[0].init.arguments[0].value;l.startsWith(".")||l.startsWith("/")?s=P.join(P.dirname(r),l):s=d.resolve(l);}}});let p=k.readFileSync(s,"utf8");return S(r,p,a.makeTitle,e)}},...t||[]]};

export { Y as config, z as env, Z as storyIndexers, X as webpack };
//# sourceMappingURL=out.js.map
//# sourceMappingURL=preset.mjs.map