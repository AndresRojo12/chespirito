<template>
  <v-container v-if="category">
    <v-card max-height="10rem">
      <v-row
        class="align-center justify-center"
        style="background-color: #009c8c"
      >
        <v-col cols="auto">
          <h1>{{ category.name }}</h1>
        </v-col>
      </v-row>
    </v-card>
    <v-row class="mt-4 ml-10">
      <v-col cols="12">
        <h2>Productos</h2>
      </v-col>
    </v-row>
    <v-row class="ml-10 mt-2" dense>
      <v-col
        v-for="product in category.products"
        :key="product.id"
        cols="12"
        sm="8"
        md="4"
        lg="3"
        class="d-flex flex-column align-center"
      >
        <div>
            <v-img
              :src="getImageUrl(product.imagePath)"
            ></v-img>
            <h3 class="mb-0">Nombre: {{ product.name }}</h3>
            <p class="mb-0">Descripción: {{ product.description }}</p>
            <p>Precio: {{ product.price }}</p>
          </div>
      </v-col>
    </v-row>
  </v-container>
  <v-container v-else>
    <p>Loading...</p>
  </v-container>
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
    const { data } = await useFetch(
      `${CONFIG.public.API_BASE_URL}/categories/${id}`,
    );
    console.log("dta:",data);
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
