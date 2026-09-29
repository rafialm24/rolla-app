<template>
  <NuxtLayout name="dashboard">
    <div class="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200 p-4 lg:p-8 font-sans relative overflow-hidden">
      <!-- Decorative Background Elements -->
      <div class="absolute top-0 left-0 w-96 h-96 bg-blue-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div class="absolute top-0 right-0 w-96 h-96 bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

      <!-- Page Header -->
      <div class="relative backdrop-blur-xl bg-white/80 rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white mb-8 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <UIcon name="i-heroicons-shopping-cart" class="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 class="text-2xl font-black text-slate-800 tracking-tight">Real Time Order Detail</h1>
            <p class="text-xs font-semibold text-slate-500 tracking-wide mt-0.5 uppercase">Kelola data real time order untuk {{ nameStore }}</p>
          </div>
        </div>
        <NuxtLink to="/PROD/realtimeorder" class="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors shadow-sm">
          <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" />
          Kembali ke Master
        </NuxtLink>
      </div>

      <div class="space-y-6 relative z-10">
        
        <!-- CARD 1: Surat Jalan -->
        <div class="backdrop-blur-md bg-white/90 rounded-[2rem] p-6 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex flex-wrap items-center justify-between gap-6 transition-all duration-300 hover:shadow-xl">
          <div class="flex flex-wrap items-center gap-4">
            <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">SURAT JALAN :</span>
            <USelect 
              v-model="selectedSjNum" 
              :options="[{label: 'Pilih Surat Jalan...', value: '', disabled: true}, ...sjNumList.map(sj => ({label: sj, value: sj}))]"
              size="md"
              :ui="{ rounded: 'rounded-xl', base: 'font-semibold min-w-[200px]' }"
            />
            <UButton 
              @click="handlePrint" 
              size="md" color="emerald" variant="solid" icon="i-heroicons-printer"
              class="rounded-xl shadow-md shadow-emerald-500/20 font-bold uppercase tracking-widest text-[10px] text-white"
            >
              PRINT SURAT JALAN
            </UButton>
          </div>
          <div>
            <UBadge color="blue" variant="soft" size="lg" class="font-black uppercase px-4 py-2 shadow-sm rounded-xl">
              {{ nameStore }}
            </UBadge>
          </div>
        </div>

        <!-- CARD 2: Data Stock Order -->
        <div class="backdrop-blur-md bg-white/90 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div class="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-100 px-6 py-4 flex flex-wrap justify-between items-center gap-4">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                <UIcon name="i-heroicons-clipboard-document-list" class="w-4 h-4" />
              </div>
              <h2 class="text-sm font-extrabold text-slate-800 uppercase tracking-widest">List Item Order</h2>
            </div>
            <UButton 
              @click="handleAddLoading" :disabled="isSaving"
              size="md" color="blue" variant="solid" icon="i-heroicons-inbox-arrow-down"
              class="rounded-xl shadow-md shadow-blue-500/20 font-bold uppercase tracking-widest text-[10px] text-white"
            >
              LOADING QTY SET
            </UButton>
          </div>
          
          <div class="p-6">
            <!-- Search Data Stock -->
            <div class="mb-4">
              <UInput 
                v-model="searchOrder" @input="handleSearchOrder" 
                placeholder="Cari produk..." 
                icon="i-heroicons-magnifying-glass"
                size="md"
                :ui="{ rounded: 'rounded-xl', base: 'max-w-sm font-semibold' }"
              />
            </div>

            <div class="border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-white">
              <div class="overflow-x-auto custom-scrollbar">
                <table class="w-full text-xs text-left min-w-[1800px]">
                  <thead class="bg-slate-50/80 backdrop-blur-sm border-b border-slate-100">
                    <tr>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] whitespace-nowrap">Kode Produk</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] whitespace-nowrap min-w-[200px]">Nama Produk</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] whitespace-nowrap">Kategory</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] whitespace-nowrap">UOM</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] whitespace-nowrap text-right">Stock DC</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] whitespace-nowrap text-right">On Loading</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] whitespace-nowrap text-right">Stock Balance</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] whitespace-nowrap text-right">Stock Store</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] whitespace-nowrap text-right">Qty Min</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] whitespace-nowrap text-right">Qty Max</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] whitespace-nowrap text-right">Qty Kebutuhan</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] whitespace-nowrap text-right">Avg Sales</th>
                      <th class="px-4 py-3 font-bold text-blue-600 uppercase tracking-wider text-[9px] whitespace-nowrap text-center bg-blue-50/50">Set Qty</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] whitespace-nowrap text-right">Available</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-50">
                    <tr v-if="isLoadingOrder">
                      <td colspan="14" class="px-4 py-12 text-center text-slate-400">
                        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
                        <p class="font-semibold text-[10px]">Memuat data order...</p>
                      </td>
                    </tr>
                    <tr v-else-if="orderDetails.length === 0">
                      <td colspan="14" class="px-4 py-12 text-center text-slate-400">
                        <UIcon name="i-heroicons-inbox" class="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        <p class="font-semibold text-[10px]">Tidak ada item order</p>
                      </td>
                    </tr>
                    <tr v-else v-for="(item, idx) in orderDetails" :key="item.kode_produk || idx" class="hover:bg-blue-50/30 transition-colors">
                      <td class="px-4 py-3">
                        <UBadge color="gray" variant="soft" size="xs" class="font-black">
                          {{ item.kode_produk }}
                        </UBadge>
                      </td>
                      <td class="px-4 py-3 font-extrabold text-slate-800">{{ item.name_produk }}</td>
                      <td class="px-4 py-3 font-bold text-slate-600">{{ item.name_prod_cate }}</td>
                      <td class="px-4 py-3 font-bold text-slate-600">{{ item.name_prod_uom }}</td>
                      <td class="px-4 py-3 text-right font-black text-slate-800 text-sm">{{ item.stok_prod }}</td>
                      <td class="px-4 py-3 text-right font-black text-orange-500 text-sm">{{ item.stock_loading }}</td>
                      <td class="px-4 py-3 text-right font-bold text-slate-600">{{ item.stock_balance }}</td>
                      <td class="px-4 py-3 text-right font-black text-blue-600 text-sm">{{ item.stock_store }}</td>
                      <td class="px-4 py-3 text-right font-semibold text-slate-500">{{ item.qty_min }}</td>
                      <td class="px-4 py-3 text-right font-semibold text-slate-500">{{ item.qty_max }}</td>
                      <td class="px-4 py-3 text-right font-black text-green-600 text-sm">{{ item.qty_kebutuhan }}</td>
                      <td class="px-4 py-3 text-right font-semibold text-slate-500">{{ item.qty_sales }}</td>
                      <td class="px-4 py-2 text-center bg-blue-50/50">
                        <UInput 
                          type="number" 
                          v-model.number="item._qtyset"
                          :disabled="item.qty_kebutuhan <= 0"
                          size="sm"
                          class="w-20 mx-auto"
                          :ui="{ base: 'text-right font-black', rounded: 'rounded-lg' }"
                        />
                      </td>
                      <td class="px-4 py-3 text-right">
                        <UBadge :color="item.persentase < 50 ? 'red' : 'green'" variant="subtle" size="xs" class="font-black">
                          {{ item.persentase }} %
                        </UBadge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <!-- Pagination Order -->
              <div class="bg-slate-50/50 border-t border-slate-100 p-4 flex flex-wrap justify-between items-center gap-4">
                <div class="flex items-center gap-2">
                  <span class="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Rows:</span>
                  <USelect 
                    v-model="rowsOrder" @change="handleRowsChangeOrder" 
                    :options="[{label:'10', value:10}, {label:'20', value:20}, {label:'30', value:30}, {label:'40', value:40}, {label:'50', value:50}]"
                    size="xs" :ui="{ rounded: 'rounded-md', base: 'font-semibold' }"
                  />
                </div>
                
                <div class="flex items-center gap-1">
                  <UButton @click="goToPageOrder(1)" :disabled="pageOrder === 1" size="2xs" color="gray" variant="ghost" icon="i-heroicons-chevron-double-left" />
                  <UButton @click="changePageOrder(-1)" :disabled="pageOrder === 1" size="2xs" color="gray" variant="ghost" icon="i-heroicons-chevron-left" />
                  
                  <div class="flex items-center gap-2 mx-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Page
                    <UInput type="number" v-model.lazy="pageOrder" @change="loadOrderDetails" size="2xs" class="w-12 text-center" :ui="{ base: 'text-center font-bold' }" />
                    of <span class="text-slate-800">{{ totalPagesOrder }}</span>
                  </div>
                  
                  <UButton @click="changePageOrder(1)" :disabled="pageOrder >= totalPagesOrder" size="2xs" color="gray" variant="ghost" icon="i-heroicons-chevron-right" />
                  <UButton @click="goToPageOrder(totalPagesOrder)" :disabled="pageOrder >= totalPagesOrder" size="2xs" color="gray" variant="ghost" icon="i-heroicons-chevron-double-right" />
                  
                  <UButton @click="loadOrderDetails" size="xs" color="gray" variant="soft" icon="i-heroicons-arrow-path" class="ml-2 rounded-lg" title="Refresh" />
                </div>
                
                <div class="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                  Menampilkan {{ (pageOrder - 1) * rowsOrder + 1 }} - {{ Math.min(pageOrder * rowsOrder, totalOrder) }} dari {{ totalOrder }} items
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- CARD 3: Data Loading -->
        <div class="backdrop-blur-md bg-white/90 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div class="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-100 px-6 py-4 flex flex-wrap justify-between items-center gap-4">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <UIcon name="i-heroicons-truck" class="w-4 h-4" />
              </div>
              <h2 class="text-sm font-extrabold text-slate-800 uppercase tracking-widest">List Item Loading</h2>
            </div>
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2">
                <span class="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Delivery Date:</span>
                <UInput v-model="deliveryDate" type="date" size="md" :ui="{ rounded: 'rounded-xl', base: 'font-semibold' }" />
              </div>
              <UButton 
                @click="handlePosting" :disabled="isSaving" 
                size="md" color="indigo" variant="solid" icon="i-heroicons-paper-airplane"
                class="rounded-xl shadow-md shadow-indigo-500/20 font-bold uppercase tracking-widest text-[10px] text-white"
              >
                POSTING
              </UButton>
            </div>
          </div>
          
          <div class="p-6">
            <div class="border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-white">
              <div class="overflow-x-auto custom-scrollbar">
                <table class="w-full text-xs text-left min-w-[1200px]">
                  <thead class="bg-slate-50/80 backdrop-blur-sm border-b border-slate-100">
                    <tr>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] text-center w-24">Action</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px]">Kode Produk</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px]">Nama Produk</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px]">UOM</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] text-right">Qty</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] text-right">Discount</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] text-right">Price</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-50">
                    <tr v-if="isLoadingLoading">
                      <td colspan="8" class="px-4 py-12 text-center text-slate-400">
                        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin mx-auto mb-2 text-indigo-500" />
                        <p class="font-semibold text-[10px]">Memuat data loading...</p>
                      </td>
                    </tr>
                    <tr v-else-if="loadingDetails.length === 0">
                      <td colspan="8" class="px-4 py-12 text-center text-slate-400">
                        <UIcon name="i-heroicons-inbox" class="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        <p class="font-semibold text-[10px]">Belum ada item loading</p>
                      </td>
                    </tr>
                    <tr v-else v-for="load in loadingDetails" :key="load.id" class="hover:bg-indigo-50/30 transition-colors">
                      <td class="px-4 py-3 text-center">
                        <UButton 
                          @click="handleDeleteLoading(load.id)" 
                          size="xs" color="red" variant="soft" icon="i-heroicons-trash"
                          class="rounded-lg"
                        />
                      </td>
                      <td class="px-4 py-3">
                        <UBadge color="gray" variant="soft" size="xs" class="font-black">
                          {{ load.kode_product }}
                        </UBadge>
                      </td>
                      <td class="px-4 py-3 font-extrabold text-slate-800">{{ load.name_produk }}</td>
                      <td class="px-4 py-3 font-bold text-slate-600">{{ load.name_prod_uom }}</td>
                      <td class="px-4 py-3 text-right font-black text-indigo-600 text-sm">{{ load.qty }}</td>
                      <td class="px-4 py-3 text-right font-semibold text-slate-400 line-through">{{ load.free_item }}</td>
                      <td class="px-4 py-3 text-right font-bold text-slate-600">{{ formatNumber(load.price) }}</td>
                      <td class="px-4 py-3 text-right font-black text-slate-800 text-sm">{{ formatNumber(load.total) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </NuxtLayout>
</template>


<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useRealTimeOrder } from '../../composables/useRealTimeOrder'

const route = useRoute()
const storeId = Number(route.query.id_store)
const nameStore = route.query.name_store as string || ''

const {
  orderDetails,
  loadingDetails,
  sjNumList,
  totalOrder,
  isLoadingOrder,
  isLoadingLoading,
  isSaving,
  fetchOrderDetails,
  fetchLoadingDetails,
  fetchSjNumList,
  saveLoadingItems,
  deleteLoadingItem,
  postLoading,
  printSuratJalan
} = useRealTimeOrder()

// Pagination State
const searchOrder = ref('')
const pageOrder = ref(1)
const rowsOrder = ref(10)
const totalPagesOrder = computed(() => Math.ceil(totalOrder.value / rowsOrder.value) || 1)
let orderTimeout: any = null

const deliveryDate = ref('')
const selectedSjNum = ref('')

onMounted(async () => {
  if (storeId) {
    await initPage()
  }
})

const formatNumber = (num: number) => {
  if (!num) return '0'
  return new Intl.NumberFormat('id-ID').format(num)
}

const initPage = async () => {
  await fetchSjNumList(storeId)
  if (sjNumList.value.length > 0) {
    selectedSjNum.value = sjNumList.value[0]
  } else {
    selectedSjNum.value = ''
  }
  
  await fetchOrderDetails(storeId, searchOrder.value, pageOrder.value, rowsOrder.value)
  if (orderDetails.value && orderDetails.value.length > 0) {
    for (const item of orderDetails.value) {
      item._qtyset = 0
    }
  }
  
  await fetchLoadingDetails(storeId)
}

const loadOrderDetails = async () => {
  if (!storeId) return
  await fetchOrderDetails(storeId, searchOrder.value, pageOrder.value, rowsOrder.value)
  if (orderDetails.value && orderDetails.value.length > 0) {
    for (const item of orderDetails.value) {
      item._qtyset = 0
    }
  }
}

const handleSearchOrder = () => {
  if (orderTimeout) clearTimeout(orderTimeout)
  orderTimeout = setTimeout(() => {
    pageOrder.value = 1
    loadOrderDetails()
  }, 500)
}

const changePageOrder = (offset: number) => {
  pageOrder.value += offset
  loadOrderDetails()
}

const goToPageOrder = (page: number) => {
  pageOrder.value = page
  loadOrderDetails()
}

const handleRowsChangeOrder = () => {
  pageOrder.value = 1
  loadOrderDetails()
}

const handleAddLoading = async () => {
  if (!storeId) return

  const itemsToSave = orderDetails.value
    .filter(item => item._qtyset > 0 && item._qtyset <= item.qty_kebutuhan)
    .map(item => ({
      id_item: item.id_item || item.id_produk || item.id || 0,
      qtyset: item._qtyset,
      price_set: 0
    }))
    
  if (itemsToSave.length === 0) {
    alert("Tidak ada item yang diisi, atau Qty melebihi Kebutuhan.")
    return
  }
  
  const res = await saveLoadingItems(storeId, itemsToSave)
  if (res.success) {
    await loadOrderDetails()
    await fetchLoadingDetails(storeId)
  } else {
    alert("Gagal menyimpan data.")
  }
}

const handleDeleteLoading = async (id: number) => {
  if (!storeId) return
  if (!confirm("Apakah Anda yakin ingin menghapus item ini?")) return
  
  const res = await deleteLoadingItem(storeId, id, 1) // action 1: delete
  if (res.success) {
    await loadOrderDetails()
    await fetchLoadingDetails(storeId)
  } else {
    alert("Gagal menghapus data.")
  }
}

const handlePosting = async () => {
  if (!storeId) return
  if (!deliveryDate.value) {
    alert("Delivery Date tidak boleh kosong!")
    return
  }
  
  const res = await postLoading(storeId, deliveryDate.value)
  if (res.success) {
    alert("Berhasil di-posting!")
    await fetchSjNumList(storeId)
    if (sjNumList.value.length > 0) {
      selectedSjNum.value = sjNumList.value[0]
    }
    await loadOrderDetails()
    await fetchLoadingDetails(storeId)
    deliveryDate.value = ''
  } else {
    alert("Gagal posting.")
  }
}

const handlePrint = async () => {
  if (!storeId || !selectedSjNum.value) {
    alert("Silakan pilih Surat Jalan terlebih dahulu")
    return
  }

  const res = await printSuratJalan(storeId, selectedSjNum.value)
  if (res && res.success && res.data) {
    const rawData = res.data
    const data = Array.isArray(rawData) ? rawData : (rawData.data || [rawData])

    if (data.length === 0) {
      alert("Data Surat Jalan kosong.")
      return
    }

    const firstItem = data[0] || {}
    const companyName = firstItem.cmp_desc || 'PT ROTI ROLLA BOJONEGORO'
    const prodDesc = firstItem.kode_prod ? `${firstItem.kode_prod} - ${firstItem.name_prod || ''}` : (firstItem.name_prod || 'ROLLA BOJONEGORO')
    const address = firstItem.alamat_prod || 'Jl. Raya bojonegoro cepu, pertigaan mayangrejo no.1, ds. Mayangrejo, kec. Kalitidu kab. Bojonegoro'
    const area = firstItem.area_desc || 'BOJONEGORO'
    const deliveryDate = firstItem.delivery_date || firstItem.tgl_delivery || ''
    const storeInfo = firstItem.name_store ? `${firstItem.kode_store || ''} - ${firstItem.name_store}` : (firstItem.kode_store ? `${firstItem.kode_store} - ${nameStore}` : nameStore)
    const sjNo = selectedSjNum.value || firstItem.v_sj_num || firstItem.sj_num || ''

    const totalItemsCount = data.length
    const grandTotal = data.reduce((acc: number, item: any) => {
      const sub = item.sub_total !== undefined ? Number(item.sub_total) : (item.total !== undefined ? Number(item.total) : 0)
      return acc + (isNaN(sub) ? 0 : sub)
    }, 0)

    const logoUrl = new URL('/rolla-logo.jpg', window.location.origin).href
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(sjNo)}&size=100x100`

    const tableRowsHtml = data.map((item: any, idx: number) => {
      const kode = item.kode_produk || item.kode_prod || item.kode || '-'
      const name = item.name_produk || item.nama_produk || item.name || '-'
      const cate = item.name_prod_cate || item.kategori || item.category || '-'
      const uom = item.name_prod_uom || item.satuan || item.uom || '-'
      const qty = item.qty !== undefined ? item.qty : (item.qty_loading || 0)
      const dis = item.discount !== undefined ? item.discount : (item.dis || 0)
      const price = item.price !== undefined ? item.price : (item.harga || 0)
      const subTotal = item.sub_total !== undefined ? item.sub_total : (item.total !== undefined ? item.total : 0)

      return `
        <tr>
          <td style="text-align: center;">${idx + 1}</td>
          <td style="text-align: left;">${kode}</td>
          <td style="text-align: left;">${name}</td>
          <td style="text-align: left;">${cate}</td>
          <td style="text-align: left;">${uom}</td>
          <td style="text-align: right;">${qty}</td>
          <td style="text-align: right;">${dis}</td>
          <td style="text-align: right;">${price}</td>
          <td style="text-align: right;">${subTotal}</td>
        </tr>
      `
    }).join('')

    const printHtml = `
      <div class="sj-print">
        <div class="header-row">
          <div class="header-left">
            <img src="${logoUrl}" alt="Rolla Logo" class="logo-img" />
            <div class="company-info">
              <div class="cmp-name">${companyName}</div>
              <div class="cmp-prod">${prodDesc}</div>
              <div class="cmp-address">${address}</div>
              <div class="doc-title">SURAT JALAN</div>
            </div>
          </div>
          <div class="header-right">
            <table class="meta-table">
              <tr><td class="meta-label">Area</td><td>:${area}</td></tr>
              <tr><td class="meta-label">Tanggal</td><td>:${deliveryDate}</td></tr>
              <tr><td class="meta-label">Toko</td><td>:${storeInfo}</td></tr>
              <tr><td class="meta-label">No</td><td>:${sjNo}</td></tr>
            </table>
            <img src="${qrUrl}" alt="QR" class="qr-img" />
          </div>
        </div>

        <div class="signatures">
          <div class="sig-box">
            <span>Admin Produksi</span>
            <span>Admin</span>
          </div>
          <div class="sig-box">
            <span>Driver</span>
            <span>----------</span>
          </div>
          <div class="sig-box">
            <span>Penerima</span>
            <span>----------</span>
          </div>
        </div>

        <div class="summary-bar">
          <div>Keterangan</div>
          <div class="sum-right">
            <span>Jumlah Item : ${totalItemsCount}</span>
            <span>Total Akhir : ${grandTotal}</span>
          </div>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th class="center" style="width: 30px;">No</th>
              <th>KODE</th>
              <th>ITEM</th>
              <th>KATEGORY</th>
              <th>SATUAN</th>
              <th class="right">QTY</th>
              <th class="right">DIS</th>
              <th class="right">PRICE</th>
              <th class="right">SUB TOTAL</th>
            </tr>
          </thead>
          <tbody>
            ${tableRowsHtml}
          </tbody>
        </table>
      </div>
    `

    import('print-js').then((module) => {
      const printJS = module.default
      printJS({
        printable: printHtml,
        type: 'raw-html',
        documentTitle: `Surat Jalan ${sjNo}`,
        style: `
          @page { size: A4 landscape; margin: 10mm; }
          body { font-family: Arial, Helvetica, sans-serif; font-size: 11px; color: #000; background: #fff; margin: 0; padding: 0; }
          .sj-print { width: 100%; box-sizing: border-box; }
          .header-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 25px; }
          .header-left { display: flex; gap: 15px; }
          .logo-img { width: 80px; height: auto; object-fit: contain; }
          .company-info { display: flex; flex-direction: column; gap: 3px; }
          .cmp-name { font-weight: bold; font-size: 12px; }
          .cmp-prod { font-weight: bold; font-size: 11px; }
          .cmp-address { font-size: 10px; max-width: 450px; line-height: 1.3; }
          .doc-title { font-weight: bold; font-size: 13px; margin-top: 8px; }
          .header-right { display: flex; gap: 15px; align-items: flex-start; }
          .meta-table { border-collapse: collapse; font-size: 10px; font-weight: bold; margin-top: 2px; }
          .meta-table td { padding: 2px 4px; vertical-align: top; }
          .meta-label { text-align: left; }
          .qr-img { width: 75px; height: 75px; object-fit: contain; }
          .signatures { display: flex; justify-content: space-around; margin-bottom: 25px; font-size: 11px; font-weight: bold; text-align: center; }
          .sig-box { display: flex; flex-direction: column; justify-content: space-between; height: 65px; width: 150px; }
          .summary-bar { display: flex; justify-content: space-between; align-items: flex-end; font-size: 11px; font-weight: bold; margin-bottom: 5px; }
          .sum-right { display: flex; gap: 30px; }
          .data-table { width: 100%; border-collapse: collapse; border: 1.5px solid #000; font-size: 10px; }
          .data-table th, .data-table td { border: 1px solid #000; padding: 6px; }
          .data-table th { font-weight: bold; text-transform: uppercase; text-align: left; }
          .data-table th.center { text-align: center; }
          .data-table th.right { text-align: right; }
        `
      })
    }).catch(err => {
      console.error("Error loading print-js", err)
      alert("Gagal memuat modul print")
    })
  } else {
    alert("Data Surat Jalan kosong atau gagal diambil dari server.")
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9; 
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1; 
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8; 
}
</style>
