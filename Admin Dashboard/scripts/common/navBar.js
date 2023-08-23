const PROFILE_DROPDOWN = 'profileDropdown';
const MOBILE_SUBMENU = 'subMenuMobile';
const SIDEBAR_OVERLAY = 'sideBarOverlay';
const SIDEBAR = 'sideBar';
const FROM_DATE = 'fromDate';
const TO_DATE = 'toDate';
const USER_NAME = "subMenuUserName";

const USER_EMAIL = "subMenuUserEmail"
const CLOSE_ICON = `<i class="fa-solid fa-xmark"></i>`;
const OPEN_ICON = `<i class="fa-solid fa-bars"></i>`;
class Navigation {
    profileDropdownRef;
    mobileSubMenuRef;
    sideBarOverlayRef;
    sideBarRef;
    fromDateRef;
    toDateRef;
    menuIconRef;
    userNameRef;
   
    userEmailRef;
    #isDesktopMenu1 = false;
    #isMobileSubMenu = false;
    #isOverlayMenu = false;
    constructor(){
        this.profileDropdownRef = document.getElementById(PROFILE_DROPDOWN);
        this.mobileSubMenuRef = document.getElementById(MOBILE_SUBMENU);
        this.sideBarOverlayRef = document.getElementById(SIDEBAR_OVERLAY);
        this.sideBarRef = document.getElementById(SIDEBAR);
        this.fromDateRef = document.getElementById(FROM_DATE);
        this.toDateRef = document.getElementById(TO_DATE);
        this.userNameRef = document.getElementById(USER_NAME);
        this.userEmailRef = document.getElementById(USER_EMAIL);
        this.setDateLimits();
        this.#setUserInfo();
    }
    onUserProfileClicked(ref){
        ref.querySelector('i').style.transform = this.#isDesktopMenu1?  'rotate(0deg)':'rotate(180deg)';
        this.profileDropdownRef.style.display = this.#isDesktopMenu1? 'none' : 'block';
        this.#isDesktopMenu1 = !this.#isDesktopMenu1;
    }

    onMenuIconClicked(ref){
        this.menuIconRef = ref??this.menuIconRef;
        this.mobileSubMenuRef.style.display = 'flex';
        this.mobileSubMenuRef.style.height = this.#isMobileSubMenu?'50vh':'0';
        this.menuIconRef.innerHTML = this.#isMobileSubMenu?CLOSE_ICON:OPEN_ICON;
        this.#isMobileSubMenu = !this.#isMobileSubMenu;
    }
    getTodaysDate(){

    }
    toggelDashboardSettings(){
        if(this.#isOverlayMenu){
            this.sideBarOverlayRef.style.width = "0%";
            this.sideBarRef.style.width = "0";
            this.#isOverlayMenu = !this.#isOverlayMenu;
            return;
        }
        this.sideBarOverlayRef.style.width = "100%";
        this.sideBarRef.style.width = "300px";
        this.#isOverlayMenu = !this.#isOverlayMenu;
    }
    setDateLimits(){
        this.#setFromLimit();
        this.#setToLimit();
    }
    #setUserInfo(){
        this.userNameRef.innerHTML = dm.getString("userName");
        this.userEmailRef.innerHTML = dm.getString("email");
    }
    #setFromLimit(){
        let todaysDate = new Date().toISOString().split('T')[0];
        this.fromDateRef.setAttribute('max', todaysDate);
    }
    #setToLimit(){
        let yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        let yesterDayDate = yesterday.toISOString().split('T')[0];
        this.toDateRef.setAttribute('max', yesterDayDate);
    }
    onDatePicked(dateRef){
        if(dateRef.id == TO_DATE && !dateRef.value){
            this.fromDateRef.setAttribute('min', "");
            return;
        }
        if(dateRef.id == FROM_DATE && !dateRef.value){
            this.#setToLimit();
            return;
        }

        let selectedDate = new Date(dateRef.value);
        if(dateRef.id == TO_DATE){
            selectedDate.setDate(selectedDate.getDate() + 1);
            
            this.fromDateRef.setAttribute('min', selectedDate.toISOString().split('T')[0]);
            return;
        }
        selectedDate.setDate(selectedDate.getDate() - 1);
        this.toDateRef.setAttribute('max', selectedDate.toISOString().split('T')[0])
    }

    getRange(){
        
        if(!this.toDateRef.value && !this.fromDateRef.value){
            notification.showNotification("Set at least from or to date",NOTIFICATION_TYPES.error);
            return;
        }
        if( (this.toDateRef.value && this.fromDateRef.value)&& this.fromDateRef.value <= this.toDateRef.value){
            notification.showNotification("Start Date cannot be older than End date",NOTIFICATION_TYPES.error);
            return;
        }
        this.#setRangeToLocal();
        return {
            from: this.toDateRef.value,
            to: this.fromDateRef.value
        }
    }
    #setRangeToLocal(){
        //TODO: Complete this when you finish the auth
    }
    logOut(){
        dm.remove("token");
        window.location.replace("../index.html");
    }
}
let navigation = new Navigation();
let inventoryNav = new Navigation();
let usersNav = new Navigation();