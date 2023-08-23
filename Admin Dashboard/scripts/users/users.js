const ROLES = {
    superAdmin: "superadmin",
    admin: "admin",
    customer: "customer"
}
const USER_LIST = "usersList";
class UsersManager {
    usersListContainerRef;
    usersList = [];
    constructor(){
        this.usersListContainerRef = document.getElementById(USER_LIST);
    }
    onUsersLoad(){
         this.#getUsersList();
    }
    async #getUsersList(){
        let result = await services.getRequest(api.getUsers).catch(error => {
            if(error === 401){
                window.location.replace("../../index.html");
                return;
            }
        });
        if(!result.success){
            notification.showNotification(result.message, NOTIFICATION_TYPES.error);
            return;
        }
        this.usersList = result.result;
        this.#showUsers();
    }
    async #showUsers(){
        if(this.usersList.length == 0) return;
        let users = [];
        let index = 0;
        for(let user of this.usersList){
            users.push(this.formUserItem(user, index));
        }
        this.usersListContainerRef.innerHTML = users.join("");
    }
    formUserItem(user, index){
        return `<div class="user" >
        <p>${user.name}</p>
        <a href="mailto:${user.email}">${user.email}</a>
        <div>
            <select class="role" name="userRole" onchange="usersManager.updateUserRole('${user._id}', this, ${index})">
                <option value=${ROLES.superAdmin} ${user.userRole == ROLES.superAdmin ? "selected" : ""}>Super Admin </option>
                <option value=${ROLES.admin} ${user.userRole == ROLES.admin ? "selected" : ""}>Admin</option>
                <option value=${ROLES.customer} ${user.userRole == ROLES.customer ? "selected" : ""}>Customer</option>
            </select>
        </div>
    </div>`;
    }

   async updateUserRole(userId, ref, index) {
        if(!ROLES[ref.value]){
            notification.showNotification("Invalid role", NOTIFICATION_TYPES.error);
            return;
        }
        let userRole = ref.value;
        let response = await services.putRequest(api.updateUser,{ userId:userId,role:ref.value}).catch(err=>{
            if(err === 401){
                notification.showNotification("You are not authorized to update roles", NOTIFICATION_TYPES.error);
                ref.value = this.usersList[index].userRole;
                return;
            }
            ref.value = this.usersList[index].userRole;
            notification.showNotification("Error occuered while updating.", NOTIFICATION_TYPES.error);
        });
        if(!response.success){
            ref.value = this.usersList[index].userRole;
            notification.showNotification(response.message??"Error occuered while updating", NOTIFICATION_TYPES.error);
            return;
        }
        this.usersList[index].userRole = userRole;
        this.#showUsers();
        notification.showNotification(response.result??"Updated Successfully", NOTIFICATION_TYPES.success);
    }
}
let usersManager = new UsersManager();