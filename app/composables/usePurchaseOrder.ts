export const usePurchaseOrder = () => {
  const config = useRuntimeConfig()
  const { accessToken, logout } = useAuth()
  const { activeProdId } = useProduksi()

  // State
  const vendorList = ref<any[]>([])
  const poList = ref<any[]>([])
  const tempItemList = ref<any[]>([])
  const kategoriList = ref<any[]>([])
  const itemList = ref<any[]>([])

  const isLoadingVendor = ref(false)
  const isLoadingPO = ref(false)
  const isLoadingTemp = ref(false)
  const isLoadingDetail = ref(false)
  const isSaving = ref(false)

  const receivingDetailList = ref<any[]>([])

  // Fetch Vendors
  const fetchVendors = async (keyword = '', page = 1, rows = 10) => {
    isLoadingVendor.value = true
    try {
      const q = new URLSearchParams()
      if (keyword) q.append('filterRules', JSON.stringify([{ field: 'name_vendor', value: keyword }]))
      q.append('page', page.toString())
      q.append('rows', rows.toString())
      q.append('v_id_dc', String(activeProdId.value || 0))

      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/purchase-order-vendo-list?${q.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      let data = res.rows || res.data || res || []
      if (Array.isArray(data) && data.length > 0 && data[0].rows) {
        vendorList.value = data[0].rows
      } else {
        vendorList.value = Array.isArray(data) ? data : []
      }
      return res
    } catch (err: any) {
      console.error('Error fetchVendors:', err)
      if (err.response?.status === 401) logout()
      return { success: false, data: [] }
    } finally {
      isLoadingVendor.value = false
    }
  }

  // Fetch Purchase Orders for a Vendor
  const fetchPOList = async (vendorId: number, keyword = '', page = 1, rows = 100) => {
    isLoadingPO.value = true
    try {
      const q = new URLSearchParams()
      if (keyword) q.append('filterRules', JSON.stringify([{ field: 'name', value: keyword }]))
      q.append('page', page.toString())
      q.append('rows', rows.toString())
      q.append('v_id_prod', String(activeProdId.value || 0))
      q.append('v_id_vendor', vendorId.toString())

      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/purchase-order-prod-list?${q.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      let data = res.rows || res.data || res || []
      if (Array.isArray(data) && data.length > 0 && data[0].rows) {
        poList.value = data[0].rows
      } else {
        poList.value = Array.isArray(data) ? data : []
      }
      return res
    } catch (err: any) {
      console.error('Error fetchPOList:', err)
      if (err.response?.status === 401) logout()
      return { success: false, data: [] }
    } finally {
      isLoadingPO.value = false
    }
  }

  // Fetch Kategori
  const fetchKategori = async () => {
    try {
      const q = new URLSearchParams()
      q.append('v_id_prod', String(activeProdId.value || 0))

      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/kategory-produk-list?${q.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      let data = res.rows || res.data || res || []
      if (Array.isArray(data) && data.length > 0 && data[0].rows) {
        kategoriList.value = data[0].rows
      } else {
        kategoriList.value = Array.isArray(data) ? data : []
      }
    } catch (err) {
      console.error('Error fetchKategori:', err)
    }
  }

  // Fetch Items by Kategori
  const fetchItems = async (kategoriId: number) => {
    try {
      const q = new URLSearchParams()
      q.append('var_page_number', '1')
      q.append('var_row_page', '1000') // Fetch all items for dropdown
      q.append('v_id_kat', kategoriId.toString())
      q.append('v_id_prod', String(activeProdId.value || 0))

      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/combo-produk-group-prod-kategory?${q.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      let data = res.rows || res.data || res || []
      if (Array.isArray(data) && data.length > 0 && data[0].rows) {
        itemList.value = data[0].rows
      } else {
        itemList.value = Array.isArray(data) ? data : []
      }
    } catch (err) {
      console.error('Error fetchItems:', err)
    }
  }

  // Fetch Temp Items
  const fetchTempItems = async (vendorId: number) => {
    isLoadingTemp.value = true
    try {
      const q = new URLSearchParams()
      q.append('v_id_vendor', vendorId.toString())
      q.append('v_id_prod', String(activeProdId.value || 0))
      // v_id_usr tidak dikirim → backend pakai user.user_id dari JWT token

      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/purchase-order-produksi/prod-temp-purchase-list?${q.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      let data = res.rows || res.data || res || []
      if (Array.isArray(data) && data.length > 0 && data[0].rows) {
        tempItemList.value = data[0].rows
      } else {
        tempItemList.value = Array.isArray(data) ? data : []
      }
      return res
    } catch (err) {
      console.error('Error fetchTempItems:', err)
      return { success: false, data: [] }
    } finally {
      isLoadingTemp.value = false
    }
  }

  // Save Temp Item
  const saveTempItem = async (payload: { v_id_vendor: string, v_id_item: string, v_qty: string, v_price: string }) => {
    isSaving.value = true
    try {
      const body = {
        ...payload,
        v_id_prod: activeProdId.value || 0
        // v_id_usr tidak dikirim → backend pakai user.user_id dari JWT token
      }
      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/purchase-order-produksi/prod-temp-purchase-list-save`, {
        method: 'POST',
        body,
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      return { success: true, data: res.data }
    } catch (err) {
      console.error('Error saveTempItem:', err)
      return { success: false }
    } finally {
      isSaving.value = false
    }
  }

  // Delete Temp Item
  const deleteTempItem = async (id: number) => {
    isSaving.value = true
    try {
      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/purchase-order-produksi/delete-list-order-item-prod`, {
        method: 'POST',
        body: { v_id: id },
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      return { success: true, data: res.data }
    } catch (err) {
      console.error('Error deleteTempItem:', err)
      return { success: false }
    } finally {
      isSaving.value = false
    }
  }

  // Posting PO
  const postingPO = async (payload: { v_id_comboto: number, v_posted: number, v_reference: string, v_tgl_po: string }) => {
    isSaving.value = true
    try {
      const body = {
        v_id_to: 2, // Hardcoded 2 as per old code id_to: 2
        v_id_comboto: payload.v_id_comboto,
        v_posted: payload.v_posted,
        v_reference: payload.v_reference,
        v_tgl_po: payload.v_tgl_po,
        v_prod_cate: activeProdId.value
      }
      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/add-prod-save-purchase-rolla`, {
        method: 'POST',
        body,
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      return { success: true, data: res.data }
    } catch (err) {
      console.error('Error postingPO:', err)
      return { success: false }
    } finally {
      isSaving.value = false
    }
  }

  // Set Discount
  const setDiscount = async (id: number, amount: number) => {
    try {
      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/purchase-order-produksi/set-discount-dp-purchaseorder-prod`, {
        method: 'POST',
        body: { v_id: id, v_option: 2, v_amount: amount.toString() },
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      return { success: true, data: res.data }
    } catch (err) {
      console.error('Error setDiscount:', err)
      return { success: false }
    }
  }

  // Set Miscellaneous
  const setMiscellaneous = async (id: number, amount: number) => {
    try {
      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/purchase-order-produksi/set-miscellaneous-expense-purchaseorder-prod`, {
        method: 'POST',
        body: { v_id: id, v_amount: amount }, // backend takes f64
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      return { success: true, data: res.data }
    } catch (err) {
      console.error('Error setMiscellaneous:', err)
      return { success: false }
    }
  }

  // Payment Request
  const requestPayment = async (id: number) => {
    try {
      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/purchase-order-produksi/set-request-payment`, {
        method: 'POST',
        // old code doesn't specify app_id and pay_res, setting defaults
        body: { v_id: id, v_app_id: 1, v_pay_res: 1 }, // v_id_usr tidak dikirim → backend pakai JWT token
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      return { success: true, data: res.data }
    } catch (err) {
      console.error('Error requestPayment:', err)
      return { success: false }
    }
  }

  // Fetch Receiving Detail
  const fetchReceivingDetail = async (idHeader: number) => {
    isLoadingDetail.value = true
    receivingDetailList.value = []
    try {
      const q = new URLSearchParams()
      q.append('v_id_header', String(idHeader))
      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/produksi-to-dc/prod-trans-terima-detail?${q.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      receivingDetailList.value = res.data || res.rows || res || []
      return { success: true }
    } catch (err) {
      console.error('Error fetchReceivingDetail:', err)
      receivingDetailList.value = []
      return { success: false }
    } finally {
      isLoadingDetail.value = false
    }
  }

  return {
    vendorList, poList, tempItemList, kategoriList, itemList, receivingDetailList,
    isLoadingVendor, isLoadingPO, isLoadingTemp, isLoadingDetail, isSaving,
    fetchVendors, fetchPOList, fetchKategori, fetchItems, fetchTempItems,
    saveTempItem, deleteTempItem, postingPO, setDiscount, setMiscellaneous, requestPayment,
    fetchReceivingDetail
  }
}
