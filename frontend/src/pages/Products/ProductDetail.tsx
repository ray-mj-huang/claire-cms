import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getProductById, clearCurrentViewingProduct, setCurrentCheckoutProduct } from '../../features/products/productsSlice'
import Loading from '../../components/common/Loading'
import { RootState, AppDispatch } from '../../features/store'

const ProductDetail = (): React.ReactElement => {
  const { productId } = useParams<{ productId: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { currentViewingProduct, currentViewingProductStatus, currentViewingProductError } = 
    useSelector((state: RootState) => state.products)

  useEffect(() => {
    if (productId) {
      dispatch(getProductById(productId))
    }
    return () => {
      dispatch(clearCurrentViewingProduct())
    }
  }, [productId, dispatch])

  const handlePurchase = (): void => {
    if (currentViewingProduct) {
      dispatch(setCurrentCheckoutProduct(currentViewingProduct))
      navigate(`/checkout/${currentViewingProduct.id}`)
    }
  }

  if (currentViewingProductStatus === 'loading') {
    return <Loading />
  }

  if (currentViewingProductStatus === 'failed') {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">Error: {currentViewingProductError}</p>
        <button
          onClick={() => navigate(-1)}
          className="text-primary-500 hover:text-primary-600"
        >
          ← Back to Products
        </button>
      </div>
    )
  }

  if (!currentViewingProduct) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <p className="mb-4">Product not found</p>
        <button
          onClick={() => navigate(-1)}
          className="text-primary-500 hover:text-primary-600"
        >
          ← Back to Products
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {currentViewingProduct.image && (
            <img
              src={currentViewingProduct.image}
              alt={currentViewingProduct.name}
              className="w-full rounded-lg shadow-lg"
            />
          )}
        </div>
        
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {currentViewingProduct.name}
          </h1>
          
          <div className="mt-4">
            <span className="text-3xl font-bold text-gray-900">
              ${currentViewingProduct.price.toFixed(2)}
            </span>
          </div>
          
          <div className="mt-6 space-y-6">
            <p className="text-gray-500">
              {currentViewingProduct.description}
            </p>
            
            <button
              onClick={handlePurchase}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Purchase
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <button
          onClick={() => navigate(-1)}
          className="text-primary-500 hover:text-primary-600"
        >
          ← Back to Products
        </button>
      </div>
    </div>
  )
}

export default ProductDetail 
