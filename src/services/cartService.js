export default class CartService {
    constructor(dal) {
      this.cartItems = [];
      this.dal = dal;
    }
  
    addToCart(item) {
      this.dal.addToCart(item).then((result) => {
        let itemIndex = this.cartItems.findIndex(prdct => {
          return prdct.sku === item.sku;
        });
        if (itemIndex > -1) {
          this.cartItems[itemIndex].quantity += 1;
        } else {
          item.quantity = 1;
          this.cartItems.push(item);
        }
      }).catch( err => console.log(err))
    }
  
    removeFromeCart(item) {
      let itemIndex = this.cartItems.findIndex(prdct => {
        return prdct.id === item.id;
      });
      if (this.cartItems[itemIndex].quantity > 1) {
        this.cartItems[itemIndex].quantity -= 1;
      } else {
        return this.cartItems.splice(itemIndex, 1);
      }
    }
  
    cartItemCount() {
      let qty = 0;
      this.cartItems.forEach(item => {
        qty += item.quantity;
      });
      return qty;
    }
  
    getCartItems() {
      return JSON.parse(JSON.stringify(this.cartItems));
    }
  
    getCartTotalPrice() {
      let price = 0;
      this.cartItems.forEach(item => {
        price += item.quantity * item.price;
      });
      return price;
    }
  
    getItemBySKU(sku) {
      return this.cartItems.find(item => {
        return item.sku === sku;
      });
    }
  }