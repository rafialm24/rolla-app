import { ref, computed } from 'vue'
import { useApiFetch } from './useApiFetch'
import { useAuth } from './useAuth'
import { useProduksi } from './useProduksi'

export const useKasirProd = () => {
  const { user } = useAuth()
  const { activeProdId } = useProduksi()
  
  // State
  const cartList = ref<any[]>([])
  const lastTrxOptions = ref<any[]>([])
  const manualItems = ref<any[]>([])
  
  // Summary State
  const subtotal = ref<number>(0)
  const potongan = ref<number>(0)
  const voucher = ref<number>(0)
  const poin = ref<number>(0)
  const total = ref<number>(0)
  const bayar = ref<number>(0)
  const kembalian = ref<number>(0)
  const reference = ref<string>('')
  
  const isLoading = ref<boolean>(false)
  const isSaving = ref<boolean>(false)
  
  const aplikasiId = computed(() => user.value?.id_aplikasi || 7)
  const prodId = computed(() => activeProdId.value || 0)

  // Fetch List Terakhir Transaksi
  const fetchLastTrx = async () => {
    try {
      const res: any = await useApiFetch(`/produksi/kasir-produksi/get-list-last-trx-sales-produksi`, {
        method: 'GET',
        params: {
          v_aplikasi_id: aplikasiId.value,
          v_id_prod: prodId.value
        }
      })
      const data = res?.data || res
      if (data && Array.isArray(data)) {
        lastTrxOptions.value = data
      }
      return data
    } catch (error) {
      console.error('Error fetchLastTrx:', error)
      return null
    }
  }

  // Fetch Cart Transaction
  const fetchListTrx = async () => {
    isLoading.value = true
    try {
      const res: any = await useApiFetch(`/produksi/kasir-produksi/get-list-trx-sales-produksi`, {
        method: 'GET',
        params: {
          v_aplikasi_id: aplikasiId.value,
          v_lokasi: prodId.value
        }
      })
      const data = res?.data || res
      if (data && Array.isArray(data)) {
        cartList.value = data
        if (data.length > 0) {
          const firstRow = data[0]
          subtotal.value = parseFloat(firstRow.sub_total || 0)
          voucher.value = parseFloat(firstRow.voucher || 0)
          poin.value = parseFloat(firstRow.poin || 0)
          potongan.value = parseFloat(firstRow.potongan || 0)
          bayar.value = parseFloat(firstRow.bayar || 0)
          total.value = parseFloat(firstRow.total || 0)
          kembalian.value = parseFloat(firstRow.kembalian || 0)
        } else {
          subtotal.value = 0
          voucher.value = 0
          poin.value = 0
          potongan.value = 0
          bayar.value = 0
          total.value = 0
          kembalian.value = 0
        }
      } else {
        cartList.value = []
      }
      return data
    } catch (error) {
      console.error('Error fetchListTrx:', error)
      cartList.value = []
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Fetch Item Stock (Manual Select)
  const fetchItemStock = async (gradeInv: number) => {
    try {
      const res: any = await useApiFetch(`/produksi/kasir-produksi/get-item-stock-produksi-bazzar`, {
        method: 'GET',
        params: {
          v_grade_inv: gradeInv,
          v_prod_id: prodId.value
        }
      })
      const data = res?.data || res
      if (data && Array.isArray(data)) {
        manualItems.value = data
      } else {
        manualItems.value = []
      }
      return data
    } catch (error) {
      console.error('Error fetchItemStock:', error)
      return null
    }
  }

  // Fetch Price for Item
  const fetchItemPrice = async (item: number) => {
    try {
      const res: any = await useApiFetch(`/produksi/kasir-produksi/hmt-prod`, {
        method: 'GET',
        params: {
          v_item: item,
          v_prod_id: prodId.value
        }
      })
      return res?.data || res
    } catch (error) {
      console.error('Error fetchItemPrice:', error)
      return null
    }
  }

  // Add Barcode Transaction
  const addTrxBarcode = async (barcode: string, qty: number) => {
    isSaving.value = true
    try {
      const res: any = await useApiFetch(`/produksi/kasir-produksi/save-trx-sales-prod-barcode`, {
        method: 'POST',
        body: {
          v_barcode: barcode,
          v_qty: parseFloat(qty.toString()),
          v_aplikasi_id: aplikasiId.value,
          v_id_prod: prodId.value
        }
      })
      return res?.data || res
    } catch (error) {
      console.error('Error addTrxBarcode:', error)
      throw error
    } finally {
      isSaving.value = false
    }
  }

  // Add Manual Transaction
  const addTrxManual = async (idStock: number, idProduk: number, qty: number, price: number) => {
    isSaving.value = true
    try {
      const res: any = await useApiFetch(`/produksi/kasir-produksi/save-trx-sales-produksi-bazzar`, {
        method: 'POST',
        body: {
          v_id_stock: idStock,
          v_id_produk: idProduk,
          v_qty: parseFloat(qty.toString()),
          v_price: parseFloat(price.toString()),
          v_aplikasi_id: aplikasiId.value,
          v_id_prod: prodId.value,
          v_store: prodId.value
        }
      })
      return res?.data || res
    } catch (error) {
      console.error('Error addTrxManual:', error)
      throw error
    } finally {
      isSaving.value = false
    }
  }

  // Delete Transaction Row
  const deleteTrx = async (id: number) => {
    try {
      const res: any = await useApiFetch(`/produksi/kasir-produksi/delete-trx-sales-produksi`, {
        method: 'POST',
        body: {
          v_id: id
        }
      })
      return res?.data || res
    } catch (error) {
      console.error('Error deleteTrx:', error)
      throw error
    }
  }

  // Set Potongan
  const addPotongan = async (amount: number) => {
    try {
      const res: any = await useApiFetch(`/produksi/kasir-produksi/save-trx-sales-potongan-produksi`, {
        method: 'POST',
        body: {
          v_amount: amount.toString(),
          v_aplikasi_id: aplikasiId.value,
          v_id_prod: prodId.value
        }
      })
      return res?.data || res
    } catch (error) {
      console.error('Error addPotongan:', error)
      throw error
    }
  }

  // Set Bayar
  const setBayar = async (amountBayar: number, amountKembalian: number) => {
    try {
      const res: any = await useApiFetch(`/produksi/kasir-produksi/save-getbayar-tunaitrx-sales-produksi`, {
        method: 'POST',
        body: {
          v_bayar: amountBayar.toString(),
          v_kembalian: amountKembalian.toString(),
          v_aplikasi_id: aplikasiId.value,
          v_id_prod: prodId.value
        }
      })
      return res?.data || res
    } catch (error) {
      console.error('Error setBayar:', error)
      throw error
    }
  }

  // Process Tunai / Non Tunai Transaction Final
  const payTunai = async (idBuy: number, typeBuy: number, grade: number) => {
    isSaving.value = true
    try {
      const res: any = await useApiFetch(`/produksi/kasir-produksi/save-bayar-tunai-trx-sales-produksi-bazzar`, {
        method: 'POST',
        body: {
          v_id_buy: idBuy,
          v_typebuy: typeBuy,
          v_subtotal: subtotal.value.toString(),
          v_poin: poin.value.toString(),
          v_total: total.value.toString(),
          v_bayar: bayar.value.toString(),
          v_kembalian: kembalian.value.toString(),
          v_reference: reference.value || '',
          v_grade: grade,
          v_aplikasi_id: aplikasiId.value,
          v_id_prod: prodId.value
        }
      })
      return res?.data || res
    } catch (error) {
      console.error('Error payTunai:', error)
      throw error
    } finally {
      isSaving.value = false
    }
  }

  // Get Print Data
  const getPrintData = async (trxNum: string) => {
    try {
      const res: any = await useApiFetch(`/produksi/kasir-produksi/get-list-print-trx-sales-produksi`, {
        method: 'GET',
        params: {
          v_trx_num: trxNum,
          v_aplikasi_id: aplikasiId.value,
          v_id_prod: prodId.value
        }
      })
      return res?.data || res
    } catch (error) {
      console.error('Error getPrintData:', error)
      return null
    }
  }

  return {
    cartList,
    lastTrxOptions,
    manualItems,
    subtotal,
    potongan,
    voucher,
    poin,
    total,
    bayar,
    kembalian,
    reference,
    isLoading,
    isSaving,
    fetchLastTrx,
    fetchListTrx,
    fetchItemStock,
    fetchItemPrice,
    addTrxBarcode,
    addTrxManual,
    deleteTrx,
    addPotongan,
    setBayar,
    payTunai,
    getPrintData
  }
}

