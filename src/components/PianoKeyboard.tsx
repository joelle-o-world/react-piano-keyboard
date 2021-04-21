import React, {useContext, useState} from 'react';
import {FunctionComponent, useEffect, createContext} from 'react';
import classNames from 'classnames';
import {keyNames, flatKeyNames, octaveOf, pitchClassOf, isBlackNote} from '../pitch';

import './PianoKeyboard.sass';

interface PianoKeyboardKeyPositions {
  [pitch: number]: {
    x: number;
    height: number;
    left: number;
    top: number;
    width: number;
    deepness: number;
    bottom: number;
    inner: {
      top: number;
      left: number;
      width: number;
      height: number;
      bottom: number;
      center: {x:number, y:number}
    }
  }
}

export const PianoKeyboardContext = createContext({
  keyPositions: {} as PianoKeyboardKeyPositions,
})

export const useKeyPosition = (pitch: number) => {
  let {keyPositions} = useContext(PianoKeyboardContext)

  return keyPositions[pitch] || null;
}

export const basicHotKeys = ['a','w','s','e','d','f','t','g','y','h','u','j','k','o','l', 'p', ';'];
export const defaultHotKeys:string[] = [];


export const PianoKeyboard: FunctionComponent<{
  numberOfKeys?: number;
  hotKeys?: string[];
  hotKeyOffset?: number
  highlightKeys?: number[];
  labelKeys?: boolean;

  // The lowest note on the keyboard
  lowestNote?: number;
  
  /// The width of a white key
  whiteKeyWidth?: number;

  // The width of a black key
  blackKeyWidth?: number;

  whiteKeyHeight?: number;
  blackKeyHeight?: number;
  // The height of the border-bottom property of the white keys to give the illusion of depth.
  whiteKeyDeepness?: number;
  // The height of the border-bottom property of the black keys to give the illusion of depth.
  blackKeyDeepness?: number;

  /// Called when the user clicks on a key or presses an associated hot key
  onNote?: (e:{
    pitchNumber: number;
    p: number;
    pitchName: string;
    fullName: string;
    octave: number;
  }) => void;
}> = ({
  numberOfKeys=15, 
  lowestNote=12,
  hotKeys=defaultHotKeys, 
  hotKeyOffset=0, 
  onNote, 
  highlightKeys=[], 
  labelKeys=false,
  whiteKeyWidth=50,
  blackKeyWidth=30,
  whiteKeyHeight=200,
  blackKeyHeight=100,
  whiteKeyDeepness=30,
  blackKeyDeepness=15,
  children,
}) => {


  useEffect( () => {
    const handleKeyDown = (e: any) => {
      if(hotKeys.includes(e.key)) {
        let index = hotKeys.indexOf(e.key)
        if(index !== -1) {
          let pitch = index + hotKeyOffset + lowestNote
          let keyName = keyNames[index % 12]
          let actualOctave = octaveOf(pitch)
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
  }, [hotKeys, hotKeyOffset, lowestNote, onNote])


  const keyPositions = React.useMemo(() => {
    let x = 0
    let positions:PianoKeyboardKeyPositions = {};
    for(let i=0; i < numberOfKeys; ++i) {
      let p = lowestNote + i;
      let pc = pitchClassOf(p);
      x += (pc == 5 || pc == 0)
        ? whiteKeyWidth
        : whiteKeyWidth/2
      let black = isBlackNote(pc);
      let width = black ? blackKeyWidth : whiteKeyWidth;
      let left = x - width/2;
      let innerTop = black ? 0 : blackKeyHeight;
      let innerHeight = black 
        ? (whiteKeyHeight - blackKeyDeepness) 
        : (whiteKeyHeight-blackKeyHeight-whiteKeyDeepness)
      positions[p] = {
        x,
        top: 0,
        width,
        height:black ? blackKeyHeight : whiteKeyHeight,
        left,
        deepness: black ? blackKeyDeepness : whiteKeyDeepness,
        bottom: black ? (whiteKeyHeight - blackKeyHeight) : 0,
        inner: {
          top: innerTop,
          left,
          height: innerHeight,
          width,
          bottom: black
            ? whiteKeyHeight - blackKeyHeight + blackKeyDeepness
            : whiteKeyDeepness,
          center: {
            x: left + width/2,
            y: innerTop + innerHeight / 2
          },
        }
      };
    }
    return positions;
  }, [])

  let keys = [];
  for(let i=0; i < numberOfKeys; ++i) {
    const pitch = lowestNote + i
    const keyName = keyNames[pitch % 12]
    const flatKeyName = flatKeyNames[i%12];
    const black = /[b#]$/.test(keyName)
    
    const hotKey = i >= hotKeyOffset ? (hotKeys[i - hotKeyOffset] || null) : null
    const actualOctave = octaveOf(pitch)
    const fullName = keyName + actualOctave
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

    const className = classNames(
      "PianoKeyboardKey",
      flatKeyName,
      { 
        highlighted: highlightKeys.includes(pitch),
        PianoKeyboardBlackKey: black,
        PianoKeyboardWhiteKey: !black,
      }
    );

    const {left, width, top, height, deepness} = keyPositions[pitch];

    const btn = <div 
      onMouseDown={handlePress} 
      key={i} 
      className={className}
      style={{
        left: left + 'px',
        width: width+'px',
        top: `${top}px`,
        height: `${height}px`,
        borderBottomWidth: (deepness)+'px',
      }}
    >{labelKeys ? fullName : (hotKey || ' ')}</div>

    keys.push(btn)
  }

  return <div className='PianoKeyboard' style={{height: whiteKeyHeight+'px'}}>
    <div className="PianoKeyboardKeys">
      {keys}
    </div>
    <div className="PianoKeyboardOverlay">
      <PianoKeyboardContext.Provider value={{keyPositions}}>
        {children}
      </PianoKeyboardContext.Provider>
    </div>
  </div>
}

export default PianoKeyboard
