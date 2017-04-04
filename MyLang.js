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
					found = true;
					match = match[0];
					this.tokens.push({ name: rule.name.trim(), value: match });
					content = content.slice(match.length);
					break;
				}
			}
			if (!found) error(`Token not found : ${content.substr(0, content.search(/\s/))}`);
		}
		return this.tokens;
	}

	parse()
    {
		if (this.tokens === undefined)
			throw 'this.tokens can\'t be found.';

		let comment = false;
		let tokens = this.tokens;
		this.result = [];

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
					tokens.splice(tokens.indexOf(token), 1);
                    this.result.push({ name: token.name, value: func[token.name](tokens) });
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
		return this.result;
	}
}

function error(message)
{
	console.log(message);
	process.exit(1);
}

module.exports = MyLang;
