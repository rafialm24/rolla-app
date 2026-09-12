import { ref } from 'vue'
import { useApiFetch } from './useApiFetch'

export const useMesProduction = () => {
  
  const isLoadingList = ref(false)
  const mesProductionList = ref<any[]>([])
  
  // Equivalent to `GetlistProdOrderHeaderProduction`
  const fetchMesProductionList = async (params: { v_start_date: string, v_id_prod: number, page: number, rows: number, typeId: number }) => {
    isLoadingList.value = true
    try {
      const q = new URLSearchParams()
      q.append('var_where', '')
      q.append('var_page_number', params.page.toString())
      q.append('var_row_page', params.rows.toString())
      q.append('type_id', params.typeId.toString())
      q.append('v_start_date', params.v_start_date)
      q.append('v_id_prod', params.v_id_prod.toString())

      const res: any = await useApiFetch(`/produksi/mes/production-order-list-spk?${q.toString()}`)
      
      mesProductionList.value = res.data || []
      return res
    } catch (err) {
      console.error('Error fetchMesProductionList:', err)
      mesProductionList.value = []
      return { success: false, data: [] }
    } finally {
      isLoadingList.value = false
    }
  }

  // Action Start / Progres Finish / Complete
  const actionProduksiCoba = async (payload: { v_id: number, v_status: number, v_qty_defect: number, v_qty_other: number, v_qty_remain: number, v_qty_good: number, v_id_prod: number }) => {
    try {
      const res: any = await useApiFetch(`/produksi/mes/action-produksi-spk-coba`, {
        method: 'POST',
        body: payload
      })
      return res
    } catch (err) {
      console.error('Error actionProduksiCoba:', err)
      return { success: false }
    }
  }

  // Action Pending
  const actionProduksiPending = async (payload: { v_id: number, v_status: number, v_qty_defect: number, v_qty_other: number, v_qty_remain: number, v_qty_good: number, v_id_prod: number }) => {
    try {
      const res: any = await useApiFetch(`/produksi/mes/action-produksi-pending`, {
        method: 'POST',
        body: payload
      })
      return res
    } catch (err) {
      console.error('Error actionProduksiPending:', err)
      return { success: false }
    }
  }

  return {
    isLoadingList,
    mesProductionList,
    fetchMesProductionList,
    actionProduksiCoba,
    actionProduksiPending
  }
}
