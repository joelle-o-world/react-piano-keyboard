// Pitch utility functions
export const keyNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
export const flatKeyNames = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
export const sharpKeyNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']


export const octaveOf = (p: number) => Math.floor(p / 12);
export const pitchClassOf = (p: number, twelve=12) => {
  while(p < 0)
    p += twelve;
  return p%twelve
}
export const isBlackNote = (p: number) => [1,3,6,8,10].includes(pitchClassOf(p))

export function printPitch(p: number, {
  includeOctave=true, 
  enharmonicPreference='#',
}={}) {
  const pc = pitchClassOf(p);
  const keyName = (
    enharmonicPreference == '#' ? sharpKeyNames : flatKeyNames
  )[pc]
  const octave = octaveOf(p);

  if(includeOctave)
    return keyName + octave;
  else
    return keyName
}
