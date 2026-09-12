import { ref, computed } from 'vue'
import { useAuth } from './useAuth'
import { useProduksi } from './useProduksi'

export const useDiscountList = () => {
  const config = useRuntimeConfig()
  const { accessToken } = useAuth()
  const { activeProdId } = useProduksi()

  // State
  const discountHeaderList = ref<any[]>([])
  const discountDetailList = ref<any[]>([])
  const undiscountedSjList = ref<any[]>([])

  const comboAreaList = ref<any[]>([])
  const comboProdukList = ref<any[]>([])
  const printDataList = ref<any[]>([])
  const reportDiscountList = ref<any[]>([])

  // Loading States
  const isLoadingHeader = ref(false)
  const isLoadingDetail = ref(false)
  const isLoadingUndiscounted = ref(false)
  const isLoadingReport = ref(false)
  const isLoadingStore = ref(false)
  const isSaving = ref(false)

  const storeList = ref<any[]>([])

  // 1. Fetch Header List Discount
  const fetchHeaderList = async (date: string, page = 1, rows = 100) => {
    isLoadingHeader.value = true
    try {
      const q = new URLSearchParams()
      q.append('v_date', date)
      q.append('v_id_prod', String(activeProdId.value || 0))
      q.append('var_page_number', page.toString())
      q.append('var_row_page', rows.toString())

      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/discount/header-list-discount-data?${q.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      discountHeaderList.value = res.data || []
      return res
    } catch (err) {
      console.error('Error fetchHeaderList:', err)
      return { data: [] }
    } finally {
      isLoadingHeader.value = false
    }
  }

  // 2. Fetch Detail List Discount
  const fetchDetailList = async (sj_num: string, date: string, status: number) => {
    isLoadingDetail.value = true
    try {
      const q = new URLSearchParams()
      q.append('v_sj_num', sj_num)
      q.append('v_date', date)
      q.append('v_status', status.toString())
      q.append('v_id_prod', String(activeProdId.value || 0))

      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/discount/detail-list-discount?${q.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      discountDetailList.value = res.data || []
      return res
    } catch (err) {
      console.error('Error fetchDetailList:', err)
      return { data: [] }
    } finally {
      isLoadingDetail.value = false
    }
  }

  // 3. Fetch Combo Area / Client
  const fetchComboArea = async () => {
    try {
      const q = new URLSearchParams()
      q.append('v_prod_id', String(activeProdId.value || 0))
      q.append('var_page_number', '1')
      q.append('var_row_page', '100')
      q.append('filter_where', '')
      q.append('var_where', '')

      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/discount/combo-area-client-produksi?${q.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      let data = res.data || []
      if (data.length > 0 && data[0].rows) {
        comboAreaList.value = data[0].rows
      } else {
        comboAreaList.value = data
      }
      return res
    } catch (err) {
      console.error('Error fetchComboArea:', err)
      return { data: [] }
    }
  }

  // 4. Fetch Combo Produk Roti
  const fetchComboProduk = async () => {
    try {
      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/discount/combo-produk-kategori-roti`, {
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      let data = res.data || []
      if (data.length > 0 && data[0].rows) {
        comboProdukList.value = data[0].rows
      } else {
        comboProdukList.value = data
      }
      return res
    } catch (err) {
      console.error('Error fetchComboProduk:', err)
      return { data: [] }
    }
  }

  // 5. Fetch Undiscounted SJ
  const fetchUndiscountedSj = async (to_store: number, id_produk: number) => {
    isLoadingUndiscounted.value = true
    try {
      const q = new URLSearchParams()
      q.append('p_to_store', to_store.toString())
      q.append('p_id_produk', id_produk.toString())

      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/discount/get-undiscount-sj?${q.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      undiscountedSjList.value = res.data || []
      return res
    } catch (err) {
      console.error('Error fetchUndiscountedSj:', err)
      return { data: [] }
    } finally {
      isLoadingUndiscounted.value = false
    }
  }

  // 6. Save (Update) Discount
  const saveDiscount = async (id: number, diskon: number) => {
    isSaving.value = true
    try {
      const payload = {
        v_id: id,
        v_diskon: diskon.toString()
      }
      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/discount/update-diskon`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken.value}` },
        body: payload
      })
      return res.data || res
    } catch (err) {
      console.error('Error saveDiscount:', err)
      return { status: 0, message: 'Server error' }
    } finally {
      isSaving.value = false
    }
  }

  // 7. Posting Discount
  const postDiscount = async (sj_num: string) => {
    isSaving.value = true
    try {
      const payload = {
        v_sj_num: sj_num
      }
      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/discount/posting-diskon`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken.value}` },
        body: payload
      })
      return res.data || res
    } catch (err) {
      console.error('Error postDiscount:', err)
      return { status: 0, message: 'Server error' }
    } finally {
      isSaving.value = false
    }
  }

  // 8. Fetch Print Data
  const fetchPrintData = async (sj_num: string, date: string) => {
    try {
      const q = newSearchParams()
      q.append('v_sj_num', sj_num)
      q.append('v_id_prod', String(activeProdId.value || 0))
      q.append('v_date', date)

      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/discount/print-discount?${q.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      printDataList.value = res.data || []
      return printDataList.value
    } catch (err) {
      console.error('Error fetchPrintData:', err)
      return []
    }
  }

  // 9. Fetch Report Discount
  const fetchReportDiscount = async (store: string, startDate: string, endDate: string) => {
    isLoadingReport.value = true
    reportDiscountList.value = []
    try {
      const q = new URLSearchParams()
      q.append('v_id_prod', String(activeProdId.value || 0))
      if (store) q.append('v_store', store)
      if (startDate) q.append('v_start_date', startDate)
      if (endDate) q.append('v_end_date', endDate)

      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/discount/report-discount?${q.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      let data = res.data || res.rows || res || []
      if (Array.isArray(data) && data.length > 0 && data[0].rows) {
        reportDiscountList.value = data[0].rows
      } else {
        reportDiscountList.value = Array.isArray(data) ? data : []
      }
      return { success: true }
    } catch (err) {
      console.error('Error fetchReportDiscount:', err)
      reportDiscountList.value = []
      return { success: false }
    } finally {
      isLoadingReport.value = false
    }
  }

  // 10. Export Report Discount CSV
  const exportReportDiscountCsv = (
    data: any[],
    columns: { key: string; label: string }[],
    filename = 'report_discount.csv'
  ) => {
    if (!data.length) return
    const header = columns.map(c => c.label).join(',')
    const rows = data.map(row =>
      columns.map(c => {
        const v = row[c.key] ?? ''
        return `"${String(v).replace(/"/g, '""')}"`
      }).join(',')
    )
    const csvContent = [header, ...rows].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  // Define helper function to fix typo
  const newSearchParams = () => new URLSearchParams()

  // Fetch Store Combo (untuk filter report discount)
  const fetchStoreCombo = async () => {
    isLoadingStore.value = true
    try {
      const q = new URLSearchParams()
      q.append('v_id_prod', String(activeProdId.value || 0))
      q.append('var_page_number', '1')
      q.append('var_row_page', '500')
      q.append('filter_where', '')
      q.append('var_where', '')
      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/discount/combo-area-client-produksi?${q.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      let data = res.data || []
      if (Array.isArray(data) && data.length > 0 && data[0].rows) {
        storeList.value = data[0].rows
      } else {
        storeList.value = Array.isArray(data) ? data : []
      }
    } catch (err) {
      console.error('Error fetchStoreCombo:', err)
    } finally {
      isLoadingStore.value = false
    }
  }

  return {
    activeProdId,
    discountHeaderList,
    discountDetailList,
    undiscountedSjList,
    storeList,
    reportDiscountList,
    isLoadingHeader,
    isLoadingDetail,
    isLoadingUndiscounted,
    isLoadingReport,
    isLoadingStore,
    isSaving,
    fetchHeaderList,
    fetchDetailList,
    fetchComboArea,
    fetchComboProduk,
    fetchUndiscountedSj,
    saveDiscount,
    postDiscount,
    fetchPrintData,
    fetchReportDiscount,
    fetchStoreCombo,
    exportReportDiscountCsv
  }
}
