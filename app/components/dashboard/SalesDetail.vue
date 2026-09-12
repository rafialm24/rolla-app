<template>
  <div class="bg-slate-800 border border-slate-700 rounded-lg shadow-sm overflow-hidden">
    <div class="border-b border-slate-700 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <h3 class="text-lg font-bold text-white font-serif">Sales Detail</h3>
      
      <!-- Date Filter -->
      <div class="flex items-center space-x-2">
        <input type="date" v-model="startDate" class="bg-slate-900 border border-slate-600 text-slate-300 text-sm rounded-md px-3 py-1.5 focus:outline-none focus:border-sky-500" />
        <span class="text-slate-500">-</span>
        <input type="date" v-model="endDate" class="bg-slate-900 border border-slate-600 text-slate-300 text-sm rounded-md px-3 py-1.5 focus:outline-none focus:border-sky-500" />
        <button @click="fetchDetail" class="bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold px-4 py-1.5 rounded-md transition-colors disabled:opacity-50" :disabled="pending">
          {{ pending ? 'Loading...' : 'CEK' }}
        </button>
      </div>
    </div>
    
    <div class="p-5">
      <!-- Error / Empty State -->
      <div v-if="error" class="text-red-400 text-center py-4">{{ error }}</div>
      <div v-else-if="!summaryData && !pending" class="text-slate-500 text-center py-4">Pilih tanggal dan klik CEK untuk melihat data.</div>
      
      <!-- Data Table -->
      <div v-if="summaryData" class="overflow-x-auto mb-6">
        <table class="w-full text-sm text-left text-slate-300 border-collapse">
          <thead class="text-xs uppercase bg-slate-700 text-slate-300">
            <tr>
              <th class="px-4 py-3 border border-slate-600">Kategori</th>
              <th class="px-4 py-3 border border-slate-600 bg-sky-900/50 text-center text-sky-200">Target Harian</th>
              <th class="px-4 py-3 border border-slate-600 bg-sky-900/50 text-center text-sky-200">Rata Rata</th>
              <th class="px-4 py-3 border border-slate-600">Status</th>
              <th class="px-4 py-3 border border-slate-600 bg-emerald-900/50 text-center text-emerald-200">Belanja Total</th>
              <th class="px-4 py-3 border border-slate-600 bg-emerald-900/50 text-center text-emerald-200">Setoran Total</th>
              <th class="px-4 py-3 border border-slate-600 bg-emerald-900/50 text-center text-emerald-200">Margin Total</th>
              <th class="px-4 py-3 border border-slate-600 bg-emerald-900/50 text-center text-emerald-200">Beban Total</th>
              <th class="px-4 py-3 border border-slate-600 bg-emerald-900/50 text-center text-emerald-200">Profit Total</th>
            </tr>
          </thead>
          <tbody>
            <!-- Row 1: Belanja / Realisasi -->
            <tr class="hover:bg-slate-700/50 transition-colors">
              <td class="px-4 py-3 border border-slate-600 font-semibold">Belanja</td>
              <td class="px-4 py-3 border border-slate-600 text-right">{{ formatNumber(summaryData.target_belanja_day) }}</td>
              <td class="px-4 py-3 border border-slate-600 text-right">{{ formatNumber(summaryData.avg_belanja) }}</td>
              <td class="px-4 py-3 border border-slate-600 font-semibold text-emerald-400">Realisasi</td>
              <td class="px-4 py-3 border border-slate-600 text-right text-emerald-300">{{ formatNumber(summaryData.real_belanja) }}</td>
              <td class="px-4 py-3 border border-slate-600 text-right text-emerald-300">{{ formatNumber(summaryData.real_omset) }}</td>
              <td class="px-4 py-3 border border-slate-600 text-right text-emerald-300">{{ formatNumber(summaryData.real_margin) }}</td>
              <td class="px-4 py-3 border border-slate-600 text-right text-red-300">{{ formatNumber(summaryData.total_beban_usaha) }}</td>
              <td class="px-4 py-3 border border-slate-600 text-right font-bold text-emerald-400">{{ formatNumber(summaryData.tota_provit) }}</td>
            </tr>
            <!-- Row 2: Omset / Target -->
            <tr class="hover:bg-slate-700/50 transition-colors bg-slate-800/30">
              <td class="px-4 py-3 border border-slate-600 font-semibold">Omset</td>
              <td class="px-4 py-3 border border-slate-600 text-right">{{ formatNumber(summaryData.target_omset_day) }}</td>
              <td class="px-4 py-3 border border-slate-600 text-right">{{ formatNumber(summaryData.avg_omset) }}</td>
              <td class="px-4 py-3 border border-slate-600 font-semibold text-sky-400">Target</td>
              <td class="px-4 py-3 border border-slate-600 text-right">{{ formatNumber(summaryData.total_target_belanja) }}</td>
              <td class="px-4 py-3 border border-slate-600 text-right">{{ formatNumber(summaryData.total_target_omset) }}</td>
              <td class="px-4 py-3 border border-slate-600 text-right">{{ formatNumber(summaryData.total_target_margin) }}</td>
              <td class="px-4 py-3 border border-slate-600 bg-slate-700/20"></td>
              <td class="px-4 py-3 border border-slate-600 bg-slate-700/20"></td>
            </tr>
            <!-- Row 3: Margin / Pencapaian -->
            <tr class="hover:bg-slate-700/50 transition-colors">
              <td class="px-4 py-3 border border-slate-600 font-semibold">Margin</td>
              <td class="px-4 py-3 border border-slate-600 text-right">{{ formatNumber(summaryData.margin_target) }}</td>
              <td class="px-4 py-3 border border-slate-600 text-right">{{ formatNumber(summaryData.avg_margin) }}</td>
              <td class="px-4 py-3 border border-slate-600 font-semibold text-amber-400">Pencapaian (%)</td>
              <td class="px-4 py-3 border border-slate-600 text-right">{{ formatPercent(summaryData.real_belanja, summaryData.total_target_belanja) }}</td>
              <td class="px-4 py-3 border border-slate-600 text-right">{{ formatPercent(summaryData.real_omset, summaryData.total_target_omset) }}</td>
              <td class="px-4 py-3 border border-slate-600 text-right">{{ formatPercent(summaryData.real_margin, summaryData.total_target_margin) }}</td>
              <td class="px-4 py-3 border border-slate-600 bg-slate-700/20"></td>
              <td class="px-4 py-3 border border-slate-600 bg-slate-700/20"></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Chart -->
      <div v-if="chartSeries.length > 0">
        <ClientOnly>
          <apexchart type="bar" height="350" :options="chartOptions" :series="chartSeries"></apexchart>
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'

const props = defineProps({
  prodId: {
    type: Number,
    required: true
  }
})

const config = useRuntimeConfig()
const { accessToken } = useAuth()

// Date state (default to current month start & end)
const startDate = ref('')
const endDate = ref('')

onMounted(() => {
  const now = new Date()
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
  
  startDate.value = firstDay.toISOString().split('T')[0]
  endDate.value = now.toISOString().split('T')[0]
  
  // Initial fetch
  fetchDetail()
})

// Data state
const rawData = ref<any[]>([])
const pending = ref(false)
const error = ref('')

const fetchDetail = async () => {
  if (!startDate.value || !endDate.value) return
  
  pending.value = true
  error.value = ''
  
  try {
    const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/report-produksi/chart-income-detail`, {
      headers: { 'Authorization': `Bearer ${accessToken.value}` },
      params: {
        v_prod_id: props.prodId,
        v_start_date: startDate.value,
        v_end_date: endDate.value
      }
    })
    
    rawData.value = res?.data || []
  } catch (err: any) {
    error.value = err.message || 'Gagal memuat data.'
  } finally {
    pending.value = false
  }
}

// Watch for prodId changes to refetch
watch(() => props.prodId, () => {
  fetchDetail()
})

// Summary Data (First row of API response usually contains the summaries)
const summaryData = computed(() => {
  if (rawData.value.length > 0) {
    return rawData.value[0]
  }
  return null
})

// Format helpers
const formatNumber = (num: any) => {
  if (!num) return '0'
  return Number(num).toLocaleString('id-ID')
}

const formatPercent = (real: any, target: any) => {
  const r = Number(real) || 0
  const t = Number(target) || 0
  if (t === 0) return '0%'
  return ((r / t) * 100).toLocaleString('id-ID', { maximumFractionDigits: 2 }) + '%'
}

// Chart Computed Properties
const chartCategories = computed(() => rawData.value.map(x => x.tanggal || ''))
const chartSeries = computed(() => {
  if (rawData.value.length === 0) return []
  return [
    { name: 'Belanja', data: rawData.value.map(x => Number(x.belanja) || 0) },
    { name: 'Omset', data: rawData.value.map(x => Number(x.provit_prod) || 0) },
    { name: 'Profit', data: rawData.value.map(x => Number(x.profit) || 0) },
    { name: 'Margin', data: rawData.value.map(x => Number(x.margin) || 0) }
  ]
})

// ApexCharts Options
const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    toolbar: { show: false },
    background: 'transparent',
    foreColor: '#94a3b8'
  },
  colors: ['#10b981', '#0ea5e9', '#eab308', '#ef4444'], // Emerald (Belanja), Sky (Omset), Yellow (Profit), Red (Margin)
  plotOptions: {
    bar: {
      borderRadius: 4,
      columnWidth: '70%',
    }
  },
  dataLabels: { enabled: false },
  stroke: { show: true, width: 2, colors: ['transparent'] },
  xaxis: {
    categories: chartCategories.value,
    axisBorder: { color: '#334155' },
    axisTicks: { color: '#334155' }
  },
  yaxis: {
    labels: {
      formatter: (value: number) => {
        return value >= 1000000 
          ? (value / 1000000).toFixed(1) + 'M' 
          : value >= 1000 ? (value / 1000).toFixed(1) + 'K' : value
      }
    }
  },
  grid: {
    borderColor: '#334155',
    strokeDashArray: 4,
  },
  tooltip: {
    theme: 'dark',
    y: {
      formatter: (val: number) => `Rp ${val.toLocaleString('id-ID')}`
    }
  }
}))
</script>
