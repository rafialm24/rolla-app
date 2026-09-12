<template>
  <div class="min-h-screen relative flex flex-col bg-[#1a0e05] overflow-hidden selection:bg-orange-500 selection:text-white">
    
    <!-- ===== FULL-SCREEN BACKGROUND ===== -->
    <!-- Dark Bakery Background Image -->
    <div class="absolute inset-0 z-0 bg-[url('/Bakery_Production.png')] bg-cover bg-center bg-no-repeat opacity-30 animate-kenburns"></div>
    
    <!-- Dark Warm Gradient Overlays -->
    <div class="absolute inset-0 z-0 bg-gradient-to-r from-[#1a0e05]/98 via-[#1a0e05]/80 to-[#1a0e05]/95"></div>
    <div class="absolute inset-0 z-0 bg-gradient-to-t from-[#1a0e05] via-transparent to-[#1a0e05]/70"></div>
    
    <!-- Ambient Oven Glow -->
    <div class="absolute top-1/3 left-1/2 -translate-x-1/4 w-[600px] h-[400px] bg-amber-600/15 blur-[150px] rounded-full animate-oven-glow z-0 pointer-events-none"></div>
    <div class="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-orange-700/10 blur-[120px] rounded-full z-0 pointer-events-none"></div>

    <!-- ===== MAIN CONTENT ===== -->
    <div class="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-0 px-6 sm:px-10 lg:px-16 pt-8 pb-28">
      
      <!-- === LEFT: LOGIN CARD === -->
      <div class="w-full max-w-[400px] lg:max-w-[380px] xl:max-w-[400px] flex-shrink-0 animate-fade-in-up">
        <div class="relative">
          <!-- Glow behind card -->
          <div class="absolute -inset-2 bg-gradient-to-br from-amber-500/20 to-orange-600/10 rounded-3xl blur-xl opacity-60"></div>
          
          <!-- Card -->
          <div class="relative bg-[#2a1a0a]/70 backdrop-blur-2xl border border-amber-700/30 rounded-3xl p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)]">
            
            <!-- Logo -->
            <div class="mb-6 flex items-center justify-start">
              <img src="/rolla-logo.jpg" alt="Rolla Bakery Logo" class="w-16 h-16 object-contain rounded-full shadow-lg border-2 border-amber-500/30" />
            </div>

            <!-- Headers -->
            <div class="mb-8">
              <h1 class="text-2xl font-bold text-white tracking-tight mb-1">Rolla Bakery</h1>
              <p class="text-sm font-medium text-amber-500/70">Sistem Manajemen Produksi</p>
            </div>

            <!-- Login Form -->
            <AuthLoginForm />
          </div>
        </div>
      </div>

      <!-- === CENTER: PRODUCT IMAGE === -->
      <div class="hidden lg:flex flex-1 items-center justify-center px-8 animate-fade-in-up-delayed">
        <div class="relative">
          <!-- Product shadow/reflection -->
          <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-amber-600/20 blur-2xl rounded-full"></div>
          <img 
            src="/Rolla_Brownise_nobg.png" 
            alt="Rolla Brownies Panggang" 
            class="max-h-[420px] xl:max-h-[480px] object-contain drop-shadow-[0_30px_80px_rgba(0,0,0,0.9)] animate-float relative z-10"
          />
        </div>
      </div>

      <!-- === RIGHT: HERO TEXT === -->
      <div class="hidden lg:flex flex-col justify-center max-w-md xl:max-w-lg flex-shrink-0 animate-fade-in-right">
        <!-- System Status -->
        <div class="flex items-center gap-2.5 mb-8">
          <div class="flex items-center gap-2.5 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            <span class="relative flex h-2.5 w-2.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span class="text-[11px] font-bold text-slate-300 tracking-widest uppercase">Sistem Online</span>
          </div>
        </div>

        <h2 class="text-5xl xl:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-5">
          <span class="block opacity-0 animate-slide-up-1">Kualitas Terbaik,</span>
          <span class="block opacity-0 animate-slide-up-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Proses Lebih Efisien</span>
        </h2>
        <p class="text-base text-slate-400 font-medium leading-relaxed opacity-0 animate-slide-up-3">
          Meningkatkan efisiensi dan kualitas dalam setiap proses produksi roti melalui sistem terpadu yang modern.
        </p>
      </div>
    </div>

    <!-- ===== BOTTOM: PRODUCTION FLOW LABELS ===== -->
    <div class="relative z-10 w-full border-t border-white/5">
      <div class="w-full max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
        <div class="flex items-center justify-between overflow-x-auto scrollbar-hide py-4 gap-0">
          
          <template v-for="(step, index) in productionSteps" :key="step.label">
            <div class="flex items-center group cursor-default flex-shrink-0">
              <span class="text-[10px] font-semibold text-slate-600 uppercase tracking-widest text-center group-hover:text-amber-500 transition-colors duration-200 whitespace-nowrap px-3">{{ step.label }}</span>
            </div>
            <!-- Separator dot between items -->
            <div v-if="index < productionSteps.length - 1" class="w-1 h-1 rounded-full bg-slate-700 flex-shrink-0"></div>
          </template>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false 
})

const productionSteps = [
  {
    label: 'Purchase',
    icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>'
  },
  {
    label: 'Raw Material',
    icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>'
  },
  {
    label: 'DC / Warehouse',
    icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>'
  },
  {
    label: 'Premix & Dough',
    icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517M4.572 15.428a2 2 0 011.022-.547l2.387-.477a6 6 0 013.86.517m-7.269.507L12 21l7.269-5.572M12 3v9"/></svg>'
  },
  {
    label: 'Production',
    icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.573-1.066z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>'
  },
  {
    label: 'BOM',
    icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>'
  },
  {
    label: 'Baking',
    icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"/></svg>'
  },
  {
    label: 'Finished Goods',
    icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
  },
  {
    label: 'Inventory',
    icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"/></svg>'
  },
  {
    label: 'Monitoring',
    icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>'
  }
]
</script>

<style scoped>
/* ===== ENTRANCE ANIMATIONS ===== */
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.animate-fade-in-up-delayed {
  opacity: 0;
  animation: fade-in-up 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
}

@keyframes fade-in-right {
  from { opacity: 0; transform: translateX(40px); }
  to { opacity: 1; transform: translateX(0); }
}
.animate-fade-in-right {
  opacity: 0;
  animation: fade-in-right 1s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards;
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slide-up-1 { animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s forwards; }
.animate-slide-up-2 { animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.8s forwards; }
.animate-slide-up-3 { animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1.0s forwards; }

/* ===== BACKGROUND ANIMATIONS ===== */
@keyframes kenburns {
  0% { transform: scale(1) translate(0, 0); }
  50% { transform: scale(1.04) translate(-0.5%, -0.3%); }
  100% { transform: scale(1) translate(0, 0); }
}
.animate-kenburns {
  animation: kenburns 40s ease-in-out infinite;
}

@keyframes oven-glow {
  0%, 100% { opacity: 0.15; transform: translate(-25%, 0) scale(1); }
  50% { opacity: 0.3; transform: translate(-25%, 0) scale(1.08); }
}
.animate-oven-glow {
  animation: oven-glow 8s ease-in-out infinite;
}

/* ===== PRODUCT FLOAT ===== */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}
.animate-float {
  animation: float 6s ease-in-out infinite;
}

/* ===== SCROLLBAR HIDE ===== */
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
