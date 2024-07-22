let iconCart = document.querySelector('.iconCart');
let cart = document.querySelector('.cart');
let container = document.querySelector('.container');
let close = document.querySelector('.close');

iconCart.addEventListener('click', () => {
    if (cart.style.right == '-100%') {
        cart.style.right = '0';
        container.style.transform = 'translateX(-400px)';
    } else {
        cart.style.right = '-100%';
        container.style.transform = 'translateX(0)';
    }
});

close.addEventListener('click', () => {
    cart.style.right = '-100%';
    container.style.transform = 'translateX(0)';
});

let products = null;

// Lấy dữ liệu từ file JSON
fetch('product.json')
    .then(response => response.json())
    .then(data => {
        products = data;
        addDataHTML();
    });

// Hiển thị danh sách sản phẩm trong HTML
function addDataHTML() {
    let listProductHTML = document.querySelector('.listProduct');
    listProductHTML.innerHTML = '';

    if (products != null) {
        products.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.innerHTML =
                `<img src="${product.image}">
                <h2>${product.name}</h2>
                <div class="price">$50</div>
                <button onclick="addCart(${product.id})">Add To Cart</button>`;
            listProductHTML.appendChild(newProduct);
        });
    }
}

let listCart = [];

// Lấy dữ liệu giỏ hàng từ cookie
function checkCart() {
    var cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('listCart='));
    if (cookieValue) {
        listCart = JSON.parse(cookieValue.split('=')[1]);
    }
}
checkCart();

// Thêm sản phẩm vào giỏ hàng
function addCart(idProduct) {
    let productCopy = JSON.parse(JSON.stringify(products));

    let existingProduct = listCart.find(product => product && product.id == idProduct);

    if (!existingProduct) {
        let dataProduct = productCopy.find(product => product.id == idProduct);
        dataProduct.quantity = 1;
        listCart.push(dataProduct);
    } else {
        existingProduct.quantity++;
    }

    let timeSave = "expires=Thu, 31 Dec 2025 23:59:59 UTC";
    document.cookie = "listCart=" + JSON.stringify(listCart) + "; " + timeSave + "; path=/;";
    addCartToHTML();
}
addDataHTML();

// Hiển thị giỏ hàng trong HTML
function addCartToHTML() {
    let listCartHTML = document.querySelector('.listCart');
    listCartHTML.innerHTML = '';

    let totalHTML = document.querySelector('.totalQuantity');
    let totalQuantity = 0;

    if (listCart) {
        listCart.forEach(product => {
            if (product) {
                let newCart = document.createElement('div');
                newCart.classList.add('item');
                newCart.innerHTML =
                    `<img src="${product.image}" alt="">
                <div class="content">
                    <div class="name">${product.name}</div>
                    <div class="price">$${product.price}/1 sản phẩm</div>
                </div>
                <div class="quantity">
                    <button onclick="updateQuantity(${product.id}, -1)">-</button>
                    <span class="value">${product.quantity}</span>
                    <button onclick="updateQuantity(${product.id}, 1)">+</button>
                </div>`;
                listCartHTML.appendChild(newCart);
                totalQuantity += product.quantity;
            }
        });
    }
    totalHTML.innerText = totalQuantity;
}

// Cập nhật số lượng sản phẩm trong giỏ hàng
function updateQuantity(idProduct, change) {
    let product = listCart.find(product => product && product.id == idProduct);
    if (product) {
        product.quantity += change;
        if (product.quantity <= 0) {
            listCart = listCart.filter(item => item.id != idProduct);
        }
        let timeSave = "expires=Thu, 31 Dec 2025 23:59:59 UTC";
        document.cookie = "listCart=" + JSON.stringify(listCart) + "; " + timeSave + "; path=/;";
        addCartToHTML();
    }
}
