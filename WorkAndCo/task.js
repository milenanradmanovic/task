// variables

const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart'); //kod mene update-btn
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
// kod njega : const cartItems = document.querySelector('.cart-items');
const cartBtnTitle = document.querySelector('.cart-btn-title');

const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');

// cart content puts here
let cart = [];

let addbtnsDOM = [];

//getting the products class
class Products {
   async getProducts(){
       try {
           let result = await fetch("products.json");
           let data = await result.json();
           let products = data;
           products = products.map(item => {
               const {id,productTitle,inventory} = item;
               const {value,currency} = item.price;
               return {id,productTitle,inventory,value,currency}
           }) 
           return products;
       } catch (error) {
           console.log(error);
       }
   }
}
// display products class
class UI{
    displayProducts(products) {
        let result = '';
        products.forEach(product =>{
            result += `
            <article class="product">
            <div class="img-div">
                <img class="product-img" src="images/chronograph.jpeg" alt="product image" />
            </div>
            <div class="product-about">
                <div class="name-price">
                    <h3 class="title">${product.productTitle}</h3>
                    <h5><span class="price">${product.value}</span></h5>
                </div>
        <div class="inventory">${product.inventory}<span>remaining</span></div>
                <div class="add">
                    <button class="add-btn" data-id=${product.id}>
                          add to cart
                    </button>
                </div>
            </div>
        </article>
        `;
        });
        productsDOM.innerHTML = result;
    }
    getAddButtons(){
        const addbtns = [...document.querySelectorAll('.add-btn')];
        // [...   ] => spred operator to save them as array, to help us find exact button with id later for cart
        addbtnsDOM = addbtns;
        addbtns.forEach(addbtn => {
            let id = addbtn.dataset.id;
            let inCart = cart.find(item => item.id === id); //proveravamo da li je u korpi item sa kojim id of addBtns
            if(inCart){
                addbtn.innerText = "In Cart";
                addbtn.disabled = true;
            }
            else{
                addbtn.addEventListener("click", event =>{
                    event.target.innerText ="In Cart";
                    event.target.disabled = true;

                    //get product from products based on id #2
                    // functionality
                    let cartItem = { ...Storage.getProduct(id),
                        amount: 1 };
                    //add product to the cart
                    cart = [...cart, cartItem];
                    //save cart in local storage to have it when we reload
                     Storage.saveCart(cart);
                    //set cart values
                    this.setCartValues(cart);
                    //display cart item
                    this.addCartItem(cartItem);                   
                    //show the cart
                    this.showCart();
                });
                  
            }
        });
    }
    setCartValues(cart){
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map(item => {
            tempTotal += item.value * item.amount;
            itemsTotal += item.amount;
        });
        cartTotal.innerText= parseFloat(tempTotal.toFixed(2));
        if(itemsTotal > 0){
         cartBtnTitle.innerText = itemsTotal;
        } else{
            cartBtnTitle.innerText = "Your cart is empty";
        }
    }
    addCartItem(item){
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
            <img class="cart-item-img" src="images/chronograph.jpeg" alt="product in cart">
            <div class="cart-item-src">
                <h4>${item.productTitle}</h4>
                <h5>$${item.value}</h5>  
                <span class="remove-item" data-id=${item.id}>remove</span>
            </div>
            <div class="arrows">
                    <i class="fas fa-minus" data-id=${item.id}></i>
                    <p class="item-amount">${item.amount}</p>
                    <i class="fas fa-plus" data-id=${item.id}></i>                      
            </div>`;
            const div2 = document.createElement('div');
            div2.classList.add('subtotal');
            div2.innerHTML = `
            <h4>subtotal</h4>
            <h5>$16.00</h5>
            `;
            const div3 = document.createElement('div');
            div3.classList.add('taxes');
            div3.innerHTML = `
            <h4>Taxes</h4>
            <h5>$4.00</h5>
            `;
            const div4 = document.createElement('div');
            div4.classList.add('cart-footer');
            div4.innerHTML = `
            <h3>Total: $<span class="cart-total">0</span></h3>
            <button class="update-btn">update</button>
            `;
               
    }
      showCart () {
       cartOverlay.classList.add('transparentBcg');
       cartDOM.classList.add('showCart');
    }

}
// local storage
class Storage {
    //create static method witch you can use without instance
    static saveProducts(products){
        localStorage.setItem("products",JSON.stringify(products));
    }
    //get product from products based on id #1
    static getProduct(id){ //return the array from local storage 
        let products = JSON.parse(localStorage.getItem("products"));

        return products.find(product => product.id === id); //returning the spacific product
    }
    static saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }
}

// dom contetnt loaded meens after everything is loaded kick everything in
document.addEventListener("DOMContentLoaded", ()=>{
    //instances of dinamics classes
    const ui = new UI();
    const products = new Products();

    //runnujemo nasu metodu na products instanci
    // get all products from .json
    //
//       products.getProducts().then(products => console.log(products)); 
    //ovo gore je u comentu jer ovo ispod ima vise smisla,nije cisto consol log
    //onda hocu da 
    //consol log bilo koju data koju povucemo getProduct metodom
    products.getProducts().then(products => {
    ui.displayProducts(products)
    
    Storage.saveProducts(products);
   } ).then (()=>{
       ui.getAddButtons()
   });
});