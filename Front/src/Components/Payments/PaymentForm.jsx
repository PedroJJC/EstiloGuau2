import { useState } from "react";
import card1 from "../../img/Payments/cards1.png";
import cards2 from "../../img/Payments/cards2.png";
import imgcvv from "../../img/Payments/cvv.png";
import openpay from "../../img/Payments/openpay.png";
import security from "../../img/Payments/security.png";

const PaymentForm = () => {
  const [cardHolderName, setCardHolderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState(null);

  const handlePayment = (e) => {
    e.preventDefault();
    // Lógica para procesar el pago
    console.log("Procesando pago...");
  };

  return (
    <div className="w-full max-w-4xl p-6 bg-white shadow-md rounded-lg mx-auto">
      <form action="#" method="POST" id="payment-form" onSubmit={handlePayment}>
        {/* Información y tokens ocultos para Openpay */}
        <input type="hidden" name="token_id" id="token_id" />
        <input type="hidden" name="use_card_points" id="use_card_points" value="false" />
        {/* Logos de tarjetas de crédito y débito con línea divisoria */}
<div className="flex justify-between items-center mb-6">
  {/* Sección de tarjetas de crédito */}
  <div className="flex flex-col  w-1/2">
    <h2 className="text-xl font-semibold mb-2">Tarjeta de crédito</h2>
    <img src={card1} alt="Tarjetas de crédito" className=""/>
  </div>

  {/* Línea divisoria */}
  <div className="border-l border-gray-300 h-24 mx-4"></div>

  {/* Sección de tarjetas de débito */}
  <div className="flex flex-col  w-1/2">
    <h2 className="text-xl font-semibold mb-2">Tarjeta de débito</h2>
    <img src={cards2} alt="Tarjetas de débito" className=""/>
  </div>
</div>


        {/* Campo para el nombre del titular */}
        <div className="mb-4">
          <label className="block text-gray-700">Nombre del titular</label>
          <input type="text" className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            placeholder="Como aparece en la tarjeta" value={cardHolderName}
            onChange={(e) => setCardHolderName(e.target.value)} />
        </div>

        {/* Campo para el número de tarjeta */}
        <div className="mb-4">
          <label className="block text-gray-700">Número de tarjeta</label>
          <input type="text" className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            placeholder="Número de tarjeta" value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)} />
        </div>

        {/* Campos para la fecha de expiración */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700">Mes</label>
            <input type="text" className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              placeholder="MM" value={expiryMonth}
              onChange={(e) => setExpiryMonth(e.target.value)} />
          </div>
          <div>
            <label className="block text-gray-700">Año</label>
            <input type="text" className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              placeholder="AA" value={expiryYear}
              onChange={(e) => setExpiryYear(e.target.value)} />
          </div>
        </div>

        {/* Campo para el código CVV */}
        <div className="mb-6">
          <label className="block text-gray-700">Código de seguridad (CVV)</label>
          <div className="relative">
            <input type="text" className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              placeholder="3 dígitos" value={cvv} onChange={(e) => setCvv(e.target.value)} />
            <img src={imgcvv} alt="CVV" className="absolute right-3 top-3 h-6"/>
          </div>
        </div>

        {/* Información de seguridad y logo de Openpay */}
        <div className="text-sm text-gray-600 mb-4">
          <div className="flex items-center mb-1">
            <img src={openpay} alt="Openpay" className="h-6 mr-2"/>
            Transacciones realizadas vía: <strong>Openpay</strong>
          </div>
          <div className="flex items-center">
            <img src={security} alt="Security" className="h-6 mr-2"/>
            Tus pagos se realizan de forma segura con encriptación de 256 bits.
          </div>
        </div>

        {/* Botón para realizar el pago */}
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200">
          Pagar
        </button>

        {/* Mensaje de error, si aplica */}
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default PaymentForm;
