export default class CartService {
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
            this.cartItems.splice(itemIndex, 1);
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
            price = item.quantity * item.price;
        })
        return price;
    }

    getItemBySKU (sku) {
        return this.cartItems.find( item => {
            return item.sku === sku;
        })
    }
}

export default class CartOverlayComponent {
    constructor(targetEl = "cart-overlay", cartService = new CartService()) {
        this.cartService = cartService;
        let cartHtml = '';
        this.cartService.getCartItems().forEach((item) => {
            cartHtml += this.cartItem(item);
        });
        document.querySelector(`#${targetEl}`).innerHTML = this.overLayMarkup(cartHtml);
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
        ${item.quantity}
        <span role="button" data-index="${item.sku}" name="increase quantity"> + </span> X Rs.${item.price}
      </section>
      <section class="overlay-item-price">Rs.${item.price * item.quantity}</section>`;
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
                this.cartService.removeFromeCart(selectedItem);                
        })
        
        })
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
                Rs. ${this.cartService.getCartTotalPrice()} &gt;
              </span>
            </button>
          </section>
        </section>
      </section>
      </section>`;
    }
}