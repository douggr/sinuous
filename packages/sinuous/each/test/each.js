import test from 'tape';
import sinuous from 'sinuous';
import each from 'sinuous/each';
import o, * as api from 'sinuous/observable';
const h = sinuous(api);

(function() {
  // Testing an only child each control flow
  let div;
  const n1 = 'a',
    n2 = 'b',
    n3 = 'c',
    n4 = 'd';
  const list = o([n1, n2, n3, n4]);
  const Component = () =>
    h('div', { ref: el => (div = el) }, each(list, item => item));

  function apply(t, array) {
    list(array);
    t.equal(div.innerHTML, array.join(''));
    list([n1, n2, n3, n4]);
    t.equal(div.innerHTML, 'abcd');
  }

  test('Create each control flow', t => {
    Component();

    t.equal(div.innerHTML, 'abcd');
    t.end();
  });

  test('1 missing', (t) => {
    apply(t, [    n2, n3, n4]);
    apply(t, [n1,     n3, n4]);
    apply(t, [n1, n2,     n4]);
    apply(t, [n1, n2, n3    ]);
    t.end();
  });

  test('2 missing', (t) => {
    apply(t, [        n3, n4]);
    apply(t, [    n2,     n4]);
    apply(t, [    n2, n3    ]);
    apply(t, [n1,         n4]);
    apply(t, [n1,     n3    ]);
    apply(t, [n1, n2,       ]);
    t.end();
  });

  test('3 missing', (t) => {
    apply(t, [n1            ]);
    apply(t, [    n2        ]);
    apply(t, [        n3    ]);
    apply(t, [            n4]);
    t.end();
  });

  test('all missing', (t) => {
    apply(t, [              ]);
    t.end();
  });

  test('swaps', (t) => {
    apply(t, [n2, n1, n3, n4]);
    apply(t, [n3, n2, n1, n4]);
    apply(t, [n4, n2, n3, n1]);
    t.end();
  });

  test('rotations', (t) => {
    apply(t, [n2, n3, n4, n1]);
    apply(t, [n3, n4, n1, n2]);
    apply(t, [n4, n1, n2, n3]);
    t.end();
  });

  test('reversal', (t) => {
    apply(t, [n4, n3, n2, n1]);
    t.end();
  });

  test('full replace', (t) => {
    apply(t, ['e', 'f', 'g', 'h']);
    t.end();
  });

  test('dispose', (t) => {
    h.cleanUp();
    t.end();
  });
})();

(function() {
  // Testing an multi child each control flow
  const div = document.createElement('div');
  const n1 = 'a',
    n2 = 'b',
    n3 = 'c',
    n4 = 'd';
  const list = o([n1, n2, n3, n4]);
  const Component = () => each(list, item => item)(h);

  function apply(t, array) {
    list(array);
    t.equal(div.innerHTML, array.join(''));
    list([n1, n2, n3, n4]);
    t.equal(div.innerHTML, 'abcd');
  }

  test('Create each control flow', (t) => {
    const comp = Component();
    console.log(comp);
    div.appendChild(comp);
    t.equal(div.innerHTML, 'abcd');
    t.end();
  });

  test('1 missing', (t) => {
    apply(t, [    n2, n3, n4]);
    apply(t, [n1,     n3, n4]);
    apply(t, [n1, n2,     n4]);
    apply(t, [n1, n2, n3    ]);
    t.end();
  });

  test('2 missing', (t) => {
    apply(t, [        n3, n4]);
    apply(t, [    n2,     n4]);
    apply(t, [    n2, n3    ]);
    apply(t, [n1,         n4]);
    apply(t, [n1,     n3    ]);
    apply(t, [n1, n2,       ]);
    t.end();
  });

  test('3 missing', (t) => {
    apply(t, [n1            ]);
    apply(t, [    n2        ]);
    apply(t, [        n3    ]);
    apply(t, [            n4]);
    t.end();
  });

  test('all missing', (t) => {
    apply(t, [              ]);
    t.end();
  });

  test('swaps', (t) => {
    apply(t, [n2, n1, n3, n4]);
    apply(t, [n3, n2, n1, n4]);
    apply(t, [n4, n2, n3, n1]);
    t.end();
  });

  test('rotations', (t) => {
    apply(t, [n2, n3, n4, n1]);
    apply(t, [n3, n4, n1, n2]);
    apply(t, [n4, n1, n2, n3]);
    t.end();
  });

  test('reversal', (t) => {
    apply(t, [n4, n3, n2, n1]);
    t.end();
  });

  test('full replace', (t) => {
    apply(t, ['e', 'f', 'g', 'h']);
    t.end();
  });

  test('dispose', (t) => {
    h.cleanUp();
    t.end();
  });
})();

// describe('Testing an only child each control flow with fragment children', () => {
//   let div, disposer;
//   const n1 = 'a',
//     n2 = 'b',
//     n3 = 'c',
//     n4 = 'd';
//   const list = S.data([n1, n2, n3, n4]);
//   const Component = () =>
//     <div ref={div}><$ each={list()}>{ item => <>{item}{item}</>}</$></div>

//   function apply(t, array) {
//     list(array);
//     expect(div.innerHTML).toBe(array.map(p => `${p}<!--6-->${p}<!--7-->`).join(''));
//     list([n1, n2, n3, n4])
//     expect(div.innerHTML).toBe('a<!--6-->a<!--7-->b<!--6-->b<!--7-->c<!--6-->c<!--7-->d<!--6-->d<!--7-->');
//   }

//   test('Create each control flow', () => {
//     S.root(dispose => {
//       disposer = dispose;
//       <Component />
//     });

//     expect(div.innerHTML).toBe('a<!--6-->a<!--7-->b<!--6-->b<!--7-->c<!--6-->c<!--7-->d<!--6-->d<!--7-->');
//   });

//   test('1 missing', () => {
//     apply(t, [    n2, n3, n4]);
//     apply(t, [n1,     n3, n4]);
//     apply(t, [n1, n2,     n4]);
//     apply(t, [n1, n2, n3    ]);
//   });

//   test('2 missing', () => {
//     apply(t, [        n3, n4]);
//     apply(t, [    n2,     n4]);
//     apply(t, [    n2, n3    ]);
//     apply(t, [n1,         n4]);
//     apply(t, [n1,     n3    ]);
//     apply(t, [n1, n2,       ]);
//   });

//   test('3 missing', () => {
//     apply(t, [n1            ]);
//     apply(t, [    n2        ]);
//     apply(t, [        n3    ]);
//     apply(t, [            n4]);
//   });

//   test('all missing', () => {
//     apply(t, [              ]);
//   });

//   test('swaps', () => {
//     apply(t, [n2, n1, n3, n4]);
//     apply(t, [n3, n2, n1, n4]);
//     apply(t, [n4, n2, n3, n1]);
//   });

//   test('rotations', () => {
//     apply(t, [n2, n3, n4, n1]);
//     apply(t, [n3, n4, n1, n2]);
//     apply(t, [n4, n1, n2, n3]);
//   });

//   test('reversal', () => {
//     apply(t, [n4, n3, n2, n1]);
//   });

//   test('full replace', () => {
//     apply(t, ['e', 'f', 'g', 'h']);
//   });

//   test('dispose', () => disposer());
// });

// describe('Testing an only child each control flow with array children', () => {
//   let div, disposer;
//   const n1 = 'a',
//     n2 = 'b',
//     n3 = 'c',
//     n4 = 'd';
//   const list = S.data([n1, n2, n3, n4]);
//   const Component = () =>
//     <div ref={div}><$ each={list()}>{ item => [item, item] }</$></div>

//   function apply(t, array) {
//     list(array);
//     expect(div.innerHTML).toBe(array.map(p => `${p}${p}`).join(''));
//     list([n1, n2, n3, n4])
//     expect(div.innerHTML).toBe('aabbccdd');
//   }

//   test('Create each control flow', () => {
//     S.root(dispose => {
//       disposer = dispose;
//       <Component />
//     });

//     expect(div.innerHTML).toBe('aabbccdd');
//   });

//   test('1 missing', () => {
//     apply(t, [    n2, n3, n4]);
//     apply(t, [n1,     n3, n4]);
//     apply(t, [n1, n2,     n4]);
//     apply(t, [n1, n2, n3    ]);
//   });

//   test('2 missing', () => {
//     apply(t, [        n3, n4]);
//     apply(t, [    n2,     n4]);
//     apply(t, [    n2, n3    ]);
//     apply(t, [n1,         n4]);
//     apply(t, [n1,     n3    ]);
//     apply(t, [n1, n2,       ]);
//   });

//   test('3 missing', () => {
//     apply(t, [n1            ]);
//     apply(t, [    n2        ]);
//     apply(t, [        n3    ]);
//     apply(t, [            n4]);
//   });

//   test('all missing', () => {
//     apply(t, [              ]);
//   });

//   test('swaps', () => {
//     apply(t, [n2, n1, n3, n4]);
//     apply(t, [n3, n2, n1, n4]);
//     apply(t, [n4, n2, n3, n1]);
//   });

//   test('rotations', () => {
//     apply(t, [n2, n3, n4, n1]);
//     apply(t, [n3, n4, n1, n2]);
//     apply(t, [n4, n1, n2, n3]);
//   });

//   test('reversal', () => {
//     apply(t, [n4, n3, n2, n1]);
//   });

//   test('full replace', () => {
//     apply(t, ['e', 'f', 'g', 'h']);
//   });

//   test('dispose', () => disposer());
// });

// describe('Testing each control flow with fallback', () => {
//   let div, disposer;
//   const n1 = 'a',
//     n2 = 'b',
//     n3 = 'c',
//     n4 = 'd';
//   const list = S.data([]);
//   const Component = () =>
//     <div ref={div}><$ each={list()} fallback={'Empty'}>{ item => item}</$></div>

//   test('Create each control flow', () => {
//     S.root(dispose => {
//       disposer = dispose;
//       <Component />
//     });
//     expect(div.innerHTML).toBe('Empty');
//     list([n1, n2, n3, n4])
//     expect(div.innerHTML).toBe('abcd');
//     list([])
//     expect(div.innerHTML).toBe('Empty');
//   });

//   test('dispose', () => disposer());
// });
