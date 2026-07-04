/* ============================================================
   Footer — Multi Language + 3D Mouse Effect
   ============================================================ */

const translations = {
  ar: {
    title: "متجر حبيشة", desc: "أفضل متجر للإلكترونيات والهواتف والأجهزة اللوحية والإكسسوارات.",
    quick: "روابط سريعة", home: "الرئيسية", products: "المنتجات", offers: "العروض", contact: "اتصل بنا",
    support: "الدعم الفني", help: "مركز المساعدة", privacy: "سياسة الخصوصية", terms: "الشروط والأحكام", shipping: "الشحن",
    rights: "© 2026 متجر حبيشة - جميع الحقوق محفوظة",
  },
  en: {
    title: "Habisha Store", desc: "Best Electronics Store For Phones, Tablets & Accessories.",
    quick: "Quick Links", home: "Home", products: "Products", offers: "Offers", contact: "Contact",
    support: "Support", help: "Help Center", privacy: "Privacy Policy", terms: "Terms & Conditions", shipping: "Shipping",
    rights: "© 2026 Habisha Store - All Rights Reserved",
  },
  fr: {
    title: "Boutique Habisha", desc: "Le meilleur magasin d'électronique pour téléphones et tablettes.",
    quick: "Liens Rapides", home: "Accueil", products: "Produits", offers: "Offres", contact: "Contact",
    support: "Support", help: "Centre d'aide", privacy: "Confidentialité", terms: "Conditions", shipping: "Livraison",
    rights: "© 2026 Habisha - Tous droits réservés",
  },
};

function changeFooterLanguage(lang) {
  localStorage.setItem("footer_lang", lang);
  const t = translations[lang];

  document.querySelector(".logo-box h2").textContent = t.title;
  document.querySelector(".logo-box p").textContent = t.desc;

  const boxes = document.querySelectorAll(".footer-box");
  boxes[1].querySelector("h3").textContent = t.quick;
  const links1 = boxes[1].querySelectorAll("a");
  links1[0].textContent = t.home;
  links1[1].textContent = t.products;
  links1[2].textContent = t.offers;
  links1[3].textContent = t.contact;

  boxes[2].querySelector("h3").textContent = t.support;
  const links2 = boxes[2].querySelectorAll("a");
  links2[0].textContent = t.help;
  links2[1].textContent = t.privacy;
  links2[2].textContent = t.terms;
  links2[3].textContent = t.shipping;

  document.querySelector(".footer-bottom p").textContent = t.rights;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".lang-switcher button").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.dataset.lang) changeFooterLanguage(btn.dataset.lang);
    });
  });

  changeFooterLanguage(localStorage.getItem("footer_lang") || "en");

  document.querySelectorAll(".footer-box").forEach((box) => {
    box.addEventListener("mousemove", (e) => {
      const rect = box.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 20;
      const rotateX = ((y / rect.height) - 0.5) * -20;
      box.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    box.addEventListener("mouseleave", () => {
      box.style.transform = "perspective(1000px) rotateX(0) rotateY(0)";
    });
  });
});