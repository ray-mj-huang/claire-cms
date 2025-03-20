import React, { useCallback, useState } from 'react'
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js'
import { stripePromise, createCheckoutSession } from '../../services/stripe'

interface Product {
  name: string;
  price: number;
  description?: string;
  image?: string;
}

interface StripeCheckoutProps {
  product: Product;
}

const StripeCheckout = ({ product }: StripeCheckoutProps): React.ReactElement => {
  const [error, setError] = useState<string | null>(null)

  const fetchClientSecret = useCallback(async (): Promise<string> => {
    try {
      setError(null)
      const clientSecret = await createCheckoutSession({
        name: product.name,
        price: product.price,
        description: product.description || '',
        image: product.image || null
      })
      return clientSecret
    } catch (err) {
      setError('Failed to initialize checkout. Please try again.')
      throw err
    }
  }, [product])

  if (error) {
    return (
      <div className="text-red-600 p-4 bg-red-50 rounded-md">
        {error}
      </div>
    )
  }

  return (
    <div id="checkout" className="w-full min-h-[500px]">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ fetchClientSecret }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}

export default StripeCheckout; 