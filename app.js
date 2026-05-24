//extract the form the inputs and bottom from de html

const nameProduct = document.getElementById("name-product");
const priceProduct = document.getElementById("price-product");
const btnAdd = document.getElementById("btn-add");
const formProduct = document.getElementById("form-product");
const list = document.getElementById("list");

async function getProducts() {
  const response = await fetch("http://localhost:3000/products");
  const data = await response.json();
  return data;
}

async function addProduct(prodcut) {
  const response = await fetch("http://localhost:3000/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(prodcut),
  });
}

async function editProduct(prodcut) {
  const response = await fetch(`http://localhost:3000/products/${product.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      price: prodcut.price,
    },
  });
}

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
    createElement(nameProductValue, priceProductValue);
    formProduct.reset();
  }
});

async function createElement(name, price) {
  const newProduct = {
    name: name,
    price: price,
  };
  await addProduct(newProduct);
  const products = await getProducts();
  localStorage.setItem("products", JSON.stringify(products));
  renderProduct();
}

async function renderProduct() {
  list.innerHTML = "";
  const products = await getProducts();
  products.forEach((product, index) => {
    list.innerHTML += `<li>${product.name}, price:${product.price} <button class="delete border p-1 bg-cyan-300">delete </button></li>`;
  });

  const btnDelete = document.querySelectorAll(".delete");
  btnDelete.forEach((btn, index) => {
    btn.addEventListener("click", async () => {
      localStorage.setItem("products", JSON.stringify(products));
      const id = products[index].id;
      await deleteProduct(id);
      const updateProducts = await getProducts();
      localStorage.setItem("products", JSON.stringify(updateProducts));
      renderProduct();
    });
  });
}

renderProduct();
