/* Adapted from Stage0 - The MIT License - Pavel Martynov */
/* Adapted from DOM Expressions - The MIT License - Ryan Carniato */
import { longestPositiveIncreasingSubsequence } from './utils.js';

export default function each(items, createFn) {
  function init(wrap, sample, parent) {
    wrap((renderedValues = []) => {
      const data = items() || [];
      return sample(() => reconcile(parent, renderedValues, data, createFn));
    });
  }

  init.flow = true;
  return init;
}

// This is almost straightforward implementation of reconcillation algorithm
// based on ivi documentation:
// https://github.com/localvoid/ivi/blob/2c81ead934b9128e092cc2a5ef2d3cabc73cb5dd/packages/ivi/src/vdom/implementation.ts#L1366
// With some fast paths from Surplus implementation:
// https://github.com/adamhaile/surplus/blob/master/src/runtime/content.ts#L86
// And working with data directly from Stage0:
// https://github.com/Freak613/stage0/blob/master/reconcile.js
// This implementation is tailored for fine grained change detection and adds support for fragments
export function reconcile(
  parent,
  renderedValues,
  data,
  createFn,
  noOp,
  beforeNode,
  afterNode
) {


}
