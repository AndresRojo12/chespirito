<template>
  <ProductList></ProductList>
</template>

<script setup>
import ProductList from "../../components/product/ProductList.vue";
definePageMeta({
  middleware: "auth",
});
</script>
