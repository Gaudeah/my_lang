"use strict";
const MyLang = require('./MyLang');

let mylang = new MyLang();

if (!process.argv[2])
{
     console.log("Please enter a filename");
     process.exit(1);
}

console.log('[ ] Load file...');
mylang.loadFile(process.argv[2]);
console.log('[ ] Tokenize content...');
mylang.tokenize();
console.log('[ ] Parse content...');
let result = mylang.parse();
console.log(JSON.stringify(result, null, 2));

console.log('\n====================================\n');

mylang.play(result);