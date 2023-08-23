
createAccCaption = () => {
  let checkbox = document.getElementById("createAcountBtn").checked
  if (checkbox == true) {
    checkbox != checkbox
    document.getElementById('createacccaption').style.display = "block";
  }
  else {
    checkbox != checkbox
    document.getElementById('createacccaption').style.display = "none";
  }

}
shippingAdressCaption = () => {
  let checkbox = document.getElementById("shippingcaptionBtn").checked
  console.log("checkbo")
  if (checkbox == true) {
    checkbox != checkbox
    document.getElementById('shippingCaption').style.display = "block";
  }
  else {
    checkbox != checkbox
    document.getElementById('shippingCaption').style.display = "none";
  }

}

let menuInputs = document.querySelectorAll('#payment-label');
let subMenus = document.querySelectorAll('.paymentCaption');


menuInputs.forEach((input, index) => {
  input.addEventListener('change', () => {
    if (input.checked) {
      subMenus[index].style.display = "block"
    }
  });
  input.addEventListener('blur', () => {
    if (input.checked) {
      subMenus[index].style.display = "none"
    }
  });
});
/******************************************************************************** */


const CART_PRODUCTS_LIST = "cartProductsList";
const ORDER_TOTAL = "orderTotal";
const FIRST_NAME = "first-name";
const LAST_NAME = "last-name";
const EMAIL = "email";
const ADDRESS = "address";
const CITY = "city";
const COUNTRY = "country";
const ZIP_CODE = "zip-code";
const MOBILE = "tel";
const ERROR = "errorSection"
class CheckoutManager {
  cartProductsListRef;
  orderTotalRef;
  cartItems;
  selectedPaymentMethod;
  firstNameRef;
  lastNameRef;
  emailRef;
  addressRef;
  cityRef;
  countryRef;
  zipCodeRef;
  mobileRef;
  errorNotifierRef;
  constructor(){
    this.cartProductsListRef = document.getElementById(CART_PRODUCTS_LIST);
    this.orderTotalRef = document.getElementById(ORDER_TOTAL);
    this.firstNameRef = document.getElementsByName(FIRST_NAME)[0];
    this.firstNameRef.value = dm.getString("userName");
    this.lastNameRef = document.getElementsByName(LAST_NAME)[0];
    this.emailRef = document.getElementsByName(EMAIL)[0];
    this.emailRef.value = dm.getString("email");
    this.addressRef = document.getElementsByName(ADDRESS)[0];
    this.cityRef = document.getElementsByName(CITY)[0];
    this.countryRef = document.getElementsByName(COUNTRY)[0];
    this.zipCodeRef = document.getElementsByName(ZIP_CODE)[0];
    this.mobileRef = document.getElementsByName(MOBILE)[0];
    this.errorNotifierRef = document.getElementById(ERROR);
    this.cartItems = [];
  }

  onCheckoutLoading(){
    
      this.#fitchUserCart();
  }

  async #fitchUserCart(){
    let response = await services.getRequest(api.getCart).catch(e =>{
      if(e == 401){
        window.location.replace("../login.html");
        return;
      }
    });
    if(!response.success){
      this.#showMessage(response.message);
      return;
    }
    if(!response.result || !response.result.products|| response.result.products.length == 0){
      this.#showMessage("Empty Cart!");
      return;
    }
    console.log(response);
    this.cartItems = response.result.products;
    this.orderTotalRef.innerHTML = `$ ${response.result.total.toLocaleString()}`;
    this.#showCartItems();
  }

  #showCartItems(){
    let cartItemsDom = [];
    for(let cartItem of this.cartItems){
      cartItemsDom.push(this.#formCartItem(cartItem));
    }
    this.cartProductsListRef.innerHTML = cartItemsDom.join("");
  }

  #formCartItem(cartItem){
    return `<div class="center-ele ">
    <div>${cartItem.itemsCount}x ${cartItem.product.title}</div>
    <div>$ ${cartItem.itemTotal}</div>
    </div>`;
  }

  #showMessage(message){
    this.cartProductsListRef.innerHTML = `<p>${message??"Error while feching cart"}</p>`;
  }

  paymentMethodUpdate(ref, paymentMethod){
      this.selectedPaymentMethod = paymentMethod;
  }

  async makeOrder(){
    let result = this.#validateOrderInfo();
    if(!result.status){
      this.errorNotifierRef.innerHTML = `<p>${result.message}</p>`;
      return;
    }
    this.errorNotifierRef.innerHTML = "";
    let requestBody = {
      mobile: this.mobileRef.value,
      addressLine:this.addressRef.value,
      district: this.cityRef.value,
      state: this.countryRef.value,
      paymentMethod: this.selectedPaymentMethod
    }
    let response = await services.postRequest(api.makeOrder, requestBody).catch(err =>{
      if(err == 401){
        window.location.replace("../login.html");
        return;
      }
    });
    if(!response.success) return;
    if(requestBody.paymentMethod == "COD"){
      console.log("Its Cod");
      alert("Your Order have been made successfully");
      setTimeout(() =>{
        window.location.replace("../index.html");
      }, 2000);
      return;
    }
    console.log("Its Card");
    dm.saveValue("paymentId", response.result.paymentId);
    window.location.replace(response.result.url);
    console.log(response);
  }

  #validateOrderInfo(){
    if(this.#isNull()) return {status: false, message:"Please fill the form's fields"};
    let emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if(!this.emailRef.value.match(emailPattern)) return {status: false, message:"Invalid Email Address"};
    let mobilePattern = /^[0][1]\d{9}$/;
    if(!this.mobileRef.value.match(mobilePattern)) return {status: false, message:"Invalid Mobile Number"};
    if(!this.selectedPaymentMethod) return {status: false, message:"Please select a payment method"};
   // if(this.selectedPaymentMethod.value != "COD" && this.selectedPaymentMethod.value != "CARD") return {status: false, message:"Invalid payment method"};
    return {status: true};
  }
  #isNull(){
    return !this.firstNameRef.value || 
    !this.lastNameRef.value || 
    !this.emailRef.value || 
    !this.addressRef.value || 
    !this.cityRef.value || 
    !this.countryRef.value || 
    !this.zipCodeRef.value || 
    !this.mobileRef.value;
  }
}

let checkoutManager = new CheckoutManager();
//CARD