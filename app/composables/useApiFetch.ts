import { useAuth } from './useAuth'
import { useRuntimeConfig } from '#app'

export const useApiFetch = async <T = any>(request: string, options: any = {}) => {
  const { accessToken, performRefresh, logout } = useAuth()
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase || ''

  // Automatically add authorization header if token exists
  const headers = new Headers(options.headers || {})
  if (accessToken.value) {
    headers.set('Authorization', `Bearer ${accessToken.value}`)
  }
  options.headers = headers

  try {
    return await $fetch<T>(request, { baseURL, ...options })
  } catch (error: any) {
    // If we get a 401 Unauthorized, try to refresh the token
    if (error.response?.status === 401) {
      console.log('Access token expired, attempting to refresh...')
      
      const refreshSuccess = await performRefresh()
      
      if (refreshSuccess && accessToken.value) {
        // If refresh was successful, update the header with the new token
        headers.set('Authorization', `Bearer ${accessToken.value}`)
        options.headers = headers
        
        // Retry the original request with the new token
        return await $fetch<T>(request, { baseURL, ...options })
      } else {
        // Refresh failed (e.g., refresh token also expired)
        console.error('Session completely expired. Logging out.')
        await logout()
        throw error
      }
    }
    
    // Throw error if it's not a 401 or refresh failed
    throw error
  }
}
