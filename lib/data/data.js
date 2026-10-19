import * as fr from "./data-fr";
import * as en from "./data-en";

export const languages = { fr, en };

export const getData = (language) => languages[language] || languages.fr;
