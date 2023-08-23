async function oncancel(){
    let response = await services.getRequest(api.onFailure);
    dm.remove("paymentId");
    setTimeout(()=>{
        window.location.replace("./index.html");
    }, 2000);
}

async function onSuccess(){
    let response = await services.postRequest(api.onSuccess, {paymentId: dm.getString("paymentId")});
    if(response.success){
        dm.remove("paymentId");
        setTimeout(()=>{
            window.location.replace("./index.html");
        }, 2000);
    }
}