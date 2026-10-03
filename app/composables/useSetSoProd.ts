import { ref } from 'vue'
import { useApiFetch } from './useApiFetch'
import { useProduksi } from './useProduksi'

export const useSetSoProd = () => {
  const { activeProdId } = useProduksi()

  const listData = ref<any[]>([])
  const totalRows = ref(0)
  const isLoading = ref(false)
  const isSaving = ref(false)

  const fetchListAudit = async (keyword: string = '', page: number = 1, perPage: number = 10) => {
    isLoading.value = true
    try {
      const res: any = await useApiFetch('/produksi/set-stock-opname/get-list-audit', {
        params: {
          v_aplikasi_id: 7,
          v_lokasi_id: activeProdId.value || 0,
          v_where: keyword,
          v_page: page,
          v_row_page: perPage
        }
      })
      const data = res.data || res
      if (data && Array.isArray(data)) {
        listData.value = data
        if (data.length > 0) {
          totalRows.value = data[0].total_row || data.length
        } else {
          totalRows.value = 0
        }
      } else {
        listData.value = []
        totalRows.value = 0
      }
      return { success: true, data }
    } catch (err) {
      console.error(err)
      return { success: false }
    } finally {
      isLoading.value = false
    }
  }

  const cekBarcodeItem = async (barcode: string) => {
    try {
      const res: any = await useApiFetch('/produksi/set-stock-opname/barcode-item', {
        params: {
          v_barcode: barcode
        }
      })
      return { success: true, data: res.data || res }
    } catch (err) {
      console.error(err)
      return { success: false }
    }
  }

  const setSo = async (idProduk: string, qtyActual: string, barcode: string) => {
    isSaving.value = true
    try {
      const res: any = await useApiFetch('/produksi/set-stock-opname/set-so-new', {
        method: 'POST',
        body: {
          v_id_produk: idProduk,
          v_qty_actual: qtyActual,
          v_aplikasi_id: 7,
          v_lokasi_id: activeProdId.value || 0,
          v_barcode: barcode
        }
      })
      return { success: true, data: res.data || res }
    } catch (err) {
      console.error(err)
      return { success: false }
    } finally {
      isSaving.value = false
    }
  }

  const deleteRowSo = async (id: number) => {
    isSaving.value = true
    try {
      const res: any = await useApiFetch('/produksi/set-stock-opname/delete-row-so', {
        method: 'POST',
        body: {
          v_id: id
        }
      })
      return { success: true, data: res.data || res }
    } catch (err) {
      console.error(err)
      return { success: false }
    } finally {
      isSaving.value = false
    }
  }

  const postingListSo = async () => {
    isSaving.value = true
    try {
      const res: any = await useApiFetch('/produksi/set-stock-opname/posting-row-so', {
        method: 'POST',
        body: {
          v_aplikasi_id: 2,
          v_lokasi_id: activeProdId.value || 0
        }
      })
      return { success: true, data: res.data || res }
    } catch (err) {
      console.error(err)
      return { success: false }
    } finally {
      isSaving.value = false
    }
  }

  const fetchListRolla = async (keyword: string = '', page: number = 1, perPage: number = 10) => {
    isLoading.value = true
    try {
      const res: any = await useApiFetch('/produksi/set-stock-opname/list-rolla', {
        params: {
          v_aplikasi_id: 7,
          v_lokasi_id: activeProdId.value || 0,
          v_where: keyword,
          v_page: page,
          v_row_page: perPage
        }
      })
      const data = res.data || res
      if (data && Array.isArray(data)) {
        listData.value = data
        if (data.length > 0) {
          totalRows.value = data[0].total_row || data.length
        } else {
          totalRows.value = 0
        }
      } else {
        listData.value = []
        totalRows.value = 0
      }
      return { success: true, data }
    } catch (err) {
      console.error(err)
      return { success: false }
    } finally {
      isLoading.value = false
    }
  }

  const postingRollaDc = async () => {
    isSaving.value = true
    try {
      const res: any = await useApiFetch('/produksi/set-stock-opname/posting-rolla-dc', {
        method: 'POST',
        body: {
          v_aplikasi_id: 2,
          v_lokasi_id: activeProdId.value || 0
        }
      })
      return { success: true, data: res.data || res }
    } catch (err) {
      console.error(err)
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
    fetchListAudit,
    cekBarcodeItem,
    setSo,
    deleteRowSo,
    postingListSo,
    fetchListRolla,
    postingRollaDc
  }
}
