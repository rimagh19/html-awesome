#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import inquirer from 'inquirer';
import generateProject from './generateProject.js';

// ANSI Escape Codes for colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',

  // Foreground (text) colors
  fgBlack: '\x1b[30m',
  fgRed: '\x1b[31m',
  fgGreen: '\x1b[32m',
  fgYellow: '\x1b[33m',
  fgBlue: '\x1b[34m',
  fgMagenta: '\x1b[35m', // Pink/Magenta
  fgCyan: '\x1b[36m',
  fgWhite: '\x1b[37m',

  // Background colors
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m', // Pink/Magenta
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m',
};

// Text art for the welcome message
const textArt = `
${colors.fgMagenta}

█░█░█ █▀▀ █░░ █▀▀ █▀█ █▀▄▀█ █▀▀   ▀█▀ █▀█   █░█ ▀█▀ █▀▄▀█ █░░ ▄▄ ▄▀█ █░█░█ █▀▀ █▀ █▀█ █▀▄▀█ █▀▀
▀▄▀▄▀ ██▄ █▄▄ █▄▄ █▄█ █░▀░█ ██▄   ░█░ █▄█   █▀█ ░█░ █░▀░█ █▄▄ ░░ █▀█ ▀▄▀▄▀ ██▄ ▄█ █▄█ █░▀░█ ██▄
${colors.reset}
${colors.fgCyan}
  A magical tool to create HTML projects with a sprinkle of sparkles! ✨
${colors.reset}
`;

// Loading spinner animation
const spinnerFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
let spinnerInterval;

const startSpinner = () => {
  let i = 0;
  spinnerInterval = setInterval(() => {
    process.stdout.write(`\r${colors.fgMagenta}${spinnerFrames[i]}${colors.reset} Loading... `);
    i = (i + 1) % spinnerFrames.length;
  }, 100);
};

const stopSpinner = () => {
  clearInterval(spinnerInterval);
  process.stdout.write('\r'); // Clear the spinner line
};

// Get the project name from the command arguments
const args = process.argv.slice(2);
const projectName = args[0]; // The first argument should be the project name

if (!projectName) {
  console.log(`${colors.fgRed}🚨 Please provide a project name like: npx html-awesome project-name${colors.reset}`);
  process.exit(1);
}

// Define the path for the new project
const projectPath = path.join(process.cwd(), projectName);

// Check if the directory already exists
if (fs.existsSync(projectPath)) {
  console.log(`${colors.fgRed}🚨 A directory with the name "${projectName}" already exists.${colors.reset}`);
  process.exit(1);
}

// Create the project directory
fs.mkdirSync(projectPath);
console.log(`${colors.fgGreen}✨ Creating project: ${colors.fgMagenta}${projectName}${colors.fgGreen} at ${colors.fgMagenta}${projectPath}${colors.reset}`);

// Change the working directory to the project directory and attempt to install dependencies
process.chdir(projectPath);

try {
  console.log(`${colors.fgCyan}📦 Installing dependencies...${colors.reset}`);
  startSpinner();
  // Suppress npm warnings and errors by redirecting stderr to /dev/null (or NUL on Windows)
  execSync('npm install --silent', { stdio: 'ignore' });
  stopSpinner();
  console.log(`${colors.fgGreen}✅ Dependencies installed successfully!${colors.reset}`);
} catch (error) {
  stopSpinner();
  console.log(`${colors.fgRed}⚠️  Dependencies installation skipped.${colors.reset}`);
}

// Now ask the user for project details using Inquirer
const filesQuestion = {
  type: 'checkbox',
  name: 'files',
  message: `${colors.fgMagenta}📄 Select files to include:${colors.reset}`,
  choices: [
    { name: `${colors.fgGreen}index.html${colors.reset}`, value: 'html' },
    { name: `${colors.fgGreen}style.css${colors.reset}`, value: 'css' },
    { name: `${colors.fgGreen}script.js${colors.reset}`, value: 'js' },
  ],
};

const imagesQuestion = {
  type: 'confirm',
  name: 'images',
  message: `${colors.fgMagenta}🖼️  Do you want an ./images directory?${colors.reset}`,
};

const dataQuestion = {
  type: 'confirm',
  name: 'data',
  message: `${colors.fgMagenta}📂 Do you want an ./data directory?${colors.reset}`,
};

// Run the prompt
console.log(textArt);
console.log(`${colors.fgCyan}🌟 Welcome to the ${colors.fgMagenta}${projectName}${colors.fgCyan} project generator!${colors.reset}`);

inquirer
  .prompt([filesQuestion, imagesQuestion, dataQuestion])
  .then((answers) => {
    console.log(`${colors.fgGreen}🎉 Here's what you selected:`);
    console.log(`${colors.fgYellow}- Files: ${answers.files.join(', ')}`);
    console.log(`${colors.fgYellow}- ./images: ${answers.images ? 'Yes' : 'No'}`);
    console.log(`${colors.fgYellow}- ./data: ${answers.data ? 'Yes' : 'No'}${colors.reset}`);

    // Generate the files based on the user input
    generateProject(answers.files, answers.images, answers.data, projectPath);
  })
  .catch((error) => {
    if (error.isTtyError) {
      console.log(`${colors.fgRed}🚨 Error: Couldn't render prompts in this environment.${colors.reset}`);
    } else {
      console.error(`${colors.fgRed}🚨 An error occurred:${colors.reset}`, error);
    }
  });