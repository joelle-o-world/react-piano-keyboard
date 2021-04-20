import * as React from 'react';
import {FunctionComponent, useEffect} from 'react';
import classNames from 'classnames';

import './PianoKeyboard.sass';

const keyNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const flatKeyNames = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
const defaultHotKeys = ['a','w','s','e','d','f','t','g','y','h','u','j','k','o','l', 'p', ';'];

export const PianoKeyboard: FunctionComponent<{
  numberOfKeys?: number;
  octave?: number;
  hotKeys?: string[];
  hotKeyOffset?: number
  highlightKeys?: number[];
  labelKeys?: boolean;
  onNote?: (e:{
    pitchNumber: number;
    p: number;
    pitchName: string;
    fullName: string;
    octave: number;
  }) => void;
}> = ({numberOfKeys=15, octave=1, hotKeys=defaultHotKeys, hotKeyOffset=0, onNote, highlightKeys=[], labelKeys=false,}) => {


  useEffect( () => {
    const handleKeyDown = (e: any) => {
      if(hotKeys.includes(e.key)) {
        let index = hotKeys.indexOf(e.key)
        if(index !== -1) {


          let pitch = index + hotKeyOffset + octave * 12
          let keyName = keyNames[index % 12]
          let actualOctave = octave + Math.floor(index/12)
          let fullName = keyName + actualOctave;
          if(onNote)
            onNote({
              p: pitch,
              pitchNumber: pitch,
              pitchName: keyName,
              fullName,
              octave: actualOctave
            })
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [hotKeys, hotKeyOffset, octave, onNote])

  const whiteNotes = []
  const blackNotes = []
  for(let i=0; i < numberOfKeys; ++i) {
    const keyName = keyNames[i % 12]
    const flatKeyName = flatKeyNames[i%12];
    const black = /[b#]$/.test(keyName)
    const hotKey = i >= hotKeyOffset ? (hotKeys[i - hotKeyOffset] || null) : null
    let actualOctave = octave + Math.floor(i/12)
    const fullName = keyName + actualOctave
    const pitch = octave * 12 + i
    const handlePress = () => {
      if(onNote)
        onNote({
          p: pitch,
          pitchNumber: pitch,
          pitchName: keyName,
          octave: actualOctave,
          fullName,
        })
    }

    let highlighted = highlightKeys.includes(pitch)
    const btn = <div 
      onMouseDown={handlePress} 
      key={i} 
      className={classNames("key", flatKeyName, {highlighted})}
    >{labelKeys ? fullName : (hotKey || ' ')}</div>

    if(black)
      blackNotes.push(btn)
    else
      whiteNotes.push(btn)
  }

  return <div className='PianoKeyboard'>
    <div className='black-keys'>
      {blackNotes}
    </div>

    <div className='white-keys'>
      {whiteNotes}
    </div>
  </div>
}

export default PianoKeyboard
