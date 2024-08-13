<template>
  <v-table>
    <thead>
      <tr>
        <th class="text-left">Ventas</th>
        <th class="text-left">Producto vendido</th>
        <th class="text-left">Estado de producto</th>
        <th class="text-left">Fecha de registro</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="inve in combinedData" :key="inve.id">
        <td>{{ inve.salesId }}</td>
        <td>{{ inve.productName }}</td>
        <td>{{ inve.status }}</td>
        <td>{{ inve.createdAt }}</td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';

const inventories = ref([]);
const sales = ref([]);
const combinedData = ref([]);
const CONFIG = useRuntimeConfig();

const getInventories = async () => {
  try {
    const { data, error } = await useFetch(`${CONFIG.public.API_BASE_URL}inventories`, {
      method: 'GET',
    });
    inventories.value = data.value;
    combineData();
  } catch (error) {
    console.log(error);
  }
};

const getSales = async () => {
  try {
    const { data, error } = await useFetch(`${CONFIG.public.API_BASE_URL}sales`, {
      method: 'GET',
    });
    sales.value = data.value;
    combineData();
  } catch (error) {
    console.log(error);
  }
};

const combineData = () => {
  if (inventories.value.length > 0 && sales.value.length > 0) {
    combinedData.value = inventories.value.map(inventory => {
      const sale = sales.value.find(sale => sale.id === inventory.salesId);
      return {
        ...inventory,
        productName: sale ? sale.products.name : 'Desconocido'
      };
    });
  }
};

onMounted(async () => {
  await nextTick();
  await getInventories();
  await getSales();
});
</script>
