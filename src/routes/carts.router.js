const express = require("express");
const router = express.Router();
const cartManager = require("../controllers/cartManager");

// Create instance of cart
const dataCart = new cartManager();

//Routes:
router.get("/", async (req, res) => {
  try {
    const data = await dataCart.readFile();
    res.json(data);
  } catch (error) {
    console.log("Couldn't get cart data", error);
    res.status(404).send({ status: "error", message: "Error loading cart" });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const idCart = req.params.cid;
    const dataById = await dataCart.getCartById(parseInt(idCart));

    if (dataById) {
      res.json(dataById.products);
    } else {
      res.status(404).send({ status: "error", message: "Id not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newCart = await dataCart.createCart();
    await dataCart.saveFile();
    res.status(200).json(newCart);
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const idCart = req.params.cid;
    const idProduct = req.params.pid;
    const quantity = req.body.quantity || 1;

    const upDateCart = await dataCart.addProductToCart(
      parseInt(idProduct),
      parseInt(idCart),
      quantity
    );
    await dataCart.saveFile();

    res.status(200).json(upDateCart);
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

router.delete("/:cid/:pid", async (req, res) => {
  try {
    const idCart = req.params.cid;
    const idProduct = req.params.pid;

    const deleteProducts = await dataCart.deleteProductCart(
      parseInt(idCart),
      parseInt(idProduct)
    );

    res.status(200).json(deleteProducts);
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

module.exports = router;
