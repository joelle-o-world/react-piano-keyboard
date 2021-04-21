import React, {FunctionComponent} from 'react';
import './Arrow.sass';

export interface ArrowProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  edgePadding?: number;
}

export const Arrow:FunctionComponent<ArrowProps> = ({
  x1, y1,
  x2, y2,
  edgePadding=20,
}) => {
  let left = Math.min(x1, x2) - edgePadding;
  let top = Math.min(y1, y2) - edgePadding;
  let canvasWidth = Math.max(x1, x2) + edgePadding - left;
  let canvasHeight = Math.max(y1,y2) + edgePadding - top;
  let viewBox = `${left} ${top} ${canvasWidth} ${canvasHeight}`
  let style = {
    top: top+'px',
    left: left+'px',
    width: canvasWidth + 'px',
    height: canvasHeight+'px',
    stroke: 'yellow',
    fill: 'blue',
  }

  return <svg style={style} viewBox={viewBox} className="ArrowCanvas">
    <SVGArrow x1={x1} y1={y1} x2={x2} y2={y2}/>
  </svg>
}

export default Arrow




const sq = (x:number) => x * x;
type vector = {x:number, y:number};
const perp = ({x,y}:vector) => ({
  x: -y,
  y: x,
})
const stringifyPoints = (...points: vector[]) => (
  points.map(
    ({x, y}) => `${x} ${y}`
  ).join(' ')
)

export interface SVGArrowProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  endWidth?: number;
  pointWidth?: number;
  pointRatio?: number;
  maxPointLength?: number;
  joinWidth?: number;
}

export const SVGArrow:FunctionComponent<SVGArrowProps> = ({
  x1, y1, x2, y2,
  endWidth=10,
  pointWidth=20,
  maxPointLength=40,
  pointRatio= .25,
  joinWidth=5,
}) => {
  let mag = Math.sqrt(sq(x1-x2) + sq(y1-y2))
  const pointLength = Math.min(maxPointLength, pointRatio * mag);
  let dir = {
    x: (x2 - x1) / mag,
    y: (y2 - y1) / mag,
  }
  let norm = perp(dir);

  let end1 = {
    x: x1 + norm.x * endWidth,
    y: y1 + norm.y * endWidth,
  }
  let end2 = {
    x: x1 - norm.x * endWidth,
    y: y1 - norm.y * endWidth,
  }
  let join = {
    x: x2 - dir.x * pointLength,
    y: y2 - dir.y * pointLength,
  }
  let join1 = {
    x: join.x + norm.x * joinWidth,
    y: join.y + norm.y * joinWidth,
  }
  let join2 = {
    x: join.x - norm.x * joinWidth,
    y: join.y - norm.y * joinWidth,
  }
  let head1 = {
    x: join.x + norm.x * pointWidth,
    y: join.y + norm.y * pointWidth,
  }
  let head2 = {
    x: join.x - norm.x * pointWidth,
    y: join.y - norm.y * pointWidth,
  }
  let point = {x: x2, y: y2};

  const points = stringifyPoints(
    point,
    head1,
    join1,
    end1,
    end2,
    join2,
    head2,
    point,
  )
  

  return <g>
    <line x1={end1.x} y1={end1.y} x2={end2.x} y2={end2.y} />
    <line x1={x1} y1={y1} x2={x2} y2={y2} />
    <polygon points={points} />
  </g>
}
