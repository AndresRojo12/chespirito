<template>
  <v-container>
    <form @submit.prevent="registerProduct">
      <v-text-field v-model="name" label="Nombre"> </v-text-field>

      <v-textarea
        v-model="description"
        bg-color="light-blue"
        color="black"
        label="Descripción"
      ></v-textarea>

      <v-file-input v-model="image" label="File input"> </v-file-input>

      <v-select :items="items" label="Categoria"></v-select>

      <v-checkbox label="Option" type="checkbox" value="1"></v-checkbox>

      <v-btn class="me-4" type="submit"> submit </v-btn>

      <v-btn @click="handleReset"> clear </v-btn>
    </form>
  </v-container>
</template>
<script setup>
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
const CONFIG = useRuntimeConfig();

//const categoryId = ref([])
const name = ref("");
const description = ref("");
const image = ref("");
const price = ref(0);

const registerProduct = async () => {
  const { data, error } = await useFetch(
    `${CONFIG.public.API_BASE_URL}/products`,
    {
      method: "POST",
      body: {
        name: name.value,
        description: description.value,
        image: image.value,
        price: price.value,
      },
    },
  );
  if (data.value != null) {
    Swal.fire({
      title: "Producto registrado con exito!",
      icon: "success",
      confirmButtonText: "Accept",
    });
  } else {
    Swal.fire({
      title: "Ops!",
      icon: "warning",
      text: `${error.value?.data.message}`,
      confirmButtonText: "Accept",
    });
  }
};
</script>
