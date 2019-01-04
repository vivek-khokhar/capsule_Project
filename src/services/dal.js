export default class DataAccessLayer {
  async banners() {
    return await fetch("http://localhost:5000/banners").then(response => {
      return response.json();
    }).catch((err) => {
      console.log(err);
  });;
  }
  async categories() {
    return await fetch("http://localhost:5000/categories")
      .then(response => {
        return response.json();
      })
      .then(values => {
        values.sort((a, b) => a.order - b.order);
        return values.filter(item => {
          return item.enabled;
        })
      }).catch((err) => {
        console.log(err);
    });
  }
  async products() {
    return await fetch("http://localhost:5000/products").then(response => {
      return response.json();
    }).catch((err) => {
      console.log(err);
  });
  }

  async addToCart(item) {
    return fetch("http://localhost:5000/addToCart", {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
            // "Content-Type": "application/x-www-form-urlencoded",
        },
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
        body: JSON.stringify(item), // body data type must match "Content-Type" header
    }).then(response => {
      return response.json();
    }).catch((err) => {
      console.log(err);
  });
    
  }
}
