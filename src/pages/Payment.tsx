import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    // Normally you would send payment info to your server here.
    setTimeout(() => {
      alert('Paiement simul\u00e9!');
      setLoading(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border rounded p-4 bg-white">
        <CardElement options={{ hidePostalCode: true }} />
      </div>
      <Button type="submit" disabled={!stripe || loading}>
        {loading ? 'Paiement...' : 'Payer'}
      </Button>
    </form>
  );
};

const Payment = () => (
  <div className="max-w-md mx-auto p-4">
    <h1 className="text-2xl font-bold mb-4">Payer la consultation</h1>
    {!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ? (
      <p className="text-red-600">
        Veuillez d\u00e9finir VITE_STRIPE_PUBLISHABLE_KEY pour connecter Stripe.
      </p>
    ) : (
      <Elements stripe={stripePromise}>
        <PaymentForm />
      </Elements>
    )}
  </div>
);

export default Payment;
