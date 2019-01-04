export default class LinkDropdownComponent {
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