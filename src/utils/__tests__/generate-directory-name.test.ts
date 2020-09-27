import { generateDirectoryName } from '../generate-directory-name'

test('generated name is lowercase and uses dashes as the separator', () => {
  const hasUppercaseChars = jest.fn((str: string): boolean =>
    str.split('').some(char => char !== '-' && char.toUpperCase() === char),
  )

  const generated = generateDirectoryName()
  expect(hasUppercaseChars(generated)).toBe(false)
  expect(hasUppercaseChars).toHaveBeenCalled()
  expect(hasUppercaseChars).toHaveBeenCalledTimes(1)
  expect(hasUppercaseChars).toHaveBeenCalledWith(generated)
  expect(generated.includes('-')).toBe(true)
})
