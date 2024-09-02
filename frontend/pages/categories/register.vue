<template>
  <CategoryRegister></CategoryRegister>
</template>

<script setup>
import CategoryRegister from "~/components/categories/CategoryRegister";

definePageMeta({
  middleware: "auth",
});
</script>
