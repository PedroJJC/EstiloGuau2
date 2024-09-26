const express = require('express');
const Openpay = require('openpay'); // Asegúrate de usar "Openpay" con mayúscula
const router = express.Router();

// Configura OpenPay
const openpayId = process.env.OPENPAY_ID;
const privateKey = process.env.OPENPAY_PRIVATE_KEY;

const openpayInstance = new Openpay(openpayId, privateKey, false); // El tercer argumento es para producción

// Ruta para crear el cargo
router.post('/createCharge', async (req, res) => {
    const { amount, description, token_id } = req.body;

    const chargeData = {
        method: 'card',
        source_id: token_id,
        amount: amount,
        description: description,
        order_id: 'order-123', // Agrega un ID de orden único
    };

    try {
        const charge = await openpayInstance.charges.create(chargeData);
        res.json(charge);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
