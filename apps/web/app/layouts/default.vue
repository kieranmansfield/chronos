<template>
  <NuxtLoadingIndicator />

  <UHeader>
    <template #left>
      <NuxtLink to="/" class="text-highlighted font-semibold">
        Chronos
      </NuxtLink>
    </template>

    <template #right>
      <UColorModeButton />
    </template>
  </UHeader>

  <UMain>
    <slot />
  </UMain>

  <USeparator />

  <UFooter>
    <template #left>
      <p class="text-muted text-sm">Chronos — reading orders for serialised fiction</p>
    </template>
  </UFooter>
</template>
