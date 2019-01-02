export default class HomePageComponent {
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
        <input type="button" data-id="${category.id}" class="button category-button" value="Explore ${
          category.key
        }">
      </section>
      <section class="${
        index % 2 === 1 ? "home-column-2-odd" : "home-column-2-even"
      }"><img class="category-img" src="${category.imageUrl}" alt="${
        category.name
      }"></section>       
  </section>`;
    }
  }