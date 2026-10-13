// Curated short forms for reading answers. This is a local text checker, not an
// open-ended language model: only the answer and these reviewed forms are accepted.
// Rows match each story's three paths, in cause/action/result order (EN/TR pairs).
const pathAnswers = {
  'missing-mitten': [
    ['missing mitten|lost mitten','eldiven kayıp|eldiven yok','look in the pocket','cebe bakmak|montun cebine bakmak','find the mitten','eldiveni bulmak|eldiveni buluyor'],
    ['wet mitten','eldiven ıslak','get a dry mitten','kuru eldiven almak','dry hands','elleri kuru|kuru eller'],
    ['hole in the mitten','eldiven delik|eldivende delik var','ask for a repair','eldiveni onarmak|eldiveni tamir ettirmek','hole is closed','delik kapanıyor|eldiven onarılıyor']
  ],
  'toy-repair': [
    ['wheel fell off','tekerlek çıkmış|tekerlek çıkıyor','attach the wheel','tekerleği takmak|tekerleği takıyor','car moves again','araba ilerliyor|araba hareket ediyor'],
    ['string around the wheel','tekerleğe ip dolanmış','remove the string','ipi çıkarmak|ipi çıkarıyor','wheel turns again','tekerlek dönüyor'],
    ['block in the way','yolda blok var|yol kapalı','move the block','bloğu kutuya koymak|bloğu kaldırmak','track is clear','yol açılıyor|yol açık']
  ],
  'quiet-reading': [
    ['noisy room|too much noise','oda gürültülü|gürültü var','go to a quiet room','sessiz odaya geçmek|sessiz bir yere gitmek','hear the story','hikâyeyi duyuyor|hikâyeyi duyabiliyor'],
    ['lamp is off','lamba kapalı','turn on the lamp','lambayı açmak|lambayı açıyor','see the words','kelimeleri görüyor|kelimeleri görebiliyor'],
    ['no space on the chair','sandalyede yer yok','put the toys in a box','oyuncakları kutuya koymak','space to read','okumak için yer açılıyor|yer açılıyor']
  ],
  'museum-map': [
    ['cannot find the train room','tren odasını bulamıyor','follow the map arrow','haritadaki oku izlemek|tren odası okunu izlemek','reach the train room','tren odasına ulaşıyor'],
    ['cannot find the coat room','mont odasını bulamıyor','ask a museum worker','müze görevlisine sormak|görevliden odayı göstermesini istemek','reach the coat room','mont odasına ulaşıyor'],
    ['cannot find the exit','çıkışı bulamıyor','look for the exit sign','çıkış tabelasını aramak','find the exit','çıkışı buluyor']
  ],
  'garden-labels': [
    ['wind blows the label away','rüzgâr etiketi uçuruyor','clip the label','etiketi mandalla tutturmak','label stays in place','etiket yerinde kalıyor'],
    ['wet paper label','etiket ıslanıyor|etiket yumuşuyor','cover the label','etiketi kılıfa koymak','label stays dry','etiket kuru kalıyor'],
    ['faint plant name','bitkinin adı silik|adı okunmuyor','use a darker pencil','koyu kalemle yazmak','read the plant name','bitkinin adını okuyabiliyor']
  ],
  'paper-boat': [
    ['hole in the paper','kâğıt delik|kâğıtta delik var','fold new paper','yeni kâğıt katlamak','boat has no hole','teknede delik yok'],
    ['boat tips over','tekne devriliyor','make the bottom wider','teknenin altını genişletmek','boat stays upright','tekne dik duruyor'],
    ['bowl is too small','kâse küçük|kâse çok küçük','use a bigger bowl','büyük kâse kullanmak','room to float','tekne yüzebiliyor|tekneye yer açılıyor']
  ],
  'picnic-box': [
    ['ants coming to the box','karıncalar geliyor|karıncalar kutuya geliyor','close the lid','kapağı kapatmak|kapağı kapatıyor','ants cannot get the food','karıncalar yiyeceğe ulaşamıyor'],
    ['box in the sun','kutu güneşte|kutu güneşin altında','move it into the shade','kutuyu gölgeye taşımak','food in the shade','yiyecek gölgede|yiyecek güneşte kalmıyor'],
    ['lid fell on the ground','kapak yere düşmüş','wash the lid','kapağı yıkamak|kapağı yıkatmak','clean lid','kapak temiz|kapak temizleniyor']
  ],
  'kite-string': [
    ['knot in the string','ipte düğüm var','undo the knot','düğümü çözmek','string ready','ip hazır|ip kullanıma hazır'],
    ['loose kite tail','uçurtmanın kuyruğu çıkmış','attach the tail','kuyruğu takmak','tail attached','kuyruk takılıyor'],
    ['no wind','rüzgâr yok','save it for a windy day','rüzgârlı günü beklemek|uçurtmayı saklamak','ready for another day','uçurtma başka güne hazır']
  ],
  'paint-drying': [
    ['wet paint','boya ıslak','leave it on a flat table','resmi masada bekletmek','paint dries','boya kuruyor'],
    ['paper corners curl','kâğıdın köşeleri kıvrılıyor','put weights on the corners','köşelere ağırlık koymak','paper lies flat','kâğıt düz duruyor'],
    ['no space on the wall','duvarda yer yok','put it in a folder','resmi dosyaya koymak','painting stored safely','resim saklanıyor']
  ],
  'bubble-mixture': [
    ['empty cup','kap boş','add bubble mixture','baloncuk sıvısı eklemek','mixture in the cup','kapta sıvı var'],
    ['wand not dipped','çubuk sıvıya batırılmamış','dip the wand','çubuğu sıvıya batırmak','bubble forms','baloncuk oluşuyor'],
    ['bubbles going toward the road','baloncuklar yola gidiyor','move into the garden','bahçenin içine geçmek','play away from the road','yoldan uzakta oynuyor']
  ],
  'lunch-bag': [
    ['loose bottle lid','şişenin kapağı gevşek','tighten the lid','şişenin kapağını kapatmak|kapağı sıkmak','water stays in the bottle','su şişede kalıyor'],
    ['no napkin','peçete yok','add a napkin','peçete eklemek','napkin ready','peçete hazır'],
    ['unwrapped sandwich','sandviç sarılmamış','put it in a food box','sandviçi kutuya koymak','sandwich protected','sandviç korunuyor']
  ],
  'recycling-labels': [
    ['no labels','etiket yok','add paper and plastic labels','kâğıt ve plastik etiketi koymak|etiket eklemek','know which bin to use','hangi kutuyu kullanacağını biliyor'],
    ['paper bin full','kâğıt kutusu dolu','get another paper bin','başka kâğıt kutusu istemek','space for paper','kâğıt için yer açılıyor'],
    ['plastic bottle in the paper bin','plastik şişe kâğıt kutusunda','put it in the plastic bin','şişeyi plastik kutusuna koymak','bottle in the right bin','şişe doğru kutuda']
  ],
  'library-return': [
    ['cannot find the return desk','teslim masasını bulamıyor','ask the librarian','kütüphaneciye sormak','reach the return desk','teslim masasına ulaşıyor'],
    ['bookmark in the book','kitapta ayraç kalmış','take out the bookmark','ayracı çıkarmak','bookmark in the bag','ayraç çantaya konuyor'],
    ['book missing from the bag','kitap çantada yok','check the shelf at home','evdeki rafa bakmak','find the book','kitabı rafta buluyor|kitabı buluyor']
  ],
  'train-ticket': [
    ['ticket not in the front pocket','bilet ön cepte yok','look in the other pocket','diğer cebe bakmak','find the ticket','bileti buluyor'],
    ['cannot read the platform number','peron numarasını okuyamıyor','ask a station worker','istasyon görevlisine sormak','know the platform','peronu öğreniyor'],
    ['train has not arrived','tren gelmemiş','wait in the waiting area','bekleme alanında beklemek','ready when the train arrives','tren geldiğinde hazır']
  ],
  'puzzle-piece': [
    ['missing puzzle piece','yapboz parçası eksik|parça eksik','look under the tray','tepsinin altına bakmak','find the piece','parçayı buluyor|eksik parçayı bulmak'],
    ['upside down piece','parça ters','turn the piece over','parçayı çevirmek','see the picture','resmi görebiliyor'],
    ['pieces from two puzzles','parçalar farklı yapbozlara ait','sort the pieces','parçaları ayırmak','pieces sorted','parçalar ayrılıyor']
  ],
  'plant-watering': [
    ['empty watering can','sulama kabı boş','fill the can','kabı doldurmak|su doldurmak','water ready','su hazır'],
    ['pot on its side','saksı yatmış|saksı devrilmiş','stand the pot upright','saksıyı dik koymak','plant upright','bitki dik duruyor'],
    ['leaves covering the path','yapraklar yolu kapatıyor','collect the leaves','yaprakları toplamak','path clear','yol açılıyor']
  ],
  'treasure-note': [
    ['cannot read the table clue','masa ipucunu okuyamıyor','read the clue and look under the table|look under the table','masanın altına bakmak','find the note under the table','notu masanın altında buluyor'],
    ['cannot read the bookcase clue','kitaplık ipucunu okuyamıyor','read the clue and look beside the bookcase|look beside the bookcase','kitaplığın yanına bakmak','find the note beside the bookcase','notu kitaplığın yanında buluyor'],
    ['cannot read the toy box clue','oyuncak kutusu ipucunu okuyamıyor','read the clue and look inside the toy box|look inside the toy box','oyuncak kutusunun içine bakmak','find the note in the toy box','notu oyuncak kutusunda buluyor']
  ],
  'taking-turns': [
    ['both want the same toy','ikisi aynı oyuncağı istiyor','take turns','sırayla oynamak','both get a turn','ikisi de oynuyor|sırayla oynuyor'],
    ['toy needs two people','oyuncak için iki kişi gerekiyor','play together','birlikte oynamak','play as a pair','iki kişi oynuyor'],
    ['do not know who goes first','kimin önce oynayacağını bilmiyor','ask a grown-up for a fair plan','adil plan için yardım istemek','know the order','sıralarını öğreniyor']
  ],
  'bus-queue': [
    ['cannot find the end of the queue','sıranın sonunu bilmiyor','ask where the queue ends','sıranın sonunu sormak','wait at the end','sıranın sonunda bekliyor'],
    ['branch hides the sign','dal tabelayı kapatıyor','read the timetable','saat çizelgesini okumak','know when the bus comes','otobüsün geliş saatini öğreniyor'],
    ['rain at the stop','yağmur yağıyor','go under the shelter','durağın çatısı altına geçmek','wait out of the rain','ıslanmadan bekliyor']
  ],
  'pet-space': [
    ['empty water bowl','su kabı boş','add fresh water','taze su eklemek','pet has water','hayvanın suyu oluyor'],
    ['dirty pet mat','minder kirli','put down a clean mat','temiz minder koymak','clean resting place','temiz dinlenme yeri oluyor'],
    ['toy blocks the bed','oyuncak yatağı kapatıyor','put the toy in a box','oyuncağı kutuya koymak','pet reaches its bed','hayvan yatağına ulaşıyor']
  ],
  'music-practice': [
    ['missing music page','müzik sayfası kayıp','look in the music folder','müzik dosyasına bakmak','find the music page','müzik sayfasını buluyor'],
    ['stand too low','nota sehpası alçak','raise the stand','sehpayı yükseltmek','read the music','notaları okuyabiliyor'],
    ['page keeps falling','sayfa düşüyor','clip the page','sayfayı mandalla tutturmak','page stays in place','sayfa yerinde kalıyor']
  ],
  'craft-table': [
    ['mixed pencils','kalemler karışmış','put pencils in a cup','kalemleri bardağa koymak','pencils easy to find','kalemler kolay bulunuyor'],
    ['no paper on the table','masada kâğıt yok','bring paper from the shelf','raftan kâğıt getirmek','table ready for drawing','masa resme hazır'],
    ['stuck glue lid','yapıştırıcının kapağı sıkışmış','ask a grown-up to open the lid','kapağı açtırmak|yetişkinden kapağı açmasını istemek','glue ready','yapıştırıcı hazır']
  ],
  'building-bridge': [
    ['sides too far apart','kenarlar çok uzak','move the sides closer','kenarları yaklaştırmak','block reaches both sides','blok iki kenara ulaşıyor'],
    ['one side too low','bir kenar alçak','add a block under the low side','alçak kenara blok eklemek','sides the same height','kenarlar aynı yükseklikte'],
    ['bridge on a cushion','köprü minderde','build on the flat floor','düz zeminde yapmak','bridge stands firmly','köprü sağlam duruyor']
  ],
  'changing-plan': [
    ['rain before the game','yağmur başlıyor','choose an indoor game','evde oyun seçmek','game to play indoors','evde oyun oynuyor'],
    ['need more players','daha çok oyuncu gerekiyor','choose a two-player game','iki kişilik oyun seçmek','play with the people present','yanındakilerle oynuyor'],
    ['feeling tired','yorgun hissediyor','rest before playing','oyundan önce dinlenmek','rest before the game','oyundan önce dinleniyor']
  ]
};

const topics = {
  'missing-mitten':['mitten|finding a mitten','eldiven|eldiven bulmak'],
  'toy-repair':['toy car|fixing a toy car','oyuncak araba|araba tamiri'],
  'quiet-reading':['quiet reading|reading in a quiet place','sessiz yerde okumak|kitap okumak'],
  'museum-map':['museum map|finding rooms at the museum','müze haritası|müzede yol bulmak'],
  'garden-labels':['plant labels','bitki etiketleri|etiketleri korumak'],
  'paper-boat':['paper boat','kâğıt tekne|tekne yapmak'],
  'picnic-box':['picnic food|picnic box','piknik kutusu|piknik yiyecekleri'],
  'kite-string':['kite|preparing a kite','uçurtma|uçurtma hazırlamak'],
  'paint-drying':['painting|taking care of a painting','resim|resmi korumak'],
  'bubble-mixture':['bubbles|making bubbles','baloncuk|baloncuk yapmak'],
  'lunch-bag':['lunch bag|packing lunch','beslenme çantası|beslenme hazırlamak'],
  'recycling-labels':['recycling|sorting recycling','geri dönüşüm|atıkları ayırmak'],
  'library-return':['returning a book|library book','kitap iadesi|kitabı geri vermek'],
  'train-ticket':['train journey|train ticket','tren yolculuğu|tren bileti'],
  'puzzle-piece':['puzzle|finishing a puzzle','yapboz|yapboz yapmak'],
  'plant-watering':['caring for plants|garden plants','bitki bakımı|bitkilere bakmak'],
  'treasure-note':['treasure game|treasure clue','hazine oyunu|hazine ipucu'],
  'taking-turns':['taking turns|sharing a toy','sırayla oynamak|oyuncak paylaşmak'],
  'bus-queue':['bus stop|waiting for a bus','otobüs durağı|otobüs beklemek'],
  'pet-space':['caring for a pet|pet care','hayvan bakımı|hayvana bakmak'],
  'music-practice':['music practice|playing music','müzik çalışması|müzik çalmak'],
  'craft-table':['craft table|preparing to draw','etkinlik masası|masayı hazırlamak'],
  'building-bridge':['block bridge|building a bridge','blok köprü|köprü yapmak'],
  'changing-plan':['new plan|changing a plan','yeni plan|plan değiştirmek']
};

export function storyAnswerForms(family, path, question, language) {
  const column = language === 'tr' ? 1 : 0;
  const text = question === 5 ? topics[family]?.[column] : question >= 2 ? pathAnswers[family]?.[path]?.[(question - 2) * 2 + column] : '';
  return text ? text.split('|') : [];
}

const simpleForms = {
  tr: [
    ['kütüphaneye','kütüphane'],['müzeye','müze'],['parka','park','parkta'],['okula','okul'],['plaja','plaj'],
    ['bahçede','bahçe'],['balkonda','balkon'],['oyun alanında','oyun alanı'],['pencerenin önünde','pencere önü'],
    ['trene','tren'],['otobüse','otobüs'],['duvara','duvar'],['rafa','raf'],['saksıya','saksı'],
    ['pencerenin yanına','pencerenin yanında','pencere yanı'],['ağacın altında','ağaç altında'],
    ['kuşlarla','kuşlar','kuş'],['trenler','tren'],['çiçekler','çiçek'],['balıklar','balık'],['ağaçlar','ağaç'],
    ['annesiyle','annesi','anne','annesi ile'],['babasıyla','babası','baba','babası ile'],['büyükannesiyle','büyükannesi','büyükanne','anneanne','babaanne'],
    ['yağmurlu','yağmur yağıyor'],['meyveyi yıkamak','meyveyi yıkıyor','meyve yıkamak'],
    ['lambayı kapatmak','lambayı kapatıyor','lamba kapatmak'],['karıştırmak','karıştırıyor'],
    ['soğumalarını bekliyorlar','soğumasını beklemek','soğumalarını beklemek','soğumalarını bekliyor'],
    ['yeşil bir yaprak','yeşil yaprak','yaprak'],['çizme','çizmeler'],['oyuncak ayı','ayı'],['yapboz','pazıl']
  ],
  en: [
    ['to the library','library'],['to the park','park'],['on the wall','wall'],['on the shelf','shelf'],['in a pot','pot'],
    ['by the window','next to the window','beside the window'],['under a tree','under the tree'],
    ['birds','bird'],['trees','tree'],['flowers','flower'],['trains','train'],['cookies','cookie'],['boots','boot'],
    ['mom','mum','mother'],['dad','father'],['grandma','grandmother'],['rainy','raining'],
    ['washing the fruit','wash the fruit'],['turning off the lamp','turn off the lamp'],['mixing','mix'],
    ['let them cool','wait for them to cool','let the cookies cool'],['a green leaf','green leaf','leaf'],['a teddy bear','teddy bear','teddy','bear'],['a puzzle','puzzle','jigsaw']
  ]
};
const digits = {
  en: ['zero','one','two','three','four','five','six','seven','eight','nine','ten'],
  tr: ['sıfır','bir','iki','üç','dört','beş','altı','yedi','sekiz','dokuz','on']
};
const presentVerbs = {
  bakmak:'bakıyor', bulmak:'buluyor', almak:'alıyor', istemek:'istiyor', takmak:'takıyor', çıkarmak:'çıkarıyor',
  kaldırmak:'kaldırıyor', geçmek:'geçiyor', gitmek:'gidiyor', açmak:'açıyor', koymak:'koyuyor', izlemek:'izliyor',
  sormak:'soruyor', aramak:'arıyor', tutturmak:'tutturuyor', yazmak:'yazıyor', katlamak:'katlıyor',
  genişletmek:'genişletiyor', kullanmak:'kullanıyor', kapatmak:'kapatıyor', taşımak:'taşıyor', yıkamak:'yıkıyor',
  çözmek:'çözüyor', beklemek:'bekliyor', saklamak:'saklıyor', bekletmek:'bekletiyor', eklemek:'ekliyor',
  batırmak:'batırıyor', sıkmak:'sıkıyor', çevirmek:'çeviriyor', ayırmak:'ayırıyor', doldurmak:'dolduruyor',
  toplamak:'topluyor', okumak:'okuyor', oynamak:'oynuyor', yükseltmek:'yükseltiyor', getirmek:'getiriyor',
  yaklaştırmak:'yaklaştırıyor', yapmak:'yapıyor', seçmek:'seçiyor', dinlenmek:'dinleniyor'
};

export function normalizeAnswer(value, language = 'tr') {
  return String(value).normalize('NFKC').toLocaleLowerCase(language)
    .replace(/ı/g,'i').normalize('NFD').replace(/\p{M}/gu,'')
    .replace(/[’']/g,'').replace(/[^\p{L}\p{N}\s]/gu,' ').replace(/\s+/g,' ').trim();
}

const formCache = new Map();
function forms(answer, language) {
  const base = normalizeAnswer(answer, language);
  const key = language+'-'+base;
  if(formCache.has(key))return formCache.get(key);
  const group = simpleForms[language]?.find(row => row.some(item => normalizeAnswer(item, language) === base)) || [];
  const variants = [base,...group.map(item => normalizeAnswer(item, language))];
  const result = [...new Set(variants.flatMap(text => {
    const withoutArticles = language === 'en' ? text.replace(/\b(a|an|the)\s+/g,'') : text.replace(/\bbir\s+/g,'');
    const singularVerb = language === 'tr' ? text.replace(/yor(lar|ler)$/, 'yor') : text;
    const verb = language === 'tr' ? text.split(' ').at(-1) : '';
    const present = Object.entries(presentVerbs).find(([infinitive])=>normalizeAnswer(infinitive,language)===verb)?.[1];
    const presentForm = present ? text.slice(0,-verb.length)+normalizeAnswer(present,language) : text;
    const numeric = text.split(' ').map(word => {
      const index = digits[language]?.findIndex(number => normalizeAnswer(number,language) === word);
      return index >= 0 ? String(index) : word;
    }).join(' ');
    const counted = numeric.replace(/^(\d+) (tane|adet)$/,'$1');
    return [text,withoutArticles,singularVerb,numeric,counted,presentForm,...(present?[presentForm+'lar']:[])];
  }))];
  if(formCache.size>=5000)formCache.clear();
  formCache.set(key,result);
  return result;
}

function oneLetterApart(a,b) {
  if(Math.abs(a.length-b.length)>1)return false;
  if(a.length===b.length)return [...a].filter((letter,i)=>letter!==b[i]).length===1;
  const [short,long]=a.length<b.length?[a,b]:[b,a];
  let i=0;while(i<short.length&&short[i]===long[i])i++;
  return short.slice(i)===long.slice(i+1);
}

export function checkWrittenAnswer(question, value) {
  const text = normalizeAnswer(value,question.language);
  if(!text)return 'empty';
  const answers = [question.answer,...(question.acceptedAnswers || [])].flatMap(answer => forms(answer,question.language));
  const writtenForms = forms(text,question.language);
  if(writtenForms.some(form=>answers.includes(form)))return 'correct';
  // A one-letter slip is allowed only for single nouns/names/colors. Never fuzz
  // clauses: a single letter can change a verb's meaning (açıyor / açmıyor).
  const factualWord = ['story-object','story-color','story-topic','story-person','story-place','comprehension'].includes(question.skill);
  if(factualWord && !text.includes(' ') && text.length>=4 && !/\d/.test(text)) {
    const near = list=>list.some(answer=>!answer.includes(' ')&&answer.length>=5&&oneLetterApart(text,answer));
    const distractors=(question.choices||[]).filter(answer=>answer!==question.answer).flatMap(answer=>forms(answer,question.language));
    if(near(answers)&&!writtenForms.some(form=>distractors.includes(form))&&!near(distractors))return 'correct';
  }
  return 'incorrect';
}
