import { ref } from 'vue'
import { useApiFetch } from './useApiFetch'
import { useAuth } from './useAuth'

export const usePurchaseForecast = () => {
  const { user } = useAuth()

  const categories = ref<any[]>([])
  const selectedCategory = ref<number | undefined>(undefined)
  const forecastData = ref<any[]>([])
  const isLoading = ref<boolean>(false)

  // Fetch Kategori Produk
  const fetchCategories = async () => {
    try {
      const res: any = await useApiFetch(`/produksi/master-bom/get-kategory-produk`, {
        method: 'GET'
      })
      const data = res?.data || res
      if (data && Array.isArray(data)) {
        categories.value = data
      } else {
        categories.value = []
      }
      return data
    } catch (error) {
      console.error('Error fetchCategories:', error)
      categories.value = []
      return null
    }
  }

  // Fetch Data Forecast
  const fetchForecast = async (categoryId: number) => {
    isLoading.value = true
    try {
      const res: any = await useApiFetch(`/produksi/produksi-forecast`, {
        method: 'GET',
        params: {
          v_id_kat: categoryId,
          v_prod_cate: 1
        }
      })
      const data = res?.data || res
      if (data && Array.isArray(data)) {
        forecastData.value = data
      } else {
        forecastData.value = []
      }
      return data
    } catch (error) {
      console.error('Error fetchForecast:', error)
      forecastData.value = []
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Export to CSV
  const exportToCsv = (filename: string = 'forchase.csv') => {
    if (!forecastData.value || forecastData.value.length === 0) {
      return
    }

    // Define columns to export
    const columns = [
      { key: 'kode_produk', label: 'KODE PRODUK' },
      { key: 'name_produk', label: 'NAMA PRODUK' },
      { key: 'uom', label: 'UOM' },
      { key: 'stock_gudang', label: 'STOCK GUDANG' },
      { key: 'stock_toko', label: 'STOCK TOKO' },
      { key: 'max_toko', label: 'MAX TOKO' },
      { key: 'kebutuhan', label: 'KEBUTUHAN' },
      { key: 'forecase', label: 'FORECAST' }
    ]

    // Create CSV Header
    let csvContent = "data:text/csv;charset=utf-8,"
    csvContent += columns.map(c => `"${c.label}"`).join(",") + "\n"

    // Create CSV Rows
    forecastData.value.forEach(row => {
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
    categories,
    selectedCategory,
    forecastData,
    isLoading,
    fetchCategories,
    fetchForecast,
    exportToCsv
  }
}
