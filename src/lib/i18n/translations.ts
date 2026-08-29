export type Locale = 'fr' | 'ar' | 'en'

export interface Dictionary {
  common: {
    brandName: string
    currency: string
    currencySymbol: string
    codBadge: string
    deliveryGuarantee: string
    shopNow: string
    viewAll: string
    details: string
    addToCart: string
    orderNow: string
    buyNow: string
    contactUs: string
    back: string
    save: string
    cancel: string
    loading: string
    success: string
    error: string
  }
  nav: {
    home: string
    shop: string
    categories: string
    collections: string
    about: string
    contact: string
    cart: string
    search: string
  }
  hero: {
    badge: string
    headline: string
    subheadline: string
    ctaPrimary: string
    ctaSecondary: string
    signatureSelection: string
  }
  home: {
    featuredBadge: string
    featuredTitle: string
    featuredSubtitle: string
    worldsBadge: string
    worldsTitle: string
    worldsSubtitle: string
    storyBadge: string
    storyTitle: string
    storyP1: string
    storyP2: string
    storyCta: string
    ctaTitle: string
    ctaSubtitle: string
    ctaButton: string
  }
  collectionIntro: {
    badge: string
    title: string
    subtitle: string
    exploreUniverse: string
  }
  editorial: {
    badge: string
    quote: string
    f1: string
    f2: string
    f3: string
  }
  categoryEmphasis: {
    setsBadge: string
    setsTitle: string
    setsDesc: string
    necklacesBadge: string
    necklacesTitle: string
    necklacesDesc: string
    braceletsBadge: string
    braceletsTitle: string
    braceletsDesc: string
    watchesBadge: string
    watchesTitle: string
    watchesDesc: string
    ringsBadge: string
    ringsTitle: string
    ringsDesc: string
  }
  productStory: {
    badge: string
    title: string
    quote: string
    signatureLabel: string
    finishLabel: string
    notice: string
  }
  productDetails: {
    badge: string
    title: string
    ref: string
    category: string
    collection: string
    pieces: string
    finish: string
    stones: string
    paymentMethod: string
    paymentMethodVal: string
    territory: string
    territoryVal: string
    care: string
    careVal: string
  }
  relatedProducts: {
    badge: string
    title: string
    exploreCollection: string
  }
  productFinalCta: {
    badge: string
    titleLine1: string
    titleLine2: string
    desc: string
    orderNow: string
    viewCollection: string
  }
  categories: {
    sets: string
    necklaces: string
    bracelets: string
    rings: string
    watches: string
    all: string
  }
  catalog: {
    allCategories: string
    allCollections: string
    filterCategory: string
    filterCollection: string
    sortBy: string
    sortDefault: string
    sortPriceAsc: string
    sortPriceDesc: string
    resultsCount: string
    noProducts: string
    viewDetails: string
  }
  product: {
    inStock: string
    outOfStock: string
    material: string
    finish: string
    stones: string
    dimensions: string
    piecesIncluded: string
    care: string
    deliveryNotice: string
    selectVariant: string
    quantity: string
    addToBag: string
    expressCod: string
    freePackaging: string
    secureCod: string
  }
  cart: {
    title: string
    empty: string
    emptySub: string
    subtotal: string
    shipping: string
    total: string
    checkout: string
    continueShopping: string
    quantity: string
    remove: string
    freeShippingNotice: string
  }
  checkout: {
    title: string
    subtitle: string
    fullName: string
    phone: string
    wilaya: string
    commune: string
    address: string
    deliveryMethod: string
    domicile: string
    stopDesk: string
    paymentNotice: string
    placeOrder: string
    orderSummary: string
    successTitle: string
    successMessage: string
  }
  trust: {
    paymentOnDelivery: string
    paymentOnDeliverySub: string
    wilayasShipping: string
    wilayasShippingSub: string
    velvetPackaging: string
    velvetPackagingSub: string
  }
  footer: {
    brandDescription: string
    explore: string
    customerCare: string
    legal: string
    contactUs: string
    shippingReturns: string
    faq: string
    terms: string
    privacy: string
    copyright: string
  }
}

export const TRANSLATIONS: Record<Locale, Dictionary> = {
  ar: {
    common: {
      brandName: 'كندجي للمجوهرات الفاخرة',
      currency: 'دينار جزائري',
      currencySymbol: 'د.ج',
      codBadge: 'الدفع عند الاستلام عبر 58 ولاية',
      deliveryGuarantee: 'توصيل سريع وآمن في جميع أنحاء الجزائر',
      shopNow: 'استكشف التشكيلة',
      viewAll: 'عرض جميع المجوهرات',
      details: 'عرض التفاصيل',
      addToCart: 'أضف إلى السلة',
      orderNow: 'اطلب الآن (الدفع عند الاستلام)',
      buyNow: 'شراء الآن',
      contactUs: 'اتصل بنا',
      back: 'رجوع',
      save: 'حفظ',
      cancel: 'إلغاء',
      loading: 'جاري التحميل...',
      success: 'تمت العملية بنجاح',
      error: 'حدث خطأ ما'
    },
    nav: {
      home: 'الرئيسية',
      shop: 'المتجر',
      categories: 'التصنيفات',
      collections: 'المجموعات',
      about: 'عن دار كندجي',
      contact: 'اتصل بنا',
      cart: 'السلة',
      search: 'بحث'
    },
    hero: {
      badge: 'كندجي للمجوهرات الفاخرة • فخامة معاصرة',
      headline: 'فن الأناقة والجاذبية الخالدة.',
      subheadline: 'مجوهرات راقية مصممة بدقة متناهية لتجسد الأنوثة والأناقة الرفيعة. قطع استثنائية تناسب ذوقك الفريد.',
      ctaPrimary: 'استكشف التشكيلة',
      ctaSecondary: 'تصفح المجموعات',
      signatureSelection: 'المختارات المميزة'
    },
    home: {
      featuredBadge: 'تشكيلة حصرية',
      featuredTitle: 'أروع الإبداعات',
      featuredSubtitle: 'قطع فريدة تجمع بين الطلاء الذهبي اللامع، عرق اللؤلؤ والأحجار البراقة.',
      worldsBadge: 'عوالم كندجي',
      worldsTitle: 'استكشف مجموعاتنا',
      worldsSubtitle: 'تألقي بمجموعات مستوحاة من روعة الطبيعة وسحر التصاميم العصرية.',
      storyBadge: 'فلسفتنا',
      storyTitle: 'دار كندجي للمجوهرات',
      storyP1: 'انطلقت دار كندجي بشغف لتقديم مجوهرات استثنائية تجمع بين الحرفية العالية والجمال الراقي لتكون بصمتك الخاصة.',
      storyP2: 'تصلكم كل قطعة داخل علبة مخملية فاخرة مع شهادة ضمان وتوصيل مضمون لجميع الولايات الـ 58.',
      storyCta: 'تصفح المجوهرات',
      ctaTitle: 'تألقي في كل مناسبة',
      ctaSubtitle: 'اطلبي الآن بكل ثقة مع ميزة الدفع نقداً عند استلام طلبيتك.',
      ctaButton: 'زيارة المتجر'
    },
    collectionIntro: {
      badge: 'عوالم عريقة',
      title: 'عوالم الجمال والأناقة',
      subtitle: 'تستكشف كل مجموعة توازناً فريداً بين الشكل والوجدان والحرفية الرفيعة لتألق هادئ ومميز.',
      exploreUniverse: 'استكشف المجموعة'
    },
    editorial: {
      badge: 'بيان الدار',
      quote: '«المجوهرات هي الهندسة الصامتة للهوية — خطوط دقيقة تلتقط الضوء في لحظات لا تُنسى.»',
      f1: 'هندسة معمارية',
      f2: 'بريق يدوم',
      f3: 'فخامة هادئة'
    },
    categoryEmphasis: {
      setsBadge: 'طقم متناغم',
      setsTitle: 'إطلالة متكاملة وتألق متناسق',
      setsDesc: 'مصممة كبصمة جمالية موحدة حيث تعكس كل قطعة الجوهر الرئيسي للطقم، لتمنحك خيارات إطلالة راقية في المناسبات والأيام المميزة.',
      necklacesBadge: 'سحر العنق والياقة',
      necklacesTitle: 'انسيابية راقية على ملامح العنق',
      necklacesDesc: 'مبتكرة لترتكز بسلاسة على عظام الترقوة مع توازن متقن يضمن بقاء القلادة المركزية متألقة ومستقرة من كل الزوايا.',
      braceletsBadge: 'أناقة المعصم',
      braceletsTitle: 'تصميم يراعي انحناءات المعصم',
      braceletsDesc: 'مصممة لتنسجم مع الانحناءات الطبيعية للمعصم، لتمنحك راحة تامة وإمكانية دمجها بسلاسة مع الأساور والساعات.',
      watchesBadge: 'ساعات فاخرة',
      watchesTitle: 'إطار جوهري بدقة عالية',
      watchesDesc: 'تجمع بين جماليات المجوهرات وتفاصيل صناعة الساعات الكلاسيكية، بإطار مرصع وسوار فاخر مريح.',
      ringsBadge: 'خواتم وسوليتير',
      ringsTitle: 'تناسب بدقة وتألق ساحر',
      ringsDesc: 'مصممة لراحة حركة الأصابع مع لمسات داخلية ناعمة وإطار يبرز بريق الأحجار.'
    },
    productStory: {
      badge: 'رؤية التصميم',
      title: 'صنعت بأبعاد دقيقة ومتقنة.',
      quote: '«تم تصميم كل زاوية لتوازن بين وزن المعدن وانعكاس الضوء الساحر.»',
      signatureLabel: 'بصمة التصميم:',
      finishLabel: 'الطلاء واللمعان:',
      notice: 'صنعت بعناية حرفية فائقة، وتصلك داخل علبة فاخرة مصممة لحفظها، مرفقة بتوصيات العناية للحفاظ على بريقها الخالد.'
    },
    productDetails: {
      badge: 'المواصفات الفنية',
      title: 'تفاصيل المنتج المعتمدة',
      ref: 'رمز القطعة',
      category: 'التصنيف',
      collection: 'المجموعة',
      pieces: 'عدد القطع',
      finish: 'طلاء المعدن',
      stones: 'الأحجار والتطعيمات',
      paymentMethod: 'طريقة الدفع',
      paymentMethodVal: 'الدفع نقداً عند الاستلام ومعاينة الطرد',
      territory: 'نطاق التوصيل',
      territoryVal: 'توصيل للمنزل أو المكتب عبر 58 ولاية جزائرية',
      care: 'إرشادات الحفظ',
      careVal: 'يحفظ في العلبة المخملية الأصلية، ويفضل تجنب الملامسة المباشرة للعطور والمواد الكيميائية.'
    },
    relatedProducts: {
      badge: 'تناغم مميز',
      title: 'أكملي إطلالتك',
      exploreCollection: 'استكشف مجموعة'
    },
    productFinalCta: {
      badge: 'متجر دار كندجي',
      titleLine1: 'تألقي بأنوثة',
      titleLine2: 'وجاذبية خالدة.',
      desc: 'اطلبي القطعة اليوم وتصلي بعلبة مخملية فاخرة مع ميزة الدفع عند الاستلام في الجزائر.',
      orderNow: 'اطلبي الآن',
      viewCollection: 'عرض المجموعة'
    },
    categories: {
      sets: 'أطقم مجوهرات فاخرة',
      necklaces: 'قلادات وسلاسل',
      bracelets: 'أساور وأغلال',
      rings: 'خواتم وسوليتير',
      watches: 'ساعات يد نسائية',
      all: 'جميع المجوهرات'
    },
    catalog: {
      allCategories: 'جميع التصنيفات',
      allCollections: 'جميع المجموعات',
      filterCategory: 'التصنيف',
      filterCollection: 'المجموعة',
      sortBy: 'ترتيب حسب',
      sortDefault: 'افتراضي',
      sortPriceAsc: 'السعر: من الأقل للأعلى',
      sortPriceDesc: 'السعر: من الأعلى للأقل',
      resultsCount: 'قطعة متوفرة',
      noProducts: 'لا توجد مجوهرات مطابقة لهذا الاختيار.',
      viewDetails: 'عرض التفاصيل'
    },
    product: {
      inStock: 'متوفر • جاهز للشحن الفوري',
      outOfStock: 'نفذت الكمية حالياً',
      material: 'المعدن والمواد',
      finish: 'الطلاء واللمعان',
      stones: 'الأحجار وعرق اللؤلؤ',
      dimensions: 'المقاسات والأبعاد',
      piecesIncluded: 'محتويات الطقم',
      care: 'إرشادات العناية',
      deliveryNotice: 'توصيل سريع إلى باب المنزل أو المكتب عبر 58 ولاية.',
      selectVariant: 'اختيار اللون أو المقاس',
      quantity: 'الكمية',
      addToBag: 'أضف إلى السلة',
      expressCod: 'طلب سريع (الدفع عند الاستلام)',
      freePackaging: 'علبة مخملية فاخرة وشهادة ضمان متضمنة',
      secureCod: 'الدفع نقداً عند استلام ومعاينة الطلبية'
    },
    cart: {
      title: 'سلة مشترياتك الفاخرة',
      empty: 'السلة فارغة حالياً',
      emptySub: 'تصفحي مجموعاتنا الراقية واختاري القطع التي تناسب إطلالتك.',
      subtotal: 'المجموع الفرعي',
      shipping: 'التوصيل لـ 58 ولاية',
      total: 'المبلغ الإجمالي عند الاستلام',
      checkout: 'إتمام الطلب (الدفع عند الاستلام)',
      continueShopping: 'متابعة التسوق',
      quantity: 'الكمية',
      remove: 'حذف',
      freeShippingNotice: 'الدفع نقداً بالدينار الجزائري لعمال التوصيل عند الاستلام.'
    },
    checkout: {
      title: 'تأكيد الطلب والدفع عند الاستلام',
      subtitle: 'الدفع نقداً بالدينار الجزائري عند وصول الطرد إلى باب بيتك',
      fullName: 'الاسم واللقب الكامل',
      phone: 'رقم الهاتف للتأكيد والتوصيل',
      wilaya: 'الولاية (58 ولاية)',
      commune: 'البلدية',
      address: 'العنوان بالتفصيل',
      deliveryMethod: 'طريقة التوصيل',
      domicile: 'توصيل إلى باب المنزل',
      stopDesk: 'استلام من مكتب الشحن (Stop Desk)',
      paymentNotice: 'لا تدفعي أي شيء الآن. الدفع يتم نقداً لعمال التوصيل عند استلام الطرد ومعاينته.',
      placeOrder: 'تأكيد الطلبية الآن',
      orderSummary: 'ملخص مشترياتك',
      successTitle: 'تم تسجيل طلبك بنجاح !',
      successMessage: 'سيتصل بك فريق خدمة العملاء هاتفياً لتأكيد العنوان وشحن طلبيتك فوراً.'
    },
    trust: {
      paymentOnDelivery: 'الدفع عند الاستلام',
      paymentOnDeliverySub: 'ادفعي بأمان وراحة بال بعد معاينة مجوهراتك.',
      wilayasShipping: 'توصيل لـ 58 ولاية',
      wilayasShippingSub: 'شحن سريع ومؤمن خلال 24 إلى 72 ساعة.',
      velvetPackaging: 'علبة مخملية فاخرة',
      velvetPackagingSub: 'تغليف راقٍ وجاهز للإهداء في جميع المناسبات.'
    },
    footer: {
      brandDescription: 'دار مجوهرات راقية تجمع بين الفخامة المعاصرة والحرفية الرفيعة لتمنحك إطلالة فريدة في الجزائر.',
      explore: 'استكشف',
      customerCare: 'خدمة العملاء',
      legal: 'معلومات قانونية',
      contactUs: 'تواصل معنا',
      shippingReturns: 'الشحن والإرجاع',
      faq: 'الأسئلة الشائعة',
      terms: 'الشروط والأحكام',
      privacy: 'سياسة الخصوصية',
      copyright: 'كندجي للمجوهرات الفاخرة. جميع الحقوق محفوظة.'
    }
  },
  fr: {
    common: {
      brandName: 'KenDji Luxury',
      currency: 'Dinar Algérien',
      currencySymbol: 'DA',
      codBadge: 'Paiement à la Livraison 58 Wilayas',
      deliveryGuarantee: 'Livraison express sécurisée en Algérie',
      shopNow: 'Explorer la Collection',
      viewAll: 'Voir toutes les créations',
      details: 'Voir les détails',
      addToCart: 'Ajouter au Panier',
      orderNow: 'Commander en 1 Clic (COD)',
      buyNow: 'Acheter Maintenant',
      contactUs: 'Contactez-nous',
      back: 'Retour',
      save: 'Enregistrer',
      cancel: 'Annuler',
      loading: 'Chargement...',
      success: 'Opération réussie',
      error: 'Une erreur est survenue'
    },
    nav: {
      home: 'Accueil',
      shop: 'Boutique',
      categories: 'Catégories',
      collections: 'Collections',
      about: 'Maison KenDji',
      contact: 'Contact',
      cart: 'Panier',
      search: 'Recherche'
    },
    hero: {
      badge: 'KenDji Luxury • Haute Joaillerie',
      headline: 'L’Architecture de l’Intimité.',
      subheadline: 'Une joaillerie d’exception conçue avec une précision architecturale. Des créations précieuses pensées comme des emblèmes d’élégance intemporelle.',
      ctaPrimary: 'Explorer la Collection',
      ctaSecondary: 'Découvrir les Univers',
      signatureSelection: 'Sélection Signature'
    },
    home: {
      featuredBadge: 'Sélection Exclusive',
      featuredTitle: 'Créations Emblématiques',
      featuredSubtitle: 'Des pièces maîtresses alliant finitions dorées, nacre et pierres éclatantes.',
      worldsBadge: 'Univers KenDji',
      worldsTitle: 'Explorez nos Collections',
      worldsSubtitle: 'Plongez dans des récits joailliers uniques, du romantisme botanique à l’audace contemporaine.',
      storyBadge: 'Notre Philosophie',
      storyTitle: 'La Maison KenDji',
      storyP1: 'Née d’une passion pour la pureté des lignes et l’artisanat d’art, KenDji Luxury réinvente le bijou comme une signature personnelle.',
      storyP2: 'Chaque création est livrée dans son écrin de velours avec son certificat d’authenticité partout en Algérie.',
      storyCta: 'Découvrir nos créations',
      ctaTitle: 'Sublimez Chaque Instant',
      ctaSubtitle: 'Commandez en toute sérénité avec le paiement en espèces à la livraison.',
      ctaButton: 'Accéder à la Boutique'
    },
    collectionIntro: {
      badge: 'Curated Worlds',
      title: 'Univers Esthétiques',
      subtitle: 'Chaque collection explore un équilibre unique de forme, de sentiment et de savoir-faire.',
      exploreUniverse: 'Explorer l’Univers'
    },
    editorial: {
      badge: 'Éditorial Signature',
      quote: '«Le bijou est la géométrie silencieuse de l’identité — des lignes subtiles captant la lumière dans des moments inoubliables.»',
      f1: 'Forme Architecturale',
      f2: 'Éclat Durable',
      f3: 'Luxe Subtil'
    },
    categoryEmphasis: {
      setsBadge: 'Parure Harmonieuse',
      setsTitle: 'Silhouette Coordonnée & Look Complet',
      setsDesc: 'Conçu comme un ensemble esthétique intégré où chaque pièce fait écho au motif central.',
      necklacesBadge: 'Port & Décolleté',
      necklacesTitle: 'Encadrement du Décolleté & Drapé Sculptural',
      necklacesDesc: 'Conçu pour se poser avec grâce le long de la clavicule avec une tension de chaîne équilibrée.',
      braceletsBadge: 'Poignet & Stacking',
      braceletsTitle: 'Ergonomie du Poignet & Polyvalence de Stacking',
      braceletsDesc: 'Courbé pour suivre les contours naturels du poignet avec un profil confortable.',
      watchesBadge: 'Horlogerie & Précision',
      watchesTitle: 'Lunette Architecturale & Éclat Bicolore',
      watchesDesc: 'Alliant l’esthétique joaillère aux détails horlogers classiques avec lunette sertie.',
      ringsBadge: 'Bague & Silhouette',
      ringsTitle: 'Proportions de l’Anneau & Présence Solitaire',
      ringsDesc: 'Conçu pour une articulation confortable des doigts avec des profils intérieurs doux.'
    },
    productStory: {
      badge: 'Design Insight',
      title: 'Conçu avec une Proportion Réfléchie.',
      quote: '«Chaque angle est façonné pour équilibrer le poids métallique et la réflexion de la lumière.»',
      signatureLabel: 'Signature Visuelle :',
      finishLabel: 'Finition & Texture :',
      notice: 'Fabriqué avec un soin artisanal, livré dans son packaging cadeau sur mesure.'
    },
    productDetails: {
      badge: 'Spécifications',
      title: 'Détails du Produit Vérifiés',
      ref: 'Référence Produit',
      category: 'Catégorie',
      collection: 'Collection',
      pieces: 'Pièces Incluses',
      finish: 'Finition Métallique',
      stones: 'Pierres & Incrustations',
      paymentMethod: 'Mode de Règlement',
      paymentMethodVal: 'Paiement en espèces à la livraison (Cash on Delivery)',
      territory: 'Territoire de Livraison',
      territoryVal: 'Livraison à domicile ou point relais partout en Algérie',
      care: 'Conseils d’Entretien',
      careVal: 'Conserver dans son écrin d’origine. Éviter le contact prolongé avec parfums et produits chimiques.'
    },
    relatedProducts: {
      badge: 'Harmonies Rapprochées',
      title: 'Compléter le Look',
      exploreCollection: 'Explorer la Collection'
    },
    productFinalCta: {
      badge: 'Boutique KenDji',
      titleLine1: 'Adornez-vous d’une',
      titleLine2: 'Distinction Durable.',
      desc: 'Commandez votre bijou aujourd’hui. Recevez votre coffret sur mesure et réglez à la livraison en Algérie.',
      orderNow: 'Commander Maintenant',
      viewCollection: 'Voir la Collection'
    },
    categories: {
      sets: 'Parures & Ensembles',
      necklaces: 'Colliers & Pendentifs',
      bracelets: 'Bracelets & Joncs',
      rings: 'Bagues & Solitaires',
      watches: 'Montres Joaillières',
      all: 'Toutes les créations'
    },
    catalog: {
      allCategories: 'Toutes les catégories',
      allCollections: 'Toutes les collections',
      filterCategory: 'Catégorie',
      filterCollection: 'Collection',
      sortBy: 'Trier par',
      sortDefault: 'Par défaut',
      sortPriceAsc: 'Prix croissant',
      sortPriceDesc: 'Prix décroissant',
      resultsCount: 'pièces trouvées',
      noProducts: 'Aucun bijou trouvé dans cette sélection.',
      viewDetails: 'Découvrir'
    },
    product: {
      inStock: 'En Stock • Expédition Immédiate',
      outOfStock: 'Victime de son succès',
      material: 'Matériau d’Exception',
      finish: 'Finition Métallique',
      stones: 'Pierres & Nacre',
      dimensions: 'Dimensions',
      piecesIncluded: 'Pièces Incluses',
      care: 'Conseils d’Entretien',
      deliveryNotice: 'Livraison express à domicile ou en point relais dans les 58 Wilayas.',
      selectVariant: 'Choisir une déclinaison',
      quantity: 'Quantité',
      addToBag: 'Ajouter au Panier',
      expressCod: 'Commander en Express (COD)',
      freePackaging: 'Écrin de velours & certificat inclus',
      secureCod: 'Paiement en espèces à la livraison'
    },
    cart: {
      title: 'Votre Écrin de Sélection',
      empty: 'Votre panier est vide',
      emptySub: 'Découvrez nos pièces signatures et sublimez votre allure.',
      subtotal: 'Sous-total',
      shipping: 'Livraison 58 Wilayas',
      total: 'Total à régler à la livraison',
      checkout: 'Finaliser la Commande COD',
      continueShopping: 'Poursuivre la sélection',
      quantity: 'Quantité',
      remove: 'Retirer',
      freeShippingNotice: 'Règlement en espèces à la réception de votre colis.'
    },
    checkout: {
      title: 'Validation de Commande COD',
      subtitle: 'Paiement en espèces à la livraison partout en Algérie',
      fullName: 'Nom & Prénom',
      phone: 'Numéro de Téléphone (Confirmation)',
      wilaya: 'Wilaya de Livraison (58)',
      commune: 'Commune',
      address: 'Adresse de livraison détaillée',
      deliveryMethod: 'Mode d’Expédition',
      domicile: 'Livraison à Domicile',
      stopDesk: 'Point Relais (Stop Desk)',
      paymentNotice: 'Vous ne payez rien maintenant. Le règlement se fait en dinars lors de la remise en main propre.',
      placeOrder: 'Confirmer ma Commande COD',
      orderSummary: 'Récapitulatif de votre commande',
      successTitle: 'Commande Confirmée !',
      successMessage: 'Votre commande a été enregistrée. Notre service client vous contactera par téléphone pour validation.'
    },
    trust: {
      paymentOnDelivery: 'Paiement à la Livraison',
      paymentOnDeliverySub: 'Réglez en toute sérénité à la réception de votre bijou.',
      wilayasShipping: 'Livraison 58 Wilayas',
      wilayasShippingSub: 'Expédition rapide sous 24 à 72 heures.',
      velvetPackaging: 'Écrin & Certificat Luxe',
      velvetPackagingSub: 'Présentation soignée prête à offrir.'
    },
    footer: {
      brandDescription: 'Maison de joaillerie de luxe contemporaine. Précision architecturale et matériaux nobles en Algérie.',
      explore: 'Explorer',
      customerCare: 'Service Client',
      legal: 'Informations Légales',
      contactUs: 'Nous Contacter',
      shippingReturns: 'Livraison & Retours',
      faq: 'Questions Fréquentes',
      terms: 'Conditions Générales',
      privacy: 'Politique de Confidentialité',
      copyright: 'KenDji Luxury. Tous droits réservés.'
    }
  },
  en: {
    common: {
      brandName: 'KenDji Luxury',
      currency: 'Algerian Dinar',
      currencySymbol: 'DZD',
      codBadge: 'Cash on Delivery • 58 Wilayas',
      deliveryGuarantee: 'Express secured delivery across Algeria',
      shopNow: 'Discover the Collection',
      viewAll: 'View All Creations',
      details: 'View Details',
      addToCart: 'Add to Cart',
      orderNow: 'Order Now (COD)',
      buyNow: 'Buy Now',
      contactUs: 'Contact Us',
      back: 'Back',
      save: 'Save',
      cancel: 'Cancel',
      loading: 'Loading...',
      success: 'Operation Successful',
      error: 'An error occurred'
    },
    nav: {
      home: 'Home',
      shop: 'Shop All',
      categories: 'Categories',
      collections: 'Collections',
      about: 'About KenDji',
      contact: 'Contact',
      cart: 'Cart',
      search: 'Search'
    },
    hero: {
      badge: 'KenDji Luxury • High Jewelry',
      headline: 'The Architecture of Intimacy.',
      subheadline: 'Modern monochrome luxury designed with architectural precision. Elevating curated statement jewelry into timeless personal emblems.',
      ctaPrimary: 'Discover the Collection',
      ctaSecondary: 'Explore Worlds',
      signatureSelection: 'Signature Selection'
    },
    home: {
      featuredBadge: 'Curated Selection',
      featuredTitle: 'Iconic Creations',
      featuredSubtitle: 'Masterpieces combining gold finish, mother-of-pearl, and radiant stones.',
      worldsBadge: 'KenDji Universes',
      worldsTitle: 'Explore our Collections',
      worldsSubtitle: 'Immerse yourself in defined design languages, from botanical romanticism to bold urban contours.',
      storyBadge: 'Our Philosophy',
      storyTitle: 'Maison KenDji',
      storyP1: 'Born from a devotion to geometric clarity and precious metallurgy, KenDji Luxury redefines contemporary jewelry.',
      storyP2: 'Each piece is delivered in its signature velvet presentation case with a certificate of authenticity across all 58 Wilayas.',
      storyCta: 'Explore Creations',
      ctaTitle: 'Elevate Every Moment',
      ctaSubtitle: 'Order with total peace of mind using cash on delivery across Algeria.',
      ctaButton: 'Enter the Boutique'
    },
    collectionIntro: {
      badge: 'Curated Worlds',
      title: 'Aesthetic Universes',
      subtitle: 'Each collection explores a unique balance of form, sentiment, and craftsmanship.',
      exploreUniverse: 'Explore Universe'
    },
    editorial: {
      badge: 'Editorial Statement',
      quote: '“Jewelry is the silent geometry of identity—subtle lines catching light in unforgettable moments.”',
      f1: 'Architectural Form',
      f2: 'Enduring Finish',
      f3: 'Subtle Luxury'
    },
    categoryEmphasis: {
      setsBadge: 'Harmonious Parure',
      setsTitle: 'Complete Look & Coordinated Silhouette',
      setsDesc: 'Designed as an integrated aesthetic suite where each piece echoes the central motif.',
      necklacesBadge: 'Port & Décolleté',
      necklacesTitle: 'Neckline Framing & Sculptural Drape',
      necklacesDesc: 'Engineered to sit gracefully along the collarbone with balanced chain tension.',
      braceletsBadge: 'Wrist & Stacking',
      braceletsTitle: 'Wrist Ergonomics & Stacking Versatility',
      braceletsDesc: 'Curved to follow the natural contours of the wrist with a comfortable profile.',
      watchesBadge: 'Horlogerie & Precision',
      watchesTitle: 'Architectural Bezel & Two-Tone Fluidity',
      watchesDesc: 'Combining jewelry aesthetics with classic horological detailing.',
      ringsBadge: 'Ring & Silhouette',
      ringsTitle: 'Band Proportions & Solitaire Presence',
      ringsDesc: 'Designed for comfortable finger articulation with smooth inner profiling.'
    },
    productStory: {
      badge: 'Design Insight',
      title: 'Crafted with Deliberate Proportion.',
      quote: '“Every angle is shaped to balance metallic weight with delicate light reflection.”',
      signatureLabel: 'Design Signature:',
      finishLabel: 'Finishing & Texture:',
      notice: 'Handled with artisanal care, delivered in protective custom gift packaging.'
    },
    productDetails: {
      badge: 'Specifications',
      title: 'Verified Product Details',
      ref: 'Product Reference',
      category: 'Category',
      collection: 'Collection Universe',
      pieces: 'Pieces Included',
      finish: 'Metallic Finish',
      stones: 'Stones & Inlays',
      paymentMethod: 'Payment Method',
      paymentMethodVal: 'Cash on Delivery (COD)',
      territory: 'Delivery Territory',
      territoryVal: 'Doorstep or pickup point delivery across Algeria',
      care: 'Care Recommendations',
      careVal: 'Store in its original velvet case. Avoid prolonged contact with perfumes and chemicals.'
    },
    relatedProducts: {
      badge: 'Curated Harmonies',
      title: 'Complete the Look',
      exploreCollection: 'Explore Collection'
    },
    productFinalCta: {
      badge: 'KenDji Boutique',
      titleLine1: 'Adorn Yourself with',
      titleLine2: 'Lasting Distinction.',
      desc: 'Order today. Receive your bespoke gift box and pay upon delivery in Algeria.',
      orderNow: 'Order Now',
      viewCollection: 'View Collection'
    },
    categories: {
      sets: 'Jewelry Sets',
      necklaces: 'Necklaces & Pendants',
      bracelets: 'Bracelets & Bangles',
      rings: 'Rings & Solitaires',
      watches: 'Jeweled Timepieces',
      all: 'All Creations'
    },
    catalog: {
      allCategories: 'All Categories',
      allCollections: 'All Collections',
      filterCategory: 'Category',
      filterCollection: 'Collection',
      sortBy: 'Sort by',
      sortDefault: 'Default',
      sortPriceAsc: 'Price: Low to High',
      sortPriceDesc: 'Price: High to Low',
      resultsCount: 'creations found',
      noProducts: 'No jewelry matches this selection.',
      viewDetails: 'Discover'
    },
    product: {
      inStock: 'In Stock • Ready to Dispatch',
      outOfStock: 'Sold Out',
      material: 'Precious Material',
      finish: 'Metallic Finish',
      stones: 'Stones & Inlays',
      dimensions: 'Dimensions',
      piecesIncluded: 'Pieces Included',
      care: 'Care Guide',
      deliveryNotice: 'Doorstep or pickup point delivery across all 58 Wilayas in Algeria.',
      selectVariant: 'Select Variant',
      quantity: 'Quantity',
      addToBag: 'Add to Cart',
      expressCod: 'Express Order (COD)',
      freePackaging: 'Velvet case & certificate included',
      secureCod: 'Cash settlement upon parcel inspection'
    },
    cart: {
      title: 'Your Jewelry Selection',
      empty: 'Your cart is empty',
      emptySub: 'Explore our signature emblems and elevate your style.',
      subtotal: 'Subtotal',
      shipping: 'Delivery Fee (58 Wilayas)',
      total: 'Total Due upon Delivery',
      checkout: 'Complete COD Order',
      continueShopping: 'Continue Shopping',
      quantity: 'Quantity',
      remove: 'Remove',
      freeShippingNotice: 'Pay cash in DZD directly to the courier upon delivery.'
    },
    checkout: {
      title: 'Cash on Delivery Checkout',
      subtitle: 'Pay cash upon delivery anywhere in Algeria',
      fullName: 'Full Name',
      phone: 'Phone Number (For Confirmation)',
      wilaya: 'Delivery Wilaya (58)',
      commune: 'Commune / City',
      address: 'Full Street Address',
      deliveryMethod: 'Delivery Method',
      domicile: 'Home Delivery',
      stopDesk: 'Pickup Point (Stop Desk)',
      paymentNotice: 'No prepayment required. Settle in cash (DZD) directly with the courier upon parcel delivery.',
      placeOrder: 'Confirm Order (COD)',
      orderSummary: 'Order Summary',
      successTitle: 'Order Confirmed!',
      successMessage: 'Your order has been recorded. Our concierge team will call you to confirm delivery details.'
    },
    trust: {
      paymentOnDelivery: 'Cash on Delivery',
      paymentOnDeliverySub: 'Pay with complete peace of mind upon receiving your jewelry.',
      wilayasShipping: '58 Wilayas Delivery',
      wilayasShippingSub: 'Fast & secured delivery within 24 to 72 hours.',
      velvetPackaging: 'Signature Velvet Box',
      velvetPackagingSub: 'Refined presentation ready for gifting.'
    },
    footer: {
      brandDescription: 'Contemporary luxury jewelry house. Architectural precision and noble materials across Algeria.',
      explore: 'Explore',
      customerCare: 'Customer Care',
      legal: 'Legal Information',
      contactUs: 'Contact Us',
      shippingReturns: 'Shipping & Returns',
      faq: 'FAQ',
      terms: 'Terms of Service',
      privacy: 'Privacy Policy',
      copyright: 'KenDji Luxury. All rights reserved.'
    }
  }
}

export function getDictionary(locale: Locale = 'ar'): Dictionary {
  return TRANSLATIONS[locale] || TRANSLATIONS.ar
}

export function getDirection(locale: Locale = 'ar'): 'rtl' | 'ltr' {
  return locale === 'ar' ? 'rtl' : 'ltr'
}
