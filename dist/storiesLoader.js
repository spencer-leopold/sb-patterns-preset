'use strict';

var w = require('yaml');
var b = require('ts-dedent');
var j = require('fs');
var v = require('@babel/generator');
var d = require('path');
var sbPatterns = require('@cmbr/sb-patterns');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var w__default = /*#__PURE__*/_interopDefault(w);
var b__default = /*#__PURE__*/_interopDefault(b);
var j__default = /*#__PURE__*/_interopDefault(j);
var v__default = /*#__PURE__*/_interopDefault(v);
var d__default = /*#__PURE__*/_interopDefault(d);

var i=(e=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(e,{get:(a,s)=>(typeof require<"u"?require:a)[s]}):e)(function(e){if(typeof require<"u")return require.apply(this,arguments);throw new Error('Dynamic require of "'+e+'" is not supported')});var S=sbPatterns.getStorage(),x=i("babylon"),O=i("babel-traverse").default;function T(e){let{resource:a}=this._module,s=x.parse(e,{sourceType:"module"}),o="",c="",m=null;if(O(s,{VariableDeclaration(t){if(t.node.declarations[0].id.name==="wingsuit"&&(m=t.node),t.node.declarations[0].id.name==="patternDefinition"){let r=t.node.declarations[0].init.arguments[0].value;r.startsWith(".")||r.startsWith("/")?(o=d__default.default.join(d__default.default.dirname(a),r),c=`./${d__default.default.basename(o)}`):(o=i.resolve(r),c=`${r}`);}}}),o==="")return e;let y=m?v__default.default(s).code:`import patternDefinition from '${c}'`,P=j__default.default.readFileSync(o,"utf8"),l=w__default.default.parse(P),g=Object.keys(l);if(!g[0])throw new Error(`No patterns found in ${a}`);let f=[];return f.push(b__default.default`
    import { PatternPreview, argTypes, args, getStorage } from '@cmbr/sb-patterns';
    const storage = getStorage();

    ${y}

    export default {
      component: PatternPreview
    }
  `),g.forEach(t=>{let p=l[t].variants??{__default:{label:"Default"}};Object.keys(p).forEach(n=>{let $=p[n].label,u=$.replace(/[^a-zA-Z0-9]/g,"_"),h=S.loadVariant(t,n).getCode();f.push(b__default.default`
        const ${t}${u}Parameters = {
          docs: {
            description: {
              component: \`${l[t].description??""}\`
            },
            source: {
              code: ${JSON.stringify(h)},
              language: 'jsx',
              type: 'auto',
              format: true
            }
          }
        }
        export const ${t}${u} = {
          name: '${$}',
          args: {patternId: '${t}', variantId: '${n}', ...args({}, '${t}', '${n}')},
          argTypes: argTypes('${t}', '${n}'),
          parameters: Object.assign({}, ${t}${u}Parameters, wingsuit.parameters || {}),
        }
      `);});}),f.join(`
`)}var A=T;

module.exports = A;
//# sourceMappingURL=out.js.map
//# sourceMappingURL=storiesLoader.js.map