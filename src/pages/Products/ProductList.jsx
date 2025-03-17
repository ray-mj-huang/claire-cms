import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getProducts } from '../../features/products/productsSlice'
import Loading from '../../components/common/Loading'
import PageHeader from '../../components/common/PageHeader'

export default function ProductList() {
  const dispatch = useDispatch()
  const { products, productsStatus, productsError } = useSelector((state) => state.products)

  useEffect(() => {
    if (productsStatus === 'idle') {
      dispatch(getProducts())
    }
  }, [productsStatus, dispatch])

  if (productsStatus === 'loading') {
    return <Loading />
  }

  if (productsStatus === 'failed') {
    return <div className="text-red-500">Error: {productsError}</div>
  }

  return (
    <div>
      <PageHeader 
        title="Products" 
        description="Browse our collection of products."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link 
              key={product.id} 
              to={`/products/${product.id}`}
              className="group"
            >
              <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {product.image && (
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600">
                    {product.name}
                  </h2>
                  <p className="mt-2 text-gray-500 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">
                      ${product.price}
                    </span>
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
} 