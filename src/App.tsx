import React from 'react';
import PianoKeyboard from './components/PianoKeyboard';

function App() {
  return (
    <div className="App">
      <PianoKeyboard lowestNote={3} labelKeys/>
    </div>
  );
}

export default App;
