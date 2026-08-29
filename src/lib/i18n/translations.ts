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
    collections: string
    about: string
    contact: string
    cart: string
    search: string
  }
  categories: {
    sets: string
    necklaces: string
    bracelets: string
    rings: string
    watches: string
    all: string
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
  }
  trust: {
    paymentOnDelivery: string
    paymentOnDeliverySub: string
    wilayasShipping: string
    wilayasShippingSub: string
    velvetPackaging: string
    velvetPackagingSub: string
  }
}

export const TRANSLATIONS: Record<Locale, Dictionary> = {
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
      collections: 'Collections',
      about: 'Maison KenDji',
      contact: 'Contact',
      cart: 'Panier',
      search: 'Recherche'
    },
    categories: {
      sets: 'Parures',
      necklaces: 'Colliers',
      bracelets: 'Bracelets',
      rings: 'Bagues',
      watches: 'Montres',
      all: 'Toutes les créations'
    },
    product: {
      inStock: 'En Stock &bull; Expédition Immédiate',
      outOfStock: 'Victime de son succès',
      material: 'Matériau',
      finish: 'Finition Métallique',
      stones: 'Pierres & Inserts',
      dimensions: 'Dimensions',
      piecesIncluded: 'Pièces incluses',
      care: 'Conseils d’entretien',
      deliveryNotice: 'Livraison à domicile ou en point relais dans les 58 Wilayas.'
    },
    cart: {
      title: 'Votre Écrin de Sélection',
      empty: 'Votre panier est vide',
      emptySub: 'Découvrez nos pièces signatures et sublimez votre allure.',
      subtotal: 'Sous-total',
      shipping: 'Frais de livraison',
      total: 'Total à régler à la livraison',
      checkout: 'Finaliser la commande COD',
      continueShopping: 'Continuer vos achats',
      quantity: 'Quantité',
      remove: 'Supprimer'
    },
    checkout: {
      title: 'Validation de Commande COD',
      subtitle: 'Paiement en espèces à la livraison partout en Algérie',
      fullName: 'Nom & Prénom',
      phone: 'Numéro de Téléphone',
      wilaya: 'Wilaya de livraison',
      commune: 'Commune',
      address: 'Adresse de livraison détaillée',
      deliveryMethod: 'Mode de Livraison',
      domicile: 'Livraison à Domicile',
      stopDesk: 'Livraison en Point Relais (Stop Desk)',
      paymentNotice: 'Vous ne payez rien maintenant. Le règlement se fait en dinars (DZD) lors de la remise en main propre de votre colis.',
      placeOrder: 'Confirmer ma Commande',
      orderSummary: 'Récapitulatif de votre parure'
    },
    trust: {
      paymentOnDelivery: 'Paiement à la Livraison',
      paymentOnDeliverySub: 'Réglez en toute sérénité à la réception de votre bijou.',
      wilayasShipping: 'Livraison 58 Wilayas',
      wilayasShippingSub: 'Expédition rapide sous 24 à 72 heures.',
      velvetPackaging: 'Écrin & Certificat Luxe',
      velvetPackagingSub: 'Présentation soignée prête à offrir.'
    }
  },
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
      collections: 'المجموعات',
      about: 'عن كندجي',
      contact: 'اتصل بنا',
      cart: 'السلة',
      search: 'بحث'
    },
    categories: {
      sets: 'أطقم فاخرة',
      necklaces: 'قلادات وسلاسل',
      bracelets: 'أساور',
      rings: 'خواتم',
      watches: 'ساعات',
      all: 'جميع المجوهرات'
    },
    product: {
      inStock: 'متوفر &bull; جاهز للشحن الفوري',
      outOfStock: 'نفذت الكمية حالياً',
      material: 'المعدن',
      finish: 'الطلاء واللمعان',
      stones: 'الأحجار والترصيع',
      dimensions: 'المقاسات',
      piecesIncluded: 'محتويات الطقم',
      care: 'إرشادات العناية',
      deliveryNotice: 'توصيل إلى باب المنزل أو المكتب عبر 58 ولاية.'
    },
    cart: {
      title: 'سلة التسوق الفاخرة',
      empty: 'السلة فارغة حالياً',
      emptySub: 'تصفح تشكيلاتنا المميزة واختاري ما يناسب إطلالتك.',
      subtotal: 'المجموع الفرعي',
      shipping: 'تكلفة التوصيل',
      total: 'المبلغ الإجمالي عند الاستلام',
      checkout: 'إتمام الطلب',
      continueShopping: 'متابعة التسوق',
      quantity: 'الكمية',
      remove: 'حذف'
    },
    checkout: {
      title: 'تأكيد الطلب والدفع عند الاستلام',
      subtitle: 'الدفع نقداً بالدينار الجزائري عند وصول الطلبية',
      fullName: 'الاسم واللقب',
      phone: 'رقم الهاتف للتأكيد',
      wilaya: 'الولاية',
      commune: 'البلدية',
      address: 'العنوان بالتفصيل',
      deliveryMethod: 'طريقة التوصيل',
      domicile: 'توصيل إلى المنزل',
      stopDesk: 'استلام من مكتب التوصيل (Stop Desk)',
      paymentNotice: 'لا تدفع أي مبلغ مسبقاً. الدفع يكون نقداً لعمال التوصيل عند استلام مجوهراتك.',
      placeOrder: 'تأكيد الطلب الآن',
      orderSummary: 'ملخص مشترياتك'
    },
    trust: {
      paymentOnDelivery: 'الدفع عند الاستلام',
      paymentOnDeliverySub: 'ادفع بأمان وراحة بال بعد معاينة الطرد.',
      wilayasShipping: 'توصيل لـ 58 ولاية',
      wilayasShippingSub: 'شحن سريع ومؤمن خلال 24 إلى 72 ساعة.',
      velvetPackaging: 'علبة مخملية فاخرة',
      velvetPackagingSub: 'تغليف راقٍ جاهز للإهداء.'
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
      collections: 'Collections',
      about: 'About KenDji',
      contact: 'Contact',
      cart: 'Cart',
      search: 'Search'
    },
    categories: {
      sets: 'Jewelry Sets',
      necklaces: 'Necklaces',
      bracelets: 'Bracelets',
      rings: 'Rings',
      watches: 'Watches',
      all: 'All Creations'
    },
    product: {
      inStock: 'In Stock &bull; Ready to Dispatch',
      outOfStock: 'Sold Out',
      material: 'Material',
      finish: 'Metallic Finish',
      stones: 'Stones & Inlays',
      dimensions: 'Dimensions',
      piecesIncluded: 'Pieces Included',
      care: 'Care Guide',
      deliveryNotice: 'Doorstep or pickup point delivery across all 58 Wilayas in Algeria.'
    },
    cart: {
      title: 'Your Jewelry Selection',
      empty: 'Your cart is empty',
      emptySub: 'Explore our signature emblems and elevate your style.',
      subtotal: 'Subtotal',
      shipping: 'Delivery Fee',
      total: 'Total Due upon Delivery',
      checkout: 'Complete COD Order',
      continueShopping: 'Continue Shopping',
      quantity: 'Quantity',
      remove: 'Remove'
    },
    checkout: {
      title: 'Cash on Delivery Checkout',
      subtitle: 'Pay cash upon delivery anywhere in Algeria',
      fullName: 'Full Name',
      phone: 'Phone Number',
      wilaya: 'Delivery Wilaya',
      commune: 'Commune / City',
      address: 'Full Street Address',
      deliveryMethod: 'Delivery Method',
      domicile: 'Home Delivery',
      stopDesk: 'Pickup Point (Stop Desk)',
      paymentNotice: 'No prepayment required. Settle in cash (DZD) directly with the courier upon parcel delivery.',
      placeOrder: 'Confirm Order',
      orderSummary: 'Order Summary'
    },
    trust: {
      paymentOnDelivery: 'Cash on Delivery',
      paymentOnDeliverySub: 'Pay with complete peace of mind upon receiving your jewelry.',
      wilayasShipping: '58 Wilayas Delivery',
      wilayasShippingSub: 'Fast & secured delivery within 24 to 72 hours.',
      velvetPackaging: 'Signature Velvet Box',
      velvetPackagingSub: 'Refined presentation ready for gifting.'
    }
  }
}

export function getDictionary(locale: Locale = 'fr'): Dictionary {
  return TRANSLATIONS[locale] || TRANSLATIONS.fr
}

export function getDirection(locale: Locale = 'fr'): 'rtl' | 'ltr' {
  return locale === 'ar' ? 'rtl' : 'ltr'
}
