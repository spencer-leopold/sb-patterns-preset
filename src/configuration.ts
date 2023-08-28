import { storage } from "sb-patterns";

const namespaces = JSON.parse(process.env.NAMESPACES || "{}");

// Unfortunately, webpack require.context needs a string literal to work, so at
// the moment you can only define one STORIES_CONTEXT. Ideally, we would like to
// support an array of contexts in the future.
// TODO: Add declare const STORIES_CONTEXT: string; to get rid of error.
if (!STORIES_CONTEXT) {
  throw new Error(
    "No storiesContexts defined in the storybook add-on for @cmbr/sb-patterns."
  );
}

if (typeof STORIES_CONTEXT !== "string") {
  throw new Error(
    "Invalid storiesContexts defined in the storybook add-on for @cmbr/sb-patterns. storiesContexts must be a string"
  );
}

const definitionContexts = [
  require.context(STORIES_CONTEXT, true, /\.wingsuit\.(yml|yaml)$/),
  require.context(STORIES_CONTEXT, true, /\.wingsuit\.(js|jsx|ts|tsx)$/),
];

const componentContexts = [
  require.context(STORIES_CONTEXT, true, /^((?!wingsuit).)*\.(js|jsx|ts|tsx)$/),
];

// Configure pattern storage.
storage.setNamespaces(namespaces);
storage.createComponentStorageFromContext(componentContexts);
storage.createDefinitionsFromMultiContext(definitionContexts);

// Require all static assets since some files will be loaded dynamically.
function requireAll(r: any) {
  r.keys().forEach(r);
}

requireAll(
  require.context(
    STORIES_CONTEXT,
    true,
    /\.(svg|png|webp|jpg|jpeg|gif|woff|woff2)$/
  )
);

export const parameters = {};
