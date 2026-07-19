#!/usr/bin/env node
// MERIDIAN guard: validation + self-report. Runs before every build; build refuses on errors.
const fs=require('fs');
const DB=JSON.parse(fs.readFileSync('db.json','utf8'));
let errs=[],warns=[];
const ids=DB.map(d=>d.id);

// ---------- INTEGRITY (errors block the build) ----------
if(DB.length!==55) warns.push('theater count '+DB.length+' (expected 55)');
const dupes=ids.filter((v,i)=>ids.indexOf(v)!==i); if(dupes.length) errs.push('duplicate ids: '+dupes.join(','));
const req=['id','cat','region','subregion','name','sev','status','esc','trend','domain','esc_history','tier','as_of'];
DB.forEach(d=>{const miss=req.filter(k=>d[k]===undefined);if(miss.length)errs.push(d.id+' missing: '+miss.join(','));});
DB.forEach(d=>{const h=d.esc_history||[];
  if(h.length!==10) errs.push(d.id+' esc_history length '+h.length);
  else if(h[h.length-1]!==d.esc) errs.push(d.id+' esc/history desync: esc='+d.esc+' last='+h[h.length-1]);});
DB.forEach(d=>{if(!d.offmap&&(d.lat==null||d.lon==null||Math.abs(d.lat)>90||Math.abs(d.lon)>180))errs.push(d.id+' bad coords');});
const stg=['mine','process','mid','end'];
DB.forEach(d=>(d.pipeline||[]).forEach(p=>{if(!stg.includes(p.stage))errs.push(d.id+' bad pipeline stage '+p.stage);}));
DB.forEach(d=>(d.refs||[]).forEach(r=>{if(!r.t||!r.u||!/^https?:\/\//.test(r.u))errs.push(d.id+' malformed ref');}));
DB.forEach(d=>{const j=JSON.stringify(d);const bad=j.match(/[\u4e00-\u9fff\ufffd]/);if(bad)errs.push(d.id+' CJK/mojibake: '+bad[0]);});

// ---------- COVERAGE SELF-REPORT (the audit, automated) ----------
const pct=n=>Math.round(n/DB.length*100)+'%';
const hist=DB.filter(d=>d.history&&d.history.bridge&&d.history.sources&&d.history.sources.length).length;
const rival=DB.filter(d=>d.rival).length;
const refs=DB.filter(d=>d.refs&&d.refs.length).length;
const stubs=DB.filter(d=>d.contested&&(!d.contested.claims||!d.contested.claims.length)).length;
const human=DB.filter(d=>d.human).length;
// freshness decay vs today
const mns={Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11};
const today=new Date();
const age=d=>{const p=(d.as_of||'').split(' ');if(p.length<3)return 999;return Math.floor((today-new Date(+p[2],mns[p[1]],+p[0]))/86400000);};
const stale=DB.filter(d=>age(d)>3);
const veryStale=DB.filter(d=>age(d)>7);

console.log('--- COVERAGE ---');
console.log('  cited history   '+hist+'/'+DB.length+'  ('+pct(hist)+')');
console.log('  competing reads '+rival+'/'+DB.length+'  ('+pct(rival)+')');
console.log('  inline sources  '+refs+'/'+DB.length+'  ('+pct(refs)+')   <- back-catalog debt');
console.log('  human ledger    '+human+'/'+DB.length);
console.log('  contested stubs '+stubs+' (intentionally honest)');
console.log('--- FRESHNESS ---');
console.log('  >3 days old: '+stale.length+(stale.length?' ['+stale.slice(0,8).map(d=>d.id).join(',')+(stale.length>8?',…':'')+']':''));
if(veryStale.length) warns.push(veryStale.length+' theaters >7 days unverified: '+veryStale.slice(0,10).map(d=>d.id).join(','));

warns.forEach(w=>console.log('WARN  '+w));
errs.forEach(e=>console.log('ERROR '+e));
console.log(errs.length?('GUARD FAIL ('+errs.length+' errors)'):'GUARD PASS ('+DB.length+' theaters, '+warns.length+' warnings)');
process.exit(errs.length?1:0);
