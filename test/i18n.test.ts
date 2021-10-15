import { assert } from 'chai'
import { getLocale } from '../src/i18n'

let ORG_ENV = {}

beforeEach(() => {
  ORG_ENV = process.env
  process.env = {}
})

afterEach(() => {
  process.env = ORG_ENV
})

describe('getLocale', () => {
  it('default', () => {
    assert.equal(getLocale(), 'en-US')
  })

  it('LC_ALL', () => {
    process.env['LC_ALL'] = 'ja_JP'
    assert.equal(getLocale(), 'ja-JP')
  })

  it('LC_MESSAGES', () => {
    process.env['LC_MESSAGES'] = 'ja_JP'
    assert.equal(getLocale(), 'ja-JP')
  })

  it('LANG', () => {
    process.env['LANG'] = 'ja_JP'
    assert.equal(getLocale(), 'ja-JP')
  })

  it('LANGUAGE', () => {
    process.env['LANGUAGE'] = 'ja_JP'
    assert.equal(getLocale(), 'ja-JP')
  })

  it('BCP-47', () => {
    process.env['LC_ALL'] = 'ja-JP'
    assert.equal(getLocale(), 'ja-JP')
  })
})
