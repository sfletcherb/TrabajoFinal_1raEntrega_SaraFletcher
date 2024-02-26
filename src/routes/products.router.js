const express = require("express");
const router = express.Router();
const {
  productManagerInstance,
  productData,
} = require("../controllers/productManager.js");

// Create list of products:

productData.forEach((data) => {
  productManagerInstance.addProduct(data);
});

//Routes
router.get("/", async (req, res) => {
  try {
    const data = await productManagerInstance.readFile();
    let limit = req.query.limit;

    if (limit) {
      const limitData = data.slice(0, limit);
      res.json(limitData);
    } else {
      res.json(data);
    }
  } catch (error) {
    console.log("Couldn't get product list");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    let productId = req.params.pid;

    const findProduct = await productManagerInstance.getProductById(
      parseInt(productId)
    );

    if (findProduct) {
      res.json(findProduct);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    let newProduct = req.body;
    await productManagerInstance.addProduct(newProduct);
    await productManagerInstance.saveFile();
    res
      .status(200)
      .send({ status: "success", message: "Product added successfully" });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;
    const newChanges = req.body;

    const existProduct = await productManagerInstance.getProductById(
      parseInt(productId)
    );
    if (!existProduct) {
      return res
        .status(404)
        .send({ status: "error", message: "Product not found" });
    }

    if (newChanges.id && newChanges.id !== existProduct.id) {
      return res
        .status(400)
        .send({ status: "error", message: "Product ID cannot be changed" });
    }
    await productManagerInstance.updateProduct(parseInt(productId), newChanges);
    await productManagerInstance.saveFile();

    res
      .status(200)
      .send({ status: "success", message: "Product updated successfully" });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;
    await productManagerInstance.deleteProduct(parseInt(productId));

    res
      .status(200)
      .send({ status: "success", message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

module.exports = router;
