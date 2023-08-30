import IRenderer from './IRenderer';
import { MultiValueTypes } from './Field';
import { Namespaces } from './definition';
import Pattern from './Pattern';
import PatternVariant from './PatternVariant';
import { ReactDefaultRenderer } from './ReactDefaultRenderer';
import { ReactElement } from 'react';
import { storage } from './index';

let rendererImpl: IRenderer = new ReactDefaultRenderer();
let namespacesImpl: Namespaces = {};

export function setRenderer(renderer: IRenderer) {
  rendererImpl = renderer;
}

export function setNamespaces(namespaces: Namespaces) {
  namespacesImpl = namespaces;
}

export function getNamespaces(): Namespaces {
  return namespacesImpl;
}

export function getRenderer(): IRenderer {
  return rendererImpl;
}

export function getPatternConfiguration(
  patternId: string,
  variantId: string = Pattern.DEFAULT_VARIANT_NAME,
  configuration: string
) {
  const variant: PatternVariant = storage.loadVariant(patternId, variantId);
  const config = variant.getConfiguration();
  return config[configuration] || '';
}

export function renderPatternPreview(
  patternId: string,
  variables: any = {},
  variantId: string = Pattern.DEFAULT_VARIANT_NAME,
  renderInfoContext: any = {}
): ReactElement<any, any> | null {
  let variant: PatternVariant;
  try {
    variant = storage.loadVariant(patternId, variantId);
  } catch (err) {
    console.error(err);
    return null;
  }

  const renderInfo = { ...variant.getRenderInfo(), ...renderInfoContext };
  const promisedPreview: any = {};
  const promisedPreviewNames: any[] = [];
  let i = 0;
  Object.keys(renderInfo).forEach((key: string) => {
    promisedPreview[i] = renderPatternPreview(
      renderInfo[key].patternId,
      renderInfo[key].variables,
      renderInfo[key].variant,
      renderInfo[key]?.children || {}
    );

    promisedPreviewNames[i] = key;
    i += 1;
  });

  const patternVariables = variant.getVariables();
  if (Object.keys(promisedPreview).length !== 0) {
    const previewRenderedVariables: any = {};
    Object.keys(promisedPreview).map((value: string) => {
      const index = +value;
      const promisedPreviewValue = promisedPreview[index];
      const nameKeys = promisedPreviewNames[index].split('--');
      // Handling multi value fields.
      // Multi value patterns uses key--i as field name.
      if (nameKeys.length === 1) {
        previewRenderedVariables[nameKeys[0]] = promisedPreviewValue;
      } else {
        const fieldName = nameKeys[0];
        const delta: number = Number.parseInt(nameKeys[1], 10);
        if (variant.getField(fieldName).multiValueType() === MultiValueTypes.items) {
          if (typeof previewRenderedVariables[nameKeys[0]] === 'undefined') {
            previewRenderedVariables[nameKeys[0]] = [];
          }
          previewRenderedVariables[nameKeys[0]][delta] = promisedPreviewValue;
        } else if (variant.getField(fieldName).multiValueType() === MultiValueTypes.field_items) {
          if (typeof previewRenderedVariables[nameKeys[0]] === 'undefined') {
            previewRenderedVariables[nameKeys[0]] = [];
          }
          previewRenderedVariables[nameKeys[0]][delta] = { content: promisedPreviewValue };
        } else if (variant.getField(fieldName).multiValueType() === MultiValueTypes.single_value) {
          if (typeof previewRenderedVariables[nameKeys[0]] === 'undefined') {
            previewRenderedVariables[nameKeys[0]] = [promisedPreviewValue];
          } else {
            previewRenderedVariables[nameKeys[0]].push(promisedPreviewValue);
          }
        } else {
          previewRenderedVariables[nameKeys[0]] = `No multi value type for field: '${variant
            .getPattern()
            .getId()}:${fieldName}:${variant.getField(fieldName).multiValueType()}'`;
        }
      }
    });
    const finalVariables: any = {
      ...patternVariables,
      ...buildBaseVariables(variables),
    };
    Object.keys(previewRenderedVariables).forEach((key) => {
      // Overwrite variables with rendered ones.
      if (finalVariables[key] !== null) {
        finalVariables[key] = previewRenderedVariables[key];
      }
    });
    return renderPattern(patternId, finalVariables, variantId);
  }

  return renderPattern(
    patternId,
    {
      ...patternVariables,
      ...buildBaseVariables(variables),
    },
    variantId
  );
}

function buildBaseVariables(variables: any) {
  let passedVariables = variables;
  if (variables instanceof Map) {
    const obj: Record<string, any> = {};
    variables.forEach((value, key) => {
      obj[key] = value;
    });
    passedVariables = obj;
  }
  return passedVariables;
}

export function renderPattern(
  patternId: string,
  variables: any = {},
  variantId: string = Pattern.DEFAULT_VARIANT_NAME
): ReactElement<any, any> | null {
  try {
    const variant: PatternVariant = storage.loadVariant(patternId, variantId);
    const patternVariables = variant.getVariables(false);
    const finalVariables = {
      ...patternVariables,
      ...buildBaseVariables(variables),
    };
    finalVariables.variant = variantId;
    variant.setRenderArgs(finalVariables);
    return rendererImpl.renderVariant(variant, finalVariables);
  } catch (err) {
    console.error(err);
    return null;
  }
}
