import { ref } from 'vue'
import { useApiFetch } from './useApiFetch'
import { useAuth } from './useAuth'

export const useReportReturn = () => {
  const { user } = useAuth()

  const stores = ref<any[]>([])
  const dcs = ref<any[]>([])
  
  const returnData = ref<any[]>([])
  const returnDcData = ref<any[]>([])

  const isLoadingReturn = ref<boolean>(false)
  const isLoadingReturnDc = ref<boolean>(false)

  const fetchStores = async () => {
    try {
      const res: any = await useApiFetch(`/produksi/report/combo/area-prod-store`, {
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
        stores.value = data.map(item => ({
          ...item,
          id_store: item.id || item.kode,
          name: item.name || item.kode || 'Unknown'
        }))
      } else {
        stores.value = []
      }
    } catch (e) {
      console.error(e)
    }
  }

  const fetchDcs = async () => {
    try {
      const res: any = await useApiFetch(`/produksi/report/combo/dc-new`, {
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
        dcs.value = data.map(item => ({
          ...item,
          id_dc: item.id,
          name_dc: item.name_dc || 'Unknown'
        }))
      } else {
        dcs.value = []
      }
    } catch (e) {
      console.error(e)
    }
  }

  const fetchReturnToko = async (store: string, startDate: string, endDate: string) => {
    isLoadingReturn.value = true
    try {
      const res: any = await useApiFetch(`/produksi/report/return/toko`, {
        method: 'GET',
        params: {
          v_cabang: "-1",
          v_store: store || "-2",
          v_start_date: startDate || "-A",
          v_end_date: endDate || "-B",
          v_prod_id: user?.value?.prod_id || 1 
        }
      })
      let data = res?.data || res
      if (typeof data === 'string') {
        try { data = JSON.parse(data) } catch (e) {}
      }
      if (data && Array.isArray(data)) {
        returnData.value = data
      } else {
        returnData.value = []
      }
    } catch (error) {
      console.error(error)
      returnData.value = []
    } finally {
      isLoadingReturn.value = false
    }
  }

  const fetchReturnDc = async (dc: string, startDate: string, endDate: string) => {
    isLoadingReturnDc.value = true
    try {
      const res: any = await useApiFetch(`/produksi/report/return/dc`, {
        method: 'GET',
        params: {
          v_dc: dc || "-1",
          v_start_date: startDate || "-A",
          v_end_date: endDate || "-B",
          v_prod_id: user?.value?.prod_id || 1 
        }
      })
      let data = res?.data || res
      if (typeof data === 'string') {
        try { data = JSON.parse(data) } catch (e) {}
      }
      if (data && Array.isArray(data)) {
        returnDcData.value = data
      } else {
        returnDcData.value = []
      }
    } catch (error) {
      console.error(error)
      returnDcData.value = []
    } finally {
      isLoadingReturnDc.value = false
    }
  }

  const approveReturn = async (id: number, qty: number) => {
    try {
      const res: any = await useApiFetch(`/produksi/report/return/action-toko-to-prod`, {
        method: 'POST',
        body: {
          v_id: Number(id),
          v_qty: Number(qty),
          v_id_prod: user?.value?.prod_id || 1,
          v_id_usr: user?.value?.id || 0,
          v_aplikasi_id: 1 // default app id
        }
      })
      if (res?.success || res?.code === 1) {
        alert('Approve Berhasil')
        return true
      } else {
        alert('Approve Gagal')
        return false
      }
    } catch (e) {
      console.error(e)
      alert('Error saat approve')
      return false
    }
  }

  const disassemblyReturn = async (id: number, qty: number) => {
    try {
      const res: any = await useApiFetch(`/produksi/report/return/action-disassembly`, {
        method: 'POST',
        body: {
          v_id: Number(id),
          v_qty: Number(qty),
          v_id_prod: user?.value?.prod_id || 1,
          v_id_usr: user?.value?.id || 0
        }
      })
      if (res?.success || res?.code === 1) {
        alert('Berhasil Bongkar')
        return true
      } else {
        alert('Gagal Bongkar')
        return false
      }
    } catch (e) {
      console.error(e)
      alert('Error saat bongkar')
      return false
    }
  }

  const exportCsvBase = (dataList: any[], columns: any[], filename: string) => {
    if (!dataList || dataList.length === 0) return
    let csvContent = "data:text/csv;charset=utf-8,"
    csvContent += columns.map(c => `"${c.label}"`).join(",") + "\n"
    dataList.forEach(row => {
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
    stores,
    dcs,
    returnData,
    returnDcData,
    isLoadingReturn,
    isLoadingReturnDc,
    fetchStores,
    fetchDcs,
    fetchReturnToko,
    fetchReturnDc,
    approveReturn,
    disassemblyReturn,
    exportCsvBase
  }
}
