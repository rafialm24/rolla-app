<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Pareto Table -->
    <div class="bg-slate-800 border border-slate-700 rounded-lg shadow-sm overflow-hidden flex flex-col">
      <div class="border-b border-slate-700 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 class="text-lg font-bold text-white font-serif">Data Pareto</h3>
        
        <!-- Date Filter -->
        <div class="flex items-center space-x-2">
          <input type="date" v-model="startDate" class="bg-slate-900 border border-slate-600 text-slate-300 text-sm rounded-md px-2 py-1 focus:outline-none focus:border-sky-500 w-32" />
          <span class="text-slate-500">-</span>
          <input type="date" v-model="endDate" class="bg-slate-900 border border-slate-600 text-slate-300 text-sm rounded-md px-2 py-1 focus:outline-none focus:border-sky-500 w-32" />
          <button @click="fetchPareto" class="bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold px-3 py-1 rounded-md transition-colors disabled:opacity-50" :disabled="pendingPareto">
            {{ pendingPareto ? '...' : 'CEK' }}
          </button>
        </div>
      </div>
      
      <div class="p-0 overflow-y-auto custom-scrollbar h-96 relative">
        <div v-if="pendingPareto" class="absolute inset-0 flex items-center justify-center bg-slate-800/80 z-10">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
        </div>
        
        <table class="w-full text-sm text-left text-slate-300 border-collapse relative">
          <thead class="text-xs uppercase bg-slate-700 text-slate-300 sticky top-0 z-10 shadow-sm">
            <tr>
              <th class="px-4 py-3">ID</th>
              <th class="px-4 py-3">Action</th>
              <th class="px-4 py-3">Nama Produk</th>
              <th class="px-4 py-3">UOM</th>
              <th class="px-4 py-3 text-right">Qty</th>
              <th class="px-4 py-3 text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="paretoData.length === 0 && !pendingPareto">
              <td colspan="6" class="px-4 py-8 text-center text-slate-500">Tidak ada data.</td>
            </tr>
            <tr v-for="(item, idx) in paretoData" :key="idx" class="border-b border-slate-700 hover:bg-slate-700/50 transition-colors" :class="{'bg-sky-900/20': selectedProductId === item.id_produk}">
              <td class="px-4 py-2">{{ item.ids || (idx + 1) }}</td>
              <td class="px-4 py-2">
                <button @click="selectProduct(item.id_produk)" class="bg-rose-500 hover:bg-rose-600 text-white text-xs px-2 py-1 rounded transition-colors">Show</button>
              </td>
              <td class="px-4 py-2">{{ item.name_produk }}</td>
              <td class="px-4 py-2">{{ item.uoms }}</td>
              <td class="px-4 py-2 text-right">{{ formatNumber(item.qty) }}</td>
              <td class="px-4 py-2 text-right">{{ formatNumber(item.price) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pareto Detail Table -->
    <div class="bg-slate-800 border border-slate-700 rounded-lg shadow-sm overflow-hidden flex flex-col">
      <div class="border-b border-slate-700 px-5 py-4">
        <h3 class="text-lg font-bold text-white font-serif uppercase">Data Detail Reture Pareto</h3>
      </div>
      
      <div class="p-0 overflow-y-auto custom-scrollbar h-96 relative">
        <div v-if="pendingDetail" class="absolute inset-0 flex items-center justify-center bg-slate-800/80 z-10">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>

        <table class="w-full text-sm text-left text-slate-300 border-collapse">
          <thead class="text-xs uppercase bg-slate-700 text-slate-300 sticky top-0 z-10 shadow-sm">
            <tr>
              <th class="px-4 py-3">Nama Produk</th>
              <th class="px-4 py-3">Nama Store</th>
              <th class="px-4 py-3 text-right">Qty Retur</th>
              <th class="px-4 py-3 text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!selectedProductId && paretoDetailData.length === 0">
              <td colspan="4" class="px-4 py-8 text-center text-slate-500">Pilih produk (klik Show) di tabel Pareto untuk melihat detail.</td>
            </tr>
            <tr v-else-if="paretoDetailData.length === 0 && !pendingDetail">
              <td colspan="4" class="px-4 py-8 text-center text-slate-500">Tidak ada detail retur untuk produk ini.</td>
            </tr>
            <tr v-for="(item, idx) in paretoDetailData" :key="idx" class="border-b border-slate-700 hover:bg-slate-700/50 transition-colors">
              <td class="px-4 py-2">{{ item.name_produk }}</td>
              <td class="px-4 py-2">{{ item.name_store }}</td>
              <td class="px-4 py-2 text-right">{{ formatNumber(item.qty_reture) }}</td>
              <td class="px-4 py-2 text-right">{{ formatNumber(item.price) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'

const props = defineProps({
  prodId: {
    type: Number,
    required: true
  }
})

const config = useRuntimeConfig()
const { accessToken } = useAuth()

const startDate = ref('')
const endDate = ref('')
const selectedProductId = ref<number | null>(null)

onMounted(() => {
  const now = new Date()
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
  
  startDate.value = firstDay.toISOString().slice(0, 10)
  endDate.value = now.toISOString().slice(0, 10)
  
  fetchPareto()
})

// Data Pareto
const paretoData = ref<any[]>([])
const pendingPareto = ref(false)

const fetchPareto = async () => {
  if (!startDate.value || !endDate.value) return
  
  pendingPareto.value = true
  selectedProductId.value = null
  paretoDetailData.value = []
  
  try {
    const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/dhasbord/get-pareto-produksi`, {
      headers: { 'Authorization': `Bearer ${accessToken.value}` },
      params: {
        v_prod_id: props.prodId,
        v_start_date: startDate.value,
        v_end_date: endDate.value
      }
    })
    paretoData.value = res?.data || []
  } catch (err: any) {
    console.error('Failed to fetch pareto data:', err)
  } finally {
    pendingPareto.value = false
  }
}

// Data Detail
const paretoDetailData = ref<any[]>([])
const pendingDetail = ref(false)

const selectProduct = async (id: number) => {
  selectedProductId.value = id
  pendingDetail.value = true
  
  try {
    const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/dhasbord/get-pareto-produksi-detail`, {
      headers: { 'Authorization': `Bearer ${accessToken.value}` },
      params: {
        v_prod_id: props.prodId,
        v_start_date: startDate.value,
        v_end_date: endDate.value,
        v_id_item: id
      }
    })
    paretoDetailData.value = res?.data || []
  } catch (err: any) {
    console.error('Failed to fetch pareto detail data:', err)
  } finally {
    pendingDetail.value = false
  }
}

watch(() => props.prodId, () => {
  fetchPareto()
})

const formatNumber = (num: any) => {
  if (!num) return '0'
  return Number(num).toLocaleString('id-ID')
}
</script>

<style scoped>
/* Custom scrollbar for tables */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(30, 41, 59, 0.5); /* slate-800 with opacity */
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(71, 85, 105, 0.8); /* slate-600 */
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(100, 116, 139, 1); /* slate-500 */
}
</style>
