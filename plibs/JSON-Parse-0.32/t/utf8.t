use warnings;
use strict;
use Test::More;
use JSON::Parse ':all';

# Test valid JSON.

no utf8;

ok (valid_json ('["蟹"]'));
ok (valid_json ('{"動物":"像"}'));
my $bad_cont = sprintf ('["%c"]', 0x80);
ok (! valid_json ($bad_cont));
eval {
    assert_valid_json ($bad_cont);
};
like ($@, qr/Unexpected character 0x80 parsing string/);


use utf8;

ok (valid_json ('["蟹"]'));
ok (valid_json ('{"動物":"像"}'));
# From UTF-8 SAMPLER
ok (valid_json ('["¥ · £ · € · $ · ¢ · ₡ · ₢ · ₣ · ₤ · ₥ · ₦ · ₧ · ₨ · ₩ · ₪ · ₫ · ₭ · ₮ · ₯ · ₹"]'));
ok (valid_json ('["ᚠᛇᚻ᛫ᛒᛦᚦ᛫ᚠᚱᚩᚠᚢᚱ᛫ᚠᛁᚱᚪ᛫ᚷᛖᚻᚹᛦᛚᚳᚢᛗ\nᛋᚳᛖᚪᛚ᛫ᚦᛖᚪᚻ᛫ᛗᚪᚾᚾᚪ᛫ᚷᛖᚻᚹᛦᛚᚳ᛫ᛗᛁᚳᛚᚢᚾ᛫ᚻᛦᛏ᛫ᛞᚫᛚᚪᚾ\nᚷᛁᚠ᛫ᚻᛖ᛫ᚹᛁᛚᛖ᛫ᚠᚩᚱ᛫ᛞᚱᛁᚻᛏᚾᛖ᛫ᛞᚩᛗᛖᛋ᛫ᚻᛚᛇᛏᚪᚾ᛬"]'));
ok (valid_json ('["Τη γλώσσα μου έδωσαν ελληνική\nτο σπίτι φτωχικό στις αμμουδιές του Ομήρου.\nΜονάχη έγνοια η γλώσσα μου στις αμμουδιές του Ομήρου.\nαπό το Άξιον Εστί\nτου Οδυσσέα Ελύτη"]'));
ok (valid_json ('["Τὴ γλῶσσα μοῦ ἔδωσαν ἑλληνικὴ\nτὸ σπίτι φτωχικὸ στὶς ἀμμουδιὲς τοῦ Ὁμήρου.\nΜονάχη ἔγνοια ἡ γλῶσσα μου στὶς ἀμμουδιὲς τοῦ Ὁμήρου.\nἀπὸ τὸ Ἄξιον ἐστί\nτοῦ Ὀδυσσέα Ἐλύτη"]'));
ok (valid_json ('["ვეპხის ტყაოსანი შოთა რუსთაველი\nღმერთსი შემვედრე, ნუთუ კვლა დამხსნას სოფლისა შრომასა, ცეცხლს, წყალსა და მიწასა, ჰაერთა თანა მრომასა; მომცნეს ფრთენი და აღვფრინდე, მივჰხვდე მას ჩემსა ნდომასა, დღისით და ღამით ვჰხედვიდე მზისა ელვათა კრთომაასა."]'));
my $glassjson = <<'EOF';
{"Sanskrit":"﻿काचं शक्नोम्यत्तुम् । नोपहिनस्ति माम् ॥",
"Sanskrit (standard transcription)":"kācaṃ śaknomyattum; nopahinasti mām.",
"Classical Greek":"ὕαλον ϕαγεῖν δύναμαι· τοῦτο οὔ με βλάπτει.",
"Greek (monotonic)":"Μπορώ να φάω σπασμένα γυαλιά χωρίς να πάθω τίποτα.",
"Greek (polytonic)":"Μπορῶ νὰ φάω σπασμένα γυαλιὰ χωρὶς νὰ πάθω τίποτα. ",
"Etruscan":"(NEEDED)",
"Latin":"Vitrum edere possum; mihi non nocet.",
"Old French":"Je puis mangier del voirre. Ne me nuit.",
"French":"Je peux manger du verre, ça ne me fait pas mal.",
"Provençal / Occitan":"Pòdi manjar de veire, me nafrariá pas.",
"Québécois":"J'peux manger d'la vitre, ça m'fa pas mal.",
"Walloon":"Dji pou magnî do vêre, çoula m' freut nén må. ",
"Champenois":"(NEEDED) ",
"Lorrain":"(NEEDED)",
"Picard":"Ch'peux mingi du verre, cha m'foé mie n'ma. ",
"Corsican/Corsu":"(NEEDED) ",
"Jèrriais":"(NEEDED)",
"Kreyòl Ayisyen (Haitï)":"Mwen kap manje vè, li pa blese'm.",
"Basque":"Kristala jan dezaket, ez dit minik ematen.",
"Catalan / Català":"Puc menjar vidre, que no em fa mal.",
"Spanish":"Puedo comer vidrio, no me hace daño.",
"Aragonés":"Puedo minchar beire, no me'n fa mal . ",
"Aranés":"(NEEDED) ",
"Mallorquín":"(NEEDED)",
"Galician":"Eu podo xantar cristais e non cortarme.",
"European Portuguese":"Posso comer vidro, não me faz mal.",
"Brazilian Portuguese (8)":"Posso comer vidro, não me machuca.",
"Caboverdiano/Kabuverdianu (Cape Verde)":"M' podê cumê vidru, ca ta maguâ-m'.",
"Papiamentu":"Ami por kome glas anto e no ta hasimi daño.",
"Italian":"Posso mangiare il vetro e non mi fa male.",
"Milanese":"Sôn bôn de magnà el véder, el me fa minga mal.",
"Roman":"Me posso magna' er vetro, e nun me fa male.",
"Napoletano":"M' pozz magna' o'vetr, e nun m' fa mal.",
"Venetian":"Mi posso magnare el vetro, no'l me fa mae.",
"Zeneise (Genovese)":"Pòsso mangiâ o veddro e o no me fà mâ.",
"Sicilian":"Puotsu mangiari u vitru, nun mi fa mali. ",
"Campinadese (Sardinia)":"(NEEDED) ",
"Lugudorese (Sardinia)":"(NEEDED)",
"Romansch (Grischun)":"Jau sai mangiar vaider, senza che quai fa donn a mai. ",
"Romany / Tsigane":"(NEEDED)",
"Romanian":"Pot să mănânc sticlă și ea nu mă rănește.",
"Esperanto":"Mi povas manĝi vitron, ĝi ne damaĝas min. ",
"Pictish":"(NEEDED) ",
"Breton":"(NEEDED)",
"Cornish":"Mý a yl dybry gwéder hag éf ny wra ow ankenya.",
"Welsh":"Dw i'n gallu bwyta gwydr, 'dyw e ddim yn gwneud dolur i mi.",
"Manx Gaelic":"Foddym gee glonney agh cha jean eh gortaghey mee.",
"Old Irish (Ogham)":"᚛᚛ᚉᚑᚅᚔᚉᚉᚔᚋ ᚔᚈᚔ ᚍᚂᚐᚅᚑ ᚅᚔᚋᚌᚓᚅᚐ᚜",
"Old Irish (Latin)":"Con·iccim ithi nglano. Ním·géna.",
"Irish":"Is féidir liom gloinne a ithe. Ní dhéanann sí dochar ar bith dom.",
"Ulster Gaelic":"Ithim-sa gloine agus ní miste damh é.",
"Scottish Gaelic":"S urrainn dhomh gloinne ithe; cha ghoirtich i mi.",
"Anglo-Saxon (Runes)":"ᛁᚳ᛫ᛗᚨᚷ᛫ᚷᛚᚨᛋ᛫ᛖᚩᛏᚪᚾ᛫ᚩᚾᛞ᛫ᚻᛁᛏ᛫ᚾᛖ᛫ᚻᛖᚪᚱᛗᛁᚪᚧ᛫ᛗᛖ᛬",
"Anglo-Saxon (Latin)":"Ic mæg glæs eotan ond hit ne hearmiað me.",
"Middle English":"Ich canne glas eten and hit hirtiþ me nouȝt.",
"English":"I can eat glass and it doesn't hurt me.",
"English (IPA)":"[aɪ kæn iːt glɑːs ænd ɪt dɐz nɒt hɜːt miː] (Received Pronunciation)",
"English (Braille)":"⠊⠀⠉⠁⠝⠀⠑⠁⠞⠀⠛⠇⠁⠎⠎⠀⠁⠝⠙⠀⠊⠞⠀⠙⠕⠑⠎⠝⠞⠀⠓⠥⠗⠞⠀⠍⠑",
"Jamaican":"Mi kian niam glas han i neba hot mi.",
"Lalland Scots / Doric":"Ah can eat gless, it disnae hurt us. ",
"Glaswegian":"(NEEDED)",
"Gothic (4)":"𐌼𐌰𐌲 𐌲𐌻𐌴𐍃 𐌹̈𐍄𐌰𐌽, 𐌽𐌹 𐌼𐌹𐍃 𐍅𐌿 𐌽𐌳𐌰𐌽 𐌱𐍂𐌹𐌲𐌲𐌹𐌸.",
"Old Norse (Runes)":"ᛖᚴ ᚷᛖᛏ ᛖᛏᛁ ᚧ ᚷᛚᛖᚱ ᛘᚾ ᚦᛖᛋᛋ ᚨᚧ ᚡᛖ ᚱᚧᚨ ᛋᚨᚱ",
"Old Norse (Latin)":"Ek get etið gler án þess að verða sár.",
"Norsk / Norwegian (Nynorsk)":"Eg kan eta glas utan å skada meg.",
"Norsk / Norwegian (Bokmål)":"Jeg kan spise glass uten å skade meg.",
"Føroyskt / Faroese":"Eg kann eta glas, skaðaleysur.",
"Íslenska / Icelandic":"Ég get etið gler án þess að meiða mig.",
"Svenska / Swedish":"Jag kan äta glas utan att skada mig.",
"Dansk / Danish":"Jeg kan spise glas, det gør ikke ondt på mig.",
"Sønderjysk":"Æ ka æe glass uhen at det go mæ naue.",
"Frysk / Frisian":"Ik kin glês ite, it docht me net sear.",
"Nederlands / Dutch":"Ik kan glas eten, het doet mĳ geen kwaad.",
"Kirchröadsj/Bôchesserplat":"Iech ken glaas èèse, mer 't deet miech jing pieng.",
"Afrikaans":"Ek kan glas eet, maar dit doen my nie skade nie.",
"Lëtzebuergescht / Luxemburgish":"Ech kan Glas iessen, daat deet mir nët wei.",
"Deutsch / German":"Ich kann Glas essen, ohne mir zu schaden.",
"Ruhrdeutsch":"Ich kann Glas verkasematuckeln, ohne dattet mich wat jucken tut.",
"Langenfelder Platt":"Isch kann Jlaas kimmeln, uuhne datt mich datt weh dääd.",
"Lausitzer Mundart (\"Lusatian\")":"Ich koann Gloos assn und doas dudd merr ni wii.",
"Odenwälderisch":"Iech konn glaasch voschbachteln ohne dass es mir ebbs daun doun dud.",
"Sächsisch / Saxon":"'sch kann Glos essn, ohne dass'sch mer wehtue.",
"Pfälzisch":"Isch konn Glass fresse ohne dasses mer ebbes ausmache dud.",
"Schwäbisch / Swabian":"I kå Glas frässa, ond des macht mr nix!",
"Deutsch (Voralberg)":"I ka glas eassa, ohne dass mar weh tuat.",
"Bayrisch / Bavarian":"I koh Glos esa, und es duard ma ned wei.",
"Allemannisch":"I kaun Gloos essen, es tuat ma ned weh.",
"Schwyzerdütsch (Zürich)":"Ich chan Glaas ässe, das schadt mir nöd.",
"Schwyzerdütsch (Luzern)":"Ech cha Glâs ässe, das schadt mer ned. ",
"Plautdietsch":"(NEEDED)",
"Hungarian":"Meg tudom enni az üveget, nem lesz tőle bajom.",
"Suomi / Finnish":"Voin syödä lasia, se ei vahingoita minua.",
"Sami (Northern)":"Sáhtán borrat lása, dat ii leat bávččas.",
"Erzian":"Мон ярсан суликадо, ды зыян эйстэнзэ а ули.",
"Northern Karelian":"Mie voin syvvä lasie ta minla ei ole kipie.",
"Southern Karelian":"Minä voin syvvä st'oklua dai minule ei ole kibie. ",
"Vepsian":"(NEEDED) ",
"Votian":"(NEEDED) ",
"Livonian":"(NEEDED)",
"Estonian":"Ma võin klaasi süüa, see ei tee mulle midagi.",
"Latvian":"Es varu ēst stiklu, tas man nekaitē.",
"Lithuanian":"Aš galiu valgyti stiklą ir jis manęs nežeidžia ",
"Old Prussian":"(NEEDED) ",
"Sorbian (Wendish)":"(NEEDED)",
"Czech":"Mohu jíst sklo, neublíží mi.",
"Slovak":"Môžem jesť sklo. Nezraní ma.",
"Polska / Polish":"Mogę jeść szkło i mi nie szkodzi.",
"Slovenian":"Lahko jem steklo, ne da bi mi škodovalo.",
"Croatian":"Ja mogu jesti staklo i ne boli me.",
"Serbian (Latin)":"Ja mogu da jedem staklo.",
"Serbian (Cyrillic)":"Ја могу да једем стакло.",
"Macedonian":"Можам да јадам стакло, а не ме штета.",
"Russian":"Я могу есть стекло, оно мне не вредит.",
"Belarusian (Cyrillic)":"Я магу есці шкло, яно мне не шкодзіць.",
"Belarusian (Lacinka)":"Ja mahu jeści škło, jano mne ne škodzić.",
"Ukrainian":"Я можу їсти скло, і воно мені не зашкодить.",
"Bulgarian":"Мога да ям стъкло, то не ми вреди.",
"Georgian":"მინას ვჭამ და არა მტკივა.",
"Armenian":"Կրնամ ապակի ուտել և ինծի անհանգիստ չըներ։",
"Albanian":"Unë mund të ha qelq dhe nuk më gjen gjë.",
"Turkish":"Cam yiyebilirim, bana zararı dokunmaz.",
"Turkish (Ottoman)":"جام ييه بلورم بڭا ضررى طوقونمز",
"Bangla / Bengali":"আমি কাঁচ খেতে পারি, তাতে আমার কোনো ক্ষতি হয় না।",
"Marathi":"मी काच खाऊ शकतो, मला ते दुखत नाही.",
"Kannada":"ನನಗೆ ಹಾನಿ ಆಗದೆ, ನಾನು ಗಜನ್ನು ತಿನಬಹುದು",
"Hindi":"मैं काँच खा सकता हूँ और मुझे उससे कोई चोट नहीं पहुंचती.",
"Tamil":"நான் கண்ணாடி சாப்பிடுவேன், அதனால் எனக்கு ஒரு கேடும் வராது.",
"Telugu":"నేను గాజు తినగలను మరియు అలా చేసినా నాకు ఏమి ఇబ్బంది లేదు",
"Sinhalese":"මට වීදුරු කෑමට හැකියි. එයින් මට කිසි හානියක් සිදු නොවේ.",
"Urdu(3)":"میں کانچ کھا سکتا ہوں اور مجھے تکلیف نہیں ہوتی ۔",
"Pashto(3)":"زه شيشه خوړلې شم، هغه ما نه خوږوي",
"Farsi / Persian(3)":".من می توانم بدونِ احساس درد شيشه بخورم",
"Arabic(3)":"أنا قادر على أكل الزجاج و هذا لا يؤلمني. ",
"Aramaic":"(NEEDED)",
"Maltese":"Nista' niekol il-ħġieġ u ma jagħmilli xejn.",
"Hebrew(3)":"אני יכול לאכול זכוכית וזה לא מזיק לי.",
"Yiddish(3)":"איך קען עסן גלאָז און עס טוט מיר נישט װײ. ",
"Judeo-Arabic":"(NEEDED) ",
"Ladino":"(NEEDED) ",
"Gǝʼǝz":"(NEEDED) ",
"Amharic":"(NEEDED)",
"Twi":"Metumi awe tumpan, ɜnyɜ me hwee.",
"Hausa (Latin)":"Inā iya taunar gilāshi kuma in gamā lāfiyā.",
"Hausa (Ajami) (2)":"إِنا إِىَ تَونَر غِلَاشِ كُمَ إِن غَمَا لَافِىَا",
"Yoruba(4)":"Mo lè je̩ dígí, kò ní pa mí lára.",
"Lingala":"Nakokí kolíya biténi bya milungi, ekosála ngáí mabé tɛ́.",
"(Ki)Swahili":"Naweza kula bilauri na sikunyui.",
"Malay":"Saya boleh makan kaca dan ia tidak mencederakan saya.",
"Tagalog":"Kaya kong kumain nang bubog at hindi ako masaktan.",
"Chamorro":"Siña yo' chumocho krestat, ti ha na'lalamen yo'.",
"Fijian":"Au rawa ni kana iloilo, ia au sega ni vakacacani kina.",
"Javanese":"Aku isa mangan beling tanpa lara.",
"Burmese":"က္ယ္ဝန္‌တော္‌၊က္ယ္ဝန္‌မ မ္ယက္‌စားနုိင္‌သည္‌။ ၎က္ရောင္‌့ ထိခုိက္‌မ္ဟု မရ္ဟိပာ။ (9)",
"Vietnamese (quốc ngữ)":"Tôi có thể ăn thủy tinh mà không hại gì.",
"Vietnamese (nôm) (4)":"些 𣎏 世 咹 水 晶 𦓡 空 𣎏 害 咦",
"Khmer":"ខ្ញុំអាចញុំកញ្ចក់បាន ដោយគ្មានបញ្ហារ",
"Lao":"ຂອ້ຍກິນແກ້ວໄດ້ໂດຍທີ່ມັນບໍ່ໄດ້ເຮັດໃຫ້ຂອ້ຍເຈັບ.",
"Thai":"ฉันกินกระจกได้ แต่มันไม่ทำให้ฉันเจ็บ",
"Mongolian (Cyrillic)":"Би шил идэй чадна, надад хортой биш",
"Mongolian (Classic) (5)":"ᠪᠢ ᠰᠢᠯᠢ ᠢᠳᠡᠶᠦ ᠴᠢᠳᠠᠨᠠ ᠂ ᠨᠠᠳᠤᠷ ᠬᠣᠤᠷᠠᠳᠠᠢ ᠪᠢᠰᠢ ",
"Dzongkha":"(NEEDED)",
"Nepali":"﻿म काँच खान सक्छू र मलाई केहि नी हुन्‍न् ।",
"Tibetan":"ཤེལ་སྒོ་ཟ་ནས་ང་ན་གི་མ་རེད།",
"Chinese":"我能吞下玻璃而不伤身体。",
"Chinese (Traditional)":"我能吞下玻璃而不傷身體。",
"Taiwanese(6)":"Góa ē-tàng chia̍h po-lê, mā bē tio̍h-siong.",
"Japanese":"私はガラスを食べられます。それは私を傷つけません。",
"Korean":"나는 유리를 먹을 수 있어요. 그래도 아프지 않아요",
"Bislama":"Mi save kakae glas, hemi no save katem mi.",
"Hawaiian":"Hiki iaʻu ke ʻai i ke aniani; ʻaʻole nō lā au e ʻeha.",
"Marquesan":"E koʻana e kai i te karahi, mea ʻā, ʻaʻe hauhau.",
"Inuktitut (10)":"ᐊᓕᒍᖅ ᓂᕆᔭᕌᖓᒃᑯ ᓱᕋᙱᑦᑐᓐᓇᖅᑐᖓ",
"Chinook Jargon":"Naika məkmək kakshət labutay, pi weyk ukuk munk-sik nay.",
"Navajo":"Tsésǫʼ yishą́ągo bííníshghah dóó doo shił neezgai da. ",
"Cherokee (and Cree, Chickasaw, Cree, Micmac, Ojibwa, Lakota, Náhuatl, Quechua, Aymara, and other American languages)":"(NEEDED) ",
"Garifuna":"(NEEDED) ",
"Gullah":"(NEEDED)",
"Lojban":"mi kakne le nu citka le blaci .iku'i le se go'i na xrani mi",
"Nórdicg":"Ljœr ye caudran créneþ ý jor cẃran."
}
EOF
assert_valid_json ($glassjson);
ok (valid_json ($glassjson));
no utf8;
# Markus Kuhn validation file
for my $c (0xc0..0xf4) {
    my $badinitial = sprintf ("%c ", $c);
    ok (! valid_json ($badinitial), "first byte $c, second byte space invalid");
}
my @overlong = split /\n/, (qq/
# 4.1  Examples of an overlong ASCII character
c0 af
e0 80 af
f0 80 80 af
# 4.2  Maximum overlong sequences
c1 bf      
e0 9f bf   
f0 8f bf bf
# 4.3  Overlong representation of the NUL character
c0 80      
e0 80 80   
f0 80 80 80
# 5.1 Single UTF-16 surrogates
ed a0 80 
ed ad bf 
ed ae 80 
ed af bf 
ed b0 80 
ed be 80 
ed bf bf 
# 5.2 Paired UTF-16 surrogates
ed a0 80 ed b0 80
ed a0 80 ed bf bf
ed ad bf ed b0 80
ed ad bf ed bf bf
ed ae 80 ed b0 80
ed ae 80 ed bf bf
ed af bf ed b0 80
ed af bf ed bf bf
/);

for my $overlong (@overlong) {
    if ($overlong =~ /^#/) {
	next;
    }
    my @bytes = split / /, $overlong;
    my $bad = join ('', map {sprintf "%c", hex ($_)} @bytes);
    ok (! valid_json ($bad), "$overlong invalid");
}
done_testing ();
exit;
