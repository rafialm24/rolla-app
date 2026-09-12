<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { usePurchaseForecast } from '~/composables/usePurchaseForecast'

definePageMeta({
  layout: 'dashboard'
})

const {
  categories,
  selectedCategory,
  forecastData,
  isLoading,
  fetchCategories,
  fetchForecast,
  exportToCsv
} = usePurchaseForecast()

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

onMounted(async () => {
  await fetchCategories()
})

// When category changes, fetch the forecast data
watch(selectedCategory, async (newVal) => {
  if (newVal) {
    await fetchForecast(newVal)
  } else {
    forecastData.value = []
  }
})

const handleExport = () => {
  exportToCsv('Master_Forecast_Distributor.csv')
}
</script>

<template>
  <div class="min-h-[calc(100vh-80px)] bg-slate-50 p-4 lg:p-8 font-sans flex flex-col gap-6">
    
    <!-- HEADER -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 shrink-0">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 shadow-inner">
          <UIcon name="i-heroicons-chart-bar-square" class="w-7 h-7" />
        </div>
        <div>
          <h1 class="text-2xl font-black text-slate-800 tracking-tight">Master Forecast Distributor</h1>
          <p class="text-sm font-medium text-slate-500 mt-1">Data Master Forecast & Kebutuhan Produksi</p>
        </div>
      </div>
    </div>

    <!-- MAIN CONTENT -->
    <div class="flex flex-col flex-1 min-h-0 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      
      <!-- TOOLBAR -->
      <div class="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center shrink-0">
        <div class="flex items-center gap-3 w-full sm:w-auto">
          <span class="text-sm font-bold text-slate-600 uppercase tracking-wider shrink-0">Kategory :</span>
          <USelectMenu
            v-model="selectedCategory"
            :options="categories"
            value-attribute="id"
            option-attribute="name_prod_cate"
            placeholder="--Select Kategory--"
            searchable
            searchable-placeholder="Cari kategori..."
            class="w-full sm:w-64"
            :ui="{ 
              base: 'font-semibold',
              color: { white: 'ring-1 ring-slate-300' }
            }"
          >
            <template #label>
              {{ selectedCategory ? categories.find(c => c.id === selectedCategory)?.name_prod_cate || 'Kategori Terpilih' : '--Select Kategory--' }}
            </template>
          </USelectMenu>
        </div>

        <UButton 
          icon="i-heroicons-document-arrow-down" 
          color="emerald" 
          variant="solid" 
          class="font-bold tracking-wide shadow-sm"
          :disabled="forecastData.length === 0"
          @click="handleExport"
        >
          EXPORT CSV
        </UButton>
      </div>

      <!-- DATAGRID -->
      <div class="flex-1 overflow-auto custom-scrollbar relative min-h-[400px]">
        <UTable 
          :rows="forecastData" 
          :columns="columns"
          :loading="isLoading"
          :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'Tidak ada data forecast untuk kategori ini.' }"
          class="w-full"
          :ui="{
            wrapper: 'absolute inset-0',
            th: { base: 'whitespace-nowrap font-bold text-slate-700 bg-slate-50 top-0 sticky z-10 shadow-sm', padding: 'py-3 px-4' },
            td: { base: 'whitespace-nowrap text-slate-600', padding: 'py-2 px-4' }
          }"
        >
          <!-- Custom rendering for numeric columns if needed -->
          <template #stock_gudang-data="{ row }">
            <span class="font-mono font-medium">{{ row.stock_gudang || 0 }}</span>
          </template>
          <template #stock_toko-data="{ row }">
            <span class="font-mono font-medium">{{ row.stock_toko || 0 }}</span>
          </template>
          <template #max_toko-data="{ row }">
            <span class="font-mono font-medium">{{ row.max_toko || 0 }}</span>
          </template>
          <template #kebutuhan-data="{ row }">
            <span class="font-mono font-bold text-amber-600">{{ row.kebutuhan || 0 }}</span>
          </template>
          <template #forecase-data="{ row }">
            <span class="font-mono font-bold text-indigo-600">{{ row.forecase || 0 }}</span>
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
