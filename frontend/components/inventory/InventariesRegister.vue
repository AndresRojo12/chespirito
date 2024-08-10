<template>
  <v-layout>
    <v-navigation-drawer
      style="background-color: #aeb0b3; max-width: 155px"
      expand-on-hover
      rail
    >
      <v-list>
        <v-list-item prepend-icon="mdi-account-circle"
        :title="`${userStore.user ? userStore.user.role : 'Usuario'}`"
        ></v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item
          prepend-icon="mdi-home-city"
          title="Inicio"
          @click="goHome"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-cash"
          title="Inventarios"
          @click.prevent=""
        ></v-list-item>

        <v-list-item
          @click.prevent="confirmLogout"
          prepend-icon="mdi-logout"
          title="Salir"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-layout>
  <v-container style="width: 600px; margin-top: 2%; border-style: groove">
    <h1>Hola registro de inventario</h1>
    <form style="margin-top: 5%" @submit.prevent="registerInventory">
      <v-autocomplete
        v-model="sales"
        :items="salesId"
        item-title="products.name"
        item-value="id"
        label="Seleccionar producto vendido"
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
const router = useRouter();

const getVentas = async () => {
  const { data, error } = await useFetch(`${CONFIG.public.API_BASE_URL}sales`,
  );

  if(data.value !=null) {
    salesId.value = data.value.map((e) => ({
      id: e.id,
      products: e.products,
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

const handleLogout = () => {
  userStore.logout();
  router.push("/");
};

const handleReset = () => {
  sales.value = "";
  status.value = "";
};

const goHome = () => {
  router.push("/user/gestion");
}

const confirmLogout = () => {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "¿Quieres cerrar sesión?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí, cerrar sesión",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      handleLogout();
    }
  });
};

onMounted(async () => {
  await nextTick();
  await getVentas();
})
</script>
