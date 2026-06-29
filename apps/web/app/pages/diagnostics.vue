<script setup lang="ts">
const {
  grid,
  subgrid,
  containerQueries,
  has,
  aspectRatio,
  backdropFilter,
  webp,
  avif,
  intersectionObserver,
  resizeObserver,
  serviceWorker,
  webGL,
} = useFeatures()
const { isMobile, isTablet, isDesktop } = useDevice()
const { isOnline, effectiveType, connectionQuality, saveData, isSlow, isFast } = useNetworkInfo()
const { mode, isHydrated, isClient, isServer } = useRendering()
const { canInstall, isInstalled, needRefresh } = usePWAInfo()

useSeoMeta({
  title: 'Diagnostics',
  description: 'Feature detection and system diagnostics',
})
</script>

<template>
  <div class="min-h-screen p-8">
    <UContainer>
      <div class="space-y-8">
        <div class="text-center">
          <h1 class="text-4xl font-bold mb-2">Diagnostics</h1>
          <p class="text-muted">Feature detection and system information</p>
        </div>

        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold">CSS Features</h2>
          </template>
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <div class="flex items-center gap-2">
              <span :class="grid ? 'text-green-500' : 'text-red-500'">{{ grid ? '✓' : '✗' }}</span>
              <span>CSS Grid</span>
            </div>
            <div class="flex items-center gap-2">
              <span :class="subgrid ? 'text-green-500' : 'text-red-500'">{{ subgrid ? '✓' : '✗' }}</span>
              <span>Subgrid</span>
            </div>
            <div class="flex items-center gap-2">
              <span :class="containerQueries ? 'text-green-500' : 'text-red-500'">{{ containerQueries ? '✓' : '✗'
                }}</span>
              <span>Container Queries</span>
            </div>
            <div class="flex items-center gap-2">
              <span :class="has ? 'text-green-500' : 'text-red-500'">{{ has ? '✓' : '✗' }}</span>
              <span>:has() Selector</span>
            </div>
            <div class="flex items-center gap-2">
              <span :class="aspectRatio ? 'text-green-500' : 'text-red-500'">{{ aspectRatio ? '✓' : '✗' }}</span>
              <span>Aspect Ratio</span>
            </div>
            <div class="flex items-center gap-2">
              <span :class="backdropFilter ? 'text-green-500' : 'text-red-500'">{{ backdropFilter ? '✓' : '✗' }}</span>
              <span>Backdrop Filter</span>
            </div>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold">Image Formats</h2>
          </template>
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div class="flex items-center gap-2">
              <span :class="webp ? 'text-green-500' : 'text-red-500'">{{ webp ? '✓' : '✗' }}</span>
              <span>WebP</span>
            </div>
            <div class="flex items-center gap-2">
              <span :class="avif ? 'text-green-500' : 'text-red-500'">{{ avif ? '✓' : '✗' }}</span>
              <span>AVIF</span>
            </div>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold">JavaScript APIs</h2>
          </template>
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <div class="flex items-center gap-2">
              <span :class="intersectionObserver ? 'text-green-500' : 'text-red-500'">{{ intersectionObserver ? '✓' :
                '✗'
                }}</span>
              <span>IntersectionObserver</span>
            </div>
            <div class="flex items-center gap-2">
              <span :class="resizeObserver ? 'text-green-500' : 'text-red-500'">{{ resizeObserver ? '✓' : '✗' }}</span>
              <span>ResizeObserver</span>
            </div>
            <div class="flex items-center gap-2">
              <span :class="serviceWorker ? 'text-green-500' : 'text-red-500'">{{ serviceWorker ? '✓' : '✗' }}</span>
              <span>Service Worker</span>
            </div>
            <div class="flex items-center gap-2">
              <span :class="webGL ? 'text-green-500' : 'text-red-500'">{{ webGL ? '✓' : '✗' }}</span>
              <span>WebGL</span>
            </div>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold">Device Information</h2>
          </template>
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <span class="font-medium w-24">Type:</span>
              <span v-if="isMobile" class="text-primary">Mobile</span>
              <span v-else-if="isTablet" class="text-primary">Tablet</span>
              <span v-else-if="isDesktop" class="text-primary">Desktop</span>
            </div>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold">Network Information</h2>
          </template>
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <span class="font-medium w-24">Status:</span>
              <span :class="isOnline ? 'text-green-500' : 'text-red-500'">{{ isOnline ? 'Online' : 'Offline' }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-medium w-24">Type:</span>
              <span>{{ effectiveType || 'unknown' }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-medium w-24">Quality:</span>
              <span :class="{
                'text-green-500': connectionQuality === 'excellent',
                'text-yellow-500': connectionQuality === 'good',
                'text-red-500': connectionQuality === 'poor',
                'text-gray-500': connectionQuality === 'offline',
              }">{{ connectionQuality }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-medium w-24">Speed:</span>
              <span v-if="isFast" class="text-green-500">Fast</span>
              <span v-else-if="isSlow" class="text-red-500">Slow</span>
              <span v-else>Normal</span>
            </div>
            <div v-if="saveData" class="flex items-center gap-2">
              <span class="font-medium w-24">Data Saver:</span>
              <span class="text-yellow-500">Enabled</span>
            </div>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold">Rendering Information</h2>
          </template>
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <span class="font-medium w-24">Mode:</span>
              <span class="uppercase text-primary">{{ mode }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-medium w-24">Environment:</span>
              <span v-if="isClient" class="text-primary">Client</span>
              <span v-else-if="isServer" class="text-primary">Server</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-medium w-24">Hydrated:</span>
              <span :class="isHydrated ? 'text-green-500' : 'text-yellow-500'">{{ isHydrated ? 'Yes' : 'No' }}</span>
            </div>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold">PWA Information</h2>
          </template>
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <span class="font-medium w-24">Installed:</span>
              <span :class="isInstalled ? 'text-green-500' : 'text-gray-500'">{{ isInstalled ? 'Yes' : 'No' }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-medium w-24">Installable:</span>
              <span :class="canInstall ? 'text-green-500' : 'text-gray-500'">{{ canInstall ? 'Yes' : 'No' }}</span>
            </div>
            <div v-if="needRefresh" class="flex items-center gap-2">
              <span class="font-medium w-24">Update:</span>
              <span class="text-yellow-500">Available</span>
            </div>
          </div>
        </UCard>
      </div>
    </UContainer>
  </div>
</template>
