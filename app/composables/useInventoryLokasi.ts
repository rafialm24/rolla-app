export const useInventoryLokasi = () => {
  const config = useRuntimeConfig()
  const { accessToken, logout, userId } = useAuth()
  const { activeProdId } = useProduksi()

  // --- State ---
  const itemComboList = ref<any[]>([])
  const stockList = ref<any[]>([])
  const isLoadingCombo = ref(false)
  const isLoadingStock = ref(false)
  const currentPage = ref(1)
  const rowsPerPage = ref(10)
  const totalPages = ref(0)
  const searchKeyword = ref('')
  const comboProdLokasiList = ref<any[]>([])
  const isUpdatingLokasi = ref(false)

  // Fetch Combo Lokasi (Dropdown for Moving)
  const fetchComboProdLokasi = async (v_lokasi: number = 0) => {
    try {
      const response: any = await $fetch(
        `${config.public.apiBase || ''}/produksi/combo-prod-lokasi`,
        {
          query: { v_app: 7, v_lokasi: activeProdId.value || 0 },
          headers: { Authorization: `Bearer ${accessToken.value}` },
        }
      )
      comboProdLokasiList.value = response?.data || []
    } catch (err: any) {
      console.error('fetchComboProdLokasi error:', err)
    }
  }

  // Update Moving Lokasi
  const updateMovingLokasi = async (v_id: number, v_lok: number) => {
    isUpdatingLokasi.value = true
    try {
      const response: any = await $fetch(
        `${config.public.apiBase || ''}/produksi/update-moving-lokasi`,
        {
          method: 'POST',
          body: { v_id, v_lok },
          headers: { Authorization: `Bearer ${accessToken.value}` },
        }
      )
      return { success: true, data: response }
    } catch (err: any) {
      console.error('updateMovingLokasi error:', err)
      return { success: false, error: err }
    } finally {
      isUpdatingLokasi.value = false
    }
  }

  // Fetch combo dropdown item berdasarkan lokasi produksi
  const fetchComboLokasi = async (lokasiId?: number) => {
    const idLokasi = lokasiId ?? activeProdId.value
    if (!idLokasi) return

    isLoadingCombo.value = true
    try {
      // NOTE: reusing finish-good combo endpoint as it seems to be the default for item picking
      const response: any = await $fetch(
        `${config.public.apiBase || ''}/produksi/combo-item-material-area-produksi`,
        {
          query: {
            var_where: '',
            var_page_number: 1,
            var_row_page: 500,
            v_id_prod: idLokasi,
            v_id_class: 0
          },
          headers: { Authorization: `Bearer ${accessToken.value}` },
        }
      )
      const raw = response?.data ?? (Array.isArray(response) ? response : [])
      itemComboList.value = raw
    } catch (err: any) {
      console.error('fetchComboLokasi error:', err)
      if (err.response?.status === 401) logout()
    } finally {
      isLoadingCombo.value = false
    }
  }

  // Fetch stock on hand menggunakan stock-on-hand-rolla-lokasi
  const fetchStockOnHandLokasi = async () => {
    const prodCate = activeProdId.value
    if (!prodCate) return

    isLoadingStock.value = true
    try {
      const response: any = await $fetch(
        `${config.public.apiBase || ''}/produksi/prod-stock-on-hand-lokasi-rolla`,
        {
          query: {
            var_where: searchKeyword.value ? `AND cmp.name_produk ILIKE '%${searchKeyword.value}%'` : '',
            var_page_number: currentPage.value,
            var_row_page: rowsPerPage.value,
            v_prod_cate: prodCate,
          },
          headers: { Authorization: `Bearer ${accessToken.value}` },
        }
      )

      const raw: any[] = response?.data ?? (Array.isArray(response) ? response : [])
      stockList.value = raw

      if (raw.length > 0 && raw[0]?.total_rows !== undefined) {
        totalPages.value = Math.ceil(raw[0].total_rows / rowsPerPage.value)
      } else {
        totalPages.value = raw.length < rowsPerPage.value ? currentPage.value : currentPage.value + 1
      }
    } catch (err: any) {
      console.error('fetchStockOnHandLokasi error:', err)
      if (err.response?.status === 401) logout()
    } finally {
      isLoadingStock.value = false
    }
  }

  // Tambah item ke inventory area produksi
  const addItemInventoryLokasi = async (payload: {
    v_id_item: number
    v_uom_bom: number
    v_class_item: number
    v_id_prod: number
  }) => {
    const finalPayload = { ...payload, v_id_usr: userId.value || 0 }
    try {
      const response: any = await $fetch(
        `${config.public.apiBase || ''}/produksi/add-item-inventory-prod-lokasi`,
        {
          method: 'POST',
          body: finalPayload,
          headers: { Authorization: `Bearer ${accessToken.value}` },
        }
      )
      return { success: true, data: response }
    } catch (err: any) {
      console.error('addItemInventory error:', err)
      if (err.response?.status === 401) logout()
      return { success: false, error: err }
    }
  }

  const goToPage = async (page: number) => {
    if (page < 1 || page > totalPages.value) return
    currentPage.value = page
    await fetchStockOnHandLokasi()
  }

  const setRowsPerPage = async (rows: number) => {
    rowsPerPage.value = rows
    currentPage.value = 1
    await fetchStockOnHandLokasi()
  }

  return {
    itemComboList,
    stockList,
    isLoadingCombo,
    isLoadingStock,
    currentPage,
    rowsPerPage,
    totalPages,
    searchKeyword,
    fetchComboLokasi,
    fetchStockOnHandLokasi,
    addItemInventoryLokasi,
    goToPage,
    setRowsPerPage,
    comboProdLokasiList,
    isUpdatingLokasi,
    fetchComboProdLokasi,
    updateMovingLokasi,
  }
}
