class LinkDropdownComponent {
    constructor(categories, targetEle) {
        this.links = [];
        categories.forEach(category => {
            this.links.push(this.dropDownLink(category));
        });

        document.querySelector(`#${targetEle}`).innerHTML = this.dropDownMarkup(this.links, categories[0].name);

    }

    dropDownMarkup(links, defaultCategory) {
        return `<ul class="clearfix">
            <li class="first">${defaultCategory} <i class="down"></i></a>
                <ul class="navList">
                    ${links.join('')}
                </ul>
            </li>
        </ul>`;
    }

    dropDownLink(category) {
        return `<li><a id="${category.id}"href="#${category.key}" ">${category.name}</a></li>`;
    }
}

class AsideNavigationComponent {
    constructor(categories, targetEle) {
        this.navLinks = [];
        categories.forEach(category => {
            this.navLinks.push(this.navLink(category));
        });

        document.querySelector(`#${targetEle}`).innerHTML = this.asideMarkup(this.navLinks);

    }

    asideMarkup(links) {
        return `<nav>
          ${links.join('')}
        </nav>`;
    }

    navLink(category) {
        return `<a id="${category.id}"href="#${category.key}" ">${category.name}</a>`;
    }
}

class ProductsDetailsPageComponent {
    constructor(categories, products, targetEleId, cartService) {
        this.productItems = [];
        this.categories ={};
        this.selectedProducts = {};
        this.selectedCategory = '';
        this.selectedProducts['all'] = products;
        categories.forEach(category => {
            this.categories[category.id] = [];
            this.selectedProducts[category.id] = [];
        });

        this.cartService = cartService;
        
        products.forEach(item => {
            this.productItems.push(this.productItem(item));
            this.categories[item.category].push(this.productItem(item));
            this.selectedProducts[item.category].push(item);
        });

        if(window.screen.width < 768) {
            this.productItems = this.categories[categories[0].id];
            this.selectedCategory = categories[0].id;
        }

        document.querySelector(`#${targetEleId}`).innerHTML = this.productPageContainerHtml();
        this.renderComponent(categories);  
    }
  
    renderComponent(categories) {
      new LinkDropdownComponent(categories, "nav-DropDown");
      new AsideNavigationComponent(categories, 'nav-aside');
      document.querySelector(`#item-container`).innerHTML = this.productItems.join('');
      this.addToCartListener();
    }
    
    productPageContainerHtml() {
      return `<section class="pdp-page-container">
          <nav id="nav-DropDown" class="dropdown-nav" role="navigation"></nav>
          <aside id="nav-aside" role="navigation" class="sidenav">
          </aside>
          <section id="item-container" class="pdp-item-container">
          </section>
        </section>`;
    }

    addToCartListener() {
        let products;
        if(this.selectedCategory) {
            products = this.selectedProducts[this.selectedCategory];
        } else {
            products = this.selectedProducts['all'];
        }
        products.forEach( item => {
            document.querySelector(`#${item.sku}-buyNow`).addEventListener('click', (e) => {
                this.cartService.addToCart(item);
                let itemCount = this.cartService.cartItemCount();
                document.querySelector('#cartCount').innerText = itemCount + ` item${itemCount > 1 ? '' : 's'}`;
            })
        })
    }
  
    productItem(item) {
      return `<section class="pdp-item">
      <h1>${item.name}</h1>
      <section class="item-details-container">
        <img
          src="${item.imageURL}"
          alt="${item.description}"
          class="pdp-image"
        />
        <section class="pdp-description">
        <section>
        ${item.description}
        </section>
        </section>
        <input type="button" id="${item.sku}-buyNow" data-sku="${item.sku}" class="button pdp-button" value="Buy Now@Rs.${item.price}" />
      </section>
    </section>`;
    }
  }

  class CartService {
    constructor() {
        this.cartItems = [{
            "name": "Fresho Kiwi - Green, 3 pcs",
            "imageURL": "/static/images/products/fruit-n-veg/kiwi-green.jpg",
            "description": "Kiwis are oval shaped with a brownish outer skin. The flesh is bright green and juicy with tiny, edible black seeds.",
            "price": 87,
            "stock": 50,
            "category": "5b6899953d1a866534f516e2",
            "sku": "fnw-kiwi-3",
            "id": "5b6c6a7f01a7c38429530883",
            "quantity" : 1
          },
          {
            "name": "Apple - Washington, Regular, 4 pcs",
            "imageURL": "/static/images/products/fruit-n-veg/apple.jpg",
            "description": "The bright red coloured and heart shaped Washington apples are crunchy, juicy and slightly sweet. Washington Apples are a natural source of fibre and are fat free.",
            "price": 187,
            "stock": 50,
            "category": "5b6899953d1a866534f516e2",
            "sku": "fnw-apple-4",
            "id": "5b6c6aeb01a7c38429530884",
            "quantity" : 4
          }]
    }

    addToCart(item) {
        let itemIndex = this.cartItems.findIndex((prdct) => {
            return prdct.sku === item.sku;
        });
        if (itemIndex > 0 ) {
            this.cartItems[itemIndex].quantity += 1;
        } else {
            item.quantity = 1;
            this.cartItems.push(item);
        }
    }

    removeFromeCart(item) {
        let itemIndex = this.cartItems.findIndex((prdct) => {
            return prdct.id === item.id;
        });
        if (this.cartItems[itemIndex].quantity > 1 ) {
            this.cartItems[itemIndex].quantity -= 1;
        } else {
            return this.cartItems.splice(itemIndex, 1);
        }
    }

    cartItemCount() {
        let qty = 0;
        this.cartItems.forEach(item => {
            qty+= item.quantity;
        })
        return qty;
    }

    getCartItems() {
        return JSON.parse(JSON.stringify(this.cartItems));
    }

    getCartTotalPrice() {
        let price = 0;
        this.cartItems.forEach(item => {
            price += item.quantity * item.price;
        })
        return price;
    }

    getItemBySKU (sku) {
        return this.cartItems.find( item => {
            return item.sku === sku;
        })
    }
}
 class CartOverlayComponent {
    constructor(targetEl = "cart-overlay", cartService = new CartService()) {
        this.cartService = cartService;
        let cartHtml = '';
        this.cartService.getCartItems().forEach((item) => {
            cartHtml += this.cartItem(item);
        });
        document.querySelector(`#${targetEl}`).innerHTML = this.overLayMarkup(cartHtml);
        this.cartItemEvents();
    }

    cartItemDetails(item) {
        return `<img
        src="${item.imageURL}"
        alt="${item.name}"
      />
      <section>
        <section class="item-title">
          <h3>${item.name}</h3>
        </section>
        <span  role="button" data-index="${item.sku}" name="decrease quantity"> - </span> 
        <span class="quantity" id="${item.sku}-qty">${item.quantity}</span>
        <span role="button" data-index="${item.sku}" name="increase quantity"> + </span> X Rs.${item.price}
      </section>
      <section id="${item.sku}-price" class="overlay-item-price">Rs.${item.price * item.quantity}</section>`;
    }

    cartItem(item) {
        return `<section id="${item.sku}" class="overlay-item-section">
            ${this.cartItemDetails(item)}
          </section>`;
    }

    cartItemEvents() {
        document.querySelectorAll('[name="decrease quantity"]').forEach(item => {
            item.addEventListener('click', (ele) => {
                let selectedItem = ele.target.attributes['data-index'].value;
                selectedItem = this.cartService.getItemBySKU(selectedItem);
                let itemRemoved = this.cartService.removeFromeCart(selectedItem);
                if(itemRemoved) {
                    this.removeCartItem(itemRemoved[0]);
                } else {
                    this.updateCartItem(selectedItem);
                }
        })
        
        })
    }

    updateCartItem(selectedItem) {
        document.querySelector(`#${selectedItem.sku}-qty`).innerText = selectedItem.quantity;
        document.querySelector(`#${selectedItem.sku}-price`).innerText = 'Rs.' + (selectedItem.quantity * selectedItem.price);
        document.querySelector(`#cartTotalPrice`).innerText = 'Rs. ' + this.cartService.getCartTotalPrice().toString() + '  >';
    }

    removeCartItem(selectedItem) {
        document.querySelector(`#${selectedItem.sku}`).remove();
        document.querySelector(`#cartTotalPrice`).innerText = 'Rs. ' + this.cartService.getCartTotalPrice().toString() + '  >';
    }


    overLayMarkup(itemsString) {
        return `<section class="overlay"><section class="overlay-wrapper">
        <section class="overlay-item">
          <h1>
            My Cart <span>(1 iteam)</span><span class="close-overlay" role="button">X</span>
          </h1>
          ${itemsString}
          <section class="lowest-price-banner">
            <img
              src="/static/images/lowest-price.png"/>
            <section>
              You won't find it cheaper anywhere
            </section>
          </section>
          <section class="cart-checkout">
            Promo coder can be applied on payment page
            <button type="button" class="button">
              Proceed to Checkout
              <span id="cartTotalPrice">
                Rs. ${this.cartService.getCartTotalPrice()}  >;
              </span>
            </button>
          </section>
        </section>
      </section>
      </section>`;
    }
}

let cartService = new CartService()
let apiRequest1 = fetch("http://localhost:5000/products").then(response => {
  return response.json();
});
var apiRequest2 = fetch("http://localhost:5000/categories").then(response => {
  return response.json();
});
Promise.all([apiRequest1, apiRequest2]).then(function(values) {
  values[1].sort((a, b) => a.order - b.order);
  values[1] =values[1].filter((item) => {
    return item.enabled;
  })
  new ProductsDetailsPageComponent(values[1], values[0],'routerOutlet', cartService);
  document.querySelector('nav.cart').addEventListener('click', (e) => {
      new CartOverlayComponent('cart-overlay', cartService);
  })
});