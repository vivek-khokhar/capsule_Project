import LinkDropdownComponent from "./link-dropDown";
import AsideNavigationComponent from "./asideNav";

export default class ProductsDetailsPageComponent {
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
          this.cartService.addToCart(item).then(itemCount => {
            document.querySelector("#cartCount").innerText =
              itemCount + ` item${itemCount > 1 ? "s" : ""}`;
          });
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
