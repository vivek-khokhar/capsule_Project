export default class CartService {
    constructor() {
        this.cartItems = [{
            "name": "Fresho Kiwi - Green, 3 pcs",
            "imageURL": "/static/images/products/fruit-n-veg/kiwi-green.jpg",
            "description": "Kiwis are oval shaped with a brownish outer skin. The flesh is bright green and juicy with tiny, edible black seeds.",
            "price": 87,
            "stock": 50,
            "category": "5b6899953d1a866534f516e2",
            "sku": "fnw-kiwi-3",
            "id": "5b6c6a7f01a7c38429530883",
            "quantity" : 1
          },
          {
            "name": "Apple - Washington, Regular, 4 pcs",
            "imageURL": "/static/images/products/fruit-n-veg/apple.jpg",
            "description": "The bright red coloured and heart shaped Washington apples are crunchy, juicy and slightly sweet. Washington Apples are a natural source of fibre and are fat free.",
            "price": 187,
            "stock": 50,
            "category": "5b6899953d1a866534f516e2",
            "sku": "fnw-apple-4",
            "id": "5b6c6aeb01a7c38429530884",
            "quantity" : 4
          }]
    }

    addToCart(item) {
        let itemIndex = this.cartItems.findIndex((prdct) => {
            return prdct.sku === item.sku;
        });
        if (itemIndex > 0 ) {
            this.cartItems[itemIndex].quantity += 1;
        } else {
        this.cartItems.push(item);
        }
    }

    removeFromeCart(item) {
        let itemIndex = this.cartItems.findIndex((prdct) => {
            return prdct.id === item.id;
        });
        if (this.cartItems[itemIndex].quantity > 1 ) {
            this.cartItems[itemIndex].quantity -= 1;
        } else {
            this.cartItems.splice(itemIndex, 1);
        }
    }

    cartItemCount() {
        let qty = 0;
        this.cartItems.forEach(item => {
            qty+= item.quantity;
        })
        return qty;
    }

    getCartItems() {
        return JSON.parse(JSON.stringify(this.cartItems));
    }
}