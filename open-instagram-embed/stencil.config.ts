import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'open-instagram-embed',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
      autoDefineCustomElements: true, 
      "externalRuntime":false,
      "minify":true,
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
};
