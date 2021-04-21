import React, {FunctionComponent} from 'react';
import Arrow from './Arrow';
import {useKeyPosition} from './PianoKeyboard';

interface PitchIntervalArrowProps {
  from: number;
  to: number;
}
export const PitchIntervalArrow: FunctionComponent<PitchIntervalArrowProps> = ({from, to}) => {
  const p1 = useKeyPosition(from);
  const p2 = useKeyPosition(to);

  if(p1 && p2) {
    return <Arrow 
      x1={p1.inner.center.x} 
      y1={p1.inner.center.y} 
      x2={p2.inner.center.x} 
      y2={p2.inner.center.y}
    />
  } else 
    return null
}

export default PitchIntervalArrow;
