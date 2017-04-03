
module.exports = [
    { name: "IF", pattern: /^if\s/ },
    { name: "LEFT_PARENT", pattern: /^\(/ },
    { name: "RIGHT_PARENT", pattern: /^\)/ },
    { name: "LEFT_BRACE", pattern: /^\{/ },
    { name: "RIGHT_BRACE", pattern: /^\}/ },
    { name: "VAR", pattern: /^var\s/ },
    { name: "COMPARE", pattern: /^==/ },
    { name: "EQUAL", pattern: /^=/ },
    { name: "EQUAL", pattern: /^</ },
    { name: "EQUAL", pattern: /^>/ },
    { name: "INTEGER", pattern: /^\d+/ },
    { name: "FUNC", pattern: /^function\s/ },
    { name: "STRING", pattern: /^[\'\"][^\'\"]*[\'\"]/ },
    { name: "TEXT", pattern: /^[\w\d$]+/ },
    { name: "ENDL", pattern: /^;/ }
];
