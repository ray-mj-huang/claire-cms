import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { 
  fetchProducts, 
  fetchProductById, 
  createProduct, 
  uploadImage, 
  updateProduct as updateProductAPI,
  deleteProduct as deleteProductAPI 
} from '../../services/products'
import { Product, ProductFormData } from '../../types/product'

interface ProductsState {
  products: Product[]
  productsStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  productsError: string | null
  currentViewingProduct: Product | null
  currentViewingProductStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  currentViewingProductError: string | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  uploadingImage: boolean
  error: string | null
  currentCheckoutProduct: Product | null
  currentCheckoutProductStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  currentCheckoutProductError: string | null
}

export const getProducts = createAsyncThunk<Product[]>(
  'products/getProducts',
  async () => {
    const products = await fetchProducts()
    return products
  }
)

export const getProductById = createAsyncThunk<Product, string>(
  'products/getProductById',
  async (productId) => {
    const product = await fetchProductById(productId)
    return product
  }
)

export const saveProduct = createAsyncThunk<Product, ProductFormData>(
  'products/saveProduct',
  async (productData) => {
    const product = await createProduct(productData)
    return product
  }
)

export const uploadProductImage = createAsyncThunk<string, File>(
  'products/uploadProductImage',
  async (file) => {
    const imageUrl = await uploadImage(file)
    return imageUrl
  }
)

export const updateProduct = createAsyncThunk<Product, Partial<Product>>(
  'products/updateProduct',
  async (productData) => {
    const product = await updateProductAPI(productData)
    return product
  }
)

export const deleteProduct = createAsyncThunk<string, string>(
  'products/deleteProduct',
  async (productId) => {
    await deleteProductAPI(productId)
    return productId
  }
)

const initialState: ProductsState = {
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
    setCurrentCheckoutProduct: (state, action: PayloadAction<Product>) => {
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
      .addCase(getProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        console.log('Reducer: updating products with:', action.payload)
        state.productsStatus = 'succeeded'
        state.products = action.payload || []
        state.productsError = null
      })
      .addCase(getProducts.rejected, (state, action) => {
        console.error('Reducer: products fetch failed:', action.error)
        state.productsStatus = 'failed'
        state.productsError = action.error.message || 'Failed to fetch products'
      })
      .addCase(getProductById.pending, (state) => {
        state.currentViewingProductStatus = 'loading'
      })
      .addCase(getProductById.fulfilled, (state, action: PayloadAction<Product>) => {
        state.currentViewingProductStatus = 'succeeded'
        state.currentViewingProduct = action.payload
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.currentViewingProductStatus = 'failed'
        state.currentViewingProductError = action.error.message || 'Failed to fetch product'
      })
      .addCase(saveProduct.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(saveProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.status = 'succeeded'
        state.products.push(action.payload)
      })
      .addCase(saveProduct.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to save product'
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
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.status = 'succeeded'
        const index = state.products.findIndex(p => p.id === action.payload.id)
        if (index !== -1) {
          state.products[index] = action.payload
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to update product'
      })
      .addCase(deleteProduct.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = 'succeeded'
        state.products = state.products.filter(product => product.id !== action.payload)
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to delete product'
      })
  }
})

export const { clearCurrentViewingProduct, resetProductsStatus, setCurrentCheckoutProduct, clearCurrentCheckoutProduct } = productsSlice.actions

export default productsSlice.reducer 