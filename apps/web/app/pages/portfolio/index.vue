<script setup lang="ts">
useSeoMeta({
  title: 'Portfolio',
  description: 'Featured projects and work',
})
</script>

<template>
  <UContainer>
    <UPageHeader title="Portfolio" description="Featured projects and work" />
    <UPageBody>
      <PortfolioList />
    </UPageBody>
  </UContainer>
</template>
