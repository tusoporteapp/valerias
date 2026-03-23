

function switchView(viewName) {
document.querySelectorAll('.view-section').forEach(el => {
el.classList.remove('active');
});
const target = document.getElementById('view-' + viewName);
if (target) {
target.classList.add('active');
if (viewName === 'cart' && typeof renderCustomCart === 'function') {
renderCustomCart();
}
}
window.scrollTo({ top: 0, behavior: 'smooth' });
}
