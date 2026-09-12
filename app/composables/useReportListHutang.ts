import { ref, computed } from 'vue'
import { useApiFetch } from './useApiFetch'
import { useAuth } from './useAuth'

export const useReportListHutang = () => {
  const { user } = useAuth()

  const reportData = ref<any[]>([])
  const isLoading = ref<boolean>(false)

  // Sum calculations based on current data
  const totalHutang = computed(() => reportData.value.reduce((sum, item) => sum + (Number(item.tagihan) || 0), 0))
  const totalTerbayar = computed(() => reportData.value.reduce((sum, item) => sum + (Number(item.nominal_pem) || 0), 0))
  const totalSisa = computed(() => reportData.value.reduce((sum, item) => sum + (Number(item.sisa) || 0), 0))

  const fetchListHutang = async () => {
    isLoading.value = true
    try {
      const res: any = await useApiFetch(`/produksi/report/hutang/list`, {
        method: 'GET',
        params: {
          var_page_number: 1,
          var_row_page: 5000,
          v_prod_id: user?.value?.prod_id || 1 
        }
      })
      const data = res?.data || res
      if (data && Array.isArray(data)) {
        reportData.value = data.map(item => ({
          ...item,
          // Extract numeric ID for select menu
          metode_pembayaran_id: item.metode_pembayaran === 'Cash' || item.metode_pembayaran == 1 ? 1 : (item.metode_pembayaran === 'Transfer' || item.metode_pembayaran == 2 ? 2 : item.metode_pembayaran)
        }))
      } else {
        reportData.value = []
      }
    } catch (error) {
      console.error(error)
      reportData.value = []
    } finally {
      isLoading.value = false
    }
  }

  const ajukanPayment = async (id: number, payType: number, diskon: number) => {
    try {
      const res: any = await useApiFetch(`/produksi/report/hutang/update-bank-payment`, {
        method: 'POST',
        body: {
          v_id: Number(id),
          v_id_usr: user?.value?.id || 0,
          v_pay_type: Number(payType),
          v_diskon: Number(diskon) || 0,
          v_apk: 1
        }
      })
      if (res?.success || res?.code === 1) {
        alert('Berhasil diajukan')
        await fetchListHutang()
      } else {
        alert('Gagal pengajuan. Pastikan sebelumnya sudah dibayar.')
      }
    } catch (e) {
      console.error(e)
      alert('Error saat mengajukan')
    }
  }

  const setDpPotongan = async (id: number, amount: number, action: number) => {
    try {
      const res: any = await useApiFetch(`/produksi/report/hutang/update-potongan-dp`, {
        method: 'POST',
        body: {
          v_id: Number(id),
          v_amount: Number(amount) || 0,
          v_action: action // 1 for DP, 2 for Potongan
        }
      })
      if (res?.success || res?.code === 1) {
        await fetchListHutang()
      } else {
        alert('Gagal mengubah data.')
      }
    } catch (e) {
      console.error(e)
      alert('Error saat request.')
    }
  }

  const fetchPrintDetail = async (id: number) => {
    try {
      const res: any = await useApiFetch(`/produksi/report/hutang/nota-bon-detail`, {
        method: 'GET',
        params: {
          v_id: id,
          v_app: 1
        }
      })
      const data = res?.data || res
      return data
    } catch (e) {
      console.error(e)
      return null
    }
  }

  const exportAllToCsv = (filename: string = 'master_list_hutang.csv') => {
    if (!reportData.value || reportData.value.length === 0) return

    const columns = [
      { key: 'name_prod', label: 'Name Dc' },
      { key: 'receiving_kode', label: 'No Faktur' },
      { key: 'tanggal_terbit', label: 'Tanggal Terbit' },
      { key: 'name_vendor', label: 'Nama Vendor' },
      { key: 'tagihan', label: 'Tagihan' },
      { key: 'discount', label: 'Discount' },
      { key: 'dp', label: 'DP' },
      { key: 'potongan', label: 'Potongan' },
      { key: 'miscellaneous_expense', label: 'Miscellaneous Expense' },
      { key: 'payreq', label: 'Pay req Date' },
      { key: 'nominal_pem', label: 'Nominal Pembayaran' },
      { key: 'sisa_strs', label: 'Sisa' },
      { key: 'sisa_global', label: 'Sisa By vendor' },
      { key: 'tgl_pembayaran', label: 'Tanggal Pembayaran' },
      { key: 'metode_pembayaran', label: 'Metode Pembayaran' },
      { key: 'rekening', label: 'Rekening' },
      { key: 'nama_rekening', label: 'Nama Rekening' },
      { key: 'jenis_bank', label: 'Jenis Bank' }
    ]
    let csvContent = "data:text/csv;charset=utf-8,"
    csvContent += columns.map(c => `"${c.label}"`).join(",") + "\n"
    reportData.value.forEach(row => {
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
    reportData,
    isLoading,
    totalHutang,
    totalTerbayar,
    totalSisa,
    fetchListHutang,
    ajukanPayment,
    setDpPotongan,
    fetchPrintDetail,
    exportAllToCsv
  }
}
