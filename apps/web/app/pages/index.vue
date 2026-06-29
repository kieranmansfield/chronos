<script setup lang="ts">
const { data: franchises } = await useAsyncData('franchises', () =>
  queryCollection('franchises').all()
)
</script>

<template>
  <UContainer class="py-16">
    <h1 class="text-4xl font-bold mb-2">Reading Orders</h1>
    <p class="text-muted mb-10">Curated chronological guides for serialised fiction.</p>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <UCard
        v-for="franchise in franchises"
        :key="franchise.id"
        class="hover:ring-primary hover:ring-2 transition-all cursor-pointer"
        @click="navigateTo(`/${franchise.stem.split('/')[0]}`)"
      >
        <div class="flex items-start justify-between gap-2">
          <div>
            <h2 class="font-semibold text-lg">{{ franchise.name }}</h2>
            <p v-if="franchise.publisher" class="text-muted text-sm">{{ franchise.publisher }}</p>
          </div>
          <UBadge :label="franchise.medium" variant="subtle" />
        </div>
      </UCard>
    </div>

    <p v-if="!franchises?.length" class="text-muted">No franchises found.</p>
  </UContainer>
</template>
