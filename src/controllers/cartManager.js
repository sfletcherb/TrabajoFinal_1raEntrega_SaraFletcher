const fs = require("fs").promises;
const { productManagerInstance } = require("../controllers/productManager");

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

  async createCart() {
    const cart = {
      id: ++this.lastId,
      products: [],
    };

    this.products.push(cart);
    await this.saveFile();
    return cart;
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

      if (!findId) {
        throw new Error("could not find cart with id " + id);
      }
      return findId;
    } catch (error) {
      console.log("Does not exits id in cart", error);
    }
  }

  async addProductToCart(idProduct, idCart, quantity) {
    try {
      const indexCart = this.products.findIndex((cart) => cart.id === idCart);
      const indexProduct = productManagerInstance.products.findIndex(
        (product) => product.id === idProduct
      );

      if (indexCart !== -1 && indexProduct !== -1) {
        const findProductId = this.products[indexCart].products.findIndex(
          (cartProduct) => cartProduct.id === idProduct
        );

        if (findProductId !== -1) {
          this.products[indexCart].products[findProductId].quantity += quantity;
        } else {
          this.products[indexCart].products.push({
            id: idProduct,
            quantity,
          });
          console.log("product added to cart");
        }

        return this.products[indexCart].products;
      } else {
        console.log(`Id ${idProduct} not found for product`);
      }
    } catch (error) {
      console.log({ status: "error", message: error.message });
    }
  }

  async deleteProductCart(idCart, idProduct) {
    try {
      const dataCart = await this.readFile();

      const indexCart = dataCart.findIndex((cart) => cart.id === idCart);
      const indexProduct = dataCart[indexCart].products.findIndex(
        (product) => product.id === idProduct
      );

      if (indexCart !== -1 && indexProduct !== -1) {
        dataCart[indexCart].products.splice(indexProduct, 1);
        await fs.writeFile(this.path, JSON.stringify(dataCart, null, 2));
        console.log("product delected successfully from cart");
        return dataCart[indexCart].products;
      } else {
        console.log("couldn't delete producto from cart");
      }
    } catch (error) {
      console.log("error deleting", error.message);
    }
  }
}
module.exports = CartManager;
