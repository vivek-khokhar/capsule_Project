class LinkDropdownComponent {
  constructor(categories, targetEle, selectedCategory) {
    this.links = [];
    selectedCategory = selectedCategory || categories[0].key;
    let selected;
    categories.forEach(category => {
      if (selectedCategory !== category.key) {
        this.links.push(this.dropDownLink(category, selectedCategory));
      } else {
        selected = category.name;
      }
    });
    document.querySelector(`#${targetEle}`).innerHTML = this.dropDownMarkup(
      this.links,
      selected
    );
  }

  dropDownMarkup(links, defaultCategory) {
    return `<ul class="clearfix">
            <li class="first">${defaultCategory} <i class="down"></i></a>
                <ul class="navList">
                    ${links.join("")}
                </ul>
            </li>
        </ul>`;
  }

  dropDownLink(category, selectedCategory) {
    return `<li><a id="${category.id}"href="#products/${category.key}" ">${
      category.name
    }</a></li>`;
  }
}

class AsideNavigationComponent {
  constructor(categories, targetEle, selectedCategory) {
    this.navLinks = [];
    categories.forEach(category => {
      this.navLinks.push(this.navLink(category, selectedCategory));
    });

    document.querySelector(`#${targetEle}`).innerHTML = this.asideMarkup(
      this.navLinks
    );
  }

  asideMarkup(links) {
    return `<nav>
          ${links.join("")}
        </nav>`;
  }

  navLink(category, selected) {
    return `<a class = "${
      selected && selected === category.key ? "active" : ""
    }"id="${category.id}"href="#products/${category.key}" ">${
      category.name
    }</a>`;
  }
}

class ProductsDetailsPageComponent {
  constructor(categories, products, targetEleId, cartService, filter) {
    this.productItems = [];

    this.categories = {};
    this.selectedProducts = {};
    this.products = {};
    let filteredCategory = categories.find(item => item.key === filter);
    this.selectedCategory = filteredCategory ? filteredCategory.id : "all";
    this.categories["all"] = [];
    this.products["all"] = [];
    categories.forEach(category => {
      this.categories[category.id] = [];
      this.products[category.id] = [];
    });

    this.cartService = cartService;

    products.forEach(item => {
      this.categories[item.category].push(this.productItem(item));
      this.categories["all"].push(this.productItem(item));
      this.products[item.category].push(item);
      this.products["all"].push(item);
    });

    if (window.screen.width < 768 && !filter && filteredCategory === "all") {
      this.productItems = this.categories[categories[0].id];
      this.selectedCategory = categories[0].id;
    } else {
      this.productItems = this.categories[this.selectedCategory];
    }

    document.querySelector(
      `#${targetEleId}`
    ).innerHTML = this.productPageContainerHtml();
    this.renderComponent(categories, filter);
  }

  renderComponent(categories, selectedCategory) {
    new LinkDropdownComponent(categories, "nav-DropDown", selectedCategory);
    new AsideNavigationComponent(categories, "nav-aside", selectedCategory);
    document.querySelector(
      `#item-container`
    ).innerHTML = this.productItems.join("");
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
    let products = this.products[this.selectedCategory];
    products.forEach(item => {
      document
        .querySelector(`#${item.sku}-buyNow`)
        .addEventListener("click", e => {
          this.cartService.addToCart(item);
          let itemCount = this.cartService.cartItemCount();
          document.querySelector("#cartCount").innerText =
            itemCount + ` item${itemCount > 1 ? "s" : ""}`;
        });
    });
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
        <input type="button" id="${item.sku}-buyNow" data-sku="${
      item.sku
    }" class="button pdp-button" value="Buy Now@Rs.${item.price}" />
      </section>
    </section>`;
  }
}

class CartService {
  constructor() {
    this.cartItems = [];
  }

  addToCart(item) {
    let itemIndex = this.cartItems.findIndex(prdct => {
      return prdct.sku === item.sku;
    });
    if (itemIndex > -1) {
      this.cartItems[itemIndex].quantity += 1;
    } else {
      item.quantity = 1;
      this.cartItems.push(item);
    }
  }

  removeFromeCart(item) {
    let itemIndex = this.cartItems.findIndex(prdct => {
      return prdct.id === item.id;
    });
    if (this.cartItems[itemIndex].quantity > 1) {
      this.cartItems[itemIndex].quantity -= 1;
    } else {
      return this.cartItems.splice(itemIndex, 1);
    }
  }

  cartItemCount() {
    let qty = 0;
    this.cartItems.forEach(item => {
      qty += item.quantity;
    });
    return qty;
  }

  getCartItems() {
    return JSON.parse(JSON.stringify(this.cartItems));
  }

  getCartTotalPrice() {
    let price = 0;
    this.cartItems.forEach(item => {
      price += item.quantity * item.price;
    });
    return price;
  }

  getItemBySKU(sku) {
    return this.cartItems.find(item => {
      return item.sku === sku;
    });
  }
}
class CartOverlayComponent {
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
    let itemRemoved = this.cartService[eventType](selectedItem);
    if (itemRemoved) {
      this.removeCartItem(itemRemoved[0]);
    } else {
      this.updateCartItem(selectedItem);
    }
  }

  cartItemEvents() {
    document.querySelectorAll('[name="decrease quantity"]').forEach(item => {
      item.addEventListener("click", ele => {
        this.quantityChangeEvent(ele, 'remove');
      });
    });

    document.querySelectorAll('[name="increase quantity"]').forEach(item => {
      item.addEventListener("click", ele => {
        this.quantityChangeEvent(ele, 'add');
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
  }

  removeCartItem(selectedItem) {
    document.querySelector(`#${selectedItem.sku}`).remove();
    let itemCount = this.cartService.cartItemCount();
    document.querySelector("#cartCount").innerText =
      itemCount + ` item${itemCount > 1 ? "s" : ""}`;
    document.querySelector(`#cartTotalPrice`).innerText =
      "Rs. " + this.cartService.getCartTotalPrice().toString() + "  >";
    if(this.cartService.cartItemCount() === 0) {
        document.querySelector(`#${this.targetEl}`).innerHTML = this.overLayMarkup(
            this.emptyCartHTML()
          );
          this.emptyCartEvents();
          this.cartEvents();
    }
  }

  overLayMarkup(itemsString) {
    let itemCount = this.cartService.cartItemCount();
    let itemCountText = '(' +itemCount + ` item${itemCount > 1 ? "s" : ""})`;
    return `<section class="overlay"><section class="overlay-wrapper">
        <section class="overlay-item">
          <h1>
            My Cart <span>${ itemCount ? itemCountText : ''}</span><button id="close-overlay" class="close-overlay" role="button">X</button>
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

class DataAccessLayer {
  async banners() {
    return await fetch("http://localhost:5000/banners").then(response => {
      return response.json();
    });
  }
  async categories() {
    return await fetch("http://localhost:5000/categories")
      .then(response => {
        return response.json();
      })
      .then(values => {
        values.sort((a, b) => a.order - b.order);
        return values.filter(item => {
          return item.enabled;
        });
      });
  }
  async products() {
    return await fetch("http://localhost:5000/products").then(response => {
      return response.json();
    });
  }
}

class HomePageComponent {
  constructor(categories, offers, targetElement) {
    this.categories = [];
    categories.forEach((info, index) => {
      this.categories.push(this.categoriesInfoCard(info, index + 1));
    });
    document.querySelector(`#${targetElement}`).innerHTML = this.homePageHtml(
      this.categories,
      this.carousalPlaceHolder()
    );
    // initialize carousal
    new CarousalComponent(offers, "#carousalPlaceholder");
    // initalize click events
    this.initalizeNavEvents(categories);
  }

  homePageHtml(categories, carousal) {
    return `<section class="home-container"> ${carousal} ${categories.join(
      ""
    )} </section>`;
  }

  carousalPlaceHolder() {
    return `<section id="carousalPlaceholder" class="crousal-container home-item"></section>`;
  }

  categoriesInfoCard(category, index) {
    return `<section id="productsCategories${index}" class="home-categories home-item">
      <section  class="${
        index % 2 === 1 ? "home-column-1-odd" : "home-column-1-even"
      }"><h3>${category.name}</h3>
      ${category.description}</br>
        <input type="button" class="button category-button" id="go-to-${
          category.key
        }" value="Explore ${category.key}">
      </section>
      <section class="${
        index % 2 === 1 ? "home-column-2-odd" : "home-column-2-even"
      }"><img class="category-img" src="${category.imageUrl}" alt="${
      category.name
    }"></section>       
  </section>`;
  }

  initalizeNavEvents(categories) {
    categories.forEach(item => {
      document
        .querySelector(`#go-to-${item.key}`)
        .addEventListener("click", () => {
          window.location.hash = `#products/${item.key}`;
        });
    });
  }
}

class CarousalComponent {
  constructor(images, targetElement) {
    this.index = 0;
    this.images = images;
    this.crousalRadioHtml = [];
    this.imageElement = this.crousalImageHtml(images[this.index], this.index);
    images.forEach((img, index) => {
      this.crousalRadioHtml.push(
        `<span role="radio" for="${img}" class="dot${
          index === 0 ? " active" : ""
        }" data-index="${index}" name="carousal-image-navigation"></span>`
      );
    });
    this.carousalSection = this.carousalHtmlContainer(
      this.imageElement,
      this.crousalRadioHtml
    );
    document.querySelector(targetElement).innerHTML = this.carousalSection;
    this.setDomElementRef();
    this.initalizeEvents();
  }

  setDomElementRef() {
    this.next = document.querySelector("#next");
    this.prev = document.querySelector("#prev");
    this.radios = document.querySelectorAll("[name=carousal-image-navigation]");
    this.imageHolder = document.querySelector("#imagePlaceHolder");
  }

  carousalHtmlContainer(imageElement, radioList) {
    return `
      <section id="prev" class="carousal-image-nav-left">PREV</section>
        ${imageElement}
      <section id="next" class="carousal-image-nav-right">Next</section>
      <section class="carousal-nav-radio">   
      ${radioList.join("")}
      </section>`;
  }
  crousalImageHtml(img, index) {
    return `<img id="imagePlaceHolder" class="carousal-img" src="${
      img.bannerImageUrl
    }" alt="offer ${img.bannerImageAlt}" />`;
  }

  updateImage(index) {
    this.imageHolder.src = this.images[index].bannerImageUrl;
    this.imageHolder.alt = this.images[index].bannerImageAlt;
  }

  nextHandler(event) {
    this.index = this.images.length > this.index + 1 ? this.index + 1 : 0;
    this.updateImage(this.index);
    this.radiosUpdate(this.index);
  }

  prevHandler(event) {
    this.index = this.index - 1 > -1 ? this.index - 1 : this.images.length - 1;
    this.updateImage(this.index);
    this.radiosUpdate(this.index);
  }

  radiosUpdate(index) {
    this.radios.forEach(radio => {
      radio.classList.remove("active");
    });
    this.radios[index].classList.add("active");
  }

  radioHandler(event) {
    this.index = parseInt(event.target.attributes["data-index"].value);
    this.updateImage(this.index);
    this.radiosUpdate(this.index);
  }

  initalizeEvents() {
    this.prev.addEventListener("click", this.prevHandler);
    this.next.addEventListener("click", this.nextHandler);
    this.radios.forEach(item => {
      item.addEventListener("click", this.radioHandler);
    });
  }
}

class SignInComponent {
  constructor(targetEl) {
    document.querySelector(`#${targetEl}`).innerHTML = this.signInTemplate();
    this.eventsHookUp();
  }

  eventsHookUp() {
    document.querySelectorAll('[class="form-input"]').forEach((item) => {
        item.addEventListener('focus',(event) => {
            const type = event.target.attributes['type'].value;
            document.querySelector(`[for="${type}"]`).classList.remove('hidden');
        })
    })

}

  signInTemplate() {
    return `<section  class="content login-main">
        <section class="login-section login-section-item1">
            <section class="heading margin-top-25px">Login</section>
            <section class="bold margin-top-25px">Get access to your Orders, Wishlist and Recommendations</section>
        </section>
        <section class="login-section login-section-item2">
            <form>
                <label class="form-label bold hidden" for="email">Email</label>
                <input class="form-input" type="email" id="email" placeholder="Email" required>
                <label class="form-label bold hidden" for="password">Password</label>
                <input class="form-input" type="password" id="password" placeholder="Password" required>
                <button id="login" class="button" disabled>Login</button></div>
            </form>
            </section>
    </section>`;
  }
}

class RegisterComponent {
  constructor(targetEl) {
    document.querySelector(`#${targetEl}`).innerHTML = this.signInTemplate();
  }

  signInTemplate() {
    return `<section  class="content login-main">
          <section class="login-section login-section-item1">
              <section class="heading margin-top-25px">Signup</section>
              <section class="bold margin-top-25px">We do not share your personal details with anyone.</section>
          </section>
          <section class="login-section login-section-item2">
              <form>
                      <label class="form-label bold hidden" for="firstName">First Name</label>
                      <input class="form-input" type="text" name="firstName" id="firstName" placeholder="First Name" required>
                      <label class="form-label bold hidden" for="lastName">Last Name</label>
                      <input class="form-input" type="text" name="lastName" id="lastName" placeholder="Last Name" required>
                  <label class="form-label bold hidden" for="Email">Email</label>
                  <input class="form-input" type="email" name ="email" id="email" placeholder="Email" required>
                  <label class="form-label bold hidden" for="password">Password</label>
                  <input class="form-input" type="password" name="password" id="password" placeholder="Password" required>
                  <label class="form-label bold hidden" for="confirmPassword">Password</label>
                  <input class="form-input" type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirm Password" required>
                  <button class="button">Login</button></div>
              </form>
              </section>
      </section>`;
  }
}

class RouterConfigurationService {
  constructor(dal = new DataAccessLayer(), cartService = new CartService()) {
    this.cartService = cartService;
    this.banners = dal.banners();
    this.categories = dal.categories();
    this.products = dal.products();
    this.initEventListeners();
    this.config();
  }

  homeRoute() {
    Promise.all([this.categories, this.banners]).then(values => {
      new HomePageComponent(values[0], values[1], "routerOutlet");
    });
  }

  config(path, param) {
    switch (path) {
      case "#home":
        this.homeRoute();
        break;
      case "#products":
        Promise.all([this.categories, this.products]).then(values => {
          new ProductsDetailsPageComponent(
            values[0],
            values[1],
            "routerOutlet",
            this.cartService,
            param
          );
        });
        break;
      case "#signIn":
        new SignInComponent("routerOutlet");
        break;
      case "#register":
        new RegisterComponent("routerOutlet");
        break;
      default:
        this.homeRoute();
        break;
    }
  }

  initEventListeners() {
    document.querySelector("nav.cart").addEventListener("click", e => {
      new CartOverlayComponent("cart-overlay", this.cartService);
    });
    window.addEventListener("hashchange", this.eventHandler.bind(this));
    window.addEventListener("load", this.eventHandler.bind(this));
  }
  // let routes = {
  //   "/": HomeComponent,
  //   "/products/:id": ProductPage,
  //   "/cart": CartComponent,
  //   "/signin": SigninComponent,
  //   "/signup": SignupComponent
  // };
  // let router = () => {
  //   let request = this.utils.parseRequestURL();
  //   let parsedURL =
  //     (request.resource ? "/" + request.resource : "/") +
  //     (request.id ? "/:id" : "") +
  //     (request.verb ? "/" + request.verb : "");
  //   let page = routes[parsedURL] ? routes[parsedURL] : Error404;
  //   if (parsedURL == "/cart") {
  //     $("#overlay")[0].style.display = "block";
  //     new page("#overlay", request);
  //   } else {
  //     $("#overlay")[0].style.display = "none";
  //     new page(".content", request);
  //   }
  // };

  eventHandler(event) {
    let hashPath = window.location.hash.split("/");
    if (hashPath.length > 1) {
      this.config(hashPath[0], hashPath[1]);
    } else {
      this.config(hashPath[0]);
    }
  }
}

new RouterConfigurationService();

// let cartService = new CartService();
// let apiRequest1 = fetch("http://localhost:5000/products").then(response => {
//   return response.json();
// });
// var apiRequest2 = fetch("http://localhost:5000/categories").then(response => {
//   return response.json();
// });
// Promise.all([apiRequest1, apiRequest2]).then(function(values) {
//   values[1].sort((a, b) => a.order - b.order);
//   values[1] = values[1].filter(item => {
//     return item.enabled;
//   });
//   new ProductsDetailsPageComponent(
//     values[1],
//     values[0],
//     "routerOutlet",
//     cartService
//   );
//   document.querySelector("nav.cart").addEventListener("click", e => {
//     new CartOverlayComponent("cart-overlay", cartService);
//   });
// });
