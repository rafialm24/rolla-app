import { ref } from 'vue'
import { useApiFetch } from './useApiFetch'
import { useProduksi } from './useProduksi'

export const useReportMutasiInvProd = () => {
  const { activeProdId } = useProduksi()
  const reportData = ref<Record<string, any>[]>([])
  const isLoading = ref(false)

  const fetchReport = async (startDate: string, endDate: string) => {
    isLoading.value = true
    try {
      const res: any = await useApiFetch('/produksi/report/mutasi-inv/get', {
        method: 'GET',
        params: {
          v_prod_id: activeProdId.value || 1,
          v_start_date: startDate,
          v_end_date: endDate
        }
      })
      const data = res?.data || res
      reportData.value = Array.isArray(data) ? data : []
      return reportData.value
    } catch (error) {
      console.error('Error fetchReportMutasiInvProd:', error)
      reportData.value = []
      return null
    } finally {
      isLoading.value = false
    }
  }

  const exportToCsv = (
    filename = 'report_mutasi_inventory_produksi.csv',
    columnOrder?: string[]
  ) => {
    if (reportData.value.length === 0) return

    const availableColumns = Object.keys(reportData.value[0])
    const columns = columnOrder?.length
      ? columnOrder.filter(key => availableColumns.includes(key))
      : availableColumns
    const escapeCsv = (value: any) => `"${String(value ?? '').replace(/"/g, '""')}"`
    const csv = [
      columns.map(escapeCsv).join(','),
      ...reportData.value.map(row => columns.map(key => escapeCsv(row[key])).join(','))
    ].join('\r\n')
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }

  return { reportData, isLoading, fetchReport, exportToCsv }
}
