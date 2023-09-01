import w from 'yaml';
import b from 'ts-dedent';
import j from 'fs';
import v from '@babel/generator';
import d from 'path';
import { getStorage } from '@cmbr/sb-patterns';

var i=(e=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(e,{get:(a,s)=>(typeof require<"u"?require:a)[s]}):e)(function(e){if(typeof require<"u")return require.apply(this,arguments);throw new Error('Dynamic require of "'+e+'" is not supported')});var S=getStorage(),x=i("babylon"),O=i("babel-traverse").default;function T(e){let{resource:a}=this._module,s=x.parse(e,{sourceType:"module"}),o="",c="",m=null;if(O(s,{VariableDeclaration(t){if(t.node.declarations[0].id.name==="wingsuit"&&(m=t.node),t.node.declarations[0].id.name==="patternDefinition"){let r=t.node.declarations[0].init.arguments[0].value;r.startsWith(".")||r.startsWith("/")?(o=d.join(d.dirname(a),r),c=`./${d.basename(o)}`):(o=i.resolve(r),c=`${r}`);}}}),o==="")return e;let y=m?v(s).code:`import patternDefinition from '${c}'`,P=j.readFileSync(o,"utf8"),l=w.parse(P),g=Object.keys(l);if(!g[0])throw new Error(`No patterns found in ${a}`);let f=[];return f.push(b`
    import { PatternPreview, argTypes, args, getStorage } from '@cmbr/sb-patterns';
    const storage = getStorage();

    ${y}

    export default {
      component: PatternPreview
    }
  `),g.forEach(t=>{let p=l[t].variants??{__default:{label:"Default"}};Object.keys(p).forEach(n=>{let $=p[n].label,u=$.replace(/[^a-zA-Z0-9]/g,"_"),h=S.loadVariant(t,n).getCode();f.push(b`
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

export { A as default };
//# sourceMappingURL=out.js.map
//# sourceMappingURL=storiesLoader.mjs.map