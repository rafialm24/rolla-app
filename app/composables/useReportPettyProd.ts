import { ref } from 'vue'
import { useApiFetch } from './useApiFetch'
import { useAuth } from './useAuth'

export const useReportPettyProd = () => {
  const { user } = useAuth()

  const reportData = ref<any[]>([])
  const isLoading = ref<boolean>(false)

  // Fetch Report Data
  const fetchReport = async (startDate: string, endDate: string) => {
    isLoading.value = true
    try {
      const res: any = await useApiFetch(`/produksi/report/petty-cash/get`, {
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
  const exportToCsv = (filename: string = 'report_pettycash.csv') => {
    if (!reportData.value || reportData.value.length === 0) {
      return
    }

    // Define columns to export based on datagrid fields
    const columns = [
      { key: 'id', label: 'ID' },
      { key: 'nik', label: 'NIK' },
      { key: 'nama_lengkap', label: 'NAMA LENGKAP' },
      { key: 'nama_department', label: 'DEPARTMENT' },
      { key: 'nama_divisi', label: 'DIVISI' },
      { key: 'lokasi', label: 'LOKASI' },
      { key: 'reference', label: 'REFERENCE' },
      { key: 'kategory', label: 'KATEGORY' },
      { key: 'keterangan', label: 'KETERANGAN' },
      { key: 'debet', label: 'DEBET' },
      { key: 'amount_cash', label: 'AMOUNT' },
      { key: 'sisa_saldo', label: 'SISA SALDO' },
      { key: 'saldo_piutang_datang', label: 'SALDO PIUTANG DAGANG' },
      { key: 'create_date', label: 'TANGGAL' },
      { key: 'approve_by', label: 'APPROVE' },
      { key: 'approve_date', label: 'DATE APPROVE' },
      { key: 'type', label: 'TYPE' },
      { key: 'foto', label: 'FOTO' }
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
