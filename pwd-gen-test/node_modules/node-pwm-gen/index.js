'use strict';

const { Command } = require('commander');
const program = new Command();

program
  .name('passwort-generator')
  .description('Ein CLI-Tool zur Passwort-Generierung')
  .option('-l, --length <number>', 'Länge des Passworts', '8')
  .option('-s, --special', 'Sonderzeichen verwenden', false);

program.parse();
const options = program.opts();

function generatePassword(length, useSpecial) {
    const arr = [
        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
        "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
        "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
        "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"
    ];

    const sonder = ["!", "@", "#", "$", "%", "&", "*", "+", "-", "=", "?", "_", "~"]; 

    let availableChars = [...arr];
    if (useSpecial) {
        availableChars = availableChars.concat(sonder);
    }

    let pwd = "";
    const pwdLength = parseInt(length, 10);

    for (let index = 0; index < pwdLength; index++) {
        pwd += availableChars[Math.floor(Math.random() * availableChars.length)];
    }

    return pwd;
}

const finalPassword = generatePassword(options.length, options.special);

console.log('--- Dein generiertes Passwort ---');
console.log(`Länge: ${options.length} | Sonderzeichen: ${options.special ? 'Ja' : 'Nein'}`);
console.log(`Passwort: ${finalPassword}`);

module.exports = generatePassword;
