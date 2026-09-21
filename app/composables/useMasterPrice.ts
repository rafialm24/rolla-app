import { ref } from 'vue'
import { useAuth } from './useAuth'
import { useProduksi } from './useProduksi'

interface UpdatePricePayload {
  v_id: number
  v_amount: string | number
  v_active: string | boolean | number
  txtpassword: string
}

export const useMasterPrice = () => {
  const config = useRuntimeConfig()
  const { accessToken, logout } = useAuth()
  const { activeProdId } = useProduksi()

  // State
  const masterPriceList = ref<any[]>([])
  const totalMasterPrice = ref(0)
  
  const detailList = ref<any[]>([])
  const totalDetail = ref(0)

  // Loaders
  const isLoadingMaster = ref(false)
  const isLoadingDetail = ref(false)
  const isSaving = ref(false)

  // Helpers for exact pagination count fallback
  const getPaginationTotal = (res: any, dataList: any[], page: number, rows: number) => {
    if (res.total !== undefined) return Number(res.total)
    if (dataList.length > 0 && typeof dataList[0].total_row !== 'undefined') return Number(dataList[0].total_row)
    if (dataList.length > 0 && typeof dataList[0].total_rows !== 'undefined') return Number(dataList[0].total_rows)
    if (dataList.length > 0 && typeof dataList[0].total !== 'undefined') return Number(dataList[0].total)
    if (dataList.length === rows) return page * rows + 1
    return (page - 1) * rows + dataList.length
  }

  // 1. Fetch Master Price / Discount Header
  const fetchMasterPrice = async (keyword = '', page = 1, rows = 10) => {
    isLoadingMaster.value = true
    try {
      const q = new URLSearchParams()
      if (keyword) q.append('var_where', keyword)
      q.append('var_page_number', page.toString())
      q.append('var_row_page', rows.toString())
      q.append('v_id_prod', String(activeProdId.value || 0))

      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/getmaster-price-discount-prod?${q.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      let data = res.rows || res.data || res || []
      masterPriceList.value = Array.isArray(data) && data.length > 0 && data[0].rows ? data[0].rows : data
      totalMasterPrice.value = getPaginationTotal(res, masterPriceList.value, page, rows)
    } catch (err: any) {
      console.error('Error fetchMasterPrice:', err)
      if (err.response?.status === 401) logout()
    } finally {
      isLoadingMaster.value = false
    }
  }

  // 2. Save New Master Price / Discount
  const saveNewMasterPrice = async (payload: { v_id: number, v_option: number, v_txtset: number, v_txtnameset: string, v_txtstartdate: string, v_txtenddate: string }) => {
    isSaving.value = true
    try {
      const body = {
        v_prod_id: activeProdId.value || 0,
        ...payload
      }
      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/save-create-price-dis-produksi`, {
        method: 'POST',
        body,
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      return { success: true, data: res.data }
    } catch (err) {
      console.error('Error saveNewMasterPrice:', err)
      return { success: false }
    } finally {
      isSaving.value = false
    }
  }

  // 3. Fetch Master Price Detail
  const fetchPriceDetail = async (idHeader: number, option: number, keyword = '', page = 1, rows = 10) => {
    isLoadingDetail.value = true
    try {
      const q = new URLSearchParams()
      if (keyword) q.append('var_where', keyword)
      q.append('var_page_number', page.toString())
      q.append('var_row_page', rows.toString())
      q.append('v_id_header', idHeader.toString())
      q.append('v_opt', option.toString())

      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/getmaster-price-detail-produksi-new?${q.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      let data = res.rows || res.data || res || []
      detailList.value = Array.isArray(data) && data.length > 0 && data[0].rows ? data[0].rows : data
      totalDetail.value = getPaginationTotal(res, detailList.value, page, rows)
    } catch (err: any) {
      console.error('Error fetchPriceDetail:', err)
      if (err.response?.status === 401) logout()
    } finally {
      isLoadingDetail.value = false
    }
  }

  // 4. Fetch Set On Options (Type, Group, Store, etc.)
  const fetchSetOnOptions = async (setOnType: string) => {
    try {
      const q = new URLSearchParams()
      q.append('p_set_on', setOnType)
      q.append('v_prod_id', String(activeProdId.value || 0))
      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/get-set-on-produksi-price?${q.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      let data = res.rows || res.data || res || []
      return Array.isArray(data) && data.length > 0 && data[0].rows ? data[0].rows : data
    } catch (err) {
      console.error('Error fetchSetOnOptions:', err)
      return []
    }
  }

  // 5. Fetch Kategory
  const fetchKategory = async () => {
    try {
      const q = new URLSearchParams()
      q.append('v_id_prod', String(activeProdId.value || 0))
      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/get-kategory-produk-prod?${q.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      let data = res.rows || res.data || res || []
      return Array.isArray(data) && data.length > 0 && data[0].rows ? data[0].rows : data
    } catch (err) {
      console.error('Error fetchKategory:', err)
      return []
    }
  }

  // 6. Fetch Items By Kategory
  const fetchItemsByKategory = async (idKat: number, keyword = '', page = 1, rows = 100) => {
    try {
      const q = new URLSearchParams()
      if (keyword) q.append('var_where', keyword)
      q.append('var_page_number', page.toString())
      q.append('var_row_page', rows.toString())
      q.append('v_id_kat', idKat.toString())
      q.append('v_id_prod', String(activeProdId.value || 0))
      
      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/combo-produk-group-prod-kategory?${q.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      let data = res.rows || res.data || res || []
      return Array.isArray(data) && data.length > 0 && data[0].rows ? data[0].rows : data
    } catch (err) {
      console.error('Error fetchItemsByKategory:', err)
      return []
    }
  }

  // 7. Save Price / Discount Detail
  const savePriceDetail = async (payload: { v_id_header: number, v_option: number, v_id_item: number, name_set: string, v_set: number, v_amount: string, v_distype: number, v_minqty: string, v_maxqty: string, v_kelipatan: string }) => {
    isSaving.value = true
    try {
      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/save-price-produksi-new`, {
        method: 'POST',
        body: payload,
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      return { success: true, data: res.data }
    } catch (err) {
      console.error('Error savePriceDetail:', err)
      return { success: false }
    } finally {
      isSaving.value = false
    }
  }

  // 8. Update Discount Row Status/Multi inline
  const updatePriceDisc = async (payload: { v_id: number, v_qty_min: string, v_qty_max: string, v_free_i: string, v_multi: boolean, v_active: boolean }) => {
    isSaving.value = true
    try {
      const body = {
        v_id_prod: activeProdId.value || 0,
        ...payload
      }
      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/update-price-disc-prod`, {
        method: 'POST',
        body,
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      return { success: true, data: res.data }
    } catch (err) {
      console.error('Error updatePriceDisc:', err)
      return { success: false }
    } finally {
      isSaving.value = false
    }
  }

  // 9. Update Price Row (Requires Password)
  const updatePriceDetail = async (payload: UpdatePricePayload) => {
    isSaving.value = true
    try {
      // Input type="number" dapat mengubah v-model menjadi number saat runtime.
      // API Rust mengharapkan v_amount dan v_active sebagai JSON string.
      const body = {
        v_id: Number(payload.v_id),
        v_amount: String(payload.v_amount),
        v_active: String(payload.v_active),
        txtpassword: String(payload.txtpassword)
      }

      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/update-price-produksi`, {
        method: 'POST',
        body,
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })

      // Endpoint dapat mengembalikan 1 secara langsung atau membungkusnya
      // sebagai { data: 1 } / { status: 1 }.
      const data = res?.data ?? res
      const rawStatus = data && typeof data === 'object'
        ? (data.status ?? data.data)
        : data
      const status = Number(rawStatus)

      return {
        success: status === 1,
        status,
        data
      }
    } catch (err: any) {
      console.error('Error updatePriceDetail:', err)
      return {
        success: false,
        message: err?.data?.message || err?.data || err?.message || 'Gagal memperbarui harga'
      }
    } finally {
      isSaving.value = false
    }
  }

  return {
    masterPriceList, totalMasterPrice, detailList, totalDetail,
    isLoadingMaster, isLoadingDetail, isSaving,
    fetchMasterPrice, saveNewMasterPrice, fetchPriceDetail,
    fetchSetOnOptions, fetchKategory, fetchItemsByKategory,
    savePriceDetail, updatePriceDisc, updatePriceDetail
  }
}
