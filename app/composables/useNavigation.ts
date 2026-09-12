export const useNavigation = () => {
  const navigation = useState<any[]>('navigation', () => [])
  const isLoading = ref(false)
  const config = useRuntimeConfig()
  const { accessToken, logout } = useAuth()

  const fetchNavigation = async () => {
    if (navigation.value.length > 0) return
    
    isLoading.value = true
    try {
      const response: any = await $fetch(`${config.public.apiBase || ''}/navigation?aplikasi_id=7`, {
        headers: {
          'Authorization': `Bearer ${accessToken.value}`
        }
      })
      
      let rawData = []
      if (response && response.data) {
        rawData = response.data
      } else if (Array.isArray(response)) {
        rawData = response
      }

      // Keep native Level 1 structure
      let mappedMenus = rawData.map((m: any) => {
        return {
          id_menu: m.id_menu,
          mn_nm: m.mn_nm,
          mn_pth: m.mn_pth,
          submenu: m.submenu || []
        }
      })

      navigation.value = mappedMenus
    } catch (err: any) {
      console.error('Failed to fetch navigation:', err)
      if (err.response?.status === 401) {
        logout()
      }
    } finally {
      isLoading.value = false
    }
  }

  return {
    navigation,
    isLoading,
    fetchNavigation
  }
}
