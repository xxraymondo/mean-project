let x =document.getElementById('displaySearchProducts')
let searchResult= JSON.parse(localStorage.getItem('searchResult')) 
function getProduct(){
	console.log(searchResult+"eee")
	if(searchResult==null){
		document.getElementById('displaySearchProducts').innerHTML=`<h1>nohing was found</h1>`
	}else{
		let data=''
		for(let i=0;i<searchResult.length;i++){
			let id=searchResult[i]._id
			data+=`<div style="padding: 0px 5px;margin-bottom:70px; " class="col-md-3">
			<div class="product ">
			<div class="product-img">
					<img src="${searchResult[i].img}" style="height:319.5px; width:100%" alt="">
					<div class="product-label">
						<span class="sale">-30%</span>
						<span class="new">NEW</span>
					</div>
				</div>
				<div class="product-body">
					<p class="product-category">${searchResult[i].category}</p>
					<h3 class="product-name"><a href="#">${searchResult[i].title}</a></h3>
					<h4 class="product-price">$ ${searchResult[i].price}</h4>
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
		</div>`
		}
		document.getElementById('displaySearchProducts').innerHTML=data
	}
	

}
getProduct()

function PriceSearching(){
	searchResult= JSON.parse(localStorage.getItem('searchResult')) 
	document.getElementById('invalidSearch').innerHTML=''
	let maxPrice=0
	let minPrice=0
	 maxPrice =document.getElementById('maxPrice').value
	 maxPrice = Number(maxPrice)
	 minPrice =document.getElementById('minPrice').value
	 minPrice = Number(minPrice)
	if(minPrice > maxPrice&&maxPrice!=''){
	document.getElementById('invalidSearch').innerHTML="<h3>min price higher that the max price</h3>"
	}else if(maxPrice==''&&minPrice==''){
		document.getElementById('invalidSearch').innerHTML="<h3>please enter min and max price value</h3>"
	}else if(minPrice==''&&maxPrice!=''){
		searchResult =searchResult.filter(item=>item.price<maxPrice)
		getProduct()
		
	}else if(minPrice!=''&&maxPrice==''){
		searchResult =searchResult.filter(item=>item.price>minPrice)
		getProduct()
	}else {
		searchResult =searchResult.filter(item=>item.price<maxPrice&&item.price>minPrice)
		getProduct()
	}
	

}
function orderbyPriceAscending(){
	searchResult.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
	getProduct()
}
function orderbyPriceDecending(){
	searchResult.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
		getProduct()
}