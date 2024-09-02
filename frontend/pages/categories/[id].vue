<template>
  <CategoriesProducts></CategoriesProducts>
</template>

<script setup>
import CategoriesProducts from "../../components/categories/CategoriesProducts.vue";

definePageMeta({
  middleware: "auth",
});
</script>
