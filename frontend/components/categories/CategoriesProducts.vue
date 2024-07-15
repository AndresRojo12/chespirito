<template>
  <div v-if="category">
    <v-card style="max-height:10rem;">
      <h1 style="display: flex; background-color: #007bff; justify-content: center">{{ category.name }}</h1>
    </v-card>
    <h2 style="margin-left: 10%; margin-top: 2%">Productos</h2>
    <div style="margin-left: 10%; margin-top: 2%; display: flex; flex-wrap: wrap">
      <div
        v-for="product in category.products"
        :key="product.id"
        style="flex: 1 1 22%; max-width: 22%; margin: 1%; box-sizing: border-box; text-align: center"
      >
        <div>
          <img style="width: 100%" :src="getImageUrl(product.imagePath)" alt="product.name" />
        </div>
        <div>
          <button
            style="width: 100%; padding: 10px; margin-top: 10px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer"
          >
            <h3 style="margin: 0">{{ product.name }}</h3>
            <p style="margin: 0">{{ product.description }}</p>
            <p>Precio: {{ product.price }}</p>
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <p>Loading...</p>
  </div>

</template>

<script setup>
import { ref, onMounted } from "vue";
const CONFIG = useRuntimeConfig();

const route = useRoute();
const { id } = route.params;
const category = ref(null);
const error = ref(null);

const fetchCategory = async () => {
  try {
    const { data } = await useFetch(`${CONFIG.public.API_BASE_URL}/categories/${id}`);
    category.value = data.value;
  } catch (err) {
    error.value = err;
  }
};

const getImageUrl = (imagePath) => {
  return imagePath;
};

onMounted(async () => {
  await fetchCategory();
});
</script>
