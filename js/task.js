window.addEventListener('load', () => {
    var storedFullName = localStorage.getItem('fullName');

    if (storedFullName) {
        document.getElementById('userNameDisplay').innerText = storedFullName;
        document.getElementById('user').style.display = 'block';
        document.getElementById('signout').style.display = 'block'; 
    } else {
        document.getElementById('user').style.display = 'none';
        document.getElementById('signout').style.display = 'none';
    }
});
