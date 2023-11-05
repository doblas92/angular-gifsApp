const { writeFileSync, mkdirSync } = require('fs');
require('dotenv').config();


const targetPath = './src/environments/environment.ts';
const customVariables = Object.fromEntries(Object.entries(process.env).filter(([k,v]) => k.includes('ZZ_')));
const envFileContent = `export const environment = ${ JSON.stringify(customVariables) }`;

mkdirSync('./src/environments', { recursive: true });

writeFileSync( targetPath, envFileContent );
