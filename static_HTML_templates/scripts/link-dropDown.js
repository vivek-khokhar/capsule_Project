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
        return `<li><a id="${category.id}" admissions">${category.name}</a></li>`;
    }
}

let apiRequest1 = fetch("http://localhost:5000/banners").then(response => {
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
  new LinkDropdownComponent(values[1], "nav-DropDown");
});