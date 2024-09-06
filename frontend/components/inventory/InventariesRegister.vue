<template>
  <div>
    <v-list-item
      class="exit-icon"
      prepend-icon="mdi-arrow-left"
      @click="back"
    ></v-list-item>
  </div>

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
        required
      >
      </v-autocomplete>
      <v-text-field class="input" v-model="status" label="Estado" required>
      </v-text-field>
      <div class="submit-buttons">
        <v-btn class="submit">Enviar</v-btn>
        <v-btn class="clean" @click="handleReset">Limpiar</v-btn>
      </div>
    </form>
  </v-container>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";

const CONFIG = useRuntimeConfig();
const router = useRouter();

const sales = ref("");
const status = ref("");
const salesId = ref([]);
const page = ref(1);
const pageSize = ref(10);

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

const back = () => {
  router.back();
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
