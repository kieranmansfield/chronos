<script setup lang="ts">
definePageMeta({ name: 'gallery-slug-image' })

const route = useRoute()
const slug = route.params.slug as string
const index = Number(route.params.imageIndex)
</script>

<template>
  <UContainer>
    <GalleryImagePage :slug :index />
  </UContainer>
</template>
