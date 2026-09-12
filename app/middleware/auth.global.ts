export default defineNuxtRouteMiddleware(async (to) => {
  const { accessToken, refreshToken, isAuthenticated, performRefresh, clearAuth, fetchProfile, userProfile } = useAuth()
  const isLoginPage = to.path === '/login'

  if (!accessToken.value && refreshToken.value) {
    const refreshed = await performRefresh()
    if (!refreshed) {
      clearAuth()
    }
  }

  // Jika sudah punya token tapi profil belum terisi (misal user sudah login sebelumnya),
  // fetch profil secara otomatis agar header & sidebar menampilkan data yang benar
  if (accessToken.value && !userProfile.value) {
    await fetchProfile()
  }

  // Jika belum login dan tidak berada di halaman login, arahkan ke login
  if (!isAuthenticated.value && !isLoginPage) {
    return navigateTo('/login')
  }

  // Jika sudah login dan mencoba mengakses halaman login, arahkan ke dashboard
  if (isAuthenticated.value && isLoginPage) {
    return navigateTo('/dashboard')
  }
})
