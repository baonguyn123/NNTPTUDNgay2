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
    const sorted = [...allProducts].sort(function(a, b) {
        if (ascending) {
            return a.title.localeCompare(b.title);
        } else {
            return b.title.localeCompare(a.title);
        }
    });
    renderProducts(sorted);
}

function sortByPrice(ascending) {
    const sorted = [...allProducts].sort(function(a, b) {
        if (ascending) {
            return a.price - b.price;
        } else {
            return b.price - a.price;
        }
    });
    renderProducts(sorted);
}

getProducts();
