export default class AsideNavigationComponent {
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
        return `<a id="${category.key}"href="#${category.key}" ">${category.name}</a>`;
    }
}