export const useBom = () => {
  const config = useRuntimeConfig()
  const { accessToken } = useAuth()

  // State
  const isLoadingHeader = ref(false)
  const isLoadingDetail = ref(false)
  const isLoadingCosting = ref(false)

  const bomHeaderList = ref<any[]>([])
  const totalBomHeader = ref(0)

  const bomDetailList = ref<any[]>([])
  const totalBomDetail = ref(0)
  const bomCostingList = ref<any[]>([])
  const comboMaterialList = ref<any[]>([])
  const uomKonversiList = ref<any[]>([])
  const categoryBomList = ref<any[]>([])

  // Headers
  const fetchBomHeader = async (params: { var_where?: string, var_page_number: number, var_row_page: number, v_class: number, v_id_produksi: number }) => {
    isLoadingHeader.value = true
    try {
      const q = new URLSearchParams()
      if (params.var_where) q.append('filterRules', JSON.stringify([{ field: 'name_produk', value: params.var_where }]))
      q.append('page', params.var_page_number.toString())
      q.append('rows', params.var_row_page.toString())
      q.append('v_class', params.v_class.toString())
      q.append('v_id_produksi', params.v_id_produksi.toString())

      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/master-bom/get-bom-header-listrolla?${q.toString()}`, {
        headers: { 'Authorization': `Bearer ${accessToken.value}` }
      })
      bomHeaderList.value = res.rows || []
      totalBomHeader.value = parseInt(res.total || '0')
      return res
    } catch (err) {
      console.error('Error fetchBomHeader:', err)
      return { success: false, data: [] }
    } finally {
      isLoadingHeader.value = false
    }
  }

  const actionBomHeader = async (payload: any) => {
    try {
      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/master-bom/action-bom-h`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken.value}` },
        body: payload
      })
      return { success: true, data: res.data }
    } catch (err) {
      console.error('Error actionBomHeader:', err)
      return { success: false }
    }
  }

  // Details
  const fetchBomDetail = async (params: { var_where?: string, var_page_number: number, var_row_page: number, v_id_header: number, v_id_prod: number }) => {
    isLoadingDetail.value = true
    try {
      const q = new URLSearchParams()
      if (params.var_where) q.append('filterRules', JSON.stringify([{ field: 'reference', value: params.var_where }]))
      q.append('page', params.var_page_number.toString())
      q.append('rows', params.var_row_page.toString())
      q.append('v_id_header', params.v_id_header.toString())
      q.append('v_id_prod', params.v_id_prod.toString())

      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/master-bom/get-bom-detail-list?${q.toString()}`, {
        headers: { 'Authorization': `Bearer ${accessToken.value}` }
      })
      bomDetailList.value = res.rows || []
      totalBomDetail.value = parseInt(res.total || '0')
      return res
    } catch (err) {
      console.error('Error fetchBomDetail:', err)
      return { success: false, data: [] }
    } finally {
      isLoadingDetail.value = false
    }
  }

  const saveBomDetail = async (payload: any) => {
    try {
      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/master-bom/prod-bom-list-detail-save`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken.value}` },
        body: payload
      })
      return { success: true, data: res.data }
    } catch (err) {
      console.error('Error saveBomDetail:', err)
      return { success: false }
    }
  }

  const actionBomDetail = async (payload: any) => {
    try {
      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/master-bom/prod-bom-list-detail-action`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken.value}` },
        body: payload
      })
      return { success: true, data: res.data }
    } catch (err) {
      console.error('Error actionBomDetail:', err)
      return { success: false }
    }
  }

  const fetchComboMaterial = async (params: { var_where?: string, var_page_number: number, var_row_page: number, v_id_header: number, v_id_formula: number, v_mix_id: number, v_id_prod: number }) => {
    try {
      const q = new URLSearchParams()
      if (params.var_where) q.append('q', params.var_where)
      q.append('page', params.var_page_number.toString())
      q.append('rows', params.var_row_page.toString())
      q.append('id_header', params.v_id_header.toString())
      q.append('id_formula', params.v_id_formula.toString())
      q.append('mix_id', params.v_mix_id.toString())
      q.append('v_id_prod', params.v_id_prod.toString())

      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/master-bom/combo-produk-group-prod-material-bom-rolla?${q.toString()}`, {
        headers: { 'Authorization': `Bearer ${accessToken.value}` }
      })
      comboMaterialList.value = res.rows || []
      return res
    } catch (err) {
      console.error('Error fetchComboMaterial:', err)
      return { success: false, data: [] }
    }
  }

  // Costing
  const fetchCostingView = async (params: { v_id_prod: number, v_id_bom: number, v_formula: number, v_qty_order: number, v_start_date: string, v_end_date: string }) => {
    isLoadingCosting.value = true
    try {
      const q = new URLSearchParams()
      q.append('v_id_prod', params.v_id_prod.toString())
      q.append('v_id_bom', params.v_id_bom.toString())
      q.append('v_formula', params.v_formula.toString())
      q.append('v_qty_order', (params.v_qty_order || 0).toString())
      q.append('v_start_date', params.v_start_date)
      q.append('v_end_date', params.v_end_date)

      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/mes/get-costing-view?${q.toString()}`, {
        headers: { 'Authorization': `Bearer ${accessToken.value}` }
      })
      bomCostingList.value = res.data || []
      return res
    } catch (err) {
      console.error('Error fetchCostingView:', err)
      return { success: false, data: [] }
    } finally {
      isLoadingCosting.value = false
    }
  }

  const saveProductionOrder = async (payload: any) => {
    try {
      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/master-bom/save-production-order-rolla`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken.value}` },
        body: payload
      })
      return { success: true, data: res.data }
    } catch (err) {
      console.error('Error saveProductionOrder:', err)
      return { success: false }
    }
  }

  // Helpers
  const fetchUomKonversi = async (v_id_produk: number, v_id_prod: number) => {
    try {
      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/master-bom/get-uom-konversi-bom?v_id_produk=${v_id_produk}&v_id_prod=${v_id_prod}`, {
        headers: { 'Authorization': `Bearer ${accessToken.value}` }
      })
      return res.data || []
    } catch (err) {
      console.error('Error fetchUomKonversi:', err)
      return []
    }
  }

  const fetchCategoryBom = async () => {
    try {
      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/master-bom/get-kategory-produk`, {
        headers: { 'Authorization': `Bearer ${accessToken.value}` }
      })
      categoryBomList.value = res.data || []
      return res.data || []
    } catch (err) {
      console.error('Error fetchCategoryBom:', err)
      return []
    }
  }

  return {
    isLoadingHeader,
    isLoadingDetail,
    isLoadingCosting,
    bomHeaderList,
    totalBomHeader,
    bomDetailList,
    totalBomDetail,
    bomCostingList,
    comboMaterialList,
    uomKonversiList,
    categoryBomList,

    fetchBomHeader,
    actionBomHeader,

    fetchBomDetail,
    saveBomDetail,
    actionBomDetail,
    fetchComboMaterial,

    fetchCostingView,
    saveProductionOrder,

    fetchUomKonversi,
    fetchCategoryBom
  }
}
