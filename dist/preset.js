'use strict';

var webpack = require('webpack');
var E = require('yaml');
var sbPatterns = require('@cmbr/sb-patterns');
var csf = require('@storybook/csf');
var k = require('fs');
var P = require('path');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var E__default = /*#__PURE__*/_interopDefault(E);
var k__default = /*#__PURE__*/_interopDefault(k);
var P__default = /*#__PURE__*/_interopDefault(P);

var d=(t=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(t,{get:(o,n)=>(typeof require<"u"?require:o)[n]}):t)(function(t){if(typeof require<"u")return require.apply(this,arguments);throw new Error('Dynamic require of "'+t+'" is not supported')});function S(t,o,n,e={}){let c=E__default.default.parse(o),r=Object.keys(c),a=r[0];if(!a)throw new Error(`No patterns found in ${t}`);let u=c[a],m=u.label??a,s=u.namespace??"",p=s;s===""&&Object.keys(e).forEach(i=>{t.startsWith(e[i])&&e[i].length>p.length&&(s=i,p=e[i]);});let g=s+"/"+m,f=[],l={title:n(g),tags:["autodocs"]};return r.forEach(i=>{let y=c[i];sbPatterns.storage.addDefinition(i,y);let b=y.variants??{__default:{label:"Default"}};Object.keys(b).forEach(h=>{let x=b[h].label,O=x.replace(/[^a-zA-Z0-9]/g,"_"),A={id:csf.toId(g,i+"-"+O),name:x};f.push(A);});}),{meta:l,stories:f}}var N=d("babylon"),j=d("babel-traverse").default;function Y(t=[]){return [...t,d.resolve("./configuration")]}function z(t,o){let n={},e=o.webpackAliases||{},c=o.appPath||"";return Object.keys(e).forEach(r=>{n[r]=e[r].replace(c,".");}),{...t,NAMESPACES:JSON.stringify(n)}}function X(t,o){let n=t.module?.rules||[],e=t.plugins||[];return {...t,plugins:[...e,new webpack.DefinePlugin({STORIES_CONTEXT:JSON.stringify(o.storiesContexts)})],module:{...t.module,rules:[...n,{test:/\.yml/,use:["js-yaml-loader"]},{test:/\.wingsuit\.(ts|tsx)$/,enforce:"post",use:[{loader:d.resolve("./storiesLoader")}]}]}}}var Z=async(t,o)=>{let n=o.webpackAliases||{},e={};return Object.keys(n).forEach(r=>{let a=r.replace("@","");e[a]=n[r];}),[{test:/\.wingsuit\.(ts|tsx)$/,indexer:async(r,a)=>{let u=k.readFileSync(r,"utf-8").toString(),m=N.parse(u,{sourceType:"module"}),s="";j(m,{VariableDeclaration(f){if(f.node.declarations[0].id.name==="patternDefinition"){let l=f.node.declarations[0].init.arguments[0].value;l.startsWith(".")||l.startsWith("/")?s=P__default.default.join(P__default.default.dirname(r),l):s=d.resolve(l);}}});let p=k__default.default.readFileSync(s,"utf8");return S(r,p,a.makeTitle,e)}},...t||[]]};

exports.config = Y;
exports.env = z;
exports.storyIndexers = Z;
exports.webpack = X;
//# sourceMappingURL=out.js.map
//# sourceMappingURL=preset.js.map