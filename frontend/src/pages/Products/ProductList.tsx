import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getProducts } from '../../features/products/productsSlice'
import Loading from '../../components/common/Loading'
import PageHeader from '../../components/common/PageHeader'
import { RootState, AppDispatch } from '../../features/store'
import { Product } from '../../types/product'

const ProductList = (): React.ReactElement => {
  const dispatch = useDispatch<AppDispatch>()
  const { products, productsStatus, productsError } = useSelector((state: RootState) => state.products)

  useEffect(() => {
    if (productsStatus === 'idle') {
      dispatch(getProducts())
    }
  }, [productsStatus, dispatch])

  if (productsStatus === 'loading') {
    return <Loading />
  }

  if (productsStatus === 'failed') {
    return <div>Error: {productsError}</div>
  }

  return (
    <div>
      <PageHeader 
        title="Products" 
        description="Browse our latest products."
      />
      <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-3 xl:gap-x-8">
          {products.map((product: Product) => (
            <Link key={product.id} to={`/products/${product.id}`} className="group">
              <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-center object-cover group-hover:opacity-75"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    No image
                  </div>
                )}
              </div>
              <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">${product.price.toFixed(2)}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductList 