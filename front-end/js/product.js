
const fetchProducts = async () => await (await fetch('http://localhost:3000/product')).json()

const idFromUrl = getURLParameter("productId")


const showProduct = async () => {
  const allProducts = (await fetchProducts()).result
  console.log(allProducts)
  const product = allProducts.filter(product => product._id === idFromUrl)[0] // TODO: find a better way
  if (!product) {
    document.getElementById("productContainer").innerHTML = "<h1>not a valid id</h1>"
  }
  document.getElementById("productName").innerText = product.title
  document.getElementById("mianPrice").innerText = product.buyingPrice
  document.getElementById("priceSale").innerText = product.price
  document.getElementById("productDescription").innerText = product.description
  document.getElementById("firstProdcutImg").src = product.img


  if (!(product.img).length == 0) {
    product.img.forEach((img, index) => {
      document.getElementById("imagesColumn").innerHTML += `                    <div class="column">
    <img class="demo cursor" src="${img}" style="width:100%"
        onclick="currentSlide(${index + 1})" alt="image">
</div>
`
      document.getElementById("sliderMainImg").innerHTML += `                    <div class="column">
<div class="mySlides">
<img src="${img}" style="width:100%">
</div>
`
    });
    currentSlide(0)
  }
}

showProduct()


let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("demo");
  let captionText = document.getElementById("caption");
  if (n > slides.length) { slideIndex = 1 }
  if (n < 1) { slideIndex = slides.length }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
  // captionText.innerHTML = dots[slideIndex - 1].alt;
}

function getURLParameter(sParam) {
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split('&');
  for (var i = 0; i < sURLVariables.length; i++) {
    var sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] == sParam) {
      return sParameterName[1];
    }
  }
}

