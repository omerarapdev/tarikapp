import { SUBJECTS, validateQuestion } from './bank.js';
const KEY = 'tarikapp-v2';
export const RECENT_LIMIT = 5000;
export const DEFAULTS = { language:'en', length:5, level:1, adaptive:false, choices:3, theme:'garden', largeText:false, spacing:false, autoRead:false };
export function emptyState() { return { version:2, settings:{...DEFAULTS}, custom:[], overrides:{}, progress:{results:[],sessions:[],recent:[]} }; }
export function cleanSettings(value = {}) {
  const settings = {...DEFAULTS};
  if (['en','tr'].includes(value.language)) settings.language=value.language;
  if ([3,5,10].includes(value.length)) settings.length=value.length;
  if ([1,2,3].includes(value.level)) settings.level=value.level;
  if ([2,3].includes(value.choices)) settings.choices=value.choices;
  if (['garden','animals','trains','space'].includes(value.theme)) settings.theme=value.theme;
  for (const key of ['adaptive','largeText','spacing','autoRead']) if(typeof value[key]==='boolean') settings[key]=value[key];
  return settings;
}
export function validateState(value) {
  if (!value || typeof value!=='object' || Array.isArray(value) || value.version!==2) throw new Error('This is not a TarikApp backup.');
  const state = emptyState(); state.settings=cleanSettings(value.settings);
  if (!Array.isArray(value.custom) || value.custom.length>500) throw new Error('A backup can contain up to 500 custom questions.');
  const ids = new Set();
  state.custom=value.custom.map(q=>{
    if (typeof q.id!=='string'||!/^custom-[a-zA-Z0-9-]{1,100}$/.test(q.id)||ids.has(q.id)) throw new Error('Custom question IDs must be unique.');
    ids.add(q.id); return {...validateQuestion(q),id:q.id};
  });
  if (value.overrides && typeof value.overrides==='object' && !Array.isArray(value.overrides)) {
    for (const [id,q] of Object.entries(value.overrides).slice(0,50000)) {
      if (!/^(en|tr)-(math|vocabulary|reading|everyday)-[a-zA-Z0-9-]+$/.test(id)) continue;
      if (q && typeof q==='object' && !Array.isArray(q)) state.overrides[id]= typeof q.prompt==='string' ? {...validateQuestion(q),enabled:q.enabled!==false} : {enabled:q.enabled!==false};
    }
  }
  const progress=value.progress || {};
  if (!Array.isArray(progress.results) || !Array.isArray(progress.sessions) || !Array.isArray(progress.recent)) throw new Error('Backup progress is invalid.');
  state.progress.results=progress.results.slice(-5000).filter(r=>r&&typeof r.id==='string'&&SUBJECTS.includes(r.subject)&&['en','tr'].includes(r.language)&&[1,2,3].includes(r.level)&&typeof r.firstTry==='boolean'&&typeof r.completed==='boolean'&&Number.isFinite(Date.parse(r.at))).map(r=>({id:r.id,subject:r.subject,language:r.language,level:r.level,firstTry:r.firstTry,completed:r.completed,at:r.at}));
  state.progress.sessions=progress.sessions.slice(-300).filter(s=>s&&SUBJECTS.includes(s.subject)&&['en','tr'].includes(s.language)&&Number.isInteger(s.count)&&s.count>=0&&s.count<=10&&Number.isFinite(Date.parse(s.at))).map(s=>({subject:s.subject,language:s.language,count:s.count,at:s.at,...(typeof s.id==='string'&&/^[a-zA-Z0-9-]{1,100}$/.test(s.id)?{id:s.id}:{})}));
  state.progress.recent=progress.recent.filter(id=>typeof id==='string'&&id.length<=180).slice(-RECENT_LIMIT);
  return state;
}
export function loadState(storage) {
  try { const value=storage.getItem(KEY); return {state:value?validateState(JSON.parse(value)):emptyState(),error:false}; }
  catch { return {state:emptyState(),error:true}; }
}
export function saveState(storage,state) {
  try { storage.setItem(KEY,JSON.stringify(state)); return true; } catch { return false; }
}
