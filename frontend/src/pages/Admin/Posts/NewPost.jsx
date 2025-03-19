import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { PhotoIcon } from '@heroicons/react/24/outline'
import MDEditor from '@uiw/react-md-editor'
import { savePost, uploadPostImage } from '../../../features/posts/postsSlice'
import Loading from '../../../components/common/Loading'

export default function NewPost() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { status, uploadingImage } = useSelector((state) => state.posts)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    coverImage: null,
    tags: '',
    status: 'draft'
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // 處理標籤
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag)

      await dispatch(savePost({
        ...formData,
        tags: tagsArray
      })).unwrap()
      
      navigate('/admin/posts')
    } catch (error) {
      console.error('Failed to save post:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleContentChange = (value) => {
    setFormData(prev => ({
      ...prev,
      content: value || ''
    }))
  }

  const handleCoverImageUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      try {
        const url = await dispatch(uploadPostImage(file)).unwrap()
        setFormData(prev => ({
          ...prev,
          coverImage: url
        }))
      } catch (error) {
        console.error('Failed to upload image:', error)
      }
    }
  }

  const handleImageUpload = useCallback(async (file) => {
    try {
      const url = await dispatch(uploadPostImage(file)).unwrap()
      return url
    } catch (error) {
      console.error('Failed to upload image:', error)
      return null
    }
  }, [dispatch])

  if (status === 'loading') {
    return <Loading />
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200 px-4 py-6">
      <div className="space-y-8 divide-y divide-gray-200">
        <div>
          <div>
            <h3 className="text-2xl font-semibold leading-6 text-gray-900">New Post</h3>
            <p className="mt-2 text-sm text-gray-500">
              Create a new blog post to share your thoughts and ideas.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
            {/* Title */}
            <div className="sm:col-span-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Cover Image */}
            <div className="sm:col-span-6">
              <label htmlFor="cover-photo" className="block text-sm font-medium text-gray-700">
                Cover photo
              </label>
              <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                <div className="space-y-1 text-center">
                  {formData.coverImage ? (
                    <img
                      src={formData.coverImage}
                      alt="Cover preview"
                      className="mx-auto h-32 w-auto"
                    />
                  ) : (
                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                  )}
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        onChange={handleCoverImageUpload}
                        accept="image/*"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <div data-color-mode="light">
                <MDEditor
                  value={formData.content}
                  onChange={handleContentChange}
                  height={400}
                  preview="edit"
                  uploadImage={handleImageUpload}
                />
              </div>
            </div>

            {/* Tags */}
            <div className="sm:col-span-4">
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
                  placeholder="Separate tags with commas"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Status */}
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

      <div className="pt-5">
        <div className="flex justify-end gap-x-3">
          <button
            type="button"
            onClick={() => navigate('/admin/posts')}
            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            disabled={status === 'loading'}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </form>
  )
} 