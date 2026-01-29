var api = 'https://raw.githubusercontent.com/baonguyn123/NNTPTUDNgay2/main/db.json';
var allProducts = [];

function getProducts() {
   fetch(api)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      allProducts = data;  
      renderProducts(data);

    })  
}

function renderProducts(products) {
    const tbody = document.getElementById('product-list');

    const htmls = products.map(function(p) {
        return `<tr>
            <td>${p.id}</td>
            <td>${p.title}</td>
            <td>${p.description || 'Đang cập nhật'}</td>
            <td>${p.category?.name || 'Chưa phân loại'}</td>
            <td>$${p.price}</td>
            <td>
                <img src="${p.images[0]}" alt="${p.title}">
            </td>
        </tr>`;
    });

    tbody.innerHTML = htmls.join('');
}

function searchByName(keyword) {
    const filtered = allProducts.filter(function(p) {
        return p.title.toLowerCase().includes(keyword.toLowerCase());
    });
    renderProducts(filtered);
}

function sortByName(ascending) {
    allProducts.sort(function(a, b) {
        return ascending
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
    });
    renderProducts(allProducts);
}

function sortByPrice(ascending) {
    allProducts.sort(function(a, b) {
        return ascending
            ? a.price - b.price
            : b.price - a.price;
    });
    renderProducts(allProducts);

}

getProducts();
