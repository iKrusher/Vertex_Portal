(function () {

    document.querySelector('#logout-link').onclick = () => { window.location.pathname = '/login' }

    (document.querySelector('#dismiss-alert-button') || {} ).onclick = () => {
        document.querySelector('#low-inventory-alert-container').setAttribute('hidden', true)
    }
    
    (document.querySelector('#checkout-button') || {} ).onclick = () => {
        document.querySelector('#low-inventory-alert-container').removeAttribute('hidden')
    }


})()