import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { format } from 'date-fns'
import { getPostById } from '../../features/posts/postsSlice'
import Loading from '../../components/common/Loading'
import { RootState, AppDispatch } from '../../features/store'

const BlogPost = (): React.ReactElement => {
  const { postId } = useParams<{ postId: string }>()
  const dispatch = useDispatch<AppDispatch>()
  const { currentViewingPost, currentViewingPostStatus, currentViewingPostError } = useSelector((state: RootState) => state.posts)

  useEffect(() => {
    if (postId) {
      dispatch(getPostById(postId))
    }
  }, [dispatch, postId])

  if (currentViewingPostStatus === 'loading') {
    return <Loading />
  }

  if (currentViewingPostStatus === 'failed') {
    return <div className="max-w-3xl mx-auto px-4 py-12">Error: {currentViewingPostError}</div>
  }

  if (!currentViewingPost) {
    return <div className="max-w-3xl mx-auto px-4 py-12">Post not found</div>
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <article>
        {currentViewingPost.coverImage && (
          <div className="aspect-w-16 aspect-h-9 mb-8 overflow-hidden rounded-lg">
            <img
              src={currentViewingPost.coverImage}
              alt={currentViewingPost.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold sm:text-4xl mb-4">{currentViewingPost.title}</h1>
          <div className="text-gray-500">
            {currentViewingPost.createdAt && (
              <time dateTime={currentViewingPost.createdAt.toISOString()}>
                {format(currentViewingPost.createdAt, 'MMMM d, yyyy')}
              </time>
            )}
            {currentViewingPost.tags && Array.isArray(currentViewingPost.tags) && currentViewingPost.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                {currentViewingPost.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="prose prose-lg mx-auto">
          <div 
            dangerouslySetInnerHTML={{ __html: currentViewingPost.content }}
            className="ql-editor"
          />
        </div>
      </article>
      <div className="mt-8">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Back to blog
        </button>
      </div>
    </div>
  )
}

export default BlogPost 