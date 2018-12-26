class TemplateEngine {
  constructor(images, targetElement) {
    this.index = 0;
    this.images = images;
    this.crousalRadioHtml = [];
    this.imageElement = this.crousalImageHtml(images[this.index], this.index);
    images.forEach((img, index) => {
      this.crousalRadioHtml.push(
        `<span role="radio" for="${img}" class="dot${index === 0 ? ' active' : ''}" data-index="${index}" name="carousal-image-navigation"></span>`
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
    return `<img id="imagePlaceHolder" class="carousal-img" src="${img.bannerImageUrl}" alt="offer ${img.bannerImageAlt}" />`;
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
    this.radios[index].classList.add("active");;
  };

  radioHandler = (event) => {
    this.index = parseInt(event.target.attributes['data-index'].value);
    this.updateImage(this.index);
    this.radiosUpdate(this.index);
  };

  initalizeEvents() {
    this.prev.addEventListener("click", this.prevHandler);
    this.next.addEventListener("click", this.nextHandler);
    this.radios.forEach((item) => {
        item.addEventListener('click', this.radioHandler);
    });
  }
}
// let images = [
//   "../static/images/offers/offer1.jpg",
//   "../static/images/offers/offer2.jpg",
//   "../static/images/offers/offer3.jpg",
//   "../static/images/offers/offer4.jpg",
//   "../static/images/offers/offer5.jpg"
// ];

class HomePageComponent {
  constructor(categories, ) {

  }
}
fetch('http://localhost:5000/banners').then((response) => response.json()).then((data) => {
    new TemplateEngine(data, "#carousalPlaceholder");
})
//let carousal = new TemplateEngine(images, "#carousalPlaceholder");
