import test from 'node:test';
import assert from 'node:assert/strict';
import { buildBank, validateQuestion } from '../bank.js';
import { checkWrittenAnswer, normalizeAnswer } from '../written-answers.js';
import { emptyState, validateState } from '../storage.js';

test('Every reading answer and reviewed short form is accepted; every other bank choice is rejected',()=>{
  for(const language of ['tr','en'])for(const question of buildBank(language).filter(q=>q.subject==='reading')) {
    for(const answer of [question.answer,...(question.acceptedAnswers||[])]) {
      assert.equal(checkWrittenAnswer(question,answer),'correct',question.id+': '+answer);
      assert.equal(checkWrittenAnswer(question,'  '+answer.toLocaleUpperCase(language)+'!  '),'correct',question.id+': case/spacing');
    }
    for(const choice of question.choices.filter(c=>c!==question.answer))assert.equal(checkWrittenAnswer(question,choice),'incorrect',question.id+': '+choice);
    assert.equal(checkWrittenAnswer(question,''),'empty');
    assert.equal(checkWrittenAnswer(question,'...   '),'empty');
  }
});

test('Turkish characters, articles, short place/person forms and number words are supported',()=>{
  const find=(lang,answer)=>buildBank(lang).find(q=>q.subject==='reading'&&q.answer===answer);
  for(const [lang,answer,typed] of [
    ['tr','Kırmızı','KIRMIZI'],['tr','Şeftali','seftali'],['tr','Kütüphaneye','kütüphane'],
    ['tr','Kuşlarla','kuş'],['tr','Babasıyla','baba'],['tr','3','üç'],['tr','Üç','3'],
    ['tr','İki yıldız','2 yıldız'],['tr','Lambayı kapatmak','lambayı kapatıyor'],
    ['en','An apple','apple'],['en','Three','3'],['en','3','three'],['en','Dad','father'],['en','Two stars','2 stars']
  ])assert.equal(checkWrittenAnswer(find(lang,answer),typed),'correct',answer+': '+typed);
  assert.equal(normalizeAnswer('İSTASYON,  ŞİŞE!', 'tr'),'istasyon sise');
});

test('Short story explanations and topic summaries work without requiring a memorized full sentence',()=>{
  for(const [language,id,typed] of [
    ['tr','tr-reading-new-picnic-box-0-2','karıncalar geliyor'],
    ['tr','tr-reading-new-picnic-box-0-3','kapağı kapatıyor'],
    ['tr','tr-reading-new-puzzle-piece-0-4','parçayı buluyor'],
    ['tr','tr-reading-new-puzzle-piece-0-5','yapboz'],
    ['en','en-reading-new-puzzle-piece-0-4','find the piece'],
    ['en','en-reading-new-puzzle-piece-0-5','puzzle']
  ])assert.equal(checkWrittenAnswer(buildBank(language).find(q=>q.id===id),typed),'correct',id);
});

test('Minor noun spelling slips are accepted only when unambiguous; wrong numbers and meanings stay wrong',()=>{
  const red=buildBank('tr').find(q=>q.subject==='reading'&&q.answer==='Kırmızı');
  assert.equal(checkWrittenAnswer(red,'kırmız'),'correct');
  for(const text of ['mavi','kırmızı mavi yeşil','kırmızı değil','hikaye','bilmiyorum'])assert.equal(checkWrittenAnswer(red,text),'incorrect',text);
  const open=buildBank('tr').find(q=>q.id==='tr-reading-new-quiet-reading-4-3');
  for(const text of ['lambayı açmıyor','lambayı kapatıyor','lamba','açmak kapatmak'])assert.equal(checkWrittenAnswer(open,text),'incorrect',text);
  assert.equal(checkWrittenAnswer(open,'lambayı açıyor'),'correct');
  const number=buildBank('tr').find(q=>q.subject==='reading'&&q.answer==='3');
  for(const text of ['4','2 3 4','üç değil','30'])assert.equal(checkWrittenAnswer(number,text),'incorrect',text);
  const adjacent={language:'tr',subject:'reading',skill:'story-person',answer:'Deniz',choices:['Deniz','Denis']};
  assert.equal(checkWrittenAnswer(adjacent,'Deni'),'incorrect');
  assert.equal(checkWrittenAnswer(adjacent,'Denis'),'incorrect');
});

test('Parents can back up edited written answer forms; invalid alias payloads are rejected',()=>{
  const question=validateQuestion({language:'tr',subject:'reading',level:1,prompt:'Kitabın konusu ne?',choices:['Kuşlar','Trenler'],answer:'Kuşlar',acceptedAnswers:['kuş','kuşlarla ilgili']});
  const state=emptyState();state.custom=[{...question,id:'custom-written-test'}];
  const restored=validateState(JSON.parse(JSON.stringify(state)));
  assert.deepEqual(restored.custom[0].acceptedAnswers,question.acceptedAnswers);
  assert.equal(checkWrittenAnswer(restored.custom[0],'kuşlarla ilgili'),'correct');
  for(const acceptedAnswers of ['string',[3],[''],Array(13).fill('word'),['a'.repeat(121)]])assert.throws(()=>validateQuestion({...question,acceptedAnswers}));
});
