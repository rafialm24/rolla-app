<template>
  <NuxtLayout name="dashboard">
    <div class="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200 p-4 lg:p-8 font-sans relative overflow-hidden">
      <!-- Decorative Background Elements -->
      <div class="absolute top-0 left-0 w-96 h-96 bg-sky-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div class="absolute top-0 right-0 w-96 h-96 bg-emerald-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      
      <!-- Top Header (Glassmorphism) -->
      <div class="relative backdrop-blur-xl bg-white/80 rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white mb-8 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/30">
            <UIcon name="i-heroicons-cpu-chip" class="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 class="text-2xl font-black text-slate-800 tracking-tight">Production Floor</h1>
            <p class="text-xs font-semibold text-slate-500 tracking-wide mt-0.5 uppercase">Real-Time MES Dashboard</p>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-4 w-full xl:w-auto">
          <!-- Premium Legend -->
          <div class="flex items-center gap-4 bg-slate-100/50 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-slate-200/60">
            <div class="flex items-center gap-2"><span class="relative flex h-3 w-3"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span><span class="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span></span><span class="text-xs font-bold text-slate-700">Completed</span></div>
            <div class="w-px h-4 bg-slate-300"></div>
            <div class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.6)]"></span><span class="text-xs font-bold text-slate-700">In Progress</span></div>
            <div class="w-px h-4 bg-slate-300"></div>
            <div class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-slate-400"></span><span class="text-xs font-bold text-slate-700">Upcoming</span></div>
          </div>

          <!-- Time & Filter -->
          <div class="flex items-center gap-3 bg-white/50 p-1.5 rounded-2xl border border-slate-200/60 shadow-sm">
            <div class="hidden xl:flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl shadow-inner">
              <UIcon name="i-heroicons-clock" class="w-4 h-4 text-sky-400" />
              <span class="text-sm font-bold tracking-wider">{{ currentTime }}</span>
            </div>
            <UInput 
              type="date" 
              v-model="filterDate" 
              @change="loadList"
              icon="i-heroicons-calendar-days"
              size="lg"
              :ui="{ base: 'font-bold text-slate-700 bg-white/80 backdrop-blur-sm', rounded: 'rounded-xl', color: { white: { outline: 'ring-0 border-none shadow-none focus:ring-2 focus:ring-sky-500' } } }"
            />
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoadingList" class="flex flex-col justify-center items-center py-32 relative z-10">
        <div class="relative w-16 h-16">
          <div class="absolute inset-0 border-4 border-sky-100 rounded-full"></div>
          <div class="absolute inset-0 border-4 border-sky-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p class="mt-4 text-sm font-bold text-slate-500 animate-pulse">Syncing production lines...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="mesProductionList.length === 0" class="relative z-10 max-w-lg mx-auto mt-20">
        <div class="backdrop-blur-xl bg-white/60 rounded-[2rem] p-12 text-center border border-white shadow-xl shadow-slate-200/50">
          <div class="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <UIcon name="i-heroicons-inbox" class="w-10 h-10 text-slate-400" />
          </div>
          <h3 class="text-lg font-black text-slate-800 mb-2">No Active Orders</h3>
          <p class="text-sm font-medium text-slate-500">There are no production orders scheduled for the selected date.</p>
        </div>
      </div>

      <!-- Custom Grid Layout -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 relative z-10 pb-10">
        <div 
          v-for="(row, idx) in mesProductionList" 
          :key="row.id || idx"
          class="group relative backdrop-blur-sm bg-white/90 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col"
        >
          <!-- Glowing Status Header -->
          <div class="h-2 w-full transition-colors duration-500" :class="getPremiumStatusLine(row.status)"></div>
          
          <div class="p-5 flex-1 flex flex-col">
            <!-- Order Info -->
            <div class="mb-5 relative">
              <div class="absolute top-0 right-0 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shadow-sm border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-3.5 h-3.5 text-slate-400" />
              </div>
              <p class="text-[10px] font-bold text-sky-600 tracking-widest uppercase mb-1 flex items-center gap-1">
                <UIcon name="i-heroicons-tag" class="w-3 h-3" /> {{ row.artikel }}
              </p>
              <h3 class="text-sm font-extrabold text-slate-800 leading-snug line-clamp-2 pr-8">{{ row.artikel_name }}</h3>
              <p class="text-[10px] font-semibold text-slate-400 mt-2 flex items-center gap-1">
                <UIcon name="i-heroicons-calendar" class="w-3.5 h-3.5" /> {{ formatDateTimeShort(row.start_date) }}
              </p>
            </div>
            
            <!-- Modern Inputs Data -->
            <div class="mt-auto space-y-2 bg-slate-50/50 rounded-2xl p-3 border border-slate-100">
              <!-- QTY PROD (Target) -->
              <div class="flex items-center justify-between p-2 rounded-xl bg-white shadow-sm border border-slate-100">
                <span class="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Target ({{ row.uom_article }})</span>
                <span class="text-xs font-black text-slate-700">{{ row.qty_produksi }}</span>
              </div>
              
              <!-- QTY GOOD -->
              <div class="flex items-center justify-between p-1.5 rounded-xl transition-colors focus-within:bg-emerald-50 focus-within:ring-1 focus-within:ring-emerald-200 group/input">
                <span class="text-[10px] text-emerald-600 font-bold uppercase tracking-widest pl-2">Good</span>
                <input 
                  type="number" 
                  v-model="row._qty_good" 
                  :disabled="row.status !== 1" 
                  class="w-16 bg-transparent text-right text-xs font-black text-emerald-700 p-1 focus:outline-none disabled:opacity-50"
                  :class="row.status === 1 ? 'border-b-2 border-emerald-200 focus:border-emerald-500' : 'border-transparent'"
                />
              </div>
              
              <!-- QTY DEFECT -->
              <div class="flex items-center justify-between p-1.5 rounded-xl transition-colors focus-within:bg-rose-50 focus-within:ring-1 focus-within:ring-rose-200">
                <span class="text-[10px] text-rose-500 font-bold uppercase tracking-widest pl-2">Defect</span>
                <input 
                  type="number" 
                  v-model="row._qty_defect" 
                  :disabled="row.status !== 1" 
                  class="w-16 bg-transparent text-right text-xs font-black text-rose-600 p-1 focus:outline-none disabled:opacity-50"
                  :class="row.status === 1 ? 'border-b-2 border-rose-200 focus:border-rose-500' : 'border-transparent'"
                />
              </div>

              <!-- QTY OTHER -->
              <div class="flex items-center justify-between p-1.5 rounded-xl transition-colors focus-within:bg-slate-100 focus-within:ring-1 focus-within:ring-slate-300">
                <span class="text-[10px] text-slate-500 font-bold uppercase tracking-widest pl-2">Other</span>
                <input 
                  type="number" 
                  v-model="row._qty_other" 
                  :disabled="row.status !== 1" 
                  class="w-16 bg-transparent text-right text-xs font-black text-slate-700 p-1 focus:outline-none disabled:opacity-50"
                  :class="row.status === 1 ? 'border-b-2 border-slate-200 focus:border-slate-500' : 'border-transparent'"
                />
              </div>
            </div>
          </div>
          
          <!-- Modern Action Footer -->
          <div class="p-4 bg-slate-50/80 backdrop-blur-md border-t border-slate-100 flex flex-col gap-2">
            <button 
              @click="handleActionStart(row)"
              class="w-full py-3 px-4 rounded-xl text-[11px] font-black uppercase tracking-widest text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-95"
              :class="getPremiumButtonClass(row.status)"
              :disabled="row.status === 2"
            >
              <UIcon v-if="row.status === 2" name="i-heroicons-check-badge" class="w-5 h-5" />
              <UIcon v-if="row.status === 1" name="i-heroicons-cog-6-tooth" class="w-4 h-4 animate-spin-slow" />
              <UIcon v-if="row.status === 0" name="i-heroicons-play-circle" class="w-4 h-4" />
              {{ getActionStatusText(row.status) }}
            </button>
            
            <button 
              v-if="row.status === 1"
              @click="handleActionPending(row)"
              class="w-full py-2.5 px-4 rounded-xl text-[10px] font-extrabold uppercase tracking-widest bg-amber-100 text-amber-700 hover:bg-amber-200 hover:text-amber-800 transition-all active:scale-95 border border-amber-200"
              :disabled="row.qty_goodd !== 0 || row._isPending"
            >
              <span v-if="row._isPending" class="flex items-center justify-center gap-2">
                <UIcon name="i-heroicons-arrow-path" class="w-3.5 h-3.5 animate-spin" /> Processing...
              </span>
              <span v-else class="flex items-center justify-center gap-1.5">
                <UIcon name="i-heroicons-pause-circle" class="w-4 h-4" /> Pause / Pending
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useProduksi } from '../../composables/useProduksi'
import { useMesProduction } from '../../composables/useMesProduction'

const { activeProdId } = useProduksi()
const { isLoadingList, mesProductionList, fetchMesProductionList, actionProduksiCoba, actionProduksiPending } = useMesProduction()

const getLocalToday = () => {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
const filterDate = ref(getLocalToday())
const currentTime = ref('')

const loadList = async () => {
  if (!activeProdId.value) return
  await fetchMesProductionList({
    v_start_date: filterDate.value,
    v_id_prod: activeProdId.value,
    page: 1,
    rows: 100, 
    typeId: 2
  })

  if (mesProductionList.value) {
    for (const row of mesProductionList.value) {
      row._qty_good = row.qty_good || 0
      row._qty_defect = row.defect_qty || 0
      row._qty_other = 0 
      row._isPending = false
    }
  }
}

onMounted(() => {
  const updateTime = () => {
    const d = new Date()
    currentTime.value = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase()
  }
  updateTime()
  setInterval(updateTime, 60000)
  
  if (activeProdId.value) {
    loadList()
  }
})

const getPremiumStatusLine = (status: number) => {
  if (status === 1) return 'bg-gradient-to-r from-orange-400 to-amber-500 shadow-[0_0_10px_rgba(251,146,60,0.5)]'
  if (status === 2) return 'bg-gradient-to-r from-teal-400 to-emerald-500 shadow-[0_0_10px_rgba(52,211,153,0.5)]'
  return 'bg-slate-200'
}

const getPremiumButtonClass = (status: number) => {
  if (status === 0) return 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-blue-500/30'
  if (status === 1) return 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 shadow-orange-500/30'
  if (status === 2) return 'bg-gradient-to-r from-teal-500 to-emerald-500 opacity-90 cursor-not-allowed shadow-none'
  return 'bg-slate-600'
}

const getActionStatusText = (status: number) => {
  if (status === 0) return 'Start'
  if (status === 1) return 'Progres Finish'
  if (status === 2) return 'Complete'
  return 'Unknown'
}

const formatDateTimeShort = (val: any) => {
  if (!val) return '-'
  const d = new Date(val)
  if (isNaN(d.getTime())) return val
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')
}

const handleActionStart = async (row: any) => {
  if (!activeProdId.value) return
  
  const q_prod = parseInt(row.qty_produksi || 0)
  const q_good = parseInt(row._qty_good || 0)
  const q_defect = parseInt(row._qty_defect || 0)
  const q_other = parseInt(row._qty_other || 0)

  if (q_defect > q_prod) {
    alert('Qty Defect Melebihi Qty Produksi')
    return
  } else if (q_good > q_prod) {
    alert('Qty Finish Good Melebihi Qty Produksi')
    return
  } else if (q_defect > q_good) {
    alert('Qty Defect Melebihi Qty Finish Good')
    return
  }

  const payload = {
    v_id: row.id,
    v_status: row.status,
    v_qty_defect: q_defect,
    v_qty_other: q_other,
    v_qty_remain: q_prod - q_good - q_defect,
    v_qty_good: q_good,
    v_id_prod: activeProdId.value
  }

  const res = await actionProduksiCoba(payload)
  if (res && res.success !== false) {
    loadList()
  } else {
    alert('Gagal memproses aksi')
  }
}

const handleActionPending = async (row: any) => {
  if (!activeProdId.value) return
  
  const q_prod = parseInt(row.qty_produksi || 0)
  const q_good = parseInt(row._qty_good || 0)
  const q_defect = parseInt(row._qty_defect || 0)
  const q_other = parseInt(row._qty_other || 0)

  if (q_defect > q_prod) {
    alert('Qty Defect Melebihi Qty Produksi')
    return
  } else if (q_good > q_prod) {
    alert('Qty Finish Good Melebihi Qty Produksi')
    return
  } else if (q_defect > q_good) {
    alert('Qty Defect Melebihi Qty Finish Good')
    return
  }

  row._isPending = true

  const payload = {
    v_id: row.id,
    v_status: row.status,
    v_qty_defect: q_defect,
    v_qty_other: q_other,
    v_qty_remain: q_prod - q_good - q_defect,
    v_qty_good: q_good,
    v_id_prod: activeProdId.value
  }

  const res = await actionProduksiPending(payload)
  if (res && res.success !== false) {
    alert("Data berhasil dipending.")
    loadList()
  } else {
    alert("Terjadi kesalahan. Coba lagi.")
    row._isPending = false
  }
}

watch(activeProdId, () => {
  if (activeProdId.value) {
    loadList()
  }
})
</script>