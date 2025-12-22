import type { StorybookConfig } from '@storybook/react-webpack5';

import { dirname, resolve } from 'path';

import { fileURLToPath } from 'url';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    getAbsolutePath('@storybook/addon-webpack5-compiler-swc'),
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-docs'),
    getAbsolutePath('@storybook/addon-onboarding'),
  ],
  framework: getAbsolutePath('@storybook/react-webpack5'),
  webpackFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    config.resolve.alias['@'] = resolve(
      dirname(fileURLToPath(import.meta.url)),
      '../src'
    );
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    // Find the CSS rule and add postcss-loader
    const cssRule = config.module.rules.find(
      (rule) =>
        typeof rule === 'object' &&
        rule?.test &&
        rule.test.toString().includes('css')
    );
    if (cssRule && typeof cssRule === 'object' && 'use' in cssRule) {
      if (Array.isArray(cssRule.use)) {
        cssRule.use.push({
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              config: resolve(
                dirname(fileURLToPath(import.meta.url)),
                'postcss.config.js'
              ),
            },
          },
        });
      }
    }
    return config;
  },
};
export default config;
