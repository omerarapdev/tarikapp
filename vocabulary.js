// Each noun has a definition, a category, and a sentence with an uninflected answer.
// Distractors come from other categories so broad definitions have only one matching choice.
const categories = {
  animals:['animals','hayvanlar'], fruit:['fruit','meyveler'], vegetables:['vegetables','sebzeler'],
  food:['food','yiyecekler'], drinks:['drinks','içecekler'], sky:['sky and weather','gökyüzü ve hava'],
  plants:['plants','bitkiler'], school:['school supplies','okul eşyaları'], toys:['toys and games','oyuncaklar ve oyunlar'],
  transport:['vehicles','taşıtlar'], home:['things at home','ev eşyaları'], clothing:['clothes','giysiler'],
  body:['body parts','vücudumuz'], tools:['tools','aletler'], music:['musical instruments','müzik aletleri'], places:['places','yerler']
};
const baseDetails = [
  ['animals','The pet that says meow is a ____.','Miyav diyen hayvan bir ____.'],
  ['animals','The pet that says woof is a ____.','Hav hav diyen hayvan bir ____.'],
  ['animals','The long-eared animal in the picture is a ____.','Resimdeki uzun kulaklı hayvan bir ____.'],
  ['animals','The animal with a beak and feathers is a ____.','Gagası ve tüyleri olan hayvan bir ____.'],
  ['animals','The animal swimming with fins is a ____.','Yüzgeçleriyle yüzen hayvan bir ____.'],
  ['animals','The insect with colorful wings is a ____.','Renkli kanatlı böcek bir ____.'],
  ['fruit','The red fruit in the picture is an ____.','Resimdeki kırmızı meyve bir ____.'],
  ['fruit','I peel the yellow fruit called a ____.','Sarı meyvenin adı ____.'],
  ['vegetables','The orange vegetable in the picture is a ____.','Resimdeki turuncu sebze bir ____.'],
  ['food','A sandwich has two slices of ____.','Sandviç yapmak için iki dilim ____ kullanırız.'],
  ['drinks','The white drink in the glass is ____.','Bardaktaki beyaz içecek ____.'],
  ['drinks','The clear drink in my bottle is ____.','Şişemdeki berrak içecek ____.'],
  ['sky','The bright object that warms Earth is the ____.','Dünyamızı ısıtan parlak gök cismi ____.'],
  ['sky','The crescent in the night sky is the ____.','Gece gökyüzündeki hilal bir ____.'],
  ['sky','A tiny twinkling light in the night sky is a ____.','Gece gökyüzünde parlayan küçük ışık bir ____.'],
  ['sky','Water drops falling from clouds are called ____.','Bulutlardan düşen su damlalarının adı ____.'],
  ['plants','A tall plant with a trunk is a ____.','Gövdesi olan uzun bitki bir ____.'],
  ['plants','The plant with yellow petals is a ____.','Sarı yaprakları olan bitki bir ____.'],
  ['school','Pages and a cover make a ____.','Sayfaları ve kapağı olan eşya bir ____.'],
  ['school','I draw a line with a ____.','Çizgi çizmek için ____ kullanırım.'],
  ['toys','The round toy I kick is a ____.','Ayakla vurduğum yuvarlak oyuncak bir ____.'],
  ['transport','The vehicle with two wheels and pedals is a ____.','İki tekerleği ve pedalı olan taşıt bir ____.'],
  ['transport','The vehicle that runs on rails is a ____.','Raylarda giden taşıt bir ____.'],
  ['transport','The big road vehicle carrying passengers is a ____.','Yolda çok sayıda yolcu taşıyan taşıt bir ____.'],
  ['transport','The vehicle launching into space is a ____.','Uzaya fırlatılan taşıt bir ____.'],
  ['transport','The vehicle floating on water is a ____.','Suda yüzen taşıt bir ____.'],
  ['places','The building where a family lives is a ____.','Bir ailenin yaşadığı bina bir ____.'],
  ['tools','I open a lock with a ____.','Kilidi açmak için ____ kullanırım.'],
  ['clothing','The thing I wear on my foot is a ____.','Ayağıma giydiğim eşya bir ____.'],
  ['clothing','The thing I wear on my head is a ____.','Başıma taktığım eşya bir ____.'],
  ['home','The thing that tells the time is a ____.','Zamanı gösteren eşya bir ____.'],
  ['home','The place where I sleep is a ____.','Uyuduğum eşya bir ____.']
];
// Categories overlap in daily life: fruit is also food; a ruler is also a tool.
// Keep all such categories out of the distractors for a category question.
const overlaps=[['fruit','vegetables','food','drinks','plants'],['home','school','tools','music','clothing','toys','plants','food','drinks','places'],['school','tools','music'],['animals','toys']];
export function distinctCategories(category) {
  const excluded=new Set([category]);
  for(const group of overlaps)if(group.includes(category))for(const item of group)excluded.add(item);
  return Object.keys(categories).filter(c=>!excluded.has(c));
}
export function categoryAlternatives(category) {
  return [category,...distinctCategories(category).slice(0,2)];
}
const extraWords = [
  ['lion','aslan','🦁','A big cat with a mane.','Yelesi olan büyük bir kedi.','animals','The animal with a mane is a ____.','Yelesi olan hayvan bir ____.'],
  ['tiger','kaplan','🐯','A big cat with dark stripes.','Koyu çizgileri olan büyük bir kedi.','animals','The striped big cat is a ____.','Çizgili büyük kedi bir ____.'],
  ['elephant','fil','🐘','A large animal with a trunk.','Hortumu olan büyük bir hayvan.','animals','The animal with a long trunk is an ____.','Uzun hortumlu hayvan bir ____.'],
  ['giraffe','zürafa','🦒','An animal with a very long neck.','Çok uzun boynu olan bir hayvan.','animals','The animal with the very long neck is a ____.','Çok uzun boyunlu hayvan bir ____.'],
  ['zebra','zebra','🦓','An animal with black and white stripes.','Siyah beyaz çizgili bir hayvan.','animals','The black and white striped animal is a ____.','Siyah beyaz çizgili hayvan bir ____.'],
  ['bear','ayı','🐻','A large furry animal that can live in forests.','Ormanda yaşayabilen büyük, tüylü bir hayvan.','animals','The large furry forest animal in the picture is a ____.','Resimdeki büyük, tüylü orman hayvanı bir ____.'],
  ['fox','tilki','🦊','A wild animal with a bushy tail.','Kabarık kuyruklu yabani bir hayvan.','animals','The bushy-tailed animal in the picture is a ____.','Resimdeki kabarık kuyruklu hayvan bir ____.'],
  ['monkey','maymun','🐒','An animal that can climb and grasp branches.','Dalları tutup tırmanabilen bir hayvan.','animals','The climbing animal in the picture is a ____.','Resimdeki tırmanan hayvan bir ____.'],
  ['panda','panda','🐼','A black and white bear that eats bamboo.','Bambu yiyen siyah beyaz bir ayı.','animals','The bear that eats bamboo is a ____.','Bambu yiyen ayı bir ____.'],
  ['penguin','penguen','🐧','A bird that swims but cannot fly.','Yüzen ama uçamayan bir kuş.','animals','The black and white swimming bird is a ____.','Siyah beyaz yüzücü kuş bir ____.'],
  ['duck','ördek','🦆','A bird with a wide beak that can swim.','Geniş gagalı, yüzebilen bir kuş.','animals','The swimming bird with a wide beak is a ____.','Geniş gagalı, yüzen kuş bir ____.'],
  ['owl','baykuş','🦉','A bird with large eyes, often active at night.','Büyük gözlü, genellikle gece hareketli bir kuş.','animals','The large-eyed night bird is an ____.','Büyük gözlü gece kuşu bir ____.'],
  ['frog','kurbağa','🐸','A small animal that can hop and croak.','Zıplayıp vıraklayan küçük bir hayvan.','animals','The animal that says ribbit is a ____.','Vıraklayan hayvan bir ____.'],
  ['turtle','kaplumbağa','🐢','An animal with a hard shell.','Sert kabuğu olan bir hayvan.','animals','The animal carrying a hard shell is a ____.','Sert kabuk taşıyan hayvan bir ____.'],
  ['snail','salyangoz','🐌','A slow animal with a spiral shell.','Sarmal kabuklu, yavaş bir hayvan.','animals','The slow animal with a spiral shell is a ____.','Sarmal kabuklu yavaş hayvan bir ____.'],
  ['bee','arı','🐝','An insect that can make honey.','Bal yapabilen bir böcek.','animals','The insect that makes honey is a ____.','Bal yapan böcek bir ____.'],
  ['ladybug','uğur böceği','🐞','A small beetle often shown with a red, spotted back.','Sırtı genellikle kırmızı ve benekli gösterilen küçük bir böcek.','animals','The little spotted beetle is a ____.','Küçük, benekli böcek bir ____.'],
  ['ant','karınca','🐜','A small insect that often lives in a colony.','Genellikle topluluk hâlinde yaşayan küçük bir böcek.','animals','The tiny insect in the picture is an ____.','Resimdeki minicik böcek bir ____.'],
  ['horse','at','🐴','An animal with hooves and a mane that can gallop.','Toynaklı, yeleli, dörtnala koşabilen bir hayvan.','animals','The animal with hooves in the picture is a ____.','Resimdeki toynaklı hayvan bir ____.'],
  ['cow','inek','🐮','A farm animal that gives milk.','Süt veren bir çiftlik hayvanı.','animals','The farm animal that says moo is a ____.','Möö diyen çiftlik hayvanı bir ____.'],
  ['sheep','koyun','🐑','A farm animal with wool.','Yünü olan bir çiftlik hayvanı.','animals','The farm animal with wool is a ____.','Yünlü çiftlik hayvanı bir ____.'],
  ['goat','keçi','🐐','A farm animal often shown with horns and a little beard.','Genellikle boynuzlu ve küçük sakallı gösterilen çiftlik hayvanı.','animals','The bearded farm animal in the picture is a ____.','Resimdeki sakallı çiftlik hayvanı bir ____.'],
  ['chicken','tavuk','🐔','A farm bird that lays eggs.','Yumurta veren bir çiftlik kuşu.','animals','The farm bird in the picture is a ____.','Resimdeki çiftlik kuşu bir ____.'],
  ['dolphin','yunus','🐬','A sea animal that breathes air and swims with fins.','Hava soluyan, yüzgeçli bir deniz hayvanı.','animals','The smiling sea animal in the picture is a ____.','Resimdeki deniz hayvanı bir ____.'],
  ['whale','balina','🐳','A very large sea animal that breathes air.','Hava soluyan çok büyük bir deniz hayvanı.','animals','The very large sea animal in the picture is a ____.','Resimdeki çok büyük deniz hayvanı bir ____.'],
  ['octopus','ahtapot','🐙','A sea animal with eight arms.','Sekiz kollu bir deniz hayvanı.','animals','The sea animal with eight arms is an ____.','Sekiz kollu deniz hayvanı bir ____.'],
  ['crab','yengeç','🦀','A sea animal with a hard shell and two claws.','Sert kabuklu, iki kıskaçlı bir deniz hayvanı.','animals','The animal with two claws is a ____.','İki kıskaçlı hayvan bir ____.'],
  ['orange','portakal','🍊','A round citrus fruit with orange peel.','Turuncu kabuklu, yuvarlak bir meyve.','fruit','The round fruit with orange peel is an ____.','Turuncu kabuklu yuvarlak meyve bir ____.'],
  ['pear','armut','🍐','A fruit often narrow at the top and wider at the bottom.','Üstü dar, altı geniş olabilen bir meyve.','fruit','The green fruit in the picture is a ____.','Resimdeki yeşil meyve bir ____.'],
  ['grapes','üzüm','🍇','Small fruits that grow in bunches.','Salkım hâlinde yetişen küçük meyveler.','fruit','The small fruits growing in a bunch are ____.','Salkımdaki küçük meyvelerin adı ____.'],
  ['strawberry','çilek','🍓','A red fruit with tiny seeds on the outside.','Dışında küçük çekirdekleri olan kırmızı bir meyve.','fruit','The red fruit with tiny outer seeds is a ____.','Dışında küçük çekirdekleri olan kırmızı meyve bir ____.'],
  ['watermelon','karpuz','🍉','A large fruit with green rind and often red flesh.','Yeşil kabuklu, içi genellikle kırmızı olan büyük bir meyve.','fruit','The fruit slice with green rind is ____.','Yeşil kabuklu meyve diliminin adı ____.'],
  ['cherry','kiraz','🍒','A small round fruit with a stem and a stone inside.','Sapı ve içinde çekirdeği olan küçük, yuvarlak bir meyve.','fruit','The small red fruit on a stem is a ____.','Sapındaki küçük kırmızı meyve bir ____.'],
  ['lemon','limon','🍋','A sour citrus fruit with yellow peel.','Sarı kabuklu, ekşi bir meyve.','fruit','The sour yellow fruit is a ____.','Ekşi, sarı meyve bir ____.'],
  ['peach','şeftali','🍑','A fruit often with soft, fuzzy skin.','Kabuğu yumuşak ve tüylü olabilen bir meyve.','fruit','The fuzzy-skinned fruit in the picture is a ____.','Resimdeki tüylü kabuklu meyve bir ____.'],
  ['pineapple','ananas','🍍','A tropical fruit with rough skin and a leafy top.','Pütürlü kabuklu, tepesi yapraklı bir meyve.','fruit','The fruit with a spiky leafy top is a ____.','Tepesinde sivri yaprakları olan meyve bir ____.'],
  ['kiwi','kivi','🥝','A small fruit often with brown skin and green flesh.','Genellikle kahverengi kabuklu, içi yeşil olan küçük bir meyve.','fruit','The sliced green fruit with brown skin is a ____.','Kahverengi kabuklu yeşil meyve diliminin adı ____.'],
  ['corn','mısır','🌽','Yellow kernels growing together on a cob.','Bir koçan üstünde birlikte yetişen sarı taneler.','vegetables','The yellow food growing on a cob is ____.','Koçanda yetişen sarı tanelerin adı ____.'],
  ['broccoli','brokoli','🥦','A green vegetable with a tree-like top.','Üst kısmı ağaca benzeyen yeşil bir sebze.','vegetables','The green vegetable shaped like a tiny tree is ____.','Küçük ağaca benzeyen yeşil sebze ____.'],
  ['potato','patates','🥔','A vegetable that grows underground.','Toprağın altında yetişen bir sebze.','vegetables','The brown underground vegetable in the picture is a ____.','Resimdeki kahverengi, toprak altında yetişen sebze bir ____.'],
  ['onion','soğan','🧅','A vegetable with many layers.','Birçok katmanı olan bir sebze.','vegetables','The round vegetable with many layers is an ____.','Birçok katmanı olan yuvarlak sebze bir ____.'],
  ['cucumber','salatalık','🥒','A long green vegetable.','Uzun, yeşil bir sebze.','vegetables','The long green vegetable in the picture is a ____.','Resimdeki uzun, yeşil sebze bir ____.'],
  ['egg','yumurta','🥚','A food with a shell, a white, and a yolk.','Kabuğu, beyazı ve sarısı olan bir yiyecek.','food','The food with a white and a yolk is an ____.','Beyazı ve sarısı olan yiyecek bir ____.'],
  ['cheese','peynir','🧀','A food made from milk.','Sütten yapılan bir yiyecek.','food','The yellow wedge made from milk is ____.','Sütten yapılan sarı dilim ____.'],
  ['cookie','kurabiye','🍪','A small baked sweet treat.','Fırında pişen küçük, tatlı bir yiyecek.','food','The small baked treat in the picture is a ____.','Resimdeki küçük tatlı yiyecek bir ____.'],
  ['cake','kek','🍰','A sweet baked food often served in slices.','Genellikle dilimlenerek sunulan tatlı, pişmiş bir yiyecek.','food','The sweet baked slice in the picture is ____.','Resimdeki tatlı, pişmiş dilim ____.'],
  ['soup','çorba','🍲','A liquid food often eaten with a spoon.','Genellikle kaşıkla içilen sıvı bir yiyecek.','food','The warm liquid food in my bowl is ____.','Kâsedeki sıcak, sıvı yiyecek ____.'],
  ['rice','pirinç','🍚','Small grains cooked to eat.','Pişirilerek yenen küçük taneler.','food','The cooked white grains in the bowl are ____.','Kâsedeki pişmiş beyaz tanelerin adı ____.'],
  ['ice cream','dondurma','🍦','A cold, frozen sweet food.','Soğuk, donmuş, tatlı bir yiyecek.','food','The frozen sweet treat in a cone is ____.','Külahtaki donmuş tatlı yiyecek ____.'],
  ['cloud','bulut','☁️','A shape in the sky made of tiny water drops or ice crystals.','Gökyüzünde küçük su damlaları veya buz kristallerinden oluşur.','sky','The white shape floating in the sky is a ____.','Gökyüzündeki beyaz şekil bir ____.'],
  ['snow','kar','❄️','Frozen flakes that fall from clouds.','Bulutlardan düşen donmuş taneler.','sky','The white frozen flakes are called ____.','Beyaz, donmuş tanelerin adı ____.'],
  ['rainbow','gökkuşağı','🌈','A colorful arc sometimes seen after rain.','Yağmurdan sonra görülebilen renkli bir yay.','sky','The colorful arc in the sky is a ____.','Gökyüzündeki renkli yay bir ____.'],
  ['leaf','yaprak','🍃','A flat part growing on many plants.','Birçok bitkide yetişen yassı bir parça.','plants','The green flat part on a tree is a ____.','Ağaçtaki yeşil, yassı parça bir ____.'],
  ['cactus','kaktüs','🌵','A plant that often has spines.','Genellikle dikenleri olan bir bitki.','plants','The plant with spines is a ____.','Dikenli bitki bir ____.'],
  ['notebook','defter','📓','A book of pages for writing or drawing.','Yazı yazmak veya çizmek için sayfaları olan bir eşya.','school','The book I fill with my own writing is a ____.','Kendi yazılarımla doldurduğum eşya bir ____.'],
  ['ruler','cetvel','📏','A tool for measuring lengths and drawing straight lines.','Uzunluk ölçmek ve düz çizgi çizmek için kullanılır.','school','I measure a line with a ____.','Çizginin uzunluğunu ölçmek için ____ kullanırım.'],
  ['scissors','makas','✂️','A tool with two blades for cutting.','Kesmek için iki bıçağı olan bir alet.','school','The cutting tool with two blades is ____.','İki bıçaklı kesme aletinin adı ____.'],
  ['backpack','sırt çantası','🎒','A bag carried on your back.','Sırtta taşınan bir çanta.','school','The bag on my back is a ____.','Sırtımda taşıdığım eşya bir ____.'],
  ['paintbrush','fırça','🖌️','A tool for spreading paint.','Boya sürmek için kullanılan bir araç.','school','I spread paint with a ____.','Boya sürmek için ____ kullanırım.'],
  ['crayon','pastel boya','🖍️','A colored drawing stick.','Renkli bir çizim çubuğu.','school','The colored drawing stick is a ____.','Renkli çizim çubuğunun adı ____.'],
  ['puzzle','yapboz','🧩','Pieces that fit together to make a picture.','Birleşerek bir resim oluşturan parçalar.','toys','The game with pieces that fit together is a ____.','Parçaları birleşen oyun bir ____.'],
  ['kite','uçurtma','🪁','A toy that flies in the wind on a string.','İpe bağlı, rüzgârda uçan bir oyuncak.','toys','The toy flying on a string is a ____.','İpe bağlı uçan oyuncak bir ____.'],
  ['teddy bear','oyuncak ayı','🧸','A soft toy shaped like a bear.','Ayı şeklinde yumuşak bir oyuncak.','toys','The soft toy shaped like a bear is a ____.','Ayı şeklindeki yumuşak oyuncak bir ____.'],
  ['balloon','balon','🎈','A light bag filled with air or gas.','Hava veya gazla şişirilen hafif bir oyuncak.','toys','The toy filled with air is a ____.','Havayla şişirilen oyuncak bir ____.'],
  ['car','araba','🚗','A road vehicle with four wheels.','Dört tekerlekli bir kara taşıtı.','transport','The four-wheeled road vehicle in the picture is a ____.','Resimdeki dört tekerlekli taşıt bir ____.'],
  ['airplane','uçak','✈️','A vehicle with wings that flies.','Kanatları olan, uçan bir taşıt.','transport','The flying vehicle with wings is an ____.','Kanatlı, uçan taşıt bir ____.'],
  ['helicopter','helikopter','🚁','A flying vehicle with rotating blades above it.','Üstünde dönen pervaneleri olan uçan bir taşıt.','transport','The flying vehicle with top blades is a ____.','Üstünde pervaneleri olan uçan taşıt bir ____.'],
  ['truck','kamyon','🚚','A road vehicle for carrying goods.','Eşya taşımak için kullanılan kara taşıtı.','transport','The large vehicle carrying boxes is a ____.','Kutuları taşıyan büyük taşıt bir ____.'],
  ['ambulance','ambulans','🚑','A vehicle that carries people who need urgent medical help.','Acil sağlık yardımı gereken insanları taşıyan araç.','transport','The emergency medical vehicle is an ____.','Acil sağlık yardım aracı bir ____.'],
  ['fire engine','itfaiye aracı','🚒','A vehicle used by firefighters.','İtfaiyecilerin kullandığı araç.','transport','The vehicle carrying firefighters is a ____.','İtfaiyecileri taşıyan araç bir ____.'],
  ['chair','sandalye','🪑','Furniture for one person to sit on.','Bir kişinin oturması için kullanılan eşya.','home','The seat for one person is a ____.','Bir kişinin oturduğu eşya bir ____.'],
  ['door','kapı','🚪','A part you open to enter a room.','Odaya girmek için açılan bölüm.','home','The thing I open to enter a room is a ____.','Odaya girmek için açtığım bölüm bir ____.'],
  ['lamp','lamba','💡','An object that gives light.','Işık veren bir eşya.','home','The object giving light in my room is a ____.','Odama ışık veren eşya bir ____.'],
  ['mirror','ayna','🪞','An object that shows a reflection.','Yansımamızı gösteren bir eşya.','home','I see my reflection in a ____.','Yansımamı gösteren eşya bir ____.'],
  ['spoon','kaşık','🥄','A tool for scooping food.','Yiyecek almak için kullanılan çukur bir araç.','home','I eat soup with a ____.','Çorba içerken ____ kullanırım.'],
  ['plate','tabak','🍽️','A flat dish for serving food.','Yemek koymak için kullanılan yassı eşya.','home','The flat dish holding my meal is a ____.','Yemeğimi koyduğum yassı eşya bir ____.'],
  ['toothbrush','diş fırçası','🪥','A brush for cleaning teeth.','Dişleri temizlemek için kullanılan fırça.','home','The tool for cleaning my teeth is a ____.','Dişlerimi temizleyen araç bir ____.'],
  ['soap','sabun','🧼','Something used with water to clean.','Suyla birlikte temizlik için kullanılır.','home','I wash my hands with water and ____.','Ellerimi yıkarken su ve ____ kullanırım.'],
  ['basket','sepet','🧺','A container often with a handle.','Genellikle sapı olan bir taşıma kabı.','home','The woven container in the picture is a ____.','Resimdeki örülü taşıma kabı bir ____.'],
  ['shirt','gömlek','👔','A piece of clothing for the upper body.','Vücudun üst kısmına giyilen giysi.','clothing','The collared clothing in the picture is a ____.','Resimdeki yakalı giysi bir ____.'],
  ['coat','mont','🧥','Outer clothing that helps keep you warm.','Sıcak kalmaya yardım eden dış giysi.','clothing','The warm outer clothing is a ____.','Sıcak tutan dış giysi bir ____.'],
  ['socks','çorap','🧦','Soft clothing worn on feet, often inside shoes.','Genellikle ayakkabının içine, ayağa giyilen yumuşak giysi.','clothing','The soft clothing inside my shoes is ____.','Ayakkabımın içindeki yumuşak giysinin adı ____.'],
  ['gloves','eldiven','🧤','Clothing that covers your hands.','Ellere giyilen giysi.','clothing','The clothing covering my hands is ____.','Ellerime giydiğim giysinin adı ____.'],
  ['scarf','atkı','🧣','A long piece of clothing worn around the neck.','Boyna takılan uzun giysi.','clothing','The warm cloth around my neck is a ____.','Boynumdaki sıcak tutan giysi bir ____.'],
  ['hand','el','✋','The body part with fingers.','Parmaklarımızın olduğu vücut bölümü.','body','The body part with fingers is a ____.','Parmakları olan vücut bölümünün adı ____.'],
  ['ear','kulak','👂','The body part used for hearing.','Duymak için kullandığımız vücut bölümü.','body','The body part that helps me hear is an ____.','Duymama yardım eden vücut bölümü bir ____.'],
  ['nose','burun','👃','The body part used for smelling.','Koklamak için kullandığımız vücut bölümü.','body','The body part that helps me smell is a ____.','Koklamama yardım eden vücut bölümü bir ____.'],
  ['eye','göz','👁️','The body part used for seeing.','Görmek için kullandığımız vücut bölümü.','body','The body part that helps me see is an ____.','Görmeme yardım eden vücut bölümü bir ____.'],
  ['foot','ayak','🦶','The body part at the end of a leg.','Bacağın ucundaki vücut bölümü.','body','The body part inside my shoe is a ____.','Ayakkabımın içindeki vücut bölümü bir ____.'],
  ['tooth','diş','🦷','A hard part in the mouth used for biting.','Ağızda, ısırmak için kullanılan sert bölüm.','body','The hard part I bite with is a ____.','Isırırken kullandığım sert bölüm bir ____.'],
  ['hammer','çekiç','🔨','A tool used to hit nails.','Çiviye vurmak için kullanılan alet.','tools','The tool used to hit a nail is a ____.','Çiviye vurmak için kullanılan alet bir ____.'],
  ['magnet','mıknatıs','🧲','An object that attracts some metals.','Bazı metalleri çeken eşya.','tools','The object attracting some metal pieces is a ____.','Bazı metal parçaları çeken eşya bir ____.'],
  ['flashlight','el feneri','🔦','A small light you can carry.','Elde taşınabilen küçük bir ışık.','tools','The light I carry in my hand is a ____.','Elimde taşıdığım ışık bir ____.'],
  ['guitar','gitar','🎸','A musical instrument with strings and a long neck.','Telleri ve uzun sapı olan bir müzik aleti.','music','The string instrument in the picture is a ____.','Resimdeki telli çalgı bir ____.'],
  ['drum','davul','🥁','A musical instrument played by tapping or hitting.','Vurularak çalınan bir müzik aleti.','music','The instrument I tap with sticks is a ____.','Bagetle vurularak çalınan çalgı bir ____.'],
  ['violin','keman','🎻','A small string instrument often played with a bow.','Genellikle yayla çalınan küçük, telli bir çalgı.','music','The string instrument played with a bow is a ____.','Yayla çalınan telli çalgı bir ____.'],
  ['school','okul','🏫','A place where children learn together.','Çocukların birlikte öğrendiği yer.','places','The building where a class learns is a ____.','Bir sınıfın birlikte öğrendiği bina bir ____.'],
  ['hospital','hastane','🏥','A place where people receive medical care.','İnsanların sağlık hizmeti aldığı yer.','places','The building for medical care is a ____.','Sağlık hizmeti alınan bina bir ____.']
];
const moreOpposites = [
  ['clean','temiz','dirty','kirli'],['light','hafif','heavy','ağır'],['near','yakın','far','uzak'],['inside','içeri','outside','dışarı'],
  ['early','erken','late','geç'],['first','ilk','last','son'],['new','yeni','old','eski'],['soft','yumuşak','hard','sert'],
  ['quiet','sessiz','noisy','gürültülü'],['thick','kalın','thin','ince'],['wide','geniş','narrow','dar'],['high','yüksek','low','alçak'],
  ['bright','aydınlık','dark','karanlık'],['sweet','tatlı','sour','ekşi'],['smooth','pürüzsüz','rough','pürüzlü'],['strong','güçlü','weak','zayıf'],
  ['easy','kolay','difficult','zor'],['together','birlikte','apart','ayrı'],['straight','düz','curved','eğri'],['deep','derin','shallow','sığ'],
  ['front','ön','back','arka'],['left','sol','right','sağ'],['awake','uyanık','asleep','uykuda'],['tidy','düzenli','messy','dağınık'],
  ['more','daha fazla','less','daha az'],['beginning','başlangıç','end','bitiş'],['above','üstünde','below','altında'],['same','aynı','different','farklı'],
  ['push','itmek','pull','çekmek'],['laugh','gülmek','cry','ağlamak']
];

export function vocabularyCatalog(baseWords) {
  return [...baseWords.map((word,i)=>[...word,...baseDetails[i]]),...extraWords];
}
export function expandedVocabulary(language, baseWords, baseOpposites) {
  const tr=language==='tr', index=tr?1:0, catalog=vocabularyCatalog(baseWords), bank=[];
  const add=(key,level,prompt,choices,answer,extra={})=>bank.push({id:`${language}-vocabulary-${key}`,language,subject:'vocabulary',level,prompt,choices,answer,enabled:true,...extra});
  const alphabet=tr?['A','B','C','Ç','D','E','F','G','Ğ','H','I','İ','J','K','L','M','N','O','Ö','P','R','S','Ş','T','U','Ü','V','Y','Z']:Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  const letters=answer=>[answer,...alphabet.filter(letter=>letter!==answer).filter((_,i)=>i%7===0).slice(0,2)];
  catalog.forEach((word,i)=>{
    const name=word[index], category=word[5], allowed=distinctCategories(category), distractors=catalog.filter(other=>allowed.includes(other[5])&&other[2]!==word[2]);
    const choices=[name,distractors[(i*7)%distractors.length][index],distractors[(i*7+23)%distractors.length][index]];
    const shared={contentKey:`${language}-word-${i}`,family:category};
    const hint=word[tr?4:3], picture={kind:'single',items:[word[2]]};
    // Preserve the original IDs for the first 32 picture and definition questions.
    if(i>=baseWords.length) {
      add(`name-${i}`,1,tr?'Bu resimde ne var?':'What is in this picture?',choices,name,{...shared,skill:'picture-word',visual:picture,hint});
      add(`clue-${i}`,2,hint,choices,name,{...shared,skill:'word-meaning',hint:tr?`İlk harfi: ${name[0].toLocaleUpperCase('tr')}.`:`Its first letter is ${name[0].toUpperCase()}.`});
    }
    const first=name[0].toLocaleUpperCase(language), last=name.at(-1).toLocaleUpperCase(language);
    add(`first-${i}`,1,tr?`“${name}” hangi harfle başlıyor?`:`What is the first letter of “${name}”?`,letters(first),first,{...shared,skill:'first-letter',visual:picture,hint:tr?'Kelimenin en başındaki harfe bak.':'Look at the letter at the start of the word.'});
    add(`last-${i}`,1,tr?`“${name}” hangi harfle bitiyor?`:`What is the last letter of “${name}”?`,letters(last),last,{...shared,skill:'last-letter',visual:picture,hint:tr?'Kelimenin en sonundaki harfe bak.':'Look at the letter at the end of the word.'});
    add(`missing-${i}`,2,tr?`Eksik ilk harfi bul: _${name.slice(1)}`:`Find the missing first letter: _${name.slice(1)}`,letters(first),first,{...shared,skill:'missing-letter',visual:picture,hint});
    const categoryNames=categoryAlternatives(category).map(c=>categories[c][index]);
    add(`group-${i}`,2,tr?`“${name}” hangi grupta?`:`Which group does “${name}” belong to?`,categoryNames,categories[category][index],{...shared,skill:'word-category',hint});
    add(`sentence-${i}`,3,tr?`Boşluğu doldur: ${word[7]}`:`Fill the blank: ${word[6]}`,choices,name,{...shared,skill:'sentence-word',hint});
  });
  const oppositePairs=[...baseOpposites,...moreOpposites];
  oppositePairs.forEach((word,i)=>{
    const shared={contentKey:`${language}-opposites-${i}`,family:'opposites',skill:'opposites',hint:tr?'Ters anlamlı kelimeyi seç.':'Choose the word with the reverse meaning.'};
    const a=word[index], b=word[index+2], other=oppositePairs[(i+3)%oppositePairs.length][index+2];
    if(i>=baseOpposites.length)add(`opposite-${i}`,3,tr?`“${a}” kelimesinin zıttı ne?`:`What is the opposite of “${a}”?`,[b,a,other],b,shared);
    add(`reverse-${i}`,3,tr?`“${b}” kelimesinin zıttı ne?`:`What is the opposite of “${b}”?`,[a,b,other],a,shared);
    const different=oppositePairs[(i+7)%oppositePairs.length][index];
    add(`pair-${i}`,3,tr?`Hangi çift zıt anlamlı? “${a}” ve …`:`Complete the opposite pair: “${a}” and …`,[b,different,other],b,shared);
  });
  return bank;
}
