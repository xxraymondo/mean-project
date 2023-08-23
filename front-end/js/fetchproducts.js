async function getProducts() {
    try {
      let displayProducts = document.getElementById("displayProducts");
      const response = await fetch("http://localhost:3000/product");
      let getProducts = await response.json();
      products = getProducts.result;
      let data = "";
  
      for (let i = 0; i < 4; i++) {
        let id = products[i]._id;
        data += `<div style="padding: 0px 5px; " class="col-md-2">
          <div class="product ">
            <div class="product-img">
              <img src="${products[i].img}" style="height:319.5px" alt="">
              <div class="product-label">
                <span class="sale">-30%</span>
                <span class="new">NEW</span>
              </div>
            </div>
            <div class="product-body">
              <p class="product-category">${products[i].category}</p>
              <h3 class="product-name"><a href="#">${products[i].title}</a></h3>
              <h4 class="product-price">$ ${products[i].price}</h4>
              <div class="product-rating">
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
              </div>
              <div class="product-btns">
                <button onclick="addTowishList('${id}')" type="button" class="add-to-wishlist">
                  <i class="fa fa-heart-o"></i><span class="tooltipp">add to wishlist</span>
                </button>
                <button onclick="location.href='/productSearch/${id}.html'" class="quick-view">
                  <i class="fa fa-eye"></i><span class="tooltipp">View</span>
                </button>
              </div>
            </div>
            <div class="add-to-cart">
              <button onclick="addToCart('${id}')" class="add-to-cart-btn">
                <i class="fa fa-shopping-cart"></i> add to cart
              </button>
            </div>
          </div>
        </div>`;
      }
  
      displayProducts.innerHTML = data;
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }
  
  getProducts();