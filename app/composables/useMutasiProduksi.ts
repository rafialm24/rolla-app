import { ref } from 'vue'
import { useAuth } from './useAuth'
import { useProduksi } from './useProduksi'
import { useRuntimeConfig } from '#app'

export const useMutasiProduksi = () => {
  const config = useRuntimeConfig()
  const { accessToken } = useAuth()
  const { activeProdId } = useProduksi()

  const exportDetails = ref<any[]>([])
  const loadingDetails = ref<any[]>([])
  const totalExport = ref(0)

  const isLoadingExport = ref(false)
  const isLoadingLoading = ref(false)
  const isSaving = ref(false)

  // Fetch Export Details (List of items available for mutasi)
  const fetchExportDetails = async (keyword = '', page = 1, rows = 100) => {
    isLoadingExport.value = true
    try {
      const q = new URLSearchParams()
      if (keyword) q.append('filterRules', JSON.stringify([{ field: 'name_produk', value: keyword }]))
      q.append('page', page.toString())
      q.append('rows', rows.toString())
      q.append('v_id_prod', String(activeProdId.value || 0))

      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/real-time-order-produksi/get-realtime-export-detail-prod?${q.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      const data = res.rows || []
      if (data.length > 0 && data[0].rows) {
        exportDetails.value = data[0].rows
        totalExport.value = parseInt(data[0].total) || 0
      } else {
        exportDetails.value = data
        totalExport.value = parseInt(res.total) || 0
      }
      return res
    } catch (err: any) {
      console.error('Error fetchExportDetails:', err)
      return { success: false, data: [] }
    } finally {
      isLoadingExport.value = false
    }
  }

  // Fetch Loading Details (Items currently in mutasi loading list)
  const fetchLoadingExportDetails = async () => {
    isLoadingLoading.value = true
    try {
      const q = new URLSearchParams()
      q.append('v_id_prod', String(activeProdId.value || 0))

      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/real-time-order-produksi/get-realtime-loading-detail-export?${q.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      loadingDetails.value = res.data || []
      return res
    } catch (err: any) {
      console.error('Error fetchLoadingExportDetails:', err)
      return { success: false, data: [] }
    } finally {
      isLoadingLoading.value = false
    }
  }

  // Save Loading Item (Add item to mutasi loading list)
  const saveLoadingItemMutasi = async (items: Array<{ id_item: number, qtyset: number }>) => {
    isSaving.value = true
    try {
      const promises = items.map(item => {
        return $fetch(`${config.public.apiBase || ''}/produksi/real-time-order-produksi/set-loading-item-mutasi-prod`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken.value}` },
          body: {
            v_qtyset: item.qtyset.toString(),
            v_id_prod: activeProdId.value || 0,
            v_id_item: item.id_item
          }
        })
      })

      await Promise.all(promises)
      return { success: true }
    } catch (err: any) {
      console.error('Error saveLoadingItemMutasi:', err)
      return { success: false, message: err.message }
    } finally {
      isSaving.value = false
    }
  }

  // Posting Mutasi (Finalize mutasi loading list)
  const postLoadingMutasi = async (storeId: number, mutasiDate: string) => {
    isSaving.value = true
    try {
      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/real-time-order-produksi/posting-loading-mutasi-prod`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken.value}` },
        body: {
          v_prod_id: activeProdId.value || 0,
          v_mutasi_date: mutasiDate,
          v_id_store: storeId
        }
      })
      return { success: true, data: res.data }
    } catch (err: any) {
      console.error('Error postLoadingMutasi:', err)
      return { success: false, message: err.message }
    } finally {
      isSaving.value = false
    }
  }

  // Delete Loading Item Mutasi
  // v_action = 1 → hapus item tertentu by ID
  // v_action = 2 → hapus semua item draft (belum diposting)
  const deleteLoadingItemMutasi = async (v_id: number, v_action: 1 | 2) => {
    isSaving.value = true
    try {
      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/mutasi/delete-loading-item`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken.value}` },
        body: {
          v_id,
          v_id_prod: activeProdId.value || 0,
          v_action
        }
      })
      const status = res?.data?.status ?? 0
      return { success: status === 1, data: res?.data }
    } catch (err: any) {
      console.error('Error deleteLoadingItemMutasi:', err)
      return { success: false, message: err.message }
    } finally {
      isSaving.value = false
    }
  }

  return {
    exportDetails,
    loadingDetails,
    totalExport,
    isLoadingExport,
    isLoadingLoading,
    isSaving,
    fetchExportDetails,
    fetchLoadingExportDetails,
    saveLoadingItemMutasi,
    postLoadingMutasi,
    deleteLoadingItemMutasi
  }
}
