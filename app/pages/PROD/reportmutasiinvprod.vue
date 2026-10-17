<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useReportMutasiInvProd } from '~/composables/useReportMutasiInvProd'

definePageMeta({ layout: 'dashboard' })

const { reportData, isLoading, fetchReport, exportToCsv } = useReportMutasiInvProd()
const startDate = ref('')
const endDate = ref('')

const columnOrder = [
  'ID',
  'MUTASI DATE',
  'MU NUMBER',
  'KODE PROD',
  'NAME PROD',
  'KODE PRODUK',
  'NAME PRODUK',
  'NAME PROD UOM',
  'PRICE',
  'QTY',
  'TOTAL',
  'POSTING BY'
]

const columns = computed(() => {
  const firstRow = reportData.value[0]
  if (!firstRow) return []
  const keys = Object.keys(firstRow)
  const labelFor = (key: string) => key.replace(/_/g, ' ').toUpperCase()
  const orderedKeys = [
    ...columnOrder.flatMap(label => keys.filter(key => labelFor(key) === label)),
    ...keys.filter(key => !columnOrder.includes(labelFor(key)))
  ]

  return orderedKeys.map(key => ({
    key,
    label: labelFor(key)
  }))
})

const setDefaultDates = () => {
  const today = new Date()
  const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  startDate.value = date
  endDate.value = date
}

const handleFind = async () => {
  if (!startDate.value || !endDate.value) return
  await fetchReport(startDate.value, endDate.value)
}

onMounted(setDefaultDates)
</script>

<template>
  <div class="min-h-[calc(100vh-80px)] bg-slate-50 p-4 lg:p-8 font-sans flex flex-col gap-6">
    <header class="flex items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 shrink-0">
      <div class="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 shadow-inner">
        <UIcon name="i-heroicons-arrows-right-left" class="w-7 h-7" />
      </div>
      <div>
        <h1 class="text-2xl font-black text-slate-800 tracking-tight">Report Mutasi Inventory Produksi</h1>
        <p class="text-sm font-medium text-slate-500 mt-1">Riwayat mutasi inventory berdasarkan lokasi dan periode</p>
      </div>
    </header>

    <section class="flex flex-col flex-1 min-h-0 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center shrink-0">
        <div class="flex items-center gap-3 flex-wrap w-full sm:w-auto">
          <span class="text-sm font-bold text-slate-600 uppercase tracking-wider">Tanggal:</span>
          <UInput v-model="startDate" type="date" class="w-40 font-semibold" />
          <span class="text-slate-500 font-bold">~</span>
          <UInput v-model="endDate" type="date" class="w-40 font-semibold" />
          <UButton icon="i-heroicons-magnifying-glass" color="primary" class="font-bold tracking-wide" :loading="isLoading" @click="handleFind">
            CARI
          </UButton>
        </div>
        <UButton icon="i-heroicons-document-arrow-down" color="emerald" class="font-bold tracking-wide" :disabled="reportData.length === 0" @click="exportToCsv('report_mutasi_inventory_produksi.csv', columns.map(column => column.key))">
          EXPORT CSV
        </UButton>
      </div>

      <div class="flex-1 overflow-auto custom-scrollbar relative min-h-[400px]">
        <UTable
          :rows="reportData"
          :columns="columns"
          :loading="isLoading"
          :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'Tidak ada data mutasi untuk rentang tanggal ini.' }"
          class="w-full"
          :ui="{
            wrapper: 'absolute inset-0',
            th: { base: 'whitespace-nowrap font-bold text-slate-700 bg-slate-50 top-0 sticky z-10 shadow-sm', padding: 'py-3 px-4' },
            td: { base: 'whitespace-nowrap text-slate-600', padding: 'py-2 px-4' }
          }"
        />
      </div>
      <div class="px-4 py-3 border-t border-slate-100 bg-slate-50/50 text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">
        Total: {{ reportData.length }} baris
      </div>
    </section>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
</style>
