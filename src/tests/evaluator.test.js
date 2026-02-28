import assert from 'node:assert';
import test from 'node:test';
import MockElement from './mock-element.js';
import Evaluator from '../js/evaluator.js';

const evaluator = new Evaluator();

test('Evaluator.evaluateExpression handles === correctly', () => {
    const expr1 = "x === 5";
    const expr2 = "x === 3";
    const data1 = { x: 5 };
    const data2 = { x: 3 };

    const result1 = evaluator.evaluateExpression(expr1, data1);
    const result2 = evaluator.evaluateExpression(expr2, data2);

    assert.strictEqual(result1, true);
    assert.strictEqual(result2, true);
});

test('Evaluator.evaluateExpression handles == correctly', () => {
    const expr1 = "x == '5'";
    const expr2 = "x == 5";
    const data1 = { x: 5 };
    const data2 = { x: '6' };

    const result1 = evaluator.evaluateExpression(expr1, data1);
    const result2 = evaluator.evaluateExpression(expr2, data2);

    assert.strictEqual(result1, true);
    assert.strictEqual(result2, false);
});

test('Evaluator.evaluateExpression handles != correctly', () => {
    const expr1 = "x != 5";
    const data1 = { x: '5' };
    const data2 = { x: '6' };

    const result1 = evaluator.evaluateExpression(expr1, data1);
    const result2 = evaluator.evaluateExpression(expr1, data2);

    assert.strictEqual(result1, false);
    assert.strictEqual(result2, true);
});

test('Evaluator.evaluateExpression handles !== correctly', () => {
    const expr = "x !== 5";
    const data1 = { x: 5 };
    const data2 = { x: 6 };

    const result1 = evaluator.evaluateExpression(expr, data1);
    const result2 = evaluator.evaluateExpression(expr, data2);

    assert.strictEqual(result1, false);
    assert.strictEqual(result2, true);
});

test('Evaluator.evaluateExpression handles > and < correctly', () => {
    const expr1 = "x > 5";
    const expr2 = "x < 5";
    const data1 = { x: 6 };
    const data2 = { x: 5 };
    const data3 = { x: 4 };

    const result1 = evaluator.evaluateExpression(expr1, data1);
    const result2 = evaluator.evaluateExpression(expr1, data2);
    const result3 = evaluator.evaluateExpression(expr2, data3);
    const result4 = evaluator.evaluateExpression(expr2, data2);

    assert.strictEqual(result1, true);
    assert.strictEqual(result2, false);
    assert.strictEqual(result3, true);
    assert.strictEqual(result4, false);
});

test('Evaluator.evaluateExpression parses string literals correctly', () => {
    const expr1 = `x === "hello"`;
    const expr2 = `x === 'hello'`;
    const data1 = { x: "hello" };
    const data2 = { x: "world" };

    const result1 = evaluator.evaluateExpression(expr1, data1);
    const result2 = evaluator.evaluateExpression(expr2, data2);

    assert.strictEqual(result1, true);
    assert.strictEqual(result2, false);
});

test('Evaluator.evaluateExpression parses boolean literals correctly', () => {
    const expr1 = "x === true";
    const expr2 = "x === false";
    const data = { x: true };

    const result1 = evaluator.evaluateExpression(expr1, data);
    const result2 = evaluator.evaluateExpression(expr2, data);

    assert.strictEqual(result1, true);
    assert.strictEqual(result2, false);
});

test('Evaluator.evaluateExpression parses numeric literals correctly', () => {
    const expr = "x === 42";
    const data1 = { x: 42 };
    const data2 = { x: 43 };

    const result1 = evaluator.evaluateExpression(expr, data1);
    const result2 = evaluator.evaluateExpression(expr, data2);

    assert.strictEqual(result1, true);
    assert.strictEqual(result2, false);
});

test('Evaluator.evaluateExpression resolves object/array paths', () => {
    const expr1 = `status[0].label === 'Done'`;
    const expr2 = `status[0].label === 'Pending'`;
    const data = { status: [{ label: "Done" }] };

    const result1 = evaluator.evaluateExpression(expr1, data);
    const result2 = evaluator.evaluateExpression(expr2, data);

    assert.strictEqual(result1, true);
    assert.strictEqual(result2, false);
});

test('Evaluator.evaluateExpression returns false if path is missing or data falsy', () => {
    const expr = "x === 5";

    const result1 = evaluator.evaluateExpression("missing === 1", {});
    const result2 = evaluator.evaluateExpression(expr, null);
    const result3 = evaluator.evaluateExpression(expr, undefined);

    assert.strictEqual(result1, false);
    assert.strictEqual(result2, false);
    assert.strictEqual(result3, false);
});

test('Evaluator.evaluateExpression returns false if expression is malformed', () => {
    const result1 = evaluator.evaluateExpression("x ====", { x: 5 });
    const result2 = evaluator.evaluateExpression("", { x: 5 });

    assert.strictEqual(result1, false);
    assert.strictEqual(result2, false);
});

test('Evaluator.evaluateConditions returns early for falsy or empty data', () => {
    const el = new MockElement();

    evaluator.evaluateConditions(el, null);
    evaluator.evaluateConditions(el, undefined);
    evaluator.evaluateConditions(el, 0);
    evaluator.evaluateConditions(el, '');
    evaluator.evaluateConditions(el, {});

    assert.strictEqual(el.style.display, undefined);
});

test('Evaluator.evaluateConditions handles null or undefined element gracefully', () => {
    assert.doesNotThrow(() => evaluator.evaluateConditions(null, { a: 1 }));
    assert.doesNotThrow(() => evaluator.evaluateConditions(undefined, { a: 1 }));
});

test('Evaluator.evaluateConditions does nothing when element has no conditional attributes', () => {
    const el = new MockElement();

    evaluator.evaluateConditions(el, { x: 1 });

    assert.strictEqual(el.style.display, undefined);
});

test('Evaluator.evaluateConditions toggles visibility using show-if expression', () => {
    const el = new MockElement();
    el.setAttribute('show-if', 'x === 5');

    evaluator.evaluateConditions(el, { x: 5 });
    assert.ok(el.classList.contains('shown'));

    evaluator.evaluateConditions(el, { x: 1 });
    assert.ok(el.classList.isEmpty());
});

test('Evaluator.evaluateConditions toggles visibility with status in show-if expression', () => {
    const el = new MockElement();
    el.setAttribute('show-if', "status[0].label === 'Afgenomen'");

    evaluator.evaluateConditions(el, {
        status: [{ label: 'Afgenomen', url: '...' }]
    });

    assert.ok(el.classList.contains('shown'));
});

test('Evaluator.evaluateConditions hides when show-if variable not found in data', () => {
    const el = new MockElement();
    el.setAttribute('show-if', 'missing === 1');

    evaluator.evaluateConditions(el, { x: 1 });
    assert.ok(el.classList.isEmpty());
});

test('Evaluator.evaluateConditions toggles classes using class-if expression', () => {
    const el = new MockElement();
    el.setAttribute('class-if', 'x > 2:active');

    evaluator.evaluateConditions(el, { x: 3 });
    assert.ok(el.classList.contains('active'));

    evaluator.evaluateConditions(el, { x: 1 });
    assert.ok(!el.classList.contains('active'));
});

test('Evaluator.evaluateConditions supports multiple classes in class-if', () => {
    const el = new MockElement();
    el.setAttribute('class-if', 'x === true:ready done');

    evaluator.evaluateConditions(el, { x: true });
    assert.ok(el.classList.contains('ready'));
    assert.ok(el.classList.contains('done'));

    evaluator.evaluateConditions(el, { x: false });
    assert.ok(!el.classList.contains('ready'));
    assert.ok(!el.classList.contains('done'));
});

test('Evaluator.evaluateConditions works with both show-if and class-if simultaneously', () => {
    const el = new MockElement();
    el.setAttribute('show-if', 'x === 1');
    el.setAttribute('class-if', 'y === 2:highlight');

    evaluator.evaluateConditions(el, { x: 1, y: 2 });
    assert.ok(el.classList.contains('shown'));
    assert.ok(el.classList.contains('highlight'));

    evaluator.evaluateConditions(el, { x: 0, y: 0 });
    assert.ok(el.classList.isEmpty());
    assert.ok(!el.classList.contains('highlight'));
});

test('Evaluator.evaluateConditions adds and removes class correctly', () => {
    const el = new MockElement();
    el.setAttribute('class-if', 'flag === true:active');

    evaluator.evaluateConditions(el, { flag: true });
    assert.ok(el.classList.contains('active'));

    evaluator.evaluateConditions(el, { flag: false });
    assert.ok(!el.classList.contains('active'));
});

test('Evaluator.evaluateConditionsWithin evaluates element and matching children', () => {
    const root = new MockElement();
    const child = new MockElement();

    root.setAttribute('show-if', 'isRootVisible === true');
    child.setAttribute('class-if', 'count > 1:active');

    root.querySelectorAll = () => [child];

    evaluator.evaluateConditionsWithin(root, { isRootVisible: true, count: 2 });

    assert.ok(root.classList.contains('shown'));
    assert.ok(child.classList.contains('active'));
});

test('Evaluator.evaluateExpression returns false for unsupported operators', () => {
    const result = evaluator.evaluateExpression('x >= 5', { x: 5 });

    assert.strictEqual(result, false);
});

test('resolvePath returns correct primitive value', () => {
    const data = { a: { b: 5 } };

    const result = evaluator.resolvePath(data, 'a.b');

    assert.strictEqual(result, 5);
});

test('resolvePath returns undefined for missing property', () => {
    const data = { a: { b: 5 } };

    const result = evaluator.resolvePath(data, 'a.c');

    assert.strictEqual(result, undefined);
});

test('resolvePath handles array indices', () => {
    const data = { arr: [10, 20, 30] };

    const result = evaluator.resolvePath(data, 'arr[1]');

    assert.strictEqual(result, 20);
});

test('resolvePath handles nested arrays and objects', () => {
    const data = { x: [{ y: { z: 7 } }] };

    const result = evaluator.resolvePath(data, 'x[0].y.z');

    assert.strictEqual(result, 7);
});

test('resolvePath returns undefined for out-of-bounds index', () => {
    const data = { arr: [1, 2, 3] };

    const result = evaluator.resolvePath(data, 'arr[5]');

    assert.strictEqual(result, undefined);
});

test('resolvePath returns undefined for null object', () => {
    const obj = null;

    const result = evaluator.resolvePath(obj, 'a.b');

    assert.strictEqual(result, undefined);
});

test('resolvePath returns undefined for undefined object', () => {
    const obj = undefined;

    const result = evaluator.resolvePath(obj, 'a.b');

    assert.strictEqual(result, undefined);
});

test('resolvePath handles numeric keys in objects', () => {
    const data = { a: { 0: 'zero', 1: 'one' } };

    const result0 = evaluator.resolvePath(data, 'a[0]');
    const result1 = evaluator.resolvePath(data, 'a[1]');

    assert.strictEqual(result0, 'zero');
    assert.strictEqual(result1, 'one');
});

test('resolvePath handles mixed dot and bracket notation', () => {
    const data = { a: [{ b: 42 }] };

    const result = evaluator.resolvePath(data, 'a[0].b');

    assert.strictEqual(result, 42);
});

