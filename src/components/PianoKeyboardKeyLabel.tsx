import React, {FunctionComponent} from 'react';
import {useKeyPosition} from './PianoKeyboard';
import {printPitch} from '../pitch';

export interface PianoKeyboardKeyLabelProps {
  pitch: number;
}

export const PianoKeyboardKeyLabel: FunctionComponent<PianoKeyboardKeyLabelProps> = ({children, pitch}) => {
  const {left, bottom, width} = useKeyPosition(pitch).inner;
  if(pitch !== null)
    return <div
      style={{
        position: 'absolute',
        left: left+'px',
        width: width+'px',
        bottom: bottom+'px',
      }}
    >{children}</div>
  else 
    return null
}

export const PianoKeyboardPitchLabel: FunctionComponent<{pitch: number}> = ({pitch}) => {
  const pitchStr = printPitch(pitch);
  return <PianoKeyboardKeyLabel pitch={pitch}>
    {pitchStr}
  </PianoKeyboardKeyLabel>
}
