// TODO: DRY this out.  It reuses sections from preset.ts.
import YAML from "yaml";
import dedent from "ts-dedent";
import fs from "fs";
import generate from "@babel/generator";
import path from "path";
import { storage } from "@cmbr/sb-patterns";

const babylon = require("babylon");
const traverse = require("babel-traverse").default;

function transformStories(this: any, code: string) {
  const { resource } = this._module;

  const ast = babylon.parse(code, {
    sourceType: "module",
  });

  let absYamlPath = "";
  let patternClientYamlPath = "";
  let wingsuit = null;

  traverse(ast, {
    // Uncomment this after finding a way to import yaml files over require'ing.
    /*ImportDeclaration(pathItem: any) {
      if (pathItem.node.specifiers[0].local.name === 'patternDefinition') {
        const yamlPath = pathItem.node.source.value;
        if (yamlPath.startsWith('.') || yamlPath.startsWith('/')) {
          absYamlPath = path.join(path.dirname(resource), yamlPath);
        } else {
          absYamlPath = require.resolve(yamlPath);
        }
      }
    },*/
    VariableDeclaration(pathItem: any) {
      if (pathItem.node.declarations[0].id.name === "wingsuit") {
        wingsuit = pathItem.node;
      }
      if (pathItem.node.declarations[0].id.name === "patternDefinition") {
        const yamlPath = pathItem.node.declarations[0].init.arguments[0].value;
        if (yamlPath.startsWith(".") || yamlPath.startsWith("/")) {
          absYamlPath = path.join(path.dirname(resource), yamlPath);
          patternClientYamlPath = `./${path.basename(absYamlPath)}`;
        } else {
          absYamlPath = require.resolve(yamlPath);
          patternClientYamlPath = `${yamlPath}`;
        }
      }
    },
  });

  if (absYamlPath === "") {
    return code;
  }

  const generated = wingsuit
    ? generate(ast).code
    : `import patternDefinition from '${patternClientYamlPath}'`;
  const patternDefinitionFile = fs.readFileSync(absYamlPath, "utf8");
  const patternDefinition = YAML.parse(patternDefinitionFile);

  const patternIds = Object.keys(patternDefinition);
  const defaultPatternId = patternIds[0];
  if (!defaultPatternId) {
    throw new Error(`No patterns found in ${resource}`);
  }

  // invokeHook(appConfig, 'patternLoaded', [defaultPatternId, defaultPattern]);
  // invokeHook(appConfig, 'storyLoaded', [defaultPatternId, defaultPattern]);

  const output: string[] = [];

  output.push(dedent`
    import { PatternPreview, argTypes, args, storage } from '@cmbr/sb-patterns';

    ${generated}

    export default {
      component: PatternPreview
    }
  `);

  patternIds.forEach((patternId) => {
    const definition = patternDefinition[patternId];
    const variants = definition.variants ?? { __default: { label: "Default" } };

    Object.keys(variants).forEach((variantName) => {
      const variantLabel = variants[variantName].label;
      const formattedVariantLabel = variantLabel.replace(/[^a-zA-Z0-9]/g, "_");
      const variantCode = storage.loadVariant(patternId, variantName).getCode();

      output.push(dedent`
        const ${patternId}${formattedVariantLabel}Parameters = {
          docs: {
            description: {
              component: \`${patternDefinition[patternId].description ?? ""}\`
            },
            source: {
              code: ${JSON.stringify(variantCode)},
              language: 'jsx',
              type: 'auto',
              format: true
            }
          }
        }
        export const ${patternId}${formattedVariantLabel} = {
          name: '${variantLabel}',
          args: {patternId: '${patternId}', variantId: '${variantName}', ...args({}, '${patternId}', '${variantName}')},
          argTypes: argTypes('${patternId}', '${variantName}'),
          parameters: Object.assign({}, ${patternId}${formattedVariantLabel}Parameters, wingsuit.parameters || {}),
        }
      `);
    });
  });

  return output.join("\n");
}

export default transformStories;
