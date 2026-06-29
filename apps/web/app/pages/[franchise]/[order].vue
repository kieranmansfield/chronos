<script setup lang="ts">
const route = useRoute()
const franchiseId = route.params.franchise as string
const orderId = route.params.order as string

const [{ data: order }, { data: works }] = await Promise.all([
  useAsyncData(`order-${orderId}`, () =>
    queryCollection('readingOrders').where('stem', '=', `${franchiseId}/reading-orders/${orderId}`).first()
  ),
  useAsyncData(`works-${franchiseId}`, () =>
    queryCollection('works').where('stem', 'LIKE', `${franchiseId}/works/%`).all()
  ),
])

if (!order.value) throw createError({ statusCode: 404, message: 'Order not found' })

const workMap = computed(() =>
  Object.fromEntries((works.value ?? []).map((w) => [w.stem.split('/').at(-1), w]))
)

const importanceColor = {
  essential: 'primary',
  recommended: 'success',
  optional: 'warning',
  completionist: 'neutral',
} as const
</script>

<template>
  <UContainer class="py-16 max-w-3xl">
    <div class="mb-2">
      <NuxtLink :to="`/${franchiseId}`" class="text-muted text-sm hover:text-primary">
        ← {{ franchiseId }}
      </NuxtLink>
    </div>

    <h1 class="text-3xl font-bold mb-2">{{ order!.title }}</h1>
    <p v-if="order!.description" class="text-muted mb-8">{{ order!.description }}</p>

    <div class="flex flex-col gap-3">
      <template v-for="block in order!.blocks" :key="block.order">
        <!-- Era / milestone markers -->
        <div
          v-if="block.type === 'marker'"
          class="flex items-center gap-3 py-2"
        >
          <div class="h-px flex-1 bg-muted/30" />
          <span class="text-muted text-xs font-semibold uppercase tracking-wider">
            {{ block.label }}
          </span>
          <div class="h-px flex-1 bg-muted/30" />
        </div>

        <!-- Annotations / notes -->
        <UAlert
          v-else-if="block.type === 'annotation'"
          :title="block.title"
          :description="block.body"
          :icon="block.annotationKind === 'warning' ? 'i-lucide-alert-triangle' : block.annotationKind === 'spoiler' ? 'i-lucide-eye-off' : 'i-lucide-info'"
          :color="block.annotationKind === 'warning' ? 'warning' : block.annotationKind === 'continuity' ? 'info' : 'neutral'"
          variant="subtle"
        />

        <!-- Work entries -->
        <UCard v-else-if="block.type === 'work'" class="relative">
          <div class="flex items-start justify-between gap-4">
            <div class="flex gap-3 items-start">
              <span class="text-muted text-sm font-mono w-5 shrink-0 mt-0.5">{{ block.order }}</span>
              <div>
                <p class="font-semibold">
                  {{ workMap[block.workId]?.title ?? block.workId }}
                </p>
                <p v-if="workMap[block.workId]?.writers?.length" class="text-muted text-sm">
                  {{ workMap[block.workId].writers!.join(', ') }}
                  <span v-if="workMap[block.workId]?.publishedYear">
                    · {{ workMap[block.workId].publishedYear }}
                  </span>
                </p>
              </div>
            </div>
            <div class="flex gap-2 shrink-0">
              <UBadge
                v-if="block.canonStatus"
                :label="block.canonStatus"
                variant="outline"
                size="sm"
              />
              <UBadge
                :label="block.importance"
                :color="importanceColor[block.importance]"
                variant="subtle"
                size="sm"
              />
            </div>
          </div>
        </UCard>

        <!-- Custom entries (user-filled gaps) -->
        <UCard v-else-if="block.type === 'custom'" class="border-dashed">
          <div class="flex gap-3 items-start">
            <span class="text-muted text-sm font-mono w-5 shrink-0 mt-0.5">{{ block.order }}</span>
            <div>
              <p class="font-semibold">{{ block.title }}</p>
              <p v-if="block.note" class="text-muted text-sm">{{ block.note }}</p>
            </div>
          </div>
        </UCard>
      </template>
    </div>
  </UContainer>
</template>
