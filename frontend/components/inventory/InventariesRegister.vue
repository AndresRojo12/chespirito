<template>
  <div v-if="isAuthenticated">
    <v-card>
      <h1
        style="
          display: flex;
          background-color: white;
          justify-content: center;
          color:#009c8c
        "
      >
        ANTIGÜEDADES CHESPIRITO
      </h1>
    </v-card>

    <v-layout>
      <v-navigation-drawer
        style="background-color: white; max-width: 155px"
        expand-on-hover
        rail
      >
        <v-list>
          <v-list-item
            style="color:#009c8c;"
            prepend-icon="mdi-account-circle"
            :title="`${userStore.user ? userStore.user.role : 'Usuario'}`"
          ></v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <v-list-item
          style="color:#009c8c;"
            prepend-icon="mdi-home-city"
            title="Inicio"
            @click="goHome"
          ></v-list-item>

          <v-list-item
          style="color:#009c8c;"
            prepend-icon="mdi-cash"
            title="Inventarios"
            @click.prevent="homeInventory"
          ></v-list-item>

          <v-list-item
          style="color:#009c8c;"
            @click.prevent="confirmLogout"
            prepend-icon="mdi-logout"
            title="Salir"
          ></v-list-item>
        </v-list>
      </v-navigation-drawer>
    </v-layout>
    <v-container
      style="
        width: 340px;
        margin-top: 4%;
        border-style: groove;
        border-radius: 6%;
        border-color: #009c8c;
        background-color: white;
        height: 100%;
      "
    >
      <h1
        style="text-align: center; font-size: larger; color:#009c8c"
      >
        Registro de inventario
      </h1>
      <v-sheet class="mx-auto" width="300" style="border-style: groove;">
        <form
          style="margin-top: 10%; background-color:white;
          "
          @submit.prevent="registerInventory"
        >
          <v-autocomplete
            style="color:#009c8c"
            v-model="sales"
            :items="salesId"
            item-title="products.name"
            item-value="id"
            label="Seleccionar producto vendido"
            required
          >
          </v-autocomplete>
          <v-text-field
            style="color:#009c8c"
            v-model="status"
            label="Estado"
            required
          >
          </v-text-field>
          <v-btn
            style="background-color:white; color:#009c8c"
            type="submit"
            >Enviar</v-btn
          >
          <v-btn
            style="background-color:white; color:#009c8c"
            @click="handleReset"
            >Limpiar</v-btn
          >
        </form>
      </v-sheet>
    </v-container>
  </div>
    <footer class="footer">
      <div>
        <div class="footer-bottom">
        {{ new Date().getFullYear() }} — <strong>Antigüedades Chespirito</strong>
      </div>
      </div>
    </footer>
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

const isAuthenticated = ref(false);
const getVentas = async () => {
  const { data, error } = await useFetch(`${CONFIG.public.API_BASE_URL}sales`);

  if (data.value != null) {
    salesId.value = data.value.data.map((e) => ({
      id: e.id,
      products: e.products,
    }));
  } else {
    throw new Error(error.value.message);
  }
};

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
  if ((data.value = !null)) {
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
};

const homeInventory = () => {
  router.push("/inventory/list");
};

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
  if(!userStore.user) {
    Swal.fire({
      icon: 'error',
      title: 'Acceso denegado',
      text: 'Debe iniciar sesión primero',
      confirmButtonText: 'Aceptar'
    }).then(()=>{
      router.push('/')
    });
  }else {
    isAuthenticated.value = true;
    await nextTick();
    await getVentas();
  }

});
</script>

<style>
  .footer-bottom {
  margin-top: 10px;
  font-size: 14px;
}

.footer {
  display: flex;
  justify-content: center;
  margin-top: 2%;
  color:#009c8c
}
</style>
