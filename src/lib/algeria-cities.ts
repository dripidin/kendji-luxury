export interface Wilaya {
  code: string;
  name: string;
  nameAr?: string;
  deliveryFeeDomicile: number;
  deliveryFeeStopDesk: number;
  communes: string[];
}

export const ALGERIA_WILAYAS: Wilaya[] = [
  {
    code: "01",
    name: "Adrar",
    nameAr: "أدرار",
    deliveryFeeDomicile: 1200,
    deliveryFeeStopDesk: 800,
    communes: ["Adrar", "Tamest", "Charouine", "Reggane", "In Zghmir", "Tit", "Timimoun", "Aoulef", "Zaouiet Kounta", "Fenoughil"]
  },
  {
    code: "02",
    name: "Chlef",
    nameAr: "الشلف",
    deliveryFeeDomicile: 700,
    deliveryFeeStopDesk: 450,
    communes: ["Chlef", "Ténès", "El Karimia", "Taougrite", "Béni Haoua", "Sobha", "Ouled Fares", "Boukadir", "Chettia", "Ain Merane"]
  },
  {
    code: "03",
    name: "Laghouat",
    nameAr: "الأغواط",
    deliveryFeeDomicile: 900,
    deliveryFeeStopDesk: 600,
    communes: ["Laghouat", "Ksar El Hirane", "Bennasser Benchohra", "Sidi Makhlouf", "Aflou", "Ain Madhi", "Gueltat Sidi Saad", "El Ghicha", "Brida", "Tadjmout"]
  },
  {
    code: "04",
    name: "Oum El Bouaghi",
    nameAr: "أم البواقي",
    deliveryFeeDomicile: 800,
    deliveryFeeStopDesk: 500,
    communes: ["Oum El Bouaghi", "Ain Beida", "Ain M'lila", "Ain Fakroun", "Sigus", "Meskiana", "Fkirina", "Souk Naamane", "Ain Zitoun", "Ksar Sbahi"]
  },
  {
    code: "05",
    name: "Batna",
    nameAr: "باتنة",
    deliveryFeeDomicile: 800,
    deliveryFeeStopDesk: 500,
    communes: ["Batna", "Barika", "Merouana", "Ain Touta", "Arris", "Tazoult", "N'Gaous", "Ras El Aioun", "Chemora", "Menaa"]
  },
  {
    code: "06",
    name: "Béjaïa",
    nameAr: "بجاية",
    deliveryFeeDomicile: 750,
    deliveryFeeStopDesk: 450,
    communes: ["Béjaïa", "Amizour", "Akbou", "Seddouk", "Tichy", "Aokas", "Souk El Ténine", "Kherrata", "El Kseur", "Sidi Aich", "Barbacha", "Ighzer Amokrane"]
  },
  {
    code: "07",
    name: "Biskra",
    nameAr: "بسكرة",
    deliveryFeeDomicile: 900,
    deliveryFeeStopDesk: 600,
    communes: ["Biskra", "Tolga", "Sidi Okba", "Chetma", "El Kantara", "M'Chouneche", "Zeribet El Oued", "Foughala", "Lichana", "Sidi Khaled"]
  },
  {
    code: "08",
    name: "Béchar",
    nameAr: "بشار",
    deliveryFeeDomicile: 1200,
    deliveryFeeStopDesk: 800,
    communes: ["Béchar", "Kenadsa", "Abadla", "Taghit", "Béni Ounif", "Tabelbala", "Igli", "Lahmar", "Erg Ferradj", "Moungar"]
  },
  {
    code: "09",
    name: "Blida",
    nameAr: "البليدة",
    deliveryFeeDomicile: 600,
    deliveryFeeStopDesk: 350,
    communes: ["Blida", "Boufarik", "Ouled Yaich", "El Affroun", "Larbaa", "Bouinan", "Mouzaia", "Meftah", "Chréa", "Oued Alleug", "Beni Mered", "Soumaa"]
  },
  {
    code: "10",
    name: "Bouira",
    nameAr: "البويرة",
    deliveryFeeDomicile: 700,
    deliveryFeeStopDesk: 400,
    communes: ["Bouira", "Lakhdaria", "Sour El Ghozlane", "Ain Bessam", "M'Chedallah", "Kadiria", "Bechloul", "Taghzout", "Haizer", "Bir Ghbalou"]
  },
  {
    code: "11",
    name: "Tamanrasset",
    nameAr: "تمنراست",
    deliveryFeeDomicile: 1400,
    deliveryFeeStopDesk: 950,
    communes: ["Tamanrasset", "Abalessa", "In Ghar", "Idles", "Tazrouk", "Tit"]
  },
  {
    code: "12",
    name: "Tébessa",
    nameAr: "تبسة",
    deliveryFeeDomicile: 850,
    deliveryFeeStopDesk: 550,
    communes: ["Tébessa", "Bir El Ater", "Cheria", "Ouenza", "El Aouinet", "Morsott", "Negrine", "El Kouif", "Hammamet", "Bekkaria"]
  },
  {
    code: "13",
    name: "Tlemcen",
    nameAr: "تلمسان",
    deliveryFeeDomicile: 800,
    deliveryFeeStopDesk: 500,
    communes: ["Tlemcen", "Mansourah", "Chetouane", "Maghnia", "Remchi", "Ghazaouet", "Nedroma", "Sebdou", "Hennaya", "Ouled Mimoun", "Marsa Ben M'Hidi"]
  },
  {
    code: "14",
    name: "Tiaret",
    nameAr: "تيارت",
    deliveryFeeDomicile: 800,
    deliveryFeeStopDesk: 500,
    communes: ["Tiaret", "Sougueur", "Frenda", "Ksar Chellala", "Mahdia", "Rahouia", "Mechraa Sfa", "Oued Lilli", "Dahmouni", "Ain Deheb"]
  },
  {
    code: "15",
    name: "Tizi Ouzou",
    nameAr: "تيزي وزو",
    deliveryFeeDomicile: 700,
    deliveryFeeStopDesk: 400,
    communes: ["Tizi Ouzou", "Azazga", "Draa Ben Khedda", "Tigzirt", "Larbaa Nath Irathen", "Ain El Hammam", "Boghni", "Draa El Mizan", "Ouadhia", "Makouda", "Azeffoun", "Bouzeguene"]
  },
  {
    code: "16",
    name: "Alger",
    nameAr: "الجزائر",
    deliveryFeeDomicile: 500,
    deliveryFeeStopDesk: 300,
    communes: [
      "Alger Centre", "Sidi M'Hamed", "El Madania", "Belouizdad", "Bab El Oued", "Bologhine", "Casbah", "Oued Koriche",
      "Bir Mourad Rais", "El Biar", "Bouzareah", "Hydra", "Ben Aknoun", "El Mouradia", "Kouba", "Hussein Dey",
      "Bachedjerrah", "Bourouba", "Dar El Beida", "Bab Ezzouar", "Ben Zerga", "Bordj El Kiffan", "El Harrach",
      "Mohammadia", "Rouiba", "Reghaia", "Ain Taya", "Bordj El Bahri", "Marsa", "Haraoua", "Zeralda", "Staoueli",
      "Ain Benian", "Cheraga", "Beni Messous", "Dely Ibrahim", "Ouled Fayet", "Draria", "Saoula", "Douera",
      "Baba Hassen", "Khraicia", "Birtouta", "Ouled Chebel", "Tessala El Merdja", "Baraki", "Les Eucalyptus", "Sidi Moussa"
    ]
  },
  {
    code: "17",
    name: "Djelfa",
    nameAr: "الجلفة",
    deliveryFeeDomicile: 900,
    deliveryFeeStopDesk: 600,
    communes: ["Djelfa", "Messaad", "Ain Oussara", "Hassi Bahbah", "Dar Chioukh", "Charef", "El Idrissia", "Birine", "Sidi Ladjel", "Faid El Botma"]
  },
  {
    code: "18",
    name: "Jijel",
    nameAr: "جيجل",
    deliveryFeeDomicile: 800,
    deliveryFeeStopDesk: 500,
    communes: ["Jijel", "Taher", "El Milia", "Ziama Mansouriah", "Texenna", "Chekfa", "El Ancer", "Sidi Abdelaziz", "Kaous", "Settara"]
  },
  {
    code: "19",
    name: "Sétif",
    nameAr: "سطيف",
    deliveryFeeDomicile: 750,
    deliveryFeeStopDesk: 450,
    communes: ["Sétif", "El Eulma", "Ain Oulmene", "Ain Arnat", "Bougaa", "Ain Azel", "Beni Aziz", "Babor", "Salah Bey", "Guellal", "Amoucha", "Hammam Guergour"]
  },
  {
    code: "20",
    name: "Saïda",
    nameAr: "سعيدة",
    deliveryFeeDomicile: 850,
    deliveryFeeStopDesk: 550,
    communes: ["Saïda", "Ain El Hadjar", "Youb", "Sidi Boubekeur", "El Hassasna", "Ouled Brahim", "Moulay Larbi"]
  },
  {
    code: "21",
    name: "Skikda",
    nameAr: "سكيكدة",
    deliveryFeeDomicile: 800,
    deliveryFeeStopDesk: 500,
    communes: ["Skikda", "El Harrouch", "Collo", "Azzaba", "Tamalous", "Ben Azzouz", "Ramdane Djamel", "Ain Charchar", "Sidi Mezghiche", "Filfila"]
  },
  {
    code: "22",
    name: "Sidi Bel Abbès",
    nameAr: "سيدي بلعباس",
    deliveryFeeDomicile: 800,
    deliveryFeeStopDesk: 500,
    communes: ["Sidi Bel Abbès", "Telagh", "Sfisef", "Ben Badis", "Ras El الماء", "Sidi Ali Benyoub", "Ain El Berd", "Tessala", "Mostefa Ben Brahim"]
  },
  {
    code: "23",
    name: "Annaba",
    nameAr: "عنابة",
    deliveryFeeDomicile: 800,
    deliveryFeeStopDesk: 500,
    communes: ["Annaba", "El Bouni", "El Hadjar", "Sidi Amar", "Berrahal", "Ain El Berda", "Chetaibi", "Seraidi", "Oued El Aneb", "Tréat"]
  },
  {
    code: "24",
    name: "Guelma",
    nameAr: "قالمة",
    deliveryFeeDomicile: 800,
    deliveryFeeStopDesk: 500,
    communes: ["Guelma", "Oued Zenati", "Bouchegouf", "Héliopolis", "Hammam Debagh", "Guelaat Bou Sbaa", "Ain Makhlouf", "Ain Larbi", "Belkheir"]
  },
  {
    code: "25",
    name: "Constantine",
    nameAr: "قسنطينة",
    deliveryFeeDomicile: 750,
    deliveryFeeStopDesk: 450,
    communes: ["Constantine", "El Khroub", "Ain Smara", "Hamma Bouziane", "Didouche Mourad", "Zighoud Youcef", "Ali Mendjeli", "Ibn Ziad", "Ouled Rahmoune"]
  },
  {
    code: "26",
    name: "Médéa",
    nameAr: "المدية",
    deliveryFeeDomicile: 700,
    deliveryFeeStopDesk: 400,
    communes: ["Médéa", "Berrouaghia", "Ksar El Boukhari", "Beni Slimane", "Tablat", "El Omaria", "Ouzera", "Ain Boucif", "Chahbounia", "Souagui"]
  },
  {
    code: "27",
    name: "Mostaganem",
    nameAr: "مستغانم",
    deliveryFeeDomicile: 750,
    deliveryFeeStopDesk: 450,
    communes: ["Mostaganem", "Ain Tedeles", "Sidi Ali", "Bouguirat", "Hassi Mameche", "Mesra", "Achacha", "Khadra", "Achaacha", "Ain Nouissy"]
  },
  {
    code: "28",
    name: "M'Sila",
    nameAr: "المسيلة",
    deliveryFeeDomicile: 850,
    deliveryFeeStopDesk: 550,
    communes: ["M'Sila", "Bou Saada", "Magra", "Sidi Aissa", "Ain El Melh", "Hammam Dalaa", "Chellal", "Ouled Derradj", "Ben Srour", "Belaiba"]
  },
  {
    code: "29",
    name: "Mascara",
    nameAr: "معسكر",
    deliveryFeeDomicile: 800,
    deliveryFeeStopDesk: 500,
    communes: ["Mascara", "Sig", "Mohammadia", "Tighennif", "Ghriss", "Oued El Abtal", "Bouhanifia", "Zahana", "El Bordj", "Ain Fekan"]
  },
  {
    code: "30",
    name: "Ouargla",
    nameAr: "ورقلة",
    deliveryFeeDomicile: 1100,
    deliveryFeeStopDesk: 750,
    communes: ["Ouargla", "Hassi Messaoud", "Rouissat", "Ain Beida", "N'Goussa", "Sidi Khouiled", "Hassi Ben Abdellah", "El Borma"]
  },
  {
    code: "31",
    name: "Oran",
    nameAr: "وهران",
    deliveryFeeDomicile: 650,
    deliveryFeeStopDesk: 400,
    communes: ["Oran", "Bir El Djir", "Es Senia", "Ain El Turk", "Arzew", "Bethioua", "Gdyel", "Boutlelis", "Mers El Kébir", "El Ancar", "Hassi Bounif", "Hassi Ben Okba"]
  },
  {
    code: "32",
    name: "El Bayadh",
    nameAr: "البيض",
    deliveryFeeDomicile: 1000,
    deliveryFeeStopDesk: 700,
    communes: ["El Bayadh", "Bougtob", "El Abiodh Sidi Cheikh", "Rogassa", "Brezina", "Cheguig", "Labiodh", "El Mehara"]
  },
  {
    code: "33",
    name: "Illizi",
    nameAr: "إليزي",
    deliveryFeeDomicile: 1400,
    deliveryFeeStopDesk: 950,
    communes: ["Illizi", "Djanet", "In Amenas", "Bordj Omar Driss", "Debdeb", "Bordj El Haouas"]
  },
  {
    code: "34",
    name: "Bordj Bou Arréridj",
    nameAr: "برج بوعريريج",
    deliveryFeeDomicile: 750,
    deliveryFeeStopDesk: 450,
    communes: ["Bordj Bou Arréridj", "Ras El Oued", "Bordj Zemoura", "Mansoura", "Medjana", "El Achir", "Bir Kasdali", "Ain Taghrout", "Khelil", "Sidi Embarek"]
  },
  {
    code: "35",
    name: "Boumerdès",
    nameAr: "بومرداس",
    deliveryFeeDomicile: 600,
    deliveryFeeStopDesk: 350,
    communes: ["Boumerdès", "Zemmouri", "Dellys", "Boudouaou", "Khemis El Khechna", "Isser", "Thenia", "Naciria", "Baghlia", "Corso", "Tidjelabine", "Si Mustapha"]
  },
  {
    code: "36",
    name: "El Tarf",
    nameAr: "الطارف",
    deliveryFeeDomicile: 850,
    deliveryFeeStopDesk: 550,
    communes: ["El Tarf", "El Kala", "Ben M'Hidi", "Besbes", "Drean", "Bouhadjar", "Chebaita Mokhtar", "Ain El Assel", "Raml Souk", "Zerizer"]
  },
  {
    code: "37",
    name: "Tindouf",
    nameAr: "تندوف",
    deliveryFeeDomicile: 1400,
    deliveryFeeStopDesk: 950,
    communes: ["Tindouf", "Oum El Assel"]
  },
  {
    code: "38",
    name: "Tissemsilt",
    nameAr: "تيسمسيلت",
    deliveryFeeDomicile: 850,
    deliveryFeeStopDesk: 550,
    communes: ["Tissemsilt", "Theniet El Had", "Bordj Bounaama", "Lardjem", "Khemisti", "Ammari", "Layoune", "Youssoufia"]
  },
  {
    code: "39",
    name: "El Oued",
    nameAr: "الوادي",
    deliveryFeeDomicile: 1000,
    deliveryFeeStopDesk: 700,
    communes: ["El Oued", "Robbah", "Guemar", "Debila", "Bayadha", "Reguiba", "Hassi Khalifa", "Taghzout", "Magrane", "Taleb Larbi"]
  },
  {
    code: "40",
    name: "Khenchela",
    nameAr: "خنشلة",
    deliveryFeeDomicile: 850,
    deliveryFeeStopDesk: 550,
    communes: ["Khenchela", "Kais", "Chechar", "Bouhmama", "El Hamma", "Babar", "Ouled Rechache", "Ain Touila", "Remila"]
  },
  {
    code: "41",
    name: "Souk Ahras",
    nameAr: "سوق أهراس",
    deliveryFeeDomicile: 850,
    deliveryFeeStopDesk: 550,
    communes: ["Souk Ahras", "Sedrata", "M'Daourouch", "Taoura", "Merahna", "Heddada", "Ouled Driss", "Mechroha", "Bir Bouhouche"]
  },
  {
    code: "42",
    name: "Tipaza",
    nameAr: "تيبازة",
    deliveryFeeDomicile: 650,
    deliveryFeeStopDesk: 400,
    communes: ["Tipaza", "Kolea", "Cherchell", "Bou Ismail", "Hadjout", "Gouraya", "Fouka", "Douaouda", "Damous", "Sidi Amar", "Ahmar El Ain", "Attatba"]
  },
  {
    code: "43",
    name: "Mila",
    nameAr: "ميلة",
    deliveryFeeDomicile: 800,
    deliveryFeeStopDesk: 500,
    communes: ["Mila", "Chelghoum Laid", "Ferdjioua", "Tadjenanet", "Grarem Gouga", "Rouached", "Oued Endja", "Sidi Merouane", "Teleghma", "Ain Beida Harriche"]
  },
  {
    code: "44",
    name: "Aïn Defla",
    nameAr: "عين الدفلى",
    deliveryFeeDomicile: 700,
    deliveryFeeStopDesk: 400,
    communes: ["Aïn Defla", "Khemis Miliana", "Miliana", "El Attaf", "Djendel", "Djelida", "El Amra", "Hammam Righa", "Boumedfaa", "Bourached"]
  },
  {
    code: "45",
    name: "Naâma",
    nameAr: "النعامة",
    deliveryFeeDomicile: 1000,
    deliveryFeeStopDesk: 700,
    communes: ["Naâma", "Mecheria", "Ain Sefra", "Tiout", "Sfissifa", "Moghrar", "Asla", "Djenienne Bourezg"]
  },
  {
    code: "46",
    name: "Aïn Témouchent",
    nameAr: "عين تموشنت",
    deliveryFeeDomicile: 750,
    deliveryFeeStopDesk: 450,
    communes: ["Aïn Témouchent", "Beni Saf", "Hammam Bou Hadjar", "El Malah", "Ain El Arbaa", "El Amria", "Oulhaca El Gheraba", "Chaabat El Leham"]
  },
  {
    code: "47",
    name: "Ghardaïa",
    nameAr: "غرداية",
    deliveryFeeDomicile: 1000,
    deliveryFeeStopDesk: 700,
    communes: ["Ghardaïa", "El Guerara", "Berriane", "Metlili", "Bounoura", "Dhayet Bendhahoua", "Zelfana", "El Atteuf", "Sebseb", "Mansoura"]
  },
  {
    code: "48",
    name: "Relizane",
    nameAr: "غليزان",
    deliveryFeeDomicile: 750,
    deliveryFeeStopDesk: 450,
    communes: ["Relizane", "Oued Rhiou", "Mazouna", "Yellel", "Zemmoura", "Sidi M'Hamed Ben Ali", "Djidiouia", "Ammi Moussa", "Matmar", "El H'Madna"]
  },
  {
    code: "49",
    name: "El M'Ghair",
    nameAr: "المغير",
    deliveryFeeDomicile: 1000,
    deliveryFeeStopDesk: 700,
    communes: ["El M'Ghair", "Djamaa", "Oum Touyour", "Sidi Amrane", "Still", "M'Rara", "Tendla"]
  },
  {
    code: "50",
    name: "El Menia",
    nameAr: "المنيعة",
    deliveryFeeDomicile: 1100,
    deliveryFeeStopDesk: 750,
    communes: ["El Menia", "Hassi Gara", "Hassi Fehal"]
  },
  {
    code: "51",
    name: "Ouled Djellal",
    nameAr: "أولاد جلال",
    deliveryFeeDomicile: 950,
    deliveryFeeStopDesk: 650,
    communes: ["Ouled Djellal", "Sidi Khaled", "Ras El Miaad", "Besbes", "Doucen", "Chaiba"]
  },
  {
    code: "52",
    name: "Bordj Baji Mokhtar",
    nameAr: "برج باجي مختار",
    deliveryFeeDomicile: 1500,
    deliveryFeeStopDesk: 1000,
    communes: ["Bordj Baji Mokhtar", "Timiaouine"]
  },
  {
    code: "53",
    name: "Béni Abbès",
    nameAr: "بني عباس",
    deliveryFeeDomicile: 1200,
    deliveryFeeStopDesk: 800,
    communes: ["Béni Abbès", "Kerzaz", "Timoudi", "Tabelbala", "Ouled Khoudir", "Ksabi", "Tamtert", "El Ouata", "Beni Ikhlef"]
  },
  {
    code: "54",
    name: "Timimoun",
    nameAr: "تيميمون",
    deliveryFeeDomicile: 1200,
    deliveryFeeStopDesk: 800,
    communes: ["Timimoun", "Charouine", "Aougrout", "Ksar Kaddour", "Deldoul", "Ouled Said", "Talmine", "Tinerkouk"]
  },
  {
    code: "55",
    name: "Touggourt",
    nameAr: "تقرت",
    deliveryFeeDomicile: 1000,
    deliveryFeeStopDesk: 700,
    communes: ["Touggourt", "Temacine", "Megarine", "Taibet", "Nezla", "Tebesbest", "Blidet Amor", "Sidi Slimane", "Zaouia El Abidia"]
  },
  {
    code: "56",
    name: "Djanet",
    nameAr: "جانت",
    deliveryFeeDomicile: 1500,
    deliveryFeeStopDesk: 1000,
    communes: ["Djanet", "Bordj El Haouas"]
  },
  {
    code: "57",
    name: "In Salah",
    nameAr: "عين صالح",
    deliveryFeeDomicile: 1300,
    deliveryFeeStopDesk: 900,
    communes: ["In Salah", "In Ghar", "Foggaret Ezzaouia"]
  },
  {
    code: "58",
    name: "In Guezzam",
    nameAr: "عين قزام",
    deliveryFeeDomicile: 1500,
    deliveryFeeStopDesk: 1000,
    communes: ["In Guezzam", "Tin Zaouatine"]
  }
];

export function getWilayas(): Wilaya[] {
  return ALGERIA_WILAYAS;
}

export function getWilayaByCode(code: string): Wilaya | undefined {
  const normalized = code.trim().padStart(2, '0');
  return ALGERIA_WILAYAS.find(w => w.code === normalized || w.name.toLowerCase() === code.trim().toLowerCase());
}

export function getCommunesByWilayaCode(code: string): string[] {
  const wilaya = getWilayaByCode(code);
  return wilaya ? wilaya.communes : [];
}

export function validateWilayaAndCommune(wilayaCode: string, commune: string): boolean {
  const wilaya = getWilayaByCode(wilayaCode);
  if (!wilaya) return false;
  return wilaya.communes.some(c => c.toLowerCase() === commune.trim().toLowerCase());
}

export function getDeliveryFee(wilayaCode: string, method: "DOMICILE" | "STOP_DESK" = "DOMICILE"): number {
  const wilaya = getWilayaByCode(wilayaCode);
  if (!wilaya) return 600; // default fallback fee
  return method === "STOP_DESK" ? wilaya.deliveryFeeStopDesk : wilaya.deliveryFeeDomicile;
}
