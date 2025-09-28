const cart = []                                                            // On crée un tableau vide qui va nous permettre de stocker les produits du panier.

retrieveItemsFromStorage()
displayAllItems()
setupOrderButton()                                                         // On appelle la fonction retrieveItemsFromStorage() pour récupérer les produits du panier dans le localStorage et les afficher sur la page. Puis on appelle la fonction displayAllItems() pour afficher tous les produits du panier sur la page. Enfin on appelle la fonction setupOrderButton() pour configurer le bouton de commande.

function retrieveItemsFromStorage() {                                      // On crée une fonction retrieveItemsFromStorage() qui va nous permettre de récupérer les produits du panier dans le localStorage.
    const cartData = localStorage.getItem('kanapCart')                     // On récupère les données du panier dans le localStorage. On utilise la méthode getItem() de l'interface Storage pour récupérer les données du panier qui sont stockées sous la clé 'kanapCart'. On assigne ces données à la variable cartData.
    if (cartData) {                                                        // Si les données du panier existent dans le localStorage...
        const parsedCart = JSON.parse(cartData)                            // ...on les transforme en objet JavaScript avec la méthode JSON.parse() et on les assigne à la variable parsedCart.
        parsedCart.forEach(item => cart.push(item))                        // Pour chaque élément (item) récupéré depuis le localStorage (et ayant été parsé par const parsedCart), on l'ajoute au tableau cart avec la méthode push().
    }
}
 
function displayAllItems() {                                               // On crée une fonction displayAllItems() qui va nous permettre d'afficher tous les produits du panier sur la page.
    cart.forEach((item) => {                                               // Pour chaque élément (item) dans le tableau cart...
        displaySingleItem(item)                                            // ...on appelle la fonction displaySingleItem() pour afficher cet élément sur la page.
    })
    updateCartTotals()                                                     // On appelle la fonction updateCartTotals() pour mettre à jour le total des quantités et des prix du panier.
}

function displaySingleItem(item) {                                         // On crée une fonction displaySingleItem() qui va nous permettre d'afficher un seul produit du panier sur la page. On lui passe en paramètre l'élément (item) à afficher.
    const article = createArticleElement(item)                             // On crée l'élément <article> pour le produit du panier en appelant la fonction createArticleElement() et on l'affiche sur la page en appelant la fonction displayArticleOnPage().
    displayArticleOnPage(article)                                          // On affiche l'élément <article> sur la page en appelant la fonction displayArticleOnPage().
}

function createArticleElement(item) {                                      // On crée une fonction createArticleElement() qui va nous permettre de créer l'élément <article> pour un produit du panier. On lui passe en paramètre l'élément (item) à afficher.
    const article = makeArticle(item)
    const imageDiv = createImageSection(item)
    const contentDiv = createContentSection(item)
    
    article.appendChild(imageDiv)
    article.appendChild(contentDiv)
    
    return article
}

function createImageSection(item) {                                        // On crée une fonction createImageSection() qui va nous permettre de créer la section image pour un produit du panier. On lui passe en paramètre l'élément (item) à afficher.
    return makeImageDiv(item)                                              // Ici 
}

function createContentSection(item) {                                      // On crée une fonction createContentSection() qui va nous permettre de créer la section contenu pour un produit du panier. On lui passe en paramètre l'élément (item) à afficher.
    return makeCartContent(item)
}

function setupOrderButton() {                                              // On crée une fonction setupOrderButton() qui va nous permettre de configurer le bouton de commande.
    const orderButton = document.querySelector("#order")
    orderButton.addEventListener("click", (e) => submitForm(e))
}

function makeCartContent(item) {                                           // On crée une fonction makeCartContent() qui va nous permettre de créer la section contenu pour un produit du panier. On lui passe en paramètre l'élément (item) à afficher.
    const cardItemContent = document.createElement("div")
    cardItemContent.classList.add("cart__item__content")

    const description = makeDescription(item)
    const settings = makeSettings(item)

    cardItemContent.appendChild(description)
    cardItemContent.appendChild(settings)
    return cardItemContent
}

function makeSettings(item) {                                              // On crée une fonction makeSettings() qui va nous permettre de créer la section paramètres pour un produit du panier. On lui passe en paramètre l'élément (item) à afficher.
    const settings = document.createElement("div")
    settings.classList.add("cart__item__content__settings")

    setupQuantitySection(settings, item)
    setupDeleteSection(settings, item)
    return settings
}

function setupDeleteSection(settings, item) {                              // On crée une fonction setupDeleteSection() qui va nous permettre de créer la section supprimer pour un produit du panier. On lui passe en paramètre l'élément (item) à afficher.
    const div = document.createElement("div")
    div.classList.add("cart__item__content__settings__delete")
    div.addEventListener("click", () => handleItemDeletion(item))
    const p = document.createElement("p")
    p.textContent = "Supprimer"
    div.appendChild(p)
    settings.appendChild(div)
}

function handleItemDeletion(item) {                                                                          // On crée une fonction handleItemDeletion() qui va nous permettre de gérer la suppression d'un produit du panier. On lui passe en paramètre l'élément (item) à supprimer.
    const itemToDelete = cart.findIndex((product) => product.id === item.id && product.color === item.color) // On cherche l'index de l'élément (item) à supprimer dans le tableau cart en utilisant la méthode findIndex(). On compare l'id et la couleur pour être sûr de trouver le bon élément.
    cart.splice(itemToDelete, 1)                                                                             // On supprime l'élément (item) du tableau cart en utilisant la méthode splice() avec l'index trouvé précédemment.
    updateCartTotals()
    removeItemFromStorage(item)
    removeItemFromPage(item)
}

function removeItemFromPage(item) {                                                                          // On crée une fonction removeItemFromPage() qui va nous permettre de supprimer un produit du panier de la page. On lui passe en paramètre l'élément (item) à supprimer.
    const articleToDelete = document.querySelector(`article[data-id="${item.id}"][data-color="${item.color}"]`)
    if (articleToDelete) {
        articleToDelete.remove()
    }
}

function setupQuantitySection(settings, item) {                                                              // On crée une fonction setupQuantitySection() qui va nous permettre de créer la section quantité pour un produit du panier. On lui passe en paramètre l'élément (item) à afficher.
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

function handleQuantityChange(id, color, newValue) {                                                        // On crée une fonction handleQuantityChange() qui va nous permettre de gérer concernant les produits dans le panier le changement de quantité et le total affiché de manière simultanée .On lui passe en paramètre l'id, la couleur et la nouvelle valeur de la quantité.
    const itemToUpdate = cart.find((item) => item.id === id && item.color === color)
    if (itemToUpdate) {                                                                                     // Si l'élément (item) à mettre à jour existe dans le tableau cart...
        itemToUpdate.quantity = Number(newValue)                                                            // ...on met à jour la quantité en convertissant la nouvelle valeur en nombre avec la fonction Number().
        updateCartTotals()                                                                                  // On met à jour le total des quantités et des prix du panier en appelant la fonction updateCartTotals().
        saveItemToStorage(itemToUpdate)                                                                     // On sauvegarde l'élément (item) mis à jour dans le localStorage en appelant la fonction saveItemToStorage().
    }
}

function removeItemFromStorage(item) {                                                                      // On crée une fonction removeItemFromStorage() qui va nous permettre de supprimer un produit du panier dans le localStorage. On lui passe en paramètre l'élément (item) à supprimer.
    const cartData = localStorage.getItem('kanapCart')
    let cart = cartData ? JSON.parse(cartData) : []                                                         // On récupère les données du panier dans le localStorage. On utilise la méthode getItem() de l'interface Storage pour récupérer les données du panier qui sont stockées sous la clé 'kanapCart'. On assigne ces données à la variable cartData. Si les données du panier existent, on les transforme en objet JavaScript avec la méthode JSON.parse() et on les assigne à la variable cart. Sinon, on initialise cart comme un tableau vide.
    
    const updatedCart = cart.filter(cartItem =>                                                             // On crée un nouveau tableau updatedCart en filtrant le tableau cart pour ne garder que les éléments (cartItem) qui ne correspondent pas à l'élément (item) à supprimer.
        !(cartItem.id === item.id && cartItem.color === item.color)
    )
    
    localStorage.setItem('kanapCart', JSON.stringify(updatedCart))                                          // On enregistre les données du panier mises à jour dans le localStorage en utilisant la méthode setItem() de l'interface Storage. On transforme l'objet updatedCart en chaîne JSON avec la méthode JSON.stringify() et on le stocke sous la clé 'kanapCart'.
}

function saveItemToStorage(updatedItem) {                                                                   // On crée une fonction saveItemToStorage() qui va nous permettre de sauvegarder un produit du panier dans le localStorage. On lui passe en paramètre l'élément (updatedItem) à sauvegarder.
    const cartData = localStorage.getItem('kanapCart')                                                   
    let cart = cartData ? JSON.parse(cartData) : []
    
    const itemIndex = cart.findIndex(cartItem =>                                                            // On cherche l'index de l'élément (updatedItem) à mettre à jour dans le tableau cart en utilisant la méthode findIndex(). On compare l'id et la couleur pour être sûr de trouver le bon élément.
        cartItem.id === updatedItem.id && cartItem.color === updatedItem.color
    )
    
    if (itemIndex > -1) {                                                                                   // Si l'élément (updatedItem) à mettre à jour existe dans le tableau cart (si l'index est supérieur à -1)...
        cart[itemIndex].quantity = updatedItem.quantity                                                     // ...on met à jour la quantité de l'élément (updatedItem) dans le tableau cart.
        localStorage.setItem('kanapCart', JSON.stringify(cart))                                             // On enregistre les données du panier mises à jour dans le localStorage en utilisant la méthode setItem() de l'interface Storage. On transforme l'objet cart en chaîne JSON avec la méthode JSON.stringify() et on le stocke sous la clé 'kanapCart'.
    }
}

function makeDescription(item) {                                                                            // On crée une fonction makeDescription() qui va nous permettre de créer la section description pour un produit du panier. On lui passe en paramètre l'élément (item) à afficher.
    const description = document.createElement("div")
    description.classList.add("cart__item__content__description")

    fetch(`http://localhost:3000/api/products/${item.id}`)                                                  // On utilise la méthode fetch() pour faire une requête HTTP GET à l'API pour récupérer les données du produit avec l'id spécifié dans l'élément (item) à afficher.
        .then((response) => response.json())
        .then((product) => {                                                                                // Quand on reçoit la réponse de l'API, on la transforme en JSON et on l'utilise pour créer les éléments HTML.
            const h2 = document.createElement("h2")
            h2.textContent = product.name
            const p = document.createElement("p")
            p.textContent = item.color
            const p2 = document.createElement("p")
            p2.textContent = (product.price * item.quantity).toFixed(2) + " €"                              // On récupère ici le prix du produit depuis l'API et on le multiplie par la quantité pour obtenir le prix total.

            description.appendChild(h2)
            description.appendChild(p)
            description.appendChild(p2)                                                                      // On crée les éléments HTML pour afficher le nom, la couleur et le prix total (prix * quantité) du produit. On utilise toFixed(2) pour afficher le prix avec 2 décimales.
        })
        .catch((error) => {
            console.error('Erreur:', error)
        })

    return description
}

function displayArticleOnPage(article) {                                                                     // On crée une fonction displayArticleOnPage() qui va nous permettre d'afficher un produit du panier sur la page. On lui passe en paramètre l'élément <article> à afficher.
    const cartItemsContainer = document.querySelector("#cart__items")                                        // On récupère le conteneur des articles du panier sur la page et on l'assigne à la variable cartItemsContainer.
    if (cartItemsContainer) {                                                                                // Si le conteneur des articles du panier existe sur la page...
        cartItemsContainer.appendChild(article)                                                              // On ajoute l'élément <article> en tant qu'enfant du conteneur des articles du panier ("#cart__items") sur la page.
    }
}

function makeArticle(item) {                                                                                 // On crée une fonction makeArticle() qui va nous permettre de créer l'élément <article> pour un produit du panier. On lui passe en paramètre l'élément (item) à afficher.
    const article = document.createElement("article")
    article.classList.add("cart__item")
    article.dataset.id = item.id                                                                             // On utilise dataset pour ajouter des attributs data-id et data-color à l'élément <article> pour pouvoir les utiliser plus tard (par exemple pour la suppression ou la modification de la quantité).
    article.dataset.color = item.color                                                                       // On utilise dataset pour ajouter des attributs data-id et data-color à l'élément <article> pour pouvoir les utiliser plus tard (par exemple pour la suppression ou la modification de la quantité).
    return article
}

function makeImageDiv(item) {                                                                                // On crée une fonction makeImageDiv() qui va nous permettre de créer la section image pour un produit du panier. On lui passe en paramètre l'élément (item) à afficher.
    const div = document.createElement("div")
    div.classList.add("cart__item__img")

    fetch(`http://localhost:3000/api/products/${item.id}`)                                                   // On utilise la méthode fetch() pour faire une requête HTTP GET à l'API pour récupérer les données du produit avec l'id spécifié dans l'élément (item) à afficher.
        .then((response) => response.json())
        .then((product) => {                                                                                 // Quand on reçoit la réponse de l'API, on la transforme en JSON et on crée l'élément <img> pour afficher l'image du produit.
            const image = document.createElement("img")
            image.src = product.imageUrl
            image.alt = product.altTxt
            div.appendChild(image)                                                                           // On utilise la méthode fetch() pour faire une requête HTTP GET à l'API pour récupérer les données du produit avec l'id spécifié dans l'élément (item) à afficher. Quand on reçoit la réponse de l'API, on la transforme en JSON et on crée l'élément <img> pour afficher l'image du produit. On utilise les propriétés imageUrl et altTxt du produit pour définir les attributs src et alt de l'élément <img>. Enfin, on ajoute l'élément <img> à la div créée précédemment.
        })
        .catch((error) => {
            console.error('Erreur:', error)
        })

    return div
}

function updateCartTotals() {                                                                                // On crée une fonction updateCartTotals() qui va nous permettre de mettre à jour le total des quantités et des prix du panier.
    calculateTotalQuantity()
    calculateTotalPrice()
}

function calculateTotalQuantity() {
    const totalQuantity = document.querySelector("#totalQuantity")                                           // On récupère l'élément qui affiche le total des quantités sur la page et on l'assigne à la variable totalQuantity.
    const total = cart.reduce((total, item) => total + item.quantity, 0)
    if (totalQuantity) {
        totalQuantity.textContent = total
    }
}

function calculateTotalPrice() {                                                                            // On crée une fonction calculateTotalPrice() qui va nous permettre de calculer le total des prix du panier.
    const totalPrice = document.querySelector("#totalPrice")
    
    let total = 0
    let itemsProcessed = 0
    
    if (cart.length === 0) {
        if (totalPrice) {
            totalPrice.textContent = "0.00"
        }
        return
    }
    
    cart.forEach((item) => {                                                                               // Pour chaque élément (item) dans le tableau cart...
        fetch(`http://localhost:3000/api/products/${item.id}`)                                             // ...on utilise la méthode fetch() pour faire une requête HTTP GET à l'API pour récupérer les données du produit avec l'id spécifié dans l'élément (item) à afficher.
            .then((response) => response.json())
            .then((product) => {                                                                           // Quand on reçoit la réponse de l'API, on la transforme en JSON et on utilise les données du produit pour calculer le total des prix du panier. Ainsi, on utilise la propriété price du produit et la quantité de l'élément (item) pour calculer le prix total de cet élément (item) et on l'ajoute au total général.
                total += product.price * item.quantity                                                     // On ajoute le prix total de l'élément (item) c'est-à-dire (prix * quantité) au total général.
                itemsProcessed++                                                                           // On incrémente le nombre d'éléments (items) traités. Cela nous permet de savoir quand tous les éléments (items) ont été traités.
                if (itemsProcessed === cart.length && totalPrice) {                                        // Si tous les éléments (items) ont été traités (si le nombre d'éléments (items) traités est égal à la longueur du tableau cart) et que l'élément qui affiche le total des prix existe sur la page... 
                    totalPrice.textContent = total.toFixed(2)                                              // ...on met à jour le total des prix sur la page en utilisant toFixed(2) pour afficher le prix avec 2 décimales.
                }
            })
            .catch((error) => {                                                                            // Si une erreur se produit lors de la requête fetch()...
                console.error('Erreur:', error)                                                            // ...on affiche l'erreur dans la console.
                itemsProcessed++                                                                           // On incrémente le nombre d'éléments (items) traités. Cela nous permet de savoir quand tous les éléments (items) ont été traités même si une erreur s'est produite.
                if (itemsProcessed === cart.length && totalPrice) {                                        // Si tous les éléments (items) ont été traités (si le nombre d'éléments (items) traités est égal à la longueur du tableau cart) et que l'élément qui affiche le total des prix existe sur la page...
                    totalPrice.textContent = total.toFixed(2)                                              // ...on met à jour le total des prix sur la page en utilisant toFixed(2) pour afficher le prix avec 2 décimales.
                }
            })
    })
}

function submitForm(e) {                                                                                   // On crée une fonction submitForm() qui va nous permettre de gérer la soumission du formulaire de commande. On lui passe en paramètre l'événement (e) déclenché par le clic sur le bouton de commande.
    e.preventDefault()
    if (cart.length === 0) {
        alert("Veuillez sélectionner des articles à acheter")
        return
    }
    
    if (isFormInvalid()) return
    if (isEmailInvalid()) return

    const body = prepareOrderData()
    
    fetch("http://localhost:3000/api/products/order", {                                                    // On utilise la méthode fetch() pour faire une requête HTTP POST à l'API pour envoyer les données de la commande.
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then((res) => res.json())                                                                             // Quand on reçoit la réponse de l'API, on la transforme en JSON.
    .then((data) => {
        const orderId = data.orderId
        localStorage.removeItem('kanapCart')
        window.location.href = "confirmation.html?orderId=" + orderId                                      // On redirige l'utilisateur vers la page de confirmation de commande en passant l'orderId en paramètre d'URL.
    })
    .catch((err) => {                                                                                      // Gestion des erreurs
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

function isFormInvalid() {                                                                                 // On crée une fonction isFormInvalid() qui va nous permettre de vérifier si le formulaire est valide ou non.
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

function prepareOrderData() {                                                                             // On crée une fonction prepareOrderData() qui va nous permettre de préparer les données de la commande à envoyer à l'API.
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

function getUniqueProductIds() {                                                                           // On crée une fonction getUniqueProductIds() qui va nous permettre de récupérer les ids uniques des produits du panier.
    const uniqueIds = []
    cart.forEach(item => {                                                                                 // Pour chaque élément (item) dans le tableau cart...
        if (!uniqueIds.includes(item.id)) {                                                                // Si l'id de l'élément (item) n'est pas déjà dans le tableau uniqueIds...
            uniqueIds.push(item.id)                                                                        // ...on l'ajoute au tableau uniqueIds.
        }
    })
    return uniqueIds
}