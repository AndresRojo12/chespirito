<template>
  <h1>Hola registro de inventario</h1>
  <v-container style="width: 600px; margin-top: 2%; border-style: groove">
    <form style="margin-top: 5%" @submit.prevent="registerInventory">
      <v-autocomplete
        v-model="sales"
        :items="salesId"
        item-title="id"
        item-value="id"
        label="Venta"
        required>
      </v-autocomplete>
      <v-text-field
        v-model="status"
        label="Estado"
        required>
      </v-text-field>
      <v-btn type="submit">Enviar</v-btn>
      <v-btn @click="handleReset">Limpiar</v-btn>
    </form>
  </v-container>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import Swal from "sweetalert2";
import { useAuth } from "~/store/auth";

const CONFIG = useRuntimeConfig();
const sales = ref("");
const status = ref("");
const salesId = ref([]);
const userStore = useAuth();


const getVentas = async () => {
  const { data, error } = await useFetch(`${CONFIG.public.API_BASE_URL}sales`,
  );

  if(data.value !=null) {
    salesId.value = data.value.map((e) => ({
      id: e.id,
    }))
  }else {
    throw new Error(error.value.message);
  }
}

const registerInventory = async () => {
  const { data, error } = await useFetch(
    `${CONFIG.public.API_BASE_URL}inventories`,
    {
      method: "POST",
      body: {
        status: status.value,
        salesId: sales.value,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  );
  if (data.value = !null) {
    Swal.fire({
      title: "Inventario registrado con éxito!",
      icon: "success",
      confirmButtonText: "Aceptar",
    });
  } else {
    Swal.fire({
      title: "No se pudo registrar inventario",
      icon: "error",
      confirmButtonText: "Aceptar",
    });
  }
};

const handleReset = () => {
  sales.value = "";
  status.value = "";
};

onMounted(async () => {
  await nextTick();
  await getVentas();
})
</script>
