import HomePageComponent from './scripts/home';
import DataAccessLayer from './services/dal';
import CartService from './services/cartService';
import ProductsDetailsPageComponent from './scripts/productDetailsPage';
import SignInComponent from './scripts/signIn';
import RegisterComponent from './scripts/register';
import CartOverlayComponent from './scripts/cart-Overlay';
import  './styles/styles.scss';

export default class RouterConfigurationService {
  constructor(dal = new DataAccessLayer()) {
    this.cartService = new CartService(dal);
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

  productsPage(param) {
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
        this.productsPage(param);
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
