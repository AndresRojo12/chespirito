<template>
  <SaleRegister></SaleRegister>
</template>

<script setup>
import SaleRegister from "~/components/sales/SaleRegister";

definePageMeta({
  middleware: "auth",
});
</script>
