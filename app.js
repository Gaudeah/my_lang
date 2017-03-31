var fs = require('fs');

var funcs = [
    { IF: if_func },
    { VAR: var_func },
    { FUNC: function_func }
];

var rules = [
    { name: "IF", pattern: /^if\s/ },
    { name: "LEFT_PARENT", pattern: /^\(/ },
    { name: "RIGHT_PARENT", pattern: /^\)/ },
    { name: "LEFT_BRACE", pattern: /^\{/ },
    { name: "RIGHT_BRACE", pattern: /^\}/ },
    { name: "VAR", pattern: /^var\s/ },
    { name: "COMPARE", pattern: /^==/ },
    { name: "EQUAL", pattern: /^=/ },
    { name: "INTEGER", pattern: /^\d+/ },
    { name: "STRING", pattern: /^[\'\"][\w\d$]+[\'\"]/ },
    { name: "TEXT", pattern: /^[\w\d$]+/ },
    { name: "FUNC", pattern: /^function\s/ },
    { name: "ENDL", pattern: /^;/ }
];

function error(message) {
    console.log(message);
    process.exit(1);
}

function tokenize() {
    var file;
    var results = Array();

    if (process.argv[2] == undefined) error("Please enter a file name");
    if ((file = fs.readFileSync(process.argv[2], 'utf8'))) {
        file = file.replace('\\n', '\n').replace('\\r', '\r');
        while (file.length > 0) {
            var found = false;
            file = file.trim();
            if (file.length <= 0) break;
            for (var rule of rules) {
                var regex = new RegExp(rule.pattern);
                var match = file.match(regex);
                if (match) {
                    found = true;
                    match = match[0];
                    results.push({ name: rule.name.trim(), value: match });
                    file = file.slice(match.length);
                    break;
                }
            }
            if (!found) error("Token not found : " + file);
        }
    }
    return (results);
}

function if_func(results) {
    console.log("if : " + JSON.stringify(results));
    console.log('');
}

function var_func(results) {
    if (!results[0] || results[0].name !== "TEXT")
        error("Unexepected identifier : " + results[0].value);
    var name = results.splice(0, 1)[0].value;

    if (!results[0] || results[0].value !== "=")
        error("Unexepected identifier : " + results[0].value);
    results.splice(0, 1)[0].value;

    if (!results[0] || (results[0].name !== "STRING" && results[0].name !== "INTEGER"))
        error("Unexepected identifier : " + results[0].value);
    var value = results.splice(0, 1)[0].value;

    console.log(name + " : " + value);
}

function function_func(results) {
    console.log("function : " + JSON.stringify(results));
    console.log('');
}

function parsing(results) {
    while (results.length) {
        if (results[0].name === "ENDL") {
            results[0].name = results.splice(0, 1)[0].name;
            continue;
        }
        var found = false;
        var result = results[0];
        for (var func of funcs) {
            if (func[result.name]) {
                results.splice(results.indexOf(result), 1);
                func[result.name](results);
                found = true;
                break;
            }
        }
        if (!found) error("Unexepected identifier : " + results[0].value);
    }
}

console.log("debut tokenization");
var tokens = tokenize();
console.log("debut parsing");
parsing(tokens);