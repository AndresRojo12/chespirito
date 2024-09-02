<template>
  <InventariesRegister></InventariesRegister>
</template>

<script setup>
import InventariesRegister from "../../components/inventory/InventariesRegister.vue";

definePageMeta({
  middleware: "auth",
});
</script>
