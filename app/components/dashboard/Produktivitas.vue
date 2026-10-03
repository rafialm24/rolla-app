<template>
  <div class="space-y-6">
    <div class="bg-slate-800 border border-slate-700 rounded-lg shadow-sm overflow-hidden p-5">
      
      <!-- Header & Filter -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 class="text-xl font-bold text-white font-serif">Produktivitas Produksi</h3>
          <p class="text-sm text-slate-400">KPI Kinerja dan output per jam produksi.</p>
        </div>
        <div class="flex items-center space-x-2">
          <!-- Month Picker -->
          <input type="month" v-model="periode" class="bg-slate-900 border border-slate-600 text-slate-300 text-sm rounded-md px-3 py-1.5 focus:outline-none focus:border-sky-500" />
          <button @click="fetchProduktivitas" class="bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold px-4 py-1.5 rounded-md transition-colors disabled:opacity-50" :disabled="pending">
            {{ pending ? 'Loading...' : 'TAMPILKAN' }}
          </button>
        </div>
      </div>

      <!-- KPI Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <!-- AVG -->
        <div class="bg-slate-900 border border-slate-700 rounded-md p-4 text-center">
          <div class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">AVG Produktivitas</div>
          <div class="text-2xl font-bold text-sky-400">{{ avgProduktivitas }} <span class="text-sm text-slate-500 font-normal">kg/jam</span></div>
        </div>
        <!-- MAX -->
        <div class="bg-slate-900 border border-slate-700 rounded-md p-4 text-center">
          <div class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">MAX Produktivitas</div>
          <div class="text-2xl font-bold text-emerald-400">{{ maxProduktivitas }} <span class="text-sm text-slate-500 font-normal">kg/jam</span></div>
        </div>
        <!-- MIN -->
        <div class="bg-slate-900 border border-slate-700 rounded-md p-4 text-center">
          <div class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">MIN Produktivitas</div>
          <div class="text-2xl font-bold text-rose-400">{{ minProduktivitas }} <span class="text-sm text-slate-500 font-normal">kg/jam</span></div>
        </div>
      </div>

      <!-- Charts -->
      <div v-if="!pending" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Line/Area Chart (Trend per Hari) -->
        <div class="border border-slate-700 rounded-lg p-4 bg-slate-800/50">
          <h4 class="text-sm font-semibold text-slate-300 mb-2">Trend Produktivitas (Bulan Ini)</h4>
          <ClientOnly>
            <apexchart v-if="trendSeries[0]?.data.length" type="area" height="300" :options="trendOptions" :series="trendSeries"></apexchart>
            <div v-else class="h-[300px] flex items-center justify-center text-slate-500">Tidak ada data trend.</div>
          </ClientOnly>
        </div>

        <!-- Bar Chart (Per Group) -->
        <div class="border border-slate-700 rounded-lg p-4 bg-slate-800/50">
          <h4 class="text-sm font-semibold text-slate-300 mb-2">Produktivitas Group Pekerjaan</h4>
          <ClientOnly>
            <apexchart v-if="groupSeries[0]?.data.length" type="bar" height="300" :options="groupOptions" :series="groupSeries"></apexchart>
            <div v-else class="h-[300px] flex items-center justify-center text-slate-500">Tidak ada data group.</div>
          </ClientOnly>
        </div>
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

const periode = ref('')

onMounted(() => {
  const now = new Date()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  periode.value = `${now.getFullYear()}-${mm}`
  fetchProduktivitas()
})

const rawData = ref<any[]>([])
const pending = ref(false)

const fetchProduktivitas = async () => {
  if (!periode.value) return
  pending.value = true
  try {
    const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/dhasbord/get-produktivitas-prod`, {
      headers: { 'Authorization': `Bearer ${accessToken.value}` },
      params: { v_id_prod: props.prodId, v_periode: periode.value }
    })
    rawData.value = res?.data || []
  } catch (err) {
    console.error('Failed to fetch produktivitas:', err)
  } finally {
    pending.value = false
  }
}

watch(() => props.prodId, () => fetchProduktivitas())

// Computations
const qtyList = computed(() => {
  const list = rawData.value.map(x => Number(x.jam_qty) || 0)
  return list.length > 0 ? list : [0]
})

const avgProduktivitas = computed(() => {
  const sum = qtyList.value.reduce((a, b) => a + b, 0)
  const avg = qtyList.value.length ? (sum / qtyList.value.length) : 0
  return avg.toLocaleString('id-ID', { maximumFractionDigits: 1 })
})

const maxProduktivitas = computed(() => {
  return Math.max(...qtyList.value).toLocaleString('id-ID', { maximumFractionDigits: 1 })
})

const minProduktivitas = computed(() => {
  return Math.min(...qtyList.value).toLocaleString('id-ID', { maximumFractionDigits: 1 })
})

// Trend Chart (Line/Area)
const trendCategories = computed(() => {
  // Extract unique dates or just use tgls
  // To avoid duplicates if the API returns multiple groups per day, we aggregate by day
  const dailyMap = new Map<string, number>()
  rawData.value.forEach(item => {
    if (item.tgls) {
      const current = dailyMap.get(item.tgls) || 0
      dailyMap.set(item.tgls, current + (Number(item.jam_qty) || 0))
    }
  })
  return Array.from(dailyMap.keys())
})

const trendSeries = computed(() => {
  const dailyMap = new Map<string, number>()
  rawData.value.forEach(item => {
    if (item.tgls) {
      const current = dailyMap.get(item.tgls) || 0
      dailyMap.set(item.tgls, current + (Number(item.jam_qty) || 0))
    }
  })
  return [{
    name: 'Produktivitas',
    data: Array.from(dailyMap.values())
  }]
})

const trendOptions = computed(() => ({
  chart: { type: 'area', toolbar: { show: false }, background: 'transparent', foreColor: '#c8ae8e' },
  colors: ['#d7a84e'],
  stroke: { curve: 'smooth', width: 2 },
  fill: {
    type: 'gradient',
    gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.1, stops: [0, 90, 100] }
  },
  dataLabels: { enabled: false },
  xaxis: { categories: trendCategories.value, axisBorder: { color: '#65432d' }, axisTicks: { color: '#65432d' } },
  yaxis: { title: { text: 'kg / jam' } },
  grid: { borderColor: '#5a3a27', strokeDashArray: 4 },
  tooltip: { theme: 'dark' }
}))

// Group Chart (Bar)
const groupCategories = computed(() => {
  const groupMap = new Map<string, number>()
  rawData.value.forEach(item => {
    if (item.name_grup) {
      const current = groupMap.get(item.name_grup) || 0
      groupMap.set(item.name_grup, current + (Number(item.jam_qty) || 0))
    }
  })
  return Array.from(groupMap.keys())
})

const groupSeries = computed(() => {
  const groupMap = new Map<string, number>()
  rawData.value.forEach(item => {
    if (item.name_grup) {
      const current = groupMap.get(item.name_grup) || 0
      groupMap.set(item.name_grup, current + (Number(item.jam_qty) || 0))
    }
  })
  return [{
    name: 'Group Pekerjaan',
    data: Array.from(groupMap.values())
  }]
})

const groupOptions = computed(() => ({
  chart: { type: 'bar', toolbar: { show: false }, background: 'transparent', foreColor: '#c8ae8e' },
  colors: ['#b47b38'],
  plotOptions: { bar: { borderRadius: 4, horizontal: true } },
  dataLabels: { enabled: false },
  xaxis: { categories: groupCategories.value, axisBorder: { color: '#65432d' }, axisTicks: { color: '#65432d' } },
  grid: { borderColor: '#5a3a27', strokeDashArray: 4 },
  tooltip: { theme: 'dark' }
}))
</script>
