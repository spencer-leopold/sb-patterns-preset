import { ComponentType } from 'react';
import { IPatternDefinition } from './definition';
import Pattern from './Pattern';
import PatternVariant from './PatternVariant';

export default interface IPatternStorage {
  loadPattern(patternId: string): Pattern;
  loadVariant(patternId: string, variantId: string): PatternVariant;
  createDefinitions(definition: any): void;
  addDefinition(id: string, pattern: IPatternDefinition): void;
  getPatternIds(): string[];
  getComponent(useVal: string): ComponentType;
}
