import test from 'node:test';
import assert from 'node:assert/strict';
import { buildBank, validateQuestion, SUBJECTS, THEMES } from '../bank.js';
import { prepareChoices, selectQuestion, adjustLevel, questionStats } from '../engine.js';
import { emptyState, cleanSettings, loadState, saveState, validateState, RECENT_LIMIT } from '../storage.js';
import { MORE_STORY_TEMPLATES } from '../more-stories.js';

function random(seed=13) {return ()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};}

test('Every generated arithmetic question is correct in both languages and all picture themes',()=>{
  for(const language of ['en','tr'])for(const theme of Object.keys(THEMES)) {
    const bank=buildBank(language,theme);
    assert.equal(bank.length,24737);
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

test('Expanded vocabulary and stories have stable IDs, supported facts, and genuinely different story texts',()=>{
  for(const language of ['en','tr']) {
    const bank=buildBank(language),words=bank.filter(q=>q.subject==='vocabulary'),stories=bank.filter(q=>q.subject==='reading');
    assert.equal(words.length,1030);assert.equal(stories.length,23064);
    assert.equal(new Set(stories.map(q=>q.story.join(' '))).size,4808);
    assert.equal(new Set(words.filter(q=>q.skill==='picture-word').map(q=>q.answer)).size,130);
    for(const q of stories.filter(q=>q.id.includes('-gen-'))) {
      assert.equal(q.story.length,4,q.id);
      assert.ok(q.story.every(line=>line.length<140),q.id);
      const text=q.story.join(' ').toLocaleLowerCase(language);
      if(language==='en'){assert.ok(!/\ba orange\b/.test(text),q.id);assert.ok(!text.includes('in the balcony'),q.id);}
      const answer=q.answer.toLocaleLowerCase(language).replace(/^(a|an|the) /,'').replace(/berry$/,'berr');
      if(!['story-order','story-weather'].includes(q.skill))assert.ok(text.includes(answer),`${q.id}: ${q.answer} is absent from ${text}`);
      if(q.skill==='story-number')assert.equal(q.choices.filter(choice=>new RegExp(`\\b${choice}\\b`).test(text)).length,1,q.id);
      if(q.skill==='story-color') {
        // A fruit called "orange" can occur elsewhere; check the sentence about the colored object.
        const objects=/mat|cover|bag|bowl|bucket|umbrella|crayon|blocks|ball|pajamas|ticket|box|örtüsü|kapak|kapağı|çanta|kâse|kova|şemsiye|kap|pastel|blok|top|pijama|bilet|kutusu/;
        const lines=q.story.map(line=>line.toLocaleLowerCase(language)).filter(line=>objects.test(line)&&q.choices.some(choice=>line.includes(choice.toLocaleLowerCase(language))));
        assert.equal(lines.length,1,q.id);
        assert.ok(lines[0].includes(answer),q.id);
        assert.equal(q.choices.filter(choice=>lines[0].includes(choice.toLocaleLowerCase(language))).length,1,q.id);
      }
    }
    assert.ok(bank.some(q=>q.id===`${language}-vocabulary-name-0`));
    assert.ok(bank.some(q=>q.id===`${language}-reading-cat-0`));
  }
});

test('Practice changes words, story texts, families, and question types across sessions',()=>{
  const bank=buildBank('tr'),rng=random(41);
  for(const subject of ['vocabulary','reading']) {
    const recent=[],concepts=new Set(),ids=new Set();let previous=null;
    for(let round=0;round<12;round++) {
      const used=[];
      for(let index=0;index<5;index++) {
        const q=selectQuestion(bank,{language:'tr',subject,level:1,used,recent,random:rng});
        assert.ok(!ids.has(q.id));assert.ok(!concepts.has(q.contentKey));
        if(previous)assert.notEqual(q.family,previous.family);
        if(previous&&subject==='vocabulary')assert.notEqual(q.skill,previous.skill);
        used.push(q.id);recent.push(q.id);ids.add(q.id);concepts.add(q.contentKey);previous=q;
      }
    }
    assert.equal(concepts.size,60);
  }
});

test('Reading questions contain no answer-revealing pictures, including every original story',()=>{
  for(const language of ['tr','en']) {
    const questions=buildBank(language).filter(q=>q.subject==='reading');
    assert.equal(questions.filter(q=>q.id.includes('-reading-gen-')).length,5760);
    assert.equal(questions.filter(q=>!q.id.includes('-gen-')&&!q.id.includes('-new-')).length,24);
    for(const q of questions) {
      assert.equal(q.visual,undefined,q.id);
      assert.ok(!/\p{Extended_Pictographic}/u.test([q.prompt,...q.story,...q.choices].join(' ')),q.id);
    }
  }
});

test('New story questions are grounded in their text and vary problems, solutions, outcomes and skills',()=>{
  for(const language of ['tr','en']) {
    const questions=buildBank(language).filter(q=>q.id.includes('-reading-new-'));
    assert.equal(questions.length,17280);
    const normalize=text=>text.toLocaleLowerCase(language).replace(/^(a|an|the) /,'');
    const paths=new Map();
    for(const q of questions) {
      assert.equal(q.story.length,5,q.id);
      assert.ok(q.story.every(line=>line.length<=180),q.id);
      assert.equal(new Set(q.choices).size,3,q.id);
      if(q.skill!=='story-main-idea') {
        const evidence=normalize(q.story[q.evidenceLine]);
        assert.ok(evidence.includes(normalize(q.answer)),q.id+': '+q.answer);
        if(['story-cause','story-sequence','story-result','story-number'].includes(q.skill)) {
          const matches=q.choices.filter(choice=>q.skill==='story-number'?new RegExp('\\b'+choice+'\\b').test(evidence):evidence.includes(normalize(choice)));
          assert.deepEqual(matches,[q.answer],q.id);
        }
      }
      if(q.skill==='story-cause') {
        if(!paths.has(q.family))paths.set(q.family,new Set());
        paths.get(q.family).add(q.answer);
      }
    }
    assert.equal(paths.size,24);
    for(const answers of paths.values())assert.equal(answers.size,3);
    for(const template of MORE_STORY_TEMPLATES)for(const level of [1,2,3]) {
      const atLevel=questions.filter(q=>q.family===template.id&&q.level===level);
      assert.equal(atLevel.length,240,template.id);
      assert.equal(new Set(atLevel.map(q=>q.skill)).size,2,template.id);
    }
  }
});

test('Expanded story-bank exclusions beyond 20000 entries survive backup import',()=>{
  const state=emptyState();
  const questions=buildBank('tr').filter(q=>q.subject==='reading');
  state.overrides=Object.fromEntries(questions.map(q=>[q.id,{enabled:false}]));
  const restored=validateState(JSON.parse(JSON.stringify(state)));
  assert.equal(Object.keys(restored.overrides).length,questions.length);
  assert.deepEqual(restored.overrides[questions.at(-1).id],{enabled:false});
});

test('Two questions about the same story or word are avoided within a session when alternatives exist',()=>{
  const bank=buildBank('en'),rng=random(27);
  for(const subject of ['vocabulary','reading']) {
    const used=[],keys=new Set();
    for(let index=0;index<10;index++) {
      const q=selectQuestion(bank,{language:'en',subject,level:index%3+1,used,random:rng});
      assert.ok(!keys.has(q.contentKey));keys.add(q.contentKey);used.push(q.id);
    }
  }
});

test('When all questions are seen, practice returns to the oldest items instead of the latest ones',()=>{
  const bank=buildBank('en').filter(q=>q.subject==='math'&&q.skill==='add'&&q.level===2).slice(0,20);
  const recent=bank.map(q=>q.id);
  for(let index=0;index<20;index++) {
    const q=selectQuestion(bank,{language:'en',subject:'math',level:2,recent,random:random(index+1)});
    assert.ok(recent.indexOf(q.id)<10);
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

test('Expanded seen-question history survives a save and reload without losing previous settings or edits',()=>{
  const state=emptyState();state.settings.language='tr';
  state.overrides['tr-reading-cat-0']={enabled:false};
  const ids=buildBank('tr').filter(q=>q.subject==='reading').map(q=>q.id);
  state.progress.recent=ids.slice(0,RECENT_LIMIT+1);
  const storage={getItem:()=>JSON.stringify(state)};
  const loaded=loadState(storage);
  assert.equal(loaded.error,false);assert.equal(loaded.state.progress.recent.length,RECENT_LIMIT);
  assert.equal(loaded.state.progress.recent[0],ids[1]);
  assert.equal(loaded.state.settings.language,'tr');
  assert.equal(loaded.state.overrides['tr-reading-cat-0'].enabled,false);
});
