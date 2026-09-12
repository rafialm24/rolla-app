<template>
  <NuxtLayout name="dashboard">
    <div class="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200 p-4 lg:p-8 font-sans relative overflow-hidden">
      <!-- Decorative Background Elements -->
      <div class="absolute top-0 left-0 w-96 h-96 bg-blue-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div class="absolute top-0 right-0 w-96 h-96 bg-purple-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

      <!-- Top Header (Glassmorphism) -->
      <div class="relative backdrop-blur-xl bg-white/80 rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white mb-8 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <UIcon name="i-heroicons-shopping-cart" class="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 class="text-2xl font-black text-slate-800 tracking-tight">Purchase Order Distributor</h1>
            <p class="text-xs font-semibold text-slate-500 tracking-wide mt-0.5 uppercase">Vendor & PO Management</p>
          </div>
        </div>
      </div>

      <div class="space-y-6 relative z-10 pb-12">
        <!-- CARD 1: Data Vendor -->
        <div class="backdrop-blur-md bg-white/90 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div class="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-100 px-6 py-4 flex justify-between items-center cursor-pointer select-none" @click="toggleCard('vendor')">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><UIcon name="i-heroicons-building-office-2" class="w-4 h-4" /></div>
              <h2 class="text-sm font-extrabold text-slate-800 uppercase tracking-widest">Data Vendor</h2>
            </div>
            <UIcon name="i-heroicons-chevron-down" class="w-5 h-5 text-slate-400 transform transition-transform duration-300" :class="{'rotate-180': !cards.vendor}" />
          </div>
          
          <div v-show="cards.vendor" class="p-6">
            <!-- Search & Filter -->
            <div class="mb-5">
              <UInput v-model="searchVendor" @input="handleSearchVendor" icon="i-heroicons-magnifying-glass" placeholder="Cari vendor..." size="md" :ui="{ base: 'w-full sm:w-72 font-semibold text-slate-700', rounded: 'rounded-xl', color: { white: { outline: 'ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500' } } }" />
            </div>

            <!-- Vendor Table -->
            <div class="border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-white">
              <div class="max-h-[400px] overflow-y-auto custom-scrollbar">
                <table class="w-full text-sm">
                  <thead class="bg-slate-50/80 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-100">
                    <tr>
                      <th class="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider text-[10px]">Action</th>
                      <th class="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider text-[10px]">Kode</th>
                      <th class="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider text-[10px]">Nama Vendor</th>
                      <th class="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider text-[10px]">Alamat</th>
                      <th class="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider text-[10px]">Telp</th>
                      <th class="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-wider text-[10px]">Status</th>
                      <th class="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider text-[10px]">Last PO</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="isLoadingVendor">
                      <td colspan="7" class="px-4 py-12 text-center text-slate-400"><UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" /><p class="font-semibold text-xs">Memuat data...</p></td>
                    </tr>
                    <tr v-else-if="vendorList.length === 0">
                      <td colspan="7" class="px-4 py-12 text-center text-slate-400"><UIcon name="i-heroicons-inbox" class="w-8 h-8 mx-auto mb-2 text-slate-300" /><p class="font-semibold text-xs">Tidak ada data vendor</p></td>
                    </tr>
                    <tr v-else v-for="v in vendorList" :key="v.id" class="border-b border-slate-50 hover:bg-blue-50/50 transition-colors group cursor-default" :class="{'bg-blue-50/80': selectedVendor?.id === v.id}">
                      <td class="px-4 py-3">
                        <button @click="selectVendor(v)" class="text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all" :class="selectedVendor?.id === v.id ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'bg-blue-100 text-blue-700 hover:bg-blue-200 group-hover:shadow-sm'">
                          Show
                        </button>
                      </td>
                      <td class="px-4 py-3 font-semibold text-slate-500 text-xs">{{ v.kode_vendor }}</td>
                      <td class="px-4 py-3 font-extrabold text-slate-800">{{ v.name_vendor }}</td>
                      <td class="px-4 py-3 text-slate-500 text-xs truncate max-w-[200px]">{{ v.alamat_vendor }}</td>
                      <td class="px-4 py-3 text-slate-600 text-xs font-semibold">{{ v.tlp_layanan }}</td>
                      <td class="px-4 py-3 text-center">
                        <UBadge :color="v.status_vendor === 1 ? 'emerald' : 'rose'" variant="soft" size="sm" class="font-bold">{{ v.status_vendor === 1 ? 'Active' : 'Non Active' }}</UBadge>
                      </td>
                      <td class="px-4 py-3 text-slate-400 text-xs font-medium">{{ formatDatetime(v.last_po) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <!-- Vendor Pagination -->
            <div class="flex justify-between items-center mt-4 px-2">
              <div class="text-[11px] text-slate-500 font-bold uppercase tracking-widest">
                Page {{ vendorPage }}
              </div>
              <div class="flex gap-2">
                <UButton size="sm" color="white" variant="solid" @click="prevVendorPage" :disabled="vendorPage <= 1" icon="i-heroicons-chevron-left">Prev</UButton>
                <UButton size="sm" color="white" variant="solid" @click="nextVendorPage" :disabled="vendorList.length < 10" trailing-icon="i-heroicons-chevron-right">Next</UButton>
              </div>
            </div>
          </div>
        </div>

        <!-- CARD 2: Data Purchase Order -->
        <div v-if="selectedVendor" class="backdrop-blur-md bg-white/90 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div class="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-100 px-6 py-4 flex justify-between items-center cursor-pointer select-none" @click="toggleCard('po')">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><UIcon name="i-heroicons-clipboard-document-list" class="w-4 h-4" /></div>
              <h2 class="text-sm font-extrabold text-slate-800 uppercase tracking-widest">
                Data Purchase Order <span class="text-emerald-600 ml-1 bg-emerald-50 px-2 py-0.5 rounded-md">- {{ selectedVendor.name_vendor }}</span>
              </h2>
            </div>
            <UIcon name="i-heroicons-chevron-down" class="w-5 h-5 text-slate-400 transform transition-transform duration-300" :class="{'rotate-180': !cards.po}" />
          </div>
          
          <div v-show="cards.po" class="p-6">
            <div class="border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-white">
              <div class="max-h-[400px] overflow-y-auto custom-scrollbar">
                <table class="w-full text-xs whitespace-nowrap">
                  <thead class="bg-slate-50/80 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-100">
                    <tr>
                      <th class="px-3 py-3 text-center font-bold text-slate-500 uppercase tracking-wider text-[10px]">Detail</th>
                      <th class="px-3 py-3 text-left font-bold text-slate-500 uppercase tracking-wider text-[10px]">Receiving Kode</th>
                      <th class="px-3 py-3 text-left font-bold text-slate-500 uppercase tracking-wider text-[10px]">Reference</th>
                      <th class="px-3 py-3 text-left font-bold text-slate-500 uppercase tracking-wider text-[10px]">Tanggal PO</th>
                      <th class="px-3 py-3 text-left font-bold text-slate-500 uppercase tracking-wider text-[10px]">Tanggal Received</th>
                      <th class="px-3 py-3 text-left font-bold text-slate-500 uppercase tracking-wider text-[10px]">User</th>
                      <th class="px-3 py-3 text-right font-bold text-slate-500 uppercase tracking-wider text-[10px]">Total Amount</th>
                      <th class="px-3 py-3 text-right font-bold text-slate-500 uppercase tracking-wider text-[10px]">Down Payment</th>
                      <th class="px-3 py-3 text-right font-bold text-slate-500 uppercase tracking-wider text-[10px]">Discount</th>
                      <th class="px-3 py-3 text-right font-bold text-slate-500 uppercase tracking-wider text-[10px]">Misc. Exp.</th>
                      <th class="px-3 py-3 text-right font-bold text-slate-500 uppercase tracking-wider text-[10px]">Total Terbayar</th>
                      <th class="px-3 py-3 text-right font-bold text-slate-500 uppercase tracking-wider text-[10px]">Total Sisa</th>
                      <th class="px-3 py-3 text-center font-bold text-slate-500 uppercase tracking-wider text-[10px]">Status</th>
                      <th class="px-3 py-3 text-center font-bold text-slate-500 uppercase tracking-wider text-[10px]">Actions</th>
                      <th class="px-3 py-3 text-center font-bold text-slate-500 uppercase tracking-wider text-[10px]">Payment Request</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="isLoadingPO">
                      <td colspan="14" class="px-4 py-12 text-center text-slate-400"><UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin mx-auto mb-2 text-emerald-500" /><p class="font-semibold text-xs">Memuat data...</p></td>
                    </tr>
                    <tr v-else-if="poList.length === 0">
                      <td colspan="14" class="px-4 py-12 text-center text-slate-400"><UIcon name="i-heroicons-document-text" class="w-8 h-8 mx-auto mb-2 text-slate-300" /><p class="font-semibold text-xs">Tidak ada histori Purchase Order</p></td>
                    </tr>
                    <tr v-else v-for="po in poList" :key="po.id" class="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                      <td class="px-3 py-3 text-center">
                        <button @click="openDetailModal(po)" class="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-600 hover:text-white transition-all shadow-sm hover:shadow-indigo-500/30">
                          <UIcon name="i-heroicons-list-bullet" class="w-3 h-3" />
                          Detail
                        </button>
                      </td>
                      <td class="px-3 py-3 font-extrabold text-slate-800">{{ po.receiving_kode }}</td>
                      <td class="px-3 py-3 font-semibold text-slate-600">{{ po.reference }}</td>
                      <td class="px-3 py-3 text-slate-500">{{ formatDatetime(po.tgl_po) }}</td>
                      <td class="px-3 py-3 text-slate-500">{{ formatDatetime(po.tgl_received) }}</td>
                      <td class="px-3 py-3 text-slate-500 font-medium">{{ po.usrnm }}</td>
                      <td class="px-3 py-3 text-right font-bold text-slate-700">{{ formatNumber(po.total_amount) }}</td>
                      <td class="px-3 py-3 text-right text-slate-600">{{ formatNumber(po.down_payment) }}</td>
                      <td class="px-3 py-3 text-right font-semibold text-rose-500">{{ formatNumber(po.discount) }}</td>
                      <td class="px-3 py-3 text-right text-slate-600">{{ formatNumber(po.miscellaneous_expense) }}</td>
                      <td class="px-3 py-3 text-right font-black text-emerald-600 bg-emerald-50/30">{{ formatNumber(po.terbayar) }}</td>
                      <td class="px-3 py-3 text-right font-black text-amber-600 bg-amber-50/30">{{ formatNumber(po.sisabayar) }}</td>
                      
                      <td class="px-3 py-3 text-center">
                        <UBadge v-if="po.id_pay == 0 && po.sisabayar != 0" color="orange" variant="soft" size="xs" class="font-black tracking-wider uppercase text-[9px]">Belum Lunas</UBadge>
                        <UBadge v-else color="emerald" variant="solid" size="xs" class="font-black tracking-wider uppercase text-[9px] shadow-sm shadow-emerald-500/20">LUNAS</UBadge>
                      </td>
                      
                      <!-- Actions -->
                      <td class="px-3 py-3 text-center">
                        <div class="flex items-center justify-center gap-1">
                          <UButton v-if="po.id_pay == 0 && po.sisabayar != 0" @click="openDiscountModal(po)" size="2xs" color="gray" variant="ghost" icon="i-heroicons-receipt-percent" title="Set Discount" class="hover:bg-rose-50 hover:text-rose-600" />
                          <UButton v-if="po.id_pay == 0 && po.sisabayar != 0" @click="openMiscModal(po)" size="2xs" color="gray" variant="ghost" icon="i-heroicons-document-currency-dollar" title="Set Misc Exp" class="hover:bg-blue-50 hover:text-blue-600" />
                        </div>
                      </td>

                      <!-- Payment Request -->
                      <td class="px-3 py-3 text-center">
                        <UButton v-if="po.pay_req == false" @click="handleRequestPayment(po.id)" size="2xs" color="sky" variant="solid" class="font-bold tracking-wider uppercase text-[9px] shadow-sm">
                          Pay Req
                        </UButton>
                        <UButton v-else size="2xs" color="gray" variant="soft" disabled class="font-bold tracking-wider uppercase text-[9px]">
                          Requested
                        </UButton>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- CARD 3: Data List Create -->
        <div v-if="selectedVendor" class="backdrop-blur-md bg-white/90 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div class="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-100 px-6 py-4 flex justify-between items-center cursor-pointer select-none" @click="toggleCard('create')">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center"><UIcon name="i-heroicons-plus-circle" class="w-4 h-4" /></div>
              <h2 class="text-sm font-extrabold text-slate-800 uppercase tracking-widest">Buat Purchase Order</h2>
            </div>
            <UIcon name="i-heroicons-chevron-down" class="w-5 h-5 text-slate-400 transform transition-transform duration-300" :class="{'rotate-180': !cards.create}" />
          </div>
          
          <div v-show="cards.create" class="p-6">
            <!-- Form Header PO -->
            <div class="flex flex-wrap gap-4 items-end mb-8 p-5 bg-gradient-to-r from-slate-50 to-white border border-slate-100 rounded-2xl shadow-sm">
              <div class="w-full sm:w-auto flex-1 min-w-[200px]">
                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Nama Vendor</label>
                <UInput :model-value="selectedVendor.name_vendor" disabled size="md" :ui="{ base: 'font-bold text-slate-700', rounded: 'rounded-xl' }" />
              </div>
              <div class="w-full sm:w-auto flex-1 min-w-[200px]">
                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Reference</label>
                <UInput v-model="formCreate.reference" placeholder="No. Referensi" size="md" :ui="{ base: 'font-semibold', rounded: 'rounded-xl' }" />
              </div>
              <div class="w-full sm:w-auto flex-1 min-w-[200px]">
                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Tanggal PO</label>
                <UInput type="date" v-model="formCreate.tgl_po" size="md" :ui="{ base: 'font-semibold', rounded: 'rounded-xl' }" />
              </div>
              <div>
                <UButton @click="handlePostingPO" :loading="isSaving" :disabled="isSaving || tempItemList.length === 0" size="md" color="emerald" class="font-black tracking-wider uppercase shadow-md shadow-emerald-500/20 px-6 h-[38px] rounded-xl transition-all hover:-translate-y-0.5">
                  POSTING PO
                </UButton>
              </div>
            </div>

            <!-- Add Item Form -->
            <div class="flex flex-wrap gap-4 items-end mb-6 pb-6 border-b border-slate-100">
              <div class="w-full sm:w-auto flex-1 min-w-[150px]">
                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Kategori</label>
                <select v-model="formTemp.kategori" @change="handleKategoriChange" class="w-full text-sm font-semibold border border-slate-200 rounded-xl px-3 h-[38px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all text-slate-700">
                  <option :value="0">--Pilih Kategori--</option>
                  <option v-for="k in kategoriList" :key="k.id" :value="k.id">{{ k.name_prod_cate }}</option>
                </select>
              </div>
              <div class="w-full sm:w-auto flex-[2] min-w-[200px]">
                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Item</label>
                <select v-model="formTemp.item" class="w-full text-sm font-semibold border border-slate-200 rounded-xl px-3 h-[38px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all text-slate-700">
                  <option :value="''">--Pilih Item--</option>
                  <option v-for="i in itemList" :key="i.id" :value="i.id">{{ i.kode_product }} - {{ i.name_produk }}</option>
                </select>
              </div>
              <div class="w-24">
                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Qty</label>
                <UInput type="number" v-model.number="formTemp.qty" min="1" size="md" :ui="{ base: 'font-black text-center', rounded: 'rounded-xl' }" />
              </div>
              <div class="w-32">
                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Harga</label>
                <UInput type="number" v-model.number="formTemp.price" min="0" size="md" :ui="{ base: 'font-black text-right', rounded: 'rounded-xl' }" />
              </div>
              <div>
                <UButton @click="handleAddTemp" :disabled="isSaving || !formTemp.item || formTemp.qty <= 0" size="md" color="indigo" class="font-black tracking-wider uppercase shadow-md shadow-indigo-500/20 px-5 h-[38px] rounded-xl transition-all hover:-translate-y-0.5">
                  <UIcon name="i-heroicons-plus" class="w-4 h-4 mr-1" /> ADD
                </UButton>
              </div>
            </div>

            <!-- Temp Item Table -->
            <div class="border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-white">
              <div class="max-h-[300px] overflow-y-auto custom-scrollbar">
                <table class="w-full text-sm">
                  <thead class="bg-slate-50/80 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-100">
                    <tr>
                      <th class="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-wider text-[10px] w-16">Act</th>
                      <th class="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider text-[10px]">Kode Item</th>
                      <th class="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider text-[10px]">Nama Item</th>
                      <th class="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-wider text-[10px]">Satuan</th>
                      <th class="px-4 py-3 text-right font-bold text-slate-500 uppercase tracking-wider text-[10px]">Qty</th>
                      <th class="px-4 py-3 text-right font-bold text-slate-500 uppercase tracking-wider text-[10px]">Harga Satuan</th>
                      <th class="px-4 py-3 text-right font-bold text-indigo-500 uppercase tracking-wider text-[10px]">Total Harga</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="isLoadingTemp">
                      <td colspan="7" class="px-4 py-8 text-center text-slate-400"><UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" /></td>
                    </tr>
                    <tr v-else-if="tempItemList.length === 0">
                      <td colspan="7" class="px-4 py-8 text-center text-slate-400 font-semibold text-xs">Belum ada item yang ditambahkan ke draf</td>
                    </tr>
                    <tr v-else v-for="t in tempItemList" :key="t.id" class="border-b border-slate-50 hover:bg-slate-50 transition-colors group">
                      <td class="px-4 py-3 text-center">
                        <button @click="handleDeleteTemp(t.id)" class="text-rose-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition-colors" title="Delete">
                          <UIcon name="i-heroicons-trash" class="w-4 h-4" />
                        </button>
                      </td>
                      <td class="px-4 py-3 font-bold text-slate-500 text-xs">{{ t.kode_product }}</td>
                      <td class="px-4 py-3 font-extrabold text-slate-700">{{ t.name }}</td>
                      <td class="px-4 py-3 text-center font-semibold text-slate-500 text-xs bg-slate-50/50 rounded-lg mx-2 inline-block px-2 py-0.5">{{ t.name_prod_uom }}</td>
                      <td class="px-4 py-3 text-right font-black text-slate-700">{{ formatNumber(t.qty) }}</td>
                      <td class="px-4 py-3 text-right font-medium text-slate-600">{{ formatNumber(t.price) }}</td>
                      <td class="px-4 py-3 text-right font-black text-indigo-600 bg-indigo-50/30">{{ formatNumber(t.sub_total) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- Nuxt UI Modals -->
      <UModal v-model="showDiscModal">
        <UCard :ui="{ ring: '', divide: 'divide-y divide-slate-100', rounded: 'rounded-[2rem]', shadow: 'shadow-2xl shadow-rose-500/10' }">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-base font-black text-slate-800 tracking-tight flex items-center gap-2"><UIcon name="i-heroicons-receipt-percent" class="w-5 h-5 text-rose-500" /> Set Discount</h3>
              <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark" class="-my-1" @click="showDiscModal = false" />
            </div>
          </template>
          <div class="py-2">
            <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Discount Amount</label>
            <UInput v-model.number="formAction.amount" type="number" size="xl" :ui="{ base: 'font-black text-rose-600', rounded: 'rounded-xl', icon: { leading: { pointerEvents: 'none' } } }">
              <template #leading>
                <span class="text-slate-400 font-bold text-sm">Rp</span>
              </template>
            </UInput>
          </div>
          <template #footer>
            <div class="flex justify-end gap-3">
              <UButton color="gray" variant="soft" @click="showDiscModal = false" class="font-bold rounded-xl px-5">Batal</UButton>
              <UButton color="rose" variant="solid" @click="submitDiscount" class="font-black uppercase tracking-widest shadow-md shadow-rose-500/20 rounded-xl px-6">Simpan</UButton>
            </div>
          </template>
        </UCard>
      </UModal>

      <UModal v-model="showMiscModal">
        <UCard :ui="{ ring: '', divide: 'divide-y divide-slate-100', rounded: 'rounded-[2rem]', shadow: 'shadow-2xl shadow-blue-500/10' }">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-base font-black text-slate-800 tracking-tight flex items-center gap-2"><UIcon name="i-heroicons-document-currency-dollar" class="w-5 h-5 text-blue-500" /> Set Miscellaneous Exp</h3>
              <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark" class="-my-1" @click="showMiscModal = false" />
            </div>
          </template>
          <div class="py-2">
            <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Misc Amount</label>
            <UInput v-model.number="formAction.amount" type="number" size="xl" :ui="{ base: 'font-black text-blue-600', rounded: 'rounded-xl', icon: { leading: { pointerEvents: 'none' } } }">
              <template #leading>
                <span class="text-slate-400 font-bold text-sm">Rp</span>
              </template>
            </UInput>
          </div>
          <template #footer>
            <div class="flex justify-end gap-3">
              <UButton color="gray" variant="soft" @click="showMiscModal = false" class="font-bold rounded-xl px-5">Batal</UButton>
              <UButton color="blue" variant="solid" @click="submitMisc" class="font-black uppercase tracking-widest shadow-md shadow-blue-500/20 rounded-xl px-6">Simpan</UButton>
            </div>
          </template>
        </UCard>
      </UModal>

      <!-- Modal: Detail Receiving -->
      <UModal v-model="showDetailModal" :ui="{ width: 'sm:max-w-4xl' }">
        <UCard :ui="{ ring: '', divide: 'divide-y divide-slate-100', rounded: 'rounded-[2rem]', shadow: 'shadow-2xl shadow-indigo-500/10' }">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <UIcon name="i-heroicons-list-bullet" class="w-4 h-4" />
                </div>
                <div>
                  <h3 class="text-base font-black text-slate-800 tracking-tight">List Detail Data Receiving</h3>
                  <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">{{ detailReceivingKode }}</p>
                </div>
              </div>
              <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark" class="-my-1" @click="showDetailModal = false" />
            </div>
          </template>

          <div class="py-2">
            <!-- Loading -->
            <div v-if="isLoadingDetail" class="py-12 text-center">
              <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin mx-auto mb-2 text-indigo-500" />
              <p class="text-xs font-semibold text-slate-400">Memuat data detail...</p>
            </div>

            <!-- Empty -->
            <div v-else-if="receivingDetailList.length === 0" class="py-12 text-center">
              <UIcon name="i-heroicons-inbox" class="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p class="text-xs font-semibold text-slate-400">Tidak ada data detail</p>
            </div>

            <!-- Table -->
            <div v-else class="border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-white">
              <div class="max-h-[420px] overflow-y-auto custom-scrollbar">
                <table class="w-full text-xs whitespace-nowrap">
                  <thead class="bg-slate-50/80 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-100">
                    <tr>
                      <th class="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider text-[10px]">#</th>
                      <th class="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider text-[10px]">Kode Product</th>
                      <th class="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider text-[10px]">Nama</th>
                      <th class="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-wider text-[10px]">UOM / Satuan</th>
                      <th class="px-4 py-3 text-right font-bold text-slate-500 uppercase tracking-wider text-[10px]">Harga</th>
                      <th class="px-4 py-3 text-right font-bold text-slate-500 uppercase tracking-wider text-[10px]">QTY</th>
                      <th class="px-4 py-3 text-right font-bold text-indigo-500 uppercase tracking-wider text-[10px]">Sub Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(d, i) in receivingDetailList" :key="i" class="border-b border-slate-50 hover:bg-indigo-50/30 transition-colors">
                      <td class="px-4 py-2.5 text-slate-400 font-semibold">{{ i + 1 }}</td>
                      <td class="px-4 py-2.5 font-bold text-slate-500">{{ d.kode_product }}</td>
                      <td class="px-4 py-2.5 font-extrabold text-slate-800">{{ d.name }}</td>
                      <td class="px-4 py-2.5 text-center">
                        <span class="inline-block bg-slate-100 text-slate-600 font-semibold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md">{{ d.name_prod_uom }}</span>
                      </td>
                      <td class="px-4 py-2.5 text-right text-slate-600 font-medium">{{ formatNumber(d.price) }}</td>
                      <td class="px-4 py-2.5 text-right font-black text-slate-700">{{ formatNumber(d.qty) }}</td>
                      <td class="px-4 py-2.5 text-right font-black text-indigo-600 bg-indigo-50/40">{{ formatNumber(d.sub_total) }}</td>
                    </tr>
                  </tbody>
                  <tfoot class="bg-slate-50/80 border-t border-slate-200 sticky bottom-0">
                    <tr>
                      <td colspan="5" class="px-4 py-2.5 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Grand Total</td>
                      <td class="px-4 py-2.5 text-right font-black text-slate-700">{{ formatNumber(receivingDetailList.reduce((s, d) => s + Number(d.qty || 0), 0)) }}</td>
                      <td class="px-4 py-2.5 text-right font-black text-indigo-700 bg-indigo-100/60">{{ formatNumber(receivingDetailList.reduce((s, d) => s + Number(d.sub_total || 0), 0)) }}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          <template #footer>
            <div class="flex justify-end">
              <UButton color="gray" variant="soft" @click="showDetailModal = false" class="font-bold rounded-xl px-6">Tutup</UButton>
            </div>
          </template>
        </UCard>
      </UModal>
      
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useProduksi } from '~/composables/useProduksi'
import { usePurchaseOrder } from '~/composables/usePurchaseOrder'

definePageMeta({ layout: false })

const { activeProdId } = useProduksi()
const {
  vendorList, poList, tempItemList, kategoriList, itemList, receivingDetailList,
  isLoadingVendor, isLoadingPO, isLoadingTemp, isLoadingDetail, isSaving,
  fetchVendors, fetchPOList, fetchKategori, fetchItems, fetchTempItems,
  saveTempItem, deleteTempItem, postingPO, setDiscount, setMiscellaneous, requestPayment,
  fetchReceivingDetail
} = usePurchaseOrder()

const cards = ref({ vendor: true, po: true, create: true })
const toggleCard = (card: keyof typeof cards.value) => { cards.value[card] = !cards.value[card] }

// --- Vendors ---
const searchVendor = ref('')
const vendorPage = ref(1)

let searchTimer: ReturnType<typeof setTimeout> | null = null
const handleSearchVendor = () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    vendorPage.value = 1
    fetchVendors(searchVendor.value, vendorPage.value, 10)
  }, 500)
}

const prevVendorPage = async () => {
  if (vendorPage.value > 1) {
    vendorPage.value--
    await fetchVendors(searchVendor.value, vendorPage.value, 10)
  }
}

const nextVendorPage = async () => {
  if (vendorList.value.length === 10) {
    vendorPage.value++
    await fetchVendors(searchVendor.value, vendorPage.value, 10)
  }
}

const selectedVendor = ref<any>(null)
const selectVendor = async (vendor: any) => {
  selectedVendor.value = vendor
  await fetchPOList(vendor.id)
  await fetchTempItems(vendor.id)
  // Ensure PO and Create cards are visible
  cards.value.po = true
  cards.value.create = true
}

// --- Create PO ---
const getLocalToday = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const formCreate = ref({ reference: '', tgl_po: getLocalToday() })
const formTemp = ref({ kategori: 0, item: '', qty: 0, price: 0 })

const handleKategoriChange = async () => {
  formTemp.value.item = ''
  if (formTemp.value.kategori) {
    await fetchItems(formTemp.value.kategori)
  }
}

const handleAddTemp = async () => {
  if (!selectedVendor.value) return
  const res = await saveTempItem({
    v_id_vendor: selectedVendor.value.id.toString(),
    v_id_item: formTemp.value.item.toString(),
    v_qty: formTemp.value.qty.toString(),
    v_price: formTemp.value.price.toString()
  })
  if (res.success) {
    formTemp.value.item = ''
    formTemp.value.qty = 0
    formTemp.value.price = 0
    await fetchTempItems(selectedVendor.value.id)
  } else {
    alert("Gagal menyimpan item!")
  }
}

const handleDeleteTemp = async (id: number) => {
  if (!confirm('Apakah Anda yakin ingin menghapus item ini?')) return
  const res = await deleteTempItem(id)
  if (res.success) {
    await fetchTempItems(selectedVendor.value.id)
  }
}

const handlePostingPO = async () => {
  if (!formCreate.value.tgl_po) {
    alert('Tanggal PO tidak boleh kosong')
    return
  }

  // DEBUG: log nilai yang akan dikirim
  console.log('[handlePostingPO] payload:', {
    v_id_comboto: selectedVendor.value?.id,
    v_posted: 1,
    v_reference: formCreate.value.reference,
    v_tgl_po: formCreate.value.tgl_po,
    activeProdId: activeProdId.value
  })

  const res = await postingPO({
    v_id_comboto: selectedVendor.value.id,
    v_posted: 1,
    v_reference: formCreate.value.reference,
    v_tgl_po: formCreate.value.tgl_po
  })

  console.log('[handlePostingPO] response:', res)

  // Cek status dari DB (bukan hanya cek API tidak error)
  const dbStatus = res.data?.status ?? 0
  if (res.success && dbStatus === 1) {
    // Reset form
    formCreate.value.reference = ''
    await fetchPOList(selectedVendor.value.id)
    await fetchTempItems(selectedVendor.value.id)
    alert('Purchase Order berhasil diposting!')
  } else if (res.success && dbStatus === 0) {
    alert('Gagal memposting: Data tidak ditemukan atau id_combo_to tidak cocok (status DB = 0)')
  } else {
    alert('Gagal memposting Purchase Order')
  }
}

// --- Detail Receiving Modal ---
const showDetailModal = ref(false)
const detailReceivingKode = ref('')

const openDetailModal = async (po: any) => {
  detailReceivingKode.value = po.receiving_kode || ''
  showDetailModal.value = true
  await fetchReceivingDetail(po.id)
}

// --- PO Actions ---
const showDiscModal = ref(false)
const showMiscModal = ref(false)
const actionTargetId = ref(0)
const formAction = ref({ amount: 0 })

const openDiscountModal = (po: any) => {
  actionTargetId.value = po.id
  formAction.value.amount = po.discount || 0
  showDiscModal.value = true
}

const submitDiscount = async () => {
  const res = await setDiscount(actionTargetId.value, formAction.value.amount)
  if (res.success) {
    showDiscModal.value = false
    if (selectedVendor.value) await fetchPOList(selectedVendor.value.id)
  } else {
    alert("Gagal set discount")
  }
}

const openMiscModal = (po: any) => {
  actionTargetId.value = po.id
  formAction.value.amount = po.miscellaneous_expense || 0
  showMiscModal.value = true
}

const submitMisc = async () => {
  const res = await setMiscellaneous(actionTargetId.value, formAction.value.amount)
  if (res.success) {
    showMiscModal.value = false
    if (selectedVendor.value) await fetchPOList(selectedVendor.value.id)
  } else {
    alert("Gagal set miscellaneous expense")
  }
}

const handleRequestPayment = async (id: number) => {
  if (!confirm('Ajukan payment request untuk tagihan ini?')) return
  const res = await requestPayment(id)
  if (res.success) {
    if (selectedVendor.value) await fetchPOList(selectedVendor.value.id)
  } else {
    alert("Gagal membuat payment request")
  }
}

// --- Utils ---
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
    })
  } catch {
    return String(val)
  }
}

onMounted(() => {
  if (activeProdId.value) {
    fetchVendors(searchVendor.value, vendorPage.value, 10)
    fetchKategori()
  }
})

// Auto reload if location changes
watch(activeProdId, () => {
  if (activeProdId.value) {
    selectedVendor.value = null
    vendorPage.value = 1
    fetchVendors(searchVendor.value, vendorPage.value, 10)
    fetchKategori()
  }
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { height: 8px; width: 8px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
</style>
