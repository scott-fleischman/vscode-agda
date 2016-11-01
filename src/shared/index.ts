import * as types from "./types";

export interface ISettings {
  agda: {
    debounce: {
      linter: number;
    };
    path: null | string;
  };
}

export {
  types,
};
