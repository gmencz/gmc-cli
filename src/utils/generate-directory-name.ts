import {
  adjectives,
  colors,
  starWars,
  uniqueNamesGenerator,
} from 'unique-names-generator'

const generateDirectoryName = () => {
  // Generate a random name for a directory and remove accents/diacritics
  // since those are invalid project names for npm and friends.
  return uniqueNamesGenerator({
    dictionaries: [adjectives, colors, starWars],
    separator: '-',
  })
    .split(' ')
    .join('-')
    .toLowerCase()
    .normalize('NFC')
    .replace(/[\u0300-\u036f]/g, '')
}

export { generateDirectoryName }
