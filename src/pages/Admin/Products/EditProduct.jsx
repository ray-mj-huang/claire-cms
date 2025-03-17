import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { PhotoIcon } from '@heroicons/react/24/outline'
import { getProductById, updateProduct, uploadProductImage } from '../../../features/products/productsSlice'
import Loading from '../../../components/common/Loading'

export default function EditProduct() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { product, status, uploadingImage } = useSelector((state) => ({
    product: state.products?.currentViewingProduct,
    status: state.products?.status || 'idle',
    uploadingImage: state.products?.uploadingImage || false
  }))

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: null
  })
  
  const [errors, setErrors] = useState({})

  useEffect(() => {
    dispatch(getProductById(productId))
  }, [dispatch, productId])

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        description: product.description,
        image: product.image
      })
    }
  }, [product])

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required'
    }
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Valid price is required'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      await dispatch(updateProduct({
        id: productId,
        ...formData,
        price: Number(formData.price)
      })).unwrap()
      navigate('/admin/products')
    } catch (error) {
      console.error('Failed to update product:', error)
      setErrors(prev => ({
        ...prev,
        submit: error.message || 'Failed to update product'
      }))
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      try {
        const imageUrl = await dispatch(uploadProductImage(file)).unwrap()
        setFormData(prev => ({
          ...prev,
          image: imageUrl
        }))
        if (errors.image) {
          setErrors(prev => ({
            ...prev,
            image: undefined
          }))
        }
      } catch (error) {
        console.error('Failed to upload image:', error)
        setErrors(prev => ({
          ...prev,
          image: error.message || 'Failed to upload image'
        }))
      }
    }
  }

  if (status === 'loading') {
    return <Loading />
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
      {errors.submit && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
          {errors.submit}
        </div>
      )}

      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Edit Product</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Update your product information
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                Product Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${errors.name ? 'ring-red-300' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">
                Price
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  name="price"
                  id="price"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${errors.price ? 'ring-red-300' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                />
                {errors.price && (
                  <p className="mt-2 text-sm text-red-600">{errors.price}</p>
                )}
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                Description
              </label>
              <div className="mt-2">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${errors.description ? 'ring-red-300' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                />
                {errors.description && (
                  <p className="mt-2 text-sm text-red-600">{errors.description}</p>
                )}
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="image" className="block text-sm font-medium leading-6 text-gray-900">
                Product Image
              </label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">
                  {formData.image ? (
                    <img
                      src={formData.image}
                      alt="Product preview"
                      className="mx-auto h-32 w-32 object-cover"
                    />
                  ) : (
                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                  )}
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                      <span>{uploadingImage ? 'Uploading...' : 'Upload a file'}</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                      />
                    </label>
                  </div>
                  {errors.image && (
                    <p className="mt-2 text-sm text-red-600">{errors.image}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          onClick={() => navigate('/admin/products')}
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={status === 'loading' || uploadingImage}
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
        >
          {status === 'loading' ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  )
} 