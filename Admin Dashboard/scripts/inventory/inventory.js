class Inventory{
    constructor(){
    }
    onInventoryLoad(){
        bestSale.fetchBestSaleItems();
        inventoryProducts.fetchProducts();
    }
}
let inventory = new Inventory();