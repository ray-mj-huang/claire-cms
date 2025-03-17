import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { auth } from '../services/firebase'
import { setUser, setLoading, setError } from '../features/auth/authSlice'

export function useAuth() {
  const dispatch = useDispatch()
  const { user, loading, error } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(setLoading(true))
    const unsubscribe = auth.onAuthStateChanged(
      (user) => {
        dispatch(setUser(user))
        dispatch(setLoading(false))
      },
      (error) => {
        dispatch(setError(error.message))
        dispatch(setLoading(false))
      }
    )

    return unsubscribe
  }, [dispatch])

  return { user, loading, error }
} 