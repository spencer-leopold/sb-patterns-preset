import {
  IPatternDefinition,
  IPatternDefinitions,
  Namespaces,
  PatternDefinitionKey,
} from "./definition";

import { ComponentType } from "react";
import IPatternStorage from "./IPatternStorage";
import Pattern from "./Pattern";
import PatternVariant from "./PatternVariant";
import { mergeDeep } from "./utils";

interface PatternCache {
  [key: string]: Pattern;
}

interface ComponentCache {
  [key: string]: ComponentType;
}

/**
 * Class for storing patterns and their respective components.
 */
export default class PatternStorage implements IPatternStorage {
  /**
   * The components that have been registered.
   */
  private components: ComponentCache = {};

  /**
   * The namespaces that have been registered.
   */
  private namespaces: Namespaces = {};

  /**
   * The patterns that have been registered.
   */
  private patterns: PatternCache = {};

  /**
   * The pattern definitions that have been registered.
   */
  public definitions: IPatternDefinitions = {} as IPatternDefinitions;

  /**
   * The current pattern storage instance.
   */
  static instance: PatternStorage;

  /**
   * Get current or new instance of pattern storage.
   */
  static getInstance() {
    if (!PatternStorage.instance) {
      PatternStorage.instance = new PatternStorage();
    }
    return PatternStorage.instance;
  }

  /**
   * Add a component to the storage.
   */
  addComponent(useVal: string, component: ComponentType) {
    this.components[useVal] = component;
  }

  /**
   * Get a component from the storage.
   */
  getComponent(useVal: string): ComponentType {
    return this.components[useVal] || null;
  }

  /**
   * Set the storage namespaces.
   */
  setNamespaces(namespaces: Namespaces) {
    this.namespaces = namespaces;
  }

  /**
   * Get the storage namespaces.
   */
  getNamespaces() {
    return this.namespaces;
  }

  /**
   * Get array of pattern ids.
   */
  getPatternIds(): string[] {
    return Object.keys(this.definitions);
  }

  /**
   * Extend pattern definition.
   *
   * This checks if the yaml definition has an extends property and if so
   * it will extend the definition with the specified pattern definition.
   */
  private extendPatternDefinition(pattern: IPatternDefinition) {
    const resultingPattern = pattern;
    if (
      pattern != null &&
      pattern.extends != null &&
      pattern.extends.length !== 0
    ) {
      pattern.extends.forEach((extend: string) => {
        const [basePattern, basePatternType, basePatternField] =
          extend.split(".");
        if (this.definitions[basePattern] == null) {
          throw new Error(
            `Base pattern "${basePattern}" not found. Possible patterns ${Object.keys(
              this.definitions
            ).join(", ")}`
          );
        }

        const basePatternDefinition = this.extendPatternDefinition(
          this.definitions[basePattern]
        );
        let basePatternTypes: PatternDefinitionKey[] = [];
        if (basePatternType == null) {
          basePatternTypes = ["fields", "settings"];
          if (resultingPattern.use === undefined) {
            resultingPattern.use = basePatternDefinition.use;
          }
        } else {
          basePatternTypes = [basePatternType as PatternDefinitionKey];
        }

        basePatternTypes.forEach((type) => {
          if (!basePatternField) {
            if (basePatternDefinition[type]) {
              resultingPattern[type] = mergeDeep(
                basePatternDefinition[type] || {},
                resultingPattern[type] || {}
              );
            }
          } else if (basePatternDefinition[type]) {
            const resultingPatternType = resultingPattern[type] || {};
            const basePatternType = basePatternDefinition[type] || {};
            resultingPatternType[basePatternField] =
              basePatternType[basePatternField];
            resultingPattern[type] = resultingPatternType;
          }
        });
      });
      resultingPattern.extends = [];
    }
    return resultingPattern;
  }

  /**
   * Load a pattern.
   *
   * This will load from storage and create it from the definiton if it doesn't
   * exist.
   */
  loadPattern(patternId: string): Pattern {
    if (this.patterns[patternId]) {
      return this.patterns[patternId];
    }
    const definition: IPatternDefinition = this.extendPatternDefinition(
      this.definitions[patternId]
    );
    if (definition == null) {
      throw new Error(
        `Pattern definition "${patternId}" not found. Possible pattern ids are: "${Object.keys(
          this.definitions
        ).join(" ,")}"`
      );
    }
    this.patterns[patternId] = new Pattern(patternId, definition, this);
    return this.patterns[patternId];
  }

  /**
   * Load a pattern variant.
   */
  loadVariant(patternId: string, variantId: string): PatternVariant {
    const pattern: Pattern = this.loadPattern(patternId);
    return pattern.getVariant(variantId);
  }

  /**
   * Create a pattern definition.
   */
  createDefinitions(definitions: IPatternDefinitions): void {
    this.definitions = definitions;
    this.patterns = {};
  }

  /**
   * Create a pattern definition from an array of require contexts.
   */
  createDefinitionsFromMultiContext(
    contexts: __WebpackModuleApi.RequireContext[]
  ): void {
    this.patterns = {};

    if (!Array.isArray(contexts)) {
      contexts = [contexts];
    }

    contexts.forEach((context) => {
      if (context != null) {
        this.createDefinitionsFromContext(context);
      }
    });
  }

  /**
   * Create a pattern definition from a require context.
   */
  createDefinitionsFromContext(
    context: __WebpackModuleApi.RequireContext
  ): void {
    context.keys().forEach((key) => {
      if (
        key.includes("__tests__") !== false ||
        key.includes("__int_tests__") !== false
      ) {
        return;
      }

      try {
        const fileExports = context(key);
        // Account for either yml or js exports.
        // YAML definitions will most likely be overwitten, but they're
        // required to populate all the variants at first so we don't get any
        // errors when the JS executes.
        if (
          fileExports.default &&
          (!fileExports.wingsuit || !fileExports.wingsuit.patternDefinition)
        ) {
          throw new Error("No wingsuit export found");
        }

        const patternDefinition = fileExports.wingsuit
          ? fileExports.wingsuit.patternDefinition
          : fileExports;

        if (
          patternDefinition != null &&
          typeof patternDefinition === "object"
        ) {
          const { parameters } = patternDefinition;
          let { namespace } = patternDefinition;

          if (namespace == null) {
            const hierachy = key.split("/");
            if (hierachy.length > 2) {
              // eslint-disable-next-line prefer-destructuring
              namespace = hierachy[1];
              const namespaceParts = namespace.split("-");
              if (namespaceParts.length > 1 && namespaceParts[0].length === 2) {
                namespaceParts.shift();
                namespace = namespaceParts.join("-");
                namespace =
                  namespace.charAt(0).toUpperCase() + namespace.slice(1);
              }
            }
          }

          Object.keys(patternDefinition).forEach((pattern_key) => {
            if (parameters !== null) {
              patternDefinition[pattern_key].parameters = parameters;
            }
            if (patternDefinition[pattern_key].namespace == null) {
              patternDefinition[pattern_key].namespace = namespace;
            }
            this.addDefinition(pattern_key, patternDefinition[pattern_key]);
          });
        }
      } catch (e) {
        console.error("Loading failed.");
        console.error(e);
      }
    });
  }

  /**
   * Create the component storage from an array of require contexts.
   */
  createComponentStorageFromContext(
    contexts: __WebpackModuleApi.RequireContext[]
  ): void {
    contexts.forEach((context) => {
      context.keys().forEach((key) => {
        const formattedKey = key.replace(/\.(ts|tsx|js|jsx)$/, "");
        const pathAry = formattedKey.replace("./", "").split("/");
        const folderName = pathAry[0];
        let mappedNamespace = "";

        Object.keys(this.namespaces).forEach((namespace) => {
          const namespaceMap = this.namespaces[namespace].split("/");

          if (namespaceMap[namespaceMap.length - 1] === folderName) {
            mappedNamespace = namespace;
          }
        });
        pathAry.shift();

        const prefix = mappedNamespace.startsWith("@") ? "" : "@";
        const useVal = `${prefix}${mappedNamespace}/${pathAry.join("/")}`;
        const componentFile = context(key);
        if (componentFile.default) {
          this.addComponent(useVal, componentFile.default);
        }
      });
    });
  }

  /**
   * Add a pattern definition.
   */
  addDefinition(id: string, patternDefinition: IPatternDefinition) {
    this.definitions[id] = patternDefinition;
    delete this.patterns[id];
  }

  /**
   * Add multiple pattern definitions from a keyed object.
   */
  addDefinitions(definitions: IPatternDefinitions) {
    Object.keys(definitions).forEach((id) => {
      this.definitions[id] = definitions[id];
      delete this.patterns[id];
    });
  }
}
