<script setup lang="ts">
definePageMeta({ name: 'gallery-slug' })

const route = useRoute()
const slug = route.params.slug as string
</script>

<template>
  <UContainer>
    <GallerySlugPage :slug />
  </UContainer>
</template>
