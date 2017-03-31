var fs = require('fs');

var rules = [
    { name: "IF", pattern: /^if/ },
    { name: "LEFT_PARENT", pattern: /^\(/ },
    { name: "RIGHT_PARENT", pattern: /^\)/ },
    { name: "LEFT_BRACE", pattern: /^\{/ },
    { name: "RIGHT_BRACE", pattern: /^\}/ },
    { name: "VAR", pattern: /^var/ },
    { name: "EQUAL", pattern: /^=/ },
    { name: "INTEGER", pattern: /^\d+/ },
    { name: "STRING", pattern: /^[\'\"][\w\d$]+[\'\"]/ },
    { name: "TEXT", pattern: /^[\w\d$]+/ },
    {name : "ENDL", pattern: /^;/}
];

function error(message) {
    console.log(message);
    process.exit(1);
}

function tokenize() {
    var file;
    var result = Array();

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
                    result.push({ name: rule.name, value: match });
                    file = file.slice(match.length);
                    break;
                }
            }
            if (!found) error("Token not found : " + file);
        }
        console.log(result);
    }
}

tokenize();