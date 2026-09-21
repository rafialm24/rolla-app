<template>
  <div>
    <!-- Loading State -->
    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <div v-for="i in 4" :key="i" class="bg-slate-800 border border-slate-700 h-32 rounded-2xl animate-pulse"></div>
    </div>

    <!-- KPI Cards -->
    <div v-else-if="chartData && chartData.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      
      <!-- TOTAL SALES -->
      <div class="bg-slate-800 border border-slate-700 rounded-2xl p-5 flex flex-col justify-between shadow-[0_14px_30px_rgba(63,35,20,0.12)] relative overflow-hidden group hover:border-amber-400/50 transition-colors">
        <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <svg class="w-16 h-16 text-sky-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
        </div>
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Sales</span>
            <span class="bg-sky-500/20 text-sky-400 text-[10px] font-bold px-2 py-0.5 rounded">Hari Ini</span>
          </div>
          <h3 class="text-2xl font-bold text-white mb-1">{{ todayData.income || '0' }}</h3>
        </div>
        <div class="mt-4 flex flex-col space-y-1 text-xs">
          <div class="flex items-center justify-between text-slate-400">
            <span>{{ yesterdayData.day }} {{ yesterdayData.dates }}</span>
            <span class="font-semibold text-slate-300">{{ yesterdayData.income || '0' }}</span>
          </div>
          <div class="flex items-center justify-between text-slate-500">
            <span>{{ dayBeforeData.day }} {{ dayBeforeData.dates }}</span>
            <span>{{ dayBeforeData.income || '0' }}</span>
          </div>
        </div>
      </div>

      <!-- BUY -->
      <div class="bg-slate-800 border border-slate-700 rounded-2xl p-5 flex flex-col justify-between shadow-[0_14px_30px_rgba(63,35,20,0.12)] relative overflow-hidden group hover:border-amber-400/50 transition-colors">
        <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <svg class="w-16 h-16 text-amber-500" fill="currentColor" viewBox="0 0 24 24"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0020 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>
        </div>
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Buy</span>
            <span class="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded">Hari Ini</span>
          </div>
          <h3 class="text-2xl font-bold text-white mb-1">{{ todayData.buy || '0' }}</h3>
        </div>
        <div class="mt-4 flex flex-col space-y-1 text-xs">
          <div class="flex items-center justify-between text-slate-400">
            <span>{{ yesterdayData.day }} {{ yesterdayData.dates }}</span>
            <span class="font-semibold text-slate-300">{{ yesterdayData.buy || '0' }}</span>
          </div>
          <div class="flex items-center justify-between text-slate-500">
            <span>{{ dayBeforeData.day }} {{ dayBeforeData.dates }}</span>
            <span>{{ dayBeforeData.buy || '0' }}</span>
          </div>
        </div>
      </div>

      <!-- RETURE -->
      <div class="bg-slate-800 border border-slate-700 rounded-2xl p-5 flex flex-col justify-between shadow-[0_14px_30px_rgba(63,35,20,0.12)] relative overflow-hidden group hover:border-amber-400/50 transition-colors">
        <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <svg class="w-16 h-16 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"/></svg>
        </div>
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Reture</span>
            <span class="bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded">Hari Ini</span>
          </div>
          <h3 class="text-2xl font-bold text-white mb-1">{{ todayData.reture || '0' }}</h3>
        </div>
        <div class="mt-4 flex flex-col space-y-1 text-xs">
          <div class="flex items-center justify-between text-slate-400">
            <span>{{ yesterdayData.day }} {{ yesterdayData.dates }}</span>
            <span class="font-semibold text-slate-300">{{ yesterdayData.reture || '0' }}</span>
          </div>
          <div class="flex items-center justify-between text-slate-500">
            <span>{{ dayBeforeData.day }} {{ dayBeforeData.dates }}</span>
            <span>{{ dayBeforeData.reture || '0' }}</span>
          </div>
        </div>
      </div>

      <!-- DISCOUNT -->
      <div class="bg-slate-800 border border-slate-700 rounded-2xl p-5 flex flex-col justify-between shadow-[0_14px_30px_rgba(63,35,20,0.12)] relative overflow-hidden group hover:border-amber-400/50 transition-colors">
        <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <svg class="w-16 h-16 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
        </div>
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Discount</span>
            <span class="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded">Hari Ini</span>
          </div>
          <h3 class="text-2xl font-bold text-white mb-1">{{ todayData.discountStr || todayData.discount || '0' }}</h3>
        </div>
        <div class="mt-4 flex flex-col space-y-1 text-xs">
          <div class="flex items-center justify-between text-slate-400">
            <span>{{ yesterdayData.day }} {{ yesterdayData.dates }}</span>
            <span class="font-semibold text-slate-300">{{ yesterdayData.discount || '0' }}</span>
          </div>
          <div class="flex items-center justify-between text-slate-500">
            <span>{{ dayBeforeData.day }} {{ dayBeforeData.dates }}</span>
            <span>{{ dayBeforeData.discount || '0' }}</span>
          </div>
        </div>
      </div>

    </div>

    <!-- Empty/Error State -->
    <div v-else class="bg-slate-800 border border-slate-700 rounded-2xl p-6 text-center shadow-[0_14px_30px_rgba(63,35,20,0.12)]">
      <p class="text-slate-400 text-sm">Tidak ada data performa untuk lokasi ini.</p>
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

const rawData = ref<any[]>([])
const pending = ref(false)

const fetchData = async () => {
  pending.value = true
  try {
    const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/report-produksi/chart-income`, {
      headers: {
        'Authorization': `Bearer ${accessToken.value}`
      },
      params: {
        v_prod_id: props.prodId
      }
    })
    rawData.value = res?.data || []
  } catch (err) {
    console.error('Failed to fetch KPI chart data:', err)
  } finally {
    pending.value = false
  }
}

onMounted(() => {
  fetchData()
})

watch(() => props.prodId, () => {
  fetchData()
})

// Extract Chart Data
const chartData = computed(() => {
  return rawData.value
})

// Helpers for the last 3 days
const todayData = computed(() => {
  const d = chartData.value
  return d.length >= 7 ? d[6] : (d[d.length - 1] || {})
})

const yesterdayData = computed(() => {
  const d = chartData.value
  return d.length >= 7 ? d[5] : (d[d.length - 2] || {})
})

const dayBeforeData = computed(() => {
  const d = chartData.value
  return d.length >= 7 ? d[4] : (d[d.length - 3] || {})
})
</script>
