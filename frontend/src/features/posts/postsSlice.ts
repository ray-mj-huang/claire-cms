import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { createPost, fetchPosts, fetchPostById, updatePost } from '../../services/posts'
import { uploadImage } from '../../services/storage'
import { Post, PostFormData } from '../../types/post'

interface PostsState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  currentPost: Post | null
  uploadingImage: boolean
  imageUploadError: string | null
  posts: Post[]
  postsStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  postsError: string | null
  currentViewingPost: Post | null
  currentViewingPostStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  currentViewingPostError: string | null
  updateStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  updateError: string | null
}

export const savePost = createAsyncThunk<Post, PostFormData>(
  'posts/savePost',
  async (postData) => {
    const post = await createPost(postData)
    return post
  }
)

export const uploadPostImage = createAsyncThunk<string, File>(
  'posts/uploadImage',
  async (file) => {
    const url = await uploadImage(file)
    return url
  }
)

export const getPosts = createAsyncThunk<Post[]>(
  'posts/getPosts',
  async () => {
    const posts = await fetchPosts()
    return posts as Post[]
  }
)

export const getPostById = createAsyncThunk<Post, string>(
  'posts/getPostById',
  async (postId) => {
    const post = await fetchPostById(postId)
    return post
  }
)

export const updatePostById = createAsyncThunk<Post, { postId: string, postData: Partial<PostFormData> }>(
  'posts/updatePost',
  async ({ postId, postData }) => {
    const post = await updatePost(postId, postData)
    return post as Post
  }
)

const initialState: PostsState = {
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
}

const postsSlice = createSlice({
  name: 'posts',
  initialState,
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
      .addCase(savePost.fulfilled, (state, action: PayloadAction<Post>) => {
        state.status = 'succeeded'
        state.currentPost = action.payload
        state.posts.unshift(action.payload)
      })
      .addCase(savePost.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to save post'
      })
      .addCase(uploadPostImage.pending, (state) => {
        state.uploadingImage = true
      })
      .addCase(uploadPostImage.fulfilled, (state) => {
        state.uploadingImage = false
      })
      .addCase(uploadPostImage.rejected, (state, action) => {
        state.uploadingImage = false
        state.imageUploadError = action.error.message || 'Failed to upload image'
      })
      .addCase(getPosts.pending, (state) => {
        state.postsStatus = 'loading'
      })
      .addCase(getPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
        state.postsStatus = 'succeeded'
        state.posts = action.payload
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.postsStatus = 'failed'
        state.postsError = action.error.message || 'Failed to fetch posts'
      })
      .addCase(getPostById.pending, (state) => {
        state.currentViewingPostStatus = 'loading'
      })
      .addCase(getPostById.fulfilled, (state, action: PayloadAction<Post>) => {
        state.currentViewingPostStatus = 'succeeded'
        state.currentViewingPost = action.payload
      })
      .addCase(getPostById.rejected, (state, action) => {
        state.currentViewingPostStatus = 'failed'
        state.currentViewingPostError = action.error.message || 'Failed to fetch post'
      })
      .addCase(updatePostById.pending, (state) => {
        state.updateStatus = 'loading'
      })
      .addCase(updatePostById.fulfilled, (state, action: PayloadAction<Post>) => {
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
        state.updateError = action.error.message || 'Failed to update post'
      })
  }
})

export const { clearCurrentPost, clearCurrentViewingPost } = postsSlice.actions
export default postsSlice.reducer 