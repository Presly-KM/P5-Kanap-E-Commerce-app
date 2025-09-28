//@ts-nocheck
const queryString = window.location.search                                                          // On récupère les paramètres de l'URL (tout ce qui se trouve après le point d'interrogation ?)
const urlParams = new URLSearchParams(queryString)
const id = urlParams.get("id")                                                                      // On récupère la valeur du paramètre "id" (l'id du produit) grâce à la méthode get() de l'interface URLSearchParams. On stocke cette valeur dans la variable id.

if (!id) {                                                                                          // Si l'id n'existe pas (si on a pas d'id dans l'url)...
    window.location.href = 'index.html'                                                             // ...on redirige l'utilisateur vers la page d'accueil (index.html)
}

fetch(`http://localhost:3000/api/products/${id}`)                                                   // On utilise la méthode fetch() pour faire une requête HTTP GET à l'API pour récupérer les données du produit avec l'id spécifié dans l'URL et qui a été récupéré plus haut (l.2-4).
    .then((response) => response.json())
    .then((res) => handleData(res))                                                                 // Quand on reçoit la réponse de l'API, on la transforme en JSON et on l'envoie à la fonction handleData() pour traiter les données du produit.
    .catch((error) => {
        console.error('Erreur:', error)
        window.location.href = 'index.html'
    })

function handleData(couch) {                                                                        // On crée une fonction handleData() qui va nous permettre de traiter les données du produit. On lui passe en paramètre les données du produit (couch).
    const { altTxt, colors, description, imageUrl, name, price } = couch                            // On utilise la destructuration pour récupérer les données du produit. On crée une variable pour chaque donnée que l'on va utiliser.
    makeImage(imageUrl, altTxt)                                                                                 
    makeTitle(name)
    makePrice(price)
    makeCartContent(description)
    makeColors(colors)                                                                              // On appelle la fonction makeImages() pour créer l'image du produit. On lui passe en paramètre l'url de l'image et le texte alternatif de l'image. Puis on appelle les autres fonctions pour créer le titre, le prix, la description et les couleurs du produit.
}

function makeImage(imageUrl, altTxt) {                                                              // On crée une fonction makeImage() qui va nous permettre de créer l'image du produit. On lui passe en paramètre l'url de l'image et le texte alternatif de l'image.
    const image = document.createElement("img")
    image.src = imageUrl
    image.alt = altTxt
    const parent = document.querySelector(".item__img")
    if (parent != null) parent.appendChild(image)
}

function makeTitle(name) {                                                                          // On crée une fonction makeTitle() qui va nous permettre de créer le titre du produit. On lui passe en paramètre le nom du produit.
    const h1 = document.querySelector("#title")
    if (h1 != null) h1.textContent = name
}

function makePrice(price) {                                                                         // On crée une fonction makePrice() qui va nous permettre de créer le prix du produit. On lui passe en paramètre le prix du produit.
    const span = document.querySelector("#price")
    if (span != null) span.textContent = price
}

function makeCartContent(description) {                                                             // On crée une fonction makeCartContent() qui va nous permettre de créer la description du produit. On lui passe en paramètre la description du produit.
    const p = document.querySelector("#description")
    if (p != null) p.textContent = description
}

function makeColors(colors) {                                                                       // On crée une fonction makeColors() qui va nous permettre de créer les options de couleur pour le produit. On lui passe en paramètre les couleurs du produit.
    const select = document.querySelector("#colors")
    if (select != null) { 
        colors.forEach((color) => {
            const option = document.createElement("option")
            option.value = color
            option.textContent = color
            select.appendChild(option)
        })
    }
}

const button = document.querySelector("#addToCart")                                                 // On récupère le bouton "Ajouter au panier" et on l'assigne à la variable button.
button.addEventListener("click", handleClick)                                                       // On ajoute un écouteur d'événement au bouton "Ajouter au panier" qui va appeler la fonction handleClick() quand l'utilisateur clique sur le bouton.

function handleClick() {                                                                            // On crée une fonction handleClick() qui va nous permettre de gérer le clic sur le bouton "Ajouter au panier".
    const color = document.querySelector("#colors").value
    const quantity = document.querySelector("#quantity").value

    if (isOrderInvalid(color, quantity)) return                                                     // Si la commande est invalide (si l'utilisateur n'a pas sélectionné de couleur ou de quantité) on arrête l'exécution de la fonction.
    
    addToCart(id, color, quantity)
    alert("L'article a été ajouté à votre panier ! 👍")
    redirectToCart()
}

function addToCart(productId, color, quantity) {                                                    // On crée une fonction addToCart() qui va nous permettre d'ajouter le produit au panier. On lui passe en paramètre l'id du produit, la couleur et la quantité.
    const cartData = localStorage.getItem('kanapCart')                                              // On récupère les données du panier dans le localStorage. On utilise la méthode getItem() de l'interface Storage pour récupérer les données du panier qui sont stockées sous la clé 'kanapCart'. On assigne ces données à la variable cartData.
    let cart = cartData ? JSON.parse(cartData) : []                                                 // Si les données du panier existent, on les transforme en objet JavaScript avec la méthode JSON.parse() et on les assigne à la variable cart. Sinon, on initialise cart comme un tableau vide.
    
    const existingItemIndex = cart.findIndex(item =>                                                // On avait récupéré les données du panier dans le localStorage (l.76) dans le but de vérifier si le produit qu'on veut ajouter au panier existe déjà dans le panier (même id et même couleur). Pour cela on utilise la méthode findIndex() de l'interface Array qui va nous permettre de trouver l'index de l'élément dans le tableau cart qui correspond au produit qu'on veut ajouter au panier.
        item.id === productId && item.color === color
    )
    
    if (existingItemIndex > -1) {                                                                   // Si le produit existe déjà dans le panier (si l'index est supérieur à -1)...
        cart[existingItemIndex].quantity += Number(quantity)                                        // ...on met à jour la quantité en ajoutant la nouvelle quantité à l'ancienne.
        alert(`L'article est déjà dans le panier. La quantité a été augmentée : ${cart[existingItemIndex].quantity}`)
    } else {
        cart.push({                                                                                 // Sinon, on ajoute le nouveau produit au panier en utilisant la méthode push() pour ajouter un nouvel objet au tableau cart.
            id: productId,
            color: color,
            quantity: Number(quantity)
        })
    }
    
    localStorage.setItem('kanapCart', JSON.stringify(cart))                                         // On enregistre les données du panier mises à jour dans le localStorage en utilisant la méthode setItem() de l'interface Storage. On transforme l'objet cart en chaîne JSON avec la méthode JSON.stringify() et on le stocke sous la clé 'kanapCart'.
}

function isOrderInvalid(color, quantity) {                                                          // On crée une fonction isOrderInvalid() qui va nous permettre de vérifier si la commande est valide. On lui passe en paramètre la couleur et la quantité.
    if (color == null || color === "" || quantity == null || quantity == 0) {
        alert("Veuillez sélectionner une couleur et une quantité ! ⛔⚠")
        return true
    }
    return false
}

function redirectToCart() {                                                                         // On crée une fonction redirectToCart() qui va nous permettre de rediriger l'utilisateur vers la page du panier.
    window.location.href = "cart.html"
}

