import { test, expect } from 'vitest'
import { durationFmt } from './utils'

test('malformed', () => {
  expect(() => durationFmt('')).toThrow('Unable to find duration')
})

test('hours', () => {
  expect(durationFmt('PT6H3M14S')).toBe('6:03:14')
})

test('minutes', () => {
  expect(durationFmt('PT3M14S')).toBe('3:14')
})

test('seconds', () => {
  expect(durationFmt('PT14S')).toBe('14s')
})
