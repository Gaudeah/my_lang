const MyLang = require('./MyLang');

let mylang = new MyLang();

console.log('[ ] Load file...');
if (!process.argv[2]) {
     console.log("Please enter a filename");
     process.exit(1);
}
mylang.loadFile(process.argv[2]);
console.log('[ ] Tokenize content...');
mylang.tokenize();
console.log('[ ] Parse content...');
mylang.parse();
