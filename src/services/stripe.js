import { loadStripe } from '@stripe/stripe-js'
import { getFunctions, httpsCallable } from 'firebase/functions'
import app from './firebase'

export const stripePromise = loadStripe("pk_live_51QwMCCLNlRl0GRIdecH4qcAW62Jw2cy4ciTgBbefRrQnIBauaRu1kj6ANkFzMjDb5RLmIiuSBvGIW20uuHkY6Mk700hkyixamT")

const functions = getFunctions(app)

export const createCheckoutSession = async (productData) => {
  try {
    const createCheckoutSessionFn = httpsCallable(functions, 'createCheckoutSession')
    const { data } = await createCheckoutSessionFn(productData)
    return data.clientSecret
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
}

export const getSessionStatus = async (sessionId) => {
  try {
    const getSessionStatusFn = httpsCallable(functions, 'sessionStatus')
    const { data } = await getSessionStatusFn({ sessionId })
    return data
  } catch (error) {
    console.error('Error getting session status:', error)
    throw error
  }
} 