import React, { ReactElement } from 'react';

import IRenderer from './IRenderer';
import PatternVariant from './PatternVariant';

/**
 * React default renderer.
 *
 * Overwrite the renderer inside the baseRenderEngine.
 * Use renderer.setRenderer(new CustomRenderer)
 * if you need a differnt render logic.
 */
export class ReactDefaultRenderer implements IRenderer {
  renderVariant(variant: PatternVariant, variables: any): ReactElement<any, any> | null {
    if (!variant) {
      return <>Error while render variant. Variant is null.</>;
    }

    if (!variant.getPattern()) {
      return <>`Error while render variant. Pattern is null. [ID: ${variant.getId()}]`</>;
    }

    if (!variant.getPattern().getComponent()) {
      return (
        <>
          `Error while rendering variant. Component not linked to pattern [ID: $
          {variant.getPattern().getId()}, PATH: ${variant.getPattern().getUse()}]`
        </>
      );
    }

    const Component = variant.getPattern().getComponent();
    return <Component {...variables} />;
  }
}
