import './extend-prototypes';
import { lib, Run, recursiveWithMemory } from './lib';
import {
  Direction,
  Point,
  Polygon,
  BaseLocation,
  BaseLocationMap,
  LocationRunner,
  BaseArea,
} from './geometry';

export {
  lib,
  recursiveWithMemory as recursiveWithMemo,
  type Run,
  BaseLocation,
  BaseLocationMap,
  LocationRunner,
  Direction,
  BaseArea,
  type Point,
  Polygon,
};
