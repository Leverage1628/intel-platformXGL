#!/usr/bin/env node
// MERIDIAN builder: db.json + shell.html -> index.html (single-file deliverable)
// Usage: node build.js [outfile]   (default: index.html)  — runs guard.js first; refuses to build on guard failure.
const fs=require('fs');
const {execSync}=require('child_process');
try{ execSync('node guard.js',{stdio:'inherit'}); }catch(e){ console.error('BUILD ABORTED: guard failed'); process.exit(1); }
const db=fs.readFileSync('db.json','utf8');
const shell=fs.readFileSync('shell.html','utf8');
const token='const DB = /*__MERIDIAN_DB__*/;';
if(!shell.includes(token)){ console.error('BUILD ABORTED: token missing in shell.html'); process.exit(1); }
const out=shell.replace(token,'const DB = '+JSON.stringify(JSON.parse(db))+';');
const file=process.argv[2]||'index.html';
fs.writeFileSync(file,out);
console.log('built '+file+' ('+(fs.statSync(file).size/1024).toFixed(0)+'KB)');
