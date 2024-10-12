<template>
  <v-form>
    <v-text-field
      class="input"
      v-model="localProduct.name"
      label="Nombre"
      :rules="[(v) => !!v || 'El nombre es requerido']"
    />
    <v-textarea
      class="input"
      v-model="localProduct.description"
      label="Descripción"
      rows="3"
      :rules="[
        (v) =>
          v.length > 5 || 'La descripción debe contener al menos 5 caracteres',
      ]"
    />
    <v-text-field
      class="input"
      v-model="localProduct.price"
      label="Precio"
      :rules="[
        (v) => !!v || 'Este campo es obligatorio',
        (v) => !isNaN(v) || 'El precio debe ser un número válido',
      ]"
    />
    <v-file-input
      class="file-input"
      v-model="anverso"
      label="Anverso"
      accept="image/*"
      prepend-icon="mdi-image"
    />
    <v-file-input
      class="file-input"
      v-model="reverso"
      label="Reverso"
      accept="image/*"
      prepend-icon="mdi-image"
    />
    <v-btn class="save-button" @click="updateProduct">Guardar</v-btn>
  </v-form>
</template>

<script setup>
import { ref, watch } from "vue";
import { defineProps, defineEmits } from "vue";
import Swal from "sweetalert2";

const CONFIG = useRuntimeConfig();
const anverso = ref("");
const reverso = ref("");

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

    if (anverso.value) {
      formData.append("anverso", anverso.value);
    }

    if (reverso.value) {
      formData.append("reverso", reverso.value);
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

    if (response.ok) {
      Swal.fire({
        title: "Se actualizó",
        text: "Actualizada correctamente",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
      emit("save", true, localProduct.value.id, localProduct.value.name);
    }
  } catch (error) {
    Swal.fire({
      title: "Error interno",
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
  color: #116a7b;
}
.save-button {
  background: linear-gradient(to bottom, #009c8c, #00b7a2);
  color: white;
  font-family: "Arial", sans-serif;
}

@media (max-width: 430px) {
  .form-container {
    max-width: 100%;
  }
  .save-button {
    width: 100%;
    font-size: 4vw;
  }
}
</style>
