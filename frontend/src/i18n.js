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
    navbar: { brand: "Wahret Zmen" },
    home: "Accueil",
    products: "Produits",
    "about-menu": "À propos",
    "contact-menu": "Contactez-nous",
    admin_dashboard: "Tableau de bord",

    search_input: { placeholder: "Rechercher des produits..." },

    dashboard: "Tableau de bord",
    orders: "Commandes",
    logout: "Se déconnecter",
    select_category: "Sélectionner une catégorie",
    categories: { all: "Tous", men: "Hommes", women: "Femmes", children: "Enfants" },
    product_filters: {
      label: "Sélectionner les produits",
      men: "Hommes",
      women: "Femmes",
      children: "Enfants",
      all: "Tous"
    },
    loading: { brand_loading: "Wahret Zmen..." },

    home_title: "Wahret Zmen - Vêtements traditionnels et nos vendeurs",
    home_meta_description:
      "Bienvenue chez Wahret Zmen, explorez notre collection de vêtements traditionnels, nos nouveautés et les dernières tendances.",
    home_intro_html:
      "Bienvenue à la <strong>Boutique Wahret Zmen</strong>, où la tradition rencontre l'élégance. Explorez nos vêtements faits main, inspirés du riche patrimoine culturel tunisien. Découvrez une mode intemporelle mêlant histoire et raffinement moderne.",
    home_banner_text:
      "Entrez dans la tradition avec élégance. La boutique Wahret Zmen vous propose une collection intemporelle de tenues tunisiennes authentiques, confectionnées avec passion et héritage.",
    our_collections: "Nos Collections",
    our_collections_intro:
      "Découvrez notre collection de vêtements traditionnels, confectionnés avec soin et authenticité culturelle. Des Kaftans élégants aux Jebbas classiques, explorez la beauté du patrimoine dans chaque pièce.",
    latest_news: "Actualités & Tendances",
    latest_news_intro:
      "Restez informé des nouveautés de Wahret Zmen ! Découvrez nos nouvelles collections, conseils mode, et offres exclusives qui font vivre la tradition dans un monde moderne.",
    banner_img_alt: "Vêtements traditionnels tunisiens",
    banner_title:
      "Wahret Zmen par Sabri – Préserver l'héritage tunisien avec élégance",
    banner_description:
      "Wahret Zmen est une boutique unique de vêtements traditionnels tunisiens située à El Aswak, Tunis, rue Essouf...",
    discover_now: "Découvrir maintenant",
    wahret_zmen_collection: "Collection Wahret Zmen",
    no_products_found: "Aucun produit trouvé.",

        Welcome_Banner_title: "Bienvenue à Wahret Zmen",
          banner_img_alt: "Bannière de vêtements traditionnels Wahret Zmen",

    largebanner: {
      banner_aria: "Grande bannière de présentation",
      banner_img_alt: "Bannière de collection de Jebbas traditionnelles",
      brand: "Wahret Zmen",
      by_sabri: "Par Sabri",
      description:
        "Découvrez notre collection exquise de Jebbas traditionnelles, où l’élégance intemporelle rencontre l’artisanat contemporain. Chaque pièce raconte une histoire de patrimoine et de style.",
      explore: "Découvrir la collection",
      learn: "Notre histoire"
    },

    
  "shop_by_category": { "title": "Achetez par Catégorie" },
   

   

    news: {
      section_title: "Actualités",
      items: [
        {
          title:
            "Wahret Zmen par Sabri : Une boutique d'élégance tunisienne traditionnelle",
          description:
            "Wahret Zmen par Sabri est une boutique spécialisée dans les vêtements traditionnels tunisiens..."
        },
        {
          title: "Découvrez l'essence de la tradition tunisienne",
          description:
            "Pour les amateurs de mode tunisienne authentique, Wahret Zmen par Sabri est une destination..."
        },
        {
          title:
            "Nouvelle mission spatiale visant à explorer des galaxies lointaines",
          description:
            "Pour les amateurs de mode tunisienne authentique, Wahret Zmen par Sabri est une destination..."
        }
      ]
    },

   
   "craftsmanship": {
    "aria": "L’art du savoir-faire",
    "title": "L’art du savoir-faire",
    "subtitle": "Découvrez le processus minutieux derrière chaque jebba, où les techniques traditionnelles rencontrent la précision moderne pour créer des pièces intemporelles.",
    "items": [
      {
        "title": "Sélection de tissus premium",
        "desc": "Nous sélectionnons uniquement les meilleurs tissus auprès d’artisans textiles marocains renommés, pour que chaque jebba soit aussi luxueuse qu’elle en a l’air."
      },
      {
        "title": "Maîtrise de la coupe",
        "desc": "Chaque point est réalisé avec précision par des artisans chevronnés, héritiers de générations de techniques de couture traditionnelles."
      },
      {
        "title": "Finitions à la main",
        "desc": "De la broderie délicate aux boutons décoratifs, chaque détail est méticuleusement fini à la main."
      },
      {
        "title": "Contrôle qualité",
        "desc": "Chaque pièce subit des contrôles rigoureux afin de répondre à nos exigences d’excellence et de durabilité."
      }
    ]
  },


    AboutWahretZmen: {
      title: "L’art de l’élégance traditionnelle",
      p1: "Chez Wahret Zmen By Sabri, nous préservons l’héritage d’un savoir-faire artisanal tout en embrassant un design contemporain. Chaque Jebba est réalisée avec soin par des artisans chevronnés.",
      p2: "Notre engagement pour l’authenticité et la qualité garantit que chaque pièce honore le passé et célèbre la beauté intemporelle de la tenue traditionnelle.",
      cta: "Découvrir Notre Héritage",
      features: {
        craftsmanship: {
          title: "Maîtrise Artisanale",
          desc:
            "Chaque pièce est façonnée à la main par des artisans expérimentés, maîtres des techniques traditionnelles."
        },
        heritage: {
          title: "Héritage Authentique",
          desc:
            "Nous respectons les codes traditionnels tout en les adaptant au confort et au style modernes."
        },
        quality: {
          title: "Qualité Premium",
          desc:
            "Nous sélectionnons les tissus et matériaux les plus nobles pour une beauté durable et un confort absolu."
        }
      }
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
            rights: "Tous droits réservés.",
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
  forgot_password_link: "Mot de passe oublié ?",   // ✅ new
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
}
,

forgot: {
  title: "Mot de passe oublié",
  subtitle: "Entrez votre adresse e-mail pour recevoir un lien de réinitialisation.",
  email_label: "Adresse e-mail",
  email_placeholder: "Entrez votre e-mail",
  email_required: "L'e-mail est requis.",
  submit_btn: "Envoyer le lien",
  sending: "Envoi en cours...",
  success_title: "E-mail envoyé !",
  success_text: "Un lien de réinitialisation du mot de passe a été envoyé à votre adresse e-mail.",
  error_title: "Erreur",
  error_text: "Impossible d'envoyer l'e-mail de réinitialisation. Veuillez réessayer.",
  rights: "Tous droits réservés."
},


reset: {
  title: "Réinitialiser le mot de passe",
  for_email: "Réinitialisation pour l'adresse",
  new_password_label: "Nouveau mot de passe",
  new_password_placeholder: "Entrez votre nouveau mot de passe",
  password_required: "Le mot de passe est requis.",
  password_min: "Le mot de passe doit contenir au moins 6 caractères.",
  confirm_password_label: "Confirmez le mot de passe",
  confirm_password_placeholder: "Confirmez votre nouveau mot de passe",
  confirm_password_required: "La confirmation du mot de passe est requise.",
  mismatch_title: "Les mots de passe ne correspondent pas",
  mismatch_text: "Veuillez vous assurer que les deux mots de passe sont identiques.",
  success_title: "Mot de passe réinitialisé !",
  success_text: "Votre mot de passe a été mis à jour avec succès. Vous pouvez maintenant vous connecter.",
  error_title: "Erreur",
  error_text: "Échec de la réinitialisation du mot de passe. Veuillez réessayer.",
  invalid_link_title: "Lien invalide",
  invalid_link_text: "Le lien de réinitialisation est invalide ou expiré.",
  submit_btn: "Réinitialiser le mot de passe",
  rights: "Tous droits réservés."
},

changePassword: {
  title: "Modifier le mot de passe",
  open_btn: "Modifier le mot de passe",
  current_label: "Mot de passe actuel",
  current_placeholder: "Entrez votre mot de passe actuel",
  current_required: "Le mot de passe actuel est requis.",
  new_label: "Nouveau mot de passe",
  new_placeholder: "Entrez un nouveau mot de passe (min 6)",
  confirm_label: "Confirmer le nouveau mot de passe",
  confirm_placeholder: "Retapez le nouveau mot de passe",
  show: "Afficher",
  hide: "Masquer",
  submit_btn: "Mettre à jour le mot de passe",
  success_title: "Mot de passe modifié",
  success_text: "Votre mot de passe a été mis à jour avec succès.",
  error_title: "Erreur",
  error_text: "Impossible de changer le mot de passe. Vérifiez votre mot de passe actuel et réessayez.",
  wrong_current: "Le mot de passe actuel est incorrect.",
  too_many_requests: "Trop de tentatives. Réessayez plus tard.",
  recent_login: "Par sécurité, reconnectez-vous puis réessayez.",
  not_password_user_text: "Votre compte est connecté via Google ou un autre fournisseur. Le changement de mot de passe n’est disponible que pour les comptes e-mail/mot de passe."
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
  welcome: "Bonjour, {{name}} !",
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
  defaultUser: "Client",
},

"ordersPage": {
  "title": "Mes commandes",
  "yourOrders": "Vos commandes",
  "pleaseLogin": "Veuillez vous connecter pour voir vos commandes.",
  "noOrders": "Vous n'avez aucune commande pour le moment.",
  "orderNumber": "Commande n°",
  "orderId": "ID de commande",
  "name": "Nom",
  "email": "Email",
  "phone": "Téléphone",
  "total": "Prix total",
  "orderedProducts": "Produits commandés",
  "quantity": "Quantité",
  "color": "Couleur",
  "original": "Original",
  "noTitle": "Produit sans titre",
  "removeProduct": "Supprimer le produit",
  "deleting": "Suppression...",
  "deleteOrder": "Supprimer la commande",
  "confirmDeleteTitle": "Êtes-vous sûr(e) ?",
  "confirmDeleteText": "Cette action est irréversible. Votre commande sera définitivement supprimée.",
  "confirmDeleteBtn": "Oui, supprimer !",
  "deleted": "Supprimée !",
  "orderDeleted": "Votre commande a été supprimée avec succès.",
  "error": "Erreur",
  "orderDeleteFailed": "Échec de la suppression de la commande. Veuillez réessayer.",
  "removeQuantityTitle": "Supprimer une quantité",
  "removeQuantityLabel": "Vous avez {{max}} dans votre commande. Entrez la quantité à supprimer :",
  "removeBtn": "Supprimer",
  "cancelBtn": "Annuler",
  "removed": "Quantité supprimée !",
  "productRemoved": "{{qty}} produit(s) supprimé(s) de votre commande.",
  "productRemoveFailed": "Échec de la suppression du produit. Veuillez réessayer."
},

"cart": {
  "title": "Panier",
  "review": "Vérifiez vos articles sélectionnés",
  "summary": "Récapitulatif de la commande",
  "shipping": "Livraison",
  "decrease_qty": "Diminuer la quantité",
  "increase_qty": "Augmenter la quantité",
  "empty_hint": "Découvrez notre belle collection de jebbas traditionnelles",
  "clear_cart": "Vider le panier",
  "category": "Catégorie",
  "color": "Couleur",
  "original": "Original",
  "qty": "Qté",
  "remove": "Supprimer",
  "empty": "Votre panier est vide !",
  "subtotal": "Sous-total",
  "proceed_to_checkout": "Passer à la caisse"
},

"stock": "Stock",
"free": "Gratuit",
"total": "Total",
"continue_shopping": "Continuer vos achats",
"start_shopping": "Commencer les achats",

"checkout": {
  "title": "Paiement sécurisé",
  "subtitle": "Finalisez votre commande en toute sécurité",
  "payment_method": "Paiement à la livraison",
  "total_price": "Prix total :",
  "items": "Articles",
  "personal_details": "Informations personnelles",
  "full_name": "Nom complet",
  "email": "Adresse e-mail",
  "phone": "Numéro de téléphone",
  "shipping_address": "Adresse de livraison",
  "address": "Adresse / Rue",
  "city": "Ville",
  "country": "Pays",
  "state": "Région",
  "zipcode": "Code postal",
  "agree": "J'accepte les",
  "terms": "Conditions générales",
  "policy": "Conditions d'achat",
  "and": "et",
  "place_order": "Passer la commande",
  "processing": "Traitement de votre commande...",
  "order_confirmed": "Commande confirmée",
  "success_message": "Votre commande a été passée avec succès !",
  "go_to_orders": "Voir les commandes",
  "error_title": "Erreur !",
  "error_message": "Échec de la commande",

  "cod_title": "Paiement à la livraison",
  "cod_desc": "Vous réglez en espèces lors de la livraison. Aucun paiement en ligne n’est requis.",
  "cod_point1": "Préparez si possible le montant exact.",
  "cod_point2": "Notre livreur vous contactera avant d’arriver.",
  "cod_point3": "Les retours et échanges suivent notre politique habituelle.",

  "security_note": "Sécurisé & Chiffré :",
  "security_desc": "Vos informations personnelles sont transmises en toute sécurité.",

  "delivery_info_title": "Informations de livraison",
  "delivery_info_desc": "Livraison standard en 24–72 h selon votre ville."
},

  search_input: {
            placeholder: "Rechercher des produits..."  // French
          },

          "products_page": {
    "title": "مجموعة وهرة الزمان",
    "overview": "في وهرة الزمان، نحافظ على جوهر الحرفية التونسية من خلال مزج التقنيات التقليدية مع اللمسات العصرية. سواء كنت تبحث عن قطعة فاخرة لمناسبة خاصة أو زيٍّ خالد، فإن مجموعتنا مصممة لتحتفل بجمال التراث.",
    "list_view_note": "تصفح منتجاتنا المصنوعة يدوياً أدناه."
  },

  "search_placeholder": "ابحث عن المنتجات…",
  "search_input": { "placeholder": "ابحث عن المنتجات..." },

  "error_loading_products": "حدث خطأ أثناء تحميل المنتجات.",
  "no_products_found": "لا توجد منتجات مطابقة لمرشحاتك.",
  "load_more": "عرض المزيد",

  "filters": "الفلاتر",
  "category": "الفئة",
  "color": "اللون",
  "price_range": "نطاق السعر",
  "clear_filters": "مسح الفلاتر",

  "select_category": "الكل",
  "select_color": "الكل",

  "categories": {
    "men": "رجال",
    "women": "نساء",
    "children": "أطفال",
    "kids": "أطفال"
    
},

about: {
  title: "À propos de nous",
  description: "Jebba tunisienne authentique, brodée à la main, mêlant héritage traditionnel et vision moderne en soie naturelle.",

  /* Hero/sections */
  mission_title: "Notre mission",
  mission_text1: "Une jebba venue du cœur de la médina de Tunis, façonnée par des mains tunisiennes — du producteur au consommateur.",
  mission_text2: "Tout ce qui est authentique honore l’artisanat tunisien. Nous œuvrons chaque jour à préserver ce métier noble : la confection du vêtement traditionnel.",
  crafted_title: "Nos produits",
  crafted_text1: "Jebba, farmla, serwal arbi, barnous, balgha, kantra, mentane, chapelet d’ambre…",
  crafted_text2: "Chaque pièce est réalisée par des artisans spécialisés, alliant savoir-faire ancien et touche contemporaine.",
  behind_title: "Au cœur de la Médina",
  behind_text: "Nous sommes établis au centre de la Médina de Tunis, près de la Mosquée Zitouna, Hammam El Kachachine, Café El Khattab, Café El Anba et l’Association Coranique.",
  join_title: "Rejoignez l’héritage",
  join_text1: "Chaque création reflète l’histoire et l’identité tunisiennes.",
  join_text2: "Vivez l’élégance authentique avec la touche moderne de Wahret Zmen.",

  /* Values */
  values_title: "Nos valeurs",
  values_sub: "Ces principes fondamentaux guident tout notre travail — de la sélection des matières au contrôle qualité final de chaque jebba.",
  v1_title: "Héritage & Tradition",
  v1_text: "Nous honorons un savoir-faire tunisien séculaire, en préservant des techniques authentiques transmises de génération en génération.",
  v2_title: "Qualité Intransigeante",
  v2_text: "Chaque jebba subit des contrôles rigoureux pour répondre à nos exigences d’excellence et de durabilité.",
  v3_title: "Excellence Artisanale",
  v3_text: "Nos maîtres artisans mettent des décennies d’expérience au service de chaque point — des pièces qui relèvent de l’art à porter.",
  v4_title: "Approche Centrée Client",
  v4_text: "Nous cultivons une relation de confiance et un service personnalisé pour assurer votre entière satisfaction.",
  v5_title: "Rayonnement Mondial, Racines Locales",
  v5_text: "Nous servons des clients dans le monde entier, tout en restant profondément ancrés dans la culture tunisienne et le soutien aux artisans locaux.",
  v6_title: "Design Intemporel",
  v6_text: "L’élégance traditionnelle rencontre la modernité — des pièces qui traversent saisons et tendances.",

  /* Gallery */
  gallery_title: "Boutique & Atelier — Houmet Essouk",
  gallery_intro: "Un aperçu de notre univers au cœur de la médina : la vitrine, l’atelier et les ruelles intemporelles de Houmet Essouk.",
  gallery_img_alt: "Image de la galerie"
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
      navbar: { brand: "وهرة الزّمان" },
      home: "الرئيسية",
      products: "المنتجات",
      "about-menu": "من نحن",
      "contact-menu": "اتصل بنا",
      dashboard: "لوحة التحكم",
      admin_dashboard: "لوحة التّحكّم المدير",
      orders: "الطلبات",
      logout: "تسجيل الخروج",


      

      Welcome_Banner_title: "مرحبًا بكم في وهرة الزّمان",
      banner_img_alt: "لافتة وهرة الزّمان التقليدية",

      loading: { brand_loading: "وهرة الزّمان..." },

      select_category: "اختر الفئة",
      categories: { all: "الكل", men: "رجال", women: "نساء", children: "أطفال" },
      product_filters: {
        label: "اختر المنتجات",
        men: "رجال",
        women: "نساء",
        children: "أطفال",
        all: "الكل"
      },

          
            largebanner: {
  banner_aria: "قسم البانر الرئيسي",
  banner_img_alt: "لافتة مجموعة الجبب التقليدية",
  brand: "وهرة الزّمان",
  by_sabri: "بإدارة صبري",
  description:
    "اكتشفوا مجموعتنا الراقية من الجبب التقليدية، حيث تلتقي الأناقة الخالدة بالحرفية العصرية. كل قطعة تحكي قصة تراث وأسلوب.",
  explore: "اكتشف المجموعة",
  learn: "تعرّف على قصتنا"
},

    
      contentshowcase: {
        showcase_aria: "مجموعات مميزة",
        showcase_title: "أناقة خالدة، إرث حيّ",
        showcase_subtitle:
          "اكتشفوا قطعًا راقية صُنعت بشغف و<strong>بخبرة تونسية</strong>.",
        badge_artisan: "حِرَفِي",
        badge_fait_main: "صُنع يدوي",
        badge_nouveaute: "جديد",
        cs_hommes_alt: "جبّة رجالية",
        cs_hommes_title: "مجموعة الرجال",
        cs_hommes_desc:
          "قصّات نبيلة وأقمشة فاخرة لإطلالة <strong>راقية</strong>. كل تفصيلة تحكي حكاية.",
        shop_men: "اكتشف الرجال",
        cs_femmes_alt: "جبّة نسائية",
        cs_femmes_title: "مجموعة النساء",
        cs_femmes_desc:
          "قصّات رشيقة وتطريزات أنيقة وأناقة <strong>طبيعية</strong> تُميّز كل لحظة.",
        shop_women: "اكتشف النساء",
        cs_enfants_alt: "جبّة أطفال",
        cs_enfants_title: "مجموعة الأطفال",
        cs_enfants_desc:
          "راحة ونعومة وتقاليد للصغار — <strong>إرث</strong> يُرتدى بفخر.",
        shop_children: "اكتشف الأطفال",
        cs_cta_text: "خصّصوا إطلالتكم: ألوان وتطريزات ومقاسات حسب الطلب.",
        browse_all: "عرض كل المنتجات"
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

      
            
 "shop_by_category": {
        "title": "تسوق حسب الفئة"
      },

         
         



      loading: { brand_loading: "وهرة الزّمان..." },

      select_category: "اختر الفئة",
      categories: { all: "الكل", men: "رجال", women: "نساء", children: "أطفال" },
      product_filters: {
        label: "اختر المنتجات",
        men: "رجال",
        women: "نساء",
        children: "أطفال",
        all: "الكل"
      },

      search_input: { placeholder: "ابحث عن المنتجات..." },

      
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

     "craftsmanship": {
    "aria": "فنّ الحِرَف",
    "title": "فنّ الحِرَف",
    "subtitle": "اكتشفوا العملية الدقيقة خلف كل جبّة، حيث تلتقي التقنيات التقليدية بالدقة الحديثة لابتكار قطع خالدة.",
    "items": [
      {
        "title": "اختيار أقمشة فاخرة",
        "desc": "ننتقي أجود الأقمشة من أمهر حرفيي النسيج في المغرب، لتمنح كل جبّة إحساسًا بالفخامة يضاهي مظهرها."
      },
      {
        "title": "تفصيل احترافي",
        "desc": "توضع كل غرزة بدقة على يد حرفيين مهرة توارثوا أجيالًا من تقنيات الخياطة التقليدية."
      },
      {
        "title": "تشطيبات يدويّة",
        "desc": "من التطريز الدقيق إلى الأزرار والزخارف، يُنجز كل تفصيل بعناية يدويّة متقنة."
      },
      {
        "title": "مراقبة الجودة",
        "desc": "تمرّ كل قطعة بفحوصات صارمة لضمان توافقها مع معاييرنا العالية في الجودة والمتانة."
      }
    ]
  },
  AboutWahretZmen: {
        title: "فنّ الأناقة التقليدية",
        p1: "في واهرت زمن باي صبري، نحافظ على تراث الحِرَف التقليدية مع لمسات عصرية. كل جلّابية تُنجز بعناية على يد حرفيين مهرة.",
        p2: "التزامنا بالأصالة والجودة يضمن أن تحتفي كل قطعة بالماضي وتُبرز جمال الزيّ التقليدي الخالد.",
        cta: "اكتشفوا إرثنا",
        features: {
          craftsmanship: { title: "حِرَفية متقنة", desc: "كل قطعة تُصنع يدويًا على يد حرفيين ذوي خبرة طويلة في التقنيات التقليدية." },
          heritage:      { title: "تراث أصيل",    desc: "نحترم العناصر التقليدية ونطوّعها لراحةٍ وأسلوبٍ حديث." },
          quality:       { title: "جودة فاخرة",   desc: "نختار أفضل الأقمشة والمواد لضمان جمال يدوم وراحة مميّزة." }
        }
      },

     





      
          
        

          "news": {
    "section_title": "أحدث الإلهامات",
    "subtitle": "أبرز ما لدينا في وهرة الزمان — الحِرَف، الإصدارات الجديدة، وحكايات تقف وراء تصاميمنا.",
    "read_more": "اكتشف المزيد",
    "fallback_title": "أخبار وهرة الزمان",
    "fallback_desc": "تعرّفوا إلى أحدث مجموعاتنا ولقطات من داخل الأتيليه.",
    "items": [
      {
        "title": "كبسولة المدينة • جبّات مطرّزة يدويًا",
        "description": "سلسلة محدودة مستوحاة من أقواس المدينة وزخارفها الجصّية. كل قطعة تُنهى يدويًا بخيوط حرير."
      },
      {
        "title": "من قلب الأتيليه • من القماش إلى القَصّة",
        "description": "رحلة اختيار الأقمشة الفاخرة وصولًا إلى التفصيل الدقيق — احتفاء بالحرفية التونسية."
      },
      {
        "title": "وصل حديثًا • اختيارات الأعراس والمناسبات",
        "description": "قصّات أنيقة، تشطيبات راقية، ونقوش تراثية لمناسباتٍ لا تُنسى."
      },
              
              
            ]
          },
          
 /* ⬇ everything stays INSIDE ar.translation ⬇ */
       footer: {
        brand: "وهرة الزّمان",
        description:
          "ملابس تقليدية تونسية تجمع بين التراث والأناقة العصرية. موقعنا: سوق السوف، تونس.",
        quickLinks: "روابط سريعة",
        home: "الرئيسية",
        products: "المنتجات",
        about: "من نحن",
        contact: "اتصل بنا",
        contactUs: "اتصل بنا",
        location: "سوق السوف، تونس",
        followUs: "تابعونا",
        rights: "جميع الحقوق محفوظة."
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
  login_btn: "تسجيل الدخول",
  no_account: "ليس لديك حساب؟",
  register_link: "إنشاء حساب",
  forgot_password_link: "هل نسيت كلمة المرور؟",   // ✅ new
  google_btn: "تسجيل الدخول باستخدام جوجل",
  success_title: "مرحباً بعودتك!",
  success_text: "تم تسجيل الدخول بنجاح.",
  error_title: "فشل تسجيل الدخول",
  error_text: "يرجى إدخال بريد إلكتروني وكلمة مرور صالحين.",
  google_success_title: "تم تسجيل الدخول عبر Google!",
  google_error_title: "فشل تسجيل الدخول عبر Google",
  continue_shopping: "مواصلة التسوق",
  try_again: "أعد المحاولة",
  rights: "جميع الحقوق محفوظة."
},

forgot: {
  title: "نسيت كلمة المرور",
  subtitle: "أدخل بريدك الإلكتروني لتلقي رابط إعادة التعيين.",
  email_label: "البريد الإلكتروني",
  email_placeholder: "أدخل بريدك الإلكتروني",
  email_required: "البريد الإلكتروني مطلوب.",
  submit_btn: "إرسال الرابط",
  sending: "جاري الإرسال...",
  success_title: "تم إرسال البريد الإلكتروني!",
  success_text: "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.",
  error_title: "خطأ",
  error_text: "فشل إرسال رابط إعادة التعيين. حاول مرة أخرى.",
  rights: "جميع الحقوق محفوظة."
},


reset: {
  title: "إعادة تعيين كلمة المرور",
  for_email: "إعادة التعيين للبريد الإلكتروني",
  new_password_label: "كلمة المرور الجديدة",
  new_password_placeholder: "أدخل كلمة المرور الجديدة",
  password_required: "كلمة المرور مطلوبة.",
  password_min: "يجب أن تحتوي كلمة المرور على 6 أحرف على الأقل.",
  confirm_password_label: "تأكيد كلمة المرور",
  confirm_password_placeholder: "أدخل كلمة المرور مرة أخرى",
  confirm_password_required: "تأكيد كلمة المرور مطلوب.",
  mismatch_title: "كلمتا المرور غير متطابقتين",
  mismatch_text: "يرجى التأكد من أن كلمتي المرور متطابقتان.",
  success_title: "تمت إعادة التعيين!",
  success_text: "تم تحديث كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول.",
  error_title: "خطأ",
  error_text: "فشلت عملية إعادة تعيين كلمة المرور. حاول مرة أخرى.",
  invalid_link_title: "رابط غير صالح",
  invalid_link_text: "رابط إعادة التعيين غير صالح أو منتهي الصلاحية.",
  submit_btn: "إعادة تعيين كلمة المرور",
  rights: "جميع الحقوق محفوظة."
},

changePassword: {
  title: "تغيير كلمة المرور",
  open_btn: "تغيير كلمة المرور",
  current_label: "كلمة المرور الحالية",
  current_placeholder: "أدخل كلمة المرور الحالية",
  current_required: "كلمة المرور الحالية مطلوبة.",
  new_label: "كلمة المرور الجديدة",
  new_placeholder: "أدخل كلمة مرور جديدة (6 أحرف على الأقل)",
  confirm_label: "تأكيد كلمة المرور الجديدة",
  confirm_placeholder: "أعد إدخال كلمة المرور الجديدة",
  show: "إظهار",
  hide: "إخفاء",
  submit_btn: "تحديث كلمة المرور",
  success_title: "تم تغيير كلمة المرور",
  success_text: "تم تحديث كلمة المرور بنجاح.",
  error_title: "خطأ",
  error_text: "تعذّر تغيير كلمة المرور. يرجى التحقق من كلمة المرور الحالية والمحاولة مرة أخرى.",
  wrong_current: "كلمة المرور الحالية غير صحيحة.",
  too_many_requests: "محاولات كثيرة. يرجى المحاولة لاحقًا.",
  recent_login: "لأسباب أمنية، يرجى تسجيل الدخول مرة أخرى ثم إعادة المحاولة.",
  not_password_user_text: "تم تسجيل الدخول باستخدام Google أو مزود آخر. تغيير كلمة المرور متاح فقط للحسابات التي تستخدم البريد وكلمة المرور."
}
,


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
            welcome: "مرحبًا، {{name}}!",
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
            defaultUser: "العميل"
          },
          
          

          "ordersPage": {
  "title": "طلباتي",
  "yourOrders": "طلباتك",
  "noOrders": "لا توجد طلبات!",
  "orderNumber": "الطلب رقم",
  "orderId": "رقم الطلب",
  "name": "الاسم",
  "email": "البريد الإلكتروني",
  "phone": "الهاتف",
  "total": "السعر الإجمالي",
  "orderedProducts": "المنتجات المطلوبة:",
  "quantity": "الكمية",
  "color": "اللون",
  "original": "المنتج الأصلي",
  "noTitle": "بدون عنوان",
  "removeProduct": "إزالة المنتج",
  "deleteOrder": "حذف الطلب",
  "deleting": "جارٍ الحذف...",
  "pleaseLogin": "يرجى تسجيل الدخول لعرض طلباتك",
  "confirmDeleteTitle": "هل أنت متأكد؟",
  "confirmDeleteText": "هذا الإجراء غير قابل للاسترجاع. سيتم حذف طلبك نهائيًا.",
  "confirmDeleteBtn": "نعم، احذفه!",
  "deleted": "تم الحذف!",
  "orderDeleted": "تم حذف طلبك.",
  "error": "خطأ",
  "orderDeleteFailed": "فشل في حذف الطلب. حاول مرة أخرى.",
  "removeQuantityTitle": "إزالة كمية",
  "removeQuantityLabel": "لديك {{max}} في طلبك. أدخل الكمية المراد إزالتها:",
  "removeBtn": "إزالة",
  "cancelBtn": "إلغاء",
  "removed": "تمت الإزالة!",
  "productRemoved": "تمت إزالة {{qty}} عنصر(عناصر) من الطلب.",
  "productRemoveFailed": "فشل في إزالة المنتج. حاول مرة أخرى."
},

"cart": {
  "title": "عربة التسوق",
  "clear_cart": "تفريغ العربة",
  "category": "الفئة",
  "color": "اللون",
  "original": "أصلي",
  "qty": "الكمية",
  "remove": "إزالة",
  "empty": "عربة التسوق فارغة!",
  "subtotal": "المجموع الفرعي",
  "proceed_to_checkout": "المتابعة للدفع",

  "review": "راجع المنتجات التي اخترتها",
  "summary": "ملخص الطلب",
  "shipping": "الشحن",
  "decrease_qty": "تقليل الكمية",
  "increase_qty": "زيادة الكمية",
  "empty_hint": "اكتشفوا مجموعتنا الجميلة من الجبب التقليدية"
},

"stock": "المخزون",
"free": "مجاني",
"total": "الإجمالي",
"continue_shopping": "مواصلة التسوق",
"start_shopping": "ابدأ التسوق",


  "checkout": {
    "title": "إتمام الطلب الآمن",
    "subtitle": "أكمل طلبك بأمان",
    "payment_method": "الدفع عند الاستلام",
    "total_price": "السعر الإجمالي:",
    "items": "المنتجات",
    "personal_details": "المعلومات الشخصية",
    "full_name": "الاسم الكامل",
    "email": "البريد الإلكتروني",
    "phone": "رقم الهاتف",
    "shipping_address": "عنوان الشحن",
    "address": "العنوان / الشارع",
    "city": "المدينة",
    "country": "الدولة",
    "state": "المنطقة",
    "zipcode": "الرمز البريدي",
    "agree": "أوافق على",
    "terms": "الشروط والأحكام",
    "policy": "سياسة الشراء",
    "and": "و",
    "place_order": "إتمام الطلب",
    "processing": "جارٍ معالجة طلبك...",
    "order_confirmed": "تم تأكيد الطلب",
    "success_message": "تم إرسال طلبك بنجاح!",
    "go_to_orders": "عرض الطلبات",
    "error_title": "خطأ!",
    "error_message": "فشل في إرسال الطلب",

    "cod_title": "الدفع عند الاستلام",
    "cod_desc": "تدفع نقدًا عند تسليم الطلب. لا حاجة إلى دفع إلكتروني.",
    "cod_point1": "يُفضّل تجهيز المبلغ الكامل إن أمكن.",
    "cod_point2": "سيتواصل معك مندوب التوصيل قبل الوصول.",
    "cod_point3": "الإرجاع والاستبدال يخضعان لسياسة المتجر المعتادة.",

    "security_note": "آمن ومشفّر:",
    "security_desc": "تُنقَل معلوماتك الشخصية بشكلٍ آمن.",

    "delivery_info_title": "معلومات التوصيل",
    "delivery_info_desc": "توصيل قياسي خلال 24–72 ساعة حسب المدينة."
  },

  "products_page": {
    "title": "مجموعة وهرة الزمان",
    "overview": "في وهرة الزمان، نحافظ على جوهر الحرفية التونسية من خلال مزج التقنيات التقليدية مع اللمسات العصرية. سواء كنت تبحث عن قطعة فاخرة لمناسبة خاصة أو زيٍّ خالد، فإن مجموعتنا مصممة لتحتفل بجمال التراث.",
    "list_view_note": "تصفح منتجاتنا المصنوعة يدوياً أدناه."
  },

  "search_placeholder": "ابحث عن المنتجات…",
  "search_input": { "placeholder": "ابحث عن المنتجات..." },

  "error_loading_products": "حدث خطأ أثناء تحميل المنتجات.",
  "no_products_found": "لا توجد منتجات مطابقة لمرشحاتك.",
  "load_more": "عرض المزيد",

  "filters": "الفلاتر",
  "category": "الفئة",
  "color": "اللون",
  "price_range": "نطاق السعر",
  "clear_filters": "مسح الفلاتر",

  "select_category": "الكل",
  "select_color": "الكل",

  "categories": {
    "men": "رجال",
    "women": "نساء",
    "children": "أطفال",
    "kids": "أطفال"
    
},
        about: {
  title: "حولنا",
  description: "جبّة تونسية أصيلة، مطرّزة يدويًا بلمسة تقليدية ورؤية عصرية من الحرير الطبيعي.",

  /* Hero/sections */
  mission_title: "مهمتنا",
  mission_text1: "جبّة من قلب المدينة العتيقة في تونس، صنعت بأيادٍ تونسية — من المنتج إلى المستهلك.",
  mission_text2: "كل ما هو أصيل هو فخر للصناعات التقليدية التونسية. نبذل قصارى جهدنا للحفاظ على هذا الموروث النبيل: صناعة اللباس التقليدي.",
  crafted_title: "منتجاتنا",
  crafted_text1: "جبّة، فرملة، سروال عربي، برنوس، بلغة، كنترة، منتان، مسبحة عنبر…",
  crafted_text2: "كل هذه المنتجات تُصنع على أيدي حرفيين مختصين يمزجون الفن العريق بروح عصرية.",
  behind_title: "في قلب المدينة",
  behind_text: "نحن متواجدون في قلب المدينة العتيقة بتونس، بجوار جامع الزيتونة، حمام الكشّاشين، مقهى الخطاب، مقهى العنبة، والرابطة القرآنية.",
  join_title: "انضموا إلى الإرث",
  join_text1: "كل قطعة تعكس تاريخ تونس وهويتها.",
  join_text2: "اكتشفوا الأناقة الأصيلة مع لمسة عصرية من وهرة الزمان.",

  /* Values */
  values_title: "قيمنا",
  values_sub: "هذه المبادئ الأساسية توجه كل ما نقوم به — من اختيار الخامات إلى الفحص النهائي لجودة كل جبّة.",
  v1_title: "التراث والتقاليد",
  v1_text: "نكرّم مهارات تونسية عمرها قرون، ونحافظ على تقنيات أصيلة توارثتها الأجيال.",
  v2_title: "جودة لا تقبل المساومة",
  v2_text: "تمر كل جبّة بفحوصات صارمة لضمان التميز والمتانة.",
  v3_title: "براعة حرفية",
  v3_text: "يضع أساتذتنا الحرفيون خبرة عقود في كل غرزة، لنصنع قطعًا تُعد فنًا يُرتدى.",
  v4_title: "نهج يركز على العميل",
  v4_text: "نؤمن ببناء علاقات مع زبائننا، ونقدّم خدمة شخصية تضمن رضاهم الكامل.",
  v5_title: "انتشار عالمي، جذور محلية",
  v5_text: "بينما نخدم عملاء حول العالم، نبقى متجذرين في الثقافة التونسية ودعم مجتمعات الحرفيين المحليين.",
  v6_title: "تصاميم خالدة",
  v6_text: "تمزج تصاميمنا بين الأناقة التقليدية والحداثة المعاصرة — قطع تتجاوز الزمن والموضة.",

  /* Gallery */
  gallery_title: "المتجر والورشة — حومة السوق",
  gallery_intro: "لمحة عن عالمنا في قلب المدينة العتيقة: الواجهة، الورشة، والأزقة الخالدة في حومة السوق.",
  gallery_img_alt: "صورة من المعرض"
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







