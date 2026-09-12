<template>
  <NuxtLayout name="dashboard">
    <div class="min-h-screen bg-slate-50/50 p-4 lg:p-8">
    <div class="max-w-[1600px] mx-auto">
      
      <!-- HEADER -->
      <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <UIcon name="i-heroicons-clipboard-document-check" class="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 class="text-2xl font-black text-slate-800 tracking-tight">Stock Opname Produksi</h1>
            <p class="text-xs font-semibold text-slate-500 tracking-wide mt-0.5 uppercase">Kelola Data Stock Opname</p>
          </div>
        </div>
      </div>

      <!-- MAIN CONTENT -->
      <div class="grid grid-cols-1 gap-6">
        <div class="backdrop-blur-md bg-white/90 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden flex flex-col">
          
          <!-- TOOLBAR -->
          <div class="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-100 px-6 py-4 flex flex-wrap items-center gap-6 relative z-20">
            
            <div class="flex items-center gap-3">
              <UButton @click="handleApproveStock" :loading="isSaving" size="sm" color="emerald" variant="solid" icon="i-heroicons-check-circle" class="rounded-xl shadow-md shadow-emerald-500/20 font-bold uppercase tracking-wider text-[10px]">
                APPROVE STOCK
              </UButton>
            </div>

            <div class="h-8 w-px bg-slate-200 hidden md:block"></div>

            <div class="flex items-center gap-3">
              <span class="text-xs font-bold text-slate-500 uppercase">Print Approve SO:</span>
              <UInput v-model="postingDate" type="date" class="w-36" size="sm" />
              <UButton @click="handlePrint" size="sm" color="indigo" variant="soft" icon="i-heroicons-printer" class="rounded-xl font-bold uppercase tracking-wider text-[10px]">
                PRINT
              </UButton>
            </div>

            <div class="flex-1 flex justify-end">
              <UInput v-model="keyword" @keyup.enter="loadData" icon="i-heroicons-magnifying-glass" placeholder="Search produk..." class="w-48" />
            </div>

          </div>
          
          <!-- DATA GRID -->
          <div class="p-6 flex-1 relative z-10">
            <div class="border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-white min-h-[400px]">
              <div class="overflow-x-auto custom-scrollbar">
                <table class="w-full text-sm text-left">
                  <thead class="bg-slate-50/80 backdrop-blur-sm border-b border-slate-100">
                    <tr>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px] sticky left-0 bg-slate-50 z-10">Action</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px] whitespace-nowrap">Kode Produk</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px] whitespace-nowrap min-w-[200px]">Nama Produk</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Kategory</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Type Produk</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Brand</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">UOM SO</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px] text-right">Harga Satuan</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px] text-right">Qty Besar</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px] text-right">Qty Kecil</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px] text-right">Qty Stock</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px] text-right">Price Stock</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px] text-right text-rose-500">Qty Selisih</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px] text-right text-rose-500">Price Selisih</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px] text-right text-emerald-600">Qty Actual</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px] text-right text-emerald-600">Price Actual</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Lokasi</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">User SO</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Tanggal SO</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-50">
                    <tr v-if="isLoading">
                      <td colspan="19" class="px-4 py-12 text-center text-slate-400 font-medium">
                        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 mx-auto mb-3 animate-spin text-indigo-400" />
                        <p class="text-xs uppercase tracking-widest">Loading Stock Opname Data...</p>
                      </td>
                    </tr>
                    <tr v-else-if="listData.length === 0">
                      <td colspan="19" class="px-4 py-12 text-center text-slate-400 font-medium">
                        <UIcon name="i-heroicons-document-magnifying-glass" class="w-8 h-8 mx-auto mb-3 text-slate-300" />
                        <p class="text-xs uppercase tracking-widest">No data found</p>
                      </td>
                    </tr>
                    <tr v-else v-for="item in listData" :key="item.id" class="hover:bg-indigo-50/50 transition-colors group">
                      <td class="px-4 py-2 sticky left-0 bg-white group-hover:bg-indigo-50/50 shadow-[1px_0_0_0_#f8fafc]">
                        <UButton @click="handleRevisi(item)" size="xs" color="orange" variant="soft" class="font-bold text-[10px] rounded-lg">REVISI</UButton>
                      </td>
                      <td class="px-4 py-2 font-mono text-[10px] text-slate-600">{{ item.kode_product }}</td>
                      <td class="px-4 py-2 font-semibold text-slate-800 text-xs">{{ item.name_produk }}</td>
                      <td class="px-4 py-2 text-slate-500 text-[10px]">{{ item.name_prod_cate }}</td>
                      <td class="px-4 py-2 text-slate-500 text-[10px]">{{ item.name_buy }}</td>
                      <td class="px-4 py-2 text-slate-500 text-[10px]">{{ item.brand }}</td>
                      <td class="px-4 py-2 text-slate-500 text-[10px]">{{ item.name_prod_uom }}</td>
                      <td class="px-4 py-2 text-slate-800 font-semibold text-right text-xs">{{ formatNumber(item.price) }}</td>
                      <td class="px-4 py-2 text-slate-600 text-right text-xs">{{ formatNumber(item.qty_big) }}</td>
                      <td class="px-4 py-2 text-slate-600 text-right text-xs">{{ formatNumber(item.qty_lit) }}</td>
                      <td class="px-4 py-2 text-slate-800 font-bold text-right text-xs">{{ formatNumber(item.qty_stock) }}</td>
                      <td class="px-4 py-2 text-slate-600 text-right text-xs">{{ formatNumber(item.price_qty_stock) }}</td>
                      <td class="px-4 py-2 font-bold text-right text-xs" :class="item.seleisih < 0 ? 'text-rose-500' : 'text-emerald-500'">{{ formatNumber(item.seleisih) }}</td>
                      <td class="px-4 py-2 font-semibold text-right text-xs" :class="item.price_seleisih < 0 ? 'text-rose-500' : 'text-emerald-500'">{{ formatNumber(item.price_seleisih) }}</td>
                      <td class="px-4 py-2 text-emerald-600 font-bold text-right text-xs">{{ formatNumber(item.qty_so) }}</td>
                      <td class="px-4 py-2 text-emerald-600 font-semibold text-right text-xs">{{ formatNumber(item.price_qty_so) }}</td>
                      <td class="px-4 py-2 text-slate-500 text-[10px]">{{ item.lokasi }}</td>
                      <td class="px-4 py-2 text-slate-500 text-[10px]">{{ item.usrnm }}</td>
                      <td class="px-4 py-2 text-slate-500 text-[10px] whitespace-nowrap">{{ formatDateTime(item.create_date) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <!-- Pagination -->
              <div class="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Rows:</span>
                  <USelect v-model="perPage" :options="[10, 20, 50, 100]" class="w-20" size="xs" @change="page = 1; loadData()" />
                </div>
                <div class="flex flex-1 justify-center">
                  <UPagination v-model="page" :page-count="perPage" :total="totalRows" size="sm" @update:model-value="loadData" />
                </div>
                <div class="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Total: {{ totalRows }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useStockOpnameProd } from '~/composables/useStockOpnameProd'
import { useProduksi } from '~/composables/useProduksi'

definePageMeta({ layout: false })

const { activeAppId, activeLocationId } = useProduksi()
const { 
  listData, totalRows, isLoading, isSaving,
  fetchStockOpname, revisiRowSo, postingApprove 
} = useStockOpnameProd()

const toast = useToast()
const config = useRuntimeConfig()

// State
const keyword = ref('')
const page = ref(1)
const perPage = ref(10)

const today = new Date().toISOString().split('T')[0]
const postingDate = ref(today)

const loadData = async () => {
  await fetchStockOpname(keyword.value, page.value, perPage.value)
}

const handleRevisi = async (row: any) => {
  if (confirm(`Yakin ingin merevisi data Stock Opname untuk produk ${row.name_produk}?`)) {
    const res = await revisiRowSo(row.id)
    if (res.success && res.data?.result === 1) {
      toast.add({ title: 'Berhasil', description: 'Data berhasil direvisi', color: 'green' })
      loadData()
    } else {
      toast.add({ title: 'Gagal', description: 'Data gagal direvisi', color: 'red' })
    }
  }
}

const handleApproveStock = async () => {
  if (confirm('Yakin ingin Approve Stock Opname?')) {
    const res = await postingApprove()
    if (res.success && res.data?.result === 1) {
      toast.add({ title: 'Berhasil', description: 'Data Stock Opname berhasil diapprove', color: 'green' })
      loadData()
    } else {
      toast.add({ title: 'Gagal', description: 'Data gagal diapprove', color: 'red' })
    }
  }
}

const handlePrint = () => {
  if (!postingDate.value) {
    toast.add({ title: 'Validasi', description: 'Silakan pilih tanggal posting', color: 'orange' })
    return
  }
  
  // Directly open the audit API endpoint to download/view the print data (similar to how legacy exported to excel/pdf)
  // In Nuxt, we just open it in a new window for now.
  const url = `${config.public.apiBase || ''}/produksi/stock-opname/audit?v_posting_date=${postingDate.value}&v_aplikasi_id=${activeAppId.value || 0}&v_lokasi=${activeLocationId.value || 0}`
  window.open(url, '_blank')
}

const formatNumber = (num: any) => {
  if (num === null || num === undefined) return '0'
  return Number(num).toLocaleString('id-ID')
}

const formatDateTime = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
