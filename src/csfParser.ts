import type { IndexedCSFFile, IndexedStory } from '@storybook/types';

import type { StaticMeta } from '@storybook/csf-tools';
import YAML from 'yaml';
import { storage, Namespaces } from 'sb-patterns';
import { toId } from '@storybook/csf';

export function csfParser(
  resourcePath: string,
  src: string,
  makeTitle: (input: string) => string,
  namespaces: Namespaces = {}
): IndexedCSFFile {
  const patternDefinition = YAML.parse(src);

  const patternIds = Object.keys(patternDefinition);
  const defaultPatternId = patternIds[0];
  if (!defaultPatternId) {
    throw new Error(`No patterns found in ${resourcePath}`);
  }
  const defaultPattern = patternDefinition[defaultPatternId];
  const defaultPatternLabel = defaultPattern.label ?? defaultPatternId;
  let defaultPatternNamespace = defaultPattern.namespace ?? '';

  let namespacePath = defaultPatternNamespace;
  if (defaultPatternNamespace === '') {
    Object.keys(namespaces).forEach((key) => {
      if (
        resourcePath.startsWith(namespaces[key]) &&
        namespaces[key].length > namespacePath.length
      ) {
        defaultPatternNamespace = key;
        namespacePath = namespaces[key];
      }
    });
  }

  const title = defaultPatternNamespace + '/' + defaultPatternLabel;
  const stories: IndexedStory[] = [];
  const meta: StaticMeta = {
    title: makeTitle(title),
    tags: ['autodocs'],
  };

  patternIds.forEach((patternId) => {
    const definition = patternDefinition[patternId];
    // Add definition to use in the storiesLoader.
    // This def might not be complete since it's coming from the YAML file,
    // but should be good enough to grab the code example, which is what we're
    // concerned with here.
    storage.addDefinition(patternId, definition);

    const variants = definition.variants ?? { __default: { label: 'Default' } };
    Object.keys(variants).forEach((variantName) => {
      const variantLabel = variants[variantName].label;
      const formattedVariantLabel = variantLabel.replace(/[^a-zA-Z0-9]/g, '_');

      const story: IndexedStory = {
        id: toId(title, patternId + '-' + formattedVariantLabel),
        name: variantLabel,
      };

      stories.push(story);
    });
  });

  return {
    meta,
    stories,
  };
}
