const NOTIFICATION_ID = 'notification';
const NOTIFICATION_TYPES = {
    success: 'success',
    error: 'error'
}
class Notification{
    notification;
    constructor(){
        this.notification = document.getElementById(NOTIFICATION_ID);
    }
    showNotification(message, messageType){
        this.notification.querySelector('span').textContent = message;
        this.notification.style.backgroundColor = NOTIFICATION_TYPES.success == messageType? 'var(--green)': 'var(--red)';
        this.notification.style.bottom = '20px';
        this.notification.style.opacity = 1;
        setTimeout(this.#hideNotification, 2000);
    }
    #hideNotification(){
        this.notification.style.bottom = '-40px';
        this.notification.style.opacity = 0;
    }
}
let notification = new Notification();