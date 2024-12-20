import {FilterType} from '../constants.js';

export const filter = {
  [FilterType.EVERYTHING]: (points) => points.filter((point) => point),
  [FilterType.FUTURE]: (points) => points.filter((point) => point),
  [FilterType.PRESENT]: (points) => points.filter((point) => point),
  [FilterType.PAST]: (points) => points.filter((point) => point),
};
