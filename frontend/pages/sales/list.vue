<template>
  <SalesGrid></SalesGrid>
</template>

<script setup>
import SalesGrid from "~/components/sales/SalesGrid.vue";

definePageMeta({
  middleware: "auth",
});
</script>
