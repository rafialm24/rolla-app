const FOTO_BASE_URL = 'https://laskarbuah-hrd.s3.ap-southeast-3.amazonaws.com/foto_karyawan/'

export const useAuth = () => {
  const config = useRuntimeConfig()

  // Set expiration for cookies (e.g., 7 days)
  const cookieOptions = {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  }

  const accessToken = useCookie('access_token', cookieOptions)
  const refreshToken = useCookie('refresh_token', cookieOptions)
  const user = useCookie('user_data', cookieOptions)
  const userProfile = useCookie<any>('user_profile', cookieOptions)
  const userId = useCookie<number | null>('user_id', cookieOptions)

  /**
   * Fetch profil lengkap user dari API menggunakan access token.
   * Mengambil: nama_lengkap, nama_jabatan, cmp_desc, kelamin, tlp, foto
   */
  
  const fetchMe = async () => {
    if (!accessToken.value) return
    try {
      const me: any = await $fetch(`${config.public.apiBase || ''}/auth/me`, {
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      userId.value = me?.user_id || me?.id || me?.data?.user_id || me?.data?.id || 0
    } catch (err) {
      console.error('Gagal mengambil /auth/me:', err)
    }
  }

  const fetchProfile = async () => {
    if (!accessToken.value) return
    await fetchMe()
    try {
      const profile: any = await $fetch(`${config.public.apiBase || ''}/profile`, {
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      // Simpan hanya field yang dibutuhkan
      userProfile.value = {
        nama_lengkap: profile.nama_lengkap,
        nama_jabatan: profile.nama_jabatan,
        cmp_desc: profile.cmp_desc,
        kelamin: profile.kelamin,
        tlp: profile.tlp,
        foto: profile.foto ? `${FOTO_BASE_URL}${profile.foto}` : null
      }
    } catch (err) {
      console.error('Gagal mengambil data profil:', err)
    }
  }

  const login = async (nik: string, pass: string) => {
    try {
      const response: any = await $fetch(`${config.public.apiBase || ''}/auth/loginone`, {
        method: 'POST',
        body: {
          username: nik,
          password: pass,
          ip: '127.0.0.1',
          aplikasi_id: 7
        }
      })

      if (response.access_token) {
        accessToken.value = response.access_token
        refreshToken.value = response.refresh_token
        user.value = { nik }
        // Fetch profil lengkap setelah login berhasil
        await fetchProfile()
        return { success: true }
      }
      return { success: false, message: 'Invalid credentials' }
    } catch (err: any) {
      return { success: false, message: err.data?.message || 'Login failed' }
    }
  }

  const performRefresh = async () => {
    if (!refreshToken.value) return false

    try {
      const response: any = await $fetch(`${config.public.apiBase || ''}/auth/refresh`, {
        method: 'POST',
        body: { refresh_token: refreshToken.value }
      })

      if (response.access_token) {
        accessToken.value = response.access_token
        refreshToken.value = response.refresh_token
        return true
      }
      return false
    } catch (err) {
      clearAuth()
      return false
    }
  }

  const clearAuth = () => {
    accessToken.value = null
    refreshToken.value = null
    user.value = null
    userProfile.value = null
  }

  const logout = async () => {
    clearAuth()
    await navigateTo('/login')
  }

  return {
    userId,
    fetchMe,
    accessToken,
    refreshToken,
    user,
    userProfile,
    login,
    logout,
    clearAuth,
    fetchProfile,
    performRefresh,
    isAuthenticated: computed(() => !!accessToken.value || !!refreshToken.value)
  }
}
