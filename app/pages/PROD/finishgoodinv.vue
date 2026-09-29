<template>
  <NuxtLayout name="dashboard">
    <div class="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200 p-4 lg:p-8 font-sans relative overflow-hidden">
      <!-- Decorative Background Elements -->
      <div class="absolute top-0 left-0 w-96 h-96 bg-purple-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div class="absolute top-0 right-0 w-96 h-96 bg-fuchsia-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

      <!-- Header Section -->
      <div class="relative backdrop-blur-xl bg-white/80 rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white mb-8 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <UIcon name="i-heroicons-inbox-stack" class="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 class="text-2xl font-black text-slate-800 tracking-tight">Master Inventory Finish Good</h1>
            <p class="text-xs font-semibold text-slate-500 tracking-wide mt-0.5 uppercase">Data Master Inventory Finish Good</p>
          </div>
        </div>
      </div>

      <!-- Main Card -->
      <div class="backdrop-blur-md bg-white/90 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden transition-all duration-300 hover:shadow-xl relative z-10">
        <!-- Card Header -->
        <div class="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-100 px-6 py-4 flex justify-between items-center">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center"><UIcon name="i-heroicons-clipboard-document-list" class="w-4 h-4" /></div>
            <h2 class="text-sm font-extrabold text-slate-800 uppercase tracking-widest">Master Inventory Finish Good</h2>
          </div>
        </div>

        <div class="p-6">
          <!-- Filter Row -->
          <div class="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 shadow-inner">            
            <div class="sm:ml-auto mt-2 sm:mt-0 flex gap-2">
              <UButton
                @click="openAddItemModal"
                size="md" color="purple" variant="solid" icon="i-heroicons-plus"
                class="rounded-xl shadow-md shadow-purple-500/20 font-bold uppercase tracking-widest text-[10px] justify-center h-[38px]"
              >
                ADD ITEM
              </UButton>
            </div>
          </div>

          <!-- Table -->
          <div class="border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-white">
            <div class="overflow-x-auto custom-scrollbar">
              <table class="w-full text-xs text-left min-w-[1200px]">
                <thead class="bg-slate-50/80 backdrop-blur-sm border-b border-slate-100">
                  <tr>
                    <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] w-10">#</th>
                    <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] w-16">ID</th>
                    <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] whitespace-nowrap">Kode Produk</th>
                    <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] whitespace-nowrap min-w-[200px]">Nama Produk</th>
                    <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] whitespace-nowrap">Kategori</th>
                    <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px]">UOM</th>
                    <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] text-right">QTY BIG</th>
                    <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] text-right">QTY LIT</th>
                    <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] text-right">UPDATE DATE</th>
                    <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] whitespace-nowrap">UPDATE BY</th>
                  </tr>
                  <!-- Search row -->
                  <tr class="bg-white border-b border-slate-100">
                    <td class="px-2 py-1.5" />
                    <td class="px-2 py-1.5" />
                    <td class="px-2 py-1.5" />
                    <td class="px-2 py-1.5">
                      <UInput
                        v-model="searchKeyword"
                        @input="handleSearch"
                        placeholder="Cari nama produk..."
                        size="2xs"
                        icon="i-heroicons-magnifying-glass"
                        :ui="{ rounded: 'rounded-md' }"
                      />
                    </td>
                    <td class="px-2 py-1.5" colspan="6" />
                  </tr>
                </thead>

                <tbody class="divide-y divide-slate-50">
                  <tr v-if="isLoadingStock">
                    <td colspan="10" class="px-4 py-12 text-center text-slate-400">
                      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin mx-auto mb-2 text-purple-500" />
                      <p class="font-semibold text-[10px]">Memuat data...</p>
                    </td>
                  </tr>
                  <tr v-else-if="stockList.length === 0">
                    <td colspan="10" class="px-4 py-12 text-center text-slate-400">
                      <UIcon name="i-heroicons-inbox" class="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      <p class="font-semibold text-[10px]">Belum ada data</p>
                    </td>
                  </tr>
                  <tr
                    v-else
                    v-for="(row, index) in stockList"
                    :key="row.id || index"
                    class="hover:bg-purple-50/50 transition-colors"
                  >
                    <td class="px-4 py-3 text-slate-400 font-bold text-[10px]">
                      {{ (currentPage - 1) * rowsPerPage + index + 1 }}
                    </td>
                    <td class="px-4 py-3 text-slate-600 font-black text-[10px]">
                      {{ row.id }}
                    </td>
                    <td class="px-4 py-3">
                      <UBadge color="purple" variant="subtle" size="xs" class="font-black">
                        {{ row.kode_product || row.kode || '-' }}
                      </UBadge>
                    </td>
                    <td class="px-4 py-3 text-slate-700 font-extrabold whitespace-nowrap">
                      {{ row.nama_produk || row.nama || row.name || '-' }}
                    </td>
                    <td class="px-4 py-3">
                      <UBadge color="gray" variant="soft" size="xs" class="font-bold">
                        {{ row.name_prod_cate || row.category || row.kat || '-' }}
                      </UBadge>
                    </td>
                    <td class="px-4 py-3 font-bold text-slate-500">
                      {{ row.uom || row.satuan || '-' }}
                    </td>
                    <td class="px-4 py-3 text-right">
                      <span class="text-sm font-black text-slate-800">
                        {{ formatNumber(row.qty_big ?? row.qty ?? 0) }}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-right">
                      <span class="text-sm font-black text-slate-800">
                        {{ formatNumber(row.qty_lit ?? 0) }}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-right text-[10px] font-bold text-slate-500 whitespace-nowrap">
                      {{ formatDatetime(row.update_date) }}
                    </td>
                    <td class="px-4 py-3 text-[10px] font-bold text-slate-600">
                      {{ row.usrnm || '-' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <!-- Pagination Footer -->
            <div class="bg-slate-50/50 border-t border-slate-100 p-4 flex flex-wrap justify-between items-center gap-4">
              <div class="flex items-center gap-2">
                <span class="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Rows:</span>
                <USelect
                  v-model="rowsPerPageLocal"
                  @change="handleRowsChange"
                  :options="[{label:'10', value:10}, {label:'25', value:25}, {label:'50', value:50}, {label:'100', value:100}]"
                  size="xs"
                  :ui="{ rounded: 'rounded-md', base: 'font-semibold' }"
                />
              </div>

              <div class="flex items-center gap-1">
                <UButton @click="goToPage(1)" :disabled="currentPage <= 1 || isLoadingStock" size="2xs" color="gray" variant="ghost" icon="i-heroicons-chevron-double-left" />
                <UButton @click="goToPage(currentPage - 1)" :disabled="currentPage <= 1 || isLoadingStock" size="2xs" color="gray" variant="ghost" icon="i-heroicons-chevron-left" />
                
                <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mx-3">
                  Page <span class="text-slate-800">{{ currentPage }}</span> of <span class="text-slate-800">{{ totalPages || '?' }}</span>
                </span>
                
                <UButton @click="goToPage(currentPage + 1)" :disabled="currentPage >= totalPages || isLoadingStock" size="2xs" color="gray" variant="ghost" icon="i-heroicons-chevron-right" />
                <UButton @click="goToPage(totalPages)" :disabled="currentPage >= totalPages || isLoadingStock" size="2xs" color="gray" variant="ghost" icon="i-heroicons-chevron-double-right" />
              </div>

              <UButton @click="handleRefresh" :disabled="isLoadingStock" size="xs" color="gray" variant="soft" icon="i-heroicons-arrow-path" class="rounded-lg font-bold uppercase tracking-widest text-[9px]">
                Refresh
              </UButton>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== Modal ADD ITEM ===== -->
      <Teleport to="body">
        <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center">
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="closeAddItemModal" />

          <!-- Modal Card -->
          <div class="relative bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] w-full max-w-md mx-4 overflow-hidden border border-white">
            <div class="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 flex items-center justify-between">
              <h3 class="text-sm font-black text-white uppercase tracking-widest">Tambah Item Inventory</h3>
              <button @click="closeAddItemModal" class="text-slate-400 hover:text-white transition-colors">
                <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
              </button>
            </div>

            <div class="p-6 space-y-4 bg-slate-50/50">
              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Pilih Item</label>
                <USelect
                  v-model="addForm.v_id_item"
                  :options="[{label:'-- Pilih Item --', value:0}, ...itemComboList.map(i => ({label: i.name_produk, value: i.id}))]"
                  size="md"
                  :ui="{ rounded: 'rounded-xl', base: 'font-semibold' }"
                />
              </div>

              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">UOM BOM (ID)</label>
                <USelect
                  v-model.number="addForm.v_uom_bom"
                  :options="[{label:'-- Pilih UOM --', value:0}, ...uomComboList.map(i => ({label: i.name_uom || i.uom || i.satuan || i.nama_satuan || i.nama || i.name || i.uom_name || i.uom_bom || i.name_prod_cate || (Object.values(i).find(v => typeof v === 'string' && isNaN(Number(v)))) || i.id, value: i.id}))]"
                  size="md"
                  :disabled="isFetchingUom"
                  :ui="{ rounded: 'rounded-xl', base: 'font-semibold' }"
                />
              </div>
            </div>

            <div class="px-6 py-4 bg-white border-t border-slate-100 flex gap-2 justify-end">
              <UButton @click="closeAddItemModal" size="md" color="gray" variant="soft" class="rounded-xl font-bold uppercase tracking-widest text-[10px]">
                Batal
              </UButton>
              <UButton
                @click="handleAddItem"
                :disabled="isSaving || addForm.v_id_item === 0"
                size="md" color="purple" variant="solid"
                class="rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-md shadow-purple-500/20"
              >
                <UIcon v-if="isSaving" name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin mr-1" />
                Simpan
              </UButton>
            </div>
          </div>
        </div>
      </Teleport>
    </div>
  </NuxtLayout>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useProduksi } from '~/composables/useProduksi'
import { useInventoryFG } from '~/composables/useInventoryFG'

definePageMeta({ layout: false })

const { activeProdId, fetchUomKonversiBom } = useProduksi()
// idClass 1 = Finish Good
const {
  itemComboList,
  stockList,
  isLoadingCombo,
  isLoadingStock,
  currentPage,
  rowsPerPage,
  totalPages,
  searchKeyword,
  selectedItemId,
  fetchComboFinishGood,
  fetchStockOnHand,
  addItemInventoryArea,
  goToPage,
  setRowsPerPage,
} = useInventoryFG(1)

const rowsPerPageLocal = ref(rowsPerPage.value)
const showAddModal = ref(false)
const isSaving = ref(false)
const addForm = ref({ v_id_item: 0, v_uom_bom: 0, v_class_item: 1 })

const uomComboList = ref<any[]>([])
const isFetchingUom = ref(false)

watch(() => addForm.value.v_id_item, async (newId) => {
  if (newId && activeProdId.value) {
    isFetchingUom.value = true
    addForm.value.v_uom_bom = 0
    uomComboList.value = await fetchUomKonversiBom(newId, activeProdId.value)
    isFetchingUom.value = false
  } else {
    uomComboList.value = []
  }
})


let searchTimer: ReturnType<typeof setTimeout> | null = null

const handleSearch = () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(async () => {
    currentPage.value = 1
    await fetchStockOnHand()
  }, 400)
}

const handleSelectItem = async () => {
  currentPage.value = 1
  await fetchStockOnHand()
}

const handleRowsChange = async () => {
  await setRowsPerPage(rowsPerPageLocal.value)
}

const handleRefresh = async () => {
  await fetchStockOnHand()
}

const openAddItemModal = () => {
  addForm.value = { v_id_item: 0, v_uom_bom: 0, v_class_item: 1 }
  showAddModal.value = true
}

const closeAddItemModal = () => {
  showAddModal.value = false
}

const handleAddItem = async () => {
  if (!activeProdId.value || addForm.value.v_id_item === 0) return
  isSaving.value = true
  try {
    const result = await addItemInventoryArea({
      v_id_item: addForm.value.v_id_item,
      v_uom_bom: addForm.value.v_uom_bom,
      v_class_item: addForm.value.v_class_item,
      v_id_prod: activeProdId.value,
    })
    if (result.success) {
      closeAddItemModal()
      await fetchStockOnHand()
    } else {
      alert('Gagal menyimpan item. Silakan coba lagi.')
    }
  } finally {
    isSaving.value = false
  }
}

const formatNumber = (val: any): string => {
  if (val === null || val === undefined) return '0'
  const num = Number(val)
  if (isNaN(num)) return String(val)
  return num.toLocaleString('id-ID')
}

const formatDatetime = (val: any): string => {
  if (!val) return '-'
  try {
    const d = new Date(val)
    if (isNaN(d.getTime())) return String(val)
    return d.toLocaleString('id-ID', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  } catch {
    return String(val)
  }
}

// Fetch combo dan data tabel saat modul dibuka
onMounted(async () => {
  if (activeProdId.value) {
    await fetchComboFinishGood()
    await fetchStockOnHand()
  }
})
</script>
