/* Stratton Oakmont — Inquiry Cart (localStorage based, no backend required) */
(function (window) {
  var KEY = 'so_cart_items_v1';

  function get() {
    try {
      var raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function save(items) {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {}
  }

  function add(item) {
    var items = get();
    var existing = items.find(function (i) { return i.id === item.id; });
    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
    } else {
      items.push({
        id: item.id,
        name: item.name,
        price: Number(item.price) || 0,
        meta: item.meta || '',
        qty: 1
      });
    }
    save(items);
    return items;
  }

  function remove(id) {
    var items = get().filter(function (i) { return i.id !== id; });
    save(items);
    return items;
  }

  function clear() {
    save([]);
  }

  function count() {
    return get().reduce(function (n, i) { return n + (i.qty || 1); }, 0);
  }

  function total() {
    return get().reduce(function (n, i) { return n + (i.price || 0) * (i.qty || 1); }, 0);
  }

  function formatAED(n) {
    return 'AED ' + Number(n).toLocaleString('en-AE');
  }

  function summaryText() {
    var items = get();
    if (!items.length) return '';
    var lines = items.map(function (i) {
      var qtyPart = i.qty > 1 ? ' x' + i.qty : '';
      return '- ' + i.name + qtyPart + ' (' + formatAED(i.price * (i.qty || 1)) + ')';
    });
    lines.push('Estimated Total: ' + formatAED(total()));
    return lines.join('\n');
  }

  window.SOCart = {
    get: get, save: save, add: add, remove: remove, clear: clear,
    count: count, total: total, formatAED: formatAED, summaryText: summaryText
  };
})(window);
