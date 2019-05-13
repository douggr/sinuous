import path from 'path';
import * as R from 'ramda';
import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import bundleSize from 'rollup-plugin-size';
import gzip from 'rollup-plugin-gzip';
import minimist from 'minimist';

import { ESM, UMD, bundles, fixtures } from '../bundles.js';

const formatOptions = {
  [ESM]: { ext: '.mjs' },
  [UMD]: { ext: '.js' }
};

const argv = minimist(process.argv.slice(2));

const requestedBundleTypes = (argv.type || '')
  .split(',')
  .map(type => type.toUpperCase());
const requestedBundleNames = (argv.name || '').split(',');

let bs = argv.fixtures ? fixtures : bundles;
bs = argv.all ? bundles.concat(fixtures) : bs;

// For every type in bundle.types creates a new bundle obj.
const unbundle = ({ formats, ...rest }) =>
  formats.map(format => ({ ...rest, format }));
const allBundles = R.chain(unbundle, bs).filter(
  ({ name, format }) => !shouldSkipBundle(name, format)
);

function shouldSkipBundle(bundleName, bundleType) {
  if (requestedBundleTypes.length > 0) {
    const isAskingForDifferentType = requestedBundleTypes.every(
      requestedType => bundleType.indexOf(requestedType) === -1
    );
    if (isAskingForDifferentType) {
      return true;
    }
  }
  if (requestedBundleNames.length > 0) {
    const isAskingForDifferentNames = requestedBundleNames.every(
      requestedName => bundleName.indexOf(requestedName) === -1
    );
    if (isAskingForDifferentNames) {
      return true;
    }
  }
  return false;
}

function getConfig({ name, global, input, dest, format, external, sourcemap }) {
  return {
    input,
    external,
    watch: {
      clearScreen: false
    },
    output: {
      format,
      sourcemap,
      file: dest
        ? `${dest}/${name}${formatOptions[format].ext}`
        : path.join(
            path.dirname(input),
            '..',
            `dist/${name}${formatOptions[format].ext}`
          ),
      name: global,
      exports: 'named'
    },
    plugins: [
      bundleSize(),
      nodeResolve({ mainFields: ['module'] }),
      commonjs(),
      format === UMD && babel(),
      format === UMD &&
        terser({
          warnings: true,
          mangle: {
            properties: {
              regex: /^_/
            }
          },
          nameCache: {
            props: {
              cname: 6,
              props: {
                $_listeners: '__l',
                $_observables: '__o',
                $_children: '__c',
                $_update: '__u'
              }
            }
          }
        }),
      sourcemap && gzip()
    ].filter(Boolean),
    onwarn: function(warning) {
      // https://github.com/rollup/rollup/wiki/Troubleshooting#this-is-undefined
      if (
        ['THIS_IS_UNDEFINED', 'UNKNOWN_OPTION', 'MISSING_GLOBAL_NAME'].includes(
          warning.code
        )
      )
        return;

      console.error(warning.message);
    }
  };
}

export default allBundles.map(getConfig);
