import Field from './Field';
import IPatternStorage from './IPatternStorage';
import Pattern from './Pattern';
import Setting from './Setting';
import dedent from 'ts-dedent';

export default class PatternVariant {
  private pattern: Pattern;

  private id: string;

  private use: string;

  private variant: string;

  private renderArgs: any = {};

  private beforeRenderHandler: any;

  private label: string;

  private description: string;

  private configuration: any;

  private fields: Record<string, Field> = {};

  private settings: Record<string, Setting> = {};

  private cleanStorybookString(string: string) {
    return string.toLowerCase().replace(/ /g, '-').replace(/\//g, '-');
  }

  constructor(
    id: string,
    pattern: Pattern,
    variant: string,
    use: string,
    label: string,
    description: string,
    configuration: any
  ) {
    this.id = id;
    this.pattern = pattern;
    this.variant = variant;
    this.label = label;
    this.use = use;
    this.description = description;
    this.configuration = configuration;
  }

  public getUse(): string {
    if (!this.use) {
      return this.getPattern().getUse();
    }
    return this.use;
  }

  public getCode() {
    const variables: any = { variant: '' };
    const settings = this.getSettings();

    if (this.getId() !== '__default') {
      variables.variant = this.getId();
    } else {
      delete variables.variant;
    }

    Object.keys(settings).forEach((key: string) => {
      const setting = settings[key];
      if (setting.getType() !== 'media_library' && setting.isEnable()) {
        variables[key] = setting.getPreview();
      }
    });

    const withBlock =
      Object.keys(variables).length === 0 ? '' : `with ${JSON.stringify(variables, null, 2)}`;
    delete variables.variant;
    const argsBlock =
      Object.keys(variables).length === 0 ? "''" : `${JSON.stringify(variables, null, 2)}`;
    const blocks = [
      {
        title: 'Pattern function (recommended)',
        code: dedent`
          import { pattern } from 'sb-patterns';
          ...
          return (
            <>
              {pattern('${this.getPattern().getId()}', ${argsBlock}, '${this.getId()}')}
            </>
          );
          ...
        `,
      },
      {
        title: 'As a component',
        code: dedent`
          import { ComponentName } from 'sb-patterns';
          TODO: Finish documenting this.
          ...
          return (
            <>
              <ComponentName ${withBlock} />
            </>
          );
          ...
        `,
      },
    ];
    const generatedCode: string[] = [];
    Object.entries(blocks).forEach(([_key, value]) => {
      return generatedCode.push(dedent`
       /**
        * ${value.title}:
        */
        ${value.code}
      `);
    });
    return generatedCode.join('\n\n');
  }

  public getStoryId(): string {
    const pattern = this.getPattern();
    return this.cleanStorybookString(
      `${pattern.getNamespace()}-${pattern.getLabel()}--${this.getLabel()}`
    );
  }

  public getId(): string {
    return this.id;
  }

  public getStorage(): IPatternStorage {
    return this.pattern.getStorage();
  }

  public getLabel(): string {
    return this.label;
  }

  public getDescription(): string {
    return this.description;
  }

  public getPattern(): Pattern {
    return this.pattern;
  }

  public setPattern(pattern: Pattern) {
    this.pattern = pattern;
  }

  public getVariant(): string {
    return this.variant;
  }

  public setVariant(value: string) {
    this.variant = value;
  }

  public getFields(): Record<string, Field> {
    return this.fields;
  }

  public setConfiguration(configuration: any) {
    this.configuration = configuration;
  }

  public getConfiguration(): any {
    return this.configuration;
  }

  public addField(field: Field) {
    this.fields[field.getName()] = field;
  }

  public getField(name: string): Field {
    return this.fields[name];
  }

  public setFields(fields: Record<string, Field>) {
    this.fields = fields;
  }

  public getSettings(): Record<string, Setting> {
    return this.settings;
  }

  public setSettings(value: Record<string, Setting>) {
    this.settings = value;
  }

  public getSetting(name: string): Setting {
    return this.settings[name];
  }

  public addSetting(setting: Setting) {
    this.settings[setting.getName()] = setting;
  }

  private handleFieldItem(fieldItem: any) {
    const variant = fieldItem.variant !== null ? fieldItem.variant : null;
    const fields = fieldItem.fields != null ? fieldItem.fields : {};
    const settings = fieldItem.settings != null ? fieldItem.settings : {};
    const objects = Object.assign(fields, settings);
    return {
      patternId: fieldItem.id,
      variant,
      fields,
      settings,
      variables: objects,
    };
  }

  private handleSubPreviewPattern(preview: any, parentVariables: any) {
    if (preview.fields !== undefined) {
      Object.keys(preview.fields).forEach((key) => {
        const field = preview.fields[key];
        if (field != null && field.id !== undefined) {
          if (parentVariables.children === undefined) {
            parentVariables.children = {};
          }
          parentVariables.children[key] = this.handleFieldItem(field);
          this.handleSubPreviewPattern(field, parentVariables.children[key]);
        } else if (Array.isArray(field)) {
          let i = 0;
          if (parentVariables.children === undefined) {
            parentVariables.children = {};
          }
          field.forEach((item) => {
            if (item.id !== undefined) {
              parentVariables.children[`${key}--${i}`] = this.handleFieldItem(item);
              this.handleSubPreviewPattern(item, parentVariables.children[`${key}--${i}`]);
              i += 1;
            }
          });
        }
      });
    }
  }

  private buildPreviewPattern(preview: any) {
    const rootVariables = this.handleFieldItem(preview);
    this.handleSubPreviewPattern(preview, rootVariables);
    return rootVariables;
  }

  public getRenderInfo() {
    const previewPatterns: Record<string, any> = {};
    Object.keys(this.fields).forEach((key) => {
      const field: Field = this.fields[key];
      const preview = field.getPreview();
      if (field.getType() === 'pattern' && Array.isArray(preview)) {
        for (let i = 0; i < preview.length; i += 1) {
          previewPatterns[`${key}--${i}`] = this.buildPreviewPattern(preview[i]);
        }
      } else if (field.getType() === 'pattern' && preview?.id) {
        previewPatterns[key] = this.buildPreviewPattern(preview);
      }
    });
    Object.keys(this.settings).forEach((key) => {
      const setting: Setting = this.settings[key];
      const preview = setting.getPreview();
      if (setting.getType() === 'media_library' && preview?.id) {
        previewPatterns[key] = this.buildPreviewPattern(preview);
      }
    });
    return previewPatterns;
  }

  public setRenderArgs(args: any) {
    this.renderArgs = args;
    if (this.beforeRenderHandler != null) {
      this.beforeRenderHandler(args);
    }
  }

  public getRenderArgs() {
    return this.renderArgs;
  }

  public beforeRender(handler: any) {
    this.beforeRenderHandler = handler;
  }

  public getVariables(includeFields = true, includeSettings = true, includeVariant = true) {
    const values: Record<string, any> = {
      variant: undefined,
    };
    if (this.variant !== Pattern.DEFAULT_VARIANT_NAME && includeVariant) {
      values.variant = this.variant;
    }
    if (includeFields) {
      Object.keys(this.fields).forEach((key) => {
        const field: Field = this.fields[key];
        if (field !== null && field.getType() !== 'pattern') {
          values[key] = field.getPreview();
        }
      });
    }

    if (includeSettings) {
      Object.keys(this.settings).forEach((key) => {
        if (this.settings[key].getType() !== 'media_library') {
          values[key] = this.settings[key].getPreview();
        }
      });
    }
    return values;
  }
}
