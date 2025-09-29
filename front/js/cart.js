const cart = []

retrieveItemsFromStorage()
loadAllProductsAndDisplay()

function retrieveItemsFromStorage() {
    const cartData = localStorage.getItem('kanapCart')
    if (cartData) {
        const parsedCart = JSON.parse(cartData)
        parsedCart.forEach(item => cart.push(item))
    }
}

function loadAllProductsAndDisplay() {
    if (cart.length === 0) {
        displayEmptyCart()
        setupOrderButton()
        return
    }
    
    // Récupérer tous les IDs uniques
    const uniqueIds = getUniqueProductIds()
    
    // Faire un seul fetch pour tous les produits
    fetchAllProducts(uniqueIds)
        .then((allProducts) => {
            displayAllItems(allProducts)
            updateCartTotals(allProducts)
            setupOrderButton()
        })
        .catch((error) => {
            console.error('Erreur:', error)
        })
}

function fetchAllProducts(productIds) {
    // Créer un tableau de promesses pour tous les produits
    const fetchPromises = productIds.map(id => 
        fetch(`http://localhost:3000/api/products/${id}`)
        .then(res => res.json())
    )
    
    // Retourner une promesse qui attend tous les fetch
    return Promise.all(fetchPromises)
}

function displayAllItems(allProducts) {
    const cartItemsSection = document.querySelector("#cart__items")
    cartItemsSection.innerHTML = ''
    
    cart.forEach((item) => {
        // Trouver le produit correspondant dans les données chargées
        const product = allProducts.find(p => p._id === item.id)
        if (product) {
            displaySingleItem(item, product)
        }
    })
}

function displaySingleItem(item, product) {
    const article = createArticleElement(item, product)
    displayArticleOnPage(article)
}

function createArticleElement(item, product) {
    const article = makeArticle(item)
    const imageDiv = createImageSection(product) // ← Données déjà disponibles
    const contentDiv = createContentSection(item, product) // ← Données déjà disponibles
    
    article.appendChild(imageDiv)
    article.appendChild(contentDiv)
    
    return article
}

function createImageSection(product) {
    const div = document.createElement("div")
    div.classList.add("cart__item__img")

    const image = document.createElement("img")
    image.src = product.imageUrl
    image.alt = product.altTxt
    div.appendChild(image)

    return div
}

function createContentSection(item, product) {
    const cardItemContent = document.createElement("div")
    cardItemContent.classList.add("cart__item__content")

    const description = makeDescription(item, product) // ← Données déjà disponibles
    const settings = makeSettings(item)

    cardItemContent.appendChild(description)
    cardItemContent.appendChild(settings)
    return cardItemContent
}

function makeDescription(item, product) {
    const description = document.createElement("div")
    description.classList.add("cart__item__content__description")

    // Plus besoin de fetch - les données sont déjà là
    const h2 = document.createElement("h2")
    h2.textContent = product.name
    const p = document.createElement("p")
    p.textContent = item.color
    const p2 = document.createElement("p")
    p2.textContent = (product.price * item.quantity).toFixed(2) + " €"

    description.appendChild(h2)
    description.appendChild(p)
    description.appendChild(p2)

    return description
}

function setupOrderButton() {
    const orderButton = document.querySelector("#order")
    orderButton.addEventListener("click", (e) => submitForm(e))
}

function makeSettings(item) {
    const settings = document.createElement("div")
    settings.classList.add("cart__item__content__settings")

    setupQuantitySection(settings, item)
    setupDeleteSection(settings, item)
    return settings
}

function setupDeleteSection(settings, item) {
    const div = document.createElement("div")
    div.classList.add("cart__item__content__settings__delete")
    div.addEventListener("click", () => handleItemDeletion(item))
    const p = document.createElement("p")
    p.textContent = "Supprimer"
    div.appendChild(p)
    settings.appendChild(div)
}

function handleItemDeletion(item) {
    const itemToDelete = cart.findIndex((product) => product.id === item.id && product.color === item.color)
    cart.splice(itemToDelete, 1)
    removeItemFromStorage(item)
    removeItemFromPage(item)
    loadAllProductsAndDisplay() // Recharger avec un seul fetch
}

function removeItemFromPage(item) {
    const articleToDelete = document.querySelector(`article[data-id="${item.id}"][data-color="${item.color}"]`)
    if (articleToDelete) {
        articleToDelete.remove()
    }
}

function setupQuantitySection(settings, item) {
    const quantity = document.createElement("div")
    quantity.classList.add("cart__item__content__settings__quantity")
    const p = document.createElement("p")
    p.textContent = "Qté : "
    quantity.appendChild(p)
    const input = document.createElement("input")
    input.type = "number"
    input.classList.add("itemQuantity")
    input.name = "itemQuantity"
    input.min = "1"
    input.max = "100"
    input.value = item.quantity
    input.addEventListener("input", () => handleQuantityChange(item.id, item.color, input.value))

    quantity.appendChild(input)
    settings.appendChild(quantity)
}

function handleQuantityChange(id, color, newValue) {
    const itemToUpdate = cart.find((item) => item.id === id && item.color === color)
    if (itemToUpdate) {
        itemToUpdate.quantity = Number(newValue)
        saveItemToStorage(itemToUpdate)
        loadAllProductsAndDisplay() // Recharger avec un seul fetch
    }
}

function removeItemFromStorage(item) {
    const cartData = localStorage.getItem('kanapCart')
    let cart = cartData ? JSON.parse(cartData) : []
    
    const updatedCart = cart.filter(cartItem => 
        !(cartItem.id === item.id && cartItem.color === item.color)
    )
    
    localStorage.setItem('kanapCart', JSON.stringify(updatedCart))
}

function saveItemToStorage(updatedItem) {
    const cartData = localStorage.getItem('kanapCart')
    let cart = cartData ? JSON.parse(cartData) : []
    
    const itemIndex = cart.findIndex(cartItem => 
        cartItem.id === updatedItem.id && cartItem.color === updatedItem.color
    )
    
    if (itemIndex > -1) {
        cart[itemIndex].quantity = updatedItem.quantity
        localStorage.setItem('kanapCart', JSON.stringify(cart))
    }
}

function displayArticleOnPage(article) {
    const cartItemsContainer = document.querySelector("#cart__items")
    if (cartItemsContainer) {
        cartItemsContainer.appendChild(article)
    }
}

function makeArticle(item) {
    const article = document.createElement("article")
    article.classList.add("cart__item")
    article.dataset.id = item.id
    article.dataset.color = item.color
    return article
}

function updateCartTotals(allProducts) {
    calculateTotalQuantity()
    calculateTotalPrice(allProducts) // ← Données déjà disponibles
}

function calculateTotalQuantity() {
    const totalQuantity = document.querySelector("#totalQuantity")
    const total = cart.reduce((total, item) => total + item.quantity, 0)
    if (totalQuantity) {
        totalQuantity.textContent = total
    }
}

function calculateTotalPrice(allProducts) {
    const totalPrice = document.querySelector("#totalPrice")
    
    let total = 0
    
    cart.forEach((item) => {
        const product = allProducts.find(p => p._id === item.id)
        if (product) {
            total += product.price * item.quantity
        }
    })
    
    if (totalPrice) {
        totalPrice.textContent = total.toFixed(2)
    }
}

function displayEmptyCart() {
    const cartItemsSection = document.querySelector("#cart__items")
    cartItemsSection.innerHTML = '<p>Votre panier est vide</p>'
    document.querySelector("#totalQuantity").textContent = "0"
    document.querySelector("#totalPrice").textContent = "0.00"
}

function submitForm(e) {
    e.preventDefault()
    if (cart.length === 0) {
        alert("Veuillez sélectionner des articles à acheter")
        return
    }
    
    if (isFormInvalid()) return
    if (isEmailInvalid()) return

    const body = prepareOrderData()
    
    fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then((res) => res.json())
    .then((data) => {
        const orderId = data.orderId
        localStorage.removeItem('kanapCart')
        window.location.href = "confirmation.html?orderId=" + orderId
    })
    .catch((err) => {
        console.error(err)
        alert("Erreur lors de la commande")
    })
}

function isEmailInvalid() {                                                                                // On crée une fonction isEmailInvalid() qui va nous permettre de vérifier si l'email est valide ou non.
    const email = document.querySelector("#email").value
    // Regex améliorée pour exiger une extension de domaine
    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]{2,})+$/
    if (regex.test(email) === false) {
        alert("Veuillez entrer une adresse email valide avec une extension (ex: nom@domaine.com, nom@domaine.fr)")
        return true
    }
    return false
}

function isFormInvalid() {
    const form = document.querySelector(".cart__order__form")
    const inputs = form.querySelectorAll("input")
    
    const hasEmptyField = Array.from(inputs).some(input => 
        input.value.trim() === ""
    )
    
    if (hasEmptyField) {
        alert("Veuillez remplir tous les champs")
        return true
    }
    
    const firstName = document.getElementById("firstName").value
    const nameRegex = /^[a-zA-ZÀ-ÿ\s\-']+$/
    
    if (!nameRegex.test(firstName)) {
        alert("Le prénom ne doit contenir que des lettres, espaces, traits d'union (-) et apostrophes (')")
        return true
    }
    
    const lastName = document.getElementById("lastName").value
    if (!nameRegex.test(lastName)) {
        alert("Le nom ne doit contenir que des lettres, espaces, traits d'union (-) et apostrophes (')")
        return true
    }
    
    const city = document.getElementById("city").value
    if (!nameRegex.test(city)) {
        alert("La ville ne doit contenir que des lettres, espaces, traits d'union (-) et apostrophes (')")
        return true
    }
    
    const address = document.getElementById("address").value
    if (address.trim().length < 3) {
        alert("L'adresse est trop courte")
        return true
    }
    
    return false
}

function prepareOrderData() {
    const form = document.querySelector(".cart__order__form")
    const firstName = form.elements.firstName.value
    const lastName = form.elements.lastName.value
    const address = form.elements.address.value
    const city = form.elements.city.value
    const email = form.elements.email.value
    
    const body = {
        contact: {
            firstName: firstName,
            lastName: lastName,
            address: address,
            city: city,
            email: email
        },
        products: getUniqueProductIds()
    }
    return body
}

function getUniqueProductIds() {
    const uniqueIds = []
    cart.forEach(item => {
        if (!uniqueIds.includes(item.id)) {
            uniqueIds.push(item.id)
        }
    })
    return uniqueIds
}