<template>
  <InventoryGrid></InventoryGrid>
</template>

<script setup>
import InventoryGrid from "../../components/inventory/InventoryGrid.vue";

definePageMeta({
  middleware: "auth",
});
</script>
