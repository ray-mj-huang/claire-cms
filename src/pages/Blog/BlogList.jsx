import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { getPosts } from '../../features/posts/postsSlice'
import Loading from '../../components/common/Loading'  // 添加這行
import PageHeader from '../../components/common/PageHeader'

export default function BlogList() {
  const dispatch = useDispatch()
  const { posts, postsStatus, postsError } = useSelector((state) => state.posts)

  useEffect(() => {
    if (postsStatus === 'idle') {
      dispatch(getPosts())
    }
  }, [postsStatus, dispatch])

  if (postsStatus === 'loading') {
    return <Loading />
  }

  if (postsStatus === 'failed') {
    return <div>Error: {postsError}</div>
  }

  const publishedPosts = posts.filter(post => post.status === 'published')

  return (
    <div>
      <PageHeader 
        title="Blog" 
        description="Latest updates and news from our team."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-16 lg:grid-cols-2">
          {publishedPosts.map((post) => (
            <article key={post.id} className="flex flex-col">
              <Link to={`/blog/${post.id}`} className="group">
                <div className="aspect-w-16 aspect-h-9 mb-4 overflow-hidden rounded-lg bg-gray-100">
                  {post.coverImage ? (
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span>No image available</span>
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600">
                  {post.title}
                </h2>
              </Link>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <time dateTime={post.createdAt?.toISOString()}>
                  {post.createdAt ? format(post.createdAt, 'MMM d, yyyy') : 'Date not available'}
                </time>
                {post.tags?.length > 0 && (
                  <>
                    <span className="mx-1">•</span>
                    <div className="flex gap-2">
                      {post.tags.map(tag => (
                        <span key={tag} className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
} 