// Carefully bounded templates produce fresh practice without external AI calls.
export const SUBJECTS = ['math', 'vocabulary', 'reading', 'everyday'];
export const THEMES = { garden: ['🌻','🍎','🌿'], animals: ['🐱','🐶','🐰'], trains: ['🚂','🚃','🚋'], space: ['⭐','🚀','🪐'] };
const words = [
  ['cat','kedi','🐱','It says meow.','Miyav der.'], ['dog','köpek','🐶','It says woof.','Hav hav der.'],
  ['rabbit','tavşan','🐰','It has long ears.','Uzun kulakları var.'], ['bird','kuş','🐦','It has wings.','Kanatları var.'],
  ['fish','balık','🐟','It swims in water.','Suda yüzer.'], ['butterfly','kelebek','🦋','It has colorful wings.','Renkli kanatları var.'],
  ['apple','elma','🍎','It is a fruit.','Bir meyve.'], ['banana','muz','🍌','It is a long, yellow fruit.','Uzun, sarı bir meyve.'],
  ['carrot','havuç','🥕','It is an orange vegetable.','Turuncu bir sebze.'], ['bread','ekmek','🍞','We can make a sandwich with it.','Onunla sandviç yapabiliriz.'],
  ['milk','süt','🥛','It is a white drink.','Beyaz bir içecek.'], ['water','su','💧','We drink it when we are thirsty.','Susayınca içeriz.'],
  ['sun','güneş','☀️','It shines in the sky during the day.','Gündüz gökyüzünde parlar.'], ['moon','ay','🌙','We can see it in the night sky.','Gece gökyüzünde görebiliriz.'],
  ['star','yıldız','⭐','It twinkles in the night sky.','Gece gökyüzünde parlar.'], ['rain','yağmur','🌧️','Drops of water fall from clouds.','Bulutlardan su damlaları düşer.'],
  ['tree','ağaç','🌳','It has a trunk and leaves.','Gövdesi ve yaprakları var.'], ['flower','çiçek','🌻','It grows in the garden.','Bahçede yetişir.'],
  ['book','kitap','📚','We can read it.','Onu okuyabiliriz.'], ['pencil','kalem','✏️','We can draw with it.','Onunla resim çizebiliriz.'],
  ['ball','top','⚽','We can kick it.','Ona ayakla vurabiliriz.'], ['bike','bisiklet','🚲','We pedal to ride it.','Binmek için pedal çeviririz.'],
  ['train','tren','🚂','It travels on rails.','Rayların üzerinde gider.'], ['bus','otobüs','🚌','It carries people on the road.','Yolda insanları taşır.'],
  ['rocket','roket','🚀','It can travel to space.','Uzaya gidebilir.'], ['boat','tekne','⛵','It travels on water.','Suda gider.'],
  ['house','ev','🏠','People live here.','İnsanlar burada yaşar.'], ['key','anahtar','🔑','It can open a lock.','Bir kilidi açabilir.'],
  ['shoe','ayakkabı','👟','We wear it on a foot.','Ayağımıza giyeriz.'], ['hat','şapka','🧢','We wear it on our head.','Başımıza takarız.'],
  ['clock','saat','🕒','It tells us the time.','Zamanı gösterir.'], ['bed','yatak','🛏️','We can sleep here.','Burada uyuyabiliriz.']
];
// Each story has a literal question at each level. No guessing about facial expressions or intentions.
const stories = [
  { id:'cat', emoji:'🐱', en:['Mia has a cat.','The cat is on a blue mat.','Mia gives the cat water.'], tr:['Mina’nın bir kedisi var.','Kedi mavi bir minderin üstünde.','Mina kediye su veriyor.'], qs:[['What pet does Mia have?','Mina’nın hangi hayvanı var?',['A cat','A dog','A fish'],['Kedi','Köpek','Balık'],0],['What color is the mat?','Minder ne renk?',['Blue','Red','Green'],['Mavi','Kırmızı','Yeşil'],0],['What does Mia give the cat?','Mina kediye ne veriyor?',['Water','Milk','Bread'],['Su','Süt','Ekmek'],0]] },
  { id:'train', emoji:'🚂', en:['Ali rides a train.','He sits by the window.','He sees three trees.'], tr:['Ali trene biniyor.','Pencerenin yanına oturuyor.','Üç ağaç görüyor.'], qs:[['What does Ali ride?','Ali neye biniyor?',['A train','A boat','A bike'],['Trene','Tekneye','Bisiklete'],0],['Where does Ali sit?','Ali nereye oturuyor?',['By the window','By the door','On the floor'],['Pencerenin yanına','Kapının yanına','Yere'],0],['How many trees does Ali see?','Ali kaç ağaç görüyor?',['Three','Two','Five'],['Üç','İki','Beş'],0]] },
  { id:'garden', emoji:'🌱', en:['Sam plants a seed.','He puts it in a pot.','He adds water.','A green leaf grows.'], tr:['Can bir tohum ekiyor.','Tohumu saksıya koyuyor.','Su ekliyor.','Yeşil bir yaprak büyüyor.'], qs:[['What does Sam plant?','Can ne ekiyor?',['A seed','A toy','A stone'],['Tohum','Oyuncak','Taş'],0],['Where does he put the seed?','Tohumu nereye koyuyor?',['In a pot','In a cup','In a bag'],['Saksıya','Bardağa','Çantaya'],0],['What grows after he adds water?','Su ekledikten sonra ne büyüyor?',['A green leaf','A blue flower','A red apple'],['Yeşil bir yaprak','Mavi bir çiçek','Kırmızı bir elma'],0]] },
  { id:'space', emoji:'🚀', en:['Lina draws a rocket.','She colors it red.','She draws two stars next to it.'], tr:['Lina bir roket çiziyor.','Roketi kırmızıya boyuyor.','Yanına iki yıldız çiziyor.'], qs:[['What does Lina draw first?','Lina önce ne çiziyor?',['A rocket','A boat','A car'],['Roket','Tekne','Araba'],0],['What color is the rocket?','Roket ne renk?',['Red','Blue','Yellow'],['Kırmızı','Mavi','Sarı'],0],['What does Lina draw next to the rocket?','Lina roketin yanına ne çiziyor?',['Two stars','Three moons','One sun'],['İki yıldız','Üç ay','Bir güneş'],0]] },
  { id:'picnic', emoji:'🧺', en:['Ece goes to the park.','She brings an apple and water.','She sits under a tree.'], tr:['Ece parka gidiyor.','Elma ve su getiriyor.','Bir ağacın altında oturuyor.'], qs:[['Where does Ece go?','Ece nereye gidiyor?',['To the park','To the shop','To school'],['Parka','Markete','Okula'],0],['What fruit does Ece bring?','Ece hangi meyveyi getiriyor?',['An apple','A banana','An orange'],['Elma','Muz','Portakal'],0],['Where does Ece sit?','Ece nerede oturuyor?',['Under a tree','On a bus','By a bed'],['Ağacın altında','Otobüste','Yatağın yanında'],0]] },
  { id:'rain', emoji:'🌧️', en:['It is raining.','Deniz puts on boots.','He takes a yellow umbrella.','His feet stay dry.'], tr:['Yağmur yağıyor.','Deniz çizmelerini giyiyor.','Sarı şemsiyesini alıyor.','Ayakları kuru kalıyor.'], qs:[['What is the weather like?','Hava nasıl?',['Rainy','Sunny','Snowy'],['Yağmurlu','Güneşli','Karlı'],0],['What color is the umbrella?','Şemsiye ne renk?',['Yellow','Purple','Green'],['Sarı','Mor','Yeşil'],0],['What does Deniz wear on his feet?','Deniz ayağına ne giyiyor?',['Boots','Sandals','Socks only'],['Çizme','Sandalet','Sadece çorap'],0]] },
  { id:'library', emoji:'📚', en:['Ada visits the library.','She chooses a book about birds.','She reads it with Dad.'], tr:['Ada kütüphaneye gidiyor.','Kuşlarla ilgili bir kitap seçiyor.','Babasıyla kitabı okuyor.'], qs:[['Where does Ada go?','Ada nereye gidiyor?',['To the library','To the beach','To the garden'],['Kütüphaneye','Plaja','Bahçeye'],0],['What is the book about?','Kitap neyle ilgili?',['Birds','Trains','Flowers'],['Kuşlarla','Trenlerle','Çiçeklerle'],0],['Who reads with Ada?','Ada kiminle okuyor?',['Dad','A friend','Her teacher'],['Babasıyla','Arkadaşıyla','Öğretmeniyle'],0]] },
  { id:'baking', emoji:'🍪', en:['Arda bakes with Mom.','They make six cookies.','Arda puts them on a plate.','They let the cookies cool.'], tr:['Arda annesiyle kurabiye yapıyor.','Altı kurabiye yapıyorlar.','Arda kurabiyeleri tabağa koyuyor.','Soğumalarını bekliyorlar.'], qs:[['What do they make?','Ne yapıyorlar?',['Cookies','Soup','Bread'],['Kurabiye','Çorba','Ekmek'],0],['How many cookies do they make?','Kaç kurabiye yapıyorlar?',['Six','Four','Eight'],['Altı','Dört','Sekiz'],0],['What do they do after putting cookies on a plate?','Kurabiyeleri tabağa koyduktan sonra ne yapıyorlar?',['Let them cool','Put them in a bag','Add water'],['Soğumalarını bekliyorlar','Çantaya koyuyorlar','Su ekliyorlar'],0]] }
];
const everyday = [
  ['noise','🎧',1,['The room feels too loud.','You can ask for a quieter place.'],['Oda çok gürültülü geliyor.','Daha sessiz bir yer isteyebilirsin.'],'What could help?','Ne yardımcı olabilir?',['Ask for a quiet break','Make more noise','Keep feeling uncomfortable'],['Sessiz bir mola istemek','Daha çok ses çıkarmak','Rahatsız olmaya devam etmek'],'A quiet break is one choice. You can ask a trusted adult for help.','Sessiz bir mola bir seçenek. Güvendiğin bir yetişkinden yardım isteyebilirsin.'],
  ['help','🙋',1,['A puzzle feels tricky.','You can ask for help.'],['Yapboz zor geliyor.','Yardım isteyebilirsin.'],'What can you say?','Ne söyleyebilirsin?',['Can you help me?','I must do everything alone.','I cannot ask anyone.'],['Bana yardım eder misin?','Her şeyi tek başıma yapmalıyım.','Kimseye soramam.'],'Asking for help is okay.','Yardım istemek normal.'],
  ['break','🌿',1,['You have been practicing.','Your body feels tired.'],['Bir süredir çalışıyorsun.','Bedenin yorgun hissediyor.'],'What could you choose?','Ne seçebilirsin?',['Take a break','Keep going even if it hurts','Skip all rest'],['Mola vermek','Canım acısa da devam etmek','Hiç dinlenmemek'],'You can rest when you need to.','İhtiyacın olduğunda dinlenebilirsin.'],
  ['turn','🧩',2,['You want to use a toy.','Your friend is using it.'],['Bir oyuncakla oynamak istiyorsun.','Arkadaşın onunla oynuyor.'],'What could you ask?','Ne sorabilirsin?',['Can I have a turn when you finish?','Give it to me right now!','I will grab it.'],['Bitirince ben oynayabilir miyim?','Hemen bana ver!','Onu elinden alacağım.'],'You can ask for a turn or choose another toy while you wait.','Sıranı isteyebilir veya beklerken başka bir oyuncak seçebilirsin.'],
  ['change','📅',2,['You planned to go to the park.','It starts to rain.','You and Dad can make a new plan.'],['Parka gitmeyi planladınız.','Yağmur başlıyor.','Babanla yeni bir plan yapabilirsiniz.'],'What could you do together?','Birlikte ne yapabilirsiniz?',['Choose an indoor activity','Pretend it is not raining','Go out without checking'],['Evde bir etkinlik seçmek','Yağmur yokmuş gibi davranmak','Bakmadan dışarı çıkmak'],'A change can feel hard. You can ask what will happen next.','Değişiklik zor gelebilir. Sırada ne olacağını sorabilirsin.'],
  ['space','💛',1,['Someone wants to hug you.','You do not want a hug.'],['Biri sana sarılmak istiyor.','Sen sarılmak istemiyorsun.'],'What can you say?','Ne söyleyebilirsin?',['No hug, thank you.','I must say yes.','My choice does not matter.'],['Sarılmak istemiyorum, teşekkür ederim.','Evet demek zorundayım.','Benim seçimim önemli değil.'],'Your body belongs to you. You can say no to a hug.','Bedenin sana ait. Sarılmaya hayır diyebilirsin.'],
  ['hands','🧼',1,['You have been playing outside.','Now it is time to eat.'],['Dışarıda oynadın.','Şimdi yemek zamanı.'],'What do you do before eating?','Yemekten önce ne yaparsın?',['Wash my hands','Put on a hat','Turn on the TV'],['Ellerimi yıkarım','Şapka takarım','Televizyonu açarım'],'Use soap and water to wash your hands.','Ellerini sabun ve suyla yıka.'],
  ['feelings','🌦️',2,['You feel upset.','A trusted adult is nearby.'],['Üzgün hissediyorsun.','Güvendiğin bir yetişkin yanında.'],'What can you share?','Ne söyleyebilirsin?',['I feel upset. I need help.','I must hide every feeling.','I can never talk about feelings.'],['Üzgünüm. Yardıma ihtiyacım var.','Her duygumu saklamalıyım.','Duygularımı asla anlatamam.'],'All feelings are okay. You can talk, point, or use a communication tool.','Bütün duygular normal. Konuşabilir, gösterebilir veya iletişim aracı kullanabilirsin.'],
  ['lost','🏪',3,['You cannot see your grown-up in a shop.','A worker is at the checkout.'],['Markette yanındaki yetişkini göremiyorsun.','Kasada bir görevli var.'],'Who can you ask for help?','Kimden yardım isteyebilirsin?',['The worker at the checkout','A person who asks me to leave the shop','Nobody'],['Kasadaki görevli','Marketten çıkmamı isteyen biri','Hiç kimse'],'Stay in the shop and ask a worker to help you find your grown-up.','Markette kal ve yanındaki yetişkini bulmak için görevliden yardım iste.'],
  ['road','🚦',3,['You are walking with a trusted adult.','You reach a road.'],['Güvendiğin bir yetişkinle yürüyorsun.','Bir yola geliyorsunuz.'],'What do you do?','Ne yaparsın?',['Stop and cross together when it is safe','Run across alone','Look only at my toy'],['Durur, güvenli olunca birlikte geçerim','Tek başıma koşarak geçerim','Sadece oyuncağıma bakarım'],'Stop at the edge and cross with your trusted adult when it is safe.','Yolun kenarında dur ve güvenli olunca güvendiğin yetişkinle geç.'],
  ['listen','💬',2,['You did not understand an instruction.','You can ask to hear it again.'],['Bir yönergeyi anlamadın.','Tekrar duymak isteyebilirsin.'],'What can you ask?','Ne sorabilirsin?',['Can you say it again, please?','I must guess.','I cannot ask questions.'],['Tekrar söyler misin, lütfen?','Tahmin etmek zorundayım.','Soru soramam.'],'You can ask for fewer words, a picture, or more time.','Daha az kelime, bir resim veya daha çok zaman isteyebilirsin.'],
  ['friend','🤝',2,['You would like to play with someone.','They are building with blocks.'],['Biriyle oynamak istiyorsun.','O kişi bloklarla oynuyor.'],'What could you say?','Ne söyleyebilirsin?',['Can I build with you?','I will take your blocks.','You have to play with me.'],['Seninle yapabilir miyim?','Bloklarını alacağım.','Benimle oynamak zorundasın.'],'You can ask to join. They can say yes or no, and you can choose another activity.','Katılmak için sorabilirsin. Evet veya hayır diyebilirler. Başka bir etkinlik de seçebilirsin.']
];
const opposites = [
  ['big','büyük','small','küçük','🐘'], ['hot','sıcak','cold','soğuk','🌡️'], ['up','yukarı','down','aşağı','↕️'],
  ['open','açık','closed','kapalı','🚪'], ['day','gündüz','night','gece','🌗'], ['fast','hızlı','slow','yavaş','🐢'],
  ['full','dolu','empty','boş','🥛'], ['wet','ıslak','dry','kuru','💧'], ['long','uzun','short','kısa','📏'], ['happy','mutlu','sad','üzgün','💛']
];
function numbers(answer, max = 20) {
  const options = [answer];
  for (const value of [answer + 1, answer - 1, answer + 2, answer - 2, 0, max]) {
    if (value >= 0 && value <= max && !options.includes(value)) options.push(value);
    if (options.length === 3) break;
  }
  return options.map(String);
}
export function buildBank(language = 'en', theme = 'garden') {
  const tr = language === 'tr';
  const bank = [];
  const pictures = THEMES[theme] || THEMES.garden;
  const add = (subject, key, level, prompt, choices, answer, extra = {}) => bank.push({ id:`${language}-${subject}-${key}`, language, subject, level, prompt, choices, answer, enabled:true, ...extra });
  for (let n = 1; n <= 20; n++) {
    const level = n <= 5 ? 1 : n <= 10 ? 2 : 3;
    add('math',`count-${n}`,level,tr?'Kaç tane var?':'How many are there?',numbers(n),String(n),{skill:'count',visual:{kind:'count',items:Array(n).fill(pictures[0])},hint:tr?'Her resmi bir kez say.':'Count each picture once.'});
  }
  for (let a = 1; a <= 19; a++) for (let b = 1; b <= 20 - a; b++) {
    const answer = a + b;
    const level = answer <= 5 ? 1 : answer <= 10 ? 2 : 3;
    add('math',`add-${a}-${b}`,level,tr?`${a} artı ${b} kaç eder?`:`What is ${a} plus ${b}?`,numbers(answer),String(answer),{skill:'add',equation:`${a} + ${b} = ?`,visual:{kind:'groups',groups:[Array(a).fill(pictures[0]),Array(b).fill(pictures[0])],operator:'+'},hint:tr?'İki gruptaki resimleri birlikte say.':'Count the pictures in both groups together.'});
  }
  for (let a = 2; a <= 20; a++) for (let b = 1; b <= a; b++) {
    const answer = a - b;
    const level = a <= 5 ? 1 : a <= 10 ? 2 : 3;
    add('math',`subtract-${a}-${b}`,level,tr?`${a} eksi ${b} kaç eder?`:`What is ${a} minus ${b}?`,numbers(answer),String(answer),{skill:'subtract',equation:`${a} − ${b} = ?`,visual:{kind:'subtract',items:Array(a).fill(pictures[0]),removed:b},hint:tr?'Üstü çizilmeyen resimleri say.':'Count the pictures that are not crossed out.'});
  }
  for (let a = 1; a < 20; a++) for (let b = a + 1; b <= 20; b++) {
    add('math',`compare-${a}-${b}`,b<=5?1:b<=10?2:3,tr?'Hangi sayı daha büyük?':'Which number is bigger?',[String(a),String(b)],String(b),{skill:'compare',hint:tr?'Daha çok olan sayıyı seç.':'Choose the number that means more.'});
  }
  for (let n = 1; n <= 19; n++) add('math',`next-${n}`,n<=4?1:n<=9?2:3,tr?`${n} sayısından sonra hangi sayı gelir?`:`What number comes after ${n}?`,numbers(n+1),String(n+1),{skill:'sequence',equation:`${n} → ?`,hint:tr?`${n} sayısından başlayıp bir ileri say.`:`Start at ${n} and count one more.`});
  for (let level = 1; level <= 3; level++) {
    const sequence = level === 1 ? [0,1,0,1] : level === 2 ? [0,0,1,0,0,1] : [0,1,2,0,1,2];
    add('math',`pattern-${level}`,level,tr?'Sırada hangisi var?':'What comes next?',[...pictures],pictures[0],{skill:'pattern',visual:{kind:'pattern',items:[...sequence.map(i=>pictures[i]),'?']},hint:tr?'Tekrar eden resim grubunu bul.':'Find the group of pictures that repeats.'});
  }
  words.forEach((word, i) => {
    const name = word[tr?1:0];
    const distractors = [words[(i+7)%words.length][tr?1:0],words[(i+15)%words.length][tr?1:0]];
    add('vocabulary',`name-${i}`,1,tr?'Bu resimde ne var?':'What is in this picture?',[name,...distractors],name,{skill:'picture-word',visual:{kind:'single',items:[word[2]]},hint:word[tr?4:3]});
    add('vocabulary',`clue-${i}`,2,word[tr?4:3],[name,...distractors],name,{skill:'word-meaning',hint:tr?`İlk harfi: ${name[0].toLocaleUpperCase('tr')}.`:`Its first letter is ${name[0].toUpperCase()}.`});
  });
  opposites.forEach((word, i) => {
    const name = word[tr?1:0], answer = word[tr?3:2];
    const other = opposites[(i+3)%opposites.length];
    add('vocabulary',`opposite-${i}`,3,tr?`“${name}” kelimesinin zıttı ne?`:`What is the opposite of “${name}”?`,[answer,name,other[tr?3:2]],answer,{skill:'opposites',hint:tr?'Ters anlamlı kelimeyi seç.':'Choose the word with the reverse meaning.'});
  });
  for (const story of stories) story.qs.forEach((q,i)=>add('reading',`${story.id}-${i}`,i+1,q[tr?1:0],q[tr?3:2],q[tr?3:2][q[4]],{skill:'comprehension',story:story[language],visual:{kind:'single',items:[story.emoji]},hint:tr?'Cevabı bulmak için hikâyeyi tekrar oku veya dinle.':'Read or listen to the story again to find the answer.'}));
  for (const row of everyday) add('everyday',row[0],row[2],row[tr?6:5],row[tr?8:7],row[tr?8:7][0],{skill:'everyday',story:row[tr?4:3],visual:{kind:'single',items:[row[1]]},hint:row[tr?10:9],explanation:row[tr?10:9]});
  return bank;
}
export function validateQuestion(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Question must be an object.');
  const { language, subject, level, prompt, choices, answer } = input;
  if (!['en','tr'].includes(language) || !SUBJECTS.includes(subject) || ![1,2,3].includes(level)) throw new Error('Choose a valid language, subject, and level.');
  if (typeof prompt !== 'string' || !prompt.trim() || prompt.length > 300) throw new Error('Question text must contain 1–300 characters.');
  if (!Array.isArray(choices) || choices.length < 2 || choices.length > 3 || choices.some(x=>typeof x !== 'string' || !x.trim() || x.length>120) || new Set(choices.map(x=>x.trim())).size !== choices.length) throw new Error('Add two or three different answers, each up to 120 characters.');
  if (!choices.includes(answer)) throw new Error('The correct answer must be one of the choices.');
  if (input.story != null && (!Array.isArray(input.story) || input.story.length>8 || input.story.some(x=>typeof x!=='string' || x.length>300))) throw new Error('Story must contain at most eight short lines.');
  for (const field of ['hint','explanation']) if (input[field] != null && (typeof input[field] !== 'string' || input[field].length>500)) throw new Error(`${field} must be shorter than 500 characters.`);
  return { language, subject, level, prompt:prompt.trim(), choices:choices.map(x=>x.trim()), answer:answer.trim(), story:(input.story||[]).map(x=>x.trim()).filter(Boolean), hint:input.hint||'', explanation:input.explanation||'', skill:'custom', enabled:input.enabled!==false };
}
