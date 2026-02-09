'use client';

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

interface PayPalCheckoutProps {
  amount: string;      // Dynamic Amount
  planName: string;    // Dynamic Description
  onSuccess: () => void;
}

export default function PayPalCheckout({ amount, planName, onSuccess }: PayPalCheckoutProps) {
  // Config options for the PayPal SDK
  const initialOptions = {
    // Keep your Sandbox Client ID here
    clientId: "AXTHH0Hd3_UJ0agzjYWLS3P0QA4MzgjAmJRuNz6o5t1FnVt5YcfJSzkjaVNc3XYAc6pNv29I1QJ2fOPI",
    currency: "USD",
    intent: "capture",
  };

  return (
    <div className="w-full mt-6">
      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          // Re-render buttons when amount changes
          forceReRender={[amount, planName]}
          style={{
            layout: "vertical",
            color: "gold",
            shape: "rect",
            label: "pay"
          }}
          createOrder={(data, actions) => {
            return actions.order.create({
              intent: "CAPTURE",
              purchase_units: [
                {
                  amount: {
                    currency_code: "USD",
                    value: amount, // Uses the prop value
                  },
                  description: `DeepSoul - ${planName}`, // Uses the prop value
                },
              ],
            });
          }}
          onApprove={async (data, actions) => {
            if (actions.order) {
                try {
                    const order = await actions.order.capture();
                    console.log("Payment Successful:", order);
                    onSuccess();
                } catch (err) {
                    console.error("Capture Error:", err);
                }
            }
          }}
        />
      </PayPalScriptProvider>
      
      <p className="text-white/20 text-xs text-center mt-3">
        Secured by PayPal.
        <br/>
        <span className="text-white/10">Proceeding confirms your acceptance of Terms.</span>
      </p>
    </div>
  );
}
