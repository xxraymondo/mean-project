
const ACTIVE_USERS = 'activUsers';
const SOLD_ITEMS = 'soldItems';
const WEEK_ORDERS = 'soldInPeroid';
const TOTAL_EARNING = 'totalEarning';
class DashBoard {
    activUsersRef;
    soldItemsRef;
    weekOrdersRef;
    totalEarningsRef;
    constructor(){
        this.activUsersRef = document.getElementById(ACTIVE_USERS);
        this.soldItemsRef = document.getElementById(SOLD_ITEMS);
        this.weekOrdersRef = document.getElementById(WEEK_ORDERS);
        this.totalEarningsRef = document.getElementById(TOTAL_EARNING);
    }
    async getDashboard(options = {}) {
        let result = await services.getRequest(api.getdashboardInfo, options).catch(e =>{
            if(e === 401){
              window.location.replace("../../index.html");
            }
         });
        this.setDashboardVals(result);
        this.setDashboardLabels(options);
    }

    setDashboardVals(dashboardInfo, isEmptyQuery) {
        this.activUsersRef.querySelector('h2').textContent = this.numberToCommaString(dashboardInfo.activeUsers ?? 0);
        this.soldItemsRef.querySelector('h2').textContent = this.numberToCommaString(dashboardInfo.periodSold ?? 0);
        this.weekOrdersRef.querySelector('h2').textContent = this.numberToCommaString(dashboardInfo.weekSold ?? 0);
        this.totalEarningsRef.querySelector('h2').textContent = `${this.numberToCommaString(dashboardInfo.periodEarnings ?? 0)} £`;
    }

    setDashboardLabels(options){}

    numberToCommaString(number) {
        return number.toLocaleString();
    }
    applyDashboardRange(){
        let range = navigation.getRange();
        if(!range) return;
        this.getDashboard(range);
    }
}

let dashBoard = new DashBoard();