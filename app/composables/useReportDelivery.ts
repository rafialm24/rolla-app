import { ref } from 'vue'
import { useApiFetch } from './useApiFetch'
import { useAuth } from './useAuth'

export const useReportDelivery = () => {
  const { user } = useAuth()

  const clients = ref<any[]>([])
  
  const deliveryData = ref<any[]>([])
  const deliveryWoData = ref<any[]>([])
  
  const isLoadingDelivery = ref<boolean>(false)
  const isLoadingWo = ref<boolean>(false)
  const isExportingSummary = ref<boolean>(false)

  const fetchClients = async () => {
    try {
      const res: any = await useApiFetch(`/produksi/report/combo/area-client`, {
        method: 'GET',
        params: {
          v_prod_id: user?.value?.prod_id || 1,
          var_page_number: 1,
          var_row_page: 5000
        }
      })
      let data = res?.data || res
      if (typeof data === 'string') {
        try { data = JSON.parse(data) } catch (e) {}
      }
      if (data && Array.isArray(data)) {
        clients.value = data.map(item => ({
          ...item,
          id_client: `${item.id};${item.set_id}`,
          name: item.client || item.kode || 'Unknown'
        }))
      } else {
        clients.value = []
      }
    } catch (e) {
      console.error(e)
    }
  }

  const fetchDelivery = async (client: string, idSet: string, startDate: string, endDate: string) => {
    isLoadingDelivery.value = true
    try {
      const res: any = await useApiFetch(`/produksi/report/delivery/1`, {
        method: 'GET',
        params: {
          v_client: client,
          v_id_set: idSet,
          v_start_date: startDate,
          v_end_date: endDate,
          v_prod_id: user?.value?.prod_id || 1 
        }
      })
      let data = res?.data || res
      if (typeof data === 'string') {
        try { data = JSON.parse(data) } catch (e) {}
      }
      if (data && Array.isArray(data)) {
        deliveryData.value = data
      } else {
        deliveryData.value = []
      }
    } catch (error) {
      console.error(error)
      deliveryData.value = []
    } finally {
      isLoadingDelivery.value = false
    }
  }

  const fetchDeliveryWo = async (client: string, startDate: string, endDate: string) => {
    isLoadingWo.value = true
    try {
      const res: any = await useApiFetch(`/produksi/report/delivery/work-order`, {
        method: 'GET',
        params: {
          v_client: client,
          v_start_date: startDate,
          v_end_date: endDate,
          v_prod_id: user?.value?.prod_id || 1 
        }
      })
      let data = res?.data || res
      if (typeof data === 'string') {
        try { data = JSON.parse(data) } catch (e) {}
      }
      if (data && Array.isArray(data)) {
        deliveryWoData.value = data
      } else {
        deliveryWoData.value = []
      }
    } catch (error) {
      console.error(error)
      deliveryWoData.value = []
    } finally {
      isLoadingWo.value = false
    }
  }

  const exportSummary = async (client: string, idSet: string, startDate: string, endDate: string) => {
    isExportingSummary.value = true
    try {
      const res: any = await useApiFetch(`/produksi/report/delivery/summary`, {
        method: 'GET',
        params: {
          v_client: client,
          v_id_set: idSet,
          v_start_date: startDate,
          v_end_date: endDate,
          v_prod_id: user?.value?.prod_id || 1 
        }
      })
      const data = res?.data || res
      if (data && Array.isArray(data) && data.length > 0) {
        // dynamic CSV generation based on backend JSON response
        const keys = Object.keys(data[0])
        let csvContent = "data:text/csv;charset=utf-8,"
        csvContent += keys.map(k => `"${k.toUpperCase()}"`).join(",") + "\n"

        data.forEach(row => {
          const rowString = keys.map(col => {
            let val = row[col]
            if (val === null || val === undefined) val = ''
            val = String(val).replace(/"/g, '""')
            return `"${val}"`
          }).join(",")
          csvContent += rowString + "\n"
        })

        const encodedUri = encodeURI(csvContent)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", 'report_delivery_summary.csv')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        alert("No summary data found for these parameters.")
      }
    } catch(e) {
      console.error(e)
    } finally {
      isExportingSummary.value = false
    }
  }

  const exportCsvBase = (data: any[], columns: any[], filename: string) => {
    if (!data || data.length === 0) return
    let csvContent = "data:text/csv;charset=utf-8,"
    csvContent += columns.map(c => `"${c.label}"`).join(",") + "\n"
    data.forEach(row => {
      const rowString = columns.map(col => {
        let val = row[col.key]
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
    clients,
    deliveryData,
    deliveryWoData,
    isLoadingDelivery,
    isLoadingWo,
    isExportingSummary,
    fetchClients,
    fetchDelivery,
    fetchDeliveryWo,
    exportSummary,
    exportCsvBase
  }
}
