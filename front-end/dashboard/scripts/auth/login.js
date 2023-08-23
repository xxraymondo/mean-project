const USER_NAME = "userEmail";
const PASSWORD = "userPassword";
const OPENED_EYE = `<i class="fa-regular fa-eye">`;
const CLOSED_EYE = `<i class="fa-regular fa-eye-slash"></i>`;
class Auhentication{
    userNameRef;
    passwordRef;
    constructor(){
        this.userNameRef = document.getElementById(USER_NAME);
        this.passwordRef = document.getElementById(PASSWORD);
    }

    toggelViewPassword(ref){
        let state = this.passwordRef.type =="text";
        ref.innerHTML = state? OPENED_EYE:CLOSED_EYE;
        this.passwordRef.type = state? 'password':'text';
    }

    async login(){
        if(!this.#validate) return;
        let reqBody = {
            email: this.userNameRef.value,
            password: this.passwordRef.value
        }
        dm.saveValue("email", reqBody.email);
        let response = await services.postRequest(api.login, reqBody);
        if(!response.success){
            notification.showNotification(response.message??"Error while logging in", NOTIFICATION_TYPES.error);
            return;
        }
        dm.saveValue("token", response.token);
        dm.saveValue("userName", response.user.name);
        services.setToken(response.token);
        window.location.replace("../dashboard/pages/dashboard.html");
    }
    #validate(){
        if(!this.userNameRef.value || !this.passwordRef.value){
            notification.showNotification("Invalid Credentials",NOTIFICATION_TYPES.error);
            return false;
        }
        return true;
    }
}
let auth = new Auhentication();