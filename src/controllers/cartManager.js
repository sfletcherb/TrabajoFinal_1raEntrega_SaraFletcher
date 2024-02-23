const fs = require("fs").promises;
const { ProductManager } = require("../controllers/productManager");
const productList = new ProductManager();

class CartManager {
  constructor() {
    this.products = [];
    this.path = "./src/models/cartProducts.json";
    this.lastId = 0;
    this.initialize();
  }

  async readFile() {
    try {
      const fileContent = await fs.readFile(this.path, "utf8");
      return JSON.parse(fileContent);
    } catch (error) {
      if (error.code === "ENOENT") {
        await this.saveFile();
        return [];
      }
      console.log("Couldn't create field:", error);
      return [];
    }
  }

  async initialize() {
    try {
      const fileContent = await this.readFile();
      if (fileContent.length > 0) {
        this.lastId = fileContent.reduce(
          (maxId, product) => Math.max(maxId, product.id),
          0
        );
        this.products = fileContent;
      }
    } catch (error) {
      console.log("Error initializing ProductManager:", error);
    }
  }

  async createCart(newCart) {
    const cart = {
      id: ++this.lastId,
      products: newCart,
    };

    this.products.push(cart);
    console.log(this.products);
  }

  async saveFile() {
    try {
      await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
      console.log("Saved product in cart");
    } catch (error) {
      console.log("Couldn't save product in cart", error);
    }
  }

  async getCartById(id) {
    try {
      const content = await this.readFile();
      const findId = content.find((item) => item.id === id);
      return findId;
    } catch (error) {
      console.log("Does not exits id in cart", error);
    }
  }

  async addProductToCart(idProduct, idCart, product) {
    try {
      const indexCart = this.products.findIndex((cart) => cart.id === idCart);
      const indexProduct = productList.products.findIndex(
        (product) => product.id === idProduct
      );

      if (indexCart !== -1 && indexProduct !== -1) {
        const findProductId = this.products[indexCart].products.findIndex(
          (cartProduct) => cartProduct.id === idProduct
        );

        if (findProductId !== -1) {
          this.products[indexCart].products[findProductId].quantity++;
        } else {
          this.products[indexCart].products.push({
            id: idProduct,
            quantity: 1,
          });
          console.log("product added to cart");
        }
      } else {
        console.log(`cart: ${indexCart} or product: ${indexProduct} not found`);
      }
    } catch (error) {
      console.log({ status: "error", message: error.message });
    }
  }
}
module.exports = CartManager;
