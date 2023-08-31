import { storage } from '@cmbr/sb-patterns';

var e=(t=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(t,{get:(r,s)=>(typeof require<"u"?require:r)[s]}):t)(function(t){if(typeof require<"u")return require.apply(this,arguments);throw new Error('Dynamic require of "'+t+'" is not supported')});var n=JSON.parse(process.env.NAMESPACES||"{}");if(!STORIES_CONTEXT)throw new Error("No storiesContexts defined in the storybook add-on for @cmbr/sb-patterns.");if(typeof STORIES_CONTEXT!="string")throw new Error("Invalid storiesContexts defined in the storybook add-on for @cmbr/sb-patterns. storiesContexts must be a string");var i=[e.context(STORIES_CONTEXT,!0,/\.wingsuit\.(yml|yaml)$/),e.context(STORIES_CONTEXT,!0,/\.wingsuit\.(js|jsx|ts|tsx)$/)],a=[e.context(STORIES_CONTEXT,!0,/^((?!wingsuit).)*\.(js|jsx|ts|tsx)$/)];storage.setNamespaces(n);storage.createComponentStorageFromContext(a);storage.createDefinitionsFromMultiContext(i);function c(t){t.keys().forEach(t);}c(e.context(STORIES_CONTEXT,!0,/\.(svg|png|webp|jpg|jpeg|gif|woff|woff2)$/));var E={};

export { E as parameters };
//# sourceMappingURL=out.js.map
//# sourceMappingURL=configuration.mjs.map