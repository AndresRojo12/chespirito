<template>
  <v-form class="form-container">
    <v-text-field
      class="input"
      v-model="localInventory.status"
      label="Estado de producto"
    >
    </v-text-field>
    <v-btn class="save-button" @click.prevent="updateInventory">Guardar</v-btn>
  </v-form>
</template>

<script setup>
import { ref, watch } from "vue";
import { defineProps, defineEmits } from "vue";
import Swal from "sweetalert2";

const CONFIG = useRuntimeConfig();

const props = defineProps({
  inventory: Object,
});

const emit = defineEmits(["save"]);
const localInventory = ref({ ...props.inventory });

watch(
  () => props.inventory,
  (newInventory) => {
    localInventory.value = { ...newInventory };
  },
);

const updateInventory = async () => {
  try {
    const response = await fetch(
      `${CONFIG.public.API_BASE_URL}inventories/${props.inventory.id}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          status: localInventory.value.status,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    const data = await response.json();
    console.log("Server Response:", data);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    Swal.fire({
      title: "Se actualizó",
      text: "Actualizada correctamente",
      icon: "success",
      confirmButtonText: "Aceptar",
    });
    emit("save", true, data);
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
