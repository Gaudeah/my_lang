module.exports = (results) => {
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

    results = { conditions: conditions, todo: fill };
    return results;
    // console.log('New if : ' + 'conditions = ' + JSON.stringify(condition) + ' to do = ' + JSON.stringify(fill));
};