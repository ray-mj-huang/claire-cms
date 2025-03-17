import { loadStripe, Stripe } from '@stripe/stripe-js'
import { getFunctions, httpsCallable } from 'firebase/functions'
import app from './firebase'

export const stripePromise: Promise<Stripe | null> = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

const functions = getFunctions(app)

interface ProductCheckoutData {
  name: string;
  price: number;
  description: string;
  image: string | null;
}

interface SessionStatusResponse {
  status: string;
  customer_email?: string;
  payment_status?: string;
}

export const createCheckoutSession = async (productData: ProductCheckoutData): Promise<string> => {
  try {
    const createCheckoutSessionFn = httpsCallable<ProductCheckoutData, { clientSecret: string }>(functions, 'createCheckoutSession')
    const { data } = await createCheckoutSessionFn(productData)
    return data.clientSecret
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
}

export const getSessionStatus = async (sessionId: string): Promise<SessionStatusResponse> => {
  try {
    const getSessionStatusFn = httpsCallable<{ sessionId: string }, SessionStatusResponse>(functions, 'sessionStatus')
    const { data } = await getSessionStatusFn({ sessionId })
    return data
  } catch (error) {
    console.error('Error getting session status:', error)
    throw error
  }
} 