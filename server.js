require("dotenv").config();

const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const produtos = {
  premium: {
    nome: "Publicação Premium",
    valor: 1000
  },

  gold: {
    nome: "Publicação Gold",
    valor: 2500
  },

  vip: {
    nome: "Publicação VIP",
    valor: 5000
  }
};

app.get("/produto/:id", (req, res) => {

  console.log("Produto solicitado:", req.params.id);

  const produto = produtos[req.params.id];

  if (!produto) {
    return res.status(404).json({
      erro: "Produto não encontrado"
    });
  }

  res.json(produto);

});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.post("/criar-pagamento", async (req, res) => {

  const produto = produtos[req.body.produtoId];

  if (!produto) {
    return res.status(404).json({
      erro: "Produto não encontrado"
    });
  }

  try {

 const paymentIntent =
await stripe.paymentIntents.create({

  amount: produto.valor * 100,
  currency: "brl",

  payment_method_types: ["card"]

});

    res.json({
      id: paymentIntent.id,
      client_secret: paymentIntent.client_secret
    });

  } catch (error) {

    res.status(500).json({
      erro: error.message
    });

  }

});

app.listen(3000, () => {
  console.log("Monatiza Checkout Online");
});