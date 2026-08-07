#!/usr/bin/env node
// MERIDIAN guard: validation + self-report. Runs before every build; build refuses on errors.
const fs=require('fs');
const DB=JSON.parse(fs.readFileSync('db.json','utf8'));
let errs=[],warns=[];
const ids=DB.map(d=>d.id);

// ---------- INTEGRITY (errors block the build) ----------
if(DB.length<55) warns.push('theater count '+DB.length+' fell below the 55 baseline');
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

  var _cm={};DB.forEach(function(d){var k=d.checkmode||'CHECKED';_cm[k]=(_cm[k]||0)+1});
  console.log('--- CHECK MODE ---');
  console.log('  SWEPT (new material found): '+(_cm.SWEPT||0));
  console.log('  CHECKED (searched, nothing material): '+(_cm.CHECKED||0));
  console.log('  CARRIED (date advanced without individual check): '+(_cm.CARRIED||0)+(_cm.CARRIED>10?'  <- TOO MANY':''));

  var _sp=DB.filter(function(d){return d.spill&&d.spill.length}).length;
  var _spl=DB.reduce(function(a,d){return a+((d.spill||[]).length)},0);
  var _band=function(e){return e>=85?'CRITICAL':e>=70?'SEVERE':e>=55?'ELEVATED':'GUARDED'};
  var _bad=DB.filter(function(d){return d.tier!==_band(d.esc)});
  if(_bad.length) warns.push('TIER BANDS: '+_bad.length+' theaters whose tier does not match their escalation band');

  // --- CSS STRUCTURE (added after a minification pass silently destroyed the stylesheet) ---
  try{
    var _sh=fs.readFileSync('shell.html','utf8');
    var _a=_sh.indexOf('<style>')+7,_b=_sh.indexOf('</style>');
    var _css=_sh.slice(_a,_b);
    var _d=0,_min=0;
    for(var _i=0;_i<_css.length;_i++){ if(_css[_i]==='{')_d++; else if(_css[_i]==='}'){_d--; if(_d<_min)_min=_d;} }
    if(_d!==0) warns.push('CSS BRACES UNBALANCED by '+_d+' \u2014 stylesheet is structurally broken');
    if(_min<0) warns.push('CSS has a stray closing brace (depth went negative)');
    var _nested=0,_dep=0;
    for(var _j=0;_j<_css.length;_j++){ if(_css[_j]==='@'&&_dep!==0)_nested++; if(_css[_j]==='{')_dep++; else if(_css[_j]==='}')_dep--; }
    if(_nested) warns.push('CSS has '+_nested+' at-rule(s) nested inside an unclosed block');
    var _html=_sh.slice(_sh.indexOf('</style>'), _sh.indexOf('<script>'));
    var _used={}, _m;
    var _re=/class="([^"$]+)"/g;
    while((_m=_re.exec(_html))!==null){ _m[1].split(/\s+/).forEach(function(c){ if(c) _used[c]=1; }); }
    var _noRule=Object.keys(_used).filter(function(c){
      return _css.indexOf('.'+c+'{')<0 && _css.indexOf('.'+c+',')<0 && _css.indexOf('.'+c+' ')<0 && _css.indexOf('.'+c+':')<0;
    });
    console.log('--- CSS STRUCTURE ---');
    console.log('  braces balanced: '+(_d===0?'yes':'NO')+'  |  at-rules nested: '+_nested+'  |  classes without a rule: '+_noRule.length);
  }catch(e){ warns.push('CSS check failed: '+e.message); }
  console.log('--- SPILLOVER ---');
  console.log('  theaters mapped: '+_sp+'/'+DB.length+'  ('+_spl+' cross-border links)');
if(veryStale.length) warns.push(veryStale.length+' theaters >7 days unverified: '+veryStale.slice(0,10).map(d=>d.id).join(','));

warns.forEach(w=>console.log('WARN  '+w));
errs.forEach(e=>console.log('ERROR '+e));
console.log(errs.length?('GUARD FAIL ('+errs.length+' errors)'):'GUARD PASS ('+DB.length+' theaters, '+warns.length+' warnings)');
process.exit(errs.length?1:0);
