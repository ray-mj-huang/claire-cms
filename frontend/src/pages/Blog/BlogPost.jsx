import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { format } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import { getPostById, clearCurrentViewingPost } from '../../features/posts/postsSlice'
import Loading from '../../components/common/Loading'

export default function BlogPost() {
  const { postId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentViewingPost, currentViewingPostStatus, currentViewingPostError } = useSelector((state) => state.posts)

  useEffect(() => {
    if (postId) {
      dispatch(getPostById(postId))
    }
    
    return () => {
      dispatch(clearCurrentViewingPost())
    }
  }, [postId, dispatch])

  const renderMarkdown = (content) => {
    try {
      return (
        <ReactMarkdown 
          components={{
            a: ({node, ...props}) => (
              <a target="_blank" rel="noopener noreferrer" {...props} />
            ),
            img: ({node, ...props}) => (
              <img className="w-full h-auto" {...props} alt={props.alt || ''} />
            ),
            code: ({node, inline, ...props}) => (
              inline ? 
                <code {...props} /> :
                <pre><code {...props} /></pre>
            )
          }}
        >
          {content || ''}
        </ReactMarkdown>
      )
    } catch (error) {
      console.error('Markdown rendering error:', error)
      return <p className="text-red-500">Error rendering content</p>
    }
  }

  if (currentViewingPostStatus === 'loading') {
    return <Loading />
  }

  if (currentViewingPostStatus === 'failed') {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-gray-500">
        <p className="text-red-500 mb-4">Error: {currentViewingPostError}</p>
        <button
          onClick={() => navigate(-1)}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          ← Back
        </button>
      </div>
    )
  }

  if (!currentViewingPost) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-gray-500">
        <p className="mb-4">Post not found</p>
        <button
          onClick={() => navigate(-1)}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          ← Back
        </button>
      </div>
    )
  }

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {currentViewingPost.coverImage && (
        <img
          src={currentViewingPost.coverImage}
          alt={currentViewingPost.title}
          className="w-full h-auto rounded-lg mb-8"
        />
      )}
      
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        {currentViewingPost.title}
      </h1>
      
      <div className="flex items-center text-sm text-gray-500 mb-8">
        <time dateTime={currentViewingPost.createdAt?.toISOString()}>
          {currentViewingPost.createdAt ? format(currentViewingPost.createdAt, 'MMMM d, yyyy') : 'Date not available'}
        </time>
        {currentViewingPost.tags?.length > 0 && (
          <>
            <span className="mx-2">•</span>
            <div className="flex gap-2">
              {currentViewingPost.tags.map(tag => (
                <span key={tag} className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="prose prose-lg max-w-none">
        {renderMarkdown(currentViewingPost.content)}
      </div>

      <div className="mt-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          ← Back
        </button>
      </div>
    </article>
  )
} 