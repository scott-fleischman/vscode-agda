import * as token from "./token";
import * as chevrotain from "chevrotain";

export default new chevrotain.Lexer(token.all);
