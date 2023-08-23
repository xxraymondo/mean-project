const ORDER_STATUS = {
    received: 'received',
    processing: 'processing',
    delivered: 'delivered',
    cancelled: 'cancelled'
}

const Roles = {
    superAdmin: "superadmin",
    admin: "admin",
    customer: "customer"
}
const Actions = {
    all: "all",
    updateProduct: "updateProduct",
    deleteProduct: "deleteProduct",
    addProduct: "addProduct",
    updateUser: "updateUser",
    deleteUser: "deleteUser",
    getUsers: "getUsers",
    getActiveUsers: "getActiveUsers",
    addCartItem: "addCartItem",
    deleteCartItem: "deleteCartItem",
    updateCartItem: "updateCartItem",
    getCart: "getCart",
    addCategory: "addCategory",
    deleteCategory: "deleteCategory",
    updateCategory: "updateCategory",
    getUserOrders: "getUserOrders",
    placeOrder: "placeOrder",
    updateOrderStatus: "updateOrderStatus",
    allOrdersActions: "allOrdersActions",

}
const AllowedActions = {
    superadmin: [
        Actions.all
    ],
    admin: [
        Actions.updateProduct,
        Actions.deleteProduct,
        Actions.addProduct,
        Actions.deleteUser,
        Actions.getUsers,
        Actions.addCartItem,
        Actions.deleteCartItem,
        Actions.updateCartItem,
        Actions.getCart,
        Actions.addCategory,
        Actions.deleteCategory,
        Actions.updateCategory,
        Actions.getUserOrders,
        Actions.allOrdersActions,
        Actions.placeOrder,
        Actions.updateOrderStatus,
        Actions.getActiveUsers
    ],
    customer: [
        Actions.addCartItem,
        Actions.deleteCartItem,
        Actions.updateCartItem,
        Actions.getCart,
        Actions.getUserOrders,
        Actions.placeOrder
    ]
} 
module.exports = {
    Roles,
    Actions,
    AllowedActions,
    ORDER_STATUS
}
