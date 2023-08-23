let menuClick = document.getElementById("menuClick");
// 
// const Authentication = 

const Authorization = localStorage.getItem("authToken");
console.log(Authorization)
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
  if(Authentication==null){
    window.alert("please login first");
    window.location.href="/login.html";
  }else{
    document.getElementById("cartItems");
 
    const rawResponse = await fetch("http://localhost:3000/cart", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization:`Bearer `+ Authorization,
  
      },
    });
    const content = await rawResponse.json();
    let item = content.result.products;
    if (content.result.products.length == 0) {
      document.getElementById("cartItems").innerHTML = "<h1>no items added</h1>";
    } else {
      let data = "";
      for (let i = 0; i < 4; i++) {
        // let id=item[i]._id
        data += `
          <h1 style="height:500px">
          ${item[1].product.title}
          </h1>
        
  `;
      }
      document.getElementById("cartItems").innerHTML = data;
    }
    return item;
  }

}
async function cartPopUp() {
 
  if(Authorization==null){
    window.alert("please login first");
    window.location.href="/login.html";
  }else{
  let data = `<div style="position: relative;">
	<i id="closePopUp" class="fa-solid fa-xmark" style="font-size:1.4rem" onclick="closePopUp()"></i>`;
  document.getElementById("popUp").innerHTML = data;
  const rawResponse = await fetch("http://localhost:3000/cart", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization:`Bearer `+ Authorization,
    },
  });
  console.log('rawResponse')
  const content = await rawResponse.json();
  let item = content.result.products;
  let totalPrice=0
  if(item.length > 0) {
    console.log(item)
  for (let i = 0; i < item.length; i++) {
    let id =item[i].product._id
	let totalPricePerItem=item[i].itemsCount*item[i].product.price
	 totalPrice=totalPricePerItem+totalPrice
    data += `
		  
	   <div class="d-flex" style="padding-left: 13px;">
		   <div style="width: 25%;padding: 5px 5px;">
			   <img src="${item[i].product.img}" style="width: 100%;height:100%;">
		   </div>
		   <div style="width: 75%;">
			   <h6  style=" text-align: start;">name: ${item[i].product.title}</h6>
			   <h6  style=" text-align: start;">price: ${item[i].product.price}</h6>
			   <h6 id="counterId${id}" style=" text-align: start;"><span><button onclick="incCart('${id}','${item[i].itemsCount}')">+</button></span> X${item[i].itemsCount}<span><button onclick="DelCart('${id}','${item[i].itemsCount}')">-</button></span> </h6>
			   <h6  style=" text-align: start;">total :${totalPricePerItem}</h6>
		   </div>
		   <div class="cart-line"></div>
	   </div>`;
  }
  data +=`<div class="checkOut" >Total :${totalPrice}</div>
 <div  class="checkOut"><button class="btnCheckout" onclick="window.location.href='/checkout';">check out</button></div> 
  `
}else{
	data =`<h1>no products</h1>`
}


  document.getElementById("popUp").innerHTML = data;
  document.getElementById("popUp").style.display = "block";
}
}
// async function DelCart(id,counter){
//   let counterItem =counter-1
//   console.log(counterItem+"fff")
// 	const rawResponse = await fetch("http://localhost:3000/cartItem", {
// 	  method: "PUT",
// 	  headers: {
// 		Accept: "application/json",
// 		"Content-Type": "application/json",
// 		Authorization:`Bearer `+ Authorization,
// 	  },
//      body: JSON.stringify({
//       count:  counterItem,
//       productId: id,
//     }),
// 	});
// 	const content = await rawResponse.json();
//   console.log(content)
// }
async function DelCart(id,counter){
  let counterItem =counter-1
  console.log(counterItem+"fff")
	const rawResponse = await fetch("http://localhost:3000/cartItem", {
	  method: "PUT",
	  headers: {
		Accept: "application/json",
		"Content-Type": "application/json",
		Authorization:`Bearer `+ Authorization,
	  },
     body: JSON.stringify({
      count:  counterItem,
      productId: id,
    }),
	});
	const content = await rawResponse.json();
  console.log(content)
  document.getElementById("counterId"+id).innerHTML = 
  `<span><button 
  onclick="incCart('${id}','${counterItem}')">+</button></span> 
  X${counterItem}<span><button onclick="DelCart('${id}','${counterItem}')">-</button></span>
  `;
}
async function incCart(id,counter){

	let counterItem =  Number(counter)+1
  console.log(counterItem+"fff")
	const rawResponse = await fetch("http://localhost:3000/cartItem", {
	  method: "PUT",
	  headers: {
		Accept: "application/json",
		"Content-Type": "application/json",
		Authorization:`Bearer `+ Authorization,
	  },
     body: JSON.stringify({
      count:  counterItem,
      productId: id,
    }),
	});
	const content = await rawResponse.json();
  console.log(content)
  document.getElementById("counterId"+id).innerHTML = 
  `<span><button 
  onclick="incCart('${id}','${counterItem}')">+</button></span> 
  X${counterItem}<span><button onclick="DelCart('${id}','${counterItem}')">-</button></span>
  `;
}
async function getCartItemsCount() {
  
	let data = `<div style="position: relative;">
	  <i id="closePopUp" class="fa-solid fa-xmark" onclick="closePopUp()"></i>`;
	document.getElementById("popUp").innerHTML = data;
	const rawResponse = await fetch("http://localhost:3000/cart", {
	  method: "GET",
	  headers: {
		Accept: "application/json",
		"Content-Type": "application/json",
		Authorization:`Bearer `+ Authorization,
	  },
	});
	const content = await rawResponse.json();
	let cartProducts = content.result.products;
	let productsCount = 0;
	for (let i = 0; i < cartProducts.length; i++) {
	  productsCount = cartProducts[i].itemsCount + productsCount;
	}
	document.getElementById("cartNumberId").innerHTML = productsCount;
}
getCartItemsCount()
function closePopUp() {
  document.getElementById("popUp").style.display = "none";
}
async function addToCartItem(productId) {
  console.log('content')
  const rawResponse = await fetch("http://localhost:3000/cartItem", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization:`Bearer `+ Authorization,
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
}
addToCartItem()

Search.addEventListener("click", function () {
  searchValue = document.getElementById("searchValue").value;
  location.href = "/Searching.html";
  // 3lashan fi key up fa mardetsh a3'er a7ot
  if (localStorage.getItem("searchResult")) {
    localStorage.removeItem("searchResult");
  }

  for (let i = 0; i < products.length; i++) {
    if (dropdownSearch.value == 0 && searchValue != "") {
      if (products[i].title.toLowerCase().includes(searchValue.toLowerCase())) {
        SearchResult.push(products[i]);
      }
    } else {
      if (
        products[i].category.toLowerCase().includes(searchValue.toLowerCase())
      ) {
        SearchResult.push(products[i]);
      }
    }
  }
  localStorage.setItem("searchResult", JSON.stringify(SearchResult));
});
async function getProducts() {
	console.log("33333")
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
			
					<button  onclick="addTowishList('${id}')" type="button" class="add-to-wishlist"><i class="fa fa-heart-o"></i><span class="tooltipp">add to wishlist</span></button>
					<button onclick="location.href = '/productSearch/${id}.html' class="quick-view"><i class="fa fa-eye"></i><span class="tooltipp">View</span></button>
				</div>
			</div>
			<div class="add-to-cart">
				<button onclick="addToCart('${id}')"   class="add-to-cart-btn"><i class="fa fa-shopping-cart"></i> add to cart</button>
			</div>
		</div>
	</div>`;
  }
  document.getElementById("displayProducts").innerHTML = data;
}
getProducts();
let listOfWishList = [];
function addTowishList(id) {
  let findingItem = listOfWishList.find((item) => item == id);
  if (!findingItem) {
    listOfWishList.push(id);
    document.getElementById("wishListNumberId").innerHTML =
      listOfWishList.length;
    localStorage.setItem("wishList", JSON.stringify(listOfWishList));
  }

  console.log(listOfWishList);
}
let listOfcart = [];
function addToCart(id) {
  if(!localStorage.getItem("authToken")&&!localStorage.getItem("userName")){
    window.alert("please login first");
    window.location.href="/login.html";
  }
  else{
    addToCartItem(id);
    listOfcart.push(id);
    localStorage.setItem("cartList", JSON.stringify(listOfcart));
    console.log(listOfcart);
  }

}

(function ($) {
  "use strict";

  // Mobile Nav toggle
  $(".menu-toggle > a").on("click", function (e) {
    e.preventDefault();
    $("#responsive-nav").toggleClass("active");
  });

  // Fix cart dropdown from closing
  $(".cart-dropdown").on("click", function (e) {
    e.stopPropagation();
  });

  /////////////////////////////////////////

  // Products Slick
  $(".products-slick").each(function () {
    var $this = $(this),
      $nav = $this.attr("data-nav");

    $this.slick({
      slidesToShow: 4,
      slidesToScroll: 1,
      autoplay: true,
      infinite: true,
      speed: 300,
      dots: false,
      arrows: true,
      appendArrows: $nav ? $nav : false,
      responsive: [
        {
          breakpoint: 991,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    });
  });

  // Products Widget Slick
  $(".products-widget-slick").each(function () {
    var $this = $(this),
      $nav = $this.attr("data-nav");

    $this.slick({
      infinite: true,
      autoplay: true,
      speed: 300,
      dots: false,
      arrows: true,
      appendArrows: $nav ? $nav : false,
    });
  });

  /////////////////////////////////////////

  // Product Main img Slick
  $("#product-main-img").slick({
    infinite: true,
    speed: 300,
    dots: false,
    arrows: true,
    fade: true,
    asNavFor: "#product-imgs",
  });

  // Product imgs Slick
  $("#product-imgs").slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    centerMode: true,
    focusOnSelect: true,
    centerPadding: 0,
    vertical: true,
    asNavFor: "#product-main-img",
    responsive: [
      {
        breakpoint: 991,
        settings: {
          vertical: false,
          arrows: false,
          dots: true,
        },
      },
    ],
  });

  // Product img zoom
  var zoomMainProduct = document.getElementById("product-main-img");
  if (zoomMainProduct) {
    $("#product-main-img .product-preview").zoom();
  }
})
  /////////////////////////////////////////

  // Input number
//   $(".input-number").each(function () {
//     var $this = $(this),
//       $input = $this.find('input[type="number"]'),
//       up = $this.find(".qty-up"),
//       down = $this.find(".qty-down");

//     down.on("click", function () {
//       var value = parseInt($input.val()) - 1;
//       value = value < 1 ? 1 : value;
//       $input.val(value);
//       $input.change();
//       updatePriceSlider($this, value);
//     });

//     up.on("click", function () {
//       var value = parseInt($input.val()) + 1;
//       $input.val(value);
//       $input.change();
//       updatePriceSlider($this, value);
//     });
//   });

//   var priceInputMax = document.getElementById("price-max"),
//     priceInputMin = document.getElementById("price-min");

//   priceInputMax.addEventListener("change", function () {
//     updatePriceSlider($(this).parent(), this.value);
//   });

//   priceInputMin.addEventListener("change", function () {
//     updatePriceSlider($(this).parent(), this.value);
//   });

//   function updatePriceSlider(elem, value) {
//     if (elem.hasClass("price-min")) {
//       console.log("min");
//       priceSlider.noUiSlider.set([value, null]);
//     } else if (elem.hasClass("price-max")) {
//       console.log("max");
//       priceSlider.noUiSlider.set([null, value]);
//     }
//   }

//   // Price Slider
//   var priceSlider = document.getElementById("price-slider");
//   if (priceSlider) {
//     noUiSlider.create(priceSlider, {
//       start: [1, 999],
//       connect: true,
//       step: 1,
//       range: {
//         min: 1,
//         max: 999,
//       },
//     });

//     priceSlider.noUiSlider.on("update", function (values, handle) {
//       var value = values[handle];
//       handle ? (priceInputMax.value = value) : (priceInputMin.value = value);
//     });
//   }
// })(jQuery);
