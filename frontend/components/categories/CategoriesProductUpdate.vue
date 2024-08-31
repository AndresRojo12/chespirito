<template>
  <v-container class="form-container"
    ><v-form>
      <v-text-field
        class="input"
        v-model="localCategory.name"
        label="Nombre"
        required
      />
      <v-textarea
        class="input"
        v-model="localCategory.description"
        label="Descripción"
        rows="3"
        required
      />
      <v-file-input
        class="file-input"
        v-model="image"
        label="Seleccionar imagen"
        accept="image/*"
        prepend-icon="mdi-image"
      />

      <v-btn class="save-button" @click="updateCategory">Guardar</v-btn>
    </v-form></v-container
  >
</template>

<script setup>
import { ref, watch } from "vue";
import { defineProps, defineEmits } from "vue";
import Swal from "sweetalert2";
const CONFIG = useRuntimeConfig();
const image = ref(null);

const props = defineProps({
  category: Object,
});

const emit = defineEmits(["save"]);

const localCategory = ref({ ...props.category });

watch(
  () => props.category,
  (newCategory) => {
    localCategory.value = { ...newCategory };
  },
);

const updateCategory = async () => {
  try {
    const formData = new FormData();
    formData.append("name", localCategory.value.name);
    formData.append("description", localCategory.value.description);
    if (image.value) {
      formData.append("image", image.value);
    }

    const response = await fetch(
      `${CONFIG.public.API_BASE_URL}categories/${props.category.id}`,
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
      title: "Se actualizo",
      text: "Actualizada correctamente",
      icon: "success",
      confirmButtonText: "Aceptar",
    });
    emit("save", true, localCategory.value.id, localCategory.value.name);
  } catch (error) {
    Swal.fire({
      title: "error",
      text: "No se pudo Actualizar",
      icon: "error",
      confirmButtonText: "Aceptar",
    });
    emit("save", false, null);
  }
};
</script>

<style scoped>
.form-container {
  max-width: 100%;
}
.input,
.file-input {
  width: 100%;
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
