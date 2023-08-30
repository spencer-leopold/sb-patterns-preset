import w from 'yaml';
import y from 'ts-dedent';
import j from 'fs';
import v from '@babel/generator';
import d from 'path';
import { storage } from 'sb-patterns';

var s=(t=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(t,{get:(a,i)=>(typeof require<"u"?require:a)[i]}):t)(function(t){if(typeof require<"u")return require.apply(this,arguments);throw new Error('Dynamic require of "'+t+'" is not supported')});var x=s("babylon"),O=s("babel-traverse").default;function T(t){let{resource:a}=this._module,i=x.parse(t,{sourceType:"module"}),n="",c="",m=null;if(O(i,{VariableDeclaration(e){if(e.node.declarations[0].id.name==="wingsuit"&&(m=e.node),e.node.declarations[0].id.name==="patternDefinition"){let r=e.node.declarations[0].init.arguments[0].value;r.startsWith(".")||r.startsWith("/")?(n=d.join(d.dirname(a),r),c=`./${d.basename(n)}`):(n=s.resolve(r),c=`${r}`);}}}),n==="")return t;let b=m?v(i).code:`import patternDefinition from '${c}'`,P=j.readFileSync(n,"utf8"),l=w.parse(P),p=Object.keys(l);if(!p[0])throw new Error(`No patterns found in ${a}`);let f=[];return f.push(y`
    import { PatternPreview, argTypes, args, storage } from '@pattern';

    ${b}

    export default {
      component: PatternPreview
    }
  `),p.forEach(e=>{let g=l[e].variants??{__default:{label:"Default"}};Object.keys(g).forEach(o=>{let $=g[o].label,u=$.replace(/[^a-zA-Z0-9]/g,"_"),h=storage.loadVariant(e,o).getCode();f.push(y`
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

export { k as default };
//# sourceMappingURL=out.js.map
//# sourceMappingURL=storiesLoader.mjs.map