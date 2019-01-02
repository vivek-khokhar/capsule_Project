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
    constructor(categories, products, targetEleId) {
        this.productItems = [];
        this.categories ={};
        categories.forEach(category => {
            this.categories[category.id] = [];
        })
        
        products.forEach(item => {
            this.productItems.push(this.productItem(item));
            this.categories[item.category].push(this.productItem(item));
        });

        if(window.screen.width < 768) {
            this.productItems = this.categories[categories[0].id];
        }

        document.querySelector(`#${targetEleId}`).innerHTML = this.productPageContainerHtml();
        this.renderComponent(categories);  
    }
  
    renderComponent(categories) {
      new LinkDropdownComponent(categories, "nav-DropDown");
      new AsideNavigationComponent(categories, 'nav-aside');
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
        <input type="button" class="button pdp-button" value="Buy Now@Rs.${item.price}" />
      </section>
    </section>`;
    }
  }

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
  new ProductsDetailsPageComponent(values[1], values[0],'routerOutlet');
});