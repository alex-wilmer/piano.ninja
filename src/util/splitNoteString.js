export let splitNoteString = n => {
  let s = n.split('')

  if (!s.length) {
    throw new Error('not a valid note string')
  }

  let letter = s[0]

  let last = s[s.length - 1]

  // note string has no octave
  if (!Number(last)) {
    return {
      letter,
      acc: s.slice(1).join('')
    }
  }

  return {
    letter,
    acc: s.slice(1, s.length - 1).join(''),
    octave: s[s.length - 1]
  }
}