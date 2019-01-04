class DataAccessLayer {
  async banners() {
    return await fetch("http://localhost:5000/banners").then(response => {
      return response.json();
    });
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
        });
      });
  }

  async products() {
    return await fetch("http://localhost:5000/products").then(response => {
      return response.json();
    });
  }
}
