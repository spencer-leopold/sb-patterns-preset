import { ReactElement, ComponentType, FunctionComponent } from 'react';

interface IRenderer {
    renderVariant(variant: PatternVariant, variables: any): ReactElement<any, any> | null;
}

interface Faker {
    token: string;
    property: string;
    options?: AnyConfiguration;
}
interface AnyConfiguration {
    [key: string]: any;
}
interface OptionsConfiguration {
    configuration: AnyConfiguration;
    label: string;
}
interface Options {
    [key: string]: string;
}
interface OptionsWithConfiguration {
    [key: string]: OptionsConfiguration;
}
interface Preview {
    faker: Faker;
    fields: Preview;
    settings: Preview;
    id: string;
}
interface Properties {
    [key: string]: Property$1;
}
interface Property$1 {
    type: string;
    id?: string;
    label: string;
    default_value?: string;
    description?: string;
    preview?: string | Preview;
    required?: boolean;
    multi_value_type?: string;
    options?: Options | OptionsWithConfiguration;
    fields?: Property$1;
}
interface Variants {
    [key: string]: Variant;
}
interface Variant {
    use?: string;
    label: string;
    fields?: Property$1;
    settings?: Property$1;
    description?: string;
    configuration?: AnyConfiguration;
}
interface IPatternDefinition {
    label: string;
    id: string;
    icon_path?: string;
    namespace: string;
    parameters: AnyConfiguration;
    use: string;
    visible: string;
    description: string;
    fields: Properties;
    settings?: Properties;
    variants?: Variants;
    extends?: string[];
    configuration: AnyConfiguration;
    dependencies: string[];
}
interface IPatternDefinitions {
    [key: string]: IPatternDefinition;
}
interface Namespaces {
    [key: string]: string;
}
interface AddonPatternOptions {
    appPath?: string;
    storiesContexts?: string[];
    webpackAliases?: Namespaces;
}

declare function setRenderer(renderer: IRenderer): void;
declare function setNamespaces(namespaces: Namespaces): void;
declare function getNamespaces(): Namespaces;
declare function getRenderer(): IRenderer;
declare function getPatternConfiguration(patternId: string, variantId: string, configuration: string): any;
declare function renderPatternPreview(patternId: string, variables?: any, variantId?: string, renderInfoContext?: any): ReactElement<any, any> | null;
declare function renderPattern(patternId: string, variables?: any, variantId?: string): ReactElement<any, any> | null;

declare const BaseRenderEngine_getNamespaces: typeof getNamespaces;
declare const BaseRenderEngine_getPatternConfiguration: typeof getPatternConfiguration;
declare const BaseRenderEngine_getRenderer: typeof getRenderer;
declare const BaseRenderEngine_renderPattern: typeof renderPattern;
declare const BaseRenderEngine_renderPatternPreview: typeof renderPatternPreview;
declare const BaseRenderEngine_setNamespaces: typeof setNamespaces;
declare const BaseRenderEngine_setRenderer: typeof setRenderer;
declare namespace BaseRenderEngine {
  export {
    BaseRenderEngine_getNamespaces as getNamespaces,
    BaseRenderEngine_getPatternConfiguration as getPatternConfiguration,
    BaseRenderEngine_getRenderer as getRenderer,
    BaseRenderEngine_renderPattern as renderPattern,
    BaseRenderEngine_renderPatternPreview as renderPatternPreview,
    BaseRenderEngine_setNamespaces as setNamespaces,
    BaseRenderEngine_setRenderer as setRenderer,
  };
}

/**
 * Class representing a pattern definition property.
 */
declare class Property {
    /**
     * The property name.
     */
    private name;
    /**
     * The property type.
     */
    private type;
    /**
     * The property label.
     */
    private label;
    /**
     * The property description.
     */
    private description;
    /**
     * The property preview.
     */
    private preview;
    /**
     * Whether the property is enabled or not.
     */
    private enable;
    /**
     * Constructs a Property object.
     */
    constructor(name: string, type: string, label: string, description: string, preview: any);
    /**
     * Get the property description.
     */
    getDescription(): string;
    /**
     * Set the property description.
     */
    setDescription(value: string): void;
    /**
     * Get the property enable value.
     */
    isEnable(): boolean;
    /**
     * Set the property enable value.
     */
    setEnable(value: boolean): void;
    /**
     * Generate a fake value for the property preview.
     */
    private generateFake;
    /**
     * Clean a string.
     */
    private cleanString;
    /**
     * Get the property preview.
     */
    getPreview(): any;
    /**
     * Set the property preview.
     */
    setPreview(value: any | undefined): void;
    /**
     * Get the property label.
     */
    getLabel(): string;
    /**
     * Set the property label.
     */
    setLabel(value: string): void;
    /**
     * Get the property name.
     */
    getName(): string;
    /**
     * Set the property name.
     */
    setName(value: string): void;
    /**
     * Get the property type.
     */
    getType(): string;
    /**
     * Set the property type.
     */
    setType(value: string): void;
}

declare enum MultiValueTypes {
    items = "items",
    field_items = "field_items",
    single_value = "single_value"
}
declare class Field extends Property {
    private multiValue;
    multiValueType(): MultiValueTypes;
    setMultiValueType(multiValue: MultiValueTypes): void;
}

declare class Setting extends Property {
    private defaultValue;
    private required;
    private options;
    getOptions(): Options | OptionsWithConfiguration;
    setOptions(options: Options | OptionsWithConfiguration): void;
    getOptionKeyByLabel(label: string): string;
    getPreviewDisplayValue(): string;
    getDefaultValue(): string;
    setDefaultValue(defaultValue: string): void;
    isRequired(): boolean;
    setRequired(required: boolean): void;
}

declare class PatternVariant {
    private pattern;
    private id;
    private use;
    private variant;
    private renderArgs;
    private beforeRenderHandler;
    private label;
    private description;
    private configuration;
    private fields;
    private settings;
    private cleanStorybookString;
    constructor(id: string, pattern: Pattern, variant: string, use: string, label: string, description: string, configuration: any);
    getUse(): string;
    getCode(): string;
    getStoryId(): string;
    getId(): string;
    getStorage(): IPatternStorage;
    getLabel(): string;
    getDescription(): string;
    getPattern(): Pattern;
    setPattern(pattern: Pattern): void;
    getVariant(): string;
    setVariant(value: string): void;
    getFields(): Record<string, Field>;
    setConfiguration(configuration: any): void;
    getConfiguration(): any;
    addField(field: Field): void;
    getField(name: string): Field;
    setFields(fields: Record<string, Field>): void;
    getSettings(): Record<string, Setting>;
    setSettings(value: Record<string, Setting>): void;
    getSetting(name: string): Setting;
    addSetting(setting: Setting): void;
    private handleFieldItem;
    private handleSubPreviewPattern;
    private buildPreviewPattern;
    getRenderInfo(): Record<string, any>;
    setRenderArgs(args: any): void;
    getRenderArgs(): any;
    beforeRender(handler: any): void;
    getVariables(includeFields?: boolean, includeSettings?: boolean, includeVariant?: boolean): Record<string, any>;
}

declare class Pattern {
    static DEFAULT_VARIANT_NAME: string;
    private id;
    private label;
    private description;
    private iconPath;
    private namespace;
    private parameters;
    private use;
    private visible;
    private definition;
    private patternVariants;
    private defaultVariant;
    private storage;
    getComponent(): ComponentType;
    getUse(): string;
    getStoryName(): string;
    getLabel(): string;
    getIconPath(): string | undefined;
    setIconPath(iconPath: string): void;
    getNamespace(): string;
    setNamespace(namespace: string): void;
    getDescription(): string;
    getId(): string;
    getDefaultVariant(): PatternVariant;
    isVisible(app: string): boolean;
    constructor(id: string, definition: IPatternDefinition, storage: IPatternStorage);
    getPatternVariants(): Record<string, PatternVariant>;
    getVariant(id?: string): PatternVariant;
    getParameters(): any;
    getStorage(): IPatternStorage;
    private initializeVariants;
}

interface IPatternStorage {
    loadPattern(patternId: string): Pattern;
    loadVariant(patternId: string, variantId: string): PatternVariant;
    createDefinitions(definition: any): void;
    addDefinition(id: string, pattern: IPatternDefinition): void;
    getPatternIds(): string[];
    getComponent(useVal: string): ComponentType;
}

/**
 * Class for storing patterns and their respective components.
 */
declare class PatternStorage implements IPatternStorage {
    /**
     * The components that have been registered.
     */
    private components;
    /**
     * The namespaces that have been registered.
     */
    private namespaces;
    /**
     * The patterns that have been registered.
     */
    private patterns;
    /**
     * The pattern definitions that have been registered.
     */
    definitions: IPatternDefinitions;
    /**
     * The current pattern storage instance.
     */
    static instance: PatternStorage;
    /**
     * Get current or new instance of pattern storage.
     */
    static getInstance(): PatternStorage;
    /**
     * Add a component to the storage.
     */
    addComponent(useVal: string, component: ComponentType): void;
    /**
     * Get a component from the storage.
     */
    getComponent(useVal: string): ComponentType;
    /**
     * Set the storage namespaces.
     */
    setNamespaces(namespaces: Namespaces): void;
    /**
     * Get the storage namespaces.
     */
    getNamespaces(): Namespaces;
    /**
     * Get array of pattern ids.
     */
    getPatternIds(): string[];
    /**
     * Extend pattern definition.
     *
     * This checks if the yaml definition has an extends property and if so
     * it will extend the definition with the specified pattern definition.
     */
    private extendPatternDefinition;
    /**
     * Load a pattern.
     *
     * This will load from storage and create it from the definiton if it doesn't
     * exist.
     */
    loadPattern(patternId: string): Pattern;
    /**
     * Load a pattern variant.
     */
    loadVariant(patternId: string, variantId: string): PatternVariant;
    /**
     * Create a pattern definition.
     */
    createDefinitions(definitions: IPatternDefinitions): void;
    /**
     * Create a pattern definition from an array of require contexts.
     */
    createDefinitionsFromMultiContext(contexts: __WebpackModuleApi.RequireContext[]): void;
    /**
     * Create a pattern definition from a require context.
     */
    createDefinitionsFromContext(context: __WebpackModuleApi.RequireContext): void;
    /**
     * Create the component storage from an array of require contexts.
     */
    createComponentStorageFromContext(contexts: __WebpackModuleApi.RequireContext[]): void;
    /**
     * Add a pattern definition.
     */
    addDefinition(id: string, patternDefinition: IPatternDefinition): void;
    /**
     * Add multiple pattern definitions from a keyed object.
     */
    addDefinitions(definitions: IPatternDefinitions): void;
}

type Props = {
    patternId?: string;
    variantId?: string;
    variant?: PatternVariant;
};
declare const PatternPreview: FunctionComponent<Props>;

declare const storage: PatternStorage;
declare const renderer: typeof BaseRenderEngine;
declare function getStorage(): IPatternStorage;
declare function argTypes(patternId: string, variantId: string): any;
declare function args(defaultArgs: any, patternId: string, variantId: string): any;

export { AddonPatternOptions, IPatternStorage, IRenderer, Pattern, PatternPreview, PatternVariant, argTypes, args, getStorage, renderer, storage };
