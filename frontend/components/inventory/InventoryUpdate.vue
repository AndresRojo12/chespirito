<template>
  <v-form>
    <v-text-field
    style="color:white ;"
     v-model="localInventory.status"
     label="Estado de producto">
    </v-text-field>
    <v-btn style="background-color:#009c8c;
    color: white; " @click.prevent="updateInventory">Guardar</v-btn>
  </v-form>
</template>

<script setup>
  import { ref, watch } from 'vue';
  import { defineProps, defineEmits } from 'vue';
  import Swal from "sweetalert2";
  import { useAuth } from "~/store/auth";


const CONFIG = useRuntimeConfig();


const props = defineProps({
  inventory: Object
});

const emit = defineEmits(['save']);
const localInventory = ref({ ...props.inventory });

watch(() => props.inventory, (newInventory) => {
  localInventory.value = { ...newInventory };
});

const updateInventory = async () => {
  try {
    const response = await fetch(`${CONFIG.public.API_BASE_URL}inventories/${props.inventory.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        status: localInventory.value.status
      }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await response.json();
    console.log('Server Response:', data);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    Swal.fire({
      title: 'Se actualizó',
      text: 'Actualizada correctamente',
      icon: 'success',
      confirmButtonText: 'Aceptar'
    });
    emit('save', true, data);

  } catch (error) {
    console.error('Error:', error);
    Swal.fire({
      title: 'Error',
      text: 'No se pudo actualizar',
      icon: 'error',
      confirmButtonText: 'Aceptar'
    });
    emit('save', false, null);
  }
};


</script>
