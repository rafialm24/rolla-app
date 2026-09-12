import { ref } from 'vue'
import { useApiFetch } from './useApiFetch'
import { useAuth } from './useAuth'

export const useReportPenjualanLangsung = () => {
  const { user } = useAuth()

  const reportData = ref<any[]>([])
  const isLoading = ref<boolean>(false)

  // Fetch Report Data
  const fetchReport = async (startDate: string, endDate: string) => {
    isLoading.value = true
    try {
      const res: any = await useApiFetch(`/produksi/report/penjualan/langsung`, {
        method: 'GET',
        params: {
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
  const exportToCsv = (filename: string = 'report_penjualan_langsung.csv') => {
    if (!reportData.value || reportData.value.length === 0) {
      return
    }

    // Define columns based on datagrid fields
    const columns = [
      { key: 'name_prod', label: 'NAME PROD' },
      { key: 'kode_produk', label: 'KODE PRODUK' },
      { key: 'name_produk', label: 'NAMA PRODUK' },
      { key: 'name_prod_cate', label: 'KATEGORY' },
      { key: 'name_prod_uom', label: 'UOM' },
      { key: 'tanggal', label: 'TANGGAL' },
      { key: 'qty', label: 'QTY' },
      { key: 'price', label: 'PRICE' },
      { key: 'total', label: 'ITEM TOTAL' },
      { key: 'potongan_header', label: 'TRX POTONGAN' },
      { key: 'total_header', label: 'TRX TOTAL' },
      { key: 'usrnm', label: 'KASIR' }
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
