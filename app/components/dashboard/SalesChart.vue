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

    <!-- Chart 3: Pembelian Produksi -->
    <div class="bg-slate-800 border border-slate-700 rounded-lg shadow-sm overflow-hidden">
      <div class="border-b border-slate-700 px-5 py-4">
        <h3 class="text-lg font-bold text-white font-serif">Pembelian Produksi</h3>
      </div>
      <div class="p-5">
        <div v-if="pendingPembelian" class="h-80 w-full animate-pulse bg-slate-700 rounded-md"></div>
        <div v-else-if="pembelianSeries.length > 0">
          <ClientOnly>
            <apexchart type="bar" height="350" :options="chartOptions(pembelianCategories)" :series="pembelianSeries"></apexchart>
          </ClientOnly>
        </div>
        <div v-else class="h-80 flex items-center justify-center text-slate-500">
          Tidak ada data pembelian produksi.
        </div>
      </div>
    </div>

    <!-- Chart 4: Produktivitas Produksi -->
    <div class="bg-slate-800 border border-slate-700 rounded-lg shadow-sm overflow-hidden">
      <div class="border-b border-slate-700 px-5 py-4">
        <h3 class="text-lg font-bold text-white font-serif">Produktivitas Produksi</h3>
      </div>
      <div class="p-5">
        <div v-if="pendingProduktivitas" class="h-80 w-full animate-pulse bg-slate-700 rounded-md"></div>
        <div v-else-if="produktivitasSeries.length > 0">
          <ClientOnly>
            <apexchart type="bar" height="350" :options="chartOptions(produktivitasCategories)" :series="produktivitasSeries"></apexchart>
          </ClientOnly>
        </div>
        <div v-else class="h-80 flex items-center justify-center text-slate-500">
          Tidak ada data produktivitas produksi.
        </div>
      </div>
    </div>

    <!-- Chart 5: Sales Cabang Produksi -->
    <div class="bg-slate-800 border border-slate-700 rounded-lg shadow-sm overflow-hidden">
      <div class="border-b border-slate-700 px-5 py-4">
        <h3 class="text-lg font-bold text-white font-serif">Sales Cabang Produksi</h3>
      </div>
      <div class="p-5">
        <div v-if="pendingSalesCabang" class="h-80 w-full animate-pulse bg-slate-700 rounded-md"></div>
        <div v-else-if="salesCabangSeries.length > 0">
          <ClientOnly>
            <apexchart type="bar" height="350" :options="chartOptions(salesCabangCategories)" :series="salesCabangSeries"></apexchart>
          </ClientOnly>
        </div>
        <div v-else class="h-80 flex items-center justify-center text-slate-500">
          Tidak ada data sales cabang produksi.
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

const rawPembelian = ref<any[]>([])
const pendingPembelian = ref(false)

const rawProduktivitas = ref<any[]>([])
const pendingProduktivitas = ref(false)

const rawSalesCabang = ref<any[]>([])
const pendingSalesCabang = ref(false)

const getDates = () => {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return {
    start: `${y}-${m}-01`,
    end: `${y}-${m}-${d}`,
    periode: `${y}${m}`
  }
}


const fetchData = async () => {
  pendingWeekly.value = true
  pendingMonthly.value = true
  pendingPembelian.value = true
  pendingProduktivitas.value = true
  pendingSalesCabang.value = true
  
  const dates = getDates()
  
  try {
    const pWeekly = $fetch(`${config.public.apiBase || ''}/produksi/dhasbord/get-dc-dhas-chart-prod`, {
      headers: { 'Authorization': `Bearer ${accessToken.value}` },
      params: { v_prod_id: props.prodId }
    })
    
    const pMonthly = $fetch(`${config.public.apiBase || ''}/produksi/dhasbord/get-dc-dhas-chart-prod-year`, {
      headers: { 'Authorization': `Bearer ${accessToken.value}` },
      params: { v_prod_id: props.prodId }
    })

    const pPembelian = $fetch(`${config.public.apiBase || ''}/produksi/dhasbord/get-pembelian-produksi`, {
      headers: { 'Authorization': `Bearer ${accessToken.value}` },
      params: { v_prod_id: props.prodId, v_start_date: dates.start, v_end_date: dates.end }
    })

    const pProduktivitas = $fetch(`${config.public.apiBase || ''}/produksi/dhasbord/get-produktivitas-prod`, {
      headers: { 'Authorization': `Bearer ${accessToken.value}` },
      params: { v_id_prod: props.prodId, v_periode: dates.periode }
    })

    const pSalesCabang = $fetch(`${config.public.apiBase || ''}/produksi/dhasbord/get-sales-cabang-prod`, {
      headers: { 'Authorization': `Bearer ${accessToken.value}` },
      params: { v_prod_id: props.prodId, v_start_date: dates.start, v_end_date: dates.end }
    })

    const [resW, resM, resPem, resProd, resSales]: any = await Promise.all([pWeekly, pMonthly, pPembelian, pProduktivitas, pSalesCabang])
    rawWeekly.value = resW?.data || []
    rawMonthly.value = resM?.data || []
    rawPembelian.value = resPem?.data || []
    rawProduktivitas.value = resProd?.data || []
    rawSalesCabang.value = resSales?.data || []
  } catch (err) {
    console.error('Failed to fetch chart data:', err)
  } finally {
    pendingWeekly.value = false
    pendingMonthly.value = false
    pendingPembelian.value = false
    pendingProduktivitas.value = false
    pendingSalesCabang.value = false
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

// Extract Pembelian Series
const pembelianData = computed(() => parseChartData(rawPembelian.value))
const pembelianCategories = computed(() => pembelianData.value.categories)
const pembelianSeries = computed(() => [
  { name: 'Income', data: pembelianData.value.incomes },
  { name: 'Buy', data: pembelianData.value.buys },
  { name: 'Reture', data: pembelianData.value.retures },
  { name: 'Discount', data: pembelianData.value.discounts }
])

// Extract Produktivitas Series
const produktivitasData = computed(() => parseChartData(rawProduktivitas.value))
const produktivitasCategories = computed(() => produktivitasData.value.categories)
const produktivitasSeries = computed(() => [
  { name: 'Income', data: produktivitasData.value.incomes },
  { name: 'Buy', data: produktivitasData.value.buys },
  { name: 'Reture', data: produktivitasData.value.retures },
  { name: 'Discount', data: produktivitasData.value.discounts }
])

// Extract Sales Cabang Series
const salesCabangData = computed(() => parseChartData(rawSalesCabang.value))
const salesCabangCategories = computed(() => salesCabangData.value.categories)
const salesCabangSeries = computed(() => [
  { name: 'Income', data: salesCabangData.value.incomes },
  { name: 'Buy', data: salesCabangData.value.buys },
  { name: 'Reture', data: salesCabangData.value.retures },
  { name: 'Discount', data: salesCabangData.value.discounts }
])


// ApexCharts Common Options
const chartOptions = (categories: string[]) => ({
  chart: {
    type: 'bar',
    toolbar: { show: false },
    background: 'transparent',
    foreColor: '#c8ae8e'
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      columnWidth: '60%',
    }
  },
  colors: ['#d7a84e', '#9f6b32', '#c45e49', '#f0cf7a'],
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
    axisBorder: { color: '#65432d' },
    axisTicks: { color: '#65432d' }
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
    borderColor: '#5a3a27',
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
