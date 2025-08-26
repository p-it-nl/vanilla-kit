import test from 'node:test';
import assert from 'node:assert';
import Calculator from '../js/calculator.js';

test('Calculator.add() should add numbers', () => {
    assert.strictEqual(Calculator.add(2, 3), 5);
    assert.strictEqual(Calculator.add(-1, 1), 0);
});

test('Calculator.subtract() should subtract numbers', () => {
    assert.strictEqual(Calculator.subtract(5, 3), 2);
    assert.strictEqual(Calculator.subtract(0, 4), -4);
});

test('Calculator.multiply() should multiply numbers', () => {
    assert.strictEqual(Calculator.multiply(3, 4), 12);
    assert.strictEqual(Calculator.multiply(-2, 3), -6);
});

test('Calculator.divide() should divide numbers', () => {
    assert.strictEqual(Calculator.divide(10, 2), 5);
    assert.strictEqual(Calculator.divide(-6, 3), -2);
});

test('Calculator.divide() should throw on division by zero', () => {
    assert.throws(() => Calculator.divide(5, 0), /Division by zero/);
});
