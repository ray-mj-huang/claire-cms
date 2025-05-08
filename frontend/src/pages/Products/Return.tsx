import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSessionStatus } from '../../services/stripe'

interface SessionStatusResponse {
  status: string;
  customer_email?: string;
  payment_status?: string;
}

const Return = (): React.ReactElement => {
  const [status, setStatus] = useState<string | null>(null)
  const [customerEmail, setCustomerEmail] = useState<string>('')
  const navigate = useNavigate()

  useEffect(() => {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const sessionId = urlParams.get('session_id')

    if (sessionId) {
      getSessionStatus(sessionId)
        .then((data: SessionStatusResponse) => {
          setStatus(data.status)
          if (data.customer_email) {
            setCustomerEmail(data.customer_email)
          }
        })
        .catch((error: Error) => {
          console.error('Error fetching session status:', error)
        })
    }
  }, [])

  if (status === 'open') {
    navigate('/products')
    return <div className="hidden"></div>
  }

  if (status === 'complete') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Thank you for your purchase!
          </h2>
          <p className="text-gray-600">
            We appreciate your business! {customerEmail && `A confirmation email will be sent to ${customerEmail}.`}
          </p>
          <p className="mt-4 text-gray-600">
            If you have any questions, please email{' '}
            <a 
              href="mailto:orders@example.com" 
              className="text-primary-500 hover:text-primary-600"
            >
              orders@example.com
            </a>
          </p>
        </div>
      </div>
    )
  }

  // Return a loading or default state instead of null
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">Checking payment status...</div>
}

export default Return 