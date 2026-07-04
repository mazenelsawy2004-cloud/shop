/* ============================================================
   Generic Slider + Cart Binder
   ============================================================ */

(function () {
  "use strict";

  const MAX_VISIBLE = { "on-sale": 4, "iphone": 4, "tablets": 3 };

  function getSectionKey(section) {
    const title = section.querySelector(".top-slide h2")?.textContent.toLowerCase() || "";
    if (title.includes("iphone")) return "iphone";
    if (title.includes("tablet")) return "tablets";
    return "on-sale";
  }
  function initSwiper() {
  if (typeof Swiper === "undefined") {
    console.warn("❌ مكتبة Swiper مش متحملة — تأكد إن سكريبت swiper-bundle.min.js متحط قبل script.js");
    return;
  }

  const swiperEl = document.querySelector(".mySwiper");
  if (!swiperEl) {
    console.warn("❌ عنصر .mySwiper مش موجود في الصفحة");
    return;
  }

  new Swiper(".mySwiper", {
    loop: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
      pauseOnMouseEnter: false,
    },
    scrollbar: {
      el: ".swiper-scrollbar",
      hide: true,
    },
    speed: 700,
  });

  console.log("✅ Swiper اشتغل بنجاح مع autoplay كل 2.5 ثانية");
}

window.addEventListener("load", initSwiper);

  function initSliderForSection(section) {
    const track = section.querySelector(".products");
    const wrapper = section.querySelector(".products-wrapper");
    const prevBtn = section.querySelector(".prev-btn");
    const nextBtn = section.querySelector(".next-btn");
    if (!track || !prevBtn || !nextBtn) return;

    const key = getSectionKey(section);
    const sectionMax = MAX_VISIBLE[key] || 4;
    let currentIndex = 0;

    function getVisibleCount() {
      const w = window.innerWidth;
      let count;
      if (w <= 520) count = 1;
      else if (w <= 860) count = 2;
      else if (w <= 1200) count = 3;
      else count = 4;
      return Math.min(count, sectionMax);
    }

    function getCardWidth() {
      const card = track.querySelector(".product");
      if (!card) return 280;
      const gap = parseFloat(getComputedStyle(track).gap) || 16;
      return card.offsetWidth + gap;
    }

    function getTotalCards() {
      return track.querySelectorAll(".product").length;
    }

    function updateSlider() {
      const visible = getVisibleCount();
      const total = getTotalCards();
      const maxIndex = Math.max(0, total - visible);
      currentIndex = Math.min(currentIndex, maxIndex);
      track.style.transform = `translateX(-${currentIndex * getCardWidth()}px)`;
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex >= maxIndex;
    }

    function pulse(btn) {
      btn.classList.add("arrow-pulse");
      setTimeout(() => btn.classList.remove("arrow-pulse"), 300);
    }

    prevBtn.addEventListener("click", () => {
      if (currentIndex > 0) { currentIndex--; updateSlider(); }
      pulse(prevBtn);
    });

    nextBtn.addEventListener("click", () => {
      const visible = getVisibleCount();
      const max = Math.max(0, getTotalCards() - visible);
      if (currentIndex < max) { currentIndex++; updateSlider(); }
      pulse(nextBtn);
    });

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateSlider, 150);
    });

    let touchStartX = 0;
    wrapper?.addEventListener("touchstart", (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    wrapper?.addEventListener("touchend", (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) diff > 0 ? nextBtn.click() : prevBtn.click();
    });

    updateSlider();
  }

  function bindCartForSection(section) {
    const key = getSectionKey(section);
    const data = window.PRODUCTS_DATA.filter((p) => p.category === key);
    const products = section.querySelectorAll(".product");

    products.forEach((productEl, index) => {
      const productData = data[index];
      if (!productData) return;

      /* فتح تفاصيل المنتج عند الضغط على الكارت (ما عدا الأزرار) */
      productEl.style.cursor = "pointer";
      productEl.addEventListener("click", (e) => {
        if (e.target.closest(".add-btn") || e.target.closest(".wishlist")) return;
        if (typeof window.showItemDetails === "function") {
          window.showItemDetails(productData.id);
        }
      });

      const addBtn = productEl.querySelector(".add-btn");
      if (addBtn) {
        addBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          addToCart(productData.id, productData);
          addBtn.textContent = "✓ added!";
          addBtn.classList.add("added");
          setTimeout(() => {
            addBtn.textContent = "add to cart";
            addBtn.classList.remove("added");
          }, 1500);
        });
      }

      const wishBtn = productEl.querySelector(".wishlist");
      if (wishBtn) {
        if (isWishlisted(productData.id)) {
          wishBtn.classList.add("liked");
          wishBtn.innerHTML = "&#9829;";
        }
        wishBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          const liked = toggleWishlist(productData.id);
          wishBtn.classList.toggle("liked", liked);
          wishBtn.innerHTML = liked ? "&#9829;" : "&#9825;";
        });
      }
    });
  }

  function addToCart(id, productData, qty) {
    qty = qty || 1;
    let cart = JSON.parse(localStorage.getItem("habisha_cart") || "[]");
    const existing = cart.find((i) => i.id === id);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({
        id, name: productData.name, specs: productData.specs,
        price: productData.priceNew, img: productData.img, qty,
      });
    }
    localStorage.setItem("habisha_cart", JSON.stringify(cart));
    updateCartHeaderUI(cart);
    showToastGlobal(`✓ "${productData.name}" added to cart`);
    openCartPanel();
  }

  function fmt(n) {
    return "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function updateCartHeaderUI(cart) {
    const count = cart.reduce((s, i) => s + i.qty, 0);
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

    document.querySelectorAll(".cart-count").forEach((el) => {
      el.textContent = count;
      el.classList.toggle("bounce", count > 0);
    });
    document.querySelectorAll(".price-cart-head").forEach((el) => (el.textContent = fmt(total)));
    document.querySelectorAll(".price-cart-total").forEach((el) => (el.textContent = fmt(total)));

    const span = document.querySelector(".top-cart h3 span");
    if (span) span.textContent = `(${count} ${count === 1 ? "item" : "items"} in cart)`;

    const container = document.querySelector(".items-in-cart");
    if (!container) return;
    if (cart.length === 0) { container.innerHTML = ""; return; }

    container.innerHTML = cart.map((item) => `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.img}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-info">
          <p class="cart-item-name">${item.name}</p>
          <p class="cart-item-specs">${item.specs}</p>
          <div class="cart-item-controls">
            <button class="qty-btn minus" data-id="${item.id}">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn plus" data-id="${item.id}">+</button>
          </div>
          <p class="cart-item-price">${fmt(item.price * item.qty)}</p>
        </div>
        <button class="cart-item-remove" data-id="${item.id}">✕</button>
      </div>`).join("");

    container.querySelectorAll(".qty-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        let c = JSON.parse(localStorage.getItem("habisha_cart") || "[]");
        const id = +btn.dataset.id;
        const it = c.find((i) => i.id === id);
        if (!it) return;
        btn.classList.contains("plus") ? it.qty++ : it.qty--;
        if (it.qty <= 0) c = c.filter((i) => i.id !== id);
        localStorage.setItem("habisha_cart", JSON.stringify(c));
        updateCartHeaderUI(c);
      });
    });

    container.querySelectorAll(".cart-item-remove").forEach((btn) => {
      btn.addEventListener("click", () => {
        let c = JSON.parse(localStorage.getItem("habisha_cart") || "[]");
        c = c.filter((i) => i.id !== +btn.dataset.id);
        localStorage.setItem("habisha_cart", JSON.stringify(c));
        updateCartHeaderUI(c);
      });
    });
  }

  function openCartPanel() {
    document.querySelector(".cart")?.classList.add("active");
    getOrCreateOverlay().classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeCartPanel() {
    document.querySelector(".cart")?.classList.remove("active");
    document.querySelector(".cart-overlay")?.classList.remove("active");
    document.body.style.overflow = "";
  }

  function getOrCreateOverlay() {
    let overlay = document.querySelector(".cart-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "cart-overlay";
      document.body.appendChild(overlay);
      overlay.addEventListener("click", closeCartPanel);
    }
    return overlay;
  }

  let toastTimer;
  function showToastGlobal(msg) {
    let toast = document.querySelector(".toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2500);
  }

  function isWishlisted(id) {
    const wl = JSON.parse(localStorage.getItem("habisha_wishlist") || "[]");
    return wl.includes(id);
  }

  function toggleWishlist(id) {
    let wl = JSON.parse(localStorage.getItem("habisha_wishlist") || "[]");
    const idx = wl.indexOf(id);
    let liked;
    if (idx === -1) { wl.push(id); liked = true; showToastGlobal("Added to wishlist ❤️"); }
    else { wl.splice(idx, 1); liked = false; showToastGlobal("Removed from wishlist"); }
    localStorage.setItem("habisha_wishlist", JSON.stringify(wl));
    return liked;
  }

  window.addEventListener("habisha:toast", (e) => showToastGlobal(e.detail));

  function bindCartCloseButtons() {
    document.querySelector(".top-cart > span")?.addEventListener("click", closeCartPanel);
    document.querySelector(".btn-cart.trans-bg")?.addEventListener("click", closeCartPanel);
    document.querySelector(".cart-header")?.addEventListener("click", openCartPanel);
    document.querySelector(".btn-cart:not(.trans-bg)")?.addEventListener("click", () => {
      const cart = JSON.parse(localStorage.getItem("habisha_cart") || "[]");
      if (cart.length === 0) { showToastGlobal("🛒 Your cart is empty!"); return; }
      showToastGlobal("Redirecting to checkout...");
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeCartPanel(); });
  }

  /* عرض دوال السلة عشان باقي الملفات (view-manager, product-details) تستخدمها */
  window.HabishaCart = {
    addToCart, updateCartHeaderUI, openCartPanel, closeCartPanel,
    showToast: showToastGlobal, isWishlisted, toggleWishlist,
    getCart: () => JSON.parse(localStorage.getItem("habisha_cart") || "[]"),
  };

  window.initProductSections = function () {
    document.querySelectorAll(".slide-sale").forEach((section) => {
      initSliderForSection(section);
      bindCartForSection(section);
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    window.initProductSections();
    bindCartCloseButtons();
    updateCartHeaderUI(window.HabishaCart.getCart());
  });
})();