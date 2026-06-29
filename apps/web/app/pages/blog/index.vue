<script setup lang="ts">
useSeoMeta({
  title: 'Blog',
  description: 'Latest articles and updates',
})
</script>

<template>
  <UContainer>
    <UPageHeader title="Blog" description="Latest articles and updates" />
    <UPageBody>
      <BlogList />
    </UPageBody>
  </UContainer>
</template>
