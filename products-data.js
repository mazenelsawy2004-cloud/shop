/* ============================================================
   قاعدة بيانات موحدة لكل المنتجات — مصدر واحد للحقيقة
   ============================================================ */

window.PRODUCTS_DATA = [
  // ── On Sale ──
  { id: 1, category: "on-sale", name: "awesome", specs: "64GB 6RAM", priceNew: 4200, priceOld: 4900, img: "photo/awesome 64gb 6r 4200 1.jpg", imgHover: "photo/awesome 64gb 6r 4200 2.jpg" },
  { id: 2, category: "on-sale", name: "redmi 15 pro 5g", specs: "256GB 12RAM", priceNew: 19350, priceOld: 22000, img: "photo/redmi 15 pro 5g 256 12r 19353 1.jpg", imgHover: "photo/redmi 15 pro 5g 256 12r 19353 1.jpg" },
  { id: 3, category: "on-sale", name: "redmi 15c", specs: "256GB 8RAM", priceNew: 8730, priceOld: 9500, img: "photo/redmi 15c 256 8 8730 1.jpg", imgHover: "photo/redmi 15c 256 8 8730 3.jpg" },
  { id: 4, category: "on-sale", name: "redmi 15", specs: "256GB 8RAM", priceNew: 10500, priceOld: 10900, img: "photo/redmi 15 256 8 10500 1.jpg", imgHover: "photo/redmi 15 256 8 10500 1.jpg" },
  { id: 5, category: "on-sale", name: "redmi a7 pro", specs: "64GB 4RAM", priceNew: 6200, priceOld: 6999, img: "photo/redmi a7pro 64 4 6200 1.jpg", imgHover: "photo/redmi a7pro 64 4 6200 1.jpg" },
  { id: 6, category: "on-sale", name: "infinix smart 20", specs: "64GB 4RAM", priceNew: 6900, priceOld: 7400, img: "photo/infinix smart 20 256 8.jpg", imgHover: "photo/infinix smart 20 64 8 2 6900.jpg" },

  // ── iPhone ──
  { id: 101, category: "iphone", name: "iphone 13", specs: "", priceNew: 40999, priceOld: 42000, img: "photo/i phone 13 41000.jpg", imgHover: "photo/i phone 13 41000  2.jpg" },
  { id: 102, category: "iphone", name: "iphone 15", specs: "", priceNew: 47500, priceOld: 48000, img: "photo/i phone 15 47500.jpg", imgHover: "photo/i phone 15 47500 2.jpg" },
  { id: 103, category: "iphone", name: "iphone 16", specs: "", priceNew: 58999, priceOld: 60000, img: "photo/i phone 16 5900.jpg", imgHover: "photo/i phone 16 59000 2.jpg" },
  { id: 104, category: "iphone", name: "iphone 17", specs: "", priceNew: 69000, priceOld: 70000, img: "photo/i phone 17 69000.jpg", imgHover: "photo/i phone 17 69000.jpg" },
  { id: 105, category: "iphone", name: "iphone 17 pro max", specs: "", priceNew: 85000, priceOld: 90000, img: "photo/i phone 17 pro max 2.jpg", imgHover: "photo/i phone 17 pro max 2.jpg" },
  { id: 106, category: "iphone", name: "apple iphone air", specs: "", priceNew: 75000, priceOld: 80000, img: "photo/apple iphone air 75000.jpg", imgHover: "photo/apple iphone air 75000 2.jpg" },

  // ── Tablets ──
  { id: 201, category: "tablets", name: "Lenovo Idea Tab Plus", specs: "256GB 8RAM", priceNew: 25000, priceOld: 27999, img: "photo/Lenovo Idea Tab Plus Tablet, 256GB, 8GB RAM, Wi-Fi Only - Cloud Grey 23000.jpg", imgHover: "photo/Lenovo Idea Tab Plus Tablet, 256GB, 8GB RAM, Wi-Fi Only - Cloud Grey 23000.jpg" },
  { id: 202, category: "tablets", name: "Lenovo Idea Tab 5G", specs: "256GB 8RAM 5G", priceNew: 22522, priceOld: 25000, img: "photo/Lenovo Idea Tab Single SIM, 256GB, 8GB RAM, 5G 3 22000.jpg", imgHover: "photo/Lenovo Idea Tab Single SIM, 256GB, 8GB RAM, 5G 3 22000.jpg" },
  { id: 203, category: "tablets", name: "Lenovo Idea Tab Single SIM", specs: "256GB 8RAM 5G", priceNew: 23000, priceOld: 24999, img: "photo/Lenovo Idea Tab Single SIM, 256GB, 8GB RAM, 5G tablet1.jpg", imgHover: "photo/Lenovo Idea Tab Single SIM, 256GB, 8GB RAM, 5G tablet1.jpg" },
  { id: 204, category: "tablets", name: "Lenovo Idea Tab WiFi", specs: "256GB 8RAM 5G", priceNew: 18000, priceOld: 20000, img: "photo/Lenovo Idea Tab wifi, 256GB, 8GB RAM, 5G tablet 2 18000.jpg", imgHover: "photo/Lenovo Idea Tab wifi, 256GB, 8GB RAM, 5G tablet 2 18000.jpg" },
  { id: 205, category: "tablets", name: "TCL Tab 11 Gen 2", specs: "256GB 6RAM", priceNew: 8000, priceOld: 10000, img: "photo/TCL Tab 11 Gen 2 Tabled, 256GB, 6GB RAM, Wi-Fi Only - Grey 8000.jpg", imgHover: "photo/TCL Tab 11 Gen 2 Tabled, 256GB, 6GB RAM, Wi-Fi Only - Grey 8000.jpg" },
];

window.getProductById = function (id) {
  return window.PRODUCTS_DATA.find((p) => p.id === Number(id));
};