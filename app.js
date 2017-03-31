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
    { name: "FUNC", pattern: /^function\s/ },
    { name: "STRING", pattern: /^[\'\"][^\'\"]*[\'\"]/ },
    { name: "TEXT", pattern: /^[\w\d$]+/ },
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
    var condition = Array();
    var fill = Array();

    if (!results[0] || results[0].name !== "LEFT_PARENT")
        error("Unexpected identifier : " + results[0].value);
    results.splice(0, 1)[0].value;

    while (results[0].name != "RIGHT_PARENT") {
        condition.push(results[0].value);
        results.splice(0, 1)[0].value;
    }

    if (!results[0] || results[0].name !== "RIGHT_PARENT")
        error("Unexpected identifier : " + results[0].value);
    results.splice(0, 1)[0].value;

    if (!results[0] || results[0].name !== "LEFT_BRACE")
        error("Unexpected identifier : " + results[0].value);
    results.splice(0, 1)[0].value;

    while (results[0].name != "RIGHT_BRACE") {
        fill.push(results[0]);
        results.splice(0, 1)[0].value;
    }

    if (!results[0] || results[0].name !== "RIGHT_BRACE")
        error("Unexpected identifier : " + results[0].value);
    results.splice(0, 1)[0].value;

    console.log('New if : ' + 'conditions = ' + JSON.stringify(condition) + ' to do = ' + JSON.stringify(fill));
}

function var_func(results) {
    if (!results[0] || results[0].name !== "TEXT")
        error("Unexpected identifier : " + results[0].value);
    var name = results.splice(0, 1)[0].value;

    if (!results[0] || results[0].value !== "=")
        error("Unexpected identifier : " + results[0].value);
    results.splice(0, 1)[0].value;

    if (!results[0] || (results[0].name !== "STRING" && results[0].name !== "INTEGER"))
        error("Unexpected identifier : " + results[0].value);
    var value = { type: results[0].name, value: results.splice(0, 1)[0].value };

    console.log('New var : ' + name + " : " + JSON.stringify(value));
}

function function_func(results) {
    var argv = Array();
    var fill = Array();

    if (!results[0] || results[0].name !== "TEXT")
        error("Unexpected identifier : " + results[0].value);
    name = results.splice(0, 1)[0].value;

    if (!results[0] || results[0].name !== "LEFT_PARENT")
        error("Unexpected identifier : " + results[0].value);
    results.splice(0, 1)[0].value;

    while (results[0].name != "RIGHT_PARENT") {
        argv.push(results[0].value);
        results.splice(0, 1)[0].value;
    }
    
    if (!results[0] || results[0].name !== "RIGHT_PARENT")
        error("Unexpected identifier : " + results[0].value);
    results.splice(0, 1)[0].value;

    if (!results[0] || results[0].name !== "LEFT_BRACE")
        error("Unexpected identifier : " + results[0].value);
    results.splice(0, 1)[0].value;

    while (results[0].name != "RIGHT_BRACE") {
        fill.push(results[0]);
        results.splice(0, 1)[0].value;
    }

    if (!results[0] || results[0].name !== "RIGHT_BRACE")
        error("Unexpected identifier : " + results[0].value);
    results.splice(0, 1)[0].value;

    console.log('New func : ' + 'arguments = ' + JSON.stringify(argv) + ' to do = ' + JSON.stringify(fill));
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
        if (!found) error("Unexpected identifier : " + results[0].value);
    }
}

console.log("debut tokenization");
var tokens = tokenize();
console.log("debut parsing");
parsing(tokens);