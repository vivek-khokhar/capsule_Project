export default class AsideNavigationComponent {
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
      }"id="side-${category.key}"href="#products/${category.key}" ">${
        category.name
      }</a>`;
    }
  }