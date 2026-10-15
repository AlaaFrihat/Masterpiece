/**
 * Agrismart - Partner Nurseries & Stores Shared Data Registry
 * Provides central access to all registered partner nurseries and their storefronts.
 */

(() => {
  const DEFAULT_STORES = [
    {
      id: 'rawabi',
      name: 'Al-Rawabi Botanical Nursery',
      nameAr: 'مشتل الروابي النباتي',
      category: 'exotic',
      tagline: 'Specializing in certified Mediterranean specimens, acclimated rare aroids, organic seedling starters, and artisan clay pottery since 2018.',
      taglineAr: 'متخصصون في الشتلات المتوسطية المعتمدة، نباتات الأرويد النادرة، البذور العضوية، ومراكن الفخار اليدوية منذ عام ٢٠١٨.',
      city: 'Amman - Gardens',
      cityAr: 'عمان - الجاردنز',
      address: 'Wasfi Al-Tal St, Gardens, Amman, Jordan',
      addressAr: 'شارع وصفي التل، الجاردنز، عمان، الأردن',
      lat: 31.9881,
      lng: 35.8655,
      phone: '+962 7 9811 2233',
      whatsapp: '+962798112233',
      rating: 4.9,
      reviewsCount: 148,
      followers: 1420,
      verified: true,
      cover: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1200&auto=format&fit=crop&q=80',
      avatar: 'R',
      avatarColor: 'linear-gradient(135deg, #10b951, #028532)',
      specialties: ['Mediterranean Flora', 'Acclimated Aroids', 'Artisan Pottery', 'Greenhouse Pickup'],
      specialtiesAr: ['نباتات متوسطية', 'أرويد متأقلم', 'فخار يدوي', 'استلام من البيت الزجاجي'],
      dispatched: '1,420+ fulfilled orders',
      dispatchedAr: '١,٤٢٠+ طلب مكتمل ومسلم',
      totalPlants: 24,
      deliveryTime: 'Same-day Amman Dispatch',
      deliveryTimeAr: 'توصيل في نفس اليوم داخل عمان',
      spotlight: {
        name: 'Variegated Monstera Albo',
        nameAr: 'مونستيرا البو نادرة مورقة',
        description: 'Hand-acclimated mother plant specimen with marbled white foliage.',
        descriptionAr: 'عقلة من النبتة الأم معتادة على المناخ المحلي مع أوراق رخامية بيضاء خلابة.',
        price: 110.00,
        image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=500&auto=format&fit=crop&q=80'
      },
      pickupNote: 'Greenhouse pickup available daily from 9:00 AM to 7:00 PM at our Wasfi Al-Tal greenhouse facility.',
      pickupNoteAr: 'متاح الاستلام الذاتي يومياً من ٩:٠٠ صباحاً حتى ٧:٠٠ مساءً من بيتنا الزجاجي في شارع وصفي التل.'
    },
    {
      id: 'greenleaf',
      name: 'Green Leaf Exotic Nursery',
      nameAr: 'مشتل الورقة الخضراء الاستوائي',
      category: 'indoor',
      tagline: 'Amman\'s prime hub for rare tropical aroids, monsteras, philodendrons, and premium humidity-loving indoor foliage.',
      taglineAr: 'الوجهة الأولى في عمان لنباتات الأرويد الاستوائية النادرة، والمونستيرا، والفيلوديندرون، والنباتات الداخلية المحبة للرطوبة.',
      city: 'Amman - Dabouq',
      cityAr: 'عمان - دابوق',
      address: 'Dabouq Botanical Hill, Amman, Jordan',
      addressAr: 'تلال دابوق النباتية، دابوق، عمان، الأردن',
      phone: '+962 7 8844 5566',
      whatsapp: '+962788445566',
      rating: 4.9,
      reviewsCount: 96,
      followers: 980,
      verified: true,
      cover: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1200&auto=format&fit=crop&q=80',
      avatar: 'G',
      avatarColor: 'linear-gradient(135deg, #059669, #047857)',
      specialties: ['Exotic Philodendrons', 'Tropical Monsteras', 'Hydroponics & Moss', 'Rare Imports'],
      specialtiesAr: ['فيلوديندرون نادر', 'مونستيرا استوائية', 'زراعة مائية وموس', 'مستوردات نادرة'],
      dispatched: '890+ fulfilled orders',
      dispatchedAr: '٨٩٠+ طلب مكتمل ومسلم',
      totalPlants: 18,
      deliveryTime: 'Express 24h Delivery',
      deliveryTimeAr: 'توصيل سريع خلال ٢٤ ساعة',
      spotlight: {
        name: 'Philodendron Pink Princess',
        nameAr: 'فيلوديندرون بنك برنسيس نادرة',
        description: 'Vibrant bubblegum pink variegated leaves nurtured under gentle LED grow lights.',
        descriptionAr: 'أوراق وردية فاقعة متأقلمة تحت إضاءة زراعية مخصصة ورطوبة محسوبة.',
        price: 45.00,
        image: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=500&auto=format&fit=crop&q=80'
      },
      pickupNote: 'Greenhouse pickup available in Dabouq daily from 10:00 AM to 8:00 PM.',
      pickupNoteAr: 'متاح الاستلام من مشتل دابوق يومياً من ١٠:٠٠ صباحاً حتى ٨:٠٠ مساءً.'
    },
    {
      id: 'olivegrove',
      name: 'Jordan Valley Olive Grove & Flora',
      nameAr: 'مشاتل وادي الأردن والزيتون',
      category: 'trees',
      tagline: 'Centenary Nabali olive trees, flowering bougainvillea hedges, citrus trees, and rustic Jordanian clay pottery.',
      taglineAr: 'أشجار زيتون نبالي أصيلة ومعمرة، جهنميات متسلقة، أشجار حمضيات مثمرة، وجرار فخارية ريفية.',
      city: 'As-Salt & Jordan Valley',
      cityAr: 'السلط وطريق الأغوار',
      address: 'Salt Scenic Highway, KM 14, As-Salt, Jordan',
      addressAr: 'شارع وادي شعيب والستين، كم ١٤، السلط، الأردن',
      phone: '+962 7 7722 3344',
      whatsapp: '+962777223344',
      rating: 4.8,
      reviewsCount: 215,
      followers: 1850,
      verified: true,
      cover: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop&q=80',
      avatar: 'J',
      avatarColor: 'linear-gradient(135deg, #d97706, #b45309)',
      specialties: ['Nabali Olive Trees', 'Flowering Bougainvillea', 'Citrus & Fruit', 'Terracotta Jars'],
      specialtiesAr: ['أشجار زيتون نبالي', 'جهنميات مزهرة', 'حمضيات وفواكه', 'جرار فخار ريفية'],
      dispatched: '2,300+ fulfilled orders',
      dispatchedAr: '٢,٣٠٠+ طلب مكتمل ومسلم',
      totalPlants: 32,
      deliveryTime: 'Heavy Flatbed Van Logistics',
      deliveryTimeAr: 'شحن مجهز للأشجار والمراكن الكبيرة',
      spotlight: {
        name: 'Ancient Nabali Olive Tree (Grafted 8yr)',
        nameAr: 'شجرة زيتون نبالي أصيلة (مطعمة عمر ٨ سنوات)',
        description: 'Robust drought-tolerant specimen ideal for garden courtyards or decorative tubs.',
        descriptionAr: 'شجرة زيتون بلدي قوية ومقاومة للجفاف ومثمرة، مثالية لحدائق الفلل والساحات.',
        price: 85.00,
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&auto=format&fit=crop&q=80'
      },
      pickupNote: 'Direct farm pickup available along the Salt scenic highway daily 8:00 AM - 6:00 PM.',
      pickupNoteAr: 'متاح الاستلام المباشر من المزرعة على طريق السلط يومياً من ٨:٠٠ صباحاً حتى ٦:٠٠ مساءً.'
    },
    {
      id: 'oasis',
      name: 'Amman Oasis Garden Centre',
      nameAr: 'مركز واحة عمان الزراعي',
      category: 'supplies',
      tagline: 'Complete horticultural supply center: certified organic vegetable seeds, Dutch peat moss, micro-irrigation kits, and plant nutrition.',
      taglineAr: 'مركز مستلزمات زراعية متكامل: بذور خضروات عضوية معتمدة، بيتموس هولندي، شبكات ري بالتنقيط، ومغذيات نباتية متطورة.',
      city: 'Amman - Airport Road',
      cityAr: 'عمان - طريق المطار',
      address: 'Airport Highway, Exit 7 (Al-Yadoudah), Amman, Jordan',
      addressAr: 'طريق المطار، مخرج ٧ (اليادودة)، عمان، الأردن',
      phone: '+962 7 9933 1188',
      whatsapp: '+962799331188',
      rating: 4.7,
      reviewsCount: 180,
      followers: 1290,
      verified: true,
      cover: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1200&auto=format&fit=crop&q=80',
      avatar: 'O',
      avatarColor: 'linear-gradient(135deg, #0284c7, #0369a1)',
      specialties: ['Organic Vegetable Seeds', 'Dutch Peat Moss', 'Balcony Drip Systems', 'Soil Conditioners'],
      specialtiesAr: ['بذور خضار عضوية', 'بيتموس هولندي', 'شبكات ري للشرفات', 'محسنات تربة'],
      dispatched: '3,100+ fulfilled orders',
      dispatchedAr: '٣,١٠٠+ طلب مكتمل ومسلم',
      totalPlants: 40,
      deliveryTime: 'Same-day Express Supplies',
      deliveryTimeAr: 'توصيل سريع للمستلزمات بنفس اليوم',
      spotlight: {
        name: 'Balcony Drip Irrigation Starter Kit',
        nameAr: 'حقيبة ري بالتنقيط الذكية للشرفات والحدائق',
        description: 'Complete 12-pot micro drip irrigation kit with automated battery timer.',
        descriptionAr: 'طقم متكامل لري ١٢ حوضاً مع مؤقت ذكي ومنظم ضغط لتوفير المياه والعناية السهلة.',
        price: 38.00,
        image: 'https://images.unsplash.com/photo-1584473457406-6240486418e9?w=500&auto=format&fit=crop&q=80'
      },
      pickupNote: 'Drive-through garden centre pickup available at Airport Road showroom daily 9:00 AM - 9:00 PM.',
      pickupNoteAr: 'متاح الاستلام عبر خدمة السيارات من معرض طريق المطار يومياً من ٩:٠٠ صباحاً حتى ٩:٠٠ مساءً.'
    }
  ];

  const STORE_CATALOGS = {
    rawabi: [
      {
        id: 'merch_1',
        name: 'Olive Bonsai Specimen (15 Years)',
        nameAr: 'بونساي زيتون معمر (١٥ عاماً)',
        botanical: 'Olea europaea',
        category: 'outdoor',
        price: 65.00,
        stock: 12,
        image: 'https://images.unsplash.com/photo-1598880940371-c756e015fea1?w=500&auto=format&fit=crop&q=80',
        traits: 'Full Sun · Moderate Care · Terracotta Potted',
        traitsAr: 'شمس كاملة · عناية معتدلة · في مركن فخاري'
      },
      {
        id: 'merch_2',
        name: 'Variegated Monstera Albo',
        nameAr: 'مونستيرا البو نادرة مورقة',
        botanical: 'Monstera deliciosa variegata',
        category: 'indoor',
        price: 110.00,
        stock: 5,
        image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=500&auto=format&fit=crop&q=80',
        traits: 'Bright Indirect · 1x/wk · Premium Variegation',
        traitsAr: 'إضاءة ساطعة غير مباشرة · ري أسبوعي · توريق أبيض فاخر'
      },
      {
        id: 'merch_3',
        name: 'Terracotta Cylinder Pot (Set of 3)',
        nameAr: 'طقم مراكن فخار أسطوانية (٣ قطع)',
        botanical: 'Handcrafted Mediterranean Clay',
        category: 'pots',
        price: 32.00,
        stock: 18,
        image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&auto=format&fit=crop&q=80',
        traits: 'Breathable Clay · Drainage Hole · Anti-Root Rot',
        traitsAr: 'فخار مسامي صحي · فتحة تصريف · يمنع تعفن الجذور'
      },
      {
        id: 'merch_4',
        name: 'Heritage Heirloom Tomato Seeds',
        nameAr: 'بذور طماطم بلدية متوارثة أصيلة',
        botanical: 'Solanum lycopersicum',
        category: 'seeds',
        price: 6.50,
        stock: 60,
        image: 'https://images.unsplash.com/photo-1592417817098-8f3d6910609f?w=500&auto=format&fit=crop&q=80',
        traits: 'Non-GMO · 94% Germination · Heavy Producer',
        traitsAr: 'غير معدلة وراثياً · نسبة إنبات ٩٤٪ · إنتاج وفير'
      },
      {
        id: 'merch_5',
        name: 'Fiddle Leaf Fig Bush (1.2m)',
        nameAr: 'تين ليراتا فيدل ليف (ارتفاع ١.٢ متر)',
        botanical: 'Ficus lyrata',
        category: 'indoor',
        price: 48.00,
        stock: 8,
        image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=500&auto=format&fit=crop&q=80',
        traits: 'Bright Room · Glossy Broad Leaves',
        traitsAr: 'غرفة مضيئة · أوراق عريضة لامعة ونضرة'
      },
      {
        id: 'merch_6',
        name: 'Meyer Lemon Citrus Specimen',
        nameAr: 'شجرة ليمون ماير قزمية مثمرة',
        botanical: 'Citrus x meyeri',
        category: 'outdoor',
        price: 38.00,
        stock: 15,
        image: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=500&auto=format&fit=crop&q=80',
        traits: 'Full Sun · Fragrant Blossoms · Fruiting',
        traitsAr: 'شمس كاملة · أزهار عطرية · محملة بالثمار'
      }
    ],

    greenleaf: [
      {
        id: 'gl_1',
        name: 'Philodendron Pink Princess',
        nameAr: 'فيلوديندرون بنك برنسيس نادرة',
        botanical: 'Philodendron erubescens',
        category: 'indoor',
        price: 45.00,
        stock: 9,
        image: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=500&auto=format&fit=crop&q=80',
        traits: 'Filtered Light · 60%+ Humidity · Pink Splashes',
        traitsAr: 'ضوء مفلتر · رطوبة ٦٠٪+ · بقع وردية خلابة'
      },
      {
        id: 'gl_2',
        name: 'Calathea Orbifolia Giant',
        nameAr: 'كالاتيا أوربيفوليا العملاقة',
        botanical: 'Goeppertia orbifolia',
        category: 'indoor',
        price: 28.00,
        stock: 14,
        image: 'https://images.unsplash.com/photo-1599685315640-9ceab2f58944?w=500&auto=format&fit=crop&q=80',
        traits: 'Low to Medium Light · Silver-Green Striped',
        traitsAr: 'إضاءة منخفضة إلى متوسطة · خطوط فضية وخضراء'
      },
      {
        id: 'gl_3',
        name: 'Anthurium Clarinervium Velvety',
        nameAr: 'أنثوريوم كلارينيرفيوم مخملي',
        botanical: 'Anthurium clarinervium',
        category: 'indoor',
        price: 58.00,
        stock: 6,
        image: 'https://images.unsplash.com/photo-1604762524889-3e2fccbc2568?w=500&auto=format&fit=crop&q=80',
        traits: 'Velvet Heart Leaves · White Veining',
        traitsAr: 'أوراق قلبية مخملية · عروق بيضاء بارزة'
      },
      {
        id: 'gl_4',
        name: 'Alocasia Polly African Mask',
        nameAr: 'ألوكاسيا بولي (قناع أفريقي)',
        botanical: 'Alocasia amazonica',
        category: 'indoor',
        price: 24.00,
        stock: 12,
        image: 'https://images.unsplash.com/photo-1597055181300-e3633a917c9c?w=500&auto=format&fit=crop&q=80',
        traits: 'Striking Sculptural Foliage · Warm Temp',
        traitsAr: 'نبات منحوت بارز · يحب الأجواء الدافئة'
      },
      {
        id: 'gl_5',
        name: 'Sphagnum Moss Climbing Pole',
        nameAr: 'عامود تسلق بألياف السفاغنوم موس',
        botanical: 'Organic Chilean Sphagnum',
        category: 'pots',
        price: 14.00,
        stock: 30,
        image: 'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?w=500&auto=format&fit=crop&q=80',
        traits: 'Encourages Giant Aerial Roots · Extendable',
        traitsAr: 'يحفز نمو الجذور الهوائية الكبيرة · قابل للزيادة'
      },
      {
        id: 'gl_6',
        name: 'Ultrasonic Botanical Plant Humidifier',
        nameAr: 'جهاز ترطيب ذكي بالموجات للنباتات',
        botanical: '4L Cool Mist Essential Kit',
        category: 'pots',
        price: 36.00,
        stock: 10,
        image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&auto=format&fit=crop&q=80',
        traits: 'Maintains 65% Humidity · Auto Shutoff',
        traitsAr: 'يحافظ على رطوبة ٦٥٪ · إيقاف تلقائي آمن'
      }
    ],

    olivegrove: [
      {
        id: 'og_1',
        name: 'Ancient Nabali Olive Tree (Grafted 8yr)',
        nameAr: 'شجرة زيتون نبالي أصيلة (مطعمة ٨ سنوات)',
        botanical: 'Olea europaea Nabali',
        category: 'outdoor',
        price: 85.00,
        stock: 15,
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&auto=format&fit=crop&q=80',
        traits: 'Drought Tolerant · High Oil Yield · Centenary',
        traitsAr: 'مقاومة للجفاف · نسبة زيت عالية · تعيش لمئات السنين'
      },
      {
        id: 'og_2',
        name: 'Vibrant Bougainvillea Climbing Specimen',
        nameAr: 'شجرة جهنمية متسلقة مزهرة بغزارة',
        botanical: 'Bougainvillea spectabilis',
        category: 'outdoor',
        price: 35.00,
        stock: 22,
        image: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=500&auto=format&fit=crop&q=80',
        traits: 'Magenta Blossoms · Full Sun · Hardy Fence Cover',
        traitsAr: 'زهور فوشية كثيفة · شمس كاملة · تغطية ممتازة للأسوار'
      },
      {
        id: 'og_3',
        name: 'Sweet Clementine Citrus Tree',
        nameAr: 'شجرة كلمنتينا حلوة مثمرة',
        botanical: 'Citrus clementina',
        category: 'outdoor',
        price: 42.00,
        stock: 10,
        image: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=500&auto=format&fit=crop&q=80',
        traits: 'Jordan Valley Acclimated · Seedless Fruit',
        traitsAr: 'متأقلمة مع بيئة الأغوار · ثمار سهلة التقشير'
      },
      {
        id: 'og_4',
        name: 'Handcrafted Jerash Terracotta Planter Large',
        nameAr: 'مركن فخاري جرشي يدوي كبير (٦٠ سم)',
        botanical: 'Jordanian Clay Heritage',
        category: 'pots',
        price: 29.00,
        stock: 18,
        image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=500&auto=format&fit=crop&q=80',
        traits: 'Heavy Natural Clay · Frost Resistant',
        traitsAr: 'طين طبيعي ثقيل · مقاوم للتجمد والصقيع'
      },
      {
        id: 'og_5',
        name: 'Organic Olive Compost Mix (50L)',
        nameAr: 'كومبوست زيتون عضوي غني (٥٠ لتر)',
        botanical: 'Aged Horticultural Humus',
        category: 'seeds',
        price: 16.00,
        stock: 45,
        image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=500&auto=format&fit=crop&q=80',
        traits: 'Enriches Soil Biology · 100% Organic',
        traitsAr: 'يغذي التربة بالبكتيريا النافعة · عضوي ١٠٠٪'
      },
      {
        id: 'og_6',
        name: 'Copper Garden Pruning Shears',
        nameAr: 'مقص تقليم ياباني بشفرات كربونية',
        botanical: 'High-Carbon Forged Steel',
        category: 'pots',
        price: 18.50,
        stock: 25,
        image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&auto=format&fit=crop&q=80',
        traits: 'Razor Sharp · Ergonomic Grip · Tree Branch Cutter',
        traitsAr: 'شفرة حادة جداً · قبضة مريحة · يقص أغصان الأشجار'
      }
    ],

    oasis: [
      {
        id: 'os_1',
        name: 'Dutch Premium Peat Moss (70L)',
        nameAr: 'تربة بيتموس هولندية ممتازة (٧٠ لتر)',
        botanical: 'Sterilized Sphagnum Substrate',
        category: 'seeds',
        price: 22.00,
        stock: 50,
        image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=500&auto=format&fit=crop&q=80',
        traits: 'pH 5.8-6.2 · Weed Free · Moisture Retaining',
        traitsAr: 'حموضة مثالية ٥.٨-٦.٢ · خالية من الأعشاب والآفات'
      },
      {
        id: 'os_2',
        name: 'Organic Liquid Seaweed Fertilizer (1L)',
        nameAr: 'سماد أعشاب بحرية سائل مركز (١ لتر)',
        botanical: 'Ascophyllum Nodosum Extract',
        category: 'seeds',
        price: 15.00,
        stock: 35,
        image: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=500&auto=format&fit=crop&q=80',
        traits: 'Boosts Root Expansion · Micronutrient Dense',
        traitsAr: 'يحفز تفرع الجذور بقوة · مليء بالعناصر النادرة'
      },
      {
        id: 'os_3',
        name: 'Balcony Drip Irrigation Starter Kit',
        nameAr: 'حقيبة ري بالتنقيط الذكية للشرفات والحدائق',
        botanical: '12-Pot Automatic System',
        category: 'pots',
        price: 38.00,
        stock: 20,
        image: 'https://images.unsplash.com/photo-1584473457406-6240486418e9?w=500&auto=format&fit=crop&q=80',
        traits: 'Saves 70% Water · Battery Timer Included',
        traitsAr: 'يوفر ٧٠٪ من المياه · يشمل مؤقت بطارية إلكتروني'
      },
      {
        id: 'os_4',
        name: 'Hybrid Jordan Cucumber Seeds (100 Seeds)',
        nameAr: 'بذور خيار هجين عالي الإنتاج (١٠٠ بذرة)',
        botanical: 'Cucumis sativus F1',
        category: 'seeds',
        price: 8.50,
        stock: 80,
        image: 'https://images.unsplash.com/photo-1449339854873-750e6913301b?w=500&auto=format&fit=crop&q=80',
        traits: 'Crisp Sweet Fruits · Disease Resistant',
        traitsAr: 'ثمار مقرمشة وحلوة · مقاوم للأمراض والفيروسات'
      },
      {
        id: 'os_5',
        name: 'Self-Watering Planter Box 60cm',
        nameAr: 'حوض زراعي ذاتي الري طول ٦٠ سم',
        botanical: 'UV-Stabilized Reservoir Planter',
        category: 'pots',
        price: 27.00,
        stock: 16,
        image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&auto=format&fit=crop&q=80',
        traits: 'Water Level Indicator · Lasts 2 Weeks',
        traitsAr: 'مؤشر لقياس منسوب المياه · يكفي لأسبوعين دون ري'
      },
      {
        id: 'os_6',
        name: 'Horticultural Perlite Soil Aerator (20L)',
        nameAr: 'بيرلايت زراعي نقي لتهوية التربة (٢٠ لتر)',
        botanical: 'Expanded Volcanic Mineral',
        category: 'seeds',
        price: 12.00,
        stock: 40,
        image: 'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?w=500&auto=format&fit=crop&q=80',
        traits: 'Prevents Soil Compaction · Retains Oxygen',
        traitsAr: 'يمنع تكلس التربة وتصلبها · يزود الجذور بالأكسجين'
      }
    ]
  };

  window.AgrismartStores = {
    getStores() {
      const stores = JSON.parse(JSON.stringify(DEFAULT_STORES));

      // Sync active session and merchant store profile if logged in as business
      try {
        const session = JSON.parse(localStorage.getItem('agrismartSession') || 'null');
        const customProfile = JSON.parse(localStorage.getItem('agrismartMerchantStoreProfile') || 'null');
        const rawabi = stores.find(s => s.id === 'rawabi');
        if (rawabi) {
          if (session && (session.accountType === 'business' || session.role === 'business')) {
            if (session.businessName) rawabi.name = session.businessName;
            if (session.phone) rawabi.phone = session.phone;
          }
          if (customProfile) {
            Object.assign(rawabi, customProfile);
          }
        }
      } catch { /* ignore */ }

      // Check any newly registered merchants in localStorage
      try {
        const users = JSON.parse(localStorage.getItem('agrismartUsers') || '[]');
        users.forEach(u => {
          if (u.accountType === 'business' && u.businessName && !stores.some(s => s.name === u.businessName)) {
            stores.push({
              id: 'store_' + (u.id || Math.random().toString(36).substr(2, 6)),
              name: u.businessName,
              nameAr: u.businessName,
              category: 'general',
              tagline: u.businessName + ' - Verified partner nursery serving plant lovers across Jordan.',
              taglineAr: u.businessName + ' - مشتل شريك معتمد يقدم أفضل النباتات في الأردن.',
              city: u.city || 'Amman',
              cityAr: u.city || 'عمان',
              address: (u.city || 'Amman') + ', Jordan',
              addressAr: (u.city || 'عمان') + '، الأردن',
              phone: u.phone || '+962 7 9000 0000',
              whatsapp: (u.phone || '+962 7 9000 0000').replace(/\s+/g, ''),
              rating: 5.0,
              reviewsCount: 1,
              followers: 12,
              verified: true,
              cover: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1200&auto=format&fit=crop&q=80',
              avatar: u.businessName.charAt(0).toUpperCase(),
              avatarColor: 'linear-gradient(135deg, #10b951, #047857)',
              specialties: ['Local Greenery', 'Personal Care', 'Fast Delivery'],
              specialtiesAr: ['نباتات محلية', 'عناية فائقة', 'توصيل سريع'],
              dispatched: 'New Partner Nursery',
              dispatchedAr: 'مشتل شريك جديد',
              totalPlants: 4,
              deliveryTime: '24-48 Hours',
              deliveryTimeAr: 'خلال ٢٤-٤٨ ساعة',
              spotlight: {
                name: 'Fresh Potted Plant',
                nameAr: 'شتلة مميزة في مركن',
                description: 'Selected specimen ready for pickup or direct delivery.',
                descriptionAr: 'شتلة منتقاة بعناية جاهزة للاستلام أو التوصيل المباشر.',
                price: 25.00,
                image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=500&auto=format&fit=crop&q=80'
              },
              pickupNote: 'Direct nursery greenhouse pickup available during regular business hours.',
              pickupNoteAr: 'متاح الاستلام المباشر من البيت الزجاجي للمشتل خلال أوقات الدوام.'
            });
          }
        });
      } catch { /* ignore */ }

      return stores;
    },

    getStoreById(id) {
      const stores = this.getStores();
      if (!id) return stores[0];
      const match = stores.find(s => s.id.toLowerCase() === id.toLowerCase());
      return match || stores[0];
    },

    getStoreProducts(id) {
      const storeId = (id || 'rawabi').toLowerCase();
      // If rawabi, check if user customized products in merchant dashboard
      if (storeId === 'rawabi') {
        try {
          const custom = JSON.parse(localStorage.getItem('agrismartMerchantProducts') || '[]');
          if (Array.isArray(custom) && custom.length) return custom;
        } catch { /* fallback */ }
      }
      return STORE_CATALOGS[storeId] || STORE_CATALOGS['rawabi'] || [];
    }
  };
})();
