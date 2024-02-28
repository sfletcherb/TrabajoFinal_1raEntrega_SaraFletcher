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
        console.log("File not found, creating a new one...");
        await this.saveFile();
        return [];
      }
      console.log("Error reading file method readFile:", error);
      return [];
    }
  }

  async initialize() {
    try {
      const fileContentInitialize = await this.readFile();
      if (fileContentInitialize.length > 0) {
        this.lastId = fileContentInitialize.reduce(
          (maxId, product) => Math.max(maxId, product.id),
          0
        );
        this.products = fileContentInitialize;
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
        status,
        category,
      } = dataProducts;
      const fields = [title, description, price, code, stock, status, category];
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
        thumbnail: thumbnail || [],
        code,
        stock,
        status,
        category,
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

  async updateProduct(id, changes) {
    try {
      const index = this.products.findIndex((item) => item.id === id);

      if (index !== -1) {
        this.products[index] = { ...this.products[index], ...changes, id };
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
    title: "ACETAMINOFEN",
    description: "Jarabe",
    price: 100,
    thumbnail: [
      "https://img.freepik.com/vector-gratis/ilustracion-aislada-capsula-medicamento_18591-84252.jpg?size=626&ext=jpg&ga=GA1.1.1954325009.1708959781&semt=sph",
    ],
    code: "abc123",
    stock: 10,
    status: true,
    category: "store",
  },
  {
    title: "BIFONAZOL",
    description: "Locion",
    price: 200,
    thumbnail: [
      "https://img.freepik.com/vector-gratis/ilustracion-aislada-capsula-medicamento_18591-84252.jpg?size=626&ext=jpg&ga=GA1.1.1954325009.1708959781&semt=sph",
    ],
    code: "abc456",
    stock: 20,
    status: true,
    category: "store",
  },
  {
    title: "IBUPROFENO",
    description: "Tableta",
    price: 300,
    thumbnail: [
      "https://img.freepik.com/vector-gratis/ilustracion-aislada-capsula-medicamento_18591-84252.jpg?size=626&ext=jpg&ga=GA1.1.1954325009.1708959781&semt=sph",
    ],
    code: "abc789",
    stock: 30,
    status: true,
    category: "store",
  },
  {
    title: "MINOXIDIL",
    description: "Gel",
    price: 400,
    thumbnail: [
      "https://img.freepik.com/vector-gratis/ilustracion-aislada-capsula-medicamento_18591-84252.jpg?size=626&ext=jpg&ga=GA1.1.1954325009.1708959781&semt=sph",
    ],
    code: "abc159",
    stock: 40,
    status: true,
    category: "store",
  },
  {
    title: "TIMEROSAL",
    description: "Solucion Topica",
    price: 500,
    thumbnail: [
      "https://img.freepik.com/vector-gratis/ilustracion-aislada-capsula-medicamento_18591-84252.jpg?size=626&ext=jpg&ga=GA1.1.1954325009.1708959781&semt=sph",
    ],
    code: "abc753",
    stock: 50,
    status: true,
    category: "store",
  },
  {
    title: "TOLNAFTATO",
    description: "Polvo Topico",
    price: 600,
    thumbnail: [
      "https://img.freepik.com/vector-gratis/ilustracion-aislada-capsula-medicamento_18591-84252.jpg?size=626&ext=jpg&ga=GA1.1.1954325009.1708959781&semt=sph",
    ],
    code: "abc452",
    stock: 60,
    status: true,
    category: "store",
  },
  {
    title: "POLOXAMER",
    description: "Solucion Oftalmica",
    price: 700,
    thumbnail: [
      "https://img.freepik.com/vector-gratis/ilustracion-aislada-capsula-medicamento_18591-84252.jpg?size=626&ext=jpg&ga=GA1.1.1954325009.1708959781&semt=sph",
    ],
    code: "abc984",
    stock: 70,
    status: true,
    category: "store",
  },
  {
    title: "PIROXICAM",
    description: "Gel Topico",
    price: 800,
    thumbnail: [
      "https://img.freepik.com/vector-gratis/ilustracion-aislada-capsula-medicamento_18591-84252.jpg?size=626&ext=jpg&ga=GA1.1.1954325009.1708959781&semt=sph",
    ],
    code: "abc349",
    stock: 80,
    status: true,
    category: "store",
  },
  {
    title: "NAFAZOLINA",
    description: "Solucion Oftalmica",
    price: 900,
    thumbnail: [
      "https://img.freepik.com/vector-gratis/ilustracion-aislada-capsula-medicamento_18591-84252.jpg?size=626&ext=jpg&ga=GA1.1.1954325009.1708959781&semt=sph",
    ],
    code: "abc624",
    stock: 90,
    status: true,
    category: "store",
  },
  {
    title: "NAPROXENO",
    description: "Tableta",
    price: 1000,
    thumbnail: [
      "https://img.freepik.com/vector-gratis/ilustracion-aislada-capsula-medicamento_18591-84252.jpg?size=626&ext=jpg&ga=GA1.1.1954325009.1708959781&semt=sph",
    ],
    code: "abc963",
    stock: 100,
    status: true,
    category: "store",
  },
];

const productManagerInstance = new ProductManager();

module.exports = { productManagerInstance, productData };
