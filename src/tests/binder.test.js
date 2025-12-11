import assert from 'node:assert';
import test from 'node:test';
import Binder from '../js/binder/binder.js';

test('Binder.setData updates internal data - normal object', () => {
    const binder = new Binder(undefined, { a: 1 });
    const newData = { a: 2, b: 3 };
    const expected = { a: 2, b: 3 };

    binder.setData(newData, false);
    const value = binder.getData();

    assert.deepStrictEqual(expected, value);
});

test('Binder.setData updates internal data - empty object', () => {
    const binder = new Binder(undefined, { a: 1, b: 2 });
    const newData = {};
    const expected = {};

    binder.setData(newData, false);
    const value = binder.getData();

    assert.deepStrictEqual(expected, value);
});

test('Binder setData updates internal data - undefined', () => {
    const binder = new Binder(undefined, { a: 1 });
    const newData = undefined;
    const expected = undefined;

    binder.setData(newData, false);
    const value = binder.getData();

    assert.strictEqual(expected, value);
});

test('Binder.setData updates internal data - null', () => {
    const binder = new Binder(undefined, { a: 1 });
    const newData = null;
    const expected = null;

    binder.setData(newData, false);
    const value = binder.getData();

    assert.strictEqual(expected, value);
});

test('Binder.setData updates internal data - empty string', () => {
    const binder = new Binder(undefined, { a: 1 });
    const newData = '';
    const expected = '';

    binder.setData(newData, false);
    const value = binder.getData();

    assert.strictEqual(expected, value);
});

test('Binder.updateData updates partial keys correctly', async () => {
    const binder = new Binder(undefined, { a: 1, b: 2 });
    const partial = { b: 3, c: 4 };
    const expected = { a: 1, b: 3, c: 4 };
    let onUpdateCalledWith;

    binder.setOnUpdate(async (data) => {
        onUpdateCalledWith = { ...data };
    });

    await binder.updateData(partial, false);
    const value = binder.getData();

    assert.deepStrictEqual(expected, value);
    assert.deepStrictEqual(expected, onUpdateCalledWith);
});

test('Binder.updateData does not call onUpdate if values unchanged', async () => {
    const binder = new Binder(undefined, { a: 1 });
    let onUpdateCalled = false;
    binder.setOnUpdate(async () => { onUpdateCalled = true; });

    const partial = { a: 1 };
    const expected = { a: 1 };

    await binder.updateData(partial, false);
    const value = binder.getData();

    assert.deepStrictEqual(expected, value);
    assert.strictEqual(false, onUpdateCalled);
});

test('Binder.updateData handles undefined, null, empty values', async () => {
    const binder = new Binder(undefined, { a: 1, b: 2 });
    const partial = {
        a: undefined,
        b: null,
        c: '',
        d: [],
        e: {}
    };
    const expected = { a: undefined, b: null, c: '', d: [], e: {} };
    let onUpdateCalledWith;

    binder.setOnUpdate(async (data) => {
        onUpdateCalledWith = { ...data };
    });

    await binder.updateData(partial, false);
    const value = binder.getData();

    assert.deepStrictEqual(expected, value);
    assert.deepStrictEqual(expected, onUpdateCalledWith);
});

test('Binder.updateData rolls back if onUpdate fails', async () => {
    const binder = new Binder(undefined, { a: 1, b: 2 });
    const partial = { a: 99, b: 100 };
    const expectedBefore = { a: 1, b: 2 };

    binder.setOnUpdate(async () => {
        throw new Error('Simulated failure');
    });

    try {
        await binder.updateData(partial, false);
    } catch (err) {
        // expected
    }

    const value = binder.getData();
    assert.deepStrictEqual(expectedBefore, value);
});

test('Binder.updateData partially changes only different keys', async () => {
    const binder = new Binder(undefined, { a: 1, b: 2, c: 3 });
    const partial = { a: 1, b: 20, c: 3 }; // only b changes
    const expected = { a: 1, b: 20, c: 3 };
    let onUpdateCalledWith;

    binder.setOnUpdate(async (data) => {
        onUpdateCalledWith = { ...data };
    });

    await binder.updateData(partial, false);
    const value = binder.getData();

    assert.deepStrictEqual(expected, value);
    assert.deepStrictEqual(expected, onUpdateCalledWith);
});

test('Binder.getData returns current state after multiple updates', async () => {
    const binder = new Binder(undefined, { x: 10 });
    binder.setData({ x: 20, y: 30 }, false);

    await binder.updateData({ y: 40, z: 50 }, false);

    const value = binder.getData();
    const expected = { x: 20, y: 40, z: 50 };

    assert.deepStrictEqual(expected, value);
});

test('Binder.isNotSet true when value is undefined', () => {
    const binder = new Binder(undefined, {});
    const valueToTest = undefined;
    const expected = true;

    const value = binder.isNotSet(valueToTest);
    assert.strictEqual(expected, value);
});

test('Binder.isNotSet true when value is null', () => {
    const binder = new Binder(undefined, {});
    const valueToTest = null;
    const expected = true;

    const value = binder.isNotSet(valueToTest);
    assert.strictEqual(expected, value);
});

test('Binder.isNotSet true when value is empty string', () => {
    const binder = new Binder(undefined, {});
    const valueToTest = '';
    const expected = true;

    const value = binder.isNotSet(valueToTest);
    assert.strictEqual(expected, value);
});

test('Binder.isNotSet true when value is whitespace string', () => {
    const binder = new Binder(undefined, {});
    const valueToTest = '   ';
    const expected = true;

    const value = binder.isNotSet(valueToTest);
    assert.strictEqual(expected, value);
});

test('Binder.isNotSet false when value is non-empty string', () => {
    const binder = new Binder(undefined, {});
    const valueToTest = 'Hello';
    const expected = false;

    const value = binder.isNotSet(valueToTest);
    assert.strictEqual(expected, value);
});

test('Binder.isNotSet true when value is empty array', () => {
    const binder = new Binder(undefined, {});
    const valueToTest = [];
    const expected = true;

    const value = binder.isNotSet(valueToTest);
    assert.strictEqual(expected, value);
});

test('Binder.isNotSet false when value is non-empty array', () => {
    const binder = new Binder(undefined, {});
    const valueToTest = [1, 2, 3];
    const expected = false;

    const value = binder.isNotSet(valueToTest);
    assert.strictEqual(expected, value);
});

test('Binder.isNotSet true when value is empty object', () => {
    const binder = new Binder(undefined, {});
    const valueToTest = {};
    const expected = true;

    const value = binder.isNotSet(valueToTest);
    assert.strictEqual(expected, value);
});

test('Binder.isNotSet false when value is non-empty object', () => {
    const binder = new Binder(undefined, {});
    const valueToTest = { a: 1 };
    const expected = false;

    const value = binder.isNotSet(valueToTest);
    assert.strictEqual(expected, value);
});

test('Binder.isNotSet false when value is number 0', () => {
    const binder = new Binder(undefined, {});
    const valueToTest = 0;
    const expected = false;

    const value = binder.isNotSet(valueToTest);
    assert.strictEqual(expected, value);
});

test('Binder.isNotSet false when value is boolean false', () => {
    const binder = new Binder(undefined, {});
    const valueToTest = false;
    const expected = false;

    const value = binder.isNotSet(valueToTest);
    assert.strictEqual(expected, value);
});