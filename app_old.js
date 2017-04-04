var fs = require('fs');

var variables = Array();
var functions = Array();

var funcs = [
    { IF: if_func },
    { VAR: var_func },
    { FUNC: function_func }
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

function trait_condition(conditions, results) {
    var verif = false;
    var count = 0;

    if (!conditions) return false;
    for (condition of conditions) {
        if (condition === "==" || condition === "<" || condition === ">") {
            var operand = condition;
            verif = true;
        }
        count++;
    }
    if (verif === false) {
        for (variable of variables) {
            if (variable.name === conditions[count - 1]) {
                console.log("Variable exists");
                break;
            }
        }
    }
    else {
        if (operand === "==") {
            for (variable of variables) {
                if (variable.value === conditions[count - 1]) console.log("If ok");
            }
        }
        else if (operand === "<") {
            for (variable of variables) {
                if (conditions[count - 1] < variable.value && variable.name == conditions[count + 1]) console.log("If ok");
            }
        }
        else if (operand === ">") {
            for (variable of variables) {
                if (conditions[count - 1] > variable.value) console.log("If ok");
            }
        }
        else
        error("The condition doesn't work");
    }

}

function if_func(results) {
    var conditions = Array();
    var fill = Array();

    if (!results[0] || results[0].name !== "LEFT_PARENT")
        error("Unexpected identifier : " + results[0].value);
    results.splice(0, 1)[0].value;

    while (results[0].name != "RIGHT_PARENT") {
        conditions.push(results[0].value);
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

    trait_condition(conditions, results);
    // console.log('New if : ' + 'conditions = ' + JSON.stringify(condition) + ' to do = ' + JSON.stringify(fill));
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
    // variables.push({ name: name, value: results[0].value });
    var value = { type: results[0].name, value: results.splice(0, 1)[0].value };

    // console.log('New var : ' + name + " : " + JSON.stringify(value));
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

    // functions.push({ name: name });
    // console.log('New func : ' + 'arguments = ' + JSON.stringify(argv) + ' to do = ' + JSON.stringify(fill));
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

var tokens = tokenize();
console.log("Fin de la tokenization");
var parsed = parsing(tokens);
console.log("Fin du parsing");