"use strict";
const fs = require('fs');
const rules = require('./rules.js');
const parsing_funcs = require('./parsing_funcs.js');

class MyLang {
	constructor() { }

	loadFile(filename)
	{
		if (typeof filename !== 'string')
			throw 'Filename must be a String.';
		this.content = fs.readFileSync(filename, 'utf8');
		this.content = this.content.replace('\\n', '\n').replace('\\r', '\r');
	}

	tokenize()
    {
		if (this.content === undefined)
			throw 'this.content can\'t be found.';

		let content = this.content;
		this.tokens = [];

		while (content.length > 0)
        {
			let found = false;

			content = content.trim();
			if (content.length <= 0) break;
			for (let rule of rules)
			{
				let regex = new RegExp(rule.pattern);
				let match = content.match(regex);

				if (match)
				{
				    let name = rule.name.trim();
                    let value = name !== 'STRING' ? match[0] : match[0].substr(1, match[0].length - 2);

					found = true;
					this.tokens.push({ name: name, value: value });
					content = content.slice(match[0].length);
					break;
				}
			}
			if (!found)
            {
                let end = content.search(/\s/);
                error(`Token not found : ${end !== -1 ? content.substr(0, content.search(/\s/)) : content}`);
            }
		}
		return this.tokens;
	}

	parse(params)
    {
		if (params === undefined && this.tokens === undefined)
			throw 'this.tokens can\'t be found.';

		let comment = false;
		let tokens = params !== undefined ? params : this.tokens;
		let result = [];

		while (tokens.length)
        {
            if (tokens[0].name === "B_COM")
                comment = true;
            else if (tokens[0].name === "E_COM")
                comment = false;

			if (comment || tokens[0].name === "ENDL" || tokens[0].name === "E_COM")
			{
				tokens[0].name = tokens.splice(0, 1)[0].name;
				continue;
			}

			let found = false;
			let token = tokens[0];

			for (let func of parsing_funcs)
			{
				if (func[token.name])
				{
					if (token.name === 'TEXT')
                    {
                        result.push(func[token.name](tokens));
                    }
                    else
                    {
                        tokens.splice(0, 1);
                        result.push({ name: token.name, value: func[token.name](tokens, this) });
                    }
					found = true;
					break;
				}
			}
			if (!found)
            {
                let val = token.value;
                let end = val.search(/\s/);
                error(`Unexpected identifier : ${end === -1 ? val : val.substr(0, end)}`);
            }
		}
		if (params === undefined)
		    this.result = result;
		return result;
	}

	play(arr_parse, func_name = 'main', variables = {})
    {
        let main = null;
        let save = arr_parse;

        for (let elem of save)
            if (elem.name === 'FUNC' && elem.value.name === func_name)
                main = elem.value;

        if (main === null)
            error(`Can't find the '${func_name}' function.`);

        for (let tmp of main.todo)
        {
            if (tmp.name === 'VAR')
                variables[tmp.value.name] = tmp.value.value;
            else if (tmp.name === 'FUNC' && tmp.value.name === 'print')
                print_func(tmp.value.params, variables);
            else if (tmp.name === 'FUNC')
                this.play(arr_parse, tmp.value.name, variables);
            else if (tmp.name === 'ASSIGN')
                variables[tmp.value.name] = tmp.value.value[0].value;
            else
                error(`Unexpected identifier : ${tmp.value.name}`);
        }
    }
}

function error(message)
{
	console.log(message);
	process.exit(1);
}

function print_func(params, variables)
{
    let string = "";
    for (let param of params)
    {
        string += param.name === 'TEXT' ? variables[param.value] : param.value;
    }
    console.log(string);
}

module.exports = MyLang;
