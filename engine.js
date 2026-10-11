export function shuffle(items, random = Math.random) {
  const result = [...items];
  for (let i=result.length-1;i>0;i--) { const j=Math.floor(random()*(i+1)); [result[i],result[j]]=[result[j],result[i]]; }
  return result;
}
export function prepareChoices(question, count = 3, random = Math.random) {
  return shuffle([question.answer,...shuffle(question.choices.filter(x=>x!==question.answer),random).slice(0,count-1)],random);
}
export function selectQuestion(bank, { language, subject, level, recent = [], used = [], random = Math.random }) {
  const eligible = bank.filter(q=>q.enabled!==false && q.language===language && q.subject===subject);
  if (!eligible.length) return null;
  const available = eligible.filter(q=>!used.includes(q.id));
  if (!available.length) return null;
  const distances = available.map(q=>Math.abs(q.level-level));
  const distance = Math.min(...distances);
  const atLevel = available.filter(q=>Math.abs(q.level-level)===distance);
  const fresh = atLevel.filter(q=>!recent.includes(q.id));
  const pool = fresh.length ? fresh : atLevel;
  // Mix skills rather than drilling the same operation in a whole session.
  const previous = bank.find(q=>q.id===used.at(-1));
  const varied = pool.filter(q=>q.skill!==previous?.skill);
  return shuffle(varied.length?varied:pool,random)[0];
}
export function adjustLevel(level, results, adaptive) {
  if (!adaptive) return level;
  const last = results.slice(-3);
  if (last.length===3 && last.every(r=>r.firstTry && r.level===level)) return Math.min(3,level+1);
  if (last.length>=2 && last.slice(-2).every(r=>!r.firstTry && r.level===level)) return Math.max(1,level-1);
  return level;
}
export function questionStats(progress, subject, language) {
  const results = progress.results.filter(r=>(!subject||r.subject===subject)&&(!language||r.language===language));
  return { practiced:results.length, firstTry:results.filter(r=>r.firstTry).length, supported:results.filter(r=>r.completed&&!r.firstTry).length, skipped:results.filter(r=>!r.completed).length };
}
