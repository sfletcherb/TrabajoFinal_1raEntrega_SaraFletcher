const fs = require("fs").promises;

class ProductManager {
  constructor() {
    this.path = "./src/models/listProducts.json";
    this.products = [];
    this.lastId = 0;
    this.initialize();
  }

  // Método para crear el archivo.
  async readFile() {
    try {
      const fileContent = await fs.readFile(this.path, "utf8");
      return JSON.parse(fileContent);
    } catch (error) {
      if (error.code === "ENOENT") {
        await this.saveFile();
      }
      console.log("Error reading file:", error);
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

  // Metodo para Agregar un producto al arreglo products
  async addProduct(dataProducts) {
    try {
      const {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        ...extraProperties
      } = dataProducts;
      const fields = [title, description, price, thumbnail, code, stock];
      const notEmptyFields = fields.every((fieldEmpty) => fieldEmpty);
      if (!notEmptyFields) {
        throw new Error("All fields are required");
      }

      const codeExist = this.products.some((items) => items.code === code);
      if (codeExist) {
        throw new Error("The code already exists");
      }

      const newProduct = {
        id: ++this.lastId,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        ...extraProperties,
      };

      this.products.push(newProduct);
    } catch (error) {
      console.log("Couldn't add product:", error);
    }
  }

  // Método obtener productos según id
  async getProductById(id) {
    try {
      const content = await this.readFile();
      const findId = content.find((item) => item.id === id);
      return findId;
    } catch (error) {
      console.log("Couldn't find product");
    }
  }

  async updateProduct(id, products) {
    try {
      const index = this.products.findIndex((item) => item.id === id);

      if (index !== -1) {
        this.products[index] = { ...this.products[index], ...products };
      } else {
        console.log("id not found");
      }
    } catch (error) {
      console.log("Couldn't update product", error);
    }
  }

  async deleteProduct(id) {
    try {
      const content = await fs.readFile(this.path, "utf-8");
      const products = JSON.parse(content);

      const index = products.findIndex((item) => item.id === id);

      if (index !== -1) {
        products.splice(index, 1);

        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
      } else {
        console.log("Couldn't delete product");
      }
    } catch (error) {
      console.log("Couldn't delete product", error);
    }
  }

  async saveFile() {
    try {
      await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
      console.log("Saved product");
    } catch (error) {
      console.log("Couldn't save", error);
    }
  }
}

const productData = [
  {
    title: "producto1",
    description: "Prueba1",
    price: 100,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 10,
  },
  {
    title: "producto2",
    description: "Prueba2",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc456",
    stock: 20,
  },
  {
    title: "producto3",
    description: "Prueba3",
    price: 300,
    thumbnail: "Sin imagen",
    code: "abc789",
    stock: 30,
  },
  {
    title: "producto4",
    description: "Prueba4",
    price: 400,
    thumbnail: "Sin imagen",
    code: "abc159",
    stock: 40,
  },
  {
    title: "producto5",
    description: "Prueba5",
    price: 500,
    thumbnail: "Sin imagen",
    code: "abc753",
    stock: 50,
  },
  {
    title: "producto6",
    description: "Prueba6",
    price: 600,
    thumbnail: "Sin imagen",
    code: "abc452",
    stock: 60,
  },
  {
    title: "producto7",
    description: "Prueba7",
    price: 700,
    thumbnail: "Sin imagen",
    code: "abc984",
    stock: 70,
  },
  {
    title: "producto8",
    description: "Prueba8",
    price: 800,
    thumbnail: "Sin imagen",
    code: "abc349",
    stock: 80,
  },
  {
    title: "producto9",
    description: "Prueba9",
    price: 900,
    thumbnail: "Sin imagen",
    code: "abc624",
    stock: 90,
  },
  {
    title: "producto10",
    description: "Prueba10",
    price: 1000,
    thumbnail: "Sin imagen",
    code: "abc963",
    stock: 100,
  },
];

module.exports = { ProductManager, productData };
