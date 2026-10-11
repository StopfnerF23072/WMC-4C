'use strict';

const { Command } = require('commander');
const generatePassword = require('node-pwm-gen'); 

const program = new Command();

program
  .name('passwort-tester')
  .description('Test-Projekt für den Passwort-Generator')
  .option('-l, --length <number>', 'Länge des Passworts', '10')
  .option('-s, --special', 'Sonderzeichen verwenden', false);

program.parse();
const options = program.opts();

const myNewPassword = generatePassword(options.length, options.special);

console.log('=== TEST AUS DEM ANDEREN PROJEKT ===');
console.log(`Generiertes Passwort: ${myNewPassword}`);