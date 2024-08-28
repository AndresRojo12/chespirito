<template>
  <v-form style="background-color: white">
    <v-text-field
      class="input"
      v-model="localProduct.name"
      label="Nombre"
      required
    />
    <v-textarea
      class="input"
      v-model="localProduct.description"
      label="Descripción"
      rows="3"
      required
    />
    <v-text-field
      class="input"
      v-model="localProduct.price"
      label="Precio"
      required
    />
    <v-file-input
      class="file-input"
      v-model="image"
      label="Seleccionar imagen"
      accept="image/*"
      prepend-icon="mdi-image"
    />
    <v-btn
      style="background-color: #009c8c; color: white"
      @click="updateProduct"
      >Guardar</v-btn
    >
  </v-form>
</template>

<script setup>
import { ref, watch } from "vue";
import { defineProps, defineEmits } from "vue";
import Swal from "sweetalert2";

const CONFIG = useRuntimeConfig();
const image = ref(null);

const props = defineProps({
  product: Object,
});

const emit = defineEmits(["save"]);
const localProduct = ref({ ...props.product });

watch(
  () => props.product,
  (newProduct) => {
    localProduct.value = { ...newProduct };
  },
);

const updateProduct = async () => {
  try {
    const formData = new FormData();
    formData.append("name", localProduct.value.name);
    formData.append("description", localProduct.value.description);
    formData.append("price", localProduct.value.price);

    if (image.value) {
      formData.append("image", image.value);
    }

    const response = await fetch(
      `${CONFIG.public.API_BASE_URL}products/${props.product.id}`,
      {
        method: "PATCH",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    Swal.fire({
      title: "Se actualizó",
      text: "Actualizada correctamente",
      icon: "success",
      confirmButtonText: "Aceptar",
    });
    emit("save", true, localProduct.value.id, localProduct.value.name);
  } catch (error) {
    console.error("Error:", error);
    Swal.fire({
      title: "Error",
      text: "No se pudo actualizar",
      icon: "error",
      confirmButtonText: "Aceptar",
    });
    emit("save", false, null);
  }
};
</script>

<style scoped>
.input,
.file-input {
  color: #009c8c;
}
</style>
