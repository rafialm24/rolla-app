import { ref, computed } from 'vue'
import { useAuth } from './useAuth'
import { useProduksi } from './useProduksi'
import { useRuntimeConfig } from '#app'

export const useRealTimeOrder = () => {
  const config = useRuntimeConfig()
  const { accessToken } = useAuth()
  const { activeProdId } = useProduksi()

  const headerList = ref<any[]>([])
  const orderDetails = ref<any[]>([])
  const loadingDetails = ref<any[]>([])
  const sjNumList = ref<any[]>([])

  const totalHeader = ref(0)
  const totalOrder = ref(0)

  const isLoadingHeader = ref(false)
  const isLoadingOrder = ref(false)
  const isLoadingLoading = ref(false)
  const isSaving = ref(false)

  // Master: Fetch Header List (List of Stores)
  const fetchHeaderList = async (keyword = '', page = 1, rows = 100) => {
    isLoadingHeader.value = true
    try {
      const q = new URLSearchParams()
      if (keyword) q.append('filterRules', JSON.stringify([{ field: 'name_store', value: keyword }]))
      q.append('page', page.toString())
      q.append('rows', rows.toString())
      q.append('v_prod_cate', '1') // Defaulting to 1, adjust if dynamic

      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/real-time-order-produksi/get-realtime-order-header-produksi?${q.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      const data = res.rows || []
      if (data.length > 0 && data[0].rows) {
        headerList.value = data[0].rows
        totalHeader.value = parseInt(data[0].total) || 0
      } else {
        headerList.value = data
        totalHeader.value = parseInt(res.total) || 0
      }
      return res
    } catch (err: any) {
      console.error('Error fetchHeaderList:', err)
      return { success: false, data: [] }
    } finally {
      isLoadingHeader.value = false
    }
  }

  // Detail: Fetch Order Details (Data Stock)
  const fetchOrderDetails = async (storeId: number, keyword = '', page = 1, rows = 100) => {
    if (!keyword) {
      orderDetails.value = []
      totalOrder.value = 0
      return { success: true, data: [] }
    }
    isLoadingOrder.value = true
    try {
      const q = new URLSearchParams()
      if (keyword) q.append('filterRules', JSON.stringify([{ field: 'name_produk', value: keyword }]))
      q.append('page', page.toString())
      q.append('rows', rows.toString())
      q.append('v_id_store', storeId.toString())
      q.append('v_prod_id', String(activeProdId.value || 0))

      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/real-time-order-produksi/get-realtime-order-detail-prod-new2?${q.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      const data = res.rows || []
      if (data.length > 0 && data[0].rows) {
        orderDetails.value = data[0].rows
        totalOrder.value = parseInt(data[0].total) || 0
      } else {
        orderDetails.value = data
        totalOrder.value = parseInt(res.total) || 0
      }
      return res
    } catch (err: any) {
      console.error('Error fetchOrderDetails:', err)
      return { success: false, data: [] }
    } finally {
      isLoadingOrder.value = false
    }
  }

  // Detail: Fetch Loading Details (Already loaded items)
  const fetchLoadingDetails = async (storeId: number) => {
    isLoadingLoading.value = true
    try {
      const q = new URLSearchParams()
      q.append('v_id_store', storeId.toString())
      q.append('v_id_prod', String(activeProdId.value || 0))

      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/real-time-order-produksi/get-realtime-loading-detail-produksi?${q.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      loadingDetails.value = res.data || []
      return res
    } catch (err: any) {
      console.error('Error fetchLoadingDetails:', err)
      return { success: false, data: [] }
    } finally {
      isLoadingLoading.value = false
    }
  }

  // Detail: Fetch Surat Jalan Numbers
  const fetchSjNumList = async (storeId: number) => {
    try {
      const q = new URLSearchParams()
      q.append('v_id_store', String(storeId || 0))
      q.append('v_prod_id', String(activeProdId.value || 0))

      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/real-time-order-produksi/combo-produksi-sj-num?${q.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      sjNumList.value = res.data || []
      return res
    } catch (err: any) {
      console.error('Error fetchSjNumList:', err)
      return { success: false, data: [] }
    }
  }

  // Detail: Save Loading Items (Batch via Promise.all)
  const saveLoadingItems = async (storeId: number, items: Array<{ id_item: number, qtyset: number, price_set: number }>) => {
    isSaving.value = true
    try {
      const promises = items.map(item => {
        return $fetch(`${config.public.apiBase || ''}/produksi/real-time-order-produksi/set-loading-item-produksi`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken.value}` },
          body: {
            v_id: storeId,
            v_qtyset: item.qtyset.toString(),
            v_price_set: item.price_set.toString(),
            v_id_prod: activeProdId.value || 0,
            v_to: 2,
            v_id_item: item.id_item,
            v_id_so: 0
          }
        })
      })

      await Promise.all(promises)
      return { success: true }
    } catch (err: any) {
      console.error('Error saveLoadingItems:', err)
      return { success: false, message: err.message }
    } finally {
      isSaving.value = false
    }
  }

  // Detail: Delete Loading Item
  const deleteLoadingItem = async (storeId: number, id: number, action: number) => {
    try {
      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/real-time-order-produksi/delete-loading-item-produksi`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken.value}` },
        body: {
          v_id: id,
          v_prod_id: activeProdId.value || 0,
          v_id_store: storeId,
          v_action: action
        }
      })
      return { success: true, data: res.data }
    } catch (err: any) {
      console.error('Error deleteLoadingItem:', err)
      return { success: false, message: err.message }
    }
  }

  // Detail: Post Loading
  const postLoading = async (storeId: number, deliveryDate: string) => {
    isSaving.value = true
    try {
      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/real-time-order-produksi/posting-loading-produksi`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken.value}` },
        body: {
          v_prod_id: activeProdId.value || 0,
          v_delivery_date: deliveryDate,
          v_id_store: storeId
        }
      })
      return { success: true, data: res.data }
    } catch (err: any) {
      console.error('Error postLoading:', err)
      return { success: false, message: err.message }
    } finally {
      isSaving.value = false
    }
  }

  // Detail: Print SJ
  const printSuratJalan = async (storeId: number, sjNum: string) => {
    try {
      const q = new URLSearchParams()
      q.append('v_sj_num', sjNum)
      q.append('v_prod_id', String(activeProdId.value || 0))
      q.append('v_id_store', storeId.toString())

      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/real-time-order-produksi/posting-print-sj-produksi?${q.toString()}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      return { success: true, data: res.data }
    } catch (err: any) {
      console.error('Error printSuratJalan:', err)
      return { success: false, message: err.message }
    }
  }

  return {
    headerList,
    orderDetails,
    loadingDetails,
    sjNumList,
    totalHeader,
    totalOrder,
    isLoadingHeader,
    isLoadingOrder,
    isLoadingLoading,
    isSaving,
    fetchHeaderList,
    fetchOrderDetails,
    fetchLoadingDetails,
    fetchSjNumList,
    saveLoadingItems,
    deleteLoadingItem,
    postLoading,
    printSuratJalan
  }
}
