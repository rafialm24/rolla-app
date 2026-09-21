<template>
  <NuxtLayout name="dashboard">
    <div class="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200 p-4 lg:p-8 font-sans relative overflow-hidden">
      <!-- Decorative Background Elements -->
      <div class="absolute top-0 left-0 w-96 h-96 bg-red-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div class="absolute top-0 right-0 w-96 h-96 bg-rose-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

      <!-- Header Section -->
      <div class="relative backdrop-blur-xl bg-white/80 rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white mb-8 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/30">
            <UIcon name="i-heroicons-tag" class="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 class="text-2xl font-black text-slate-800 tracking-tight">Data Discount</h1>
            <p class="text-xs font-semibold text-slate-500 tracking-wide mt-0.5 uppercase">Kelola data discount surat jalan produksi</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        
        <!-- CARD 1: Data List Discount -->
        <div class="backdrop-blur-md bg-white/90 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col h-full">
          <div class="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-100 px-6 py-4 flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center"><UIcon name="i-heroicons-list-bullet" class="w-4 h-4" /></div>
            <h2 class="text-sm font-extrabold text-slate-800 uppercase tracking-widest">Data List Discount</h2>
          </div>
          <div class="p-6 flex-1 flex flex-col">
            <!-- Form GET DATA -->
            <div class="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 shadow-inner">
              <div class="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex-1">
                <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">DATE :</label>
                <UInput type="date" v-model="selectedDate" size="xs" variant="none" :ui="{ base: 'font-bold w-full' }" />
              </div>
              <UButton @click="handleGetData" :loading="isLoadingHeader" size="sm" color="rose" variant="solid" icon="i-heroicons-arrow-down-tray" class="rounded-xl shadow-md shadow-rose-500/20 font-bold uppercase tracking-wider text-[10px] justify-center sm:justify-start">
                GET DATA
              </UButton>
            </div>

            <!-- Table Header -->
            <div class="border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-white flex-1">
              <div class="overflow-x-auto max-h-[400px] custom-scrollbar">
                <table class="w-full text-xs">
                  <thead class="bg-slate-50/80 backdrop-blur-sm border-b border-slate-100 sticky top-0 z-10">
                    <tr>
                      <th class="px-3 py-3 text-center font-bold text-slate-500 uppercase tracking-wider text-[9px] w-24 whitespace-nowrap">Action</th>
                      <th class="px-3 py-3 text-left font-bold text-slate-500 uppercase tracking-wider text-[9px] whitespace-nowrap">Sj Number</th>
                      <th class="px-3 py-3 text-left font-bold text-slate-500 uppercase tracking-wider text-[9px] whitespace-nowrap">Kode Store</th>
                      <th class="px-3 py-3 text-left font-bold text-slate-500 uppercase tracking-wider text-[9px] whitespace-nowrap">Name Store</th>
                      <th class="px-3 py-3 text-center font-bold text-slate-500 uppercase tracking-wider text-[9px]">Status</th>
                      <th class="px-3 py-3 text-left font-bold text-slate-500 uppercase tracking-wider text-[9px] whitespace-nowrap">Create By</th>
                      <th class="px-3 py-3 text-center font-bold text-slate-500 uppercase tracking-wider text-[9px] whitespace-nowrap">Create Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="isLoadingHeader">
                      <td colspan="7" class="px-4 py-12 text-center text-slate-400"><UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin mx-auto mb-2 text-rose-500" /><p class="font-semibold text-[10px]">Memuat data...</p></td>
                    </tr>
                    <tr v-else-if="discountHeaderList.length === 0">
                      <td colspan="7" class="px-4 py-12 text-center text-slate-400"><UIcon name="i-heroicons-inbox" class="w-8 h-8 mx-auto mb-2 text-slate-300" /><p class="font-semibold text-[10px]">Tidak ada data discount</p></td>
                    </tr>
                    <tr v-else v-for="item in discountHeaderList" :key="item.sj_num" class="border-b border-slate-50 hover:bg-slate-50/80 transition-colors cursor-pointer" :class="{ 'bg-blue-50/50 shadow-inner': selectedSjNum === item.sj_num }" @click="handleShowDetail(item)">
                      <td class="px-3 py-3 text-center">
                        <UButton @click.stop="handleShowDetail(item)" size="2xs" color="blue" variant="soft" icon="i-heroicons-eye" class="font-bold text-[9px] uppercase tracking-wider mx-auto">Show</UButton>
                      </td>
                      <td class="px-3 py-3 font-extrabold text-slate-700 whitespace-nowrap">{{ item.sj_num }}</td>
                      <td class="px-3 py-3 text-slate-500 font-bold whitespace-nowrap">{{ item.kode_store }}</td>
                      <td class="px-3 py-3 font-extrabold text-slate-700 whitespace-nowrap">{{ item.name_store }}</td>
                      <td class="px-3 py-3 text-center">
                        <UBadge :color="item.statuss === 'Complete' ? 'emerald' : 'amber'" variant="subtle" size="xs" class="font-bold tracking-wider uppercase text-[9px]">
                          {{ item.statuss || '-' }}
                        </UBadge>
                      </td>
                      <td class="px-3 py-3 text-[10px] font-bold text-slate-600 whitespace-nowrap">{{ item.usrnm }}</td>
                      <td class="px-3 py-3 text-center text-[10px] font-bold text-slate-500 whitespace-nowrap">{{ formatDate(item.create_date) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Pagination -->
            <div class="mt-5 flex items-center justify-between bg-slate-50/50 p-3 rounded-xl border border-slate-100">
              <div class="flex items-center gap-3">
                <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Rows:</span>
                <USelect v-model="rowsPage" :options="[{label:'10', value:10},{label:'20', value:20},{label:'50', value:50}]" @change="handleGetData" size="sm" :ui="{ rounded: 'rounded-lg' }" />
              </div>
              <div class="flex items-center gap-2">
                <UButton @click="pageNumber--" :disabled="pageNumber === 1" size="xs" color="gray" variant="ghost" icon="i-heroicons-chevron-left" />
                <span class="text-[10px] font-bold text-slate-700 mx-2">Page {{ pageNumber }}</span>
                <UButton @click="pageNumber++" :disabled="discountHeaderList.length < rowsPage" size="xs" color="gray" variant="ghost" icon="i-heroicons-chevron-right" />
              </div>
            </div>
          </div>
        </div>

        <!-- CARD 2: Data List Detail Discount -->
        <div class="backdrop-blur-md bg-white/90 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col h-full relative">
          <div class="absolute top-0 right-0 w-64 h-64 bg-indigo-800/5 rounded-bl-[100%] pointer-events-none"></div>
          <div class="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-100 px-6 py-4 flex justify-between items-center relative z-10">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center"><UIcon name="i-heroicons-queue-list" class="w-4 h-4" /></div>
              <h2 class="text-sm font-extrabold text-slate-800 uppercase tracking-widest">Detail Discount</h2>
            </div>
            <UBadge v-if="selectedSjNum" color="indigo" variant="soft" size="sm" class="font-bold tracking-wider">
              SJ: {{ selectedSjNum }}
            </UBadge>
          </div>
          <div class="p-6 flex-1 flex flex-col relative z-10">
            <div class="border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-white flex-1">
              <div class="overflow-x-auto max-h-[400px] custom-scrollbar">
                <table class="w-full text-xs">
                  <thead class="bg-slate-50/80 backdrop-blur-sm border-b border-slate-100 sticky top-0 z-10">
                    <tr>
                      <th class="px-3 py-3 text-center font-bold text-slate-500 uppercase tracking-wider text-[9px] w-20">Action</th>
                      <th class="px-3 py-3 text-left font-bold text-slate-500 uppercase tracking-wider text-[9px] whitespace-nowrap">Kode Produk</th>
                      <th class="px-3 py-3 text-left font-bold text-slate-500 uppercase tracking-wider text-[9px] whitespace-nowrap">Name Produk</th>
                      <th class="px-3 py-3 text-center font-bold text-slate-500 uppercase tracking-wider text-[9px]">Uom</th>
                      <th class="px-3 py-3 text-right font-bold text-slate-500 uppercase tracking-wider text-[9px]">Qty</th>
                      <th class="px-3 py-3 text-right font-bold text-slate-500 uppercase tracking-wider text-[9px] whitespace-nowrap">Price Deliv</th>
                      <th class="px-3 py-3 text-right font-bold text-slate-500 uppercase tracking-wider text-[9px] w-32">Discount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="!selectedSjNum">
                      <td colspan="7" class="px-4 py-16 text-center text-slate-400"><UIcon name="i-heroicons-hand-raised" class="w-8 h-8 mx-auto mb-2 text-slate-300" /><p class="font-semibold text-[10px]">Pilih data dari tabel di sebelah kiri</p></td>
                    </tr>
                    <tr v-else-if="isLoadingDetail">
                      <td colspan="7" class="px-4 py-16 text-center text-slate-400"><UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin mx-auto mb-2 text-indigo-500" /><p class="font-semibold text-[10px]">Memuat detail...</p></td>
                    </tr>
                    <tr v-else-if="discountDetailList.length === 0">
                      <td colspan="7" class="px-4 py-16 text-center text-slate-400"><UIcon name="i-heroicons-inbox" class="w-8 h-8 mx-auto mb-2 text-slate-300" /><p class="font-semibold text-[10px]">Tidak ada detail</p></td>
                    </tr>
                    <tr v-else v-for="(item, idx) in discountDetailList" :key="item.id || idx" class="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                      <td class="px-2 py-3 text-center">
                        <UButton @click="handleSetDiscount(item)" :disabled="item._originalDiskon > 0 || isSaving" 
                          size="2xs" :color="item._originalDiskon > 0 ? 'gray' : 'blue'" :variant="item._originalDiskon > 0 ? 'solid' : 'solid'" 
                          class="font-bold text-[9px] uppercase tracking-wider mx-auto w-full justify-center shadow-sm">
                          Set
                        </UButton>
                      </td>
                      <td class="px-3 py-3 font-bold text-slate-500 whitespace-nowrap">{{ item.kode_produk }}</td>
                      <td class="px-3 py-3 font-extrabold text-slate-700 whitespace-nowrap">{{ item.name_produk }}</td>
                      <td class="px-3 py-3 text-center font-bold text-slate-500">{{ item.uomm }}</td>
                      <td class="px-3 py-3 text-right font-black text-blue-600">{{ formatNumber(item.qty) }}</td>
                      <td class="px-3 py-3 text-right font-bold text-slate-600">{{ formatNumber(item.price) }}</td>
                      <td class="px-3 py-3 text-right">
                        <UInput type="number" v-model.number="item.diskon" min="0" 
                          :disabled="item._originalDiskon > 0"
                          size="xs"
                          :ui="{ base: 'text-right font-black', rounded: 'rounded-md', color: { white: { outline: item._originalDiskon > 0 ? 'bg-slate-100 text-slate-500' : 'text-rose-600' } } }" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Footer Actions Detail -->
            <div class="mt-5 pt-5 border-t border-slate-100 flex flex-col sm:flex-row justify-between gap-4" v-if="selectedSjNum">
              <UButton @click="handlePrint" :disabled="isLoadingDetail" size="md" color="emerald" variant="solid" icon="i-heroicons-printer" class="flex-1 justify-center rounded-xl shadow-md shadow-emerald-500/20 font-bold uppercase tracking-widest text-[10px]">
                PRINT
              </UButton>
              <UButton @click="handlePosting" :disabled="selectedStatus === 'Complete' || isLoadingDetail || isSaving" 
                size="md" :color="selectedStatus === 'Complete' ? 'gray' : 'indigo'" variant="solid" icon="i-heroicons-paper-airplane" 
                class="flex-1 justify-center rounded-xl shadow-md font-bold uppercase tracking-widest text-[10px]"
                :class="selectedStatus === 'Complete' ? '' : 'shadow-indigo-500/20 bg-indigo-600 hover:bg-indigo-700'">
                POSTING
              </UButton>
            </div>
          </div>
        </div>
      </div>

      <!-- CARD 3: Cari Surat Jalan Belum Discount (Conditional if not DC) -->
      <div v-if="activeProdId !== 3" class="backdrop-blur-md bg-white/90 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden transition-all duration-300 hover:shadow-xl mt-8 relative z-10">
        <div class="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center backdrop-blur-sm"><UIcon name="i-heroicons-magnifying-glass" class="w-4 h-4" /></div>
          <h2 class="text-sm font-extrabold text-white uppercase tracking-widest">Cari Surat Jalan Belum Discount</h2>
        </div>
        <div class="p-6">
          <div class="flex flex-col md:flex-row items-end gap-4 mb-6 bg-slate-50/50 p-5 rounded-2xl border border-slate-100 shadow-inner">
            <div class="flex-1 w-full">
              <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Toko/Client:</label>
              <USelect v-model="filterUndiscount.store" :options="comboAreaList.map(c => ({label: c.client || c.name || c.name_store || 'Unknown', value: c.set_id || c.id_client || c.id_store}))" placeholder="Pilih Toko/Client..." size="md" :ui="{ rounded: 'rounded-xl', base: 'font-semibold' }" />
            </div>
            
            <div class="flex-1 w-full">
              <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Produk Roti:</label>
              <USelect v-model="filterUndiscount.produk" :options="comboProdukList.map(p => ({label: p.name_produk || p.nama_produk || p.name_item || p.nama_item || 'Unknown', value: p.id_produk || p.id_item || p.id}))" placeholder="Pilih Produk..." size="md" :ui="{ rounded: 'rounded-xl', base: 'font-semibold' }" />
            </div>
            
            <UButton @click="handleSearchUndiscount" :loading="isLoadingUndiscounted" size="md" color="amber" variant="solid" icon="i-heroicons-magnifying-glass" class="w-full md:w-auto rounded-xl shadow-md shadow-amber-500/20 font-bold uppercase tracking-widest text-[10px] justify-center h-[38px]">
              Cari Data
            </UButton>
          </div>
          
          <div class="border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-white">
            <div class="overflow-x-auto max-h-[300px] custom-scrollbar">
              <table class="w-full text-sm">
                <thead class="bg-slate-50/80 backdrop-blur-sm border-b border-slate-100 sticky top-0">
                  <tr>
                    <th class="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider text-[10px] w-1/4">Nomor SJ</th>
                    <th class="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider text-[10px] w-1/3">Nama Toko</th>
                    <th class="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider text-[10px]">Nama Produk</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="isLoadingUndiscounted">
                    <td colspan="3" class="px-4 py-12 text-center text-slate-400"><UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin mx-auto mb-2 text-amber-500" /><p class="font-semibold text-[10px]">Memuat data...</p></td>
                  </tr>
                  <tr v-else-if="undiscountedSjList.length === 0">
                    <td colspan="3" class="px-4 py-12 text-center text-slate-400"><UIcon name="i-heroicons-inbox" class="w-8 h-8 mx-auto mb-2 text-slate-300" /><p class="font-semibold text-[10px]">Tidak ada data ditemukan</p></td>
                  </tr>
                  <tr v-else v-for="(item, idx) in undiscountedSjList" :key="idx" class="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                    <td class="px-4 py-3 font-extrabold text-slate-700">{{ item.sj_num || '-' }}</td>
                    <td class="px-4 py-3 font-bold text-slate-600">{{ item.name_store || '-' }}</td>
                    <td class="px-4 py-3 font-bold text-slate-600">{{ item.name_produk || '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>

  <!-- PRINT SECTION (Hidden from screen, printed via JS/CSS) -->
  <div v-if="printDataList && printDataList.length > 0" id="printArea" class="hidden">
    <div style="font-family: Arial, sans-serif; width: 100%; max-width: 800px; padding: 20px; background: white; color: black;">
      <table style="width: 100%; border-bottom: 2px solid black; padding-bottom: 10px; margin-bottom: 15px;">
        <tr>
          <td style="width: 60%; vertical-align: top;">
            <h3 style="margin: 0; font-size: 18px; font-weight: bold;">{{ printDataList[0]?.name_prod || 'NAMA PERUSAHAAN' }}</h3>
            <div style="font-size: 12px; margin-top: 4px;">{{ printDataList[0]?.alamat_prod || 'Alamat Perusahaan' }}</div>
          </td>
          <td style="width: 40%; text-align: right; vertical-align: top;">
            <h2 style="margin: 0; font-size: 22px; font-weight: bold;">SURAT JALAN</h2>
            <div style="font-size: 14px; font-weight: bold; margin-top: 5px;">DISCOUNT NOTE</div>
          </td>
        </tr>
      </table>

      <table style="width: 100%; font-size: 14px; margin-bottom: 20px;">
        <tr>
          <td style="width: 15%;">No. WO / SJ</td>
          <td style="width: 2%;">:</td>
          <td style="width: 33%;">{{ printDataList[0]?.wo_number || '-' }}</td>

          <td style="width: 15%;">Kepada Yth,</td>
          <td style="width: 2%;">:</td>
          <td style="width: 33%;">{{ printDataList[0]?.location || '-' }}</td>
        </tr>
        <tr>
          <td>Tanggal</td>
          <td>:</td>
          <td>{{ printDataList[0]?.delivery_date || '-' }}</td>

          <td>Catatan</td>
          <td>:</td>
          <td style="vertical-align: top;">-</td>
        </tr>
      </table>

      <table style="width: 100%; border-collapse: collapse; font-size: 13px; border: 1px solid black; margin-bottom: 30px;">
        <thead>
          <tr style="background-color: #f0f0f0; text-align: center;">
            <th style="border: 1px solid black; padding: 5px; width: 5%;">No</th>
            <th style="border: 1px solid black; padding: 5px;">Nama Barang</th>
            <th style="border: 1px solid black; padding: 5px; width: 10%;">Satuan</th>
            <th style="border: 1px solid black; padding: 5px; width: 8%;">Qty</th>
            <th style="border: 1px solid black; padding: 5px; width: 12%;">Harga</th>
            <th style="border: 1px solid black; padding: 5px; width: 12%;">Discount</th>
            <th style="border: 1px solid black; padding: 5px; width: 15%;">Hmt Discount</th>
            <th style="border: 1px solid black; padding: 5px; width: 15%;">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in printDataList" :key="idx">
            <td style="border: 1px solid black; padding: 5px; text-align: center;">{{ idx + 1 }}</td>
            <td style="border: 1px solid black; padding: 5px;">{{ item.name_produk || '-' }}</td>
            <td style="border: 1px solid black; padding: 5px; text-align: center;">{{ item.uomm || '-' }}</td>
            <td style="border: 1px solid black; padding: 5px; text-align: center;">{{ formatNumber(item.qty) }}</td>
            <td style="border: 1px solid black; padding: 5px; text-align: right;">{{ formatNumber(item.price) }}</td>
            <td style="border: 1px solid black; padding: 5px; text-align: right;">{{ formatNumber(item.diskon) }}</td>
            <td style="border: 1px solid black; padding: 5px; text-align: right;">{{ formatNumber(item.hmt_diskon) }}</td>
            <td style="border: 1px solid black; padding: 5px; text-align: right;">{{ formatNumber(item.total) }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="5" style="border: 1px solid black; padding: 5px; text-align: right; font-weight: bold;">TOTAL KESELURUHAN :</td>
            <td style="border: 1px solid black; padding: 5px; text-align: right; font-weight: bold;">{{ formatNumber(printGrandTotalDis) }}</td>
            <td style="border: 1px solid black; padding: 5px; border-left: none;"></td>
            <td style="border: 1px solid black; padding: 5px; text-align: right; font-weight: bold;">{{ formatNumber(printGrandTotal) }}</td>
          </tr>
        </tfoot>
      </table>

      <table style="width: 100%; margin-top: 50px; text-align: center; font-size: 13px;">
        <tr>
          <td style="width: 33%;">
            <div>Penerima</div>
            <br><br><br><br>
            <div>( ....................... )</div>
          </td>
          <td style="width: 33%;">
            <div>Admin</div>
            <br><br><br><br>
            <div>( {{ printDataList[0]?.usrnm || 'Admin Gudang' }} )</div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useDiscountList } from '../../composables/useDiscountList'

const {
  activeProdId,
  discountHeaderList,
  discountDetailList,
  undiscountedSjList,
  comboAreaList,
  comboProdukList,
  printDataList,
  isLoadingHeader,
  isLoadingDetail,
  isLoadingUndiscounted,
  isSaving,
  fetchHeaderList,
  fetchDetailList,
  fetchComboArea,
  fetchComboProduk,
  fetchUndiscountedSj,
  saveDiscount,
  postDiscount,
  fetchPrintData
} = useDiscountList()

// Local State
const selectedDate = ref(new Date().toISOString().slice(0, 10))
const pageNumber = ref(1)
const rowsPage = ref(10)

const selectedSjNum = ref('')
const selectedCreateDate = ref('')
const selectedStatus = ref('')
const selectedStoreId = ref(0)

const filterUndiscount = ref({
  store: '',
  produk: ''
})

onMounted(async () => {
  // Hanya load data combo untuk dropdown filter
  // Data utama (header list) hanya dimuat saat user klik "GET DATA"
  await fetchComboArea()
  await fetchComboProduk()
})

const formatNumber = (num: any) => {
  if (!num && num !== 0) return '0'
  return new Intl.NumberFormat('id-ID').format(Number(num))
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  try {
    return new Date(dateStr).toISOString().slice(0, 10)
  } catch (e) {
    return dateStr
  }
}

// GET DATA Header
const handleGetData = async () => {
  selectedSjNum.value = ''
  selectedCreateDate.value = ''
  selectedStatus.value = ''
  discountDetailList.value = []
  
  await fetchHeaderList(selectedDate.value, pageNumber.value, rowsPage.value)
}

// SHOW Detail
const handleShowDetail = async (item: any) => {
  selectedSjNum.value = item.sj_num
  selectedCreateDate.value = item.create_date || ''
  selectedStatus.value = item.statuss || ''
  selectedStoreId.value = item.id_store || item.lokasi_id || 0

  const statusParam = item.statuss === 'Complete' ? 2 : 1
  
  await fetchDetailList(item.sj_num, selectedCreateDate.value, statusParam)
  
  // Track original discount values to disable input if already > 0
  if (discountDetailList.value) {
    for (const det of discountDetailList.value) {
      det._originalDiskon = Number(det.diskon) || 0
      det.diskon = det._originalDiskon
    }
  }
}

// SET (Save) Discount Item
const handleSetDiscount = async (item: any) => {
  let discountVal = Number(item.diskon)
  if (isNaN(discountVal) || discountVal < 0) {
    discountVal = 0
    item.diskon = 0
  }

  const res = await saveDiscount(item.id, discountVal)
  if (res && res.status === 1) {
    alert("Discount Berhasil Update")
    // Reload details
    const statusParam = selectedStatus.value === 'Complete' ? 2 : 1
    await fetchDetailList(selectedSjNum.value, selectedCreateDate.value, statusParam)
    if (discountDetailList.value) {
      for (const det of discountDetailList.value) {
        det._originalDiskon = Number(det.diskon) || 0
        det.diskon = det._originalDiskon
      }
    }
  } else {
    alert("Discount Gagal Update: " + (res?.message || ''))
  }
}

// POSTING
const handlePosting = async () => {
  if (!selectedSjNum.value) return

  const res = await postDiscount(selectedSjNum.value)
  if (res && res.status === 1) {
    alert("Posting Berhasil")
    const statusParam = selectedStatus.value === 'Complete' ? 2 : 1
    await fetchDetailList(selectedSjNum.value, selectedCreateDate.value, statusParam)
    // Update header list to reflect status changes if any
    await fetchHeaderList(selectedDate.value, pageNumber.value, rowsPage.value)
  } else if (res && res.db_code === 99) {
    alert("Stok toko kurang mohon hubungi SPV Penjualan/BM untuk revisi")
  } else if (res && res.db_code === 2) {
    alert("Ada yang direvisi oleh SPV Penjualan/BM, mohon hubungi Anak Toko")
  } else {
    alert(res?.message || 'Posting Gagal, Ada discount yang belum diset')
  }
}

// CARI Undiscounted SJ
const handleSearchUndiscount = async () => {
  if (!filterUndiscount.value.store || !filterUndiscount.value.produk) {
    alert("Silakan pilih Toko dan Produk terlebih dahulu!")
    return
  }
  await fetchUndiscountedSj(Number(filterUndiscount.value.store), Number(filterUndiscount.value.produk))
}

// PRINT Logic
const printGrandTotal = computed(() => {
  if (!printDataList.value) return 0
  return printDataList.value.reduce((sum, item) => sum + (Number(item.total) || 0), 0)
})

const printGrandTotalDis = computed(() => {
  if (!printDataList.value) return 0
  return printDataList.value.reduce((sum, item) => sum + (Number(item.total_dis) || 0), 0)
})

const handlePrint = async () => {
  if (!selectedSjNum.value) return
  
  await fetchPrintData(selectedSjNum.value, selectedCreateDate.value)
  
  if (printDataList.value && printDataList.value.length > 0) {
    setTimeout(() => {
      const printContents = document.getElementById('printArea')?.innerHTML
      if (printContents) {
        const originalContents = document.body.innerHTML
        document.body.innerHTML = printContents
        window.print()
        document.body.innerHTML = originalContents
        window.location.reload()
      }
    }, 500)
  } else {
    alert("Data Surat Jalan tidak ditemukan.")
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

@media print {
  @page { margin: 0; size: auto; }
  body { margin: 1.6cm; background: white; }
  .hidden { display: block !important; }
}
</style>
