"use strict";

const if_func = module.exports = (results) => {
    let conditions = [];
    let fill = [];

    if (results[0].name === "IF")
        results.splice(0, 1)[0].value;

    if (!results[0] || results[0].name !== "LEFT_PARENT")
        error("Unexpected identifier : " + results[0].value);
    results.splice(0, 1)[0].value;

    while (results[0].name !== "RIGHT_PARENT")
    {
        conditions.push(results[0].value);
        results.splice(0, 1)[0].value;
    }

    if (!results[0] || results[0].name !== "RIGHT_PARENT")
        error("Unexpected identifier : " + results[0].value);
    results.splice(0, 1)[0].value;

    if (!results[0] || results[0].name !== "LEFT_BRACE")
        error("Unexpected identifier : " + results[0].value);
    results.splice(0, 1)[0].value;

    while (results[0].name !== "RIGHT_BRACE")
    {
        ///
        // Recursive !!!!!
        ///
        fill.push(if_func(results));
        //fill.push(results[0]);
        //results.splice(0, 1)[0].value;
    }

    if (!results[0] || results[0].name !== "RIGHT_BRACE")
        error("Unexpected identifier : " + results[0].value);
    results.splice(0, 1)[0].value;

    results = { condition: conditions, todo: fill };
    return results;
};

function error(message)
{
    console.log(message);
    process.exit(1);
}
