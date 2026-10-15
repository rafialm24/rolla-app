import { ref } from 'vue'
import { useAuth } from './useAuth'
import { useProduksi } from './useProduksi'

export const useStockOpnameProd = () => {
  const config = useRuntimeConfig()
  const { accessToken, logout } = useAuth()
  const { activeAppId, activeLocationId } = useProduksi()

  const listData = ref<any[]>([])
  const totalRows = ref(0)
  const isLoading = ref(false)
  const isSaving = ref(false)
  const rollaListData = ref<any[]>([])
  const rollaTotalRows = ref(0)
  const isRollaLoading = ref(false)

  const getPaginationTotal = (res: any, dataList: any[], page: number, rows: number) => {
    if (res.total !== undefined) return Number(res.total)
    if (dataList.length > 0 && typeof dataList[0].total_row !== 'undefined') return Number(dataList[0].total_row)
    if (dataList.length > 0 && typeof dataList[0].total_rows !== 'undefined') return Number(dataList[0].total_rows)
    if (dataList.length > 0 && typeof dataList[0].total !== 'undefined') return Number(dataList[0].total)
    if (dataList.length === rows) return page * rows + 1
    return (page - 1) * rows + dataList.length
  }

  const fetchStockOpname = async (keyword = '', page = 1, rows = 10) => {
    isLoading.value = true
    try {
      const q = new URLSearchParams()
      if (keyword) q.append('var_where', keyword)
      q.append('var_page_number', page.toString())
      q.append('var_row_page', rows.toString())
      q.append('v_aplikasi_id', String(activeAppId.value || 0))
      q.append('v_lokasi', String(activeLocationId.value || 0))

      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/stock-opname/list?${q.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      
      let data = res.rows || res.data || res || []
      listData.value = Array.isArray(data) && data.length > 0 && data[0].rows ? data[0].rows : data
      totalRows.value = getPaginationTotal(res, listData.value, page, rows)
    } catch (err: any) {
      console.error('Error fetchStockOpname:', err)
      if (err.response?.status === 401) logout()
    } finally {
      isLoading.value = false
    }
  }

  const revisiRowSo = async (id: number) => {
    isSaving.value = true
    try {
      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/stock-opname/revisi`, {
        method: 'POST',
        body: { v_id: id },
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      return { success: true, data: res.data }
    } catch (err) {
      console.error('Error revisiRowSo:', err)
      return { success: false }
    } finally {
      isSaving.value = false
    }
  }

  const postingApprove = async () => {
    isSaving.value = true
    try {
      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/stock-opname/approve`, {
        method: 'POST',
        body: { 
          v_aplikasi_id: activeAppId.value || 0,
          v_lokasi: activeLocationId.value || 0
        },
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      return { success: true, data: res.data }
    } catch (err) {
      console.error('Error postingApprove:', err)
      return { success: false }
    } finally {
      isSaving.value = false
    }
  }

  const fetchStockOpnameRolla = async (keyword = '', page = 1, rows = 10) => {
    isRollaLoading.value = true
    try {
      const q = new URLSearchParams()
      if (keyword) q.append('var_where', keyword)
      q.append('var_page_number', page.toString())
      q.append('var_row_page', rows.toString())
      q.append('v_aplikasi_id', String(activeAppId.value || 0))
      q.append('v_lokasi', String(activeLocationId.value || 0))

      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/stock-opname/datalist-rolla-dc?${q.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })

      const data = res.data || res.rows || res || []
      rollaListData.value = Array.isArray(data) && data.length > 0 && data[0].rows ? data[0].rows : data
      rollaTotalRows.value = getPaginationTotal(res, rollaListData.value, page, rows)
    } catch (err: any) {
      console.error('Error fetchStockOpnameRolla:', err)
      if (err.response?.status === 401) logout()
    } finally {
      isRollaLoading.value = false
    }
  }

  const revisiRowSoRolla = async (id: number) => {
    isSaving.value = true
    try {
      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/stock-opname/revisi-rolla-dc`, {
        method: 'POST',
        body: { v_id: id },
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      return { success: true, data: res.data }
    } catch (err) {
      console.error('Error revisiRowSoRolla:', err)
      return { success: false }
    } finally {
      isSaving.value = false
    }
  }

  const postingApproveRolla = async () => {
    isSaving.value = true
    try {
      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/stock-opname/posting-approve-rolla-dc`, {
        method: 'POST',
        body: {
          v_aplikasi_id: activeAppId.value || 0,
          v_lokasi: activeLocationId.value || 0
        },
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      return { success: true, data: res.data }
    } catch (err) {
      console.error('Error postingApproveRolla:', err)
      return { success: false }
    } finally {
      isSaving.value = false
    }
  }
  const fetchListRolla = async (keyword = '', page = 1, rows = 10) => {
    isLoading.value = true
    try {
      const q = new URLSearchParams()
      if (keyword) q.append('var_where', keyword)
      q.append('var_page_number', page.toString())
      q.append('var_row_page', rows.toString())
      q.append('v_aplikasi_id', String(activeAppId.value || 0))
      q.append('v_lokasi', String(activeLocationId.value || 0))

      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/set-stock-opname/list-rolla?${q.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      
      let data = res.rows || res.data || res || []
      listData.value = Array.isArray(data) && data.length > 0 && data[0].rows ? data[0].rows : data
      totalRows.value = getPaginationTotal(res, listData.value, page, rows)
    } catch (err: any) {
      console.error('Error fetchListRolla:', err)
      if (err.response?.status === 401) logout()
    } finally {
      isLoading.value = false
    }
  }

  const postingRollaDc = async () => {
    isSaving.value = true
    try {
      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/set-stock-opname/posting-rolla-dc`, {
        method: 'POST',
        body: { 
          v_aplikasi_id: activeAppId.value || 0,
          v_lokasi: activeLocationId.value || 0
        },
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      return { success: true, data: res.data }
    } catch (err) {
      console.error('Error postingRollaDc:', err)
      return { success: false }
    } finally {
      isSaving.value = false
    }
  }

  return {
    listData,
    totalRows,
    isLoading,
    isSaving,
    rollaListData,
    rollaTotalRows,
    isRollaLoading,
    fetchStockOpname,
    revisiRowSo,
    postingApprove,
    fetchStockOpnameRolla,
    revisiRowSoRolla,
    postingApproveRolla,
    fetchListRolla,
    postingRollaDc
  }
}
