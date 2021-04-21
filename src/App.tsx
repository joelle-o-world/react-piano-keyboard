import React, {useState} from 'react';
import Arrow from './components/Arrow';
import PianoKeyboard from './components/PianoKeyboard';
import {PianoKeyboardKeyLabel, PianoKeyboardPitchLabel} from './components/PianoKeyboardKeyLabel';
import {PitchIntervalArrow} from './components/PitchIntervalArrow';
import {PitchPath} from './components/PitchPath';

function App() {
  const [pitches, setPitches] = useState([] as number[]);
  const appendPitch = (p:number) => setPitches(pitches => [...pitches, p])
  return (
    <div className="App">
      <PianoKeyboard lowestNote={3} onNote={({p}) => appendPitch(p)}>
        <PianoKeyboardPitchLabel pitch={16} />
        <PitchPath pitches={pitches} />
      </PianoKeyboard>
    </div>
  );
}

export default App;
