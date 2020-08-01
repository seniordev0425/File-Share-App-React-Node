import {
  composeValidators,
  required,
  matchesValue,
  minLength,
  maxLength,
  matchesRegex,
  isEmail,
} from './validation'

describe('required', () => {
  it('should accept non-empty values', () => {
    const error = required('Value Required')('some value')

    expect(typeof error).toBe('undefined')
  })

  it('should not accept empty values', () => {
    expect(required('Value Required')('')).toBeTruthy()
    expect(required('Value Required')(null)).toBeTruthy()
    expect(required('Value Required')(undefined)).toBeTruthy()
  })
})

describe('matchesValue', () => {
  it('should accept matching values', () => {
    expect(typeof matchesValue('testvalue_150', 'Validation failed')('testvalue_150')).toBe('undefined')
  })

  it('should not accept unmatching values', () => {
    expect(matchesValue('testvalue_150', 'Validation failed')('testvalue_151')).toBeTruthy()
    expect(matchesValue('testvalue_150', 'Validation failed')('')).toBeTruthy()
  })
})

describe('minLength', () => {
  it('should not accept value shorter than min length', () => {
    const error = minLength(3, 'Validation failed')('ab')

    expect(error).toBeTruthy()
  })

  it('should accept values equal or longer than min length', () => {
    expect(typeof minLength(3, 'Validation failed')('abc')).toBe('undefined')
    expect(typeof minLength(3, 'Validation failed')('test val')).toBe('undefined')
  })

  it('should accept null or undefined', () => {
    expect(typeof minLength(3, 'Validation failed')(null)).toBe('undefined')
    expect(typeof minLength(3, 'Validation failed')(undefined)).toBe('undefined')
  })
})

describe('maxLength', () => {
  it('should not accept value longer than max length', () => {
    const error = maxLength(10, 'Validation failed')('this is too long')

    expect(error).toBeTruthy()
  })

  it('should accept values equal or longer than max length', () => {
    expect(typeof maxLength(10, 'Validation failed')('test value')).toBe('undefined')
    expect(typeof maxLength(10, 'Validation failed')('test val')).toBe('undefined')
  })

  it('should accept null or undefined', () => {
    expect(typeof maxLength(10, 'Validation failed')(null)).toBe('undefined')
    expect(typeof maxLength(10, 'Validation failed')(undefined)).toBe('undefined')
  })
})

describe('matchesRegex', () => {
  it('should accept values matching regex', () => {
    expect(typeof matchesRegex(/^[a-z]+[0-9]+$/, 'Validation failed')('thisshouldmatchregex012345')).toBe('undefined')
    expect(typeof matchesRegex(/[a-z]+[0-9]+/i, 'Validation failed')('test Value123 word')).toBe('undefined')
  })

  it('should not accept values mismatching regex', () => {
    expect(matchesRegex(/^[a-z]+[0-9]+$/, 'Validation failed')('this should not match 12345')).toBeTruthy()
    expect(matchesRegex(/[a-z]+[0-9]+/i, 'Validation failed')('invalid_word')).toBeTruthy()
  })
})

describe('isEmail', () => {
  it('should accept email values', () => {
    expect(typeof isEmail('Validation failed')('test123@fast.io')).toBe('undefined')
    expect(typeof isEmail('Validation failed')('some1.name2@domain-another1.com')).toBe('undefined')
    expect(typeof isEmail('Validation failed')('another+name123@gmail.com')).toBe('undefined')
  })

  it('should not accept values that are not email', () => {
    expect(isEmail('Validation failed')('test123@@fast.io')).toBeTruthy()
    expect(isEmail('Validation failed')('invalid_word')).toBeTruthy()
  })
})

describe('composeValidators', () => {
  it('should accept value matching all composed conditions', () => {
    const validator = composeValidators(
      required('Required'),
      minLength(3, 'Too short'),
      maxLength(10, 'Too long'),
      matchesRegex(/^[a-z0-9]+$/, 'Should be alphanumeric only'),
    )

    expect(validator('')).toEqual('Required')
    expect(validator(null)).toEqual('Required')
    expect(validator('ab')).toEqual('Too short')
    expect(validator('abc def ghi jkl')).toEqual('Too long')
    expect(validator('abcs*^276')).toEqual('Should be alphanumeric only')
    expect(typeof validator('good123')).toBe('undefined')
  })
})
