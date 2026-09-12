<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useReportPenjualanLangsung } from '~/composables/useReportPenjualanLangsung'

definePageMeta({
  layout: 'dashboard'
})

const {
  reportData,
  isLoading,
  fetchReport,
  exportToCsv
} = useReportPenjualanLangsung()

const startDate = ref<string>('')
const endDate = ref<string>('')

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

onMounted(() => {
  // Init default dates to today
  const today = new Date()
  const yyyy = today.getFullYear()
  const MM = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  const todayStr = `${yyyy}-${MM}-${dd}`
  
  startDate.value = todayStr
  endDate.value = todayStr
})

const handleFind = async () => {
  if (!startDate.value || !endDate.value) {
    alert('Please select both start and end date.')
    return
  }
  await fetchReport(startDate.value, endDate.value)
}

const handleExport = () => {
  exportToCsv('report_penjualan_langsung.csv')
}
</script>

<template>
  <div class="min-h-[calc(100vh-80px)] bg-slate-50 p-4 lg:p-8 font-sans flex flex-col gap-6">
    
    <!-- HEADER -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 shrink-0">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 shadow-inner">
          <UIcon name="i-heroicons-shopping-cart" class="w-7 h-7" />
        </div>
        <div>
          <h1 class="text-2xl font-black text-slate-800 tracking-tight">Report Penjualan Langsung</h1>
          <p class="text-sm font-medium text-slate-500 mt-1">Data Report Penjualan PROD Langsung</p>
        </div>
      </div>
    </div>

    <!-- MAIN CONTENT -->
    <div class="flex flex-col flex-1 min-h-0 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      
      <!-- TOOLBAR -->
      <div class="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center shrink-0">
        
        <div class="flex items-center gap-4 flex-wrap w-full sm:w-auto">
          <div class="flex items-center gap-2">
            <span class="text-sm font-bold text-slate-600 uppercase tracking-wider shrink-0">TGL:</span>
            <UInput type="date" v-model="startDate" class="w-40 font-semibold" />
            <span class="text-slate-500 font-bold">~</span>
            <UInput type="date" v-model="endDate" class="w-40 font-semibold" />
          </div>
          
          <UButton 
            icon="i-heroicons-magnifying-glass" 
            color="primary" 
            variant="solid" 
            class="font-bold tracking-wide shadow-sm"
            @click="handleFind"
            :loading="isLoading"
          >
            FIND
          </UButton>
        </div>

        <UButton 
          icon="i-heroicons-document-arrow-down" 
          color="emerald" 
          variant="solid" 
          class="font-bold tracking-wide shadow-sm"
          :disabled="reportData.length === 0"
          @click="handleExport"
        >
          EXPORT
        </UButton>
      </div>

      <!-- DATAGRID -->
      <div class="flex-1 overflow-auto custom-scrollbar relative min-h-[400px]">
        <UTable 
          :rows="reportData" 
          :columns="columns"
          :loading="isLoading"
          :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'Tidak ada data penjualan untuk rentang tanggal ini.' }"
          class="w-full"
          :ui="{
            wrapper: 'absolute inset-0',
            th: { base: 'whitespace-nowrap font-bold text-slate-700 bg-slate-50 top-0 sticky z-10 shadow-sm', padding: 'py-3 px-4' },
            td: { base: 'whitespace-nowrap text-slate-600', padding: 'py-2 px-4' }
          }"
        >
          <!-- Date Formatting -->
          <template #tanggal-data="{ row }">
            <span class="font-medium text-slate-700">{{ row.tanggal ? row.tanggal.substring(0, 10) : '' }}</span>
          </template>

          <!-- Numeric Formatting -->
          <template #qty-data="{ row }">
            <span class="font-mono font-medium">{{ row.qty || 0 }}</span>
          </template>
          <template #price-data="{ row }">
            <span class="font-mono font-medium">{{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.price || 0) }}</span>
          </template>
          <template #total-data="{ row }">
            <span class="font-mono font-medium text-indigo-600">{{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.total || 0) }}</span>
          </template>
          <template #potongan_header-data="{ row }">
            <span class="font-mono font-medium text-rose-600">{{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.potongan_header || 0) }}</span>
          </template>
          <template #total_header-data="{ row }">
            <span class="font-mono font-bold text-emerald-600">{{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.total_header || 0) }}</span>
          </template>

        </UTable>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
