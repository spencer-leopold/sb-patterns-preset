import { randFullName, randLine, randParagraph, randSentence, randWord, seed } from '@ngneat/falso';

import { Faker } from './definition';
import parse from 'html-react-parser';

/**
 * Class representing a pattern definition property.
 */
export default class Property {
  /**
   * The property name.
   */
  private name: string;

  /**
   * The property type.
   */
  private type: string;

  /**
   * The property label.
   */
  private label: string;

  /**
   * The property description.
   */
  private description: string;

  /**
   * The property preview.
   */
  private preview: any;

  /**
   * Whether the property is enabled or not.
   */
  private enable = true;

  /**
   * Constructs a Property object.
   */
  constructor(name: string, type: string, label: string, description: string, preview: any) {
    this.name = name;
    this.type = type;
    this.label = label;
    this.description = description;
    this.preview = preview;
  }

  /**
   * Get the property description.
   */
  public getDescription(): string {
    return typeof this.description === 'undefined' ? '' : this.description;
  }

  /**
   * Set the property description.
   */
  public setDescription(value: string) {
    this.description = value;
  }

  /**
   * Get the property enable value.
   */
  public isEnable(): boolean {
    return this.enable;
  }

  /**
   * Set the property enable value.
   */
  public setEnable(value: boolean) {
    this.enable = value;
  }

  /**
   * Generate a fake value for the property preview.
   */
  private generateFake(_preview: Faker | string): string {
    let token = 'lorem.word';
    let fakeOptions = {};

    if (typeof _preview === 'string') {
      token = _preview;
    } else {
      if (_preview.token == null && _preview.property != null) {
        token = _preview.property;
      }
      if (_preview.token != null) {
        token = _preview.token;
      }
      fakeOptions = _preview.options ?? {};
    }

    try {
      if (process.env.STORYBOOK_PATTERN_FAKER_SEED != null) {
        if (!Number.isNaN(process.env.STORYBOOK_PATTERN_FAKER_SEED)) {
          seed(process.env.STORYBOOK_PATTERN_FAKER_SEED);
        } else {
          console.error('STORYBOOK_PATTERN_FAKER_SEED must be numeric');
        }
      }

      const tokens: Record<string, any> = {
        'lorem.fullName': randFullName,
        'lorem.word': randWord,
        'lorem.sentence': randSentence,
        'lorem.paragraph': randParagraph,
        'lorem.paragraphs': randParagraph,
        'lorem.line': randLine,
      };

      if (!tokens[token]) {
        return `Invalid faker token: ${token}. Valid tokens are: ${Object.keys(tokens).join(', ')}`;
      }

      const result = tokens[token](fakeOptions);
      return Array.isArray(result) ? result.join(' ') : result;
    } catch (e) {
      if (e instanceof Error) {
        return `Invalid faker configuration "${token}". ${e.message}`;
      }
      return '';
    }
  }

  /**
   * Clean a string.
   */
  private cleanString(input: string) {
    let output = '';
    for (let i = 0; i < input.length; i += 1) {
      if (
        input.charCodeAt(i) <= 127 ||
        (input.charCodeAt(i) >= 160 && input.charCodeAt(i) <= 255)
      ) {
        output += input.charAt(i);
      }
    }

    return output;
  }

  /**
   * Get the property preview.
   */
  public getPreview(): any {
    if (typeof this.preview === 'object') {
      if (this.preview?.faker) {
        return this.generateFake(this.preview.faker);
      }

      if (this.type === 'pattern' || this.type === 'object' || this.type === 'media_library') {
        // Convert string html into jsx.
        if (Array.isArray(this.preview)) {
          this.preview = this.preview.map((preview) => {
            if (typeof preview === 'string') {
              return parse(this.cleanString(preview));
            }
            return preview;
          });
        }
        return this.preview;
      }

      return JSON.stringify(this.preview);
    }

    let value = this.preview;
    if (typeof value === 'string') {
      value = parse(this.cleanString(value));
    }
    return value;
  }

  /**
   * Set the property preview.
   */
  public setPreview(value: any | undefined) {
    this.preview = value;
  }

  /**
   * Get the property label.
   */
  public getLabel(): string {
    return this.label;
  }

  /**
   * Set the property label.
   */
  public setLabel(value: string) {
    this.label = value;
  }

  /**
   * Get the property name.
   */
  public getName(): string {
    return this.name;
  }

  /**
   * Set the property name.
   */
  public setName(value: string) {
    this.name = value;
  }

  /**
   * Get the property type.
   */
  public getType(): string {
    return this.type;
  }

  /**
   * Set the property type.
   */
  public setType(value: string) {
    this.type = value;
  }
}
