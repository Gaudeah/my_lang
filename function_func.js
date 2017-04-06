"use strict";

module.exports = (results, callback) => {
    let argv = [];
    let fill = [];

    if (!results[0] || results[0].name !== "TEXT")
        error("Unexpected identifier : " + results[0].value);

    let name = results.splice(0, 1)[0].value;

    if (!results[0] || results[0].name !== "LEFT_PARENT")
        error("Unexpected identifier : " + results[0].value);
    results.splice(0, 1)[0].value;

    while (results[0].name !== "RIGHT_PARENT")
    {
        if (results[0].value !== ',') argv.push(results[0].value);
        results.splice(0, 1)[0].value;
    }

    if (!results[0] || results[0].name !== "RIGHT_PARENT")
        error("Unexpected identifier : " + results[0].value);
    results.splice(0, 1)[0].value;

    if (!results[0] || results[0].name !== "LEFT_BRACE")
        error("Unexpected identifier : " + results[0].value);
    results.splice(0, 1)[0].value;

    let brace_counter = 1;

    while (results[0] !== undefined && brace_counter !== 0)
    {
        if (results[0].name === "LEFT_BRACE")
            ++brace_counter;
        else if (results[0].name === "RIGHT_BRACE")
        {
            --brace_counter;
            if (brace_counter === 0)
                break;
        }

        fill.push(results[0]);
        results.splice(0, 1)[0].value;
    }

    if (!results[0] || results[0].name !== "RIGHT_BRACE")
        error("Unexpected identifier : " + results[0].value);
    results.splice(0, 1)[0].value;

    fill = callback.parse(fill);
    results = { name: name, arguments: argv, todo: fill };
    return results;
};

function error(message)
{
    console.log(message);
    process.exit(1);
}
