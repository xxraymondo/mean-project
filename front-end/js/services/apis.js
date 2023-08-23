class Apis {
    register;
    login;
    addProduct;
    updateProduct;
    getProducts;
    getUsers;
    deleteProduct;
    getInventory;
    getActiveUser;
    getdashboardInfo;
    updateOrderStatus;
    getOrdersByStatus;
    updateUser;
    makeOrder;
    getCart;
    onSuccess;
    onFailure;

    constructor() {
        this.register = "register";
        this.login = "login";
        this.addProduct = "product";
        this.updateProduct = "product";
        this.getProducts = "product";
        this.deleteProduct = "product/";
        this.getInventory = "inventory";
        this.getActiveUser = "active-users";
        this.getdashboardInfo = "dashboardInfo";
        this.updateOrderStatus = "orderStatus";
        this.getOrdersByStatus = "ordersByStatus";
        this.getUsers = "users";
        this.updateUser = "users";
        this.makeOrder = "order";
        this.getCart = "cart";
        this.onSuccess = "paymentSuccess";
        this.onFailure = "paymentCanceled";
    }

}
let api = new Apis();