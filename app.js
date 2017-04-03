const MyLang = require('./MyLang');

let mylang = new MyLang();

console.log('[ ] Load file...');
mylang.loadFile('test.sf');
console.log('[ ] Tokenize content...');
mylang.tokenize();
console.log('[ ] Parse content...');
mylang.parse();
