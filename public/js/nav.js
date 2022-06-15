// navbar

const navbar = document.querySelector('nav')

window.addEventListener('scroll', () => {
    if(scrollY >= 180) {
        navbar.classList.add('sticky');
    } else{
        navbar.classList.remove('sticky');
    }
    console.log(scrollY)
})

const createNavbar = () => {
    let navbar = document.querySelector('nav');

    navbar.innerHTML += `
        <!--Navbar has two part the top one and the bottom one-->
        <!--Here is top one and in this part I put logo, my account part, and the shopping cart-->
        <div class="navbar-top">
            <div>
                <button id="menuButton"><i class="fas fa-bars"></i></button>
                <!--Logo-->
                <img class="logo" src="img/logo1.png"></img>
            </div>
            <div>
                <!--My account part-->
                <div class="user">
                <img src="img/user=.png" class="user-icon" alt="">
                <div class="user-icon-popup">
                    <p>login to your account</p>
                    <a>login</a>
                </div>
            </div>
                <!--Shopping cart-->
                <div class="shopping-cart">
                    <div class="sum-prices">
                        <!--Shopping cart logo-->
                        <i
                            class="fas fa-shopping-cart shoppingCartButton"
                        ></i>
                        <!--The total prices of products in the shopping cart -->
                        <h6 id="sum-prices"></h6>
                    </div>
                </div>
            </div>
        </div>
        <!-- Navbar bottom part -->
        <div class="navbar" id="navbar">
            <div class="links">
                <ul>
                <li class="nav-links img"><a href="mailto:kilishijoint@gmail.com" class="link"><img src="img/email1.png" class="email"></a></li>
                <li class="nav-links img"><a href="tel:+2348105310275" class="link"><img src="img/phone1.png" class="phone"></a></li>
                    <li class="nav-links">
                        <a href="/" class="link">Home</a>
                    </li>
                    <li class="nav-links">
                        <a href="/product.html" class="link">Shop</a>
                    </li>
                    <li class="nav-links">
                        <a href="/about" class="link">About</a>
                    </li>
                </ul>
            </div>
        <!-- Here I put the links to the other pages or nav links -->
       
        <div class="producstOnCart hide">
            <div class="overlay"></div>
            <div class="top">
                <button id="closeButton">
                    <i class="fas fa-times-circle"></i>
                </button>
                <h3>Cart</h3>
            </div>
            <ul id="buyItems">
                <h4 class="empty">Your shopping cart is empty</h4>
                <!-- <li class="buyItem">
                    <img src="img/img3.jpeg">
                    <div>
                        <h5>Products Name</h5>
                        <h6>$199</h6>
                        <div>
                            <button>-</button>
                            <span class="countOfProduct">1</span>
                            <button>+</button>
                        </div>
                    </div>
                </li> -->
            </ul>
            <button class="btn checkout hidden"><a href="https://ravesandbox.flutterwave.com/pay/kilishijoint" class="checkout-btn">checkout</a></button>
            
        </div>

    `
}

createNavbar();

// cart

let productsInCart = JSON.parse(localStorage.getItem('shoppingCart'));
if(!productsInCart){
	productsInCart = [];
}
const parentElement = document.querySelector('#buyItems');
const cartSumPrice = document.querySelector('#sum-prices');
const products = document.querySelectorAll('.product-under');


const countTheSumPrice = function () { // 4
	let sum = 0;
	productsInCart.forEach(item => {
		sum += item.price;
	});
	return sum;
}

const updateShoppingCartHTML = function () {  // 3
	localStorage.setItem('shoppingCart', JSON.stringify(productsInCart));
	if (productsInCart.length > 0) {
		let result = productsInCart.map(product => {
			return `
				<li class="buyItem">
					<img src="${product.image}">
					<div>
						<h5>${product.name}</h5>
						<h6>N${product.price}</h6>
						<div>
							<button class="button-minus" data-id=${product.id}>-</button>
							<span class="countOfProduct">${product.count}</span>
							<button class="button-plus" data-id=${product.id}>+</button>
						</div>
					</div>
				</li>`
		});
		parentElement.innerHTML = result.join('');
		document.querySelector('.checkout').classList.remove('hidden');
		cartSumPrice.innerHTML = 'N' + countTheSumPrice();

	}
	else {
		document.querySelector('.checkout').classList.add('hidden');
		parentElement.innerHTML = '<h4 class="empty">Opps! Your shopping cart is empty</h4>';
		cartSumPrice.innerHTML = '';
	}
}

function updateProductsInCart(product) { // 2
	for (let i = 0; i < productsInCart.length; i++) {
		if (productsInCart[i].id == product.id) {
			productsInCart[i].count += 1;
			productsInCart[i].price = productsInCart[i].basePrice * productsInCart[i].count;
			return;
		}
	}
	productsInCart.push(product);
}

products.forEach(item => {   // 1
	item.addEventListener('click', (e) => {
		if (e.target.classList.contains('addToCart')) {
			const productID = e.target.dataset.productId;
			const productName = item.querySelector('.productName').innerHTML;
			const productPrice = item.querySelector('.priceValue').innerHTML;
			const productImage = item.querySelector('img').src;
			let product = {
				name: productName,
				image: productImage,
				id: productID,
				count: 1,
				price: +productPrice,
				basePrice: +productPrice,
			}
			updateProductsInCart(product);
			updateShoppingCartHTML();
		}
	});
});

parentElement.addEventListener('click', (e) => { // Last
	const isPlusButton = e.target.classList.contains('button-plus');
	const isMinusButton = e.target.classList.contains('button-minus');
	if (isPlusButton || isMinusButton) {
		for (let i = 0; i < productsInCart.length; i++) {
			if (productsInCart[i].id == e.target.dataset.id) {
				if (isPlusButton) {
					productsInCart[i].count += 1
				}
				else if (isMinusButton) {
					productsInCart[i].count -= 1
				}
				productsInCart[i].price = productsInCart[i].basePrice * productsInCart[i].count;

			}
			if (productsInCart[i].count <= 0) {
				productsInCart.splice(i, 1);
			}
		}
		updateShoppingCartHTML();
	}
});

updateShoppingCartHTML();

// user icon popup

let userIcon = document.querySelector('.user-icon');
let userPopupIcon = document.querySelector('.user-icon-popup');

userIcon.addEventListener('click', () => userPopupIcon.classList.toggle('active'))

let text = userPopupIcon.querySelector('p');
let actionBtn = userPopupIcon.querySelector('a');
let user = JSON.parse(sessionStorage.user || null);

if(user != null){ // user is logged in
    text.innerHTML = `Hey, ${user.name}`;
    actionBtn.innerHTML = 'log out';
    actionBtn.addEventListener('click', () => logout());
} else{
    text.innerHTML = 'login to your account';
    actionBtn.innerHTML = 'login';
    actionBtn.addEventListener('click', () => location.href = '/login');
}

const logout = () => {
    sessionStorage.clear()
    location.reload();
}

