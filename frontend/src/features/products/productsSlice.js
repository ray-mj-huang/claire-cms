import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { 
  fetchProducts, 
  fetchProductById, 
  createProduct, 
  uploadImage, 
  updateProduct as updateProductAPI,
  deleteProduct as deleteProductAPI 
} from '../../services/products'

export const getProducts = createAsyncThunk(
  'products/getProducts',
  async () => {
    const products = await fetchProducts()
    return products
  }
)

export const getProductById = createAsyncThunk(
  'products/getProductById',
  async (productId) => {
    const product = await fetchProductById(productId)
    return product
  }
)

export const saveProduct = createAsyncThunk(
  'products/saveProduct',
  async (productData) => {
    const product = await createProduct(productData)
    return product
  }
)

export const uploadProductImage = createAsyncThunk(
  'products/uploadProductImage',
  async (file) => {
    const imageUrl = await uploadImage(file)
    return imageUrl
  }
)

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async (productData) => {
    const product = await updateProductAPI(productData)
    return product
  }
)

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (productId) => {
    await deleteProductAPI(productId)
    return productId
  }
)

const initialState = {
  products: [],
  productsStatus: 'idle',
  productsError: null,
  currentViewingProduct: null,
  currentViewingProductStatus: 'idle',
  currentViewingProductError: null,
  status: 'idle',
  uploadingImage: false,
  error: null,
  currentCheckoutProduct: null,
  currentCheckoutProductStatus: 'idle',
  currentCheckoutProductError: null,
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearCurrentViewingProduct: (state) => {
      state.currentViewingProduct = null
      state.currentViewingProductStatus = 'idle'
      state.currentViewingProductError = null
    },
    resetProductsStatus: (state) => {
      state.productsStatus = 'idle'
    },
    setCurrentCheckoutProduct: (state, action) => {
      state.currentCheckoutProduct = action.payload
    },
    clearCurrentCheckoutProduct: (state) => {
      state.currentCheckoutProduct = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.productsStatus = 'loading'
        state.productsError = null
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        console.log('Reducer: updating products with:', action.payload)
        state.productsStatus = 'succeeded'
        state.products = action.payload || []
        state.productsError = null
      })
      .addCase(getProducts.rejected, (state, action) => {
        console.error('Reducer: products fetch failed:', action.error)
        state.productsStatus = 'failed'
        state.productsError = action.error.message
      })
      .addCase(getProductById.pending, (state) => {
        state.currentViewingProductStatus = 'loading'
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.currentViewingProductStatus = 'succeeded'
        state.currentViewingProduct = action.payload
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.currentViewingProductStatus = 'failed'
        state.currentViewingProductError = action.error.message
      })
      .addCase(saveProduct.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(saveProduct.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.products.push(action.payload)
      })
      .addCase(saveProduct.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(uploadProductImage.pending, (state) => {
        state.uploadingImage = true
      })
      .addCase(uploadProductImage.fulfilled, (state) => {
        state.uploadingImage = false
      })
      .addCase(uploadProductImage.rejected, (state) => {
        state.uploadingImage = false
      })
      .addCase(updateProduct.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.status = 'succeeded'
        const index = state.products.findIndex(p => p.id === action.payload.id)
        if (index !== -1) {
          state.products[index] = action.payload
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(deleteProduct.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.products = state.products.filter(product => product.id !== action.payload)
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  }
})

export const { clearCurrentViewingProduct, resetProductsStatus, setCurrentCheckoutProduct, clearCurrentCheckoutProduct } = productsSlice.actions

export default productsSlice.reducer 