import { buildBank, SUBJECTS, validateQuestion } from './bank.js';
import { selectQuestion, prepareChoices, adjustLevel, questionStats } from './engine.js';
import { loadState, saveState, validateState, RECENT_LIMIT } from './storage.js';
import { checkWrittenAnswer } from './written-answers.js';

const translations = {
  en: {
    tagline:'A little space to grow', home:'My activities', parent:'Parent space', bank:'Question bank', settings:'Learning settings', language:'Language',
    hello:'Hello, explorer', title:'Little steps.<br>Big discoveries.', intro:'Pick something you like. We’ll take it one question at a time.',
    pace:'Your pace, always', listen:'Listen when you like', short:'Small, gentle sessions', activities:'What shall we explore?', activitiesSub:'Choose your own adventure.',
    math:'Number World', vocabulary:'Word Garden', reading:'Story Time', everyday:'Everyday Adventures',
    mathDesc:'Count, add, and spot patterns.', vocabularyDesc:'Pictures, letters, and little word games.', readingDesc:'Fresh stories to read and explore.', everydayDesc:'Practice asking, choosing, and caring.',
    explore:'Let’s explore', questions:'questions', available:'ready to explore', fresh:'Fresh questions every time', freshDesc:'A growing bank of numbers, words, stories, and everyday moments.',
    grownups:'A little space for grown-ups', grownupsDesc:'Make learning feel right for your child.', openParent:'Open parent space',
    noRush:'No rush. Breaks are always welcome.', local:'Progress and settings stay in this browser.', start:'Start practice', level:'Starting level',
    level1:'Little steps', level2:'Keep exploring', level3:'A new challenge', levelShort:'Level', length:'Questions per session', theme:'Counting pictures',
    garden:'Garden', animals:'Animals', trains:'Trains', space:'Space', adaptive:'Gently adapt the level', adaptiveHelp:'After three independent answers, try the next level. After two supported answers, make it easier.',
    choiceCount:'Answer choices', largeText:'Larger text', spacing:'More letter spacing', autoRead:'Read each new question aloud',
    autoHelp:'Sound starts only when practice begins. Voice availability depends on your device.', save:'Save settings', cancel:'Cancel', close:'Close',
    question:'Question', of:'of', pause:'Take a break', read:'Read aloud', stop:'Stop reading', hint:'A little help', skip:'Try another',
    choose:'Choose an answer.', write:'Write your answer.', writeHelp:'A short answer is enough.', checkAnswer:'Check my answer', writtenRetry:'Read or listen again, then check your answer.', writtenEmpty:'Write an answer first. Take your time.', acceptedForms:'Other accepted written answers for stories (optional; one per line)', good:'You found it!', goodHelp:'You found it with a little help.', retry:'Let’s try another answer.', next:'Next question', finish:'Finish practice',
    hintUsed:'Help is always welcome.', paused:'Time for a little break.', pausedSub:'Stretch, sip some water, or just rest. Your question will be here.', resume:'I’m ready', homeButton:'Back to activities',
    done:'A lovely little step.', doneSub:'You made time to explore. That’s something to feel good about.', tried:'questions explored', again:'Practice again',
    parentTitle:'Make it their kind of learning.', parentSub:'Choose the pace. Follow the small steps. Add what they love.', practiced:'Questions explored', sessions:'Practice sessions', independent:'Answered independently',
    progress:'Small steps, over time', progressSub:'Independent means answered on the first try, without a hint. These counts describe practice, not ability.',
    supported:'with support', skipped:'passed for now', noPractice:'No practice yet. Start with any activity.', manage:'Explore & shape the question bank',
    manageDesc:'Browse the questions, switch any off, or add your own. English and Turkish are separate practice banks.', browse:'Browse question bank',
    backup:'Keep a copy', backupDesc:'Download a backup to move questions and progress to another device. This browser’s data does not sync automatically.', export:'Download backup', import:'Import backup',
    bankTitle:'A world of little questions.', bankSub:'Browse, personalize, and make room for new interests.', allSubjects:'All activities', allLevels:'All levels',
    search:'Search questions', newQuestion:'Add a question', edit:'Edit', enabled:'Included', disabled:'Paused', noResults:'No questions match these filters.',
    previous:'Previous', page:'Page', nextPage:'Next page', correct:'Correct answer', prompt:'Question text', choice1:'Answer 1', choice2:'Answer 2', choice3:'Answer 3 (optional)',
    story:'Short story (optional; one sentence per line)', hintField:'Helpful hint (optional)', subject:'Activity', addTitle:'Make a little question.', editTitle:'Shape this question.',
    editorHelp:'Use a short question and two or three clear answers. Select the correct answer below. In Story Time, children type their answer without seeing choices. You can add other short accepted forms.', saveQuestion:'Save question',
    saved:'Saved.', importError:'That backup could not be imported.', importPreview:'Restore this backup?', importExplain:'This replaces the questions, settings, and progress in this browser. Download your current backup first if you want to keep it.', restore:'Restore backup',
    storageError:'This browser could not save your data. You can still practice, and download a backup from Parent space.', empty:'There are no included questions for this activity. Add a question or switch some back on in Parent space.',
    speechError:'Read-aloud is unavailable right now. Try again, or use your device’s reading tools.', speechUnsupported:'This browser does not support read-aloud. You can use your device’s reading tools.',
    voiceFallback:'A Turkish voice is not installed on this device. Your device will choose its available voice.',
    used:'Used this session', firstTry:'first try', preview:'Preview', resetEdit:'Use original question', enabledCount:'included',
    helpTitle:'A little help', today:'Today', privacy:'No account needed. No child’s name or diagnosis is collected.',
    bankNote:'Stories vary their characters, places, objects, colors, and events. Word games explore pictures, letters, meanings, categories, sentences, and opposites. Recently seen stories and words are avoided when fresh ones are available. Your own questions are included too.',
    searchPlaceholder:'Find a word, story, or question…', questionSaved:'Your question is ready.', backupCount:'custom questions',
    zero:'No sessions yet', choiceRead:'Listen to answers', two:'2 choices', three:'3 choices'
  },
  tr: {
    tagline:'Büyümek için küçük bir alan', home:'Etkinliklerim', parent:'Ebeveyn alanı', bank:'Soru bankası', settings:'Öğrenme ayarları', language:'Dil',
    hello:'Merhaba, küçük kâşif', title:'Küçük adımlar.<br>Büyük keşifler.', intro:'Sevdiğin bir etkinlik seç. Her seferinde bir soruyla ilerleyelim.',
    pace:'Her zaman kendi hızında', listen:'İstersen dinle', short:'Kısa ve sakin çalışmalar', activities:'Neyi keşfedelim?', activitiesSub:'Kendi maceranı seç.',
    math:'Sayı Dünyası', vocabulary:'Kelime Bahçesi', reading:'Hikâye Zamanı', everyday:'Günlük Maceralar',
    mathDesc:'Say, topla, örüntüleri keşfet.', vocabularyDesc:'Resimler, harfler ve kelime oyunları.', readingDesc:'Her çalışmada yeni hikâyeler.', everydayDesc:'İstemeyi, seçmeyi ve özen göstermeyi dene.',
    explore:'Hadi keşfedelim', questions:'soru', available:'keşfetmeye hazır', fresh:'Her çalışmada farklı sorular', freshDesc:'Sayılar, kelimeler, hikâyeler ve günlük anlarla büyüyen bir soru bankası.',
    grownups:'Büyükler için küçük bir alan', grownupsDesc:'Öğrenmeyi çocuğunuza uygun hâle getirin.', openParent:'Ebeveyn alanını aç',
    noRush:'Acele yok. İstediğin zaman mola verebilirsin.', local:'İlerleme ve ayarlar bu tarayıcıda saklanır.', start:'Çalışmaya başla', level:'Başlangıç seviyesi',
    level1:'Küçük adımlar', level2:'Keşfetmeye devam', level3:'Yeni bir deneme', levelShort:'Seviye', length:'Çalışmadaki soru sayısı', theme:'Sayma resimleri',
    garden:'Bahçe', animals:'Hayvanlar', trains:'Trenler', space:'Uzay', adaptive:'Seviyeyi yavaşça ayarla', adaptiveHelp:'Üç bağımsız cevaptan sonra sonraki seviyeyi dene. İki destekli cevaptan sonra kolaylaştır.',
    choiceCount:'Cevap seçenekleri', largeText:'Daha büyük yazı', spacing:'Harf aralığını artır', autoRead:'Her yeni soruyu sesli oku',
    autoHelp:'Ses, çalışma başlayınca açılır. Kullanılabilir sesler cihazınıza bağlıdır.', save:'Ayarları kaydet', cancel:'Vazgeç', close:'Kapat',
    question:'Soru', of:'/', pause:'Mola ver', read:'Sesli oku', stop:'Okumayı durdur', hint:'Biraz yardım', skip:'Başka soru dene',
    choose:'Bir cevap seç.', write:'Cevabını yaz.', writeHelp:'Kısa bir cevap yeterli.', checkAnswer:'Cevabımı kontrol et', writtenRetry:'Tekrar oku veya dinle, sonra cevabını kontrol et.', writtenEmpty:'Önce bir cevap yaz. Acele yok.', acceptedForms:'Hikâyeler için kabul edilen diğer yazılı cevaplar (isteğe bağlı; her satıra bir cevap)', good:'Buldun!', goodHelp:'Biraz yardımla buldun.', retry:'Başka bir cevap deneyelim.', next:'Sonraki soru', finish:'Çalışmayı bitir',
    hintUsed:'Yardım almak her zaman normal.', paused:'Küçük bir mola zamanı.', pausedSub:'Esne, biraz su iç veya dinlen. Soru burada seni bekliyor.', resume:'Hazırım', homeButton:'Etkinliklere dön',
    done:'Güzel bir küçük adım.', doneSub:'Keşfetmek için zaman ayırdın. Bununla mutlu olabilirsin.', tried:'soru keşfedildi', again:'Tekrar çalış',
    parentTitle:'Öğrenme ona uygun olsun.', parentSub:'Hızını seçin. Küçük adımları izleyin. Sevdiklerini ekleyin.', practiced:'Keşfedilen sorular', sessions:'Çalışma sayısı', independent:'Bağımsız cevaplar',
    progress:'Zamanla gelen küçük adımlar', progressSub:'Bağımsız cevap: ipucu almadan ilk denemede cevap vermek. Bu sayılar beceri ölçümü değil, çalışma kaydıdır.',
    supported:'destekle', skipped:'şimdilik geçildi', noPractice:'Henüz çalışma yok. İstediğiniz etkinlikle başlayın.', manage:'Soru bankasını keşfedin ve düzenleyin',
    manageDesc:'Soruları inceleyin, istediğinizi duraklatın veya kendi sorunuzu ekleyin. İngilizce ve Türkçe ayrı çalışma bankalarıdır.', browse:'Soru bankasını aç',
    backup:'Bir kopya saklayın', backupDesc:'Soruları ve ilerlemeyi başka cihaza taşımak için yedek indirin. Bu tarayıcıdaki veriler otomatik eşitlenmez.', export:'Yedek indir', import:'Yedek yükle',
    bankTitle:'Küçük sorularla dolu bir dünya.', bankSub:'İnceleyin, kişiselleştirin, yeni ilgi alanlarına yer açın.', allSubjects:'Tüm etkinlikler', allLevels:'Tüm seviyeler',
    search:'Sorularda ara', newQuestion:'Soru ekle', edit:'Düzenle', enabled:'Dâhil', disabled:'Duraklatıldı', noResults:'Bu filtrelerle eşleşen soru yok.',
    previous:'Önceki', page:'Sayfa', nextPage:'Sonraki sayfa', correct:'Doğru cevap', prompt:'Soru metni', choice1:'Cevap 1', choice2:'Cevap 2', choice3:'Cevap 3 (isteğe bağlı)',
    story:'Kısa hikâye (isteğe bağlı; her satıra bir cümle)', hintField:'Yardımcı ipucu (isteğe bağlı)', subject:'Etkinlik', addTitle:'Küçük bir soru hazırlayın.', editTitle:'Bu soruyu düzenleyin.',
    editorHelp:'Kısa bir soru ve iki ya da üç açık cevap kullanın. Aşağıda doğru cevabı seçin. Hikâye Zamanı’nda çocuk seçenekleri görmeden cevabını yazar. Kabul edilecek başka kısa ifadeler de ekleyebilirsiniz.', saveQuestion:'Soruyu kaydet',
    saved:'Kaydedildi.', importError:'Bu yedek yüklenemedi.', importPreview:'Bu yedek geri yüklensin mi?', importExplain:'Bu tarayıcıdaki soruların, ayarların ve ilerlemenin yerini alır. Mevcut verileri saklamak için önce yedeğinizi indirin.', restore:'Yedeği geri yükle',
    storageError:'Bu tarayıcı verilerinizi kaydedemedi. Çalışmaya devam edebilir, Ebeveyn alanından yedek indirebilirsiniz.', empty:'Bu etkinlikte dâhil edilmiş soru yok. Ebeveyn alanından soru ekleyin veya soruları yeniden açın.',
    speechError:'Sesli okuma şu anda kullanılamıyor. Tekrar deneyin veya cihazınızın okuma araçlarını kullanın.', speechUnsupported:'Bu tarayıcı sesli okumayı desteklemiyor. Cihazınızın okuma araçlarını kullanabilirsiniz.',
    voiceFallback:'Bu cihazda Türkçe ses yüklü değil. Cihazınız mevcut seslerinden birini seçecek.',
    used:'Bu çalışmada kullanıldı', firstTry:'ilk deneme', preview:'Önizleme', resetEdit:'Özgün soruya dön', enabledCount:'dâhil',
    helpTitle:'Biraz yardım', today:'Bugün', privacy:'Hesap gerekmez. Çocuğun adı veya tanısı toplanmaz.',
    bankNote:'Hikâyelerin karakterleri, yerleri, nesneleri, renkleri ve olayları değişir. Kelime oyunlarında resimler, harfler, anlamlar, gruplar, cümleler ve zıt kelimeler var. Yeni seçenekler varken yakın zamanda görülen hikâye ve kelimelerden uzaklaşılır. Eklediğiniz sorular da çalışmalara katılır.',
    searchPlaceholder:'Kelime, hikâye veya soru bulun…', questionSaved:'Sorunuz hazır.', backupCount:'özel soru',
    zero:'Henüz çalışma yok', choiceRead:'Cevapları dinle', two:'2 seçenek', three:'3 seçenek'
  }
};
const root = document.getElementById('app');
let browserStorage;
try { browserStorage=window.localStorage; } catch { browserStorage={getItem:()=>{throw new Error('Storage unavailable');},setItem:()=>{throw new Error('Storage unavailable');}}; }
let loaded = loadState(browserStorage);
let data = loaded.state;
let storageError = loaded.error;
let view = 'home', session = null, speaking = false, speechToken = 0;
let bankFilter = {subject:'',level:'',query:'',page:1};
let dialogReturnFocus = null;
const t = key => translations[data.settings.language][key] || key;
const escape = value => String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icons = { arrow:'M5 12h14m-6-6 6 6-6 6', back:'M19 12H5m6-6-6 6 6 6', sound:'m11 5-6 4H2v6h3l6 4V5Zm4 3a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14', settings:'M4 7h16M4 17h16M8 4v6M16 14v6', home:'m3 10 9-7 9 7v11h-6v-7H9v7H3V10Z', book:'M3 3h6a3 3 0 0 1 3 3v15a4 4 0 0 0-4-2H3V3Zm18 0h-6a3 3 0 0 0-3 3v15a4 4 0 0 1 4-2h5V3Z', plus:'M12 5v14M5 12h14', check:'m5 12 4 4L19 6', pause:'M8 5v14M16 5v14', close:'m6 6 12 12M6 18 18 6', search:'M21 21l-6-6M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0', download:'M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4', leaf:'M20 3C6 2 2 11 6 16s15 2 14-13ZM5 21 16 9', help:'M9 8a3 3 0 1 1 6 0c0 2-3 2-3 5M12 17v.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0', star:'m12 3 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6Z', stop:'M6 6h12v12H6V6Z' };
const icon = name => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="${icons[name]||icons.leaf}"/></svg>`;
const subjectEmoji = {math:'🔢',vocabulary:'🌱',reading:'📖',everyday:'💛'};
const languageSelect = (name='language',value=data.settings.language) => `<select name="${name}" aria-label="${t('language')}"><option value="en" ${value==='en'?'selected':''}>English</option><option value="tr" ${value==='tr'?'selected':''}>Türkçe</option></select>`;
const levelOptions = (selected, all=false) => `${all?`<option value="">${t('allLevels')}</option>`:''}${[1,2,3].map(l=>`<option value="${l}" ${Number(selected)===l?'selected':''}>${l} · ${t('level'+l)}</option>`).join('')}`;
function persist() { storageError=!saveState(browserStorage,data); }
function announce(message) { document.getElementById('announcements').textContent=message; }
function getBank() {
  return [...buildBank(data.settings.language,data.settings.theme).map(q=>{
    const edited=data.overrides[q.id];
    if(!edited)return q;
    if(edited.prompt)return {...edited,id:q.id,contentKey:q.contentKey,family:q.family};
    return {...q,...edited,id:q.id};
  }),...data.custom.filter(q=>q.language===data.settings.language)];
}
function gardenArt() {
  return `<svg class="garden-art" viewBox="0 0 360 230" fill="none" aria-hidden="true"><circle cx="280" cy="51" r="23" fill="#ead89a"/><path d="M9 208c68-45 145-20 190-25 70-8 117-27 153 14v30H9Z" fill="#cbdcbe"/><path d="M79 206v-70" stroke="#50775a" stroke-width="7" stroke-linecap="round"/><path d="M79 160C38 160 30 132 38 110c35 0 47 20 41 50Z" fill="#99b490"/><path d="M79 144c-2-32 22-53 59-49 4 33-20 51-59 49Z" fill="#648966"/><path d="M183 199V91" stroke="#50775a" stroke-width="7" stroke-linecap="round"/><path d="M183 139c-44 0-58-27-50-55 39-2 59 17 50 55Z" fill="#789b72"/><path d="M183 108c-1-39 24-61 68-53 1 38-28 57-68 53Z" fill="#a5ba81"/><path d="M282 198v-44" stroke="#50775a" stroke-width="5" stroke-linecap="round"/><path d="M282 178c-25 0-35-17-29-33 25-1 34 12 29 33Z" fill="#648966"/><path d="M282 166c-1-23 16-37 42-33 0 24-18 36-42 33Z" fill="#a1b88b"/><circle cx="182" cy="68" r="15" fill="#d2ad86"/><circle cx="165" cy="73" r="15" fill="#e1c29c"/><circle cx="172" cy="53" r="15" fill="#e1c29c"/><circle cx="193" cy="53" r="15" fill="#e1c29c"/><circle cx="200" cy="73" r="15" fill="#e1c29c"/><circle cx="182" cy="66" r="10" fill="#f2dfaa"/><path d="m40 47 3-9 4 9 9 3-9 4-4 9-3-9-9-4Z" fill="#b0bba1"/><path d="M250 207h-20m-117 3h-13" stroke="#789b72" stroke-width="3" stroke-linecap="round"/></svg>`;
}
function shell(content) {
  const bankActive=view==='bank';
  return `<div class="layout"><aside class="sidebar"><a href="#/" class="brand" data-action="home"><img src="./icon.svg" alt="" width="42" height="42"><span>Tarik<span class="brand-app">App</span><small>${t('tagline')}</small></span></a><nav aria-label="${t('home')}"><button class="nav-item ${view==='home'||view==='practice'||view==='done'?'active':''}" data-action="home">${icon('home')}${t('home')}</button><button class="nav-item ${bankActive?'active':''}" data-action="bank">${icon('book')}${t('bank')}</button><div class="nav-separator"></div><button class="nav-item ${view==='parent'?'active':''}" data-action="parent">${icon('leaf')}${t('parent')}</button><button class="nav-item" data-action="settings">${icon('settings')}${t('settings')}</button></nav><div class="sidebar-bottom"><span class="little-sprout">${icon('leaf')}</span><p>${t('noRush')}</p><small>${t('local')}</small></div></aside><div class="workspace"><header class="topbar"><span class="breadcrumb">${view==='bank'?t('bank'):view==='parent'?t('parent'):t('home')}</span><div class="top-controls"><div class="language-switch" aria-label="${t('language')}"><button data-action="language" data-lang="en" aria-pressed="${data.settings.language==='en'}">EN<span class="language-full"> · English</span></button><button data-action="language" data-lang="tr" aria-pressed="${data.settings.language==='tr'}">TR<span class="language-full"> · Türkçe</span></button></div><button class="icon-button settings-button" data-action="settings" aria-label="${t('settings')}">${icon('settings')}</button></div></header><main id="main" tabindex="-1">${storageError?`<p class="notice" role="status">${t('storageError')}</p>`:''}${content}</main><footer><span>${icon('leaf')}${t('noRush')}</span><button data-action="parent">${t('parent')}${icon('arrow')}</button></footer></div></div><dialog id="dialog" aria-labelledby="dialog-title"></dialog>`;
}
function home() {
  const bank = getBank();
  return `<section class="hero"><div class="hero-copy"><p class="eyebrow">${icon('leaf')}${t('hello')}</p><h1>${t('title')}</h1><p class="hero-intro">${t('intro')}</p><div class="hero-tags"><span>${icon('check')}${t('pace')}</span><span>${icon('sound')}${t('listen')}</span></div></div>${gardenArt()}</section><section class="activity-section"><div class="section-heading"><div><h2>${t('activities')}</h2><p>${t('activitiesSub')}</p></div><span class="session-pill">${icon('leaf')}${data.settings.length} ${t('questions')}</span></div><div class="activity-grid">${SUBJECTS.map((subject,i)=>{const count=bank.filter(q=>q.subject===subject&&q.enabled!==false).length;return `<button class="activity-card ${subject}" data-action="start" data-subject="${subject}"><div class="card-top"><span class="activity-emoji" aria-hidden="true">${subjectEmoji[subject]}</span><span class="card-number">0${i+1}</span></div><h3>${t(subject)}</h3><p>${t(subject+'Desc')}</p><div class="card-bottom"><span>${count} ${t('questions')}</span><span class="card-arrow">${icon('arrow')}</span></div></button>`;}).join('')}</div></section><section class="discovery-strip"><div class="strip-icon">${icon('book')}</div><div><h3>${t('fresh')}</h3><p>${t('freshDesc')}</p></div><span class="count-badge">${bank.filter(q=>q.enabled!==false).length}<small>${t('available')}</small></span></section><section class="parent-invite"><div><p class="eyebrow">${t('parent')}</p><h3>${t('grownups')}</h3><p>${t('grownupsDesc')}</p></div><button class="button secondary" data-action="parent">${t('openParent')}${icon('arrow')}</button></section>`;
}
function visuals(q) {
  // Reading answers must come from the text, including older saved questions.
  if (q.subject==='reading' || !q.visual) return '';
  const v=q.visual, pic=(x,cls='')=>`<span class="count-object ${cls}" aria-hidden="true">${escape(x)}</span>`;
  if(v.kind==='single') return `<div class="single-picture" aria-hidden="true">${v.items.map(escape).join(' ')}</div>`;
  if(v.kind==='groups') return `<div class="picture-groups" aria-label="${t('math')}">${v.groups.map(g=>`<div class="object-grid">${g.map(x=>pic(x)).join('')}</div>`).join(`<span class="operator" aria-hidden="true">${v.operator}</span>`)}</div>`;
  return `<div class="object-grid ${v.kind==='pattern'?'pattern':''}">${v.items.map((x,i)=>pic(x,v.kind==='subtract'&&i>=v.items.length-v.removed?'crossed':'')).join('')}</div>`;
}
function answerControls(q) {
  if(q.subject==='reading') return `<form id="written-answer-form" class="written-answer-form" novalidate><label class="answer-instruction" for="written-answer">${t('write')}</label><p id="written-help">${t('writeHelp')}</p><input id="written-answer" name="writtenAnswer" type="text" value="${escape(session.draft)}" maxlength="200" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" aria-describedby="written-help${session.feedback&&!session.answered?' answer-feedback':''}" ${session.feedback&&!session.answered?'aria-invalid="true"':''} ${session.answered?'disabled':''}><button class="button check-answer" type="submit" ${session.answered?'disabled':''}>${icon('check')}${t('checkAnswer')}</button></form>`;
  return `<p class="answer-instruction">${t('choose')}</p><div class="answers">${session.choices.map((choice,i)=>`<button class="answer ${session.wrong.includes(choice)?'tried':''} ${session.answered&&choice===q.answer?'correct':''}" data-action="answer" data-choice="${i}" ${session.answered||session.wrong.includes(choice)?'disabled':''}><span class="answer-text">${escape(choice)}</span>${session.answered&&choice===q.answer?icon('check'):''}</button>`).join('')}</div><button class="text-button answer-audio" data-action="read-choices">${icon('sound')}${t('choiceRead')}</button>`;
}
function practice() {
  if(!session?.question) return `<div class="empty-state"><h1>${t(session?.finished?'done':'empty')}</h1><button class="button" data-action="home">${t('homeButton')}</button></div>`;
  if(session.paused) return `<div class="pause-card"><div class="pause-picture">🌿</div><h1>${t('paused')}</h1><p>${t('pausedSub')}</p><button class="button" data-action="resume">${t('resume')}${icon('arrow')}</button><button class="text-button" data-action="home">${t('homeButton')}</button></div>`;
  const q=session.question, index=session.used.length;
  return `<div class="practice-top"><button class="text-button" data-action="home">${icon('back')}${t('homeButton')}</button><button class="button secondary small" data-action="pause">${icon('pause')}${t('pause')}</button></div><div class="practice-heading"><span class="subject-label ${session.subject}">${subjectEmoji[session.subject]} ${t(session.subject)}</span><span>${t('question')} ${index} ${t('of')} ${session.length}</span></div><div class="progress-dots" aria-label="${t('question')} ${index} ${t('of')} ${session.length}">${Array.from({length:session.length},(_,i)=>`<span class="${i<index-1?'complete':i===index-1?'current':''}"></span>`).join('')}</div><section class="question-card ${data.settings.largeText?'large-text':''} ${data.settings.spacing?'spaced':''}"><button class="read-button" data-action="read">${icon(speaking?'stop':'sound')}<span>${t(speaking?'stop':'read')}</span></button>${visuals(q)}${q.story?.length?`<div class="story-text">${q.story.map(line=>`<p>${escape(line)}</p>`).join('')}</div>`:''}${q.equation?`<div class="equation" aria-hidden="true">${escape(q.equation)}</div>`:''}<h1 class="question-prompt">${escape(q.prompt)}</h1>${answerControls(q)}${session.feedback?`<div id="answer-feedback" class="feedback ${session.answered?'success':''}" role="status">${session.answered?icon('check'):icon('leaf')}<div><strong>${t(session.answered?(session.assisted?'goodHelp':'good'):(session.feedback==='empty'?'writtenEmpty':q.subject==='reading'?'writtenRetry':'retry'))}</strong>${session.answered&&q.explanation?`<p>${escape(q.explanation)}</p>`:''}</div></div>`:''}${session.showHint?`<div class="hint-box"><strong>${t('helpTitle')}</strong><p>${escape(q.hint||t('hintUsed'))}</p></div>`:''}${session.answered?`<button class="button next-button" data-action="next">${t(index>=session.length?'finish':'next')}${icon('arrow')}</button>`:`<div class="question-tools"><button class="button secondary" data-action="hint">${icon('help')}${t('hint')}</button><button class="text-button" data-action="skip">${t('skip')}${icon('arrow')}</button></div>`}</section>`;
}
function done() {
  return `<section class="completion"><div class="completion-art">${gardenArt()}</div><p class="eyebrow">${t('pace')}</p><h1>${t('done')}</h1><p>${t('doneSub')}</p><span class="completion-count">${session?.results.length||0} ${t('tried')}</span><div class="completion-actions"><button class="button" data-action="start" data-subject="${session?.subject||'math'}">${t('again')}${icon('arrow')}</button><button class="button secondary" data-action="home">${t('homeButton')}</button></div></section>`;
}
function parent() {
  const stats=questionStats(data.progress,null,data.settings.language);
  const sessions=data.progress.sessions.filter(s=>s.language===data.settings.language).length;
  return `<div class="page-heading"><p class="eyebrow">${icon('leaf')}${t('parent')}</p><h1>${t('parentTitle')}</h1><p>${t('parentSub')}</p></div><div class="stat-grid"><div><span>${t('practiced')}</span><strong>${stats.practiced}</strong></div><div><span>${t('sessions')}</span><strong>${sessions}</strong></div><div><span>${t('independent')}</span><strong>${stats.firstTry}<small> / ${stats.practiced}</small></strong></div></div><section class="panel"><div class="section-heading"><div><h2>${t('progress')}</h2><p>${t('progressSub')}</p></div></div><div class="progress-list">${SUBJECTS.map(s=>{const st=questionStats(data.progress,s,data.settings.language);return `<div class="progress-row"><div class="progress-subject"><span class="subject-circle ${s}">${subjectEmoji[s]}</span><div><strong>${t(s)}</strong><small>${st.practiced?`${st.firstTry} ${t('independent').toLocaleLowerCase(data.settings.language)} · ${st.supported} ${t('supported')} · ${st.skipped} ${t('skipped')}`:t('noPractice')}</small></div></div><span class="practice-total">${st.practiced}</span></div>`;}).join('')}</div></section><div class="parent-panels"><section class="panel"><span class="panel-symbol">${icon('book')}</span><h2>${t('manage')}</h2><p>${t('manageDesc')}</p><button class="button" data-action="bank">${t('browse')}${icon('arrow')}</button></section><section class="panel"><span class="panel-symbol">${icon('settings')}</span><h2>${t('settings')}</h2><p>${data.settings.length} ${t('questions')} · ${t('level'+data.settings.level)} · ${t(data.settings.theme)}</p><button class="button secondary" data-action="settings">${t('settings')}${icon('arrow')}</button></section></div><section class="panel backup-panel"><div><h2>${t('backup')}</h2><p>${t('backupDesc')}</p><small>${t('privacy')}</small></div><div class="backup-buttons"><button class="button secondary" data-action="export">${icon('download')}${t('export')}</button><button class="button secondary" data-action="import">${t('import')}</button><input type="file" id="backup-file" accept=".json,application/json" class="sr-only" aria-label="${t('import')}"></div></section>`;
}
function filteredBank() {
  const query=bankFilter.query.toLocaleLowerCase(data.settings.language);
  return getBank().filter(q=>(!bankFilter.subject||q.subject===bankFilter.subject)&&(!bankFilter.level||q.level===Number(bankFilter.level))&&(!query||[q.prompt,q.story?.join(' '),q.choices.join(' ')].join(' ').toLocaleLowerCase(data.settings.language).includes(query)));
}
function bank() {
  return `<div class="page-heading bank-heading"><div><p class="eyebrow">${icon('book')}${t('bank')}</p><h1>${t('bankTitle')}</h1><p>${t('bankSub')}</p></div><button class="button" data-action="add">${icon('plus')}${t('newQuestion')}</button></div><div class="bank-filters"><label class="search-field">${icon('search')}<span class="sr-only">${t('search')}</span><input id="bank-search" type="search" value="${escape(bankFilter.query)}" placeholder="${t('searchPlaceholder')}"></label><select id="bank-subject" aria-label="${t('subject')}"><option value="">${t('allSubjects')}</option>${SUBJECTS.map(s=>`<option value="${s}" ${s===bankFilter.subject?'selected':''}>${t(s)}</option>`).join('')}</select><select id="bank-level" aria-label="${t('level')}">${levelOptions(bankFilter.level,true)}</select></div><p class="bank-note">${t('bankNote')}</p><div id="bank-results">${bankResults()}</div>`;
}
function bankResults() {
  const questions=filteredBank(), pages=Math.max(1,Math.ceil(questions.length/12));
  bankFilter.page=Math.min(bankFilter.page,pages);
  return `<div class="bank-count">${questions.length} ${t('questions')} <span>· ${questions.filter(q=>q.enabled!==false).length} ${t('enabledCount')}</span></div><div class="bank-grid">${questions.slice((bankFilter.page-1)*12,bankFilter.page*12).map(q=>`<article class="bank-card ${q.enabled===false?'inactive':''}"><div class="bank-card-meta"><span>${subjectEmoji[q.subject]} ${t(q.subject)}</span><small>${t('levelShort')} ${q.level}</small></div>${q.story?.length?`<p class="story-preview">${escape(q.story[0])}</p>`:''}${q.subject!=='reading'&&q.visual?`<div class="bank-visual" aria-hidden="true">${q.visual.kind==='single'?q.visual.items.join(' '):q.equation?escape(q.equation):q.visual.kind==='count'?q.visual.items.join(' '):q.visual.kind==='pattern'?q.visual.items.join(' '):`${q.visual.items?.length||''} ${q.visual.removed?'− '+q.visual.removed:''}`}</div>`:''}<h2>${escape(q.prompt)}</h2><p class="bank-answer">${t('correct')}: <strong>${escape(q.answer)}</strong></p><div class="bank-card-actions"><button class="text-button" data-action="edit" data-id="${escape(q.id)}">${t('edit')}</button><button class="question-switch" role="switch" aria-checked="${q.enabled!==false}" aria-label="${escape(q.prompt)} · ${t('enabled')}" data-action="toggle-question" data-id="${escape(q.id)}"><span class="switch-track"><span></span></span>${t(q.enabled===false?'disabled':'enabled')}</button></div></article>`).join('')}</div>${!questions.length?`<div class="empty-state">${t('noResults')}</div>`:''}<div class="pagination"><button class="button secondary small" data-action="page" data-delta="-1" ${bankFilter.page<=1?'disabled':''}>${icon('back')}${t('previous')}</button><span>${t('page')} ${bankFilter.page} / ${pages}</span><button class="button secondary small" data-action="page" data-delta="1" ${bankFilter.page>=pages?'disabled':''}>${t('nextPage')}${icon('arrow')}</button></div>`;
}
function render(focus=false) {
  document.documentElement.lang=data.settings.language;
  document.title=`TarikApp · ${t(view==='bank'?'bank':view==='parent'?'parent':'home')}`;
  document.querySelector('.skip-link').textContent=data.settings.language==='tr'?'Etkinliğe geç':'Skip to activity';
  root.innerHTML=shell(view==='home'?home():view==='practice'?practice():view==='done'?done():view==='parent'?parent():bank());
  if(focus) document.getElementById('main').focus({preventScroll:true});
}
function stopSpeech() {
  speechToken++;
  if('speechSynthesis' in window) window.speechSynthesis.cancel();
  speaking=false;
}
function speak(text) {
  if(!('speechSynthesis' in window)||!('SpeechSynthesisUtterance' in window)) { toast(t('speechUnsupported')); return; }
  stopSpeech();
  const token=speechToken, utterance=new SpeechSynthesisUtterance(text);
  utterance.lang=data.settings.language==='tr'?'tr-TR':'en-US'; utterance.rate=0.82;
  const voice=window.speechSynthesis.getVoices().find(v=>v.lang.toLowerCase().startsWith(data.settings.language));
  if(voice) utterance.voice=voice;
  speaking=true; updateReadButton();
  utterance.onend=()=>{if(token===speechToken){speaking=false;updateReadButton();}};
  utterance.onerror=event=>{if(token===speechToken){speaking=false;updateReadButton();if(!['canceled','interrupted'].includes(event.error)) toast(t('speechError'));}};
  window.speechSynthesis.speak(utterance);
}
function updateReadButton() { const button=root.querySelector('[data-action="read"]'); if(button) button.innerHTML=`${icon(speaking?'stop':'sound')}<span>${t(speaking?'stop':'read')}</span>`; }
function readQuestion() { if(session?.question) speak([...(session.question.story||[]),session.question.prompt].join(' ')); }
function finishSession() {
  if(!session||session.finished) return;
  // Preserve already attempted questions if a child leaves early.
  if(session.question&&!session.recorded&&(session.wrong.length||session.showHint)) record(false);
  session.finished=true;
}
function navigate(next,hash=true) {
  stopSpeech();
  if(view==='practice'&&next!=='done') finishSession();
  view=next; if(hash) history.pushState(null,'',`#/${next==='home'?'':next}`);
  render(true); window.scrollTo(0,0);
}
function startSession(subject) {
  finishSession(); stopSpeech();
  session={id:crypto.randomUUID(),subject,language:data.settings.language,length:data.settings.length,level:data.settings.level,results:[],used:[],finished:false,paused:false};
  view='practice'; history.pushState(null,'',`#/${subject}`); newQuestion();
}
function newQuestion() {
  stopSpeech();
  const q=selectQuestion(getBank(),{language:session.language,subject:session.subject,level:session.level,recent:data.progress.recent,used:session.used});
  if(!q) { if(session.results.length){finishSession();view='done';} session.question=null;render(true);return; }
  Object.assign(session,{question:q,choices:q.subject==='reading'?[]:prepareChoices(q,data.settings.choices),draft:'',wrong:[],assisted:false,answered:false,recorded:false,showHint:false,feedback:false});
  session.used.push(q.id);
  data.progress.recent=data.progress.recent.filter(id=>id!==q.id);data.progress.recent.push(q.id);data.progress.recent=data.progress.recent.slice(-RECENT_LIMIT);persist();
  render(true);window.scrollTo(0,0);
  if(data.settings.autoRead) readQuestion();
}
function record(completed) {
  if(session.recorded)return;
  session.recorded=true;
  const q=session.question;
  const result={id:q.id,subject:q.subject,language:q.language,level:q.level,firstTry:completed&&!session.assisted,completed,at:new Date().toISOString()};
  session.results.push(result); data.progress.results.push(result); data.progress.results=data.progress.results.slice(-5000);
  data.progress.recent=data.progress.recent.filter(id=>id!==q.id);data.progress.recent.push(q.id);data.progress.recent=data.progress.recent.slice(-RECENT_LIMIT);
  const savedSession=data.progress.sessions.find(s=>s.id===session.id);
  if(savedSession)savedSession.count=session.results.length;
  else data.progress.sessions.push({id:session.id,subject:session.subject,language:session.language,count:session.results.length,at:result.at});
  data.progress.sessions=data.progress.sessions.slice(-300);persist();
}
function nextQuestion() {
  if(!session||session.finished) return;
  session.level=adjustLevel(session.level,session.results,data.settings.adaptive);
  if(session.results.length>=session.length) {finishSession();navigate('done');} else newQuestion();
}
function toast(message) {
  document.querySelector('.toast')?.remove(); const notice=document.createElement('div'); notice.className='toast';notice.setAttribute('role','status');notice.textContent=message;document.body.append(notice);setTimeout(()=>notice.remove(),6000);
}
function openDialog(content) {
  stopSpeech(); updateReadButton(); dialogReturnFocus=document.activeElement;
  const dialog=document.getElementById('dialog');dialog.innerHTML=`<button class="dialog-close icon-button" data-action="close-dialog" aria-label="${t('close')}">${icon('close')}</button>${content}`;dialog.showModal();
}
function closeDialog() {document.getElementById('dialog').close();dialogReturnFocus?.focus?.();}
function checkbox(key,help='') { return `<label class="setting-check"><input type="checkbox" name="${key}" ${data.settings[key]?'checked':''}><span><strong>${t(key)}</strong>${help?`<small>${t(help)}</small>`:''}</span></label>`; }
function settingsDialog() {
  openDialog(`<p class="eyebrow">${t('parent')}</p><h2 id="dialog-title">${t('settings')}</h2><form id="settings-form"><div class="form-grid"><label>${t('language')}${languageSelect()}</label><label>${t('length')}<select name="length">${[3,5,10].map(n=>`<option ${n===data.settings.length?'selected':''} value="${n}">${n}</option>`).join('')}</select></label><label>${t('level')}<select name="level">${levelOptions(data.settings.level)}</select></label><label>${t('choiceCount')}<select name="choices"><option value="2" ${data.settings.choices===2?'selected':''}>${t('two')}</option><option value="3" ${data.settings.choices===3?'selected':''}>${t('three')}</option></select></label><label class="full-width">${t('theme')}<select name="theme">${['garden','animals','trains','space'].map(x=>`<option value="${x}" ${data.settings.theme===x?'selected':''}>${t(x)}</option>`).join('')}</select></label></div><div class="setting-checks">${checkbox('adaptive','adaptiveHelp')}${checkbox('largeText')}${checkbox('spacing')}${checkbox('autoRead','autoHelp')}</div><div class="dialog-actions"><button class="button secondary" type="button" data-action="close-dialog">${t('cancel')}</button><button class="button" type="submit">${t('save')}${icon('check')}</button></div></form>`);
}
let editingId=null;
function editorDialog(id=null) {
  editingId=id;const q=id?getBank().find(q=>q.id===id):null;
  openDialog(`<p class="eyebrow">${t('bank')}</p><h2 id="dialog-title">${t(q?'editTitle':'addTitle')}</h2><p class="dialog-description">${t('editorHelp')}</p><form id="question-form"><div class="form-grid"><label>${t('language')}${languageSelect('language',q?.language||data.settings.language)}</label><label>${t('subject')}<select name="subject">${SUBJECTS.map(s=>`<option value="${s}" ${s===(q?.subject||bankFilter.subject)?'selected':''}>${t(s)}</option>`).join('')}</select></label><label class="full-width">${t('level')}<select name="level">${levelOptions(q?.level||1)}</select></label><label class="full-width">${t('story')}<textarea name="story" rows="3" maxlength="2400">${escape(q?.story?.join('\n')||'')}</textarea></label><label class="full-width">${t('prompt')}<textarea name="prompt" required maxlength="300" rows="2">${escape(q?.prompt||'')}</textarea></label>${[0,1,2].map(i=>`<label class="full-width">${t('choice'+(i+1))}<input name="choice${i}" value="${escape(q?.choices[i]||'')}" ${i<2?'required':''} maxlength="120"></label>`).join('')}<label class="full-width">${t('correct')}<select name="correct">${[0,1,2].map(i=>`<option value="${i}" ${q?.choices.indexOf(q.answer)===i?'selected':''}>${t('choice'+(i+1))}</option>`).join('')}</select></label><label class="full-width">${t('acceptedForms')}<textarea name="acceptedAnswers" maxlength="1450" rows="3">${escape(q?.acceptedAnswers?.join('\n')||'')}</textarea></label><label class="full-width">${t('hintField')}<textarea name="hint" maxlength="500" rows="2">${escape(q?.hint||'')}</textarea></label></div><p id="form-error" class="form-error" role="alert"></p><div class="dialog-actions">${id&&!id.startsWith('custom-')?`<button type="button" class="text-button" data-action="reset-edit" data-id="${escape(id)}">${t('resetEdit')}</button>`:''}<button class="button" type="submit">${t('saveQuestion')}${icon('check')}</button></div></form>`);
}
function downloadBackup() {
  const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));
  const a=document.createElement('a');a.href=url;a.download=`tarikapp-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
let pendingBackup=null;
async function importBackup(file) {
  try {
    if(!file||file.size>5000000) throw new Error('Backup is too large.');
    pendingBackup=validateState(JSON.parse(await file.text()));
    openDialog(`<h2 id="dialog-title">${t('importPreview')}</h2><p>${t('importExplain')}</p><p><strong>${pendingBackup.custom.length}</strong> ${t('backupCount')} · <strong>${pendingBackup.progress.results.length}</strong> ${t('questions')}</p><div class="dialog-actions"><button class="button secondary" data-action="export">${t('export')}</button><button class="button" data-action="restore">${t('restore')}</button></div>`);
  } catch {toast(t('importError'));}
}
document.addEventListener('click',event=>{
  if(event.target.closest('.skip-link')){event.preventDefault();document.getElementById('main').focus();document.getElementById('main').scrollIntoView({block:'start'});return;}
  const button=event.target.closest('[data-action]');if(!button||button.disabled)return;
  const action=button.dataset.action; event.preventDefault();
  if(['home','parent','bank'].includes(action)){navigate(action);return;}
  if(action==='language') {if(button.dataset.lang===data.settings.language)return;finishSession();stopSpeech();data.settings.language=button.dataset.lang;persist();if(view==='practice'||view==='done'){view='home';history.replaceState(null,'','#/');}bankFilter.page=1;render();return;}
  if(action==='start')return startSession(button.dataset.subject);
  if(action==='settings')return settingsDialog();
  if(action==='close-dialog')return closeDialog();
  if(action==='pause'){session.paused=true;stopSpeech();render(true);return;}
  if(action==='resume'){session.paused=false;render(true);return;}
  if(action==='read'){if(speaking){stopSpeech();updateReadButton();}else readQuestion();return;}
  if(action==='read-choices'){if(session?.question?.subject!=='reading')speak(session.choices.join('. '));return;}
  if(action==='hint'){session.assisted=true;session.showHint=true;render();announce(t('hintUsed'));return;}
  if(action==='answer') {
    if(session.answered||session.question.subject==='reading')return;stopSpeech();const choice=session.choices[Number(button.dataset.choice)];session.feedback=true;
    if(choice===session.question.answer){session.answered=true;record(true);render();root.querySelector('[data-action="next"]')?.focus();}
    else {session.assisted=true;session.wrong.push(choice);render();root.querySelector('.answer:not([disabled])')?.focus();}
    return;
  }
  if(action==='next')return nextQuestion();
  if(action==='skip'){stopSpeech();if(!session.answered)record(false);nextQuestion();return;}
  if(action==='add')return editorDialog();
  if(action==='edit')return editorDialog(button.dataset.id);
  if(action==='toggle-question') {const id=button.dataset.id,q=getBank().find(x=>x.id===id);if(!q)return;if(id.startsWith('custom-'))data.custom.find(x=>x.id===id).enabled=q.enabled===false;else data.overrides[id]={...data.overrides[id],enabled:q.enabled===false};persist();document.getElementById('bank-results').innerHTML=bankResults();document.querySelector(`[data-action="toggle-question"][data-id="${id}"]`)?.focus();return;}
  if(action==='reset-edit'){delete data.overrides[button.dataset.id];persist();closeDialog();render();return;}
  if(action==='page'){bankFilter.page+=Number(button.dataset.delta);document.getElementById('bank-results').innerHTML=bankResults();document.querySelector('.bank-filters').scrollIntoView({block:'start'});return;}
  if(action==='export')return downloadBackup();
  if(action==='import')return document.getElementById('backup-file').click();
  if(action==='restore'&&pendingBackup){data=pendingBackup;pendingBackup=null;persist();closeDialog();render();toast(t('saved'));}
});
document.addEventListener('input',event=>{if(event.target.id==='written-answer'&&session&&!session.answered)session.draft=event.target.value;if(event.target.id==='bank-search'){bankFilter.query=event.target.value;bankFilter.page=1;document.getElementById('bank-results').innerHTML=bankResults();}});
document.addEventListener('change',event=>{
  if(['bank-subject','bank-level'].includes(event.target.id)){bankFilter[event.target.id==='bank-subject'?'subject':'level']=event.target.value;bankFilter.page=1;document.getElementById('bank-results').innerHTML=bankResults();}
  if(event.target.id==='backup-file') {importBackup(event.target.files[0]);event.target.value='';}
});
document.addEventListener('submit',event=>{
  if(event.target.id==='written-answer-form') {
    event.preventDefault();
    if(view!=='practice'||!session?.question||session.question.subject!=='reading'||session.answered||session.paused)return;
    session.draft=new FormData(event.target).get('writtenAnswer')||'';
    const result=checkWrittenAnswer(session.question,session.draft);
    stopSpeech();session.feedback=result==='empty'?'empty':true;
    if(result==='correct'){session.answered=true;record(true);render();root.querySelector('[data-action="next"]')?.focus();}
    else {
      if(result==='incorrect'){session.assisted=true;session.wrong.push(true);}
      render();root.querySelector('#written-answer')?.focus();
      announce(t(result==='empty'?'writtenEmpty':'writtenRetry'));
    }
    return;
  }
  if(!['settings-form','question-form'].includes(event.target.id))return;event.preventDefault();const form=new FormData(event.target);
  if(event.target.id==='settings-form') {
    const langChanged=data.settings.language!==form.get('language');
    if(view==='practice'&&(langChanged||session.results.length||session.wrong.length||session.showHint))finishSession();
    data.settings={language:form.get('language'),length:Number(form.get('length')),level:Number(form.get('level')),choices:Number(form.get('choices')),theme:form.get('theme'),adaptive:form.has('adaptive'),largeText:form.has('largeText'),spacing:form.has('spacing'),autoRead:form.has('autoRead')};persist();closeDialog();
    if(view==='practice'){view='home';history.replaceState(null,'','#/');}render();toast(t('saved'));return;
  }
  try {
    const rawChoices=[0,1,2].map(i=>form.get('choice'+i).trim()),answer=rawChoices[Number(form.get('correct'))];
    const previous=editingId?getBank().find(q=>q.id===editingId):null;
    const value=validateQuestion({language:form.get('language'),subject:form.get('subject'),level:Number(form.get('level')),prompt:form.get('prompt'),choices:rawChoices.filter(Boolean),answer,story:form.get('story').split('\n').filter(x=>x.trim()),hint:form.get('hint'),acceptedAnswers:form.get('acceptedAnswers').split('\n').filter(x=>x.trim()),enabled:previous?.enabled});
    if(editingId&&!editingId.startsWith('custom-')) {
      const original=buildBank(data.settings.language,data.settings.theme).find(q=>q.id===editingId);
      // Changed language/subject is a new question; leave the original bank entry intact.
      if(value.language===original.language&&value.subject===original.subject)data.overrides[editingId]=value;
      else {if(data.custom.length>=500)throw new Error('Maximum 500 custom questions.');data.custom.push({...value,id:`custom-${crypto.randomUUID()}`});}
    } else if(editingId) {const index=data.custom.findIndex(q=>q.id===editingId);data.custom[index]={...value,id:editingId};}
    else {if(data.custom.length>=500)throw new Error('Maximum 500 custom questions.');data.custom.push({...value,id:`custom-${crypto.randomUUID()}`});}
    persist();closeDialog();render();toast(t('questionSaved'));
  } catch(error){document.getElementById('form-error').textContent=data.settings.language==='tr'?`Soruyu kaydedemedik. Soru metnini, farklı cevap seçeneklerini ve doğru cevap seçimini kontrol edin. (${error.message})`:error.message;}
});
window.addEventListener('popstate',()=>{const route=location.hash.slice(2);if(SUBJECTS.includes(route)){finishSession();stopSpeech();session={id:crypto.randomUUID(),subject:route,language:data.settings.language,length:data.settings.length,level:data.settings.level,results:[],used:[],finished:false,paused:false};view='practice';newQuestion();}else navigate(['parent','bank'].includes(route)?route:'home',false);});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&view==='practice'){stopSpeech();session.paused=true;render();}});
const initialRoute=location.hash.slice(2)||({'/math':'math','/vocabulary':'vocabulary','/reading':'reading','/reading-tr':'reading','/social-stories':'everyday'}[location.pathname]);
if(location.pathname==='/reading-tr')data.settings.language='tr';
if(SUBJECTS.includes(initialRoute))startSession(initialRoute);else {if(['parent','bank'].includes(initialRoute))view=initialRoute;render();}
if('serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
