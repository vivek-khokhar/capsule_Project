import LinkDropdownComponent from "./link-dropDown";
import AsideNavigationComponent from "./asideNav";

export default class ProductsDetailsPageComponent {
  constructor(categories, products, targetEleId) {
      this.productItems = [];
      this.categories ={};
      this.categoriesMap = {};
      categories.forEach(category => {
          this.categories[category.id] = [];
          this.categoriesMap[category.key] = category.id;
      })
      products.forEach(item => {
          this.productItems.push(this.productItem(item));
          this.categories[item.category].push(item);
      });
      let products = [];
      if(window.screen.width < 768) {
        products = this.categories[categories[0].id];
      }
      document.querySelector(`#${targetEleId}`).innerHTML = this.productPageContainerHtml();
      this.renderComponent(categories, products);  
  }

  renderComponent(categories, products) {
    new LinkDropdownComponent(categories, "nav-DropDown");
    new AsideNavigationComponent(categories, 'sidenav');
    document.querySelector(`#item-container`).innerHTML = products.join('');  
  }

  renderProductsList(selectedCategory) {
    document.querySelector(`#item-container`).innerHTML = this.productItems.join('');  
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
      <section>
      <input type="button" class="button pdp-button" value="Buy Now@Rs.${item.price}" />
    </section>
  </section>`;
  }
}
