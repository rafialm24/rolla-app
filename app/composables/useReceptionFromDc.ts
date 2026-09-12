import { ref } from 'vue'
import { useApiFetch } from './useApiFetch'
import { useProduksi } from './useProduksi'
import { useAuth } from './useAuth'

export const useReceptionFromDc = () => {
  const { activeProdId } = useProduksi()
  const { user } = useAuth()

  const deliveryOptions = ref<any[]>([])
  const selectedSj = ref<string | null>(null)
  const reportList = ref<any[]>([])
  const isLoading = ref<boolean>(false)

  // Fetch combo box data for SJ Number
  const fetchDeliveryOptions = async () => {
    try {
      const res: any = await useApiFetch(`/produksi/combo-area-dc-to-prod`, {
        method: 'GET',
        params: {
          var_where: '',
          var_page_number: 1,
          var_row_page: 100,
          v_dc_id: activeProdId.value || 0
        }
      })
      const data = res?.data || res
      if (data && Array.isArray(data)) {
        deliveryOptions.value = data
      } else {
        deliveryOptions.value = []
      }
      return data
    } catch (error) {
      console.error('Error fetchDeliveryOptions:', error)
      deliveryOptions.value = []
      return null
    }
  }

  // Fetch DataGrid
  const fetchReportDelivery = async (id: string) => {
    isLoading.value = true
    try {
      const res: any = await useApiFetch(`/produksi/dc-report-delivery-dc`, {
        method: 'GET',
        params: {
          v_id: id,
          v_dc_cate: activeProdId.value || 0
        }
      })
      const data = res?.data || res
      if (data && Array.isArray(data)) {
        reportList.value = data
      } else {
        reportList.value = []
      }
      return data
    } catch (error) {
      console.error('Error fetchReportDelivery:', error)
      reportList.value = []
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Action: Terima (action 1) or Cancel (action 3)
  const actionReception = async (id: number, id_action: number, app: number) => {
    try {
      const res: any = await useApiFetch(`/produksi/dc-purchase-list-save-from-dc-to-produksi`, {
        method: 'POST',
        body: {
          v_id: id,
          v_id_action: id_action,
          v_app: app,
          v_id_dc: activeProdId.value || 0
          // v_id_usr tidak dikirim → backend pakai user.user_id dari JWT token
        }
      })
      return { success: true, data: res?.data || res }
    } catch (error: any) {
      console.error('Error actionReception:', error)
      return { success: false, message: error.response?.data?.message || error.message }
    }
  }

  // Export to CSV
  const exportToCsv = (filename: string = 'report_terima_delivery.csv') => {
    if (!reportList.value || reportList.value.length === 0) return

    const columns = [
      { key: 'sj_num', label: 'SJ NUMBER' },
      { key: 'kode_dc', label: 'KODE DC' },
      { key: 'name_dc', label: 'NAME DC' },
      { key: 'delivery_date', label: 'DELIVERY DATE' },
      { key: 'kode_produk', label: 'KODE PRODUK' },
      { key: 'name_produk', label: 'NAME PRODUK' },
      { key: 'konversi', label: 'KONVERSI' },
      { key: 'name_prod_uom', label: 'UOM BIG' },
      { key: 'qty', label: 'QTY BIG' },
      { key: 'uom_child', label: 'UOM CHILD' },
      { key: 'qty_child', label: 'QTY CHILD' },
      { key: 'price', label: 'PRICE' },
      { key: 'sub_total', label: 'SUB TOTAL' },
      { key: 'reception_date', label: 'TGL TERIMA' }
    ]

    let csvContent = "data:text/csv;charset=utf-8,"
    csvContent += columns.map(c => `"${c.label}"`).join(",") + "\n"

    reportList.value.forEach(row => {
      const rowString = columns.map(col => {
        let val = row[col.key] || row[col.key.replace('x', '')] // fallback for missing 'x' suffix
        if (val === null || val === undefined) val = ''
        val = String(val).replace(/"/g, '""')
        return `"${val}"`
      }).join(",")
      csvContent += rowString + "\n"
    })

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return {
    deliveryOptions,
    selectedSj,
    reportList,
    isLoading,
    fetchDeliveryOptions,
    fetchReportDelivery,
    actionReception,
    exportToCsv
  }
}
