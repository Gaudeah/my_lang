"use strict";

module.exports = (results) => {
    if (results[0] === undefined || results[0].name !== 'TEXT')
        error("Unexpected identifier0 : " + results[0].value);

    if (results[1] && results[1].name === "LEFT_PARENT")
        return { name: 'FUNC', value: getFunction(results) };
    else if (results[1] && results[1].name === "EQUAL")
        return { name: 'OPERATION', value: getOperation(results) };
};

function getFunction(results)
{
    if (results[0] === undefined || results[0].name !== "TEXT")
        error("Unexpected identifier : " + results[0].value);
    let name = results.splice(0, 1)[0].value;

    if (results[0] === undefined || results[0].name !== "LEFT_PARENT")
        error("Unexpected identifier : " + results[0].value);
    results.splice(0, 1);

    let params = [];
    while (results[0] && results[0].name !== "RIGHT_PARENT")
    {
        if (results[0].name !== "COMA" && results[0].value !== '+')
        {
                params.push(results[0]);
        }
        results.splice(0, 1);
    }

    if (results[0] && results[0].name === "RIGHT_PARENT")
    {
        results.splice(0, 1);
        return { name: name, params: params };
    }
    error('Missing right parenthesis.');
}

function getOperation(results)
{
    if (!results[0] || results[0].name !== "TEXT")
        error("Unexpected identifier : " + results[0].value);
    let name = results.splice(0, 1)[0].value;

    if (!results[0] || results[0].name !== "EQUAL")
        error("Unexpected identifier : " + results[0].value);
    results.splice(0, 1);

    let value = [];
    while (results[0] && results[0].name !== "ENDL")
    {
        value.push(results[0]);
        results.splice(0, 1);
    }

    if (results[0] && results[0].name === "ENDL")
    {
        results.splice(0, 1);
        return { name: name, value: value };
    }
    error('Missing COMA.');
}

function error(message)
{
    console.log(message);
    process.exit(1);
}
