const BEST_SALE_CONTAINER = 'bestSaleContainer';
const LOAD_MORE = 'bestSaleLoadMore';
const COLORS = [
    'var(--green)',
    'var(--orange)',
    'var(--skyBlue)',
    'var(--red)',
    'var(--blue)'
];
class BestSale{
    bestSaleContainerRef;
    loadMoreRef;
    itemsLimit = 5;
    #bestSaleItems = [];
    #filter = {limit: this.itemsLimit}
    constructor(){
        this.bestSaleContainerRef = document.getElementById(BEST_SALE_CONTAINER);
        this.loadMoreRef = document.getElementById(LOAD_MORE);
        this.loadMoreRef.style.display = "block";
    }

    async fetchBestSaleItems(){
        let response;
        if(this.itemsLimit){
          response =  await services.getRequest(api.getInventory, this.#filter).catch(e =>{
            if(e === 401){
              window.location.replace("../../index.html");
            }
         });
          this.loadMoreRef.style.display = "block";
        }else{
            response = await services.getRequest(api.getInventory).catch(e =>{
                if(e === 401){
                  window.location.replace("../../index.html");
                }
             });
            this.loadMoreRef.style.display = "none";
        }
        if(!response.success){
            notification.showNotification(response.message, NOTIFICATION_TYPES.error);
            this.loadMoreRef.style.display = "none";
            this.bestSaleContainerRef.innerHTML = "<span> There is no result !</span>";
            return;
        }
        this.#bestSaleItems = response.result;
        this.#showBestSaleItems();
        //TODO: Handel load more here
    }
    #showBestSaleItems(){
        if(this.#bestSaleItems.length < this.itemsLimit) this.loadMoreRef.style.display = "none";
        if(this.#bestSaleItems.length == 0){
            this.bestSaleContainerRef.innerHTML = "<span> There is no result !</span>";
            return ;
        } 
        let items = [];
        let index = 0;
        for(let item of this.#bestSaleItems){
            items.push(this.#formSaleItem(item, index));
            index++;
        }
        this.bestSaleContainerRef.innerHTML = items.join(" ");
    }
    #formSaleItem(item, index){
        return `<div class="bestSaleItem" style="background-color:${COLORS[index%COLORS.length]}">
        <img src="${item.img[0]}" alt="">
        <span>${index + 1}</span>
        <div class="bestSaleItemInfo">
            <h3>${item.productTitle}</h3>
            <div>
                <span class="infoLable">Sold : </span>
                <span>${item.totalItemsSold.toLocaleString()??0}</span>
                <span class="infoLable">Revenue : </span>
                <span>${item.totalRevenue.toLocaleString()??0} £</span>
                <span class="infoLable">Total Cost : </span>
                <span>${item.totalCost.toLocaleString()??0} £</span>
                <span class="infoLable">Profit : </span>
                <span>${item.profit.toLocaleString()??0} £</span>
                <span class="infoLable">In Store : </span>
                <span>${item.avaliable.toLocaleString()??0}</span>
            </div>
        </div>
    </div>`;
    }
    loadMore(){
        this.itemsLimit = 0;
        this.loadMoreRef.style.display = "none";
        this.fetchBestSaleItems();
    }

    applyDateRange(){
        let filter = inventoryNav.getRange();
        
        if(!filter) return;
        filter.limit = this.itemsLimit;
        this.#filter = filter;
        this.fetchBestSaleItems();
    }
}

let bestSale = new BestSale();