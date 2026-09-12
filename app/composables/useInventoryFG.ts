// idClass: 1 = Finish Good, 3 = Premix/Intermediate
export const useInventoryFG = (idClass: number = 1) => {
  const config = useRuntimeConfig()
  const { accessToken, logout } = useAuth()
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

  // Fetch combo dropdown item berdasarkan lokasi produksi
  const fetchComboFinishGood = async (lokasiId?: number) => {
    const idLokasi = lokasiId ?? activeProdId.value
    if (!idLokasi) return

    isLoadingCombo.value = true
    try {
      const response: any = await $fetch(
        `${config.public.apiBase || ''}/produksi/combo-prod-finis-good`,
        {
          query: { v_lokasi_id: idLokasi },
          headers: { Authorization: `Bearer ${accessToken.value}` },
        }
      )
      const raw = response?.data ?? (Array.isArray(response) ? response : [])
      itemComboList.value = raw
    } catch (err: any) {
      console.error('fetchComboFinishGood error:', err)
      if (err.response?.status === 401) logout()
    } finally {
      isLoadingCombo.value = false
    }
  }

  // Fetch stock on hand — v_id_class fixed per modul (1=FG, 3=Premix)
  const fetchStockOnHand = async () => {
    const prodCate = activeProdId.value
    if (!prodCate) return

    isLoadingStock.value = true
    try {
      const response: any = await $fetch(
        `${config.public.apiBase || ''}/produksi/prod-stock-on-hand`,
        {
          query: {
            var_where: searchKeyword.value || '',
            var_page_number: currentPage.value,
            var_row_page: rowsPerPage.value,
            v_id_class: idClass,
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
      console.error('fetchStockOnHand error:', err)
      if (err.response?.status === 401) logout()
    } finally {
      isLoadingStock.value = false
    }
  }

  // Tambah item ke inventory area produksi
  const addItemInventory = async (payload: {
    v_id_item: number
    v_uom_bom: number
    v_class_item: number
    v_id_prod: number
  }) => {
    try {
      const response: any = await $fetch(
        `${config.public.apiBase || ''}/produksi/add-item-inventory-prod-area`,
        {
          method: 'POST',
          body: payload,
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
    await fetchStockOnHand()
  }

  const setRowsPerPage = async (rows: number) => {
    rowsPerPage.value = rows
    currentPage.value = 1
    await fetchStockOnHand()
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
    fetchComboFinishGood,
    fetchStockOnHand,
    addItemInventory,
    goToPage,
    setRowsPerPage,
  }
}
