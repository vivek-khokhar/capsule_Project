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
  crousalImageHtml = (img, index) => {
    return `<img id="imagePlaceHolder" class="carousal-img" src="${
      img.bannerImageUrl
    }" alt="offer ${img.bannerImageAlt}" />`;
  };

  updateImage(index) {
    this.imageHolder.src = this.images[index].bannerImageUrl;
    this.imageHolder.alt = this.images[index].bannerImageAlt;
  }

  nextHandler = event => {
    this.index = this.images.length > this.index + 1 ? this.index + 1 : 0;
    this.updateImage(this.index);
    this.radiosUpdate(this.index);
  };

  prevHandler = event => {
    this.index = this.index - 1 > -1 ? this.index - 1 : this.images.length - 1;
    this.updateImage(this.index);
    this.radiosUpdate(this.index);
  };

  radiosUpdate = index => {
    this.radios.forEach(radio => {
      radio.classList.remove("active");
    });
    this.radios[index].classList.add("active");
  };

  radioHandler = event => {
    this.index = parseInt(event.target.attributes["data-index"].value);
    this.updateImage(this.index);
    this.radiosUpdate(this.index);
  };

  initalizeEvents() {
    this.prev.addEventListener("click", this.prevHandler);
    this.next.addEventListener("click", this.nextHandler);
    this.radios.forEach(item => {
      item.addEventListener("click", this.radioHandler);
    });
  }
}

let apiRequest1 = fetch("http://localhost:5000/banners").then(response => {
  return response.json();
});
var apiRequest2 = fetch("http://localhost:5000/categories").then(response => {
  return response.json();
});

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

Promise.all([apiRequest1, apiRequest2]).then(function(values) {
  values[1].sort((a, b) => a.order - b.order);
  values[1] =values[1].filter((item) => {
    return item.enabled;
  })
  new HomePageComponent(values[1], values[0], "routerOutlet");
});
