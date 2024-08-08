<template>
  <v-form>
    <v-text-field
      v-model="localCategory.name"
      label="Nombre"
      required
    />
    <v-textarea
      v-model="localCategory.description"
      label="Descripción"
      rows="3"
      required
    />
    <v-file-input
      v-model="localCategory.image"
      label="Seleccionar imagen"
      accept="image/*"
      prepend-icon="mdi-image"
    />

    <v-btn color="green" @click="updateCategory">Guardar</v-btn>
  </v-form>
</template>


<script setup>
import { ref, watch } from 'vue';
import { defineProps, defineEmits } from 'vue';
import Swal from "sweetalert2";
const CONFIG = useRuntimeConfig();
const image = ref(null);

const props = defineProps({
  category: Object
});

const emit = defineEmits(['save']);

const localCategory = ref({ ...props.category });

watch(() => props.category, (newCategory) => {
  localCategory.value = { ...newCategory };
});

const updateCategory = async () => {
  try {
    const formData = new FormData();
    formData.append('name', localCategory.value.name);
    formData.append('description', localCategory.value.description);
    if (image.value) {
      formData.append('image', image.value);
    }

    const response = await fetch(`${CONFIG.public.API_BASE_URL}categories/${props.category.id}`, {
      method: 'PATCH',
      body: formData,
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    Swal.fire({
      title:'Se actualizo',
      text:'Actualizada correctamente',
      icon:'success',
      confirmButtonText:'Aceptar'
    });
    emit('save', true, localCategory.value.id, localCategory.value.name);

  } catch (error) {
    Swal.fire({
      title:'error',
      text:'No se pudo Actualizar',
      icon:'error',
      confirmButtonText:'Aceptar'
    });
    emit('save', false, null);
  }
};


</script>
