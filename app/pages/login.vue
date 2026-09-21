<template>
  <main
    class="login-page"
    :class="{
      'is-button-hovered': isButtonHovered,
      'is-button-pressed': isButtonPressed,
      'is-leaving': isLeaving
    }"
  >
    <div class="ambient ambient--cream" aria-hidden="true"></div>
    <div class="ambient ambient--cocoa" aria-hidden="true"></div>
    <div class="grain" aria-hidden="true"></div>

    <section class="login-shell" aria-label="Login Rolla Bakery">
      <div class="login-panel">
        <div class="login-panel__inner">
          <header class="brand">
            <div class="brand__mark">
              <img src="/rolla-logo.jpg" alt="" width="52" height="52" />
            </div>
            <div>
              <p class="brand__name">Rolla Bakery</p>
              <p class="brand__eyebrow">Production Management</p>
            </div>
          </header>

          <div class="login-copy">
            <p class="login-copy__kicker">Selamat datang kembali</p>
            <h1>Masuk ke sistem<br />produksi Rolla.</h1>
            <p>Akses operasional bakery dengan aman dalam satu sistem terpadu.</p>
          </div>

          <AuthLoginForm
            @product-hover="isButtonHovered = $event"
            @product-press="handleProductPress"
            @login-success="isLeaving = true"
          />

          <div class="secure-note">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
              <path d="M7 10V8a5 5 0 0 1 10 0v2m-9 0h8a2 2 0 0 1 2 2v7H6v-7a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Koneksi terenkripsi &amp; aman</span>
          </div>
        </div>
      </div>

      <div
        ref="productArea"
        class="product-panel"
        @pointermove="handlePointerMove"
        @pointerleave="resetPointer"
      >
        <div class="product-panel__copy">
          <p class="product-panel__eyebrow"><span></span> Signature product</p>
          <h2>Crafted with care,<br /><em>made to delight.</em></h2>
          <p>Brownies panggang premium dengan cokelat yang kaya dan taburan almond pilihan.</p>
        </div>

        <div class="product-visual" role="img" aria-label="Rolla Brownies Panggang dengan topping almond dan kemasan premium">
          <div class="product-shadow"></div>
          <div class="product-idle">
            <div ref="productParallax" class="product-parallax">
              <div class="product-highlight"></div>
              <picture v-if="useStaticFallback" class="product-media product-media--fallback">
                <img src="/Rolla_Brownise_nobg.png" alt="" width="1024" height="1024" decoding="async" />
              </picture>
              <video
                v-else
                ref="productVideo"
                class="product-media product-media--video"
                src="/3D_Rolla_brownies.mp4"
                poster="/Rolla_Brownise_nobg.png"
                autoplay
                muted
                loop
                playsinline
                preload="metadata"
                disablepictureinpicture
                tabindex="-1"
              ></video>
            </div>
          </div>
        </div>

        <div class="product-caption">
          <span>Rolla Brownies</span>
          <span class="product-caption__line"></span>
          <span>Panggang · Almond</span>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

definePageMeta({ layout: false })

useHead({
  title: 'Masuk | Rolla Bakery',
  meta: [
    { name: 'description', content: 'Masuk ke sistem manajemen produksi Rolla Bakery.' }
  ]
})

const productArea = ref<HTMLElement | null>(null)
const productParallax = ref<HTMLElement | null>(null)
const productVideo = ref<HTMLVideoElement | null>(null)
const isButtonHovered = ref(false)
const isButtonPressed = ref(false)
const isLeaving = ref(false)
const useStaticFallback = ref(false)

let frameId = 0
let currentX = 0
let currentY = 0
let targetX = 0
let targetY = 0
let pressTimer: ReturnType<typeof setTimeout> | undefined

const renderParallax = () => {
  currentX += (targetX - currentX) * 0.075
  currentY += (targetY - currentY) * 0.075

  if (productParallax.value) {
    productParallax.value.style.transform = `rotateX(${currentX.toFixed(3)}deg) rotateY(${currentY.toFixed(3)}deg)`
  }

  frameId = requestAnimationFrame(renderParallax)
}

const handlePointerMove = (event: PointerEvent) => {
  if (useStaticFallback.value || event.pointerType === 'touch' || !productArea.value) return

  const bounds = productArea.value.getBoundingClientRect()
  const normalizedX = ((event.clientX - bounds.left) / bounds.width) * 2 - 1
  const normalizedY = ((event.clientY - bounds.top) / bounds.height) * 2 - 1

  targetX = Math.max(-3, Math.min(3, normalizedY * -3))
  targetY = Math.max(-4, Math.min(4, normalizedX * 4))
}

const resetPointer = () => {
  targetX = 0
  targetY = 0
}

const handleProductPress = () => {
  isButtonPressed.value = true
  if (pressTimer) clearTimeout(pressTimer)
  pressTimer = setTimeout(() => {
    isButtonPressed.value = false
  }, 380)
}

onMounted(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches
  const smallViewport = window.matchMedia('(max-width: 767px)').matches
  const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData

  useStaticFallback.value = reduceMotion || smallViewport || Boolean(saveData) || (deviceMemory !== undefined && deviceMemory <= 2)

  if (!reduceMotion && !coarsePointer) {
    frameId = requestAnimationFrame(renderParallax)
  }

  if (!useStaticFallback.value) {
    if (productVideo.value) {
      productVideo.value.muted = true
      productVideo.value.volume = 0
    }
    productVideo.value?.play().catch(() => {
      useStaticFallback.value = true
    })
  }
})

onBeforeUnmount(() => {
  cancelAnimationFrame(frameId)
  if (pressTimer) clearTimeout(pressTimer)
})
</script>

<style scoped>
.login-page {
  --chocolate-950: #1d0e08;
  --cream: #f8efe2;
  position: relative;
  min-height: 100vh;
  min-height: 100svh;
  overflow: hidden;
  color: var(--chocolate-950);
  background:
    radial-gradient(circle at 73% 48%, rgba(255, 245, 226, 0.92) 0, rgba(225, 194, 159, 0.48) 29%, transparent 58%),
    linear-gradient(118deg, #f7efe4 0%, #ead8c1 43%, #6f4630 43.1%, #2a160e 100%);
}

.login-page::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  box-shadow: inset 0 0 100px rgba(46, 22, 11, 0.17);
}

.ambient {
  position: absolute;
  border-radius: 999px;
  pointer-events: none;
  filter: blur(10px);
}

.ambient--cream {
  right: 7%;
  top: -22%;
  width: 55vw;
  height: 55vw;
  background: rgba(255, 229, 193, 0.2);
}

.ambient--cocoa {
  right: -12%;
  bottom: -35%;
  width: 62vw;
  height: 52vw;
  background: rgba(18, 7, 3, 0.36);
}

.grain {
  position: absolute;
  inset: 0;
  opacity: 0.13;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.18'/%3E%3C/svg%3E");
  mix-blend-mode: soft-light;
}

.login-shell {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(390px, 42%) minmax(0, 58%);
  min-height: 100vh;
  min-height: 100svh;
}

.login-panel {
  display: flex;
  align-items: center;
  padding: clamp(28px, 5vw, 78px);
  background: rgba(255, 250, 242, 0.86);
  border-right: 1px solid rgba(91, 52, 31, 0.1);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}

.login-panel__inner {
  width: min(100%, 430px);
  margin-inline: auto;
  animation: panel-enter 800ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.brand {
  display: flex;
  align-items: center;
  gap: 13px;
  margin-bottom: clamp(38px, 7vh, 72px);
}

.brand__mark {
  display: grid;
  width: 52px;
  height: 52px;
  place-items: center;
  overflow: hidden;
  border-radius: 50%;
  border: 1px solid rgba(100, 58, 34, 0.18);
  background: #fff8ed;
  box-shadow: 0 8px 24px rgba(73, 38, 18, 0.11);
}

.brand__mark img { width: 100%; height: 100%; object-fit: cover; }
.brand__name { margin: 0; color: #2a150c; font-size: 0.98rem; font-weight: 750; letter-spacing: 0.015em; }
.brand__eyebrow { margin: 2px 0 0; color: #98765f; font-size: 0.64rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; }
.login-copy { margin-bottom: 31px; }
.login-copy__kicker { margin: 0 0 12px; color: #a4643d !important; font-size: 0.7rem !important; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; }
.login-copy h1 { margin: 0; color: #2b160d; font-family: Georgia, 'Times New Roman', serif; font-size: clamp(2.15rem, 3.4vw, 3.15rem); font-weight: 500; letter-spacing: -0.045em; line-height: 1.04; }
.login-copy p { max-width: 370px; margin: 17px 0 0; color: #846957; font-size: 0.86rem; line-height: 1.7; }

.secure-note { display: flex; align-items: center; gap: 7px; margin-top: 25px; color: #a58b78; font-size: 0.67rem; font-weight: 600; }
.secure-note svg { width: 14px; height: 14px; }

.product-panel { position: relative; min-width: 0; overflow: hidden; perspective: 1200px; }
.product-panel::before { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(41, 20, 11, 0.2), transparent 20%), radial-gradient(circle at 58% 48%, rgba(255, 232, 199, 0.3), transparent 40%); pointer-events: none; }

.product-panel__copy { position: absolute; z-index: 4; top: clamp(40px, 8vh, 86px); left: clamp(38px, 5vw, 86px); max-width: 430px; color: #fff8ee; animation: copy-enter 950ms 180ms cubic-bezier(0.16, 1, 0.3, 1) both; }
.product-panel__eyebrow { display: flex; align-items: center; gap: 10px; margin: 0 0 18px; color: #e7bea0; font-size: 0.63rem; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase; }
.product-panel__eyebrow span { display: block; width: 28px; height: 1px; background: #d99b6f; }
.product-panel__copy h2 { margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: clamp(2.35rem, 4.1vw, 4.75rem); font-weight: 400; letter-spacing: -0.048em; line-height: 0.98; text-wrap: balance; }
.product-panel__copy h2 em { color: #edc5a6; font-weight: 400; }
.product-panel__copy > p:last-child { max-width: 360px; margin: 20px 0 0; color: rgba(255, 239, 222, 0.63); font-size: 0.77rem; line-height: 1.7; }

.product-visual { position: absolute; z-index: 2; inset: 18% -4% 4% 0; display: grid; place-items: center; pointer-events: none; transform: translate3d(5%, 8%, 0); }
.product-idle { position: relative; width: min(94%, 940px); height: min(78vh, 740px); transform-origin: 54% 60%; animation: product-idle 7.5s ease-in-out infinite; will-change: transform; }
.product-parallax { position: relative; width: 100%; height: 100%; transform-style: preserve-3d; transform-origin: 52% 56%; transition: filter 700ms ease; will-change: transform, filter; }
.product-media { display: block; width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 32px 34px rgba(18, 7, 2, 0.4)); transform: translateZ(26px); }
.product-media--video { border: 0; outline: 0; }
.product-media--fallback img { width: 100%; height: 100%; object-fit: contain; }

.product-highlight { position: absolute; z-index: 3; top: 13%; right: 15%; width: 32%; height: 55%; border-radius: 50%; opacity: 0; background: linear-gradient(110deg, transparent 12%, rgba(255, 235, 206, 0.2) 49%, transparent 74%); filter: blur(18px); transform: translateZ(58px) rotate(13deg); transition: opacity 650ms ease; pointer-events: none; }
.product-shadow { position: absolute; z-index: -1; left: 50%; bottom: 7%; width: 60%; height: 10%; border-radius: 50%; opacity: 0.58; background: rgba(25, 10, 4, 0.76); filter: blur(23px); transform: translate3d(-42%, 0, 0) scaleX(1); animation: shadow-breathe 7.5s ease-in-out infinite; transition: transform 600ms ease, opacity 600ms ease; }

.product-caption { position: absolute; z-index: 4; right: clamp(28px, 4vw, 70px); bottom: clamp(24px, 4vh, 50px); left: clamp(38px, 5vw, 86px); display: flex; align-items: center; gap: 14px; color: rgba(255, 239, 224, 0.56); font-size: 0.59rem; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; }
.product-caption__line { flex: 1; height: 1px; background: rgba(255, 238, 222, 0.14); }

.is-button-hovered .product-idle { animation-play-state: paused; transform: translate3d(0, -5px, 0) rotateX(-1.2deg) scale(1.008); transition: transform 750ms cubic-bezier(0.22, 1, 0.36, 1); }
.is-button-hovered .product-highlight { opacity: 1; }
.is-button-hovered .product-shadow { opacity: 0.46; transform: translate3d(-39%, 3px, 0) scaleX(0.96); }
.is-button-pressed .product-idle { transform: translate3d(0, 3px, 0) scale(0.992); transition: transform 320ms ease; }
.is-leaving .product-idle { animation-play-state: paused; opacity: 0; transform: translate3d(0, 4px, 0) scale(0.965); transition: opacity 360ms ease, transform 360ms ease; }

@keyframes panel-enter { from { opacity: 0; transform: translate3d(-18px, 10px, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }
@keyframes copy-enter { from { opacity: 0; transform: translate3d(0, 18px, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }
@keyframes product-idle { 0%, 100% { transform: translate3d(0, 2px, 0) rotateX(-0.45deg) rotateY(-0.8deg) scale(0.997); } 50% { transform: translate3d(0, -6px, 0) rotateX(0.55deg) rotateY(0.8deg) scale(1.006); } }
@keyframes shadow-breathe { 0%, 100% { opacity: 0.56; transform: translate3d(-42%, 1px, 0) scaleX(0.96); } 50% { opacity: 0.44; transform: translate3d(-42%, 5px, 0) scaleX(1.03); } }

@media (max-width: 1100px) {
  .login-shell { grid-template-columns: minmax(370px, 45%) minmax(0, 55%); }
  .login-panel { padding: 38px; }
  .product-panel__copy { left: 42px; }
  .product-visual { inset: 23% -8% 7% -2%; }
}

@media (max-width: 767px) {
  .login-page { overflow-x: hidden; overflow-y: auto; background: linear-gradient(180deg, #3a2115 0, #6b4430 38%, #f5eadc 38.1%, #fbf6ef 100%); }
  .login-shell { display: flex; min-height: 100svh; flex-direction: column; }
  .product-panel { order: 1; min-height: 330px; height: 42svh; }
  .login-panel { z-index: 5; order: 2; align-items: flex-start; margin-top: -18px; padding: 30px 22px 32px; border-top: 1px solid rgba(255, 255, 255, 0.7); border-right: 0; border-radius: 24px 24px 0 0; background: rgba(252, 247, 239, 0.97); }
  .brand { margin-bottom: 29px; }
  .login-copy { margin-bottom: 26px; }
  .login-copy h1 { font-size: 2.18rem; }
  .product-panel__copy { top: 28px; left: 24px; }
  .product-panel__copy h2, .product-panel__copy > p:last-child { display: none; }
  .product-panel__eyebrow { font-size: 0.56rem; }
  .product-visual { inset: 8% -10% -5% -10%; transform: translate3d(10%, 11%, 0); }
  .product-idle { width: 100%; height: 100%; animation-duration: 9s; }
  .product-caption { right: 22px; bottom: 32px; left: 22px; font-size: 0.5rem; }
  .product-shadow { bottom: 4%; }
}

@media (max-width: 380px) {
  .product-panel { min-height: 290px; height: 38svh; }
  .login-panel { padding-inline: 18px; }
}

@media (prefers-reduced-motion: reduce) {
  .login-panel__inner, .product-panel__copy, .product-idle, .product-shadow { animation: none !important; }
  .product-parallax, .product-idle, .product-shadow, .product-highlight { transition-duration: 0.01ms !important; }
}
</style>
