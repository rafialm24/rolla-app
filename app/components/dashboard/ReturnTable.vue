<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Return Table (Master) -->
    <div class="bg-slate-800 border border-slate-700 rounded-lg shadow-sm overflow-hidden flex flex-col">
      <div class="border-b border-slate-700 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 class="text-lg font-bold text-white font-serif">Data Return (Per Store)</h3>
        
        <!-- Date Filter -->
        <div class="flex items-center space-x-2">
          <input type="date" v-model="startDate" class="bg-slate-900 border border-slate-600 text-slate-300 text-sm rounded-md px-2 py-1 focus:outline-none focus:border-sky-500 w-32" />
          <span class="text-slate-500">-</span>
          <input type="date" v-model="endDate" class="bg-slate-900 border border-slate-600 text-slate-300 text-sm rounded-md px-2 py-1 focus:outline-none focus:border-sky-500 w-32" />
          <button @click="fetchReturn" class="bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold px-3 py-1 rounded-md transition-colors disabled:opacity-50" :disabled="pending">
            {{ pending ? '...' : 'CEK' }}
          </button>
        </div>
      </div>
      
      <div class="p-0 overflow-y-auto custom-scrollbar h-96 relative">
        <div v-if="pending" class="absolute inset-0 flex items-center justify-center bg-slate-800/80 z-10">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
        </div>
        
        <table class="w-full text-sm text-left text-slate-300 border-collapse relative">
          <thead class="text-xs uppercase bg-slate-700 text-slate-300 sticky top-0 z-10 shadow-sm">
            <tr>
              <th class="px-4 py-3">Action</th>
              <th class="px-4 py-3">Kode Store</th>
              <th class="px-4 py-3">Nama Store</th>
              <th class="px-4 py-3 text-right">Omset</th>
              <th class="px-4 py-3 text-right">Retur</th>
              <th class="px-4 py-3 text-right">Persen</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="returnData.length === 0 && !pending">
              <td colspan="6" class="px-4 py-8 text-center text-slate-500">Tidak ada data retur.</td>
            </tr>
            <tr v-for="(item, idx) in returnData" :key="idx" class="border-b border-slate-700 hover:bg-slate-700/50 transition-colors" :class="{'bg-sky-900/20': selectedStoreId === item.id_store}">
              <td class="px-4 py-2">
                <button @click="selectStore(item.id_store)" class="bg-rose-500 hover:bg-rose-600 text-white text-xs px-2 py-1 rounded transition-colors">Show</button>
              </td>
              <td class="px-4 py-2 font-mono">{{ item.kode_store }}</td>
              <td class="px-4 py-2">{{ item.name_store }}</td>
              <td class="px-4 py-2 text-right text-sky-300">{{ formatNumber(item.omset) }}</td>
              <td class="px-4 py-2 text-right text-rose-300">{{ formatNumber(item.price) }}</td> <!-- using price as retur amount based on legacy -->
              <td class="px-4 py-2 text-right font-bold" :class="Number(item.persen) > 5 ? 'text-red-400' : 'text-emerald-400'">{{ formatNumber(item.persen) }}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Detail Table -->
    <div class="bg-slate-800 border border-slate-700 rounded-lg shadow-sm overflow-hidden flex flex-col">
      <div class="border-b border-slate-700 px-5 py-4">
        <h3 class="text-lg font-bold text-white font-serif uppercase">Detail Return & Price</h3>
      </div>
      
      <div class="p-0 overflow-y-auto custom-scrollbar h-96 relative">
        <div v-if="pendingDetail" class="absolute inset-0 flex items-center justify-center bg-slate-800/80 z-10">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>

        <table class="w-full text-sm text-left text-slate-300 border-collapse">
          <thead class="text-xs uppercase bg-slate-700 text-slate-300 sticky top-0 z-10 shadow-sm">
            <tr>
              <th class="px-4 py-3">Nama Produk</th>
              <th class="px-4 py-3">UOM</th>
              <th class="px-4 py-3 text-right">Qty</th>
              <th class="px-4 py-3 text-right">Total</th>
              <th class="px-4 py-3 text-center">Tgl</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!selectedStoreId && detailData.length === 0">
              <td colspan="5" class="px-4 py-8 text-center text-slate-500">Pilih store (klik Show) untuk melihat detail produk.</td>
            </tr>
            <tr v-else-if="detailData.length === 0 && !pendingDetail">
              <td colspan="5" class="px-4 py-8 text-center text-slate-500">Tidak ada detail retur.</td>
            </tr>
            <tr v-for="(item, idx) in detailData" :key="idx" class="border-b border-slate-700 hover:bg-slate-700/50 transition-colors">
              <td class="px-4 py-2">
                <div class="font-medium">{{ item.name_produk }}</div>
                <div class="text-xs text-slate-500 font-mono">{{ item.kode_produk }}</div>
              </td>
              <td class="px-4 py-2">{{ item.uom }}</td>
              <td class="px-4 py-2 text-right">{{ formatNumber(item.qty) }}</td>
              <td class="px-4 py-2 text-right text-rose-300">{{ formatNumber(item.total) }}</td>
              <td class="px-4 py-2 text-center text-xs text-slate-400">{{ formatDate(item.tgl) }}</td>
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
const selectedStoreId = ref<number | null>(null)

onMounted(() => {
  const now = new Date()
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
  startDate.value = firstDay.toISOString().slice(0, 10)
  endDate.value = now.toISOString().slice(0, 10)
  fetchReturn()
})

const returnData = ref<any[]>([])
const pending = ref(false)

const fetchReturn = async () => {
  if (!startDate.value || !endDate.value) return
  
  pending.value = true
  selectedStoreId.value = null
  detailData.value = []
  
  try {
    const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/dhasbord/get-return-produksi-store`, {
      headers: { 'Authorization': `Bearer ${accessToken.value}` },
      params: {
        v_prod_id: props.prodId,
        v_start_date: startDate.value,
        v_end_date: endDate.value
      }
    })
    returnData.value = res?.data || []
  } catch (err) {
    console.error('Failed to fetch return data:', err)
  } finally {
    pending.value = false
  }
}

const detailData = ref<any[]>([])
const pendingDetail = ref(false)

const selectStore = async (id: number) => {
  selectedStoreId.value = id
  pendingDetail.value = true
  
  try {
    const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/dhasbord/get-return-produksi-detail-store`, {
      headers: { 'Authorization': `Bearer ${accessToken.value}` },
      params: {
        v_prod_id: props.prodId,
        v_start_date: startDate.value,
        v_end_date: endDate.value,
        v_store: id
      }
    })
    detailData.value = res?.data || []
  } catch (err) {
    console.error('Failed to fetch return detail:', err)
  } finally {
    pendingDetail.value = false
  }
}

watch(() => props.prodId, () => fetchReturn())

const formatNumber = (num: any) => {
  if (!num) return '0'
  return Number(num).toLocaleString('id-ID')
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  try {
    return new Date(dateStr).toLocaleDateString('id-ID')
  } catch {
    return dateStr
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(30, 41, 59, 0.5); border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(71, 85, 105, 0.8); border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(100, 116, 139, 1); }
</style>
