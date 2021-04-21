import React, {FunctionComponent} from 'react';
import PitchIntervalArrow from './PitchIntervalArrow';

export interface PitchPathProps {
  pitches: number[];
}

export const PitchPath: FunctionComponent<PitchPathProps> = ({pitches}) => {
  let arrows = [];
  for(let i=1; i < pitches.length; ++i)
    arrows.push(
      <PitchIntervalArrow from={pitches[i-1]} to={pitches[i]} />
    );

  return <>{arrows}</>;
}
