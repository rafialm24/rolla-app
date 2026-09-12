import { ref } from 'vue'
import { useRuntimeConfig } from '#app'
import { useAuth } from './useAuth'

export const useProductionOrder = () => {
  const config = useRuntimeConfig()
  const { accessToken } = useAuth()

  // State
  const productionOrderList = ref<any[]>([])
  const totalProductionOrder = ref(0)
  const productionOrderDetailList = ref<any[]>([])
  const totalProductionOrderDetail = ref(0)

  const isLoadingMaster = ref(false)
  const isLoadingDetail = ref(false)
  const isSaving = ref(false)

  // Fetch Master List
  const fetchProductionOrderList = async (startDate: string, typeId: number, page: number, rows: number, activeProdId: number) => {
    isLoadingMaster.value = true
    try {
      const q = new URLSearchParams()
      q.append('var_where', '')
      q.append('var_page_number', page.toString())
      q.append('var_row_page', rows.toString())
      q.append('type_id', typeId.toString())
      q.append('v_start_date', startDate)
      q.append('v_id_prod', activeProdId.toString())

      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/mes/production-order-list?${q.toString()}`, {
        headers: {
          'Authorization': `Bearer ${accessToken.value}`
        }
      })
      
      productionOrderList.value = res.data || []
      totalProductionOrder.value = parseInt(res.total || res.data?.length || '0')
      return res
    } catch (err) {
      console.error('Error fetchProductionOrderList:', err)
      productionOrderList.value = []
      totalProductionOrder.value = 0
      return { success: false }
    } finally {
      isLoadingMaster.value = false
    }
  }

  // Fetch Detail List
  const fetchProductionOrderDetail = async (idHeader: number, page: number, rows: number) => {
    isLoadingDetail.value = true
    try {
      const q = new URLSearchParams()
      q.append('v_id_header', idHeader.toString())
      q.append('var_page_number', page.toString())
      q.append('var_row_page', rows.toString())

      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/mes/production-order-list-detail?${q.toString()}`, {
        headers: {
          'Authorization': `Bearer ${accessToken.value}`
        }
      })
      
      productionOrderDetailList.value = res.data || []
      totalProductionOrderDetail.value = parseInt(res.total || res.data?.length || '0')
      return res
    } catch (err) {
      console.error('Error fetchProductionOrderDetail:', err)
      productionOrderDetailList.value = []
      totalProductionOrderDetail.value = 0
      return { success: false }
    } finally {
      isLoadingDetail.value = false
    }
  }

  // Action Start/Progress Produksi
  const actionProduksiArtikel = async (payload: { id: number, status: number, qty_defect: number, qty_other: number, qty_remain: number, id_prod: number }) => {
    isSaving.value = true
    try {
      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/mes/action-produksi-artikel-rolla`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken.value}`
        },
        body: {
          v_id: payload.id,
          v_status: payload.status,
          v_qty_defect: payload.qty_defect,
          v_qty_other: payload.qty_other,
          v_qty_remain: payload.qty_remain,
          v_id_prod: payload.id_prod
        }
      })
      return { success: true, data: res }
    } catch (err) {
      console.error('Error actionProduksiArtikel:', err)
      return { success: false }
    } finally {
      isSaving.value = false
    }
  }

  // Print endpoints (placeholders for now, normally they return data or a URL)
  const fetchPrintData = async (idPo: number) => {
    try {
      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/mes/print-prodorder?v_id_po=${idPo}`, {
        headers: {
          'Authorization': `Bearer ${accessToken.value}`
        }
      })
      return res.data || []
    } catch (err) {
      console.error('Error fetchPrintData:', err)
      return []
    }
  }

  const fetchPrintMaterialData = async (tanggal: string, activeProdId: number) => {
    try {
      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/mes/print-prodorder-material-total?v_tanggal=${tanggal}&v_id_prod=${activeProdId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken.value}`
        }
      })
      return res.data || []
    } catch (err) {
      console.error('Error fetchPrintMaterialData:', err)
      return []
    }
  }

  return {
    productionOrderList,
    totalProductionOrder,
    productionOrderDetailList,
    totalProductionOrderDetail,
    isLoadingMaster,
    isLoadingDetail,
    isSaving,
    
    fetchProductionOrderList,
    fetchProductionOrderDetail,
    actionProduksiArtikel,
    fetchPrintData,
    fetchPrintMaterialData
  }
}
