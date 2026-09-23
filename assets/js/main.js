/* Stratton Oakmont — Site interactions */
document.addEventListener('DOMContentLoaded', function () {

  /* Mobile nav toggle */
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      mainNav.classList.toggle('open');
    });
    mainNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { mainNav.classList.remove('open'); });
    });
  }

  /* Active nav link */
  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(function (a) {
    var href = a.getAttribute('href').split('#')[0];
    if (href === path) a.classList.add('active');
  });

  /* ---- Cart drawer ---- */
  var cartBtn = document.getElementById('cartBtn');
  var cartDrawer = document.getElementById('cartDrawer');
  var cartOverlay = document.getElementById('cartOverlay');
  var cartClose = document.getElementById('cartClose');
  var cartItemsEl = document.getElementById('cartItems');
  var cartTotalEl = document.getElementById('cartTotal');
  var cartCountEls = document.querySelectorAll('.cart-count');
  var cartClear = document.getElementById('cartClear');

  function openDrawer() {
    if (cartDrawer) cartDrawer.classList.add('open');
    if (cartOverlay) cartOverlay.classList.add('open');
  }
  function closeDrawer() {
    if (cartDrawer) cartDrawer.classList.remove('open');
    if (cartOverlay) cartOverlay.classList.remove('open');
  }

  function renderCart() {
    if (!window.SOCart) return;
    var items = SOCart.get();
    cartCountEls.forEach(function (el) { el.textContent = SOCart.count(); });
    if (!cartItemsEl) return;

    if (!items.length) {
      cartItemsEl.innerHTML = '<div class="cart-empty">Your inquiry list is empty.<br>Browse the <a href="shop.html" style="text-decoration:underline;color:var(--black)">shop</a> or <a href="services.html" style="text-decoration:underline;color:var(--black)">services</a> to add items.</div>';
    } else {
      cartItemsEl.innerHTML = items.map(function (i) {
        return '<div class="cart-item">' +
          '<div>' +
            '<div class="cart-item-name">' + i.name + (i.qty > 1 ? ' × ' + i.qty : '') + '</div>' +
            '<div class="cart-item-meta">' + (i.meta || '') + '</div>' +
            '<button class="cart-item-remove" data-remove="' + i.id + '">Remove</button>' +
          '</div>' +
          '<div class="cart-item-price">' + SOCart.formatAED(i.price * (i.qty || 1)) + '</div>' +
        '</div>';
      }).join('');
    }
    if (cartTotalEl) cartTotalEl.textContent = SOCart.formatAED(SOCart.total());

    cartItemsEl.querySelectorAll('[data-remove]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        SOCart.remove(btn.getAttribute('data-remove'));
        renderCart();
      });
    });
  }

  if (cartBtn) cartBtn.addEventListener('click', function (e) { e.preventDefault(); openDrawer(); renderCart(); });
  if (cartClose) cartClose.addEventListener('click', closeDrawer);
  if (cartOverlay) cartOverlay.addEventListener('click', closeDrawer);
  if (cartClear) cartClear.addEventListener('click', function () { SOCart.clear(); renderCart(); });

  /* ---- Add to inquiry buttons ---- */
  document.querySelectorAll('.add-to-cart-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      SOCart.add({
        id: btn.getAttribute('data-id'),
        name: btn.getAttribute('data-name'),
        price: btn.getAttribute('data-price'),
        meta: btn.getAttribute('data-meta')
      });
      renderCart();
      openDrawer();
      var original = btn.textContent;
      btn.textContent = 'Added ✓';
      setTimeout(function () { btn.textContent = original; }, 1400);
    });
  });

  /* ---- Shop filter tabs ---- */
  var tabs = document.querySelectorAll('.filter-tab');
  var cards = document.querySelectorAll('[data-category]');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      var cat = tab.getAttribute('data-filter');
      cards.forEach(function (card) {
        card.style.display = (cat === 'all' || card.getAttribute('data-category') === cat) ? '' : 'none';
      });
    });
  });

  renderCart();
});
