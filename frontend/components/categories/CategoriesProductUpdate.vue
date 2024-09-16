<template>
  <v-container class="form-container"
    ><v-form>
      <v-text-field
        class="input"
        v-model="localCategory.name"
        label="Nombre"
        :error-messages="errors.name"
        :rules="[(v) => !!v || 'El nombre es requerido']"
        @input="clearErrors('name')"
      />
      <v-textarea
        class="input"
        v-model="localCategory.description"
        label="Descripción"
        rows="3"
        :rules="[
          (v) =>
            v.length > 5 ||
            'La descripción debe contener por lo menos 5 caracteres',
        ]"
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
import { ref, watch, defineProps, defineEmits, reactive } from "vue";
import { z } from "zod";
import Swal from "sweetalert2";

const CONFIG = useRuntimeConfig();

const name = ref("");
const image = ref(null);

const props = defineProps({
  category: Object,
});

const emit = defineEmits(["save"]);

const localCategory = ref({ ...props.category });

const errors = reactive({ name: [] });

const schema = z.object({ name: z.string() });

const validateForm = () => {
  errors.name = [];
  try {
    const formData = { name: name.value };
    schema.parse(formData);
    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        const field = err.path[0];
        if (field === "name") errors.name = [err.message];
      });
    }
    return false;
  }
};

watch(
  () => props.category,
  (newCategory) => {
    localCategory.value = { ...newCategory };
  },
);

const updateCategory = async () => {
  if (!validateForm()) return;

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

    if (response.ok) {
      Swal.fire({
        title: "Se actualizo",
        text: "Actualizada correctamente",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
      emit("save", true, localCategory.value.id, localCategory.value.name);
    } else if (response.status === 409) {
      errors.name = "La categoría ya existe, ingresa otro nombre";
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

const clearErrors = (field) => {
  errors[field] = [];
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
