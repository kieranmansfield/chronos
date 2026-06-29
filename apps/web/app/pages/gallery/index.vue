<script setup lang="ts">
useSeoMeta({
  title: 'Gallery',
  description: 'Photo collections and visual work',
})
</script>

<template>
  <UContainer>
    <UPageHeader title="Gallery" description="Photo collections and visual work" />
    <UPageBody>
      <GalleryGrid />
    </UPageBody>
  </UContainer>
</template>
