const ORDERS_LIST = 'ordersList';
const ORDERS_CONTAINER = 'ordersList';
//const STATUS_SELECT = 'orderStatus';
const DEFUALT_ERROR_MSG = 'Error while getting orders';
class Orders {
    ORDERS_STATUS_COLOR = {
        received: "var(--red)",
        processing: "var(--orange)",
        delivered: "var(--green)",
        none: "var(--transparent)"
    }
    ORDER_STATUS = {
        received: "received",
        processing: "processing",
        delivered: "delivered"
    }
    //orderStatusSelectRef;
    ordersListRef;
    ordersListContainerRef;
    ordersList = [];
    constructor() {
        this.ordersListRef = document.getElementById(ORDERS_LIST);
        this.ordersListContainerRef = document.getElementById(ORDERS_CONTAINER);
        //this.orderStatusSelectRef = document.getElementById(STATUS_SELECT);
    }
    async getOrders(orderStatus) {
        let ordersData = await services.getRequest(api.getOrdersByStatus, { status: orderStatus }).catch(e =>{
           if(e === 401){
             window.location.replace("../../index.html");
           }
        });
        if (!ordersData.success) {
            this.ordersListRef.innerHTML = this.#getOrdersMessagesNoftifier(ordersData.message ?? DEFUALT_ERROR_MSG);
            this.#changeOrdersContainerColor(this.ORDERS_STATUS_COLOR.none);
            return;
        }
        if (!ordersData.result || ordersData.result.length == 0) {
            this.ordersListRef.innerHTML = this.#getOrdersMessagesNoftifier(`Oops! There is no ${orderStatus} orders.`);
            this.#changeOrdersContainerColor(this.ORDERS_STATUS_COLOR.none);
            return;
        }
        this.ordersList = ordersData.result;
        this.showOrders();
    }
    showOrders() {
        if (this.ordersList.length == 0) {
            this.ordersListRef.innerHTML = this.#getOrdersMessagesNoftifier(`There is no orders.`);
            this.#changeOrdersContainerColor(this.ORDERS_STATUS_COLOR.none);
            return;
        }
        let domOrdersList = [];
        let index = 0;
        let color = this.ordersList[index].orderStatus == this.ORDER_STATUS.received ? 
            this.ORDERS_STATUS_COLOR.received :
            this.ordersList[index].orderStatus == this.ORDER_STATUS.processing ? 
            this.ORDERS_STATUS_COLOR.processing : this.ORDERS_STATUS_COLOR.delivered;
        this.#changeOrdersContainerColor(color);
        for (let order of this.ordersList) {
            domOrdersList.push(this.#formatOrder(order, index));
            index++;
        }
        let domStr = domOrdersList.join(' ');
        this.ordersListRef.innerHTML = domStr;
    }

    #formatOrder(order, index) {
        return `<div class="mainOrderInfo" id="${order._id}">
        <p>${order.customerInfo.userId.name}</p>
        <a href="mailto:${order.customerInfo.userId.email}">${order.customerInfo.userId.email}</a>
        <p>${this.#formatDateString(order.createdAt)}</p>
        <p>${order.billSummary.totalPrice.toLocaleString()} £</p>
        <div>
            <select class="status" name="order" onchange="orders.updateOrderStatus(this, '${order._id}', ${index})">
                <option value="received" ${order.orderStatus == this.ORDER_STATUS.received ? "selected" : ""}>Received </option>
                <option value="processing" ${order.orderStatus == this.ORDER_STATUS.processing ? "selected" : ""}>Processing</option>
                <option value="delivered" ${order.orderStatus == this.ORDER_STATUS.delivered ? "selected" : ""}>Delivered</option>
            </select>
        </div>
    </div>`;
    }
    #getOrdersMessagesNoftifier(message) {
        return `<span id="ordersNotifier">${message}</span>`
    }
    #formatDateString(dateString) {
        let date = new Date(dateString);
        return `${date.getUTCDay()}-${date.getUTCMonth()}-${date.getFullYear()}`;
    }
    async updateOrderStatus(selectRef, orderId, orderIndex) {
        let response = await services.putRequest(api.updateOrderStatus, { orderId: orderId, status: selectRef.value });
        if (response.success) {
            this.ordersList.splice(orderIndex, 1);
            this.showOrders();
            notification.showNotification(response.result, NOTIFICATION_TYPES.success);
            return;
        }
        notification.showNotification(response.message, NOTIFICATION_TYPES.success);
    }
    async getOrdersByStatus(selectRef) {
        this.getOrders(selectRef.value);
    }
    #changeOrdersContainerColor(color) {
        this.ordersListContainerRef.style.backgroundColor = color;
    }
}
let orders = new Orders();
/*{
    "orderId":"64ccf775f1071c6e93ec2d3a",
    "status":"processing"
}*/