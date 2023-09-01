import { Configuration } from 'webpack';
import { StoryIndexer } from '@storybook/types';
import { AddonPatternOptions } from '@cmbr/sb-patterns';

interface EnvConfiguration extends Configuration {
    NAMESPACES: string;
}
declare function env(config: Configuration, options: AddonPatternOptions): EnvConfiguration;
declare function webpack(config: Configuration, options: AddonPatternOptions): Configuration;
declare const storyIndexers: (indexers: StoryIndexer[] | null, options: AddonPatternOptions) => Promise<StoryIndexer[]>;

export { env, storyIndexers, webpack };
