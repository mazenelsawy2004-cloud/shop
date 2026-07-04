/* ============================================================
   View Manager — التبديل بين: الرئيسية / تفاصيل منتج / كل المنتجات
   + شريط أدوات احترافي لصفحة All Products (بحث / فلترة / ترتيب)
   ============================================================ */

(function () {
  "use strict";

  /* حالة صفحة All Products الحالية */
  const state = {
    category: "all",
    search: "",
    sort: "default",
  };

  const CATEGORY_LABELS = {
    all: "All Products",
    "on-sale": "On Sale Products",
    iphone: "iPhone Products",
    tablets: "Tablets Products",
  };

  function showView(viewId) {
    document.querySelectorAll(".app-view").forEach((v) => v.classList.add("view-hidden"));
    document.getElementById(viewId)?.classList.remove("view-hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ── فتح تفاصيل منتج معيّن ── */
  window.showItemDetails = function (productId) {
    const product = window.getProductById(productId);
    if (!product) return;

    document.querySelector(".big-img img").src = product.img;
    document.querySelector(".big-img img").alt = product.name;

    const thumbs = document.querySelectorAll(".small-imgs img");
    if (thumbs[0]) { thumbs[0].src = product.img; thumbs[0].classList.add("active-thumb"); }
    if (thumbs[1]) { thumbs[1].src = product.imgHover; thumbs[1].classList.remove("active-thumb"); }

    document.querySelector(".details-item .name").textContent = product.name;
    document.querySelector(".details-item .price span").textContent = product.priceNew + "$";
    document.querySelector(".details-item .old-price").textContent = product.priceOld + "$";

    const skuSpan = document.querySelector(".details-item h5:nth-of-type(2) span");
    if (skuSpan) skuSpan.textContent = `${product.name} ${product.specs}`.trim();

    const descP = document.querySelector(".details-item > p");
    if (descP) descP.textContent = `${product.name} ${product.specs} — original product with full warranty and fast delivery. High quality guaranteed by Habisha Store.`;

    const qtyInput = document.querySelector(".quantity input[type='number']");
    if (qtyInput) qtyInput.value = 1;

    const addBtn = document.querySelector(".details-item .add-to-cart");
    if (addBtn) addBtn.dataset.id = product.id;

    if (typeof window.refreshProductDetailsUI === "function") {
      window.refreshProductDetailsUI();
    }

    showView("item-details-view");
  };

  /* ── فلترة + بحث + ترتيب على قاعدة البيانات ── */
  function getFilteredSortedList() {
    let list = state.category !== "all"
      ? window.PRODUCTS_DATA.filter((p) => p.category === state.category)
      : window.PRODUCTS_DATA.slice();

    const q = state.search.trim().toLowerCase();
    if (q) {
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) || (p.specs || "").toLowerCase().includes(q)
      );
    }

    switch (state.sort) {
      case "price-asc":
        list = list.slice().sort((a, b) => a.priceNew - b.priceNew);
        break;
      case "price-desc":
        list = list.slice().sort((a, b) => b.priceNew - a.priceNew);
        break;
      case "name-asc":
        list = list.slice().sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break; /* featured = ترتيب الإدخال الأصلي */
    }

    return list;
  }

  /* ── رسم الشبكة (Grid) بناءً على الحالة الحالية ── */
  function renderAllProductsGrid() {
    const grid = document.getElementById("allProductsGrid");
    const emptyMsg = document.getElementById("allProductsEmpty");
    const countEl = document.getElementById("allProductsCount");
    const title = document.getElementById("allProductsTitle");
    if (!grid) return;

    const list = getFilteredSortedList();

    if (title) title.textContent = CATEGORY_LABELS[state.category] || "All Products";
    if (countEl) {
      countEl.textContent = `${list.length} product${list.length === 1 ? "" : "s"} found`;
    }

    if (list.length === 0) {
      grid.innerHTML = "";
      emptyMsg?.classList.remove("view-hidden");
      return;
    }
    emptyMsg?.classList.add("view-hidden");

    grid.innerHTML = list.map((p) => `
      <div class="product" data-id="${p.id}">
        <div class="img-product">
          <img src="${p.img}" alt="${p.name}">
          <img class="img-hover" src="${p.imgHover}" alt="${p.name}">
          <button class="wishlist" aria-label="wishlist">${window.HabishaCart.isWishlisted(p.id) ? "&#9829;" : "&#9825;"}</button>
        </div>
        <div class="prod-info">
          <h3 class="name-product"><a href="#">${p.name}</a></h3>
          <p>${p.specs || ""}</p>
          <div class="stars">&#9733;&#9733;&#9733;&#9733;&#9734;</div>
          <div class="prices">
            <span class="price-new">${p.priceNew}$</span>
            <span class="price-old">${p.priceOld}$</span>
          </div>
          <button class="add-btn">add to cart</button>
        </div>
      </div>`).join("");

    /* ربط كل كارت جديد بأحداث الضغط والسلة والـ wishlist */
    grid.querySelectorAll(".product").forEach((cardEl) => {
      const id = +cardEl.dataset.id;
      const productData = window.getProductById(id);

      cardEl.style.cursor = "pointer";
      cardEl.addEventListener("click", (e) => {
        if (e.target.closest(".add-btn") || e.target.closest(".wishlist")) return;
        window.showItemDetails(id);
      });

      cardEl.querySelector(".add-btn")?.addEventListener("click", (e) => {
        e.stopPropagation();
        window.HabishaCart.addToCart(id, productData);
        const btn = e.currentTarget;
        btn.textContent = "✓ added!";
        btn.classList.add("added");
        setTimeout(() => { btn.textContent = "add to cart"; btn.classList.remove("added"); }, 1500);
      });

      const wishBtn = cardEl.querySelector(".wishlist");
      wishBtn?.classList.toggle("liked", window.HabishaCart.isWishlisted(id));
      wishBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        const liked = window.HabishaCart.toggleWishlist(id);
        wishBtn.classList.toggle("liked", liked);
        wishBtn.innerHTML = liked ? "&#9829;" : "&#9825;";
      });
    });
  }

  /* ── نقطة الدخول: فتح صفحة كل المنتجات (أو فئة معينة) ── */
  window.showAllProducts = function (category) {
    state.category = category || "all";

    /* مزامنة شكل الفلاتر مع الفئة المطلوبة */
    document.querySelectorAll("#allProductsFilters .filter-pill").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.category === state.category);
    });

    renderAllProductsGrid();
    showView("all-products-view");
  };

  window.showHomeView = function () {
    showView("home-view");
  };

  /* ── ربط كل أحداث الصفحة عند التحميل ── */
  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("navHome")?.addEventListener("click", (e) => {
      e.preventDefault();
      window.showHomeView();
    });

    document.getElementById("navProducts")?.addEventListener("click", (e) => {
      e.preventDefault();
      window.showAllProducts("all");
    });

    /* روابط "view all" في كل سكشن بالهوم */
    document.querySelectorAll(".view-all-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        window.showAllProducts(link.dataset.category);
      });
    });

    document.querySelectorAll(".back-home-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        window.showHomeView();
      });
    });

    /* ── شريط أدوات All Products: فلاتر ── */
    document.querySelectorAll("#allProductsFilters .filter-pill").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.category = btn.dataset.category;
        document.querySelectorAll("#allProductsFilters .filter-pill").forEach((b) =>
          b.classList.toggle("active", b === btn)
        );
        renderAllProductsGrid();
      });
    });

    /* ── شريط أدوات All Products: بحث فوري ── */
    document.getElementById("allProductsSearch")?.addEventListener("input", (e) => {
      state.search = e.target.value;
      renderAllProductsGrid();
    });

    /* ── شريط أدوات All Products: ترتيب ── */
    document.getElementById("allProductsSort")?.addEventListener("change", (e) => {
      state.sort = e.target.value;
      renderAllProductsGrid();
    });
  });
})();