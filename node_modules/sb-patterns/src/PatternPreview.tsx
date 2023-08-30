import * as BaseRenderEngine from './baseRenderEngine';

import { FunctionComponent } from 'react';
import PatternVariant from './PatternVariant';

type Props = {
  patternId?: string;
  variantId?: string;
  variant?: PatternVariant;
};

const renderer = BaseRenderEngine;

const PatternPreview: FunctionComponent<Props> = ({
  patternId,
  variantId,
  variant,
  ...variables
}) => {
  const finalPatternId = typeof variant !== 'undefined' ? variant?.getPattern().getId() : patternId;
  const finalVariantId = typeof variant !== 'undefined' ? variant?.getId() : variantId;

  if (!finalPatternId) {
    return null;
  }

  return renderer.renderPatternPreview(finalPatternId, variables, finalVariantId);
};

PatternPreview.displayName = 'PatternPreview';

PatternPreview.defaultProps = {
  patternId: '',
  variantId: '',
  variant: undefined,
};

export default PatternPreview;
