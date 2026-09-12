import { ref } from 'vue'
import { useAuth } from './useAuth'
import { useProduksi } from './useProduksi'

export const useProdInv = () => {
  const config = useRuntimeConfig()
  const { accessToken, logout } = useAuth()
  const { activeProdId } = useProduksi()

  // State
  const premixList = ref<any[]>([])
  const totalPremix = ref(0)
  const costingList = ref<any[]>([])
  const totalCosting = ref(0)
  
  // Loaders
  const isLoadingPremix = ref(false)
  const isLoadingCosting = ref(false)
  const isSaving = ref(false)

  // 1. Fetch SPK Detail List Non Premix
  const fetchPremixList = async (spkDate: string, keyword = '', page = 1, rows = 100) => {
    isLoadingPremix.value = true
    try {
      const q = new URLSearchParams()
      if (keyword) q.append('var_where', keyword)
      q.append('var_page_number', page.toString())
      q.append('var_row_page', rows.toString())
      q.append('v_tanggal', spkDate)
      q.append('v_prod_id', String(activeProdId.value || 0))

      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/mes/spk-detail-list-non-premix?${q.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      let data = res.rows || res.data || res || []
      premixList.value = Array.isArray(data) && data.length > 0 && data[0].rows ? data[0].rows : data
      if (res.total !== undefined) {
        totalPremix.value = Number(res.total)
      } else if (premixList.value.length > 0 && typeof premixList.value[0].total_row !== 'undefined') {
        totalPremix.value = Number(premixList.value[0].total_row)
      } else if (premixList.value.length > 0 && typeof premixList.value[0].total_rows !== 'undefined') {
        totalPremix.value = Number(premixList.value[0].total_rows)
      } else if (premixList.value.length > 0 && typeof premixList.value[0].total !== 'undefined') {
        totalPremix.value = Number(premixList.value[0].total)
      } else {
        // Fallback: If we got exactly 'rows' items, assume there's at least one more page
        if (premixList.value.length === rows) {
          totalPremix.value = page * rows + 1 
        } else {
          totalPremix.value = (page - 1) * rows + premixList.value.length
        }
      }
    } catch (err: any) {
      console.error('Error fetchPremixList:', err)
      if (err.response?.status === 401) logout()
    } finally {
      isLoadingPremix.value = false
    }
  }

  // 2. Fetch Costing View SPK
  const fetchCostingList = async (idSpk: number, qtyOrder: number, formula: number = 1) => {
    isLoadingCosting.value = true
    try {
      const q = new URLSearchParams()
      q.append('v_id_spk', idSpk.toString())
      q.append('v_formula', formula.toString())
      q.append('v_qty_order', qtyOrder.toString())
      q.append('v_id_prod', String(activeProdId.value || 0))

      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/mes/get-costing-view-spk?${q.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      let data = res.rows || res.data || res || []
      costingList.value = Array.isArray(data) && data.length > 0 && data[0].rows ? data[0].rows : data
      if (res.total) {
        totalCosting.value = Number(res.total)
      } else {
        totalCosting.value = costingList.value.length
      }
    } catch (err: any) {
      console.error('Error fetchCostingList:', err)
      if (err.response?.status === 401) logout()
    } finally {
      isLoadingCosting.value = false
    }
  }

  // 3. Set Premix (Save Production Order)
  const setPremixOrder = async (payload: { v_id_bom: number, v_qty_order: string, v_start_date: string, v_end_date: string, v_spk_id: number, v_formula?: number }) => {
    isSaving.value = true
    try {
      const body = {
        v_id_prod: activeProdId.value || 0,
        v_formula: 1, // Default from MVC
        ...payload
      }
      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/save-production-order`, {
        method: 'POST',
        body,
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      return { success: true, data: res.data }
    } catch (err) {
      console.error('Error setPremixOrder:', err)
      return { success: false }
    } finally {
      isSaving.value = false
    }
  }

  // 4. Transfer All (Save Action SPK Inventory TF All)
  const transferAll = async (idSpk: number, idSet: number, qtySet: number) => {
    isSaving.value = true
    try {
      const body = {
        v_id_spk: idSpk,
        v_id_set: idSet,
        v_qty_set: qtySet,
        v_id_prod: activeProdId.value || 0
      }
      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/mes/save-action-spk-inventory-tf-all`, {
        method: 'POST',
        body,
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      return { success: true, data: res.data }
    } catch (err) {
      console.error('Error transferAll:', err)
      return { success: false }
    } finally {
      isSaving.value = false
    }
  }

  // 5. Transfer / Return Action (Save Action SPK Inventory)
  const setActionInventory = async (idSpk: number, idProduk: number, qtyOrder: number, idSet: number) => {
    isSaving.value = true
    try {
      const body = {
        v_id_spk: idSpk,
        v_id_produk: idProduk,
        v_qty_order: qtyOrder,
        v_id_set: idSet,
        v_id_prod: activeProdId.value || 0
      }
      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/mes/save-action-spk-inventory`, {
        method: 'POST',
        body,
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      return { success: true, data: res.data }
    } catch (err) {
      console.error('Error setActionInventory:', err)
      return { success: false }
    } finally {
      isSaving.value = false
    }
  }

  // 6. Order Produksi To DC
  const orderToDc = async (spkDate: string) => {
    isSaving.value = true
    try {
      const body = {
        v_date: spkDate,
        v_prod_id: activeProdId.value || 0
      }
      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/mes/order-produksi-to-dc`, {
        method: 'POST',
        body,
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      return { success: true, data: res.data }
    } catch (err) {
      console.error('Error orderToDc:', err)
      return { success: false }
    } finally {
      isSaving.value = false
    }
  }

  // 7. Print Laporan
  const fetchPrintData = async (idType: number, spkDate: string) => {
    try {
      const q = new URLSearchParams()
      q.append('v_id', idType.toString())
      q.append('v_date', spkDate)
      q.append('v_prod_id', String(activeProdId.value || 0))

      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/mes/print-mes-inv-produksi?${q.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      let data = res.rows || res.data || res || []
      return Array.isArray(data) && data.length > 0 && data[0].rows ? data[0].rows : data
    } catch (err) {
      console.error('Error fetchPrintData:', err)
      return []
    }
  }

  return {
    premixList, totalPremix, costingList, totalCosting,
    isLoadingPremix, isLoadingCosting, isSaving,
    fetchPremixList, fetchCostingList, setPremixOrder, transferAll, setActionInventory, orderToDc, fetchPrintData
  }
}
