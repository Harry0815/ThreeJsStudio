const { composePlugins, withNx } = require('@nx/webpack');

// Nx plugins for webpack.
module.exports = composePlugins(
  withNx({
    target: 'node',
  }),
  (config) => {
    // Update the webpack config as needed here.
    // e.g. `config.plugins.push(new MyPlugin())`
    return config;
  },
);

/**
 const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
 const { join } = require('path');

 module.exports = {
 output: {
 path: join(__dirname, '../../dist/apps/studio-service'),
 },
 plugins: [
 new NxAppWebpackPlugin({
 target: 'node',
 compiler: 'tsc',
 main: './src/main.ts',
 tsConfig: './tsconfig.app.json',
 assets: ['./src/assets'],
 optimization: false,
 outputHashing: 'none',
 generatePackageJson: true,
 }),
 ],
 };
 */
