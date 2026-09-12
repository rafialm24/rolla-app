import { ref } from 'vue'
import { useAuth } from './useAuth'
import { useProduksi } from './useProduksi'

export const useFormLoadingProduksi = () => {
  const config = useRuntimeConfig()
  const { accessToken, logout } = useAuth()
  const { activeProdId } = useProduksi()

  // State
  const kategoriOptions = ref<any[]>([])
  const storeOptions = ref<any[]>([])
  const gridHeaders = ref<any[]>([])
  const gridData = ref<any[]>([])
  
  // Loaders
  const isLoading = ref(false)
  const isSaving = ref(false)

  // 1. Fetch Kategori Options
  const fetchComboKategori = async () => {
    try {
      // Using the master-bom/get-kategory-produk which is equivalent to GetKategoryProduk
      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/master-bom/get-kategory-produk`, {
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      let data = res.rows || res.data || res || []
      kategoriOptions.value = Array.isArray(data) && data.length > 0 && data[0].rows ? data[0].rows : data
    } catch (err: any) {
      console.error('Error fetchComboKategori:', err)
      if (err.response?.status === 401) logout()
    }
  }

  // 2. Fetch Store Options
  const fetchComboStore = async (keyword = '', page = 1, rows = 100) => {
    try {
      const q = new URLSearchParams()
      if (keyword) q.append('var_where', keyword)
      q.append('var_page_number', page.toString())
      q.append('var_row_page', rows.toString())
      q.append('v_id_prod', String(activeProdId.value || 0))

      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/combo-area-prod-store?${q.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      let data = res.rows || res.data || res || []
      let list = Array.isArray(data) && data.length > 0 && data[0].rows ? data[0].rows : data
      storeOptions.value = list.map((item: any) => ({
        ...item,
        display_name: item.name || item.name_store || item.store_name || item.kode || `Store ${item.id || '?'}`
      }))
    } catch (err: any) {
      console.error('Error fetchComboStore:', err)
    }
  }

  // 3. Fetch Data Grid Headers (Dynamic Stores)
  const fetchGridHeaders = async (kategoriIds: string, tokoIds: string) => {
    try {
      const q = new URLSearchParams()
      q.append('v_kategory', kategoriIds || '-2')
      q.append('v_toko', tokoIds || '-1')
      q.append('v_id_prod', String(activeProdId.value || 0))

      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/heder-po-multi-prod?${q.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      let data = res.rows || res.data || res || []
      gridHeaders.value = Array.isArray(data) && data.length > 0 && data[0].rows ? data[0].rows : data
    } catch (err: any) {
      console.error('Error fetchGridHeaders:', err)
    }
  }

  // 4. Fetch Data Grid List
  const fetchGridData = async (kategoriIds: string, tokoIds: string, qtyType: string) => {
    isLoading.value = true
    try {
      const body = {
        cursor_name: 'ref_list_po',
        v_kategory: kategoriIds || '-2',
        v_toko: tokoIds || '-1',
        v_set_qty: Number(qtyType) || -3,
        v_id_prod: activeProdId.value || 0,
        v_aplikasiid: 1 // default app ID if needed
      }

      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/list-po-toko-prod-new3`, {
        method: 'POST',
        body,
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      let data = res.rows || res.data || res || []
      // The API might return an array of objects directly, but we check if it is wrapped in rows.
      // Additionally, legacy code does: if (row.StoreData) unfold it. We will handle StoreData just in case.
      let list = Array.isArray(data) && data.length > 0 && data[0].rows ? data[0].rows : data
      
      const excludeKeys = ['category', 'id', 'ket_qty', 'kode_product', 'name', 'name_prod_uom', 'TotalOrder', 'Totalpo', 'Totalsale', 'StoreData']
      
      gridData.value = list.map((row: any) => {
        let storeDataParsed = {}
        if (row.StoreData) {
          try {
            storeDataParsed = typeof row.StoreData === 'string' ? JSON.parse(row.StoreData) : row.StoreData
          } catch (e) {
            console.error('Error parsing StoreData:', e)
          }
        }
        
        let Totalpo = 0;
        let Totalsale = 0;
        
        const mergedRow = { ...row, ...storeDataParsed };
        
        // Calculate Totalpo and Totalsale from dynamic columns
        Object.keys(mergedRow).forEach(key => {
          if (!excludeKeys.includes(key)) {
            const val = mergedRow[key];
            if (val) {
              const parts = String(val).split(';');
              if (parts.length === 2) {
                Totalpo += parseFloat(parts[0].trim()) || 0;
                Totalsale += parseFloat(parts[1].trim()) || 0;
              }
            }
          }
        });

        return {
          ...mergedRow,
          Totalpo,
          Totalsale,
          TotalOrder: row.TotalOrder || 0 // Initial value for the input field
        }
      })
      
      // ALWAYS extract dynamic columns from the data itself.
      // This ensures 100% accuracy with the data returned.
      if (gridData.value.length > 0) {
        const firstRow = gridData.value[0]
        const dynamicKeys = Object.keys(firstRow).filter(k => !excludeKeys.includes(k))
        
        if (dynamicKeys.length > 0) {
          gridHeaders.value = dynamicKeys // Array of strings e.g. ["LB00015"]
        } else {
          gridHeaders.value = []
        }
      } else {
        gridHeaders.value = []
      }
    } catch (err: any) {
      console.error('Error fetchGridData:', err)
      if (err.response?.status === 401) logout()
    } finally {
      isLoading.value = false
    }
  }

  // 5. Save Produksi Order (Create SPK sequentially for each item)
  const saveProduksiOrder = async (itemsToSave: any[], spkDate: string) => {
    isSaving.value = true
    let successCount = 0
    let failCount = 0

    try {
      for (const item of itemsToSave) {
        const body = {
          v_id_prod: activeProdId.value || 0,
          v_id_item: item.id_item || item.id,
          v_qtyset: item.qtyset.toString(),
          v_spk_date: spkDate,
          v_row: 1
        }
        
        try {
          await $fetch(`${config.public.apiBase || ''}/produksi/set-spk`, {
            method: 'POST',
            body,
            headers: { Authorization: `Bearer ${accessToken.value}` }
          })
          successCount++
        } catch (err) {
          console.error(`Error saving item ${item.id_item}:`, err)
          failCount++
        }
      }
      return { success: failCount === 0, successCount, failCount }
    } finally {
      isSaving.value = false
    }
  }

  return {
    kategoriOptions, storeOptions, gridHeaders, gridData, isLoading, isSaving,
    fetchComboKategori, fetchComboStore, fetchGridHeaders, fetchGridData, saveProduksiOrder
  }
}
