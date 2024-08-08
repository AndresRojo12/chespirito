<template>
  <v-layout>
    <v-navigation-drawer
      style="background-color: #aeb0b3; max-width: 155px"
      expand-on-hover
      rail
    ></v-navigation-drawer>
  </v-layout>
  <v-container style="width: 600px; margin-top: 2%; border-style: groove">
    <h1>Registrar categoría</h1>
    <form style="margin-top: 5%" @submit.prevent="registerCategory">
      <v-text-field v-model="name" label="Nombre" required></v-text-field>
      <v-textarea
        v-model="description"
        label="Descripción"
        required
      ></v-textarea>
      <v-file-input
        v-model="image"
        label="Seleccionar imagen"
        accept="image/*"
        required
      ></v-file-input>
      <v-btn type="submit">Enviar</v-btn>
      <v-btn @click="handleReset">Limpiar</v-btn>
    </form>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import Swal from "sweetalert2";
const CONFIG = useRuntimeConfig();

const name = ref("");
const description = ref("");
const price = ref(0);
const image = ref(null);

const registerCategory = async () => {
  if (!name.value || !description.value || !image.value) {
    Swal.fire({
      title: "Error",
      text: "Por favor complete todos los campos",
      icon: "warning",
      confirmButtonText: "Aceptar",
    });
    return;
  }

  const formData = new FormData();
  formData.append("name", name.value);
  formData.append("description", description.value);
  formData.append("image", image.value);

  try {
    const response = await fetch(`${CONFIG.public.API_BASE_URL}categories`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.ok) {
      Swal.fire({
        title: "Categoría registrada con éxito",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
    } else {
      const errorData = await response.text();
      throw new Error(errorData || "Error al registrar la categoría");
    }
  } catch (error) {
    Swal.fire({
      title: "Error al registrar la categoría",
      icon: "error",
      text: "No se pudo registrar la categoría",
      confirmButtonText: "Aceptar",
    });
  }
};

const handleReset = () => {
  name.value = "";
  description.value = "";
  price.value = 0;
  image.value = null;
};
</script>
