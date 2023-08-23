// app.js

function checkAuthentication() {
    const authToken = localStorage.getItem('authToken');
    const userName = localStorage.getItem('userName');
    const currentPage = window.location.pathname.split('/').pop();
  
    const restrictedPages = ['login.html', 'register.html', 'forgot-password.html', 'reset-password.html'];
  
    if (authToken && userName) {
      if (restrictedPages.includes(currentPage)) {
        window.location.href = 'index.html';
      }
      return true;
    } else {
      if (!restrictedPages.includes(currentPage)) {
        window.location.href = 'login.html';
      }
      return false;
    }
  }
  
  window.onload = function () {
    checkAuthentication();
  };
  