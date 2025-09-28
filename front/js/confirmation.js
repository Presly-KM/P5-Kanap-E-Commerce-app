const orderId = getOrderId()                                                   // On récupère l'orderId depuis l'URL.
displayOrderId(orderId)
removeAllStorageData()

function getOrderId() {                                                        // On crée une fonction getOrderId() qui va nous permettre de récupérer l'orderId depuis l'URL.
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    return urlParams.get("orderId")
}

function displayOrderId(orderId) {                                             // On crée une fonction displayOrderId() qui va nous permettre d'afficher l'orderId dans la page.
    const orderIdElement = document.getElementById("orderId")
    orderIdElement.textContent = orderId
}

function removeAllStorageData() {                                              // On crée une fonction removeAllStorageData() qui va nous permettre de supprimer les données du localStorage.
    localStorage.removeItem('kanapCart')
}
