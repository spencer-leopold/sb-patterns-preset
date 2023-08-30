import { Configuration } from 'webpack';
import { StoryIndexer } from '@storybook/types';
import { AddonPatternOptions } from 'sb-patterns';

interface EnvConfiguration extends Configuration {
    NAMESPACES: string;
}
declare function config(entry?: string[]): string[];
declare function env(config: Configuration, options: AddonPatternOptions): EnvConfiguration;
declare function webpack(config: Configuration, options: AddonPatternOptions): Configuration;
declare const storyIndexers: (indexers: StoryIndexer[] | null, options: AddonPatternOptions) => Promise<StoryIndexer[]>;

export { config, env, storyIndexers, webpack };
