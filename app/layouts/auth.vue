<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-slate-50 to-blue-100 flex">
    <!-- Left Layout / Main Auth Content -->
    <div class="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-20 xl:px-24">
      <div class="mx-auto w-full max-w-sm lg:w-96">
        <slot />
      </div>
    </div>
    
    <!-- Right Layout (Optional, for Background or Branding) -->
    <div class="hidden lg:block relative w-0 flex-1">
      <slot name="right">
        <!-- Default Fallback Right Side Content -->
        <div class="absolute inset-0 bg-blue-900 w-full h-full flex items-center justify-center">
          <h2 class="text-white text-3xl font-bold">App Authentication</h2>
        </div>
      </slot>
    </div>
  </div>
</template>
