const Product = require('../schemas/product');

async function createProduct(product){
    let response = {success: true};
    let productObj = new Product(product);
    let result = await productObj.save().catch(err =>{
        console.log("Create Product failed", err);
        return "error";});
    if(result ==="error"){
        response.success = false;
        response.message = "Error Occured while saving product";
        return response;
    }
    response.result = result;
    return response;
}

//TODO: check for the _id and productId in the product object in the request body
async function updateProduct(product){
    let response = {success: true};
    let productId = product.productId;
    delete product.productId;
    let result = await Product.findByIdAndUpdate(productId, product).catch(err =>"error");
    if(result ==="error"){
        response.success = false;
        response.message = "Error Occured while updating product";
        return response;
    }
    response.result = result;
    return response;
}

async function deleteProduct(productId){
    let response = {success: true};
    let result = await Product.findByIdAndDelete(productId).catch(err =>"error");
    if(result ==="error"){
        response.success = false;
        response.message = "Error Occured while Deleting product";
        return response;
    }
    response.result = result;
    return response;
}

async function getProducts(reqBody){
    let query  = getQuery(reqBody);
    let response = await fetchProducts(reqBody.page??1, reqBody.limit??8, query);
    return response;
}

//TODO: Make sure that the page is greater than 1
async function fetchProducts(page , limit, query){
        page = Number(page);
        limit=Number(limit);
        let startIndex = (page - 1) * limit;
        let endIndex = page * limit;
        
        let response = {success: true};
        let reCount = await Product.countDocuments(query).exec();
        
        try{
            if(query['$text']){
                response.result = await Product
                .find(query,{ score: { $meta: "textScore" } })
                .sort( { score: { $meta: "textScore" } } )
                .limit(limit).skip(startIndex)
                .exec();
            }
             else{
                response.result = await Product
                .find(query)
                .limit(limit).skip(startIndex)
                .exec();
            }
            if( endIndex < reCount)response.nextPage = page + 1;
            if( startIndex > 0 )response.previousPage = page - 1; 
            response.limit = limit;
            response.pagesCount = Math.ceil(reCount/limit);
            return response;
        }catch(e){
           console.log("Error in paginated ", e);
        }
    response.success = false;
    response.message ="Error occurred while getting products";
    return response;
}


function getQuery(filter){
    let query = {};
    if('category' in filter){
        query.category = filter.category;
    }
    if('from' in filter || 'to' in filter){
        query.price = {};
        if(filter.from){
            query.price.$gte = Number(filter.from);
        }
        if(filter.to){
            query.price.$lte = Number(filter.to);
        }
    }
    if('expr' in filter){
        query['$text'] = { $search: filter.expr}
    }
    return query;
}

module.exports={
    createProduct,
    updateProduct,
    deleteProduct,
    getProducts
};

/*
filter = {
    category:"",
    price:{
        from: 0,
        to
    }
}
*/