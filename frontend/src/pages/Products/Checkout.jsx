import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Loading from '../../components/common/Loading'
import StripeCheckout from '../../components/products/StripeCheckout'

const CheckoutProduct = () => {
  const { currentCheckoutProduct } = useSelector((state) => state.products)
  return (
    <div className="flex items-center space-x-4 mb-6">
      {currentCheckoutProduct.image && (
        <img
          src={currentCheckoutProduct.image}
          alt={currentCheckoutProduct.name}
          className="w-20 h-20 object-cover rounded-md"
        />
      )}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          {currentCheckoutProduct.name}
        </h2>
        <p className="text-2xl font-bold text-gray-900 mt-1">
          ${currentCheckoutProduct.price}
        </p>
      </div>
    </div>
  )
}

export default function Checkout() {
  const navigate = useNavigate()
  const { currentCheckoutProduct } = useSelector((state) => state.products)

  // 如果沒有 checkout 產品，返回上一頁
  useEffect(() => {
    if (!currentCheckoutProduct) {
      navigate(-1)
    }
  }, [currentCheckoutProduct, navigate])

  if (!currentCheckoutProduct) {
    return <Loading />
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Checkout</h1>
      
      <div className="bg-white p-6 mb-8">
        {/* <CheckoutProduct /> */}
        
        <StripeCheckout product={currentCheckoutProduct} />
      </div>
      
      <button
        onClick={() => navigate(-1)}
        className="text-indigo-600 hover:text-indigo-500"
      >
        ← Back to Product
      </button>
    </div>
  )
} 