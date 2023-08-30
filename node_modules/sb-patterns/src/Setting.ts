import { Options, OptionsWithConfiguration } from './definition';

import Property from './Property';

export default class Setting extends Property {
  private defaultValue = '';

  private required = false;

  private options: Options | OptionsWithConfiguration = {};

  public getOptions(): Options | OptionsWithConfiguration {
    return this.options;
  }

  public setOptions(options: Options | OptionsWithConfiguration) {
    this.options = options;
  }

  public getOptionKeyByLabel(label: string): string {
    let optionKey = '';
    Object.keys(this.options).forEach((key) => {
      if (this.options[key] === label) {
        optionKey = key;
      }
    });
    return optionKey;
  }

  public getPreviewDisplayValue(): string {
    if (this.getType() === 'select' && this.getPreview()) {
      const preview = this.options[this.getPreview()];
      if (typeof preview === 'string') {
        return preview;
      }
    }
    return this.getPreview();
  }

  public getDefaultValue() {
    return this.defaultValue;
  }

  public setDefaultValue(defaultValue: string) {
    this.defaultValue = defaultValue;
  }

  public isRequired(): boolean {
    return this.required;
  }

  public setRequired(required: boolean) {
    this.required = required;
  }
}
