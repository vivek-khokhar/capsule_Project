import HomePageComponent from './'

export default class RouterConfigurationService {
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

  products(param) {
    Promise.all([this.categories, this.products]).then(values => {
      new ProductsDetailsPageComponent(
        values[0],
        values[1],
        "routerOutlet",
        this.cartService,
        param
      );
    });
  }

  config(path, param) {
    switch (path) {
      case "#home":
        this.homeRoute();
        break;
      case "#products":
        products(param);
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
