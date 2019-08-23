const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const updateCartBtn = document.querySelector(".update-btn"); //kod mene update-btn
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
// kod njega : const cartItems = document.querySelector('.cart-items');
const cartBtnTitle = document.querySelector(".cart-btn-title");

const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");

// cart content puts here
let cart = [];

let addbtnsDOM = [];


class Products {
   async getProducts(){
       try {
           let result = await fetch("products.json");
           let data = await result.json();
           let products = data;
           products = products.map(item => {
               const {id,productTitle,inventory} = item;
               const {value,currency} = item.price;
               return {id,productTitle,inventory,value,currency};
           }) 
           return products;
       } catch (error) {
           console.log(error);
       }
   }
}
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
        const addbtns = [...document.querySelectorAll(".add-btn")];
        addbtnsDOM = addbtns;
        addbtns.forEach(addbtn => {
            let id = addbtn.dataset.id;
            let inCart = cart.find(item => item.id === id); 
            if(inCart){
                addbtn.innerText = "In Cart";
                addbtn.disabled = false;
            }
            addbtn.addEventListener("click", event =>{
                event.target.innerText ="In Cart";
                //event.target.disabled = true;
                    //get product from products based on id #2
                let cartItem = {...Storage.getProduct(id), amount:1}; 
                    //add product to the cart
                cart = [...cart, cartItem];
                Storage.saveCart(cart);
                    
                this.setCartValues(cart);
                    
                this.addCartItem(cartItem);                   
                    
                this.showCart();
            });
        });
    }
    setCartValues(cart){
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map(item => {
            tempTotal += item.value * item.amount;
            itemsTotal += item.amount;
        }) 
        cartTotal.innerText= parseFloat(tempTotal.toFixed(2));
        if(itemsTotal > 0){
         cartBtnTitle.innerText = itemsTotal;
        } else{
            cartBtnTitle.innerText = "Your cart is empty";
        }
        console.log(tempTotal, itemsTotal);
    }
   addCartItem (item) {
       const div = document.createElement('div');
       div.classList.add('.cart-item');
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
            cartContent.appendChild(div);
            console.log(cartContent);
    }
      showCart () {
       cartOverlay.classList.add('transparentBcg');
       cartDOM.classList.add('showCart');
    } 
    setupAPP(){
        cart = Storage.getCart();
        this.setCartValues(cart);
        this.populateCart(cart);
        cartBtn.addEventListener('click',this.showCart);
        closeCartBtn.addEventListener('click',this.hideCart)
    }
    hideCart(){
        cartOverlay.classList.remove('transparentBcg');
       cartDOM.classList.remove('showCart');
}
    populateCart(cart){
        cart.forEach(item => this.addCartItem(item));
    }
    cartLogic(){
        updateCartBtn.addEventListener('click', this.clearCart);
    }
    clearCart(){
        let cartItems = cart.map (item => item.id);
        cartItems.forEach(id => this.removeItem(id))
    }
}
// local storage
class Storage{
    static saveProducts(products){
        localStorage.setItem("products", JSON.stringify(products));
    }
   static getProduct(id){ 
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find(product => product.id === id);   
   }
    static saveCart(cart){
     localStorage.setItem("cart", JSON.stringify(cart));
    }
    static getCart(){
        return localStorage.getItem("cart")?JSON.parse(localStorage.getItem('cart')):[]
    }
}
document.addEventListener("DOMContentLoaded", ()=>{
    const ui = new UI();
    const products = new Products();
    //setupp 
    ui.setupAPP();

    products.getProducts().then(products => {
    ui.displayProducts(products);
    Storage.saveProducts(products);
   }).then(()=>{
       ui.getAddButtons();
       ui.cartLogic();
   });
});