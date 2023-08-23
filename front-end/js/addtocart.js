let menuClick = document.getElementById("menuClick");
const Authorization = localStorage.getItem("authToken");
let Search = document.getElementById("Search");
let dropdownSearch = document.getElementById("dropdownSearch");
let products;
let SearchResult = [];
let searchValue;

menuClick.addEventListener("click", function (e) {
  e.preventDefault();
  let responsiveNav = document.getElementById("responsive-nav");
  responsiveNav.classList.toggle("active");
});

async function getCart() {
  if (Authorization == null) {
    window.alert("Please login first");
    window.location.href = "/login.html";
  } else {
    // Fetch cart data and update cartItems element
    try {
      const rawResponse = await fetch("http://localhost:3000/cart", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ` + Authorization,
        },
      });
      const content = await rawResponse.json();
      let item = content.result.products;
      let cartItemsElement = document.getElementById("cartItems");

      if (item.length == 0) {
        cartItemsElement.innerHTML = "<h1>No items added</h1>";
      } else {
        let data = "";
        for (let i = 0; i < 4; i++) {
          data += `<h1 style="height:500px">${item[i].product.title}</h1>`;
        }
        cartItemsElement.innerHTML = data;
      }

      return item;
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  }
}

async function cartPopUp() {
    if (Authorization == null) {
      window.alert("Please login first");
      window.location.href = "/login.html";
    } else {
      let data = `<div style="position: relative;">
      <i id="closePopUp" class="fa-solid fa-xmark" style="font-size:1.4rem" onclick="closePopUp()"></i>`;
      document.getElementById("popUp").innerHTML = data;
  
      try {
        const rawResponse = await fetch("http://localhost:3000/cart", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ` + Authorization,
          },
        });
  
        const content = await rawResponse.json();
        let item = content.result.products;
        let totalPrice = 0;
  
        if (item.length > 0) {
          for (let i = 0; i < item.length; i++) {
            let id = item[i].product._id;
            let totalPricePerItem = item[i].itemsCount * item[i].product.price;
            totalPrice = totalPricePerItem + totalPrice;
  
            data += `
              <div class="d-flex" style="padding-left: 13px;">
                <div style="width: 25%;padding: 5px 5px;">
                  <img src="${item[i].product.img}" style="width: 100%;height:100%;">
                </div>
                <div style="width: 50%;">
                  <h6 style="text-align: start;">name: ${item[i].product.title}</h6>
                  <h6 style="text-align: start;">price: ${item[i].product.price}</h6>
                  <h6 id="counterId${id}" style="text-align: start;">
                    <span><button onclick="incCart('${id}','${item[i].itemsCount}')">+</button></span>
                    X${item[i].itemsCount}
                    <span><button onclick="DelCart('${id}','${item[i].itemsCount}')">-</button></span>
                  </h6>
                  <h6 style="text-align: start;">total: $<span id="totalPrice${id}" data-price="${item[i].product.price}">${totalPricePerItem}</span></h6>
                </div>
                <div style="width: 15%; text-align: center;">
                  <button class="delete-button" onclick="deleteCartItem('${id}')">Delete</button>
                </div>
              </div>
              <div class="cart-line"></div>`;
          }
  
          data += `<div class="checkOut">Total: $<span id="cartTotalPrice">${totalPrice}</span></div>
          <div class="checkOut">
            <button class="btnCheckout" onclick="window.location.href='/checkout.html';">Check Out</button>
          </div>`;
  
        } else {
          data = `<h1>No products</h1> <br>
          <button class="btn-close" onclick="closePopUp()">Close</button>`;
        }
  
        document.getElementById("popUp").innerHTML = data;
        document.getElementById("popUp").style.display = "block";
  
        // Apply styles to the delete buttons
        const deleteButtons = document.querySelectorAll(".delete-button");
        deleteButtons.forEach((button) => {
          button.style.backgroundColor = "red";
          button.style.color = "white";
          button.style.border = "none";
          button.style.padding = "5px 10px";
          button.style.marginTop = "50px";
          button.style.cursor = "pointer";
        });
  
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    }
  }
  
  

  async function DelCart(id, counter) {
    
    if (counter <= 1) {
      return; // Prevent decreasing counter below 1
    }
  
    let counterItem = counter - 1;
  
    try {
      const rawResponse = await fetch("http://localhost:3000/cartItem", {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ` + Authorization,
        },
        body: JSON.stringify({
          count: counterItem,
          productId: id,
        }),
      });
  
      const content = await rawResponse.json();
      console.log(content);
  
      // Update the cart item and total price dynamically
      updateCartItem(id, counterItem);
      updateCartProductNumber(); 
    } catch (error) {
      console.error("Error updating cart item:", error);
    }
  }
  
  async function incCart(id, counter) {
    let counterItem = Number(counter) + 1;
  
    try {
      const rawResponse = await fetch("http://localhost:3000/cartItem", {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ` + Authorization,
        },
        body: JSON.stringify({
          count: counterItem,
          productId: id,
        }),
      });
  
      const content = await rawResponse.json();
      console.log(content);
  
      // Update the cart item and total price dynamically
      updateCartItem(id, counterItem);
      updateCartProductNumber(); 
    } catch (error) {
      console.error("Error updating cart item:", error);
    }
  }

  async function deleteCartItem(productId) {
    try {
      const rawResponse = await fetch(`http://localhost:3000/cartItem/${productId}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ` + Authorization,
        },
      });
  
      const content = await rawResponse.json();
      console.log(content);
  
      
      // Update the cart product number
         updateCartProductNumber(); 
    // After successful deletion, refresh the cart popup
      cartPopUp();
  
    } catch (error) {
      console.error("Error deleting cart item:", error);
    }
  }
  
  
  async function updateCartProductNumber() {
    try {
      const rawResponse = await fetch("http://localhost:3000/cart", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ` + Authorization,
        },
      });
  
      const content = await rawResponse.json();
      let cartProducts = content.result.products;
      let productsCount = 0;
      for (let i = 0; i < cartProducts.length; i++) {
        productsCount = cartProducts[i].itemsCount + productsCount;
      }
      
      // Update the cart product number element
      document.getElementById("cartNumberId").innerHTML = productsCount;
  
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  }




  // Function to update cart item and total price dynamically
  function updateCartItem(id, counter) {
    const counterElement = document.getElementById(`counterId${id}`);
    const totalPriceElement = document.getElementById(`totalPrice${id}`);
    const cartTotalPriceElement = document.getElementById("cartTotalPrice");
  
    if (counterElement && totalPriceElement && cartTotalPriceElement) {
      // Update counter
      counterElement.innerHTML = `
        <span><button onclick="incCart('${id}','${counter}')">+</button></span>
        X${counter}
        <span><button onclick="DelCart('${id}','${counter}')">-</button></span>
      `;
  
      // Update total price for the product
      const productPrice = parseFloat(totalPriceElement.getAttribute("data-price"));
      const totalPrice = productPrice * counter;
      totalPriceElement.textContent = totalPrice.toFixed(2);
  
      // Update the cart total price
      updateCartTotalPrice();
    } else {
      console.error("Element not found:", id, counter);
    }
  }
  
  
  // Function to update cart total price
  function updateCartTotalPrice() {
    const cartTotalPriceElement = document.getElementById("cartTotalPrice");
    let total = 0;
  
    // Calculate the total price by summing up individual product total prices
    const totalPrices = document.querySelectorAll('[id^="totalPrice"]');
    totalPrices.forEach((priceElement) => {
      total += parseFloat(priceElement.textContent);
    });
  
    cartTotalPriceElement.textContent = total.toFixed(2);
  }
  

async function getCartItemsCount() {
  let data = `<div style="position: relative;">`;

  try {
    const rawResponse = await fetch("http://localhost:3000/cart", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + Authorization,
      },
    });

    const content = await rawResponse.json();
    let cartProducts = content.result.products;
    let productsCount = 0;

    for (let i = 0; i < cartProducts.length; i++) {
      productsCount = cartProducts[i].itemsCount + productsCount;
    }

    document.getElementById("cartNumberId").innerHTML = productsCount;
  } catch (error) {
    console.error("Error fetching cart:", error);
  }
}

getCartItemsCount();

function closePopUp() {
  document.getElementById("popUp").style.display = "none";
}

async function addToCartItem(productId) {
  try {
    const rawResponse = await fetch("http://localhost:3000/cartItem", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + Authorization,
      },
      body: JSON.stringify({
        product: productId,
        itemsCount: 1,
      }),
    });

    const content = await rawResponse.json();
    let cartProducts = content.result.products;
    let productsCount = 0;

    for (let i = 0; i < cartProducts.length; i++) {
      productsCount = cartProducts[i].itemsCount + productsCount;
    }

    document.getElementById("cartNumberId").innerHTML = productsCount;
  } catch (error) {
    console.error("Error adding item to cart:", error);
  }
}

Search.addEventListener("click", function () {
  searchValue = document.getElementById("searchValue").value;
  location.href = "/Searching.html";
  if (localStorage.getItem("searchResult")) {
    localStorage.removeItem("searchResult");
  }

  for (let i = 0; i < products.length; i++) {
    if (dropdownSearch.value == 0 && searchValue != "") {
      if (products[i].title.toLowerCase().includes(searchValue.toLowerCase())) {
        SearchResult.push(products[i]);
      }
    } else {
      if (products[i].category.toLowerCase().includes(searchValue.toLowerCase())) {
        SearchResult.push(products[i]);
      }
    }
  }

  localStorage.setItem("searchResult", JSON.stringify(SearchResult));
});

// async function getProducts() {
//   try {
//     let displayProducts = document.getElementById("displayProducts");
//     const response = await fetch("http://localhost:3000/product");
//     let getProducts = await response.json();
//     products = getProducts.result;
//     let data = "";

//     for (let i = 0; i < 4; i++) {
//       let id = products[i]._id;
//       data += `<div style="padding: 0px 5px; " class="col-md-2">
//         <div class="product ">
//           <div class="product-img">
//             <img src="${products[i].img}" style="height:319.5px" alt="">
//             <div class="product-label">
//               <span class="sale">-30%</span>
//               <span class="new">NEW</span>
//             </div>
//           </div>
//           <div class="product-body">
//             <p class="product-category">${products[i].category}</p>
//             <h3 class="product-name"><a href="#">${products[i].title}</a></h3>
//             <h4 class="product-price">$ ${products[i].price}</h4>
//             <div class="product-rating">
//               <i class="fa fa-star"></i>
//               <i class="fa fa-star"></i>
//               <i class="fa fa-star"></i>
//               <i class="fa fa-star"></i>
//               <i class="fa fa-star"></i>
//             </div>
//             <div class="product-btns">
//               <button onclick="addTowishList('${id}')" type="button" class="add-to-wishlist">
//                 <i class="fa fa-heart-o"></i><span class="tooltipp">add to wishlist</span>
//               </button>
//               <button onclick="location.href='/productSearch/${id}.html'" class="quick-view">
//                 <i class="fa fa-eye"></i><span class="tooltipp">View</span>
//               </button>
//             </div>
//           </div>
//           <div class="add-to-cart">
//             <button onclick="addToCart('${id}')" class="add-to-cart-btn">
//               <i class="fa fa-shopping-cart"></i> add to cart
//             </button>
//           </div>
//         </div>
//       </div>`;
//     }

//     displayProducts.innerHTML = data;
//   } catch (error) {
//     console.error("Error fetching products:", error);
//   }
// }

// getProducts();

let listOfWishList = [];

function addTowishList(id) {
  let findingItem = listOfWishList.find((item) => item == id);
  if (!findingItem) {
    listOfWishList.push(id);
    document.getElementById("wishListNumberId").innerHTML = listOfWishList.length;
    localStorage.setItem("wishList", JSON.stringify(listOfWishList));
  }

  console.log(listOfWishList);
}

let listOfcart = [];

function addToCart(id) {
  if (!localStorage.getItem("authToken") && !localStorage.getItem("userName")) {
    window.alert("Please login first");
    window.location.href = "/login.html";
  } else {
    addToCartItem(id);
    listOfcart.push(id);
    localStorage.setItem("cartList", JSON.stringify(listOfcart));
    console.log(listOfcart);
  }
}
 