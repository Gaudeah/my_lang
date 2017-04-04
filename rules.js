"use strict";

module.exports = [
    { name: "IF", pattern: /^if\s/ },
    { name: "B_COM", pattern: /^\/\*/ },
    { name: "E_COM", pattern: /^\*\// },
    { name: "LEFT_PARENT", pattern: /^\(/ },
    { name: "RIGHT_PARENT", pattern: /^\)/ },
    { name: "LEFT_BRACE", pattern: /^{/ },
    { name: "RIGHT_BRACE", pattern: /^}/ },
    { name: "VAR", pattern: /^var\s/ },
    { name: "COMPARE", pattern: /^==/ },
    { name: "EQUAL", pattern: /^=/ },
    { name: "EQUAL", pattern: /^</ },
    { name: "EQUAL", pattern: /^>/ },
    { name: "INTEGER", pattern: /^\d+/ },
    { name: "FUNC", pattern: /^function\s/ },
    { name: "STRING", pattern: /^[\'\"][^\'\"]*[\'\"]/ },
    { name: "TEXT", pattern: /^[\w\d.$]+/ },
    { name: "COMA", pattern: /^,/ },
    { name: "ENDL", pattern: /^;/ }
];
