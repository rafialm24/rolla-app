export const useProduksi = () => {
  const produksiList = useState<any[]>('produksiList', () => [])
  const currentProduksi = useState<any | null>('currentProduksi', () => null)
  const activeProdId = useCookie<number | null>('active_prod_id', { default: () => null })
  
  const isLoading = ref(false)
  const config = useRuntimeConfig()
  const { accessToken, logout } = useAuth()

  const fetchProduksiIndex = async (forceRefetch = false) => {
    if (!forceRefetch && produksiList.value.length > 0) return
    isLoading.value = true
    try {
      // The API is /produksi/index/get
      const response: any = await $fetch(`${config.public.apiBase || ''}/produksi/index/get`, {
        headers: {
          'Authorization': `Bearer ${accessToken.value}`
        }
      })
      
      let data = []
      if (response && response.data) {
        data = response.data
      } else if (Array.isArray(response)) {
        data = response
      }

      // Sort alphabetically by name_prod for the UI
      data.sort((a: any, b: any) => (a.name_prod || '').localeCompare(b.name_prod || ''))
      produksiList.value = data

      // Set default active if none is set and we have data
      if (data.length > 0 && !activeProdId.value) {
        // Find the item with the smallest ID
        const smallestItem = data.reduce((min: any, curr: any) => (curr.id < min.id ? curr : min), data[0])
        activeProdId.value = smallestItem.id
      }

      // If we have an active ID, fetch its title/details
      if (activeProdId.value) {
        await fetchProduksiTitle(activeProdId.value)
      }
      
    } catch (err: any) {
      console.error('Failed to fetch produksi index:', err)
      if (err.response?.status === 401) {
        logout()
      }
    } finally {
      isLoading.value = false
    }
  }

  const fetchProduksiTitle = async (v_prod: number) => {
    if (!v_prod) return

    try {
      const response: any = await $fetch(`${config.public.apiBase || ''}/produksi/index/title?v_prod=${v_prod}`, {
        headers: {
          'Authorization': `Bearer ${accessToken.value}`
        }
      })
      
      if (response && response.data) {
        currentProduksi.value = response.data
      } else {
        currentProduksi.value = response
      }
    } catch (err: any) {
      console.error(`Failed to fetch produksi title for v_prod=${v_prod}:`, err)
    }
  }

  const setActiveProdId = async (id: number) => {
    activeProdId.value = id
    await fetchProduksiTitle(id)
  }

  return {
    produksiList,
    currentProduksi,
    activeProdId,
    isLoading,
    fetchProduksiIndex,
    fetchProduksiTitle,
    setActiveProdId
  }
}
