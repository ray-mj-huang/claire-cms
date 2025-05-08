import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Loading from '../../components/common/Loading'
import StripeCheckout from '../../components/products/StripeCheckout'
import { RootState } from '../../features/store'
// import { Product } from '../../types/product'

// interface CheckoutProductProps {
//   product: Product;
// }

// const CheckoutProduct: React.ReactElement<CheckoutProductProps> = ({ product }) => {
//   return (
//     <div className="flex items-center space-x-4 mb-6">
//       {product.image && (
//         <img
//           src={product.image}
//           alt={product.name}
//           className="w-20 h-20 object-cover rounded-md"
//         />
//       )}
//       <div>
//         <h2 className="text-xl font-semibold text-gray-900">
//           {product.name}
//         </h2>
//         <p className="text-2xl font-bold text-gray-900 mt-1">
//           ${product.price.toFixed(2)}
//         </p>
//       </div>
//     </div>
//   )
// }

const Checkout = (): React.ReactElement => {
  const navigate = useNavigate()
  const { currentCheckoutProduct } = useSelector((state: RootState) => state.products)

  // If no checkout product exists, return to previous page
  useEffect(() => {
    if (!currentCheckoutProduct) {
      navigate(-1)
    }
  }, [currentCheckoutProduct, navigate])

  if (!currentCheckoutProduct) {
    return <Loading />
  }

  // Create a StripeProduct object that's compatible with the StripeCheckout component
  const stripeProduct = {
    name: currentCheckoutProduct.name,
    price: currentCheckoutProduct.price,
    description: currentCheckoutProduct.description,
    image: currentCheckoutProduct.image || undefined
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Checkout</h1>
      
      <div className="bg-white p-6 mb-8">
        {/* <CheckoutProduct /> */}
        
        <StripeCheckout product={stripeProduct} />
      </div>
      
      <button
        onClick={() => navigate(-1)}
        className="text-primary-500 hover:text-primary-600"
      >
        ← Back to Product
      </button>
    </div>
  )
}

export default Checkout 