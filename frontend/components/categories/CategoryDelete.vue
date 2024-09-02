<template>
  <v-card-title class="headline">Eliminar categoría</v-card-title>
  <v-card-text>¿Estás seguro que quieres eliminar esta categoría?</v-card-text>
  <v-card-actions>
    <v-btn color="green darken-1" text @click="deleteCategory"
      >Si, eliminar</v-btn
    >
  </v-card-actions>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";
import Swal from "sweetalert2";

const CONFIG = useRuntimeConfig();

const props = defineProps({
  category: Object,
});

const emit = defineEmits(["deleted"]);
const localCategory = ref({ ...props.category });

const deleteCategory = async () => {
  try {
    const response = await useFetch(
      `${CONFIG.public.API_BASE_URL}categories/${props.category.id}`,
      {
        method: "DELETE",
      },
    );

    if (response != null) {
      Swal.fire({
        title: "Eliminado",
        text: "Categoría eliminada correctamente",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
      emit("deleted", localCategory.value.id);
    } else {
      Swal.fire({
        title: "Error",
        text: "No se pudo eliminar la categoría",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      emit("deleted", false, null);
    }
  } catch (error) {
    console.log("Error", error);
  }
};
</script>
