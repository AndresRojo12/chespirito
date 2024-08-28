<template>
  <v-card-title>Eliminar Producto</v-card-title>
  <v-card-text> ¿Seguro que desea eliminar el producto? </v-card-text>
  <v-card-actions>
    <v-btn text @click.prevent="deleteProduct">Sí, eliminar</v-btn>
  </v-card-actions>
</template>

<script setup>
import { ref } from "vue";
import { defineProps, defineEmits } from "vue";
import Swal from "sweetalert2";
const CONFIG = useRuntimeConfig();

const props = defineProps({
  product: Object,
});

const emit = defineEmits(["deleted"]);
const localProduct = ref({ ...props.product });

const deleteProduct = async () => {
  try {
    const response = await useFetch(
      `${CONFIG.public.API_BASE_URL}products/${props.product.id}`,
      {
        method: "DELETE",
      },
    );

    if (response != null) {
      Swal.fire({
        title: "Eliminado",
        text: "El producto ha sido eliminado correctamente",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
      emit("deleted", localProduct.value.id);
    } else {
      Swal.fire({
        title: "Error",
        text: "No se pudo eliminar el producto",
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

<style scoped>
.title {
  align-self: center;
}
</style>
