<template>
  <NuxtLoadingIndicator />

  <UHeader>
    <template #left>
      <NuxtLink to="/" class="text-highlighted font-semibold">
        kmcom starter
      </NuxtLink>
    </template>

    <template #right>
      <UButton to="/blog" variant="ghost" color="neutral" icon="i-lucide-pen-line" label="Blog"
        class="hidden sm:flex" />

      <UButton to="/design-system" variant="ghost" color="neutral" icon="i-lucide-layout-template" label="Design System"
        class="hidden sm:flex" />

      <UColorModeButton />

      <UButton to="https://github.com/kieranmansfield/starter-template" target="_blank" icon="i-simple-icons-github"
        aria-label="GitHub" color="neutral" variant="ghost" />
    </template>
  </UHeader>

  <UMain>
    <slot />
  </UMain>

  <USeparator icon="i-simple-icons-nuxtdotjs" />

  <UFooter>
    <template #left>
      <p class="text-muted text-sm">
        Built with
        <a href="https://ui.nuxt.com" class="text-primary hover:underline">Nuxt UI</a>
        &amp;
        <a href="https://github.com/kieranmansfield/nuxt-layers"
          class="text-primary hover:underline">kmcom-nuxt-layers</a>
        &nbsp;&bull; &copy; {{ new Date().getFullYear() }}
      </p>
    </template>

    <template #right>
      <UButton to="https://github.com/kieranmansfield/starter-template" target="_blank" icon="i-simple-icons-github"
        aria-label="GitHub" color="neutral" variant="ghost" />
    </template>
  </UFooter>
</template>
