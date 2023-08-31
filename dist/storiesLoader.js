'use strict';

var w = require('yaml');
var y = require('ts-dedent');
var j = require('fs');
var v = require('@babel/generator');
var d = require('path');
var sbPatterns = require('@cmbr/sb-patterns');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var w__default = /*#__PURE__*/_interopDefault(w);
var y__default = /*#__PURE__*/_interopDefault(y);
var j__default = /*#__PURE__*/_interopDefault(j);
var v__default = /*#__PURE__*/_interopDefault(v);
var d__default = /*#__PURE__*/_interopDefault(d);

var s=(t=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(t,{get:(a,i)=>(typeof require<"u"?require:a)[i]}):t)(function(t){if(typeof require<"u")return require.apply(this,arguments);throw new Error('Dynamic require of "'+t+'" is not supported')});var x=s("babylon"),O=s("babel-traverse").default;function T(t){let{resource:a}=this._module,i=x.parse(t,{sourceType:"module"}),n="",c="",m=null;if(O(i,{VariableDeclaration(e){if(e.node.declarations[0].id.name==="wingsuit"&&(m=e.node),e.node.declarations[0].id.name==="patternDefinition"){let r=e.node.declarations[0].init.arguments[0].value;r.startsWith(".")||r.startsWith("/")?(n=d__default.default.join(d__default.default.dirname(a),r),c=`./${d__default.default.basename(n)}`):(n=s.resolve(r),c=`${r}`);}}}),n==="")return t;let b=m?v__default.default(i).code:`import patternDefinition from '${c}'`,P=j__default.default.readFileSync(n,"utf8"),l=w__default.default.parse(P),p=Object.keys(l);if(!p[0])throw new Error(`No patterns found in ${a}`);let f=[];return f.push(y__default.default`
    import { PatternPreview, argTypes, args, storage } from '@pattern';

    ${b}

    export default {
      component: PatternPreview
    }
  `),p.forEach(e=>{let g=l[e].variants??{__default:{label:"Default"}};Object.keys(g).forEach(o=>{let $=g[o].label,u=$.replace(/[^a-zA-Z0-9]/g,"_"),h=sbPatterns.storage.loadVariant(e,o).getCode();f.push(y__default.default`
        const ${e}${u}Parameters = {
          docs: {
            description: {
              component: \`${l[e].description??""}\`
            },
            source: {
              code: ${JSON.stringify(h)},
              language: 'jsx',
              type: 'auto',
              format: true
            }
          }
        }
        export const ${e}${u} = {
          name: '${$}',
          args: {patternId: '${e}', variantId: '${o}', ...args({}, '${e}', '${o}')},
          argTypes: argTypes('${e}', '${o}'),
          parameters: Object.assign({}, ${e}${u}Parameters, wingsuit.parameters || {}),
        }
      `);});}),f.join(`
`)}var k=T;

module.exports = k;
//# sourceMappingURL=out.js.map
//# sourceMappingURL=storiesLoader.js.map