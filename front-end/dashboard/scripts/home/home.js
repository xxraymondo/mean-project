const USER_NAME_WEL = "userNameWel";
class HomeManager {
    userNameWelcomeRef;
    constructor(){
        this.userNameWelcomeRef = document.getElementById(USER_NAME_WEL);
        this.#init();
    }
    onHomeLoad(){
        dashBoard.getDashboard({from:'2023-08-05'});
        orders.getOrders(orders.ORDER_STATUS.received);
    }
    #init(){
        this.userNameWelcomeRef.innerHTML = dm.getString("userName").split(' ')[0];
    }
}
let homeManager = new HomeManager();