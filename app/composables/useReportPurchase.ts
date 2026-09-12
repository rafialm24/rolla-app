import { ref } from 'vue'
import { useApiFetch } from './useApiFetch'
import { useAuth } from './useAuth'

export const useReportPurchase = () => {
  const { user } = useAuth()

  const reportData = ref<any[]>([])
  const isLoading = ref<boolean>(false)

  // Fetch Report Data
  const fetchReport = async (startDate: string, endDate: string) => {
    isLoading.value = true
    try {
      const res: any = await useApiFetch(`/produksi/report/purchase/get`, {
        method: 'GET',
        params: {
          v_vendor: "", // Leave empty to get all vendors
          v_start_date: startDate,
          v_end_date: endDate,
          v_prod_id: user?.value?.prod_id || 1 
        }
      })
      const data = res?.data || res
      if (data && Array.isArray(data)) {
        reportData.value = data
      } else {
        reportData.value = []
      }
      return data
    } catch (error) {
      console.error('Error fetchReport:', error)
      reportData.value = []
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Export to CSV
  const exportToCsv = (filename: string = 'report_purchase.csv') => {
    if (!reportData.value || reportData.value.length === 0) {
      return
    }

    // Define columns to export based on datagrid fields
    const columns = [
      { key: 'receiving_kode', label: 'RECEIVING NUMBER' },
      { key: 'create_date', label: 'TGL RECEIVING' },
      { key: 'kode_prod', label: 'KODE DC' },
      { key: 'name_prod', label: 'NAMA DC' },
      { key: 'kode_vendor', label: 'KODE VENDOR' },
      { key: 'name_vendor', label: 'NAMA VENDOR' },
      { key: 'kode_product', label: 'KODE PRODUK' },
      { key: 'name_produk', label: 'NAMA PRODUK' },
      { key: 'name_prod_cate', label: 'KATEGORY' },
      { key: 'name_prod_uom', label: 'UOM' },
      { key: 'price', label: 'PRICE' },
      { key: 'qty', label: 'QTY TERIMA' },
      { key: 'discount', label: 'DISCOUNT' },
      { key: 'total', label: 'TOTAL' }
    ]

    // Create CSV Header
    let csvContent = "data:text/csv;charset=utf-8,"
    csvContent += columns.map(c => `"${c.label}"`).join(",") + "\n"

    // Create CSV Rows
    reportData.value.forEach(row => {
      const rowString = columns.map(col => {
        let val = row[col.key]
        if (val === null || val === undefined) val = ''
        // Escape quotes
        val = String(val).replace(/"/g, '""')
        return `"${val}"`
      }).join(",")
      csvContent += rowString + "\n"
    })

    // Download action
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return {
    reportData,
    isLoading,
    fetchReport,
    exportToCsv
  }
}
