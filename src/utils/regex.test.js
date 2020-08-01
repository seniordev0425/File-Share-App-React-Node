import {
  buildRegexPattern,
  cleanupRegex,
  joinRegexPatterns,
  splitRegexPattern
} from './regex'

describe('buildRegexPattern', () => {
  it('should prepend `/` unless the string starts with `/` or `*` if forPath is specified', () => {
    expect(buildRegexPattern('.git', true)).toEqual('^\\/\\.git$')
    expect(buildRegexPattern('/test', true)).toEqual('^\\/test$')
    expect(buildRegexPattern('*.git', true)).toEqual('^.*\\.git$')
  })
})

describe('cleanupRegex', () => {
  it('should replace `.*` with `*`', () => {
    expect(cleanupRegex('.*test.*cleanup')).toEqual('*test*cleanup')
  })

  it('should replace `|` with `,`', () => {
    expect(cleanupRegex('test|cleanup')).toEqual('test, cleanup')
  })

  it('should remove `^` and `$` in the pattern', () => {
    expect(cleanupRegex('^test$^cleanup$')).toEqual('testcleanup')
  })

  it('should remove slashes except for `\\n` and `\\r` in the pattern', () => {
    expect(cleanupRegex('\\.\\n\\r')).toEqual('.\\n\\r')
  })
})

describe('joinRegexPatterns', () => {
  it('should join regex patterns correctly', () => {
    const patterns = [
      '^\\.|^\\~|.*(\\n|\\r).*',
      '^desktop\\.ini$|^thumbs\\.db|icon\\r',
      '^\.gitignore$'
    ]
    const joinedPattern = '/(^\\.|^\\~|.*(\\n|\\r).*)|(^desktop\\.ini$|^thumbs\\.db|icon\\r)|(^\.gitignore$)/'
    expect(joinRegexPatterns(patterns)).toEqual(joinedPattern)
  })

  it('should return empty string for empty patterns array', () => {
    expect(joinRegexPatterns([])).toEqual('')
  })
})

describe('splitRegexPatterns', () => {
  it('should split the patterns into an array', () => {
    const pattern = '/(^\\.|^\\~|.*(\\n|\\r).*)|(^desktop\\.ini$|^thumbs\\.db|icon\\r)|(^\.gitignore$)/'
    expect(splitRegexPattern(pattern)).toEqual([
      '^\\.|^\\~|.*(\\n|\\r).*',
      '^desktop\\.ini$|^thumbs\\.db|icon\\r',
      '^\.gitignore$'
    ])
  })

  it('should split single pattern into a one element array', () => {
    const pattern = '/(^\\.|^\\~|.*(\\n|\\r).*)/'
    expect(splitRegexPattern(pattern)).toEqual([
      '^\\.|^\\~|.*(\\n|\\r).*'
    ])
  })

  it('should return an empty array for patterns with syntax error', () => {
    const pattern = '/(^\\.|^\\~|.*(\\n|\\r/'
    expect(splitRegexPattern(pattern)).toEqual([])
  })
})
