import test from 'node:test';
import assert from 'node:assert/strict';
import { buildBank, validateQuestion, SUBJECTS, THEMES } from '../bank.js';
import { prepareChoices, selectQuestion, adjustLevel, questionStats } from '../engine.js';
import { emptyState, cleanSettings, loadState, saveState, validateState } from '../storage.js';

function random(seed=13) {return ()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};}

test('Every generated arithmetic question is correct in both languages and all picture themes',()=>{
  for(const language of ['en','tr'])for(const theme of Object.keys(THEMES)) {
    const bank=buildBank(language,theme);
    assert.equal(bank.length,741);
    assert.equal(new Set(bank.map(q=>q.id)).size,bank.length);
    for(const q of bank) {
      assert.doesNotThrow(()=>validateQuestion(q),q.id);
      assert.equal(q.choices.filter(c=>c===q.answer).length,1,q.id);
      const arithmetic=q.id.match(/-(add|subtract|compare)-(\d+)-(\d+)$/);
      if(arithmetic) {
        const [,op,rawA,rawB]=arithmetic,a=Number(rawA),b=Number(rawB);
        assert.equal(Number(q.answer),op==='add'?a+b:op==='subtract'?a-b:Math.max(a,b),q.id);
        if(op==='add')assert.equal(q.visual.groups.flat().length,Number(q.answer),q.id);
        if(op==='subtract')assert.equal(q.visual.items.length-q.visual.removed,Number(q.answer),q.id);
      }
      if(q.skill==='count')assert.equal(q.visual.items.length,Number(q.answer),q.id);
      if(q.skill==='sequence')assert.equal(Number(q.id.split('-').at(-1))+1,Number(q.answer),q.id);
    }
    for(const subject of SUBJECTS) for(const level of [1,2,3])assert.ok(bank.some(q=>q.subject===subject&&q.level===level));
  }
});

test('Session selection mixes skills, honors disabled questions, prefers unseen questions, and never repeats',()=>{
  const bank=buildBank('tr'); const rng=random();
  for(const subject of SUBJECTS)for(const level of [1,2,3]) {
    const used=[]; let previous=null;
    for(let i=0;i<10;i++) {
      const q=selectQuestion(bank,{language:'tr',subject,level,used,random:rng});
      assert.ok(q);assert.ok(!used.includes(q.id));assert.equal(q.language,'tr');assert.equal(q.subject,subject);assert.ok(q.enabled);
      const candidates=bank.filter(c=>c.level===level&&c.subject===subject&&!used.includes(c.id));
      if(previous&&candidates.some(c=>c.skill!==previous.skill))assert.notEqual(q.skill,previous.skill);
      used.push(q.id);previous=q;
    }
  }
  const pool=bank.filter(q=>q.subject==='vocabulary'&&q.level===1);
  const q=selectQuestion(pool,{language:'tr',subject:'vocabulary',level:1,recent:pool.slice(1).map(q=>q.id),random:rng});
  assert.equal(q.id,pool[0].id);
  assert.equal(selectQuestion(pool.map(q=>({...q,enabled:false})),{language:'tr',subject:'vocabulary',level:1}),null);
  assert.equal(selectQuestion(pool,{language:'tr',subject:'vocabulary',level:1,used:pool.map(q=>q.id)}),null);
});

test('Short custom banks fall back to the nearest available level without reusing a question',()=>{
  const q=buildBank('en').find(q=>q.subject==='everyday'&&q.level===3);
  assert.equal(selectQuestion([q],{language:'en',subject:'everyday',level:1}).id,q.id);
  assert.equal(selectQuestion([q],{language:'en',subject:'everyday',level:1,used:[q.id]}),null);
});

test('Shuffled answer sets retain exactly one correct choice, with two-choice support',()=>{
  const rng=random(17);
  for(const q of buildBank('tr'))for(const count of [2,3]) {
    const choices=prepareChoices(q,count,rng);
    assert.equal(choices.length,Math.min(count,q.choices.length));
    assert.equal(new Set(choices).size,choices.length);
    assert.equal(choices.filter(c=>c===q.answer).length,1);
  }
  const positions=new Set();const q=buildBank('en')[0];for(let i=0;i<30;i++)positions.add(prepareChoices(q,3,rng).indexOf(q.answer));assert.equal(positions.size,3);
});

test('Adaptation is optional, gradual, bounded, and requires consecutive answers at the current level',()=>{
  const good=Array.from({length:3},()=>({firstTry:true,level:1}));
  assert.equal(adjustLevel(1,good,false),1);assert.equal(adjustLevel(1,good,true),2);
  assert.equal(adjustLevel(1,good.slice(1),true),1);
  assert.equal(adjustLevel(2,[{firstTry:true,level:1},...good.slice(1)],true),2);
  assert.equal(adjustLevel(2,[{firstTry:false,level:2},{firstTry:false,level:2}],true),1);
  assert.equal(adjustLevel(1,[{firstTry:false,level:1},{firstTry:false,level:1}],true),1);
  assert.equal(adjustLevel(3,good.map(r=>({...r,level:3})),true),3);
});

test('Question import rejects ambiguous choices, invalid answers, malformed stories, and excessive content',()=>{
  const q={language:'tr',subject:'reading',level:1,prompt:'Kedi nerede?',choices:['Evde','Bahçede'],answer:'Evde',story:['Kedi evde.']};
  assert.equal(validateQuestion(q).answer,'Evde');
  for(const change of [{choices:['Evde','Evde']},{choices:['Evde',' Evde']},{answer:'Okulda'},{language:'xx'},{level:4},{story:'Not an array'},{prompt:'a'.repeat(301)},{hint:5}])assert.throws(()=>validateQuestion({...q,...change}));
});

test('Backups round-trip Turkish content and progress; duplicate IDs and malformed files are rejected',()=>{
  const state=emptyState();state.settings.language='tr';
  state.custom=[{...validateQuestion({language:'tr',subject:'vocabulary',level:1,prompt:'Hangisi bir hayvan?',choices:['Kedi','Kalem'],answer:'Kedi'}),id:'custom-test-1'}];
  state.progress.results=[{id:'tr-math-count-3',subject:'math',language:'tr',level:1,firstTry:false,completed:true,at:new Date().toISOString()}];
  assert.deepEqual(validateState(JSON.parse(JSON.stringify(state))),state);
  assert.throws(()=>validateState({...state,custom:[state.custom[0],state.custom[0]]}));
  assert.throws(()=>validateState({...state,version:1}));assert.throws(()=>validateState({version:2,custom:[],progress:{}}));
  assert.deepEqual(questionStats(state.progress,'math','en'),{practiced:0,firstTry:0,supported:0,skipped:0});
  assert.equal(questionStats(state.progress,'math','tr').supported,1);
});

test('Storage failures and corrupt saves allow a fresh session without crashing',()=>{
  const blocked={getItem:()=>{throw Error();},setItem:()=>{throw Error();}};
  assert.ok(loadState(blocked).error);assert.equal(saveState(blocked,emptyState()),false);
  assert.ok(loadState({getItem:()=>'{invalid'}).error);
  assert.deepEqual(cleanSettings({length:100,level:7,language:'unknown'}),emptyState().settings);
});
