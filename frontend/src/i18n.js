import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: { 
      en: {
        translation: {
          "navbar": {
            "brand": "Wahret Zmen"
          },
          home: "Home",
          products: "Products",
          "about-menu": "About",
          "contact-menu": "Contact",
          "admin_dashboard":"admin dashboard",

          search_input: {
            placeholder: "Search for products..."
          },
          dashboard: "Dashboard",
          orders: "Orders",
          logout: "Logout",
          select_category: "Select Category",
          categories: {
            all: "All",
            men: "Men",
            women: "Women",
            children: "Children",
          },
          product_filters: {
            label: "Select Products",
            men: "Men",
            women: "Women",
            children: "Children",
            all: "All",
          },


         Welcome_Banner_title: "Welcome to Wahret Zmen",
         banner_img_alt: "Wahret Zmen traditional banner",


          news: {
            section_title: "Latest News",
            items: [
              {
                title: "Wahret Zmen by Sabri: A Boutique of Traditional Tunisian Elegance",
                description: "Wahret Zmen by Sabri is a boutique specializing in traditional Tunisian clothing, especially handmade garments with intricate silk embroidery."
              },
              {
                title: "Discover the Essence of Tunisian Tradition",
                description: "For lovers of authentic Tunisian fashion, Wahret Zmen by Sabri is a destination where tradition meets creativity!"
              },
              {
                title: "New Space Mission Aims to Explore Distant Galaxies",
                description: "For lovers of authentic Tunisian fashion, Wahret Zmen by Sabri is a destination where tradition meets creativity!"
              }
            ]
          },

                   
          
         footer: {
        brand: "Wahret Zmen",
        description: "Explore our traditional Tunisian clothing, crafted with passion and authenticity.",
        quickLinks: "Quick Links",
        home: "Home",
        products: "Products",
        about: "About Us",
        contact: "Contact",
        contactUs: "Contact Us",
        location: "Souk Essouf, Tunis",
        followUs: "Follow Us",
        rights: "All rights reserved.",
      },

          
      // ✅ NEW: Register
      register: {
        create_account: "Create Your Account",
        email_label: "Email Address",
        email_placeholder: "Enter your email",
        email_required: "Email is required.",
        password_label: "Password",
        password_placeholder: "Enter your password",
        password_required: "Password is required.",
        register_btn: "Register",
        have_account: "Already have an account?",
        login_link: "Login",
        google_btn: "Sign up with Google",
        success_title: "Registration Successful!",
        success_text: "Welcome to Wahret Zmen Boutique.",
        error_title: "Registration Failed",
        error_text: "Please provide a valid email and password.",
        google_success_title: "Google Registration Successful!",
        google_error_title: "Google Sign-In Failed",
        continue_shopping: "Continue Shopping",
        try_again: "Try Again",
        rights: "All rights reserved."
      },

      // ✅ NEW: Login
      login: {
        title: "Welcome Back",
        email_label: "Email Address",
        email_placeholder: "Enter your email",
        email_required: "Email is required.",
        password_label: "Password",
        password_placeholder: "Enter your password",
        password_required: "Password is required.",
        login_btn: "Login",
        no_account: "Don't have an account?",
        register_link: "Register",
        google_btn: "Sign in with Google",
        success_title: "Welcome Back!",
        success_text: "You have successfully logged in.",
        error_title: "Login Failed",
        error_text: "Please provide a valid email and password.",
        google_success_title: "Google Login Successful!",
        google_error_title: "Google Sign-In Failed",
        continue_shopping: "Continue Shopping",
        try_again: "Try Again",
        rights: "All rights reserved."
      },

      admin: {
        title: "Admin Dashboard Login",
        username_label: "Username",
        username_placeholder: "Enter your username",
        username_required: "Username is required.",
        password_label: "Password",
        password_placeholder: "Enter your password",
        password_required: "Password is required.",
        login_btn: "Login",
        success_title: "Admin Login Successful!",
        success_text: "Welcome to your dashboard.",
        error_title: "Login Failed",
        error_text: "Please provide a valid username and password.",
        session_expired_title: "Session Expired",
        session_expired_text: "Please login again.",
        enter_dashboard: "Enter Dashboard",
        try_again: "Try Again",
        rights: "All rights reserved."
      },
      

      userDashboard: {
        title: "My Dashboard - Wahret Zmen",
        welcome: "Welcome, {{name}}!",
        overview: "Here is an overview of your recent orders.",
        yourOrders: "Your Orders",
        orderId: "Order ID",
        total: "Total Price",
        orderedProducts: "Ordered Products",
        quantity: "Quantity",
        color: "Color",
        original: "Original",
        noTitle: "Untitled Product",
        noOrders: "You have no recent orders.",
        defaultUser: "User"
      },

          ordersPage: {
            title: "My Orders",
            yourOrders: "Your Orders",
            noOrders: "No orders found!",
            orderNumber: "Order #",
            orderId: "Order ID",
            name: "Name",
            email: "Email",
            phone: "Phone",
            total: "Total Price",
            orderedProducts: "Ordered Products:",
            quantity: "Quantity",
            color: "Color",
            original: "Original Product",
            noTitle: "No Title",
            removeProduct: "Remove Product",
            deleteOrder: "Delete Order",
            deleting: "Deleting...",
            pleaseLogin: "Please log in to view your orders.",
            confirmDeleteTitle: "Are you sure?",
            confirmDeleteText: "This action cannot be undone. Your order will be permanently deleted.",
            confirmDeleteBtn: "Yes, delete it!",
            deleted: "Deleted!",
            orderDeleted: "Your order has been deleted.",
            error: "Error",
            orderDeleteFailed: "Failed to delete order. Please try again.",
            removeQuantityTitle: "Remove Quantity",
            removeQuantityLabel: "You have {{max}} in your order. Enter quantity to remove:",
            removeBtn: "Remove",
            cancelBtn: "Cancel",
            removed: "Removed!",
            productRemoved: "{{qty}} item(s) removed from order.",
            productRemoveFailed: "Failed to remove product. Please try again."
          },

          cart: {
            title: "Cart",
            clear_cart: "Clear Cart",
            category: "Category",
            color: "Color",
            original: "Original",
            qty: "Qty",
            remove: "Remove",
            empty: "Your cart is empty!",
            subtotal: "Subtotal",
            proceed_to_checkout: "Proceed to Checkout"
          },
          checkout: {
            title: "Secure Checkout",
            payment_method: "Cash On Delivery",
            total_price: "Total Price:",
            items: "Items",
            personal_details: "Personal Details",
            full_name: "Full Name",
            email: "Email Address",
            phone: "Phone Number",
            shipping_address: "Shipping Address",
            address: "Address / Street",
            city: "City",
            country: "Country",
            state: "State",
            zipcode: "Zipcode",
            agree: "I agree to the",
            terms: "Terms & Conditions",
            policy: "Shopping Policy",
            and: "and",
            place_order: "Place an Order",
            processing: "Processing your order...",
            order_confirmed: "Order Confirmed",
            success_message: "Your order was placed successfully!",
            go_to_orders: "Go to Orders",
            error_title: "Error!",
            error_message: "Failed to place an order"
          },
         
          
        }
      },
        
      fr: {
        translation: {
          "navbar": {
            "brand": "Wahret Zmen"
          },
          home: "Accueil",
    products: "Produits",
    "about-menu": "À propos",  // ✅ as you asked
    "contact-menu": "Contactez-nous",  // ✅ as you asked
    "admin_dashboard":"Tableau de bord",
          search_input: {
            placeholder: "Rechercher des produits...",

            
            
          },
          dashboard: "Tableau de bord",
          orders: "Commandes",
          logout: "Se déconnecter",
          select_category: "Sélectionner une catégorie",
          categories: {
            all: "Tous",
            men: "Hommes",
            women: "Femmes",
            children: "Enfants",
          },
          product_filters: {
            label: "Sélectionner les produits", // French translation of the label
            men: "Hommes",
            women: "Femmes",
            children: "Enfants",
            "all": "Tous",  // French translation for "All"
},
          loading: {
  brand_loading: "Wahret Zmen..."
},

          home_title: "Wahret Zmen - Vêtements traditionnels et nos vendeurs",
          home_meta_description: "Bienvenue chez Wahret Zmen, explorez notre collection de vêtements traditionnels, nos nouveautés et les dernières tendances.",
          home_intro_html: "Bienvenue à la <strong>Boutique Wahret Zmen</strong>, où la tradition rencontre l'élégance. Explorez nos vêtements faits main, inspirés du riche patrimoine culturel tunisien. Découvrez une mode intemporelle mêlant histoire et raffinement moderne.",
          home_banner_text: "Entrez dans la tradition avec élégance. La boutique Wahret Zmen vous propose une collection intemporelle de tenues tunisiennes authentiques, confectionnées avec passion et héritage.",
          our_collections: "Nos Collections",
          our_collections_intro: "Découvrez notre collection de vêtements traditionnels, confectionnés avec soin et authenticité culturelle. Des Kaftans élégants aux Jebbas classiques, explorez la beauté du patrimoine dans chaque pièce.",
          latest_news: "Actualités & Tendances",
          latest_news_intro: "Restez informé des nouveautés de Wahret Zmen ! Découvrez nos nouvelles collections, conseils mode, et offres exclusives qui font vivre la tradition dans un monde moderne.",
          banner_img_alt: "Vêtements traditionnels tunisiens",
          banner_title: "Wahret Zmen par Sabri – Préserver l'héritage tunisien avec élégance",
          banner_description: "Wahret Zmen est une boutique unique de vêtements traditionnels tunisiens située à El Aswak, Tunis, rue Essouf. La boutique propose une sélection soignée de vêtements tunisiens authentiques, dont la célèbre Jebba, réputée pour son artisanat raffiné et sa valeur culturelle.",
          discover_now: "Découvrir maintenant",
          wahret_zmen_collection: "Collection Wahret Zmen",
          no_products_found: "Aucun produit trouvé.",
          our_sellers_intro_html: "Découvrez notre collection de vêtements traditionnels, confectionnés avec soin et authenticité culturelle. Des <strong>Caftans</strong> élégants aux <strong>Jebbas</strong> classiques, explorez la beauté du patrimoine dans chaque pièce.",

          load_more: "Charger plus",
          products_page: {
            title: "Collection Wahret Zmen",
            overview: "Chez Wahret Zmen, nous préservons l’essence de l’artisanat tunisien en mêlant techniques classiques et raffinement moderne. Que vous cherchiez une pièce luxueuse ou une tenue intemporelle, notre collection célèbre la beauté de la tradition."
          },

         

          

         



          stock: "Stock",
          out_of_stock: "Rupture de stock",
          trending: "Tendance",
          color: "Couleur",
          quantity: "Qté",
          add_to_cart: "Ajouter au panier",
          unknown_product: "Produit inconnu",
          category: "Catégorie",
          published: "Publié le",
          unknown: "Inconnu",
          no_description: "Aucune description disponible.",
          select_color: "Choisir une couleur",
          selected: "Sélectionné",
          default: "Défaut",
          available_colors: "Couleurs disponibles",

          news: {
            section_title: "Actualités",
            items: [
              {
                title: "Wahret Zmen par Sabri : Une boutique d'élégance tunisienne traditionnelle",
                description: "Wahret Zmen par Sabri est une boutique spécialisée dans les vêtements traditionnels tunisiens, notamment les vêtements faits main avec des broderies délicates en fil de soie."
              },
              {
                title: "Découvrez l'essence de la tradition tunisienne",
                description: "Pour les amateurs de mode tunisienne authentique, Wahret Zmen par Sabri est une destination où la tradition rencontre la créativité !"
              },
              {
                title: "Nouvelle mission spatiale visant à explorer des galaxies lointaines",
                description: "Pour les amateurs de mode tunisienne authentique, Wahret Zmen par Sabri est une destination où la tradition rencontre la créativité !"
              }
            ]
          },


          footer: {
            brand: "Wahret Zmen",
            description: "Découvrez nos vêtements traditionnels tunisiens, fabriqués avec passion et authenticité.",
            quickLinks: "Liens Rapides",
            home: "Accueil",
            products: "Produits",
            about: "À Propos",
            contact: "Contact",
            contactUs: "Nous Contacter",
            location: "Tunis, Tunisie",
            followUs: "Suivez-nous",
            rights: "Tous droits réservés.",
          },


          search_input: {
            placeholder: "Rechercher des produits..."  // French
          },

         
          Welcome_Banner_title: "Bienvenue à Wahret Zmen",
          banner_img_alt: "Bannière de vêtements traditionnels Wahret Zmen",
          


          register: {
            create_account: "Créer un compte",
            email_label: "Adresse e-mail",
            email_placeholder: "Entrez votre e-mail",
            email_required: "L'e-mail est requis.",
            password_label: "Mot de passe",
            password_placeholder: "Entrez votre mot de passe",
            password_required: "Le mot de passe est requis.",
            register_btn: "S'inscrire",
            have_account: "Vous avez déjà un compte ?",
            login_link: "Se connecter",
            google_btn: "S'inscrire avec Google",
            success_title: "Inscription réussie !",
            success_text: "Bienvenue dans la boutique Wahret Zmen.",
            error_title: "Échec de l'inscription",
            error_text: "Veuillez fournir un e-mail et un mot de passe valides.",
            google_success_title: "Inscription Google réussie !",
            google_error_title: "Échec de la connexion Google",
            continue_shopping: "Continuer vos achats",
            try_again: "Réessayer",
            rights: "Tous droits réservés."
          },
    
          login: {
            title: "Bon retour",
            email_label: "Adresse e-mail",
            email_placeholder: "Entrez votre e-mail",
            email_required: "L'e-mail est requis.",
            password_label: "Mot de passe",
            password_placeholder: "Entrez votre mot de passe",
            password_required: "Le mot de passe est requis.",
            login_btn: "Se connecter",
            no_account: "Vous n'avez pas de compte ?",
            register_link: "S'inscrire",
            google_btn: "Connexion avec Google",
            success_title: "Bon retour !",
            success_text: "Connexion réussie.",
            error_title: "Échec de la connexion",
            error_text: "Veuillez fournir un e-mail et un mot de passe valides.",
            google_success_title: "Connexion Google réussie !",
            google_error_title: "Échec de la connexion Google",
            continue_shopping: "Continuer vos achats",
            try_again: "Réessayer",
            rights: "Tous droits réservés."
          },

          admin: {
            title: "Connexion Administrateur",
            username_label: "Nom d'utilisateur",
            username_placeholder: "Entrez votre nom d'utilisateur",
            username_required: "Le nom d'utilisateur est requis.",
            password_label: "Mot de passe",
            password_placeholder: "Entrez votre mot de passe",
            password_required: "Le mot de passe est requis.",
            login_btn: "Se connecter",
            success_title: "Connexion administrateur réussie !",
            success_text: "Bienvenue sur votre tableau de bord.",
            error_title: "Échec de la connexion",
            error_text: "Veuillez fournir un nom d'utilisateur et un mot de passe valides.",
            session_expired_title: "Session expirée",
            session_expired_text: "Veuillez vous reconnecter.",
            enter_dashboard: "Accéder au tableau de bord",
            try_again: "Réessayer",
            rights: "Tous droits réservés." 
          },
          
         userDashboard: {
  title: "Mon tableau de bord - Wahret Zmen",
  welcome: "Bienvenue, {{name}} !",
  overview: "Voici un aperçu de vos commandes récentes.",
  yourOrders: "Vos commandes",
  orderId: "ID de commande",
  total: "Prix total",
  orderedProducts: "Produits commandés",
  quantity: "Quantité",
  color: "Couleur",
  original: "Original",
  noTitle: "Produit sans titre",
  noOrders: "Vous n'avez aucune commande récente.",
  defaultUser: "Utilisateur"
},


          ordersPage: {
            title: "Mes commandes",
            yourOrders: "Vos commandes",
            pleaseLogin: "Veuillez vous connecter pour voir vos commandes.",
            noOrders: "Vous n'avez aucune commande pour le moment.",
            orderNumber: "Commande n°",
            orderId: "ID de commande",
            name: "Nom",
            email: "Email",
            phone: "Téléphone",
            total: "Prix total",
            orderedProducts: "Produits commandés",
            quantity: "Quantité",
            color: "Couleur",
            original: "Original",
            noTitle: "Produit sans titre",
            removeProduct: "Supprimer le produit",
            deleting: "Suppression...",
            deleteOrder: "Supprimer la commande",
            confirmDeleteTitle: "Êtes-vous sûr(e) ?",
            confirmDeleteText: "Cette action est irréversible. Votre commande sera définitivement supprimée.",
            confirmDeleteBtn: "Oui, supprimer !",
            deleted: "Supprimée !",
            orderDeleted: "Votre commande a été supprimée avec succès.",
            error: "Erreur",
            orderDeleteFailed: "Échec de la suppression de la commande. Veuillez réessayer.",
            removeQuantityTitle: "Supprimer une quantité",
            removeQuantityLabel: "Vous avez {{max}} dans votre commande. Entrez la quantité à supprimer :",
            removeBtn: "Supprimer",
            cancelBtn: "Annuler",
            removed: "Quantité supprimée !",
            productRemoved: "{{qty}} produit(s) supprimé(s) de votre commande.",
            productRemoveFailed: "Échec de la suppression du produit. Veuillez réessayer."
          },
          


         
          cart: {
            title: "Panier",
            clear_cart: "Vider le panier",
            category: "Catégorie",
            color: "Couleur",
            original: "Original",
            qty: "Qté",
            remove: "Supprimer",
            empty: "Votre panier est vide !",
            subtotal: "Sous-total",
            proceed_to_checkout: "Passer à la caisse"
          },
          
          checkout: {
            title: "Paiement sécurisé",
            payment_method: "Paiement à la livraison",
            total_price: "Prix total:",
            items: "Articles",
            personal_details: "Informations personnelles",
            full_name: "Nom complet",
            email: "Adresse e-mail",
            phone: "Numéro de téléphone",
            shipping_address: "Adresse de livraison",
            address: "Adresse / Rue",
            city: "Ville",
            country: "Pays",
            state: "Région",
            zipcode: "Code postal",
            agree: "J'accepte les",
            terms: "Conditions générales",
            policy: "Conditions d'achat",
            and: "et",
            place_order: "Passer la commande",
            processing: "Traitement de votre commande...",
            order_confirmed: "Commande confirmée",
            success_message: "Votre commande a été passée avec succès!",
            go_to_orders: "Voir les commandes",
            error_title: "Erreur!",
            error_message: "Échec de la commande"
          },
          about: {
            title: "À propos de nous",
            description: "Jebba tunisienne authentique, brodée à la main avec une touche traditionnelle et une vision moderne en soie naturelle.",
            mission_title: "Notre mission",
            mission_text1: "Une jebba du cœur de la médina de Tunis, confectionnée par des mains tunisiennes – du producteur au consommateur.",
            mission_text2: "Tout ce qui est authentique est une fierté pour l’artisanat tunisien. Nous faisons tout notre possible pour préserver ce métier noble : la fabrication du vêtement traditionnel.",
            crafted_title: "Nos produits",
            crafted_text1: "Jebba, farmla, serwal arbi, barnous, balgha, kantra, mentane, chapelet d’ambre…",
            crafted_text2: "Tous ces produits sont réalisés par des artisans spécialisés dans l’art ancien revisité avec une touche contemporaine.",
            behind_title: "Au cœur de la Médina",
            behind_text: "Nous sommes situés au cœur de la Médina de Tunis, près de la Mosquée Zitouna, Hammam El Kachachine, Café El Khattab, Café El Anba, et l’Association Coranique.",
            join_title: "Rejoignez l'héritage",
            join_text1: "Chaque pièce reflète l’histoire et l’identité tunisienne.",
            join_text2: "Découvrez l’élégance authentique avec une touche moderne de Wahret Zmen."
          },
          

          "contact": {
  "page_title": "Contactez-nous",
  "heading": "Contactez-nous",
  "subtitle": "N'hésitez pas à nous contacter pour toute demande.",
  "address_label": "Adresse",
  "address_value": "Souk Essouf, Tunis",
  "email_label": "Email",
  "phone_label": "Téléphone",
  "title": "Contactez la boutique Wahret Zmen",
  "description": "Des questions sur notre collection de vêtements traditionnels ? Vous recherchez un design personnalisé ou une commande spéciale ? Remplissez le formulaire ci-dessous et notre équipe vous répondra dès que possible.",
  "name_placeholder": "Votre nom",
  "email_placeholder": "Votre e-mail",
  "subject_placeholder": "Sujet",
  "message_placeholder": "Votre message",
  "send_message": "Envoyer le message",
  "sending": "Envoi...",
  "success_message": "Message envoyé avec succès !",
  "error_message": "Échec de l'envoi du message. Réessayez plus tard."
}
          

          
        }
      },
      
      ar: {
        translation: {
          navbar: {

            brand: "وهرة الزّمان", // Logo text

                      },
          home: "الرئيسية",
          products: "المنتجات",
          "about-menu": "من نحن",
          "contact-menu": "اتصل بنا",
          dashboard: "لوحة التحكم",
          "admin_dashboard":"لوحة التّحكّم المدير",
          orders: "الطلبات",
          logout: "تسجيل الخروج",

          
          Welcome_Banner_title: "مرحبًا بكم في وهرة الزّمان",
          banner_img_alt: "لافتة وهرة الزّمان التقليدية",

          loading: {
  brand_loading: "وهرة الزّمان..."
},


          select_category: "اختر الفئة",
          categories: {
          all: "الكل",
          men: "رجال",
          women: "نساء",
         children: "أطفال",
         },
         product_filters: {
         label: "اختر المنتجات", 
         men: "رجال",
         women: "نساء",
         children: "أطفال",
         all: "الكل",
         },

         

      
          search_input: {

            placeholder: "ابحث عن المنتجات..."

                  },
          
      
          footer: {

            brand: "وهرة الزّمان",
            description: "ملابس تقليدية تونسية تجمع بين التراث والأناقة العصرية. موقعنا: سوق السوف، تونس.",

            brand: "وهرة الزّمان",
            description: " ملابس تقليدية تونسية تجمع بين التراث والأناقة العصرية. موقعنا: سوق السوف، تونس",
            quickLinks: "روابط سريعة",
            home: "الرئيسية",
            products: "المنتجات",
            about: "من نحن",
            contact: "اتصل بنا",
            contactUs: "اتصل بنا",
            location: "سوق السوف، تونس",
            followUs: "تابعونا",

            rights: "جميع الحقوق محفوظة.",
          },

          home_title: "وهرة الزّمان - الملابس التقليدية وبائعونا",
          home_meta_description: "مرحبًا بكم في وهرة الزّمان، استكشفوا مجموعتنا من الملابس التقليدية، والوافدات الجديدة، وآخر صيحات الموضة.",
          home_intro_html: "مرحبًا بكم في <strong>بوتيك وهرة الزّمان</strong>، حيث تلتقي التقاليد بالأناقة. اكتشفوا ملابسنا المصنوعة يدويًا، المستوحاة من التراث الثقافي التونسي الغني. عيشوا تجربة أزياء خالدة تمزج بين التاريخ والرقي الحديث.",
          home_banner_text: "خطوة نحو التقاليد بأناقة. بوتيك وهرة الزّمان يقدم لكم مجموعة خالدة من الأزياء التونسية الأصيلة، مصنوعة بشغف وإرث.",
          our_collections: "مجموعاتنا",
          our_collections_intro: "استكشفوا مجموعتنا من الملابس التقليدية المصنوعة بعناية وأصالة ثقافية. من القفاطين الأنيقة إلى الجباب التقليدية، اكتشفوا جمال التراث في كل قطعة.",
          latest_news: "آخر الأخبار والاتجاهات",
          latest_news_intro: "ابقَ على اطلاع بآخر مستجدات وهرة الزّمان! اكتشف مجموعاتنا الجديدة، ونصائح الموضة، والعروض الحصرية التي تحافظ على التقاليد في عالم عصري.",
          banner_img_alt: "الملابس التقليدية التونسية",
          banner_title: "وهرة الزّمان بإدارة صبري – الحفاظ على التراث التونسي بأناقة",
          banner_description: "وهرة الزّمان هي بوتيك فريد من نوعه للملابس التقليدية التونسية يقع في الأسواق، تونس، شارع الصوف. يقدم البوتيك مجموعة مختارة بعناية من الملابس التونسية الأصيلة، بما في ذلك الجبة الشهيرة المعروفة بحرفيتها الدقيقة وقيمتها الثقافية.",
          discover_now: "اكتشف الآن",
          wahret_zmen_collection: "مجموعة وهرة الزّمان",
          load_more: "تحميل المزيد",
          no_products_found: "لم يتم العثور على منتجات.",
          our_sellers_intro_html: "استكشفوا مجموعتنا من الملابس التقليدية المصنوعة بعناية وأصالة ثقافية. من <strong>القفاطين</strong> الأنيقة إلى <strong>الجباب</strong> التقليدية، اكتشفوا جمال التراث في كل قطعة.",

          products_page: {
            title: "مجموعة وهرة الزّمان",
            overview: "في وهرة الزّمان، نحافظ على جوهر الحرفية التونسية من خلال مزج التقنيات التقليدية مع اللمسات العصرية. سواء كنت تبحث عن قطعة فاخرة لمناسبة خاصة أو زيٍّ خالد، فإن مجموعتنا مصممة لتحتفل بجمال التراث."

            
          

         
          },

          
                  
          
        
          stock: "المخزون",
          out_of_stock: "غير متوفر",
          trending: "رائج",
          color: "اللون",
          quantity: "الكمية",
          add_to_cart: "أضف إلى السلة",

          unknown_product: "منتج غير معروف",
          category: "الفئة",
          published: "تاريخ النشر",
          unknown: "غير معروف",

          no_description: "لا يوجد وصف متاح.",

          
          select_color: "اختر اللون",
          selected: "المحدد",
          default: "افتراضي",
          available_colors: "الألوان المتوفرة",

          news: {
            section_title: "آخر الأخبار",
            items: [
              {

                title: "وهرة الزّمان بإدارة صبري: بوتيك للأناقة التونسية التقليدية",
                description: "وهرة الزّمان بإدارة صبري هو بوتيك متخصص في الملابس التقليدية التونسية، وخاصة الملابس المصنوعة يدويًا بتطريزات حريرية دقيقة."
              },
              {
                title: "اكتشف جوهر التقاليد التونسية",
                description: "لعشاق الأزياء التونسية الأصيلة، وهرة الزّمان بإدارة صبري هو وجهة تلتقي فيها التقاليد مع الإبداع!"
              },
              {
                title: "مهمة فضائية جديدة لاستكشاف مجرات بعيدة",
                description: "لعشاق الأزياء التونسية الأصيلة، وهرة الزّمان بإدارة صبري هو وجهة تلتقي فيها التقاليد مع الإبداع!"

              },
              
              
            ]
          },
          

       
          
          register: {
            create_account: "إنشاء حساب جديد",
            email_label: "البريد الإلكتروني",
            email_placeholder: "أدخل بريدك الإلكتروني",

            email_required: "البريد الإلكتروني مطلوب.",
            password_label: "كلمة المرور",
            password_placeholder: "أدخل كلمة المرور",
            password_required: "كلمة المرور مطلوبة.",

            

            register_btn: "تسجيل",
            have_account: "لديك حساب بالفعل؟",
            login_link: "تسجيل الدخول",
            google_btn: "التسجيل باستخدام جوجل",

            success_title: "تم التسجيل بنجاح!",
            success_text: "مرحبًا بك في بوتيك وهرة الزّمان.",
            error_title: "فشل في التسجيل",
            error_text: "يرجى إدخال بريد إلكتروني وكلمة مرور صالحين.",
           
            google_success_title: "تم التسجيل عبر Google بنجاح!",
            google_error_title: "فشل تسجيل الدخول عبر Google",
            continue_shopping: "مواصلة التسوق",
            try_again: "أعد المحاولة",

           

           

          },
    
          login: {
            title: "مرحباً بعودتك",
            email_label: "البريد الإلكتروني",
            email_placeholder: "أدخل بريدك الإلكتروني",

            email_required: "البريد الإلكتروني مطلوب.",
            password_label: "كلمة المرور",
            password_placeholder: "أدخل كلمة المرور",
            password_required: "كلمة المرور مطلوبة.",

            email_required: "البريد الإلكتروني مطلوب",
            password_label: "كلمة المرور",
            password_placeholder: "أدخل كلمة المرور",
            password_required: "كلمة المرور مطلوبة",

            login_btn: "تسجيل الدخول",
            no_account: "ليس لديك حساب؟",
            register_link: "إنشاء حساب",
            google_btn: "تسجيل الدخول باستخدام جوجل",
            success_title: "مرحباً بعودتك!",

            success_text: "تم تسجيل الدخول بنجاح.",
            error_title: "فشل تسجيل الدخول",
            error_text: "يرجى إدخال بريد إلكتروني وكلمة مرور صالحين.",

            success_text: "تم تسجيل الدخول بنجاح",
            error_title: "فشل تسجيل الدخول",
            error_text: "يرجى إدخال بريد إلكتروني وكلمة مرور صالحين",

            google_success_title: "تم تسجيل الدخول عبر Google!",
            google_error_title: "فشل تسجيل الدخول عبر Google",
            continue_shopping: "مواصلة التسوق",
            try_again: "أعد المحاولة",

            

            

          },

          admin: {
            title: "تسجيل دخول المدير",
            username_label: "اسم المستخدم",
            username_placeholder: "أدخل اسم المستخدم",
            username_required: "! اسم المستخدم مطلوب",
            password_label: "كلمة المرور",
            password_placeholder: "أدخل كلمة المرور",
            password_required: " .كلمة المرور مطلوبة",
            login_btn: "تسجيل الدخول",
            success_title: "! تم تسجيل دخول المدير بنجاح",

            success_text: " .مرحبًا بك في لوحة التحكم",
            error_title: "فشل تسجيل الدخول",
            error_text: "يرجى إدخال اسم مستخدم وكلمة مرور صحيحة.",
            session_expired_title: "انتهت الجلسة",
            session_expired_text: "يرجى تسجيل الدخول مرة أخرى.",


            enter_dashboard: "دخول لوحة التحكم",
            try_again: "أعد المحاولة",
            rights: " .جميع الحقوق محفوظة"
          },
          


          userDashboard: {

            title: "لوحة التحكم الخاصة بي - وهرة الزّمان",
            welcome: "! مرحباً، {{name}}",
            overview: "إليك نظرة عامة على طلباتك الأخيرة.",
            yourOrders: "طلباتك",
            orderId: "رقم الطلب",
            total: "السعر الإجمالي",
            orderedProducts: "المنتجات المطلوبة",
            quantity: "الكمية",
            color: "اللون",
            original: "المنتج الأصلي",
            noTitle: "منتج بدون عنوان",

            noOrders: "ليس لديك طلبات حديثة.",

            noOrders: "ليس لديك طلبات حديثة",
            defaultUser: "مستخدم"
          },
          
          

          ordersPage: {
            title: "طلباتي",
            yourOrders: "طلباتك",
            noOrders: "! لا توجد طلبات",
            orderNumber: "الطلب رقم",
            orderId: "رقم الطلب",
            name: "الاسم",
            email: "البريد الإلكتروني",
            phone: "الهاتف",
            total: "السعر الإجمالي",
            orderedProducts: " :المنتجات المطلوبة",
            quantity: "الكمية",
            color: "اللون",
            original: "المنتج الأصلي",
            noTitle: "بدون عنوان",
            removeProduct: "إزالة المنتج",
            deleteOrder: "حذف الطلب",
            deleting: "... جارٍ الحذف ",
            pleaseLogin: "يرجى تسجيل الدخول لعرض طلباتك",
            confirmDeleteTitle: "هل أنت متأكد؟",
            confirmDeleteText: " .يمكن التراجع عن هذا الإجراء. سيتم حذف طلبك نهائيًا",
            confirmDeleteBtn: "نعم، احذفه!",
            deleted: "تم الحذف!",
            orderDeleted: " .تم حذف طلبك",
            error: "خطأ",
            orderDeleteFailed: " .فشل في حذف الطلب. حاول مرة أخرى",
            removeQuantityTitle: "إزالة كمية",
            removeQuantityLabel: " :لديك {{max}} في طلبك. أدخل الكمية المراد إزالتها",
            removeBtn: "إزالة",
            cancelBtn: "إلغاء",
            removed: "تمت الإزالة!",
            productRemoved: " .تمت إزالة {{qty}} عنصر(عناصر) من الطلب",
            productRemoveFailed: " .فشل في إزالة المنتج. حاول مرة أخرى"
          },
          cart: {
            title: "عربة التسوق",
            clear_cart: "تفريغ العربة",
            category: "الفئة",
            color: "اللون",
            original: "أصلي",
            qty: "الكمية",
            remove: "إزالة",
            empty: "عربة التسوق فارغة!",
            subtotal: "المجموع الفرعي",
            proceed_to_checkout: "المتابعة للدفع"
          },
          

          checkout: {
            title: "إتمام الطلب الآمن",
            payment_method: "الدفع عند الاستلام",
            total_price: "السعر الإجمالي:",
            items: "المنتجات",
            personal_details: "المعلومات الشخصية",
            full_name: "الاسم الكامل",
            email: "البريد الإلكتروني",
            phone: "رقم الهاتف",
            shipping_address: "عنوان الشحن",
            address: "العنوان / الشارع",
            city: "المدينة",
            country: "الدولة",
            state: "المنطقة",
            zipcode: "الرمز البريدي",
            agree: "أوافق على",
            terms: "الشروط والأحكام",
            policy: "سياسة الشراء",
            and: "و",
            place_order: "إتمام الطلب",
            processing: "جارٍ معالجة طلبك...",
            order_confirmed: "تم تأكيد الطلب",
            success_message: "تم إرسال طلبك بنجاح!",
            go_to_orders: "عرض الطلبات",
            error_title: "خطأ!",
            error_message: "فشل في إرسال الطلب"
          },  // ✅ ADD COMMA HERE!
          
          about: {

            title: "حول وهرة الزّمان",
            description: "جُبّة تونسيّة أصليّة، بتطريز يدويّ يحمل طابعًا تقليديًّا برؤية عصريّة، مصنوعة من الحرير الطبيعي.",
            mission_title: "مهمتنا",
            mission_text1: "جُبّة من قلب المدينة العتيقة بتونس، بأنامل تونسيّة، من المنتج إلى المستهلك.",
            mission_text2: "كلّ ما هو أصليّ هو فخر للصّناعات التقليديّة التّونسيّة، ونحن نسعى بكلّ جهد للحفاظ على فخر هذه المهنة: صناعة اللّباس التّقليديّ.",
            crafted_title: "منتوجاتنا",
            crafted_text1: "جُبّة، فرملة بدعيّة، صدريّة، سروال عربي، برنوس، بلغة، كنترة، منتان، مسبحة عنبر...",
            crafted_text2: "كلّ هذه المنتوجات تُصنع بأيادٍ مختصّة في كلّ ما هو أصيل وعتيق بروح عصريّة.",
            behind_title: "من قلب المدينة العتيقة",
            behind_text: "نحن نوجد في قلب المدينة العتيقة بتونس، بجوار جامع الزيتونة، حمّام الكشّاشين، مقهى الخطاب، مقهى العنبة، والرابطة القرآنيّة... كلّ هذه الأماكن تحيط بنا وتعكس هويّتنا.",
            join_title: "انضموا إلى إرثنا",
            join_text1: "كل قطعة تُعبّر عن تاريخ تونس وهويّتها.",
            join_text2: "ندعوكم لتجربة الأناقة الأصيلة بلمسة عصريّة من Wahret Zmen."

          },
          
          

          contact: {
            page_title: "اتصل بنا",
            heading: "اتصل بنا",

            subtitle: "لا تتردد في التواصل معنا لأي استفسار.",

            

            address_label: "العنوان",
            address_value: "سوق السوف، تونس",
            email_label: "البريد الإلكتروني",
            phone_label: "الهاتف",

            title: "تواصل مع بوتيك وهرة الزّمان",
            description: "هل لديك أسئلة حول مجموعتنا من الملابس التقليدية؟ تبحث عن تصميم مخصص أو طلب خاص؟ يسعدنا سماعك! املأ النموذج أدناه وسيتواصل معك فريقنا في أقرب وقت ممكن.",

            
            name_placeholder: "اسمك",
            email_placeholder: "بريدك الإلكتروني",
            subject_placeholder: "الموضوع",
            message_placeholder: "رسالتك",
            send_message: "إرسال الرسالة",
            sending: "جارٍ الإرسال...",
            success_message: "تم إرسال الرسالة بنجاح!",

            error_message: "فشل في إرسال الرسالة. حاول مرة أخرى لاحقًا."


          }
          

          
        }
      }
    },
    lng: localStorage.getItem("language") || "ar", // ✅ Arabic as default
    fallbackLng: "ar",
    react: {
      useSuspense: false // ✅ disables React suspense to prevent flashing keys
    },
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"]
    }
  });

export default i18n;







