import { test, expect } from 'vitest'

import { findJSON } from './findJSON'

test('err empty text', () => {
  expect(() => findJSON('')).toThrowError('Empty text')
})

test('err unable to find prefix', () => {
  expect(() => findJSON('foo', 'prefix')).toThrowError('Unable to find prefix')
})

test('err json', () => {
  expect(() => findJSON('foo', 'f')).toThrowError('Unable to find JSON')
})

test('basic', () => {
  expect(findJSON('let test = {"foo": "bar"}', 'test')).toStrictEqual({ foo: 'bar' })
})

test('complex', () => {
  expect(findJSON('let test = { "foo": { "bar": "baz" } }', 'test')).toStrictEqual({
    foo: { bar: 'baz' },
  })
})

test('string', () => {
  expect(findJSON('let test = { "foo": "bar{baz" }', 'test')).toStrictEqual({
    foo: 'bar{baz',
  })
})

test('string', () => {
  // prettier-ignore
  expect(findJSON('let test = { "foo": "bar\\"baz" }', 'test')).toStrictEqual({
		foo: 'bar"baz'
	});
})
