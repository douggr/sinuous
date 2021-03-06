import test from 'tape';
import { spy } from 'sinon';
import sinuous from 'sinuous';
const h = sinuous();
import o from 'observable';

test('observable content', function(t) {
  let title = o();
  title('Welcome to HyperScript!');
  let h1 = h('h1', title);
  t.equal(h1.outerHTML, '<h1>Welcome to HyperScript!</h1>');
  title('Leave, creep!');
  t.equal(h1.outerHTML, '<h1>Leave, creep!</h1>');
  t.end();
});

test('observable property', function(t) {
  let checked = o();
  checked(true);
  let checkbox = h('input', { type: 'checkbox', checked: checked });
  t.assert(checkbox.checked);
  checked(false);
  t.assert(!checkbox.checked);
  t.end();
});

test('observable style', function(t) {
  let color = o();
  color('red');
  let div = h('div', { style: { color: color } });
  t.equal(div.style.color, 'red');
  color('blue');
  t.equal(div.style.color, 'blue');
  t.end();
});

test('context cleanup removes observable listeners', function(t) {
  let _h = sinuous();
  let text = o();
  text('hello');
  let color = o();
  color('red');
  let className = o();
  className('para');
  let p = _h('p', { style: { color: color }, className: className }, text);

  const validVariants = [
    '<p class="para" style="color: red;">hello</p>',
    '<p style="color: red;" class="para">hello</p>'
  ];

  t.assert(validVariants.indexOf(p.outerHTML) !== -1);
  _h.cleanUp();
  color('blue');
  text('world');
  className('section');
  t.assert(validVariants.indexOf(p.outerHTML) !== -1);
  t.end();
});

test('context cleanup removes event handlers', function(t) {
  let _h = sinuous({ subscribe: fn => fn() });
  let onClick = spy();
  let closure = () => onClick;
  let button = _h('button', 'Click me!', { onclick: closure });
  button.click();
  t.assert(onClick.calledOnce, 'click listener was triggered');

  _h.cleanUp();
  button.click();
  t.assert(onClick.calledOnce, 'click listener was not triggered');
  t.end();
});
