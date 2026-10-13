import { storyContext } from './stories.js';

export const MORE_STORY_VARIANTS = 120;
const upper = (text, language) => text[0].toLocaleUpperCase(language) + text.slice(1);
const colorDetail = (c, en, tr) => ({
  lines: ['The ' + en + ' is ' + c.color[0] + '.', tr + ' ' + c.color[1] + '.'],
  prompts: ['What color is the ' + en + '?', tr + ' ne renk?'],
  choices: [c.colorEN, c.colorTR], skill: 'story-color'
});
const numberDetail = (c, en, tr, objectEN, objectTR) => ({
  lines: [en + ' There are ' + c.number + ' ' + objectEN + '.', tr + ' ' + c.number + ' ' + objectTR + ' var.'],
  prompts: ['How many ' + objectEN + ' are there?', 'Kaç ' + objectTR + ' var?'],
  choices: [c.numberChoices, c.numberChoices], skill: 'story-number'
});
const objectDetail = (lines, prompts, choices) => ({ lines, prompts, choices, skill: 'story-object' });

// Each path is [problem EN/TR, next action EN/TR, outcome EN/TR].
// Choosing a different path changes the problem, solution and correct answers together.
// Feelings, causes and actions are stated explicitly; questions do not require mind-reading.
export const MORE_STORY_TEMPLATES = [
  {
    id: 'missing-mitten', title: ['Finding the mitten', 'Eldiveni bulmak'],
    opening: c => [c.name + ' and ' + c.friend + ' get ready to go outside.', c.name + ' ve ' + c.friend + ' dışarı çıkmaya hazırlanıyor.'],
    detail: c => colorDetail(c, 'mitten', 'Eldiven'),
    paths: [
      ['The mitten is missing', 'Eldiven kayıp', 'They look inside the coat pocket', 'Montun cebine bakıyorlar', 'They find the mitten in the pocket', 'Eldiveni cepte buluyorlar'],
      ['The mitten is wet', 'Eldiven ıslak', 'They get a dry mitten', 'Kuru bir eldiven alıyorlar', 'They can go outside with dry hands', 'Kuru ellerle dışarı çıkabiliyorlar'],
      ['The mitten has a hole', 'Eldivende bir delik var', 'They ask a grown-up to mend it', 'Bir yetişkinden eldiveni onarmasını istiyorlar', 'The grown-up closes the hole', 'Yetişkin deliği kapatıyor']
    ]
  },
  {
    id: 'toy-repair', title: ['Making the toy car move', 'Oyuncak arabayı yürütmek'],
    opening: c => [c.name + ' and ' + c.friend + ' play with a toy car.', c.name + ' ve ' + c.friend + ' oyuncak arabayla oynuyor.'],
    detail: c => colorDetail(c, 'toy car', 'Oyuncak araba'),
    paths: [
      ['One wheel has fallen off', 'Bir tekerlek çıkmış', 'They ask a grown-up to attach the wheel', 'Bir yetişkinden tekerleği takmasını istiyorlar', 'The car rolls again', 'Araba yeniden ilerliyor'],
      ['A string is caught around the wheel', 'Tekerleğe bir ip dolanmış', 'They ask a grown-up to remove the string', 'Bir yetişkinden ipi çıkarmasını istiyorlar', 'The wheel can turn again', 'Tekerlek yeniden dönebiliyor'],
      ['The toy track is blocked by a block', 'Oyuncak yolun önünde bir blok var', 'They move the block to the toy box', 'Bloğu oyuncak kutusuna koyuyorlar', 'The toy track is clear', 'Oyuncak yol açılıyor']
    ]
  },
  {
    id: 'quiet-reading', title: ['Finding a quiet reading place', 'Sessiz bir okuma yeri bulmak'],
    opening: c => [c.name + ' and ' + c.friend + ' want to read together.', c.name + ' ve ' + c.friend + ' birlikte kitap okumak istiyor.'],
    detail: c => objectDetail(['The book has a ' + c.color[0] + ' cover. It is about ' + c.book[0] + '.', 'Kitabın kapağı ' + c.color[1] + '. Konusu ' + c.book[1] + '.'], ['What is the book about?', 'Kitabın konusu ne?'], [c.bookEN, c.bookTR]),
    paths: [
      ['The room is too noisy for reading', 'Oda kitap okumak için çok gürültülü', 'They move to a quiet room', 'Sessiz bir odaya geçiyorlar', 'They can hear the story clearly', 'Hikâyeyi rahatça duyabiliyorlar'],
      ['The reading lamp is switched off', 'Okuma lambası kapalı', 'They switch on the lamp', 'Lambayı açıyorlar', 'They can see the words clearly', 'Kelimeleri rahatça görebiliyorlar'],
      ['There is no space on the chair', 'Sandalyede yer yok', 'They put the toys in a box', 'Oyuncakları kutuya koyuyorlar', 'There is room to sit and read', 'Oturup okumak için yer açılıyor']
    ]
  },
  {
    id: 'museum-map', title: ['Using the museum map', 'Müze haritasını kullanmak'],
    opening: c => [c.name + ' and ' + c.friend + ' visit a museum with a grown-up.', c.name + ' ve ' + c.friend + ' bir yetişkinle müzeye gidiyor.'],
    detail: c => colorDetail(c, 'map', 'Harita'),
    paths: [
      ['They cannot find the train room', 'Trenlerin olduğu odayı bulamıyorlar', 'They follow the train-room arrow on the map', 'Haritadaki tren odası okunu izliyorlar', 'They reach the train room', 'Trenlerin olduğu odaya ulaşıyorlar'],
      ['They cannot find the coat room', 'Montların bırakıldığı odayı bulamıyorlar', 'They ask a museum worker to point out the room', 'Müze görevlisinden odayı göstermesini istiyorlar', 'They reach the coat room', 'Montların bırakıldığı odaya ulaşıyorlar'],
      ['They cannot find the exit', 'Çıkışı bulamıyorlar', 'They look for the exit sign with the grown-up', 'Yetişkinle birlikte çıkış tabelasını arıyorlar', 'They find the way out', 'Çıkış yolunu buluyorlar']
    ]
  },
  {
    id: 'garden-labels', title: ['Keeping the plant labels in place', 'Bitki etiketlerini korumak'],
    opening: c => [c.name + ' and ' + c.friend + ' label plant pots.', c.name + ' ve ' + c.friend + ' saksılara etiket koyuyor.'],
    detail: c => numberDetail(c, 'The label cards are ' + c.color[0] + '.', 'Etiket kartları ' + c.color[1] + '.', 'pots', 'saksı'),
    paths: [
      ['The wind blows a label away', 'Rüzgâr bir etiketi uçuruyor', 'They attach the label with a clip', 'Etiketi bir mandalla tutturuyorlar', 'The label stays on the pot', 'Etiket saksının üzerinde kalıyor'],
      ['Water makes a paper label soggy', 'Su kâğıt etiketi yumuşatıyor', 'They put the label in a clear cover', 'Etiketi şeffaf bir kılıfa koyuyorlar', 'The label stays dry', 'Etiket kuru kalıyor'],
      ['The plant name is too faint to read', 'Bitkinin adı okunamayacak kadar silik', 'They write the name with a darker pencil', 'Adı daha koyu bir kalemle yazıyorlar', 'They can read the plant name', 'Bitkinin adını okuyabiliyorlar']
    ]
  },
  {
    id: 'paper-boat', title: ['Testing a paper boat', 'Kâğıt tekneyi denemek'],
    opening: c => [c.name + ' and ' + c.friend + ' make a paper boat.', c.name + ' ve ' + c.friend + ' kâğıttan bir tekne yapıyor.'],
    detail: c => colorDetail(c, 'paper boat', 'Kâğıt tekne'),
    paths: [
      ['The paper has a hole', 'Kâğıtta bir delik var', 'They fold a new sheet of paper', 'Yeni bir kâğıt katlıyorlar', 'The new boat has no hole', 'Yeni teknede delik yok'],
      ['The boat tips over in the bowl', 'Tekne kâsede yana devriliyor', 'They make the bottom wider', 'Teknenin altını genişletiyorlar', 'The boat stays upright', 'Tekne dik duruyor'],
      ['The bowl is too small for the boat', 'Kâse tekne için çok küçük', 'They use a larger bowl', 'Daha büyük bir kâse kullanıyorlar', 'The boat has room to float', 'Tekne yüzmek için yer buluyor']
    ]
  },
  {
    id: 'picnic-box', title: ['Protecting the picnic food', 'Piknik yiyeceklerini korumak'],
    opening: c => [c.name + ' and ' + c.friend + ' prepare a picnic box.', c.name + ' ve ' + c.friend + ' piknik kutusu hazırlıyor.'],
    detail: c => objectDetail(['The box is ' + c.color[0] + '. They put ' + c.fruit[0] + ' inside.', 'Kutu ' + c.color[1] + '. İçine ' + c.fruit[1] + ' koyuyorlar.'], ['What fruit is in the box?', 'Kutuda hangi meyve var?'], [c.fruitEN, c.fruitTR]),
    paths: [
      ['Ants are walking toward the open box', 'Karıncalar açık kutuya doğru yürüyor', 'They close the lid', 'Kapağı kapatıyorlar', 'The ants cannot reach the food', 'Karıncalar yiyeceğe ulaşamıyor'],
      ['The box is standing in hot sunlight', 'Kutu sıcak güneşin altında duruyor', 'They move the box into the shade', 'Kutuyu gölgeye taşıyorlar', 'The food is out of the sunlight', 'Yiyecek güneşin altında kalmıyor'],
      ['The lid has fallen onto the ground', 'Kapak yere düşmüş', 'They ask a grown-up to wash the lid', 'Bir yetişkinden kapağı yıkamasını istiyorlar', 'The clean lid is ready to use', 'Temiz kapak kullanıma hazır']
    ]
  },
  {
    id: 'kite-string', title: ['Getting the kite ready', 'Uçurtmayı hazırlamak'],
    opening: c => [c.name + ' and ' + c.friend + ' prepare a kite with a grown-up.', c.name + ' ve ' + c.friend + ' bir yetişkinle uçurtma hazırlıyor.'],
    detail: c => colorDetail(c, 'kite', 'Uçurtma'),
    paths: [
      ['The kite string has a knot', 'Uçurtmanın ipinde bir düğüm var', 'They ask the grown-up to undo the knot', 'Yetişkinden düğümü çözmesini istiyorlar', 'The string is ready to use', 'İp kullanıma hazır'],
      ['The kite tail has come loose', 'Uçurtmanın kuyruğu çıkmış', 'They fasten the tail again', 'Kuyruğu yeniden takıyorlar', 'The tail is attached to the kite', 'Kuyruk uçurtmaya takılıyor'],
      ['There is no wind outside', 'Dışarıda rüzgâr yok', 'They keep the kite for a windy day', 'Uçurtmayı rüzgârlı bir gün için saklıyorlar', 'The kite is ready for another day', 'Uçurtma başka bir gün için hazır']
    ]
  },
  {
    id: 'paint-drying', title: ['Taking care of a new painting', 'Yeni resmi korumak'],
    opening: c => [c.name + ' and ' + c.friend + ' finish a painting.', c.name + ' ve ' + c.friend + ' bir resim yapıyor.'],
    detail: c => objectDetail(['They use ' + c.color[0] + ' paint to draw ' + c.drawing[0] + '.', c.color[1] + ' boyayla bir ' + c.drawing[1] + ' çiziyorlar.'], ['What do they draw?', 'Ne çiziyorlar?'], [c.drawingEN, c.drawingTR]),
    paths: [
      ['The paint is still wet', 'Boya hâlâ ıslak', 'They leave the painting on a flat table', 'Resmi düz bir masada bekletiyorlar', 'The paint dries without smearing', 'Boya dağılmadan kuruyor'],
      ['The paper corners curl upward', 'Kâğıdın köşeleri kıvrılıyor', 'They place small weights on the dry corners', 'Kuru köşelere küçük ağırlıklar koyuyorlar', 'The paper lies flat', 'Kâğıt düz duruyor'],
      ['The wall has no empty space', 'Duvarda boş yer yok', 'They put the dry painting in a folder', 'Kuruyan resmi bir dosyaya koyuyorlar', 'The painting is stored safely', 'Resim güvenle saklanıyor']
    ]
  },
  {
    id: 'bubble-mixture', title: ['Making bubbles together', 'Birlikte baloncuk yapmak'],
    opening: c => [c.name + ' and ' + c.friend + ' make bubbles with a grown-up.', c.name + ' ve ' + c.friend + ' bir yetişkinle baloncuk yapıyor.'],
    detail: c => colorDetail(c, 'bubble wand', 'Baloncuk çubuğu'),
    paths: [
      ['The bubble cup is empty', 'Baloncuk kabı boş', 'They ask the grown-up to add bubble mixture', 'Yetişkinden baloncuk sıvısı eklemesini istiyorlar', 'The cup has bubble mixture again', 'Kapta yeniden baloncuk sıvısı var'],
      ['The wand has not been dipped in the mixture', 'Çubuk sıvıya batırılmamış', 'They dip the wand in the mixture', 'Çubuğu sıvıya batırıyorlar', 'A bubble forms on the wand', 'Çubukta bir baloncuk oluşuyor'],
      ['The wind blows bubbles toward the road', 'Rüzgâr baloncukları yola doğru götürüyor', 'They move farther into the garden with the grown-up', 'Yetişkinle bahçenin iç tarafına geçiyorlar', 'They play away from the road', 'Yoldan uzakta oynuyorlar']
    ]
  },
  {
    id: 'lunch-bag', title: ['Packing the lunch bag', 'Beslenme çantasını hazırlamak'],
    opening: c => [c.name + ' and ' + c.friend + ' pack a lunch bag.', c.name + ' ve ' + c.friend + ' beslenme çantasını hazırlıyor.'],
    detail: c => objectDetail(['The bag is ' + c.color[0] + '. It has ' + c.fruit[0] + ' inside.', 'Çanta ' + c.color[1] + '. İçinde ' + c.fruit[1] + ' var.'], ['What fruit is in the bag?', 'Çantada hangi meyve var?'], [c.fruitEN, c.fruitTR]),
    paths: [
      ['The water bottle lid is loose', 'Su şişesinin kapağı gevşek', 'They tighten the bottle lid', 'Şişenin kapağını sıkıca kapatıyorlar', 'The water stays inside the bottle', 'Su şişenin içinde kalıyor'],
      ['There is no napkin in the bag', 'Çantada peçete yok', 'They add a clean napkin', 'Temiz bir peçete ekliyorlar', 'A napkin is ready for lunch', 'Yemek için bir peçete hazır'],
      ['The sandwich is not wrapped', 'Sandviç sarılmamış', 'They put the sandwich in a food box', 'Sandviçi bir yiyecek kutusuna koyuyorlar', 'The sandwich is protected in the box', 'Sandviç kutuda korunuyor']
    ]
  },
  {
    id: 'recycling-labels', title: ['Sorting the recycling', 'Geri dönüşümü ayırmak'],
    opening: c => [c.name + ' and ' + c.friend + ' sort clean recycling with a grown-up.', c.name + ' ve ' + c.friend + ' bir yetişkinle temiz atıkları ayırıyor.'],
    detail: c => numberDetail(c, 'The tray is ' + c.color[0] + '.', 'Tepsi ' + c.color[1] + '.', 'paper sheets', 'kâğıt'),
    paths: [
      ['The bins have no labels', 'Kutuların üzerinde etiket yok', 'They add paper and plastic labels', 'Kâğıt ve plastik etiketleri ekliyorlar', 'They can tell which bin to use', 'Hangi kutuyu kullanacaklarını anlayabiliyorlar'],
      ['The paper bin is full', 'Kâğıt kutusu dolu', 'They ask the grown-up for another paper bin', 'Yetişkinden başka bir kâğıt kutusu istiyorlar', 'There is space for the paper', 'Kâğıtlar için yer açılıyor'],
      ['A plastic bottle is in the paper bin', 'Kâğıt kutusunda bir plastik şişe var', 'They move the bottle to the plastic bin', 'Şişeyi plastik kutusuna koyuyorlar', 'The bottle is in the correct bin', 'Şişe doğru kutuda duruyor']
    ]
  },
  {
    id: 'library-return', title: ['Returning a library book', 'Kütüphane kitabını geri vermek'],
    opening: c => [c.name + ' and ' + c.friend + ' return a library book.', c.name + ' ve ' + c.friend + ' kütüphane kitabını geri veriyor.'],
    detail: c => objectDetail(['The cover is ' + c.color[0] + '. The book is about ' + c.book[0] + '.', 'Kapak ' + c.color[1] + '. Kitabın konusu ' + c.book[1] + '.'], ['What is the book about?', 'Kitabın konusu ne?'], [c.bookEN, c.bookTR]),
    paths: [
      ['They cannot find the return desk', 'Kitap teslim masasını bulamıyorlar', 'They ask the librarian to show the desk', 'Kütüphaneciden masayı göstermesini istiyorlar', 'They reach the return desk', 'Kitap teslim masasına ulaşıyorlar'],
      ['A bookmark is still inside the book', 'Kitabın içinde bir ayraç kalmış', 'They take out their bookmark', 'Kendi ayraçlarını çıkarıyorlar', 'The bookmark is back in their bag', 'Ayraç yeniden çantalarına konuyor'],
      ['The book is missing from the bag', 'Kitap çantada yok', 'They check the shelf at home with a grown-up', 'Bir yetişkinle evdeki rafa bakıyorlar', 'They find the book on the shelf', 'Kitabı rafta buluyorlar']
    ]
  },
  {
    id: 'train-ticket', title: ['Getting ready for a train journey', 'Tren yolculuğuna hazırlanmak'],
    opening: c => [c.name + ' and ' + c.friend + ' wait for a train with a grown-up.', c.name + ' ve ' + c.friend + ' bir yetişkinle tren bekliyor.'],
    detail: c => colorDetail(c, 'ticket holder', 'Bilet kılıfı'),
    paths: [
      ['The ticket is not in the front pocket', 'Bilet ön cepte yok', 'They look in the other pocket', 'Diğer cebe bakıyorlar', 'They find the ticket in the other pocket', 'Bileti diğer cepte buluyorlar'],
      ['They cannot read the platform number', 'Peron numarasını okuyamıyorlar', 'They ask a station worker for the number', 'İstasyon görevlisine numarayı soruyorlar', 'They know which platform to use', 'Hangi perona gideceklerini öğreniyorlar'],
      ['The train has not arrived yet', 'Tren henüz gelmemiş', 'They wait with the grown-up in the waiting area', 'Bekleme alanında yetişkinle bekliyorlar', 'They are ready when the train arrives', 'Tren geldiğinde hazır oluyorlar']
    ]
  },
  {
    id: 'puzzle-piece', title: ['Finishing the puzzle', 'Yapbozu tamamlamak'],
    opening: c => [c.name + ' and ' + c.friend + ' work on a puzzle.', c.name + ' ve ' + c.friend + ' bir yapboz yapıyor.'],
    detail: c => numberDetail(c, 'The puzzle tray is ' + c.color[0] + '.', 'Yapboz tepsisi ' + c.color[1] + '.', 'loose pieces', 'ayrı parça'),
    paths: [
      ['One puzzle piece is missing', 'Bir yapboz parçası eksik', 'They look under the tray', 'Tepsinin altına bakıyorlar', 'They find the missing piece', 'Eksik parçayı buluyorlar'],
      ['A puzzle piece is upside down', 'Bir yapboz parçası ters duruyor', 'They turn the piece over', 'Parçayı çeviriyorlar', 'They can see the picture on the piece', 'Parçanın üzerindeki resmi görebiliyorlar'],
      ['The pieces are from two different puzzles', 'Parçalar iki farklı yapboza ait', 'They sort the pieces using the box pictures', 'Parçaları kutulardaki resimlere göre ayırıyorlar', 'Each puzzle has its own pieces', 'Her yapbozun parçaları ayrılıyor']
    ]
  },
  {
    id: 'plant-watering', title: ['Caring for the garden plants', 'Bahçedeki bitkilere bakmak'],
    opening: c => [c.name + ' and ' + c.friend + ' care for plants with a grown-up.', c.name + ' ve ' + c.friend + ' bir yetişkinle bitkilere bakıyor.'],
    detail: c => colorDetail(c, 'watering can', 'Sulama kabı'),
    paths: [
      ['The watering can is empty', 'Sulama kabı boş', 'They ask the grown-up to fill the can', 'Yetişkinden kabı doldurmasını istiyorlar', 'There is water for the plants', 'Bitkiler için su hazır oluyor'],
      ['A small pot is lying on its side', 'Küçük bir saksı yana yatmış', 'They stand the pot upright', 'Saksıyı dik konuma getiriyorlar', 'The plant stands upright again', 'Bitki yeniden dik duruyor'],
      ['Dry leaves are covering the path', 'Kuru yapraklar yolu kapatıyor', 'They collect the leaves with the grown-up', 'Yetişkinle birlikte yaprakları topluyorlar', 'The garden path is clear', 'Bahçe yolu açılıyor']
    ]
  },
  {
    id: 'treasure-note', title: ['Following a treasure clue', 'Hazine ipucunu izlemek'],
    opening: c => [c.name + ' and ' + c.friend + ' play a treasure game at home.', c.name + ' ve ' + c.friend + ' evde hazine oyunu oynuyor.'],
    detail: c => colorDetail(c, 'clue envelope', 'İpucu zarfı'),
    paths: [
      ['They cannot read the clue about the table', 'Masayla ilgili ipucunu okuyamıyorlar', 'They read the clue together and look under the table', 'İpucunu birlikte okuyup masanın altına bakıyorlar', 'They find the next note under the table', 'Sonraki notu masanın altında buluyorlar'],
      ['They cannot read the clue about the bookcase', 'Kitaplıkla ilgili ipucunu okuyamıyorlar', 'They read the clue together and look beside the bookcase', 'İpucunu birlikte okuyup kitaplığın yanına bakıyorlar', 'They find the next note beside the bookcase', 'Sonraki notu kitaplığın yanında buluyorlar'],
      ['They cannot read the clue about the toy box', 'Oyuncak kutusuyla ilgili ipucunu okuyamıyorlar', 'They read the clue together and look inside the toy box', 'İpucunu birlikte okuyup oyuncak kutusunun içine bakıyorlar', 'They find the next note inside the toy box', 'Sonraki notu oyuncak kutusunun içinde buluyorlar']
    ]
  },
  {
    id: 'taking-turns', title: ['Taking turns with a toy', 'Oyuncakla sırayla oynamak'],
    opening: c => [c.name + ' and ' + c.friend + ' share a toy during playtime.', c.name + ' ve ' + c.friend + ' oyun saatinde bir oyuncak paylaşıyor.'],
    detail: c => objectDetail(['The toy box is ' + c.color[0] + '. The toy is ' + c.toy[0] + '.', 'Oyuncak kutusu ' + c.color[1] + '. Oyuncak bir ' + c.toy[1] + '.'], ['What toy do they share?', 'Hangi oyuncağı paylaşıyorlar?'], [c.toyEN, c.toyTR]),
    paths: [
      ['They both want the same toy at once', 'İkisi de aynı anda aynı oyuncağı istiyor', 'They agree to take turns', 'Sırayla oynamaya karar veriyorlar', 'Both children get a turn', 'İki çocuk da sırayla oynuyor'],
      ['The toy needs two people to play', 'Oyuncakla oynamak için iki kişi gerekiyor', 'They play with the toy together', 'Oyuncakla birlikte oynuyorlar', 'They can use the toy as a pair', 'Oyuncağı iki kişi kullanabiliyorlar'],
      ['They do not know who will go first', 'Önce kimin oynayacağını bilmiyorlar', 'They ask a grown-up to help make a fair plan', 'Adil bir plan için bir yetişkinden yardım istiyorlar', 'They know the order of their turns', 'Oynama sıralarını öğreniyorlar']
    ]
  },
  {
    id: 'bus-queue', title: ['Waiting at the bus stop', 'Otobüs durağında beklemek'],
    opening: c => [c.name + ' and ' + c.friend + ' wait for a bus with a grown-up.', c.name + ' ve ' + c.friend + ' bir yetişkinle otobüs bekliyor.'],
    detail: c => colorDetail(c, 'backpack', 'Sırt çantası'),
    paths: [
      ['They do not know where the queue ends', 'Sıranın nerede bittiğini bilmiyorlar', 'They ask the grown-up to show the end of the queue', 'Yetişkinden sıranın sonunu göstermesini istiyorlar', 'They wait at the end of the queue', 'Sıranın sonunda bekliyorlar'],
      ['The stop sign is hidden by a branch', 'Durak tabelasını bir dal kapatıyor', 'They read the timetable with the grown-up', 'Yetişkinle birlikte saat çizelgesini okuyorlar', 'They learn when the bus will arrive', 'Otobüsün ne zaman geleceğini öğreniyorlar'],
      ['Rain is falling at the stop', 'Durakta yağmur yağıyor', 'They move under the shelter with the grown-up', 'Yetişkinle birlikte durağın çatısı altına geçiyorlar', 'They can wait out of the rain', 'Yağmurun altında kalmadan bekleyebiliyorlar']
    ]
  },
  {
    id: 'pet-space', title: ['Making a safe place for the pet', 'Hayvana güvenli bir yer hazırlamak'],
    opening: c => [c.name + ' and ' + c.friend + ' help a grown-up care for a pet.', c.name + ' ve ' + c.friend + ' hayvan bakımında bir yetişkine yardım ediyor.'],
    detail: c => objectDetail(['The pet has a ' + c.color[0] + ' mat. It is ' + c.pet[0] + '.', 'Hayvanın minderi ' + c.color[1] + '. Bu hayvan bir ' + c.pet[1] + '.'], ['What animal do they care for?', 'Hangi hayvana bakıyorlar?'], [c.petEN, c.petTR]),
    paths: [
      ['The water bowl is empty', 'Su kabı boş', 'They ask the grown-up to add fresh water', 'Yetişkinden taze su eklemesini istiyorlar', 'The pet has water to drink', 'Hayvanın içmek için suyu oluyor'],
      ['The pet mat is dirty', 'Hayvanın minderi kirli', 'They replace it with a clean mat', 'Yerine temiz bir minder koyuyorlar', 'The pet has a clean resting place', 'Hayvanın temiz bir dinlenme yeri oluyor'],
      ['A toy is blocking the pet bed', 'Bir oyuncak hayvanın yatağını kapatıyor', 'They move the toy into a box', 'Oyuncağı bir kutuya koyuyorlar', 'The pet can reach its bed', 'Hayvan yatağına ulaşabiliyor']
    ]
  },
  {
    id: 'music-practice', title: ['Preparing for music practice', 'Müzik çalışmasına hazırlanmak'],
    opening: c => [c.name + ' and ' + c.friend + ' practice music.', c.name + ' ve ' + c.friend + ' müzik çalışıyor.'],
    detail: c => objectDetail(['The music folder is ' + c.color[0] + '. They play ' + c.instrument[0] + '.', 'Müzik dosyası ' + c.color[1] + '. Bir ' + c.instrument[1] + ' çalıyorlar.'], ['What instrument do they play?', 'Hangi çalgıyı çalıyorlar?'], [c.instrumentEN, c.instrumentTR]),
    paths: [
      ['The music page is missing', 'Müzik sayfası kayıp', 'They look inside the music folder', 'Müzik dosyasının içine bakıyorlar', 'They find the music page', 'Müzik sayfasını buluyorlar'],
      ['The music stand is too low', 'Nota sehpası çok alçak', 'They ask a grown-up to raise the stand', 'Bir yetişkinden sehpayı yükseltmesini istiyorlar', 'They can read the music while playing', 'Çalarken notaları okuyabiliyorlar'],
      ['A page keeps falling off the stand', 'Sayfa sehpadan düşüp duruyor', 'They hold the page with a clip', 'Sayfayı bir mandalla tutturuyorlar', 'The page stays in place', 'Sayfa yerinde duruyor']
    ]
  },
  {
    id: 'craft-table', title: ['Preparing the craft table', 'Etkinlik masasını hazırlamak'],
    opening: c => [c.name + ' and ' + c.friend + ' prepare a craft table.', c.name + ' ve ' + c.friend + ' etkinlik masasını hazırlıyor.'],
    detail: c => numberDetail(c, 'The paper is ' + c.color[0] + '.', 'Kâğıt ' + c.color[1] + '.', 'pencils', 'kalem'),
    paths: [
      ['The pencils are mixed in a large box', 'Kalemler büyük bir kutuda karışmış', 'They put the pencils in a cup', 'Kalemleri bir bardağa koyuyorlar', 'The pencils are easy to find', 'Kalemler kolayca bulunabiliyor'],
      ['There is no paper on the table', 'Masada kâğıt yok', 'They bring paper from the shelf', 'Raftan kâğıt getiriyorlar', 'The table is ready for drawing', 'Masa resim çizmek için hazır'],
      ['The glue bottle lid is stuck', 'Yapıştırıcı şişesinin kapağı sıkışmış', 'They ask a grown-up to open the lid', 'Bir yetişkinden kapağı açmasını istiyorlar', 'The glue is ready to use', 'Yapıştırıcı kullanıma hazır']
    ]
  },
  {
    id: 'building-bridge', title: ['Making a block bridge', 'Bloklardan köprü yapmak'],
    opening: c => [c.name + ' and ' + c.friend + ' build a bridge with blocks.', c.name + ' ve ' + c.friend + ' bloklardan köprü yapıyor.'],
    detail: c => numberDetail(c, 'The block tray is ' + c.color[0] + '.', 'Blok tepsisi ' + c.color[1] + '.', 'long blocks', 'uzun blok'),
    paths: [
      ['The two sides are too far apart', 'İki kenar birbirinden çok uzak', 'They move the sides closer together', 'Kenarları birbirine yaklaştırıyorlar', 'The long block reaches both sides', 'Uzun blok iki kenara da ulaşıyor'],
      ['One side of the bridge is too low', 'Köprünün bir kenarı çok alçak', 'They add a block under the low side', 'Alçak kenarın altına bir blok ekliyorlar', 'Both sides are the same height', 'İki kenar aynı yüksekliğe geliyor'],
      ['The bridge is standing on a soft cushion', 'Köprü yumuşak bir minderin üzerinde duruyor', 'They rebuild it on the flat floor', 'Köprüyü düz zeminde yeniden yapıyorlar', 'The bridge stands firmly', 'Köprü sağlam duruyor']
    ]
  },
  {
    id: 'changing-plan', title: ['Making a new activity plan', 'Yeni bir etkinlik planı yapmak'],
    opening: c => [c.name + ' and ' + c.friend + ' plan a game with a grown-up.', c.name + ' ve ' + c.friend + ' bir yetişkinle oyun planı yapıyor.'],
    detail: c => objectDetail(['The plan card is ' + c.color[0] + '. They want to use ' + c.toy[0] + '.', 'Plan kartı ' + c.color[1] + '. Bir ' + c.toy[1] + ' kullanmak istiyorlar.'], ['What toy is in their plan?', 'Planlarında hangi oyuncak var?'], [c.toyEN, c.toyTR]),
    paths: [
      ['It starts raining before the outdoor game', 'Dışarıdaki oyundan önce yağmur başlıyor', 'They choose an indoor game with the grown-up', 'Yetişkinle birlikte evde bir oyun seçiyorlar', 'They have a game to play indoors', 'Evde oynayacakları bir oyun oluyor'],
      ['The planned game needs more players', 'Planlanan oyun için daha çok oyuncu gerekiyor', 'They choose a game for two players', 'İki kişilik bir oyun seçiyorlar', 'They can play with the people present', 'Yanlarındaki kişilerle oynayabiliyorlar'],
      ['They feel tired before the game', 'Oyundan önce yorgun hissediyorlar', 'They choose a rest before playing', 'Oynamadan önce dinlenmeyi seçiyorlar', 'They rest before starting the game', 'Oyuna başlamadan önce dinleniyorlar']
    ]
  }
];

export function moreStories(language = 'en') {
  const column = language === 'tr' ? 1 : 0;
  const bank = [];
  MORE_STORY_TEMPLATES.forEach((template, templateIndex) => {
    for (let variant = 0; variant < MORE_STORY_VARIANTS; variant++) {
      const c = storyContext(variant);
      const pathIndex = (Math.floor(variant / 4) + Math.floor(variant / 72)) % template.paths.length;
      const path = template.paths[pathIndex];
      const others = template.paths.filter((_, index) => index !== pathIndex);
      const detail = template.detail(c);
      const problem = path[column], action = path[2 + column], result = path[4 + column];
      const help = column ? c.name + ', ' + c.friend + ' adlı arkadaşından yardım istiyor.' : c.name + ' asks ' + c.friend + ' for help.';
      const story = [template.opening(c)[column], detail.lines[column], problem + '.', help + ' ' + action + '.', result + '.'].map(line => upper(line, language));
      const titles = [template, MORE_STORY_TEMPLATES[(templateIndex + 7) % MORE_STORY_TEMPLATES.length], MORE_STORY_TEMPLATES[(templateIndex + 13) % MORE_STORY_TEMPLATES.length]].map(t => t.title[column]);
      const questions = [
        { prompt: detail.prompts[column], choices: detail.choices[column], level: 1, skill: detail.skill, evidence: 1 },
        { prompt: column ? c.name + ' kimden yardım istiyor?' : 'Who does ' + c.name + ' ask for help?', choices: c.friendChoices, level: 1, skill: 'story-person', evidence: 3 },
        { prompt: column ? c.name + ' neden yardım istiyor?' : 'Why does ' + c.name + ' ask for help?', choices: [problem, ...others.map(p => p[column])], level: 2, skill: 'story-cause', evidence: 2 },
        { prompt: column ? 'Sorunu fark ettikten sonra ne yapıyorlar?' : 'What do they do next, after noticing the problem?', choices: [action, ...others.map(p => p[2 + column])], level: 2, skill: 'story-sequence', evidence: 3 },
        { prompt: column ? 'Çözümden sonra ne oluyor?' : 'What happens after their solution?', choices: [result, ...others.map(p => p[4 + column])], level: 3, skill: 'story-result', evidence: 4 },
        { prompt: column ? 'Bu hikâyeye en uygun başlık hangisi?' : 'Which title best fits this story?', choices: titles, level: 3, skill: 'story-main-idea' }
      ];
      questions.forEach((question, index) => {
        const choices = question.choices.map(text => upper(text, language));
        bank.push({
          id: language + '-reading-new-' + template.id + '-' + variant + '-' + index,
          language, subject: 'reading', level: question.level, prompt: question.prompt,
          choices, answer: choices[0], enabled: true, skill: question.skill, story,
          family: template.id, contentKey: language + '-story-new-' + template.id + '-' + variant,
          evidenceLine: question.evidence,
          hint: column ? 'Soruda ne istendiğine bak. Cevabı hikâyeyi tekrar okuyarak veya dinleyerek bul.' : 'Look at what the question asks. Read or listen to the story again to find the answer.'
        });
      });
    }
  });
  return bank;
}
