export default class CartOverlayComponent {
  constructor(targetEl = "cart-overlay", cartService = new CartService()) {
    this.cartService = cartService;
    let cartHtml = "";
    this.targetEl = targetEl;
    let cartItems = this.cartService.cartItemCount();
    if (cartItems) {
      this.cartService.getCartItems().forEach(item => {
        cartHtml += this.cartItem(item);
      });
      cartHtml = cartHtml + this.cartOfferBanner();
    } else {
      cartHtml = this.emptyCartHTML();
    }
    document.querySelector(`#${targetEl}`).innerHTML = this.overLayMarkup(
      cartHtml
    );
    if (cartItems) {
      this.cartItemEvents();
    } else {
      this.emptyCartEvents();
    }
    this.cartEvents();
  }

  emptyCartHTML() {
    return `<section class="empty-cart">
        <h2>No Items in your cart</h2><h3> Your favourite items are just a click away</h3>     
              </section>`;
  }

  emptyCartEvents() {
    let btn = document.querySelector("#cartChechout");
    btn.innerText = "Start Shopping";
    btn.style["text-align"] = "center";
    document.querySelector("#promoText").classList.add("hidden");
  }

  cartOfferBanner() {
    return `<section class="lowest-price-banner">
        <img
          src="/static/images/lowest-price.png"/>
        <section>
          You won't find it cheaper anywhere
        </section>
      </section>`;
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
          <span  role="button" data-index="${
            item.sku
          }" name="decrease quantity"> - </span> 
          <span class="quantity" id="${item.sku}-qty">${item.quantity}</span>
          <span role="button" data-index="${
            item.sku
          }" name="increase quantity"> + </span> X Rs.${item.price}
        </section>
        <section id="${
          item.sku
        }-price" class="overlay-item-price">Rs.${item.price *
      item.quantity}</section>`;
  }

  cartItem(item) {
    return `<section id="${item.sku}" class="overlay-item-section">
              ${this.cartItemDetails(item)}
            </section>`;
  }
  quantityChangeEvent(ele, type) {
    let eventType = type == "add" ? "addToCart" : "removeFromeCart";
    let selectedItem = ele.target.attributes["data-index"].value;
    selectedItem = this.cartService.getItemBySKU(selectedItem);
    this.cartService[eventType](selectedItem).then(itemRemoved => {
      if (itemRemoved) {
        this.removeCartItem(itemRemoved[0]);
      } else {
        this.updateCartItem(selectedItem);
      }
    });
  }

  cartItemEvents() {
    document.querySelectorAll('[name="decrease quantity"]').forEach(item => {
      item.addEventListener("click", ele => {
        this.quantityChangeEvent(ele, "remove");
      });
    });

    document.querySelectorAll('[name="increase quantity"]').forEach(item => {
      item.addEventListener("click", ele => {
        this.quantityChangeEvent(ele, "add");
      });
    });
  }

  cartEvents() {
    document
      .querySelector("#close-overlay")
      .addEventListener("click", this.closeCart.bind(this));
    document
      .querySelector("#cartChechout")
      .addEventListener("click", this.closeCart.bind(this));
  }

  closeCart() {
    document.querySelector(`#${this.targetEl}`).innerHTML = "";
  }

  updateCartItem(selectedItem) {
    document.querySelector(`#${selectedItem.sku}-qty`).innerText =
      selectedItem.quantity;
    document.querySelector(`#${selectedItem.sku}-price`).innerText =
      "Rs." + selectedItem.quantity * selectedItem.price;
    document.querySelector(`#cartTotalPrice`).innerText =
      "Rs. " + this.cartService.getCartTotalPrice().toString() + "  >";
    let itemCount = this.cartService.cartItemCount();
    document.querySelector("#cartCount").innerText =
      itemCount + ` item${itemCount > 1 ? "s" : ""}`;
    document.querySelector("#cartTitleCount").innerText =
      "(" + itemCount ? itemCount + ` item${itemCount > 1 ? "s" : ""})` : "";
  }

  removeCartItem(selectedItem) {
    document.querySelector(`#${selectedItem.sku}`).remove();
    let itemCount = this.cartService.cartItemCount();
    document.querySelector("#cartCount").innerText =
      itemCount + ` item${itemCount > 1 ? "s" : ""}`;
    document.querySelector("#cartTitleCount").innerText =
      "(" + itemCount ? itemCount + ` item${itemCount > 1 ? "s" : ""})` : "";
    document.querySelector(`#cartTotalPrice`).innerText =
      "Rs. " + this.cartService.getCartTotalPrice().toString() + "  >";
    if (this.cartService.cartItemCount() === 0) {
      document.querySelector(
        `#${this.targetEl}`
      ).innerHTML = this.overLayMarkup(this.emptyCartHTML());
      this.emptyCartEvents();
      this.cartEvents();
    }
  }

  overLayMarkup(itemsString) {
    let itemCount = this.cartService.cartItemCount();
    let itemCountText = "(" + itemCount + ` item${itemCount > 1 ? "s" : ""})`;
    return `<section class="overlay"><section class="overlay-wrapper">
          <section class="overlay-item">
            <h1>
              My Cart <span id="cartTitleCount">${
                itemCount ? itemCountText : ""
              }</span><button id="close-overlay" class="close-overlay" role="button">X</button>
            </h1>
            ${itemsString}
  
            <section class="cart-checkout">
              <section id="promoText">Promo coder can be applied on payment page</section>
              <button id="cartChechout" type="button" class="button">
                Proceed to Checkout
                <span id="cartTotalPrice">
                  Rs. ${this.cartService.getCartTotalPrice()}  >
                </span>
              </button>
            </section>
          </section>
        </section>
        </section>`;
  }
}
