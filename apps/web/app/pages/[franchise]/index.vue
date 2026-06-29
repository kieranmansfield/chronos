<script setup lang="ts">
const route = useRoute()
const franchiseId = route.params.franchise as string

const [{ data: franchise }, { data: orders }] = await Promise.all([
  useAsyncData(`franchise-${franchiseId}`, () =>
    queryCollection('franchises').where('stem', '=', `${franchiseId}/franchise`).first()
  ),
  useAsyncData(`orders-${franchiseId}`, () =>
    queryCollection('readingOrders').where('stem', 'LIKE', `${franchiseId}/reading-orders/%`).all()
  ),
])

if (!franchise.value) throw createError({ statusCode: 404, message: 'Franchise not found' })
</script>

<template>
  <UContainer class="py-16">
    <div class="mb-2">
      <NuxtLink to="/" class="text-muted text-sm hover:text-primary">← All franchises</NuxtLink>
    </div>

    <div class="flex items-center gap-3 mb-2">
      <h1 class="text-4xl font-bold">{{ franchise!.name }}</h1>
      <UBadge :label="franchise!.medium" variant="subtle" size="lg" />
    </div>
    <p v-if="franchise!.publisher" class="text-muted mb-10">{{ franchise!.publisher }}</p>

    <h2 class="text-xl font-semibold mb-4">Reading Orders</h2>

    <div class="flex flex-col gap-3">
      <UCard
        v-for="order in orders"
        :key="order.id"
        class="hover:ring-primary hover:ring-2 transition-all cursor-pointer"
        @click="navigateTo(`/${franchiseId}/${order.stem.split('/').at(-1)}`)"
      >
        <div class="flex items-start justify-between gap-4">
          <div>
            <h3 class="font-semibold">{{ order.title }}</h3>
            <p v-if="order.description" class="text-muted text-sm mt-1 line-clamp-2">
              {{ order.description }}
            </p>
          </div>
          <div class="flex gap-2 shrink-0">
            <UBadge :label="order.defaultMode" variant="outline" />
            <UBadge :label="`${order.blocks.length} entries`" variant="subtle" color="neutral" />
          </div>
        </div>
      </UCard>
    </div>

    <p v-if="!orders?.length" class="text-muted">No reading orders yet.</p>
  </UContainer>
</template>
