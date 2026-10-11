export function shuffle(items, random = Math.random) {
  const result = [...items];
  for (let i=result.length-1;i>0;i--) { const j=Math.floor(random()*(i+1)); [result[i],result[j]]=[result[j],result[i]]; }
  return result;
}
export function prepareChoices(question, count = 3, random = Math.random) {
  return shuffle([question.answer,...shuffle(question.choices.filter(x=>x!==question.answer),random).slice(0,count-1)],random);
}
export function selectQuestion(bank, { language, subject, level, recent = [], used = [], random = Math.random }) {
  const byId=new Map(bank.map(q=>[q.id,q]));
  const usedIds=new Set(used),recentIds=new Set(recent);
  const eligible = bank.filter(q=>q.enabled!==false && q.language===language && q.subject===subject);
  if (!eligible.length) return null;
  const available = eligible.filter(q=>!usedIds.has(q.id));
  if (!available.length) return null;
  const distances = available.map(q=>Math.abs(q.level-level));
  const distance = Math.min(...distances);
  let atLevel = available.filter(q=>Math.abs(q.level-level)===distance);
  const contentKey=q=>q.contentKey||q.id;
  const usedContent=new Set(used.map(id=>byId.get(id)).filter(Boolean).map(contentKey));
  const differentContent=atLevel.filter(q=>!usedContent.has(contentKey(q)));
  if(differentContent.length)atLevel=differentContent;
  const fresh=atLevel.filter(q=>!recentIds.has(q.id));
  let pool=fresh.length?fresh:atLevel;
  const recentContent=new Set(recent.map(id=>byId.get(id)).filter(Boolean).map(contentKey));
  const newContent=pool.filter(q=>!recentContent.has(contentKey(q)));
  if(newContent.length)pool=newContent;
  else if(!fresh.length) {
    // Once the available pool has been seen, return to the least recently practiced items.
    const positions=new Map(recent.map((id,index)=>[id,index]));
    const oldest=Math.min(...pool.map(q=>positions.get(q.id)??-1));
    const window=Math.max(10,Math.ceil(pool.length/10));
    pool=pool.filter(q=>(positions.get(q.id)??-1)<oldest+window);
  }
  const previous=byId.get(used.at(-1))||[...recent].reverse().map(id=>byId.get(id)).find(q=>q?.language===language&&q?.subject===subject);
  const varied=pool.filter(q=>q.skill!==previous?.skill);
  if(varied.length)pool=varied;
  const recentFamilies=[...new Set([...recent,...used].reverse())].map(id=>byId.get(id)).filter(q=>q?.subject===subject&&q?.language===language&&q.family).slice(0,2).map(q=>q.family);
  const differentFamilies=pool.filter(q=>!q.family||!recentFamilies.includes(q.family));
  if(differentFamilies.length)pool=differentFamilies;
  return pool[Math.floor(random()*pool.length)];
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
