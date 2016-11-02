import * as agda from "./agda";
import * as types from "./types";

export interface ISettings {
  agda: {
    arguments: string[];
    path: string;
  };
}

export {
  agda,
  types,
};
