//extract the form the inputs and bottom from de html

const nameProduct = document.getElementById("name-product");
const priceProduct = document.getElementById("price-product");
const btnAdd = document.getElementById("btn-add");
const formProduct = document.getElementById("form-product");
const list = document.getElementById("list");

//methods from json server api

// here i get the user form db.json

async function getProducts() {
  const response = await fetch("http://localhost:3000/products");
  const data = await response.json();
  return data;
}

// create a new product and add to db.json

async function addProduct(prodcut) {
  const response = await fetch("http://localhost:3000/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(prodcut),
  });
}

// delete a prodcut in db.json

async function deleteProduct(id) {
  const response = await fetch(`http://localhost:3000/products/${id}`, {
    method: "DELETE",
  });
}

//avoid the behavior of the forms when submit it

formProduct.addEventListener("submit", (e) => {
  e.preventDefault();

  //get the user input

  let nameProductValue = nameProduct.value;
  let priceProductValue = priceProduct.value;

  //validate its not a number o zero

  if (Number(nameProductValue) || Number(nameProductValue) === 0) {
    nameProductValue = "";
    formProduct.reset();
    alert("you have to enter text");
  } else {
    console.log("well done!");
    createElement(nameProductValue, priceProductValue); //call the function for create a new product
    formProduct.reset();
  }
});

//create the fucntion for create news products

async function createElement(name, price) {
  const newProduct = {
    name: name,
    price: price,
  };
  await addProduct(newProduct); //call the async function that add new product in db.json
  const products = await getProducts(); //red the list i have right now 
  localStorage.setItem("products", JSON.stringify(products)); //save in local storage 
  renderProduct(); //render the list of products
}

// create renderProduct for render the list of products

async function renderProduct() {
  //empty the list for not duplicate the products
  list.innerHTML = "";
  const products = await getProducts(); //read the products
  products.forEach((product, index) => { //modify the innerhtml of list for show the products
    list.innerHTML += `<li>${product.name}, price:${product.price} <button class="delete border p-1 bg-cyan-300">delete </button></li>`;
  });

  const btnDelete = document.querySelectorAll(".delete"); //get the button that delete
  btnDelete.forEach((btn, index) => {
    btn.addEventListener("click", async () => {
      const id = products[index].id; //save the id of the product i want to remove
      await deleteProduct(id);//delete in db.json
      const updateProducts = await getProducts(); //update the list of the products
      localStorage.setItem("products", JSON.stringify(updateProducts)); //update the localstorage
      renderProduct(); //render the list of products
    });
  });
}

renderProduct(); //render the list of products automatically
