'use strict';

var I = require('yaml');
var sbPatterns = require('@cmbr/sb-patterns');
var csf = require('@storybook/csf');
var C = require('fs');
var h = require('path');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var I__default = /*#__PURE__*/_interopDefault(I);
var C__default = /*#__PURE__*/_interopDefault(C);
var h__default = /*#__PURE__*/_interopDefault(h);

var f=(t=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(t,{get:(n,r)=>(typeof require<"u"?require:n)[r]}):t)(function(t){if(typeof require<"u")return require.apply(this,arguments);throw new Error('Dynamic require of "'+t+'" is not supported')});var v=sbPatterns.getStorage();function S(t,n,r,o={}){let c=I__default.default.parse(n),e=Object.keys(c),i=e[0];if(!i)throw new Error(`No patterns found in ${t}`);let p=c[i],m=p.label??i,s=p.namespace??"",u=s;s===""&&Object.keys(o).forEach(a=>{t.startsWith(o[a])&&o[a].length>u.length&&(s=a,u=o[a]);});let y=s+"/"+m,d=[],l={title:r(y),tags:["autodocs"]};return e.forEach(a=>{let g=c[a];v.addDefinition(a,g);let b=g.variants??{__default:{label:"Default"}};Object.keys(b).forEach(P=>{let x=b[P].label,A=x.replace(/[^a-zA-Z0-9]/g,"_"),E={id:csf.toId(y,a+"-"+A),name:x};d.push(E);});}),{meta:l,stories:d}}var N=f("babylon"),j=f("babel-traverse").default;function V(t,n){let r={},o=n.webpackAliases||{},c=n.appPath||"";return Object.keys(o).forEach(e=>{r[e]=o[e].replace(c,".");}),{...t,NAMESPACES:JSON.stringify(r)}}function Y(t,n){let r=t.module?.rules||[];t.plugins||[];return {...t,module:{...t.module,rules:[...r,{test:/\.yml/,use:["js-yaml-loader"]},{test:/\.wingsuit\.(ts|tsx)$/,enforce:"post",use:[{loader:f.resolve("./storiesLoader")}]}]}}}var z=async(t,n)=>{let r=n.webpackAliases||{},o={};return Object.keys(r).forEach(e=>{let i=e.replace("@","");o[i]=r[e];}),[{test:/\.wingsuit\.(ts|tsx)$/,indexer:async(e,i)=>{let p=C.readFileSync(e,"utf-8").toString(),m=N.parse(p,{sourceType:"module"}),s="";j(m,{VariableDeclaration(d){if(d.node.declarations[0].id.name==="patternDefinition"){let l=d.node.declarations[0].init.arguments[0].value;l.startsWith(".")||l.startsWith("/")?s=h__default.default.join(h__default.default.dirname(e),l):s=f.resolve(l);}}});let u=C__default.default.readFileSync(s,"utf8");return S(e,u,i.makeTitle,o)}},...t||[]]};

exports.env = V;
exports.storyIndexers = z;
exports.webpack = Y;
//# sourceMappingURL=out.js.map
//# sourceMappingURL=preset.js.map