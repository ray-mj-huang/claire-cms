import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { getPostById, updatePostById, uploadPostImage } from '../../../features/posts/postsSlice'
import Loading from '../../../components/common/Loading'
import { RootState, AppDispatch } from '../../../features/store'

interface PostFormData {
  title: string;
  content: string;
  coverImage: string | null;
  tags: string;
  status: 'draft' | 'published';
}

const EditPost = (): React.ReactElement => {
  const { postId } = useParams<{ postId: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { currentViewingPost, currentViewingPostStatus, updateStatus } = useSelector((state: RootState) => state.posts)
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    content: '',
    coverImage: null,
    tags: '',
    status: 'draft'
  })

  useEffect(() => {
    if (postId) {
      dispatch(getPostById(postId))
    }
  }, [postId, dispatch])

  useEffect(() => {
    if (currentViewingPost) {
      setFormData({
        title: currentViewingPost.title || '',
        content: currentViewingPost.content || '',
        coverImage: currentViewingPost.coverImage || null,
        tags: currentViewingPost.tags ? currentViewingPost.tags.join(',') : '',
        status: currentViewingPost.status || 'draft'
      })
    }
  }, [currentViewingPost])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    if (!postId) return
    
    try {
      // Process tags
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '')

      await dispatch(updatePostById({
        postId,
        postData: {
          ...formData,
          tags: tagsArray
        }
      })).unwrap()
      
      navigate('/admin/posts')
    } catch (error) {
      console.error('Failed to update post:', error)
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleContentChange = (value: string | undefined): void => {
    setFormData(prev => ({
      ...prev,
      content: value || ''
    }))
  }

  const handleCoverImageUpload = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    if (!e.target.files || e.target.files.length === 0) {
      return
    }
    
    const file = e.target.files[0]
    
    try {
      const imageUrl = await dispatch(uploadPostImage(file)).unwrap()
      
      setFormData(prev => ({
        ...prev,
        coverImage: imageUrl
      }))
    } catch (error) {
      console.error('Failed to upload image:', error)
    }
  }

  const handleRemoveCoverImage = (): void => {
    setFormData(prev => ({
      ...prev,
      coverImage: null
    }))
  }

  if (currentViewingPostStatus === 'loading') {
    return <Loading />
  }

  if (!currentViewingPost && currentViewingPostStatus === 'succeeded') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">Post not found</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/admin/posts')}
          className="mt-4 text-sm text-indigo-600 hover:text-indigo-500"
        >
          ← Back to posts
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
            Edit Post
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            onClick={() => navigate('/admin/posts')}
            className="ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200">
        <div className="space-y-8 divide-y divide-gray-200">
          <div>
            <div>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="title"
                      id="title"
                      required
                      value={formData.title}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                    Content
                  </label>
                  <div className="mt-1">
                    {/* <MDEditor
                      value={formData.content}
                      onChange={handleContentChange}
                      height={400}
                    /> */}
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700">
                    Cover Image
                  </label>
                  <div className="mt-1 flex items-center">
                    {formData.coverImage ? (
                      <div className="relative">
                        <img
                          src={formData.coverImage}
                          alt="Post cover"
                          className="h-32 w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveCoverImage}
                          className="absolute top-0 right-0 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                        >
                          <XMarkIcon className="h-5 w-5 text-gray-500" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-center items-center w-full">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                        >
                          <div className="max-w-lg flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                              <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                              <div className="flex text-sm text-gray-600">
                                <span>Upload an image</span>
                                <input
                                  id="file-upload"
                                  name="file-upload"
                                  type="file"
                                  accept="image/*"
                                  className="sr-only"
                                  onChange={handleCoverImageUpload}
                                />
                              </div>
                            </div>
                          </div>
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                    Tags
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="tags"
                      id="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      placeholder="tag1, tag2, tag3"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">Separate tags with commas</p>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <div className="mt-1">
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-5">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/admin/posts')}
              className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateStatus === 'loading'}
              className={`ml-3 inline-flex justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                updateStatus === 'loading'
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {updateStatus === 'loading' ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default EditPost 