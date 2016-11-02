import * as agda from "./agda";
import * as remote from "./remote";
import * as types from "./types";

export interface ISettings {
  agda: {
    arguments: string[];
    path: string;
  };
}

export {
  agda,
  remote,
  types,
};
