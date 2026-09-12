<template>
  <div class="space-y-6">
    <!-- Chart 1: Sales In 7 Days -->
    <div class="bg-slate-800 border border-slate-700 rounded-lg shadow-sm overflow-hidden">
      <div class="border-b border-slate-700 px-5 py-4">
        <h3 class="text-lg font-bold text-white font-serif">Sales In 7 Days</h3>
      </div>
      <div class="p-5">
        <div v-if="pendingWeekly" class="h-80 w-full animate-pulse bg-slate-700 rounded-md"></div>
        <div v-else-if="weeklySeries.length > 0">
          <ClientOnly>
            <apexchart type="bar" height="350" :options="chartOptions(weeklyCategories)" :series="weeklySeries"></apexchart>
          </ClientOnly>
        </div>
        <div v-else class="h-80 flex items-center justify-center text-slate-500">
          Tidak ada data mingguan.
        </div>
      </div>
    </div>

    <!-- Chart 2: Monthly Performance (Year to Date) -->
    <div class="bg-slate-800 border border-slate-700 rounded-lg shadow-sm overflow-hidden">
      <div class="border-b border-slate-700 px-5 py-4">
        <h3 class="text-lg font-bold text-white font-serif">Monthly Performance (Year to Date)</h3>
      </div>
      <div class="p-5">
        <div v-if="pendingMonthly" class="h-80 w-full animate-pulse bg-slate-700 rounded-md"></div>
        <div v-else-if="monthlySeries.length > 0">
          <ClientOnly>
            <apexchart type="bar" height="350" :options="chartOptions(monthlyCategories)" :series="monthlySeries"></apexchart>
          </ClientOnly>
        </div>
        <div v-else class="h-80 flex items-center justify-center text-slate-500">
          Tidak ada data bulanan.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '~/composables/useAuth'

const props = defineProps({
  prodId: {
    type: Number,
    required: true
  }
})

const config = useRuntimeConfig()
const { accessToken } = useAuth()

const rawWeekly = ref<any[]>([])
const pendingWeekly = ref(false)
const rawMonthly = ref<any[]>([])
const pendingMonthly = ref(false)

const fetchData = async () => {
  pendingWeekly.value = true
  pendingMonthly.value = true
  try {
    const pWeekly = $fetch(`${config.public.apiBase || ''}/produksi/report-produksi/chart-income`, {
      headers: { 'Authorization': `Bearer ${accessToken.value}` },
      params: { v_prod_id: props.prodId }
    })
    
    const pMonthly = $fetch(`${config.public.apiBase || ''}/produksi/report-produksi/chart-income-year`, {
      headers: { 'Authorization': `Bearer ${accessToken.value}` },
      params: { v_prod_id: props.prodId }
    })

    const [resW, resM]: any = await Promise.all([pWeekly, pMonthly])
    rawWeekly.value = resW?.data || []
    rawMonthly.value = resM?.data || []
  } catch (err) {
    console.error('Failed to fetch chart data:', err)
  } finally {
    pendingWeekly.value = false
    pendingMonthly.value = false
  }
}

onMounted(() => {
  fetchData()
})

watch(() => props.prodId, () => {
  fetchData()
})

// Parse Data Helper
const parseChartData = (rawDataList: any[]) => {
  const categories: string[] = []
  const incomes: number[] = []
  const buys: number[] = []
  const retures: number[] = []
  const discounts: number[] = []

  rawDataList.forEach((item: any) => {
    categories.push(item.dates || '')
    incomes.push(Number(item.income) || 0)
    buys.push(Number(item.buy) || 0)
    retures.push(Number(item.reture) || 0)
    discounts.push(Number(item.discount) || 0)
  })

  return { categories, incomes, buys, retures, discounts }
}

// Extract Weekly Series
const weeklyData = computed(() => parseChartData(rawWeekly.value))
const weeklyCategories = computed(() => weeklyData.value.categories)
const weeklySeries = computed(() => [
  { name: 'Income', data: weeklyData.value.incomes },
  { name: 'Buy', data: weeklyData.value.buys },
  { name: 'Reture', data: weeklyData.value.retures },
  { name: 'Discount', data: weeklyData.value.discounts }
])

// Extract Monthly Series
const monthlyData = computed(() => parseChartData(rawMonthly.value))
const monthlyCategories = computed(() => monthlyData.value.categories)
const monthlySeries = computed(() => [
  { name: 'Income', data: monthlyData.value.incomes },
  { name: 'Buy', data: monthlyData.value.buys },
  { name: 'Reture', data: monthlyData.value.retures },
  { name: 'Discount', data: monthlyData.value.discounts }
])

// ApexCharts Common Options
const chartOptions = (categories: string[]) => ({
  chart: {
    type: 'bar',
    toolbar: { show: false },
    background: 'transparent',
    foreColor: '#94a3b8' // text-slate-400
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      columnWidth: '60%',
    }
  },
  colors: ['#0ea5e9', '#10b981', '#ef4444', '#f59e0b'], // Sky, Emerald, Red, Amber
  dataLabels: {
    enabled: false
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent']
  },
  xaxis: {
    categories: categories,
    axisBorder: { color: '#334155' },
    axisTicks: { color: '#334155' }
  },
  yaxis: {
    title: { text: 'Rupiah' },
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
  fill: {
    opacity: 1
  },
  tooltip: {
    theme: 'dark',
    y: {
      formatter: (val: number) => `Rp ${val.toLocaleString('id-ID')}`
    }
  }
})
</script>
