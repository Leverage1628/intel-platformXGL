#!/usr/bin/env node
// tools/auto_fix_db.js
// Performs safe, mechanical fixes on db.json:
//  - remove duplicate entries by id (keep first)
//  - ensure esc_history length is 10 (trim or pad using last value)
//  - ensure last esc_history entry equals esc
//  - ensure ref URLs start with http(s)://, otherwise prefix with http://

const fs = require('fs');
const path = require('path');
const file = path.resolve(__dirname, '..', 'db.json');
let raw;
try{ raw = fs.readFileSync(file,'utf8'); }catch(e){ console.error('db.json not found'); process.exit(0); }
let db;
try{ db = JSON.parse(raw); }catch(e){ console.error('db.json parse error:', e.message); process.exit(1); }
let changed = false;
// remove duplicate ids: keep first occurrence
const seen = new Set();
const out = [];
for(const d of db){ if(seen.has(d.id)){ console.log('duplicate id removed:', d.id); changed = true; continue; } seen.add(d.id); out.push(d); }
// fix esc_history length and last element
for(const d of out){
  if(!Array.isArray(d.esc_history)) { d.esc_history = []; changed = true; }
  const h = d.esc_history;
  if(h.length > 10){ d.esc_history = h.slice(-10); changed = true; }
  if(h.length < 10){ const last = h.length? h[h.length-1] : (typeof d.esc==='number'?d.esc:0); while(d.esc_history.length<10) d.esc_history.push(last); changed = true; }
  // ensure last equals esc
  if(typeof d.esc === 'number'){
    if(d.esc_history[ d.esc_history.length -1 ] !== d.esc){ d.esc_history[d.esc_history.length-1] = d.esc; changed = true; }
  }
  // fix refs urls
  if(Array.isArray(d.refs)){
    for(const r of d.refs){
      if(r.u && !/^https?:\/\//i.test(r.u)){
        r.u = 'http://' + r.u;
        console.log('fixed ref url for', d.id, '->', r.u);
        changed = true;
      }
    }
  }
}
if(changed){ fs.writeFileSync(file, JSON.stringify(out, null, 2)); console.log('db.json auto-fixed and written ('+out.length+' theaters)'); process.exit(0); }
else{ console.log('no mechanical fixes needed'); process.exit(0); }
