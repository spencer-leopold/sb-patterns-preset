import { Configuration } from "webpack";
import type { IndexerOptions, StoryIndexer } from "@storybook/types";

import { AddonPatternOptions } from "@cmbr/sb-patterns";
import { csfParser } from "./csfParser";
import fs from "fs";
import path from "path";
import { readFileSync } from "fs";

const babylon = require("babylon");
const traverse = require("babel-traverse").default;

interface EnvConfiguration extends Configuration {
  NAMESPACES: string;
}

export function env(
  config: Configuration,
  options: AddonPatternOptions
): EnvConfiguration {
  const relativeNamespaces: Record<string, string> = {};
  const webpackAliases = options.webpackAliases || {};
  const appPath = options.appPath || "";

  Object.keys(webpackAliases).forEach((namespace) => {
    relativeNamespaces[namespace] = webpackAliases[namespace].replace(
      appPath,
      "."
    );
  });

  return {
    ...config,
    NAMESPACES: JSON.stringify(relativeNamespaces),
  };
}

export function webpack(
  config: Configuration,
  options: AddonPatternOptions
): Configuration {
  const rules = config.module?.rules || [];
  const plugins = config.plugins || [];

  return {
    ...config,
    module: {
      ...config.module,
      rules: [
        ...rules,
        {
          test: /\.yml/,
          use: ["js-yaml-loader"],
        },
        {
          test: /\.wingsuit\.(ts|tsx)$/,
          enforce: "post",
          use: [
            {
              loader: require.resolve("./storiesLoader"),
            },
          ],
        },
      ],
    },
  };
}

export const storyIndexers = async (
  indexers: StoryIndexer[] | null,
  options: AddonPatternOptions
) => {
  const webpackAliases = options.webpackAliases || {};
  const absoluteNamespaces: Record<string, string> = {};

  Object.keys(webpackAliases).forEach((namespace) => {
    const formattedNamespace = namespace.replace("@", "");
    absoluteNamespaces[formattedNamespace] = webpackAliases[namespace];
  });

  const csfIndexer = async (fileName: string, opts: IndexerOptions) => {
    const src = readFileSync(fileName, "utf-8").toString();

    const ast = babylon.parse(src, {
      sourceType: "module",
    });

    let absYamlPath = "";

    traverse(ast, {
      VariableDeclaration(pathItem: any) {
        if (pathItem.node.declarations[0].id.name === "patternDefinition") {
          const yamlPath =
            pathItem.node.declarations[0].init.arguments[0].value;
          if (yamlPath.startsWith(".") || yamlPath.startsWith("/")) {
            absYamlPath = path.join(path.dirname(fileName), yamlPath);
          } else {
            absYamlPath = require.resolve(yamlPath);
          }
        }
      },
    });

    const ymlSrc = fs.readFileSync(absYamlPath, "utf8");
    const code = csfParser(
      fileName,
      ymlSrc,
      opts.makeTitle,
      absoluteNamespaces
    );
    return code;
  };

  return [
    {
      test: /\.wingsuit\.(ts|tsx)$/,
      indexer: csfIndexer,
    },
    ...(indexers || []),
  ];
};
