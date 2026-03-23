
const WHATSAPP_NUMBER = "+573202668935";
const REFLOW_PROJECT_ID = "1811883489";
let cart = JSON.parse(sessionStorage.getItem('valerias_cart')) || [];

function openCartModal(productName) {
const modal = document.getElementById('cart-modal');
const nameEl = modal.querySelector('p');
if (nameEl) nameEl.innerHTML = `¡<strong>${productName}</strong> se ha añadido a tu selección! 🎉`;
const content = document.getElementById('cart-modal-content');
if (modal && content) {
modal.classList.remove('opacity-0', 'pointer-events-none');
content.classList.replace('scale-95', 'scale-100');
}
}
function closeCartModal() {
const modal = document.getElementById('cart-modal');
const content = document.getElementById('cart-modal-content');
if (modal && content) {
modal.classList.add('opacity-0', 'pointer-events-none');
content.classList.replace('scale-100', 'scale-95');
}
}

function saveCart() {
sessionStorage.setItem('valerias_cart', JSON.stringify(cart));
updateCartIcon();
renderCustomCart();
}
function addToCart(product) {
const existing = cart.find(item => item.id === product.id);
if (existing) {
existing.quantity += 1;
} else {
cart.push({ ...product, quantity: 1 });
}
saveCart();
openCartModal(product.name);
}
function removeFromCart(id) {
cart = cart.filter(item => item.id !== id);
saveCart();
}
function updateQuantity(id, delta) {
const item = cart.find(item => item.id === id);
if (item) {
item.quantity += delta;
if (item.quantity < 1) item.quantity = 1;
saveCart();
}
}
function getCartTotal() {
return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}
function updateCartIcon() {
const countEl = document.getElementById('custom-cart-count');
const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
if (countEl) {
countEl.innerText = totalItems;
countEl.style.display = totalItems > 0 ? 'flex' : 'none';
}
}

function renderCustomCart() {
const container = document.getElementById('custom-cart-container');
if (!container) return;
if (cart.length === 0) {
container.innerHTML = `
<div class="text-center py-20 px-6">
<div class="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
<svg class="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
</div>
<h3 class="text-2xl font-serif text-brand-dark mb-4">Tu selección está vacía</h3>
<p class="text-gray-500 mb-8 max-w-xs mx-auto">Explora nuestra colección y añade tus prendas favoritas.</p>
<button onclick="switchView('catalog')" class="bg-brand text-white px-8 py-3 rounded-full hover:bg-brand-dark transition transform hover:scale-105 shadow-lg">
Ver Catálogo
</button>
</div>
`;
return;
}
let html = `
<div class="max-w-4xl mx-auto px-6 py-12">
<h2 class="text-4xl font-serif text-brand-dark mb-10 text-center">Tu Selección</h2>
<div class="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
<div class="p-4 md:p-8 space-y-6">
`;
cart.forEach(item => {
const itemTotal = (item.price * item.quantity).toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
html += `
<div class="flex flex-col md:flex-row items-center gap-6 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
<img src="${item.image}" alt="${item.name}" class="w-24 h-32 object-cover rounded-2xl shadow-md">
<div class="flex-grow text-center md:text-left">
<h4 class="text-xl font-medium text-gray-900 mb-1">${item.name}</h4>
<p class="text-brand font-semibold text-lg">${itemTotal}</p>
</div>
<div class="flex items-center gap-4 bg-gray-50 rounded-full px-4 py-2 border border-gray-200">
<button onclick="updateQuantity('${item.id}', -1)" class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-brand transition text-xl font-bold">−</button>
<span class="w-8 text-center font-bold text-gray-800">${item.quantity}</span>
<button onclick="updateQuantity('${item.id}', 1)" class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-brand transition text-xl font-bold">+</button>
</div>
<button onclick="removeFromCart('${item.id}')" class="text-gray-400 hover:text-red-500 transition p-2">
<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
</button>
</div>
`;
});
const totalStr = getCartTotal().toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
html += `
</div>
<div class="bg-gray-50 p-8 border-t border-gray-100">
<div class="flex justify-between items-center mb-8">
<span class="text-gray-500 font-medium text-lg">Subtotal Estimado</span>
<span class="text-3xl font-serif text-brand-dark font-bold">${totalStr}</span>
</div>
<button onclick="handleWhatsAppCheckout()" class="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-5 px-8 rounded-2xl transition duration-300 flex items-center justify-center shadow-xl transform hover:-translate-y-1 active:scale-95">
<svg class="w-7 h-7 mr-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.237 3.483 8.417-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.308 1.652zm5.841-3.791c1.556.924 3.09 1.487 4.75 1.488 5.25 0 9.52-4.27 9.523-9.52.001-2.544-.988-4.936-2.785-6.735-1.797-1.799-4.189-2.788-6.733-2.789-5.251 0-9.521 4.27-9.524 9.52 0 1.905.549 3.659 1.587 5.17l-.59 2.152 2.272-.586zm10.742-5.467c-.244-.122-1.444-.712-1.667-.793-.223-.081-.385-.122-.547.122-.162.244-.627.793-.769.955-.142.162-.284.183-.528.061-.244-.122-1.03-.38-1.96-1.21-.724-.645-1.213-1.442-1.355-1.686-.142-.244-.015-.376.107-.497.11-.11.244-.285.366-.427.122-.142.162-.244.244-.407.081-.162.041-.305-.02-.427-.061-.122-.547-1.319-.749-1.807-.197-.478-.398-.413-.547-.421-.141-.007-.305-.008-.467-.008-.162 0-.427.061-.65.285-.223.224-.853.834-.853 2.034 0 1.2.874 2.358.995 2.521.122.163 1.72 2.625 4.167 3.681.582.251 1.037.401 1.391.514.585.186 1.117.16 1.537.097.469-.071 1.444-.59 1.647-1.159.203-.569.203-1.057.142-1.159-.061-.102-.223-.163-.467-.285z"/></svg>
ENVIAR PEDIDO POR WHATSAPP
</button>
<p class="text-center text-gray-400 text-sm mt-4 italic">Se confirmará disponibilidad por WhatsApp</p>
</div>
</div>
</div>
`;
container.innerHTML = html;
}

function initReflow() {
document.addEventListener('click', (e) => {
const btn = e.target.closest('.ref-button, .ref-add-to-cart');
if (btn && btn.closest('[data-reflow-type="product-list"]')) {
const productEl = btn.closest('.ref-product');
if (productEl) {
e.preventDefault();
e.stopPropagation();
const product = {
id: productEl.querySelector('.ref-product-id')?.value || productEl.getAttribute('data-reflow-product') || Math.random().toString(36).substr(2, 9),
name: productEl.querySelector('.ref-name')?.innerText.trim() || "Producto VALERIAS",
price: parseFloat(productEl.querySelector('.ref-price')?.innerText.replace(/[^0-9.]/g, '')) || 0,
image: productEl.querySelector('img')?.src || ""
};
addToCart(product);
}
}
}, true);
updateCartIcon();
}

function handleWhatsAppCheckout() {
if (cart.length === 0) return;
let message = `*NUEVO PEDIDO - VALERIAS* 🛍️\n\n`;
message += `¡Hola! Me gustaría realizar el siguiente pedido:\n\n`;
cart.forEach(item => {
const itemTotal = (item.price * item.quantity).toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
message += `• *${item.name}* x ${item.quantity} (${itemTotal})\n`;
});
const totalStr = getCartTotal().toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
message += `\n*TOTAL ESTIMADO:* ${totalStr}\n\n`;
message += `¿Me confirman si tienen disponible para entrega inmediata? ¡Gracias! ✨`;
const encodedMessage = encodeURIComponent(message);
const waUrl = `https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=${encodedMessage}`;
window.open(waUrl, '_blank');
}
window.addEventListener('load', () => {
initReflow();
initAutomaticCarousels();
});

const productGalleries = new Map();
function initAutomaticCarousels() {
const catalogContainer = document.getElementById('catalogo-reflow');
if (!catalogContainer) return;
const observer = new MutationObserver((mutations) => {
mutations.forEach(mutation => {
mutation.addedNodes.forEach(node => {
if (node.nodeType === 1) {
const products = node.querySelectorAll('.ref-product');
products.forEach(processProductForCarousel);
if (node.classList.contains('ref-product')) processProductForCarousel(node);
}
});
});
});
observer.observe(catalogContainer, { childList: true, subtree: true });
}
async function processProductForCarousel(productEl) {
const id = productEl.getAttribute('data-reflow-product');
if (!id || productGalleries.has(id)) return;
try {
const response = await fetch(`https://api.reflowhq.com/v2/projects/${REFLOW_PROJECT_ID}/products/${id}`);
const data = await response.json();
if (data.gallery && data.gallery.length > 1) {
const images = [data.image, ...data.gallery.map(item => item.image)];
productGalleries.set(id, {
images: images,
currentIndex: 0,
element: productEl.querySelector('.ref-image img')
});
startCarouselInterval(id);
} else {
productGalleries.set(id, null);
}
} catch (err) {
console.error("Error al obtener galería para producto " + id, err);
}
}
function startCarouselInterval(productId) {
setInterval(() => {
const item = productGalleries.get(productId);
if (!item || !item.element) return;
item.currentIndex = (item.currentIndex + 1) % item.images.length;
const nextImage = item.images[item.currentIndex];
item.element.style.opacity = '0.5';
setTimeout(() => {
item.element.src = nextImage;
item.element.style.opacity = '1';
}, 500);
}, 4000);
}
