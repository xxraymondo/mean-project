const PRODUCT_UPDATE_OVERLAY = "productUpdateOverlay";
const PRODUCTS_CONTAINER = "productsContainer";
const PREVIOUS = "previous";
const NEXT = "next";
const SEARCH_INPUT = "searchInput";
const PRODUCT_FORM = {
    productName: "productName",
    sellPrice: "sellingPrice",
    amount: "amount",
    category: "category",
    description:"itemDescription",
    keywords: "itemKeywords",
}
class InventoryProducts{
    productUpdateOverlayRef;
    productsContainerRef;
    nextRef;
    previousRef;
    searchInputRef;
    productNameRef;
    sellPriceRef;
    amountRef;
    categoryRef;
    descriptionRef;
    keywordsRef;
    #currentlyUpdating;
    #previous;
    #next;
    #products = [];
    #filter = {
        limit:8
    };
    constructor(){
        this.productUpdateOverlayRef = document.getElementById(PRODUCT_UPDATE_OVERLAY);
        this.productsContainerRef = document.getElementById(PRODUCTS_CONTAINER);
        this.nextRef = document.getElementById(NEXT);
        this.previousRef = document.getElementById(PREVIOUS);
        this.searchInputRef = document.getElementById(SEARCH_INPUT);
        this.productNameRef = document.getElementById(PRODUCT_FORM.productName);
        this.sellPriceRef = document.getElementById(PRODUCT_FORM.sellPrice);
        this.amountRef = document.getElementById(PRODUCT_FORM.amount);
        this.categoryRef = document.getElementById(PRODUCT_FORM.category);
        this.descriptionRef = document.getElementById(PRODUCT_FORM.description);
        this.keywordsRef = document.getElementById(PRODUCT_FORM.keywords);
    }

    async fetchProducts(){
       let response = await services.getRequest(api.getProducts,this.#filter).catch(e =>{
        if(e === 401){
          window.location.replace("../../index.html");
        }
     });
       if(!response.success)return;
      this.#managePagination(response);
      this.#products = response.result;
      this.#showProducts();
    }

    #showProducts(){
       /* if(this.#products.length == 0){
            this.productsContainerRef.innerHTML = "<span> There is no result !</span>";
            return ;
        } */
        let items = [];
        let index = 0;
        for(let product of this.#products){
            items.push(this.#formProductItem(product, index));
            index++;
        }
        this.productsContainerRef.innerHTML = items.join(" ");
    }
    #formProductItem(product, index){
        return `<div class="productItem" onclick="inventoryProducts.toggelProductUpdateOverlay(${index})">
        <img src="${product.img[0]}" alt="">
        <div>
            <h3>${product.title}</h3>
            <div class="productDetails">
                <h4>Buying Price</h4>
                <span>${product.buyingPrice.toLocaleString()??0} £</span>
                <h4>Selling Price</h4>
                <span>${product.price.toLocaleString()??0} £</span>
                <h4>Avaliable </h4>
                <span>${product.amount.toLocaleString()??0}</span>
                <h4>Total value</h4>
                <span>${(product.amount*product.price).toLocaleString()??0} £</span>
            </div>
        </div>
    </div>`;
    }
    toggelProductUpdateOverlay(index){
        if(this.productUpdateOverlayRef.offsetHeight > 0){
            this.productUpdateOverlayRef.style.height = "0%";
            return;
        }
        this.#currentlyUpdating = index;
        this.productUpdateOverlayRef.style.height = "100%";
        this.#initProductUpdateForm(this.#products[index]);
    }
    #managePagination(response){
        this.#previous = response.previousPage;
        this.#next = response.nextPage;
        this.nextRef.style.display = this.#next?"block":"none";
        this.previousRef.style.display = this.#previous?"block":"none";
    }
    previous(){
        this.#filter.page = this.#previous;
        this.fetchProducts();
    }
    next(){
        this.#filter.page = this.#next;
        this.fetchProducts();
    }
    searchProducts(){
        console.log(this.searchInputRef.value);
        if(!this.searchInputRef.value) {
            this.#filter = {limit: this.#filter.limit};
            this.fetchProducts();
            return;
        }
        this.#filter = {limit: this.#filter.limit};
        this.#filter.expr = this.searchInputRef.value;
        this.fetchProducts();
    }
    #initProductUpdateForm(product){
        this.productNameRef.value = product.title;
        this.sellPriceRef.value = product.price;
        this.amountRef.value = product.amount;
        this.categoryRef.value = product.category;
        this.descriptionRef.value = product.description;
        this.keywordsRef.value = product.keywords;
    }
    resetProductUpdateForm(){
        this.productNameRef.value = this.#products[this.#currentlyUpdating].title;
        this.sellPriceRef.value = this.#products[this.#currentlyUpdating].price;
        this.amountRef.value = this.#products[this.#currentlyUpdating].amount;
        this.categoryRef.value = this.#products[this.#currentlyUpdating].category;
        this.descriptionRef.value = this.#products[this.#currentlyUpdating].description;
        this.keywordsRef.value = this.#products[this.#currentlyUpdating].keywords;
    }
    async updateProduct(){
        if(!this.#validateUpdatedData()){
            notification.showNotification("Please enter valid data", NOTIFICATION_TYPES.error);
            return;
        }
        let reqBody = this.#formUpdateBody();
        let response = await services.putRequest(api.updateProduct, reqBody);
        if(!response.success){
            notification.showNotification(response.message, NOTIFICATION_TYPES.error);
            return;
        }
        notification.showNotification("Updated Successfullly", NOTIFICATION_TYPES.success);
        this.#products[this.#currentlyUpdating].title = reqBody.title;
        this.#products[this.#currentlyUpdating].price = reqBody.price;
        this.#products[this.#currentlyUpdating].amount = reqBody.amount;
        this.#products[this.#currentlyUpdating].category = reqBody.category;
        this.#products[this.#currentlyUpdating].description = reqBody.description;
        this.#products[this.#currentlyUpdating].keywords = reqBody.keywords;
        this.#showProducts();
    }
    #validateUpdatedData(){
        if(this.amountRef.value<0 || this.sellPriceRef.value<=0) return false;
        return this.productNameRef.value && 
        this.sellPriceRef.value && 
        this.amountRef.value && 
        this.categoryRef.value && 
        this.descriptionRef.value && 
        this.keywordsRef.value;
    }
    #formUpdateBody(){
        return {
            productId: this.#products[this.#currentlyUpdating]._id,
            title: this.productNameRef.value,
            price: this.sellPriceRef.value,
            amount: this.amountRef.value,
            category: this.categoryRef.value,
            description: this.descriptionRef.value,
            keywords: this.keywordsRef.value
        }
    }
}

let inventoryProducts = new InventoryProducts();
/*
{
      "_id": "64c3f71555a84f4e8bce459c",
      "title": "Black Nike",
      "buyingPrice": 400,
      "price": 1000,
      "amount": 300,
      "img": [
        "https://iili.io/HLUXJQn.jpg"
      ],
      "description": "Sport Nike for walking, avaliable in different sizes",
      "keywords": "balck,men shoes, sport",
      "category": "menShoes",
      "stripPriceId": "price_1NZulOIVT2r7id06UGcWzjkr",
      "createdAt": "2023-07-28T17:12:53.582Z",
      "updatedAt": "2023-07-28T17:12:53.582Z",
      "__v": 0
    }
*/