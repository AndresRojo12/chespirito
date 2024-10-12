<template>
  <v-icon class="exit-icon" @click="router.back()">mdi-arrow-left</v-icon>

  <v-container class="form-container">
    <h1 class="form-title">Registro de inventario</h1>
    <form @submit.prevent="registerInventory">
      <v-autocomplete
        class="select"
        v-model="sales"
        :items="salesId"
        item-title="products.name"
        item-value="id"
        label="Seleccionar producto vendido"
        :error-messages="errors.sales"
        @update:model-value="clearErrors('sales')"
      >
      </v-autocomplete>
      <v-text-field
        class="input"
        v-model="status"
        label="Estado"
        :error-messages="errors.status"
        @input="clearErrors('status')"
      >
      </v-text-field>
      <div class="submit-buttons">
        <v-btn @click.prevent="registerInventory" class="submit">Enviar</v-btn>
        <v-btn class="clean" @click="handleReset">Limpiar</v-btn>
      </div>
    </form>
  </v-container>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
//import { useRouter } from "vue-router";
import { z } from "zod";
import Swal from "sweetalert2";

const CONFIG = useRuntimeConfig();
const router = useRouter();

const sales = ref("");
const status = ref("");
const salesId = ref([]);
const page = ref(1);
const pageSize = ref(10);

const errors = reactive({
  sales: [],
  status: []
});

const validateSelectedProduct = () => {
  const productId = parseInt(sales.value);
  if (isNaN(productId) || productId < 1) {
    errors.sales = ["El producto es requerido, selecciona el correspondiente"];
    return false;
  }
  return true;
};

const validateStatus = () => {
  const trimmedStatus = status.value.trim();
  if (!trimmedStatus) {
    errors.status = ["El estado es requerido, por favor indique estado de inventario"];
    return false;
  }
  if (trimmedStatus.length < 8) {
    errors.status = ["El estado debe tener por lo menos 8 caracteres"];
    return false;
  }
  if (trimmedStatus.length > 50) {
    errors.status = ["El estado no puede exceder los 50 caracteres"];
    return false;
  }
  return true;
};

const validateForm = () => {
  for (const key in errors) {
    if (errors.hasOwnProperty(key)) {
      errors[key] = [];
    }
  }

  const isProductValid = validateSelectedProduct();
  const isStatusValid = validateStatus();
  return (
    isProductValid &&
    isStatusValid

  );

};

const getVentas = async () => {
  const { data: metaData } = await useFetch(
    `${CONFIG.public.API_BASE_URL}sales?page=1&pageSize=1`,
  );

  const totalItems = metaData.value.totalItems;

  pageSize.value = totalItems;

  const { data, error } = await useFetch(
    `${CONFIG.public.API_BASE_URL}sales?page=${page.value}&pageSize=${pageSize.value}`,
  );

  if (data.value != null) {
    salesId.value = data.value.data.map((e) => ({
      id: e.id,
      products: e.products,
    }));
  } else {
    throw new Error(error.value.message);
  }
};

onMounted(async () => {
  await nextTick();
  await getVentas();
});

const registerInventory = async () => {
  if (!validateForm()) {
    return;
  }
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

  if (data.value != null) {
    Swal.fire({
      title: "Inventario registrado con éxito!",
      icon: "success",
      confirmButtonText: "Aceptar",
    });
    handleReset();
  } else {
    Swal.fire({
      title: "No se pudo registrar inventario",
      text: "Este producto ya ha sido registrado pon un producto y un estado diferentes",
      icon: "error",
      confirmButtonText: "Aceptar",
    });
  }
};

const handleReset = () => {
  for (const key of Object.keys(errors)) {
    if (key === "sales") sales.value = "";
    if (key === "status") status.value = "";
    errors[key] = [];
  }
};

const clearErrors = (field) => {
  errors[field] = [];
};
</script>

<style scoped>
.exit-icon {
  display: none;
}
.form-container {
  width: 340px;
  border: 1px solid;
  border-radius: 6%;
  border-color: #116a7b;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.form-title {
  text-align: center;
  font-size: 2vw;
  font-family: "Arial", sans-serif;
  margin-bottom: 3%;
}
.input,
.select {
  color: #116a7b;
}
.submit-buttons {
  display: flex;
  justify-content: space-around;
}
.submit {
  background: linear-gradient(45deg, #009c8c, #00b7a2);
  color: white;
  width: 40%;
  font-family: "Arial", sans-serif;
}
.clean {
  background-color: white;
  color: #116a7b;
  width: 40%;
  font-family: "Arial", sans-serif;
}

@media (max-width: 1024px) {
  .exit-icon {
    display: flex;
  }
  .form-title {
    font-size: 3vw;
  }
}

@media (max-width: 540px) {
  .form-title {
    font-size: 4vw;
  }
}

@media (max-width: 430px) {
  .exit-icon {
    display: flex;
    font-size: 4vw;
    margin-bottom: 4%;
  }
  .form-title {
    font-size: 6vw;
  }
  .form-container {
    max-width: 100%;
  }
  .submit-buttons {
    display: inline;
  }
  .submit {
    width: 100%;
    font-size: 4vw;
    margin-bottom: 5%;
  }
  .clean {
    width: 100%;
    font-size: 4vw;
  }
}
</style>
