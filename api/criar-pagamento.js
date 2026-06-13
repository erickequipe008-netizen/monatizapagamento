
const Stripe = require("stripe");

module.exports = async (req, res) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({
        error: "STRIPE_SECRET_KEY não configurada"
      });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    if (req.method !== "POST") {
      return res.status(405).json({
        error: "Método não permitido"
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "brl",

            product_data: {
              name: "Plano Monatiza"
            },

            unit_amount: 1990
          },

          quantity: 1
        }
      ],

      success_url:
        "https://google.com",

      cancel_url:
        "https://google.com"
    });

    return res.status(200).json({
      url: session.url
    });

  } catch (error) {

    return res.status(500).json({
      error: error.message
    });
  }
};
