<template>
  <InventoryUpdate></InventoryUpdate>
</template>

<script setup>
import InventoryUpdate from "~/components/inventory/InventoryUpdate.vue";

definePageMeta({
  middleware: "auth",
});
</script>
