# Node-pwm-gen

A Node.js command line tool and module for generating random passwords.

This project uses the `commander` npm package to process command line parameters for password settings such as length and special characters.

---

## Installation

Install the required dependencies using npm:

```bash
npm install

```

## Usage

You can run the script directly from the terminal with various options.

### Default Call (8 characters, no special characters)

```bash
node index.js
```

### Custom Password Length

```bash
node index.js --length 16
# or
node index.js -l 16
```

### Enable Special Characters

```bash
node index.js --special
# or
node index.js -s
```

### Combined Options

```bash
node index.js --length 12 --special
```

---

## Available Options

| Option | Short | Description | Default |
| --- | --- | --- | --- |
| `--length <number>` | `-l` | Sets the length of the generated password | `8` |
| `--special` | `-s` | Includes special characters (`!@#$%&*+-=?_~`) | `false` |
| `--help` | `-h` | Displays all available commands | - |

---

## Usage as a Module

You can also import the generator function into another project:

```javascript
const generatePassword = require('node-pwm-gen');

// Generates a password with length 12 including special characters
const myPassword = generatePassword(12, true);
console.log(myPassword);
