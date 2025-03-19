import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createPost, fetchPosts, fetchPostById, updatePost } from '../../services/posts'
import { uploadImage } from '../../services/storage'

export const savePost = createAsyncThunk(
  'posts/savePost',
  async (postData) => {
    const post = await createPost(postData)
    return post
  }
)

export const uploadPostImage = createAsyncThunk(
  'posts/uploadImage',
  async (file) => {
    const url = await uploadImage(file)
    return url
  }
)

export const getPosts = createAsyncThunk(
  'posts/getPosts',
  async () => {
    const posts = await fetchPosts()
    return posts
  }
)

export const getPostById = createAsyncThunk(
  'posts/getPostById',
  async (postId) => {
    const post = await fetchPostById(postId)
    return post
  }
)

export const updatePostById = createAsyncThunk(
  'posts/updatePost',
  async ({ postId, postData }) => {
    const post = await updatePost(postId, postData)
    return post
  }
)

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    status: 'idle',
    error: null,
    currentPost: null,
    uploadingImage: false,
    imageUploadError: null,
    posts: [],
    postsStatus: 'idle',
    postsError: null,
    currentViewingPost: null,
    currentViewingPostStatus: 'idle',
    currentViewingPostError: null,
    updateStatus: 'idle',
    updateError: null
  },
  reducers: {
    clearCurrentPost: (state) => {
      state.currentPost = null
    },
    clearCurrentViewingPost: (state) => {
      state.currentViewingPost = null
      state.currentViewingPostStatus = 'idle'
      state.currentViewingPostError = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(savePost.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(savePost.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.currentPost = action.payload
        state.posts.unshift(action.payload)
      })
      .addCase(savePost.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(uploadPostImage.pending, (state) => {
        state.uploadingImage = true
      })
      .addCase(uploadPostImage.fulfilled, (state) => {
        state.uploadingImage = false
      })
      .addCase(uploadPostImage.rejected, (state, action) => {
        state.uploadingImage = false
        state.imageUploadError = action.error.message
      })
      .addCase(getPosts.pending, (state) => {
        state.postsStatus = 'loading'
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.postsStatus = 'succeeded'
        state.posts = action.payload
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.postsStatus = 'failed'
        state.postsError = action.error.message
      })
      .addCase(getPostById.pending, (state) => {
        state.currentViewingPostStatus = 'loading'
      })
      .addCase(getPostById.fulfilled, (state, action) => {
        state.currentViewingPostStatus = 'succeeded'
        state.currentViewingPost = action.payload
      })
      .addCase(getPostById.rejected, (state, action) => {
        state.currentViewingPostStatus = 'failed'
        state.currentViewingPostError = action.error.message
      })
      .addCase(updatePostById.pending, (state) => {
        state.updateStatus = 'loading'
      })
      .addCase(updatePostById.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded'
        const index = state.posts.findIndex(post => post.id === action.payload.id)
        if (index !== -1) {
          state.posts[index] = action.payload
        }
        if (state.currentViewingPost?.id === action.payload.id) {
          state.currentViewingPost = action.payload
        }
      })
      .addCase(updatePostById.rejected, (state, action) => {
        state.updateStatus = 'failed'
        state.updateError = action.error.message
      })
  }
})

export const { clearCurrentPost, clearCurrentViewingPost } = postsSlice.actions
export default postsSlice.reducer 