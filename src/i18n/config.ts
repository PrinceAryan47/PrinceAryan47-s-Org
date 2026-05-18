import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      nav: {
        home: "Home",
        products: "Products",
        categories: "Categories",
        shops: "Wholesale Shops",
        about: "About Us",
        contact: "Contact",
        dashboard: "Dashboard",
        login: "Login",
        register: "Register"
      },
      auth: {
        welcome_back: "Welcome Back",
        subtitle: "Access your HAM Grounds account",
        email_addr: "Email Address",
        password: "Password",
        forgot: "Forgot?",
        signin: "Sign In",
        signing_in: "Signing In...",
        no_account: "Don't have an account?",
        join_marketplace: "Join HAM Grounds",
        terms_agree: "By signing in, you agree to our Terms of Use and Privacy Policy. Traders are verified for marketplace security.",
        fullname: "Full Name",
        phone: "Phone Number",
        whatsapp: "WhatsApp Number",
        biz_name: "Business Name",
        shop_no: "Shop No.",
        block: "Block",
        create_account: "Create Account",
        joining_as: "Join the marketplace as a",
        register_now: "Register Now",
        already_have: "Already have an account?",
        enter_fullname: "Enter your full name",
        enter_email: "name@email.com",
        enter_password: "••••••••",
        errors: {
          invalid_email: "The email address is badly formatted.",
          user_disabled: "This user account has been disabled.",
          invalid_credential: "Invalid email or password.",
          email_already_in_use: "The email address is already in use by another account.",
          weak_password: "The password is too weak. It must be at least 6 characters.",
          operation_not_allowed: "Email/password accounts are not enabled. Please contact support.",
          network_request_failed: "Network error. Please check your internet connection.",
          too_many_requests: "Too many failed login attempts. Please try again later.",
          default: "An unexpected error occurred. Please try again."
        }
      },
      hero: {
        title: "Grow Your Trading Empire.",
        subtitle: "Source fashion, textiles, and electronics directly from verified wholesalers at Ham Grounds. Manage your stock and records digitally.",
        cta_buy: "Browse Products",
        cta_sell: "Join as Wholesaler",
        badge: "Fashion, Electronics & Home Wholesales"
      },
      home: {
        categories: {
          title: "Explore Categories",
          subtitle: "Find what you need from our verified wholesalers",
          view_all: "View All"
        },
        trending: {
          title: "Trending Wholesales",
          subtitle: "Bulk deals currently moving fast in Kampala",
          view_all: "View All Deals"
        },
        why: {
          title: "Digitizing Trade in Uganda",
          subtitle: "Ham Grounds isn't just a marketplace; it's a tool for business growth.",
          trusted_title: "Trusted Sellers",
          trusted_desc: "Every wholesaler is verified before listing. No more fraud.",
          logistic_title: "Bulk Logistics",
          logistic_desc: "Integrated delivery options for large volume orders.",
          inventory_title: "Smart Inventory",
          inventory_desc: "Sellers get a digital ledger to track every sale automatically."
        },
        stats: {
          wholesalers: "Wholesalers",
          products: "Products",
          orders: "Monthly Orders",
          traded: "UGX Traded"
        }
      },
      footer: {
        about_text: "Uganda's leading wholesale marketplace connecting traders directly with wholesalers. Modernizing trade through digital record keeping and inventory management.",
        quick_links: "Quick Links",
        support: "Support",
        contact: "Contact Us",
        all_rights: "All rights reserved.",
        made_by: "Made by KASUMBA TREASURE"
      },
      sidebar: {
        buyer_hub: "Buyer Hub",
        seller_panel: "Seller Panel",
        profile: "My Profile",
        orders: "My Orders",
        favorites: "My Favorites",
        inquiries: "Inquiries",
        history: "Purchase History",
        dashboard: "Dashboard",
        inventory: "Inventory",
        manage_orders: "Manage Orders",
        ledger: "Sales Ledger",
        analytics: "Growth Analytics",
        business_profile: "Business Profile"
      },
      products: {
        title: "Wholesale Marketplace",
        subtitle: "Discover direct bulk deals from HAM GROUNDS wholesalers.",
        filters: "Filters",
        search_placeholder: "Search for products, categories, or wholesalers...",
        no_found_title: "No products found",
        no_found_desc: "Try adjusting your search or filters to find what you're looking for.",
        load_more: "Load More Products",
        filtered_by: "Filtered by:"
      },
      inventory: {
        title: "Digital Inventory",
        subtitle: "Monitor stock levels and manage wholesale pricing.",
        add_product: "Add New Product",
        search_placeholder: "Search inventory...",
        edit_product: "Edit Product",
        add_to_inv: "Add to Inventory",
        prod_name: "Product Name",
        description: "Description",
        cost_price: "Cost Price (UGX)",
        wholesale_price: "Wholesale Price (UGX)",
        stock: "Stock",
        min_order: "Min Order",
        category: "Category",
        save: "Save Product",
        update: "Update Product",
        cancel: "Cancel",
        wholesale: "Wholesale",
        in_stock: "In Stock",
        moq: "MOQ",
        profit: "Profit/Unit",
        paste_url_placeholder: "Paste Image URL...",
        press_enter_hint: "Press Enter to add the link",
        clear_all: "Clear All",
        drop_here: "Drop here",
        drop_click_upload: "Drop or Click to Upload",
        uploading_wait: "Uploading your images, please wait..."
      },
      common: {
        search: "Search products...",
        cart: "Cart",
        profile: "Profile",
        logout: "Logout",
        loading: "Loading...",
        no_deals: "No wholesale deals available yet."
      }
    }
  },
  fr: {
    translation: {
      nav: {
        home: "Accueil",
        products: "Produits",
        categories: "Catégories",
        shops: "Boutiques de Gros",
        about: "À Propos",
        contact: "Contact",
        dashboard: "Tableau de Bord",
        login: "Connexion",
        register: "S'inscrire"
      },
      auth: {
        welcome_back: "Bon retour",
        subtitle: "Accédez à votre compte HAM Grounds",
        email_addr: "Adresse e-mail",
        password: "Mot de passe",
        forgot: "Oublié ?",
        signin: "Se connecter",
        signing_in: "Connexion...",
        no_account: "Pas de compte ?",
        join_marketplace: "Rejoindre HAM Grounds",
        terms_agree: "En vous connectant, vous acceptez nos conditions d'utilisation. Les commerçants sont vérifiés pour la sécurité du marché.",
        fullname: "Nom complet",
        phone: "Numéro de téléphone",
        whatsapp: "Numéro WhatsApp",
        biz_name: "Nom de l'entreprise",
        shop_no: "N° de boutique",
        block: "Bloc",
        create_account: "Créer un compte",
        joining_as: "Rejoindre le marché en tant que",
        register_now: "S'inscrire maintenant",
        already_have: "Déjà un compte ?",
        enter_fullname: "Entrez votre nom complet",
        enter_email: "nom@email.com",
        enter_password: "••••••••",
        errors: {
          invalid_email: "L'adresse e-mail est mal formatée.",
          user_disabled: "Ce compte utilisateur a été désactivé.",
          invalid_credential: "E-mail ou mot de passe invalide.",
          email_already_in_use: "L'adresse e-mail est déjà utilisée par un autre compte.",
          weak_password: "Le mot de passe est trop faible. Il doit contenir au moins 6 caractères.",
          operation_not_allowed: "Les comptes e-mail/mot de passe ne sont pas activés. Veuillez contacter le support.",
          network_request_failed: "Erreur réseau. Veuillez vérifier votre connexion Internet.",
          too_many_requests: "Trop de tentatives de connexion échouées. Veuillez réessayer plus tard.",
          default: "Une erreur inattendue est survenue. Veuillez réessayer."
        }
      },
      hero: {
        title: "Développez votre empire commercial.",
        subtitle: "Approvisionnez-vous en mode, textiles et électronique directement auprès de grossistes vérifiés à Ham Grounds. Gérez votre stock et vos dossiers numériquement.",
        cta_buy: "Parcourir les produits",
        cta_sell: "Devenir grossiste",
        badge: "Vente en gros Mode, Électronique et Maison"
      },
      home: {
        categories: {
          title: "Explorer les Catégories",
          subtitle: "Trouvez ce dont vous avez besoin auprès de nos grossistes vérifiés",
          view_all: "Voir tout"
        },
        trending: {
          title: "Grossisme en Vogue",
          subtitle: "Les offres groupées se vendent rapidement à Kampala",
          view_all: "Voir toutes les offres"
        },
        why: {
          title: "Numérisation du commerce en Ouganda",
          subtitle: "Ham Grounds n'est pas seulement un marché ; c'est un outil de croissance commerciale.",
          trusted_title: "Vendeurs Vérifiés",
          trusted_desc: "Chaque grossiste est vérifié avant d'être listé. Évitez les fraudes.",
          logistic_title: "Logistique de Gros",
          logistic_desc: "Options de livraison intégrées pour les commandes volumineuses.",
          inventory_title: "Inventaire Intelligent",
          inventory_desc: "Les vendeurs disposent d'un registre numérique pour suivre automatiquement chaque vente."
        },
        stats: {
          wholesalers: "Grossistes",
          products: "Produits",
          orders: "Commandes Mensuelles",
          traded: "Volume UGX"
        }
      },
      footer: {
        about_text: "Le principal marché de gros d'Ouganda connectant directement les commerçants aux grossistes. Modernisation du commerce par la tenue de dossiers numériques.",
        quick_links: "Liens Rapides",
        support: "Assistance",
        contact: "Contactez-nous",
        all_rights: "Tous droits réservés.",
        made_by: "Réalisé par KASUMBA TREASURE"
      },
      sidebar: {
        buyer_hub: "Centre Acheteur",
        seller_panel: "Panneau Vendeur",
        profile: "Mon Profil",
        orders: "Mes Commandes",
        favorites: "Mes Favoris",
        inquiries: "Demandes",
        history: "Historique d'achat",
        dashboard: "Tableau de Bord",
        inventory: "Inventaire",
        manage_orders: "Gérer les Commandes",
        ledger: "Registre des Ventes",
        analytics: "Analyses de Croissance",
        business_profile: "Profil d'Entreprise"
      },
      products: {
        title: "Marché de Gros",
        subtitle: "Découvrez les offres directes des grossistes de HAM GROUNDS.",
        filters: "Filtres",
        search_placeholder: "Rechercher des produits, catégories...",
        no_found_title: "Aucun produit trouvé",
        no_found_desc: "Essayez d'ajuster votre recherche ou vos filtres.",
        load_more: "Charger plus de produits",
        filtered_by: "Filtré par :"
      },
      inventory: {
        title: "Inventaire Numérique",
        subtitle: "Suivez les niveaux de stock et gérez les prix de gros.",
        add_product: "Ajouter un Produit",
        search_placeholder: "Chercher dans l'inventaire...",
        edit_product: "Modifier le Produit",
        add_to_inv: "Ajouter à l'Inventaire",
        prod_name: "Nom du Produit",
        description: "Description",
        cost_price: "Prix de Revient (UGX)",
        wholesale_price: "Prix de Gros (UGX)",
        stock: "Stock",
        min_order: "Commande Min",
        category: "Catégorie",
        save: "Enregistrer",
        update: "Mettre à jour",
        cancel: "Annuler",
        wholesale: "Gros",
        in_stock: "En Stock",
        moq: "MOQ",
        profit: "Profit/Unité",
        paste_url_placeholder: "Coller l'URL de l'image...",
        press_enter_hint: "Appuyez sur Entrée pour ajouter le lien",
        clear_all: "Tout effacer",
        drop_here: "Déposer ici",
        drop_click_upload: "Déposer ou cliquer pour télécharger",
        uploading_wait: "Téléchargement de vos images, veuillez patienter..."
      },
      common: {
        search: "Rechercher des produits...",
        cart: "Panier",
        profile: "Profil",
        logout: "Déconnexion",
        loading: "Chargement...",
        no_deals: "Aucune offre de gros disponible pour le moment."
      }
    }
  },
  zh: {
    translation: {
      nav: {
        home: "首页",
        products: "产品",
        categories: "类别",
        shops: "批发店",
        about: "关于我们",
        contact: "联系我们",
        dashboard: "仪表板",
        login: "登录",
        register: "注册"
      },
      auth: {
        welcome_back: "欢迎回来",
        subtitle: "访问您的 HAM Grounds 帐户",
        email_addr: "电子邮件地址",
        password: "密码",
        forgot: "忘记密码？",
        signin: "登录",
        signing_in: "登录中...",
        no_account: "没有帐户？",
        join_marketplace: "加入 HAM Grounds",
        terms_agree: "登录即表示您同意我们的使用条款。交易者经过验证以确保市场安全。",
        fullname: "全名",
        phone: "电话号码",
        whatsapp: "WhatsApp 号码",
        biz_name: "业务名称",
        shop_no: "店号",
        block: "区块",
        create_account: "创建帐户",
        joining_as: "以...身份加入市场",
        register_now: "现在注册",
        already_have: "已有帐户？",
        enter_fullname: "输入您的全名",
        enter_email: "name@email.com",
        enter_password: "••••••••",
        errors: {
          invalid_email: "电子邮件地址格式不正确。",
          user_disabled: "此用户帐户已被禁用。",
          invalid_credential: "电子邮件或密码无效。",
          email_already_in_use: "电子邮件地址已被另一个帐户使用。",
          weak_password: "密码太弱。必须至少包含 6 个字符。",
          operation_not_allowed: "未启用电子邮件/密码帐户。请联系支持人员。",
          network_request_failed: "网络错误。请检查您的互联网连接。",
          too_many_requests: "登录尝试失败次数过多。请稍后再试。",
          default: "发生意外错误。请再试一次。"
        }
      },
      hero: {
        title: "发展您的贸易帝国。",
        subtitle: "直接从 Ham Grounds 经过验证的批发商处采购时尚、纺织品和电子产品。以数字化方式管理您的库存和记录。",
        cta_buy: "浏览产品",
        cta_sell: "加入成为批发商",
        badge: "时尚、电子及家居批发"
      },
      home: {
        categories: {
          title: "探索类别",
          subtitle: "从我们经过验证的批发商处寻找您需要的商品",
          view_all: "查看全部"
        },
        trending: {
          title: "热门批发",
          subtitle: "坎帕拉目前走势较快的大宗交易",
          view_all: "查看所有交易"
        },
        why: {
          title: "乌干达贸易数字化",
          subtitle: "Ham Grounds 不仅仅是一个市场；它还是企业发展的工具。",
          trusted_title: "值得信赖的卖家",
          trusted_desc: "每位批发商在上市前都经过验证。不再有欺诈。",
          logistic_title: "大宗物流",
          logistic_desc: "针对大批量订单的集成交付选项。",
          inventory_title: "智能库存",
          inventory_desc: "卖家获得数字分类账以自动跟踪每笔销售。"
        },
        stats: {
          wholesalers: "批发商",
          products: "产品",
          orders: "每月订单",
          traded: "交易金额 (UGX)"
        }
      },
      footer: {
        about_text: "乌干达领先的批发市场，将贸易商直接与批发商联系起来。通过数字记录保存和库存管理实现贸易现代化。",
        quick_links: "快速链接",
        support: "支持",
        contact: "联系我们",
        all_rights: "版权所有。",
        made_by: "由 KASUMBA TREASURE 制作"
      },
      sidebar: {
        buyer_hub: "买家中心",
        seller_panel: "卖家面板",
        profile: "个人资料",
        orders: "我的订单",
        favorites: "我的收藏",
        inquiries: "咨询",
        history: "购买历史",
        dashboard: "仪表板",
        inventory: "库存",
        manage_orders: "订单管理",
        ledger: "销售分类账",
        analytics: "增长分析",
        business_profile: "商业资料"
      },
      products: {
        title: "批发市场",
        subtitle: "从 HAM GROUNDS 批发商那里发现直接的大宗交易。",
        filters: "过滤器",
        search_placeholder: "搜索产品、类别或批发商...",
        no_found_title: "未找到产品",
        no_found_desc: "尝试调整您的搜索或过滤器以找到您想要的内容。",
        load_more: "加载更多产品",
        filtered_by: "过滤依据："
      },
      inventory: {
        title: "数字库存",
        subtitle: "监控库存水平并管理批发价格。",
        add_product: "添加新产品",
        search_placeholder: "搜索库存...",
        edit_product: "编辑产品",
        add_to_inv: "添加到库存",
        prod_name: "产品名称",
        description: "描述",
        cost_price: "成本价 (UGX)",
        wholesale_price: "批发价 (UGX)",
        stock: "库存",
        min_order: "最小定购量",
        category: "类别",
        save: "保存产品",
        update: "更新产品",
        cancel: "取消",
        wholesale: "批发",
        in_stock: "有库存",
        moq: "最小起订量",
        profit: "每单位利润",
        paste_url_placeholder: "粘贴图片网址...",
        press_enter_hint: "按 Enter 键添加链接",
        clear_all: "清除所有",
        drop_here: "拖放到此处",
        drop_click_upload: "拖放或点击上传",
        uploading_wait: "正在上传您的图片，请稍候..."
      },
      common: {
        search: "搜索产品...",
        cart: "购物车",
        profile: "个人资料",
        logout: "登出",
        loading: "加载中...",
        no_deals: "暂无批发优惠。"
      }
    }
  },
  sw: {
    translation: {
      nav: {
        home: "Nyumbani",
        products: "Bidhaa",
        categories: "Makundi",
        shops: "Maduka ya Jumla",
        about: "Kuhusu Sisi",
        contact: "Wasiliana",
        dashboard: "Dashibodi",
        login: "Ingia",
        register: "Jisajili"
      },
      auth: {
        welcome_back: "Karibu Tena",
        subtitle: "Ingia kwenye akaunti yako ya HAM Grounds",
        email_addr: "Barua Pepe",
        password: "Nywila",
        forgot: "Umesahau?",
        signin: "Ingia",
        signing_in: "Unangia...",
        no_account: "Huna akaunti?",
        join_marketplace: "Jiunge na HAM Grounds",
        terms_agree: "Kwa kuingia, unakubali Sheria na Masharti yetu. Wafanyabiashara wanathibitishwa kwa usalama wa soko.",
        fullname: "Jina Kamili",
        phone: "Namba ya Simu",
        whatsapp: "Namba ya WhatsApp",
        biz_name: "Jina la Biashara",
        shop_no: "Namba ya Duka",
        block: "Bloku",
        create_account: "Fungua Akaunti",
        joining_as: "Jiunge na soko kama",
        register_now: "Jisajili Sasa",
        already_have: "Tayari una akaunti?",
        enter_fullname: "Weka jina lako kamili",
        enter_email: "jina@barua.com",
        enter_password: "••••••••",
        errors: {
          invalid_email: "Anwani ya barua pepe haina mpangilio mzuri.",
          user_disabled: "Akaunti hii ya mtumiaji imezimwa.",
          invalid_credential: "Barua pepe au nywila isiyo sahihi.",
          email_already_in_use: "Anwani ya barua pepe tayari inatumiwa na akaunti nyingine.",
          weak_password: "Nywila ni dhaifu sana. Lazima iwe na angalau herufi 6.",
          operation_not_allowed: "Akaunti za barua pepe/nywila hazijaruhusiwa. Tafadhali wasiliana na usaidizi.",
          network_request_failed: "Hitilafu ya mtandao. Tafadhali angalia muunganisho wako wa intaneti.",
          too_many_requests: "Majaribio mengi ya kuingia yameshindwa. Tafadhali jaribu tena baadaye.",
          default: "Hitilafu isiyotarajiwa imetokea. Tafadhali jaribu tena."
        }
      },
      hero: {
        title: "Kuza Milki Yako ya Biashara.",
        subtitle: "Nunua mavazi, nguo, na vifaa vya kielektroniki moja kwa moja kutoka kwa wauzaji wa jumla waliothibitishwa katika Ham Grounds. Dhibiti hisa zako na rekodi kidijitali.",
        cta_buy: "Vinjari Bidhaa",
        cta_sell: "Kuwa Muuzaji wa Jumla",
        badge: "Mauzo ya Jumla ya Mavazi, Elektroniki na Nyumbani"
      },
      home: {
        categories: {
          title: "Gundua Makundi",
          subtitle: "Pata unachohitaji kutoka kwa wauzaji wetu wa jumla waliothibitishwa",
          view_all: "Ona Zote"
        },
        trending: {
          title: "Zinazovuma kwa Jumla",
          subtitle: "Mikataba ya jumla inayokwenda haraka sasa mjini Kampala",
          view_all: "Ona Ofa Zote"
        },
        why: {
          title: "Kuweka Biashara Kidijitali nchini Uganda",
          subtitle: "Ham Grounds si soko tu; ni zana ya ukuaji wa biashara.",
          trusted_title: "Wauzaji Waliothibitishwa",
          trusted_desc: "Kila muuzaji wa jumla anathibitishwa kabla ya kuorodheshwa.",
          logistic_title: "Usafirishaji wa Mizigo",
          logistic_desc: "Chaguo jumuishi za utoaji kwa maagizo ya kiasi kikubwa.",
          inventory_title: "Hesabu ya Kidijitali",
          inventory_desc: "Wauzaji hupata rekodi ya kidijitali kufuatilia kila mauzo moja kwa moja."
        },
        stats: {
          wholesalers: "Wauzaji wa Jumla",
          products: "Bidhaa",
          orders: "Maagizo ya Mwezi",
          traded: "Thamani (UGX)"
        }
      },
      footer: {
        about_text: "Soko kuu la jumla nchini Uganda linalounganisha wafanyabiashara moja kwa moja na wauzaji wa jumla. Kuboresha biashara kupitia rekodi za kidijitali.",
        quick_links: "Viungo vya Haraka",
        support: "Msaada",
        contact: "Wasiliana nasi",
        all_rights: "Haki zote zimehifadhiwa.",
        made_by: "Imeundwa na KASUMBA TREASURE"
      },
      sidebar: {
        buyer_hub: "Kitovu cha Mnunuzi",
        seller_panel: "Jopo la Muuzaji",
        profile: "Wasifu Wangu",
        orders: "Maagizo Yangu",
        favorites: "Mapendeleo",
        inquiries: "Maswali",
        history: "Historia ya ununuzi",
        dashboard: "Dashibodi",
        inventory: "Bidhaa",
        manage_orders: "Dhibiti Maagizo",
        ledger: "Ripoti ya Mauzo",
        analytics: "Takwimu za Ukuaji",
        business_profile: "Wasifu wa Biashara"
      },
      common: {
        search: "Tafuta bidhaa...",
        cart: "Kikapu",
        profile: "Wasifu",
        logout: "Ondoka",
        loading: "Inapakia...",
        no_deals: "Hakuna ofa za jumla kwa sasa."
      },
      inventory: {
        title: "Bidhaa za Kidijitali",
        subtitle: "Fuatilia viwango vya akiba na udhibiti bei za jumla.",
        add_product: "Ongeza Bidhaa Mpya",
        search_placeholder: "Tafuta bidhaa...",
        edit_product: "Hariri Bidhaa",
        add_to_inv: "Ongeza kwenye Bidhaa",
        prod_name: "Jina la Bidhaa",
        description: "Maelezo",
        cost_price: "Bei ya Gharama (UGX)",
        wholesale_price: "Bei ya Jumla (UGX)",
        stock: "Akiba",
        min_order: "Agizo la Chini",
        category: "Kategoria",
        save: "Hifadhi Bidhaa",
        update: "Sasisha Bidhaa",
        cancel: "Ghairi",
        wholesale: "Jumla",
        in_stock: "Ipo",
        moq: "MOQ",
        profit: "Faida/Bidhaa",
        paste_url_placeholder: "Bandika URL ya Picha...",
        press_enter_hint: "Bonyeza Enter ili kuongeza kiungo",
        clear_all: "Futa Zote",
        drop_here: "Dondosha hapa",
        drop_click_upload: "Dondosha au Bonyeza ili Kupakia",
        uploading_wait: "Tunapakia picha zako, tafadhali subiri..."
      }
    }
  },
  lg: {
    translation: {
      nav: {
        home: "Omutwe",
        products: "Ebyamaguzi",
        categories: "Ebika",
        shops: "Amaduuka",
        about: "Ebitukwatako",
        contact: "Tukubeemu",
        dashboard: "Ddashibodi",
        login: "Yingira",
        register: "Wewandiise"
      },
      auth: {
        welcome_back: "Kulika okudaayo",
        subtitle: "Yingira mu akawunti yo eya HAM Grounds",
        email_addr: "Email yo",
        password: "Ekisumuluzo",
        forgot: "Oweridde?",
        signin: "Yingira",
        signing_in: "Bikyayingira...",
        no_account: "Tolina akawunti?",
        join_marketplace: "Jiunge ne HAM Grounds",
        terms_agree: "Bw'oyingira, okukkiriza amateeka n'ebiragiro byaffe. Abasuubuzi bakaasibwa lwa bukuumi bwa katale.",
        fullname: "Amanya Ggo",
        phone: "Enamba y'Essimu",
        whatsapp: "Enamba ya WhatsApp",
        biz_name: "Amanya g'Obusuubuzi",
        shop_no: "Enamba ya Duuka",
        block: "Bloku/Poloti",
        create_account: "Wandiika Akawunti",
        joining_as: "Jiunge ne katale nga",
        register_now: "Wewandiise Kati",
        already_have: "Oli muntu waffe dda?",
        enter_fullname: "Wandiika amanya go goona",
        enter_email: "erinya@email.com",
        enter_password: "••••••••",
        errors: {
          invalid_email: "Email yo ewandiikiddwa bubi.",
          user_disabled: "Akawunti eno yaggyibwako obuyinza.",
          invalid_credential: "Email oba ekisumuluzo bikonnye.",
          email_already_in_use: "Email eno eyina muntu mulala agikozesa.",
          weak_password: "Ekisumuluzo ky'olondodde kinafu nnyo.",
          operation_not_allowed: "Okukozesa email n'ekisumuluzo tekukkirizibwa.",
          network_request_failed: "Network efudde. Geraako okukola ku mpewo yo.",
          too_many_requests: "Ogezezzaako nnyo okuyingira ne bigaana. Linda kaseera addemu.",
          default: "Wabaddewo kiremya. Geraako nate."
        }
      },
      hero: {
        title: "Gazi Obwakabaka bwo obw'Obusuubuzi.",
        subtitle: "Gula emyenda, ebiwenda, n'ebyuma ebikozesa amasannyalaze butereevu okuva ku basiibi abakakasiddwa ku Ham Grounds. Kuuma ebitabo byo ne sitooko yo mu ngeri ey'ekidigital.",
        cta_buy: "Noonya ebyamaguzi",
        cta_sell: "Fuuka Omusiibi we Byamaguzi",
        badge: "Ebyemisono, Eby'amasannyalaze n'Eby'awaka eby'omungi"
      },
      home: {
        categories: {
          title: "Zuula Ebika",
          subtitle: "Noonya ky'oyagala okuva ku basiibi baffe abakakasiddwa",
          view_all: "Laba Ebika Byonna"
        },
        trending: {
          title: "Ebikyasinze okuyita",
          subtitle: "Ebyamaguzi ebikaasi mu Kampala mu kaseera kano",
          view_all: "Laba Emikutu Gyonna"
        },
        why: {
          title: "Okuteeka Obusuubuzi ku Digito mu Uganda",
          subtitle: "Ham Grounds si katale buguzi bwokka; kyakuyamba kukula mbeera yo ey'obusuubuzi.",
          trusted_title: "Abatunzi Abakakasiddwa",
          trusted_desc: "Buli musiibi asooka kukakasibwa ng'asobola okuteekayo ebyamaguzi bye. Tewali mabbuli.",
          logistic_title: "Okutambuza eby'amungi",
          logistic_desc: "Ebika by'okutambuza ebyamaguzi ebisingako obunene.",
          inventory_title: "Sitooko ya Digito",
          inventory_desc: "Abatunzi bafuna Ledger ya digito okusobola okubala buli kintu kye batunze butereevu."
        },
        stats: {
          wholesalers: "Abatunzi b'Ebyamungi",
          products: "Ebyamaguzi",
          orders: "Oda buli Mweezi",
          traded: "Ssente (UGX)"
        }
      },
      footer: {
        about_text: "Akatale k'ebyamaguzi eby'omungi akasoose mu Uganda akagatta abasuubuzi butereevu n'abatunzi b'ebyamaguzi eby'omungi. Okutumbula obusuubuzi nga tuteeka buli kintu ku digito.",
        quick_links: "Obulambuzi",
        support: "Okuyambibwa",
        contact: "Tukubeemu",
        all_rights: "Ebikubiddwaamu byonna bikuumiddwa.",
        made_by: "Kyatungibwa KASUMBA TREASURE"
      },
      sidebar: {
        buyer_hub: "Kifo ky'Omuguzi",
        seller_panel: "Kifo ky'Omusiibi",
        profile: "Ppulofayiro yange",
        orders: "Oda zange",
        favorites: "Bye njagala",
        inquiries: "Okubuuza",
        history: "Ebisiraale ebyayita",
        dashboard: "Ddashibodi",
        inventory: "Sitoooko",
        manage_orders: "Kola ku mbagula",
        ledger: "Ebitabo by'omutunzi",
        analytics: "Okukula kw'omulimu",
        business_profile: "Ppulofayiro y'omulimu"
      },
      products: {
        title: "Akatale k'eByamaguzi",
        subtitle: "Zuula ebyamaguzi butereevu okuva ku basiibi ba HAM GROUNDS.",
        filters: "Sunsula",
        search_placeholder: "Noonya ebyamaguzi, ebika, oba abatunzi...",
        no_found_title: "Tewali kyakulaba",
        no_found_desc: "Gezaako okukyusa mu kye noonya oba mu birabirwa.",
        load_more: "Laba ebilala",
        filtered_by: "Kiraze mu:"
      },
      inventory: {
        title: "Sitooko ya Digito",
        subtitle: "Laba sitooko yo n'obuwanguzi bw'okutunda.",
        add_product: "Gattako ekyamaguzi",
        search_placeholder: "Noonya mu sitooko...",
        edit_product: "Kyusaamu ekyamaguzi",
        add_to_inv: "Teeka mu sitooko",
        prod_name: "Erinnya ly'ekyamaguzi",
        description: "Obulonzi",
        cost_price: "Omuwendo gwe wakigulira (UGX)",
        wholesale_price: "Omuwendo gw'otunda mu bungi (UGX)",
        stock: "Sitooko",
        min_order: "MOQ (Omuwendo omuto)",
        category: "Ekika",
        save: "Teeka mu mitala",
        update: "Teekawo ebipya",
        cancel: "Sazaamu",
        wholesale: "Omuwendo gw'omungi",
        in_stock: "Kisigadde mu sitooko",
        moq: "Omuwendo omuto otunda",
        profit: "Magoba/Unit",
        paste_url_placeholder: "Teekawo linki y'ekifananyi...",
        press_enter_hint: "Nyiga Enter okugattako linki",
        clear_all: "Ziggyemu Zonna",
        drop_here: "Biteeke wano",
        drop_click_upload: "Bikasuke wano oba nyiga okuteekayo",
        uploading_wait: "Tukiteeka ku mpewo, linda kaseera..."
      },
      common: {
        search: "Noonya ebyamaguzi...",
        cart: "Ekisero ky'Obuguzi",
        profile: "Ppulofayiro",
        logout: "Ffuluma",
        loading: "Bikyali mu kkubo...",
        no_deals: "Tewali byamaguzi by'omungi mu kaseera kano."
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
