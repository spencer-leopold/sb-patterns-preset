import { PatternVariant } from './index';
import { ReactElement } from 'react';

export default interface IRenderer {
  renderVariant(variant: PatternVariant, variables: any): ReactElement<any, any> | null;
}
