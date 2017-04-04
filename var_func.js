module.exports = (results) => {
    if (!results[0] || results[0].name !== "TEXT")
        error("Unexpected identifier : " + results[0].value);
    let name = results.splice(0, 1)[0].value;

    if (!results[0] || results[0].value !== "=")
        error("Unexpected identifier : " + results[0].value);
    results.splice(0, 1)[0].value;

    if (!results[0] || (results[0].name !== "STRING" && results[0].name !== "INTEGER"))
        error("Unexpected identifier : " + results[0].value);
    // variables.push({ name: name, value: results[0].value });
    let value = { type: results[0].name, value: results.splice(0, 1)[0].value };

    results = { name: name, value: value.value };
    return results;
    // console.log('New var : ' + name + " : " + JSON.stringify(value));
};