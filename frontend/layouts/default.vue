<template>
  <div v-if="showLayout" class="main-container">
    <h1 class="title">ANTIGÜEDADES CHESPIRITO</h1>
    <v-layout>
      <v-navigation-drawer
        class="drawer"
        v-model="drawer"
        app
        fixed
        :rail="isLargeScreen"
        :expand-on-hover="isLargeScreen"
        :temporary="!isLargeScreen"
      >
        <v-list>
          <v-list-item
            class="buttons"
            :title="`${userStore.user ? userStore.user.role : 'Usuario'}`"
            prepend-icon="mdi-account-circle"
          ></v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list density="compact" nav>
          <v-list-item
            class="buttons"
            title="Inicio"
            prepend-icon="mdi-home-city"
            @click.prevent="goHome"
          >
          </v-list-item>
          <v-list-item
            class="buttons"
            title="Productos"
            prepend-icon="mdi-cash"
            @click.prevent="productsPage"
          >
          </v-list-item>
          <v-list-item
            class="buttons"
            title="Ventas"
            prepend-icon="mdi-elevation-rise"
            @click.prevent="ventasPage"
          >
          </v-list-item>
          <v-list-item
            class="buttons"
            title="Inventarios"
            prepend-icon="mdi-clipboard-text"
            @click.prevent="inventoriesPage"
          ></v-list-item>
          <v-list-item
            class="buttons"
            title="Salir"
            prepend-icon="mdi-logout"
            @click.prevent="confirmLogout"
          >
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-app-bar v-if="showAppBar" app class="app-bar">
        <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>
        <v-toolbar-title class="title-toolbar"
          >Antigüedades Chespirito</v-toolbar-title
        >
      </v-app-bar>
    </v-layout>
    <slot />
    <footer class="footer">
      <div>
        <div class="footer-bottom">
          {{ new Date().getFullYear() }} —
          <strong>Antigüedades Chespirito</strong>
        </div>
      </div>
    </footer>
  </div>
  <div v-else>
    <slot />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useAuth } from "~/store/auth";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { useRoute } from "vue-router";

const userStore = useAuth();
const router = useRouter();
const route = useRoute();

const drawer = ref(true);
const isLargeScreen = ref(true);

const showAppBar = computed(() => {
  const routesWithAppBar = ["/user/gestion", "/product/list", "/sales/list"];
  return routesWithAppBar.includes(route.path);
});

const showLayout = computed(() => {
  const routesWithoutLayout = ["/", "/user/change-password"];
  return !routesWithoutLayout.includes(route.path);
});

const checkScreenSize = () => {
  if (typeof window !== "undefined") {
    isLargeScreen.value = window.innerWidth > 1024;
    drawer.value = !isLargeScreen.value;
  }
};

const updateDrawerState = () => {
  if (window.innerWidth <= 1024) {
    drawer.value = false;
  } else {
    drawer.value = true;
  }
};

onMounted(() => {
  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);
});

onMounted(() => {
  updateDrawerState();
  window.addEventListener("resize", updateDrawerState);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", checkScreenSize);
});

const toggleDrawer = () => {
  if (!isLargeScreen.value) {
    drawer.value = !drawer.value;
  }
};

const goHome = () => {
  router.push("/user/gestion");
};

const productsPage = () => {
  router.push("/product/list");
};

const ventasPage = () => {
  router.push("/sales/list");
};

const inventoriesPage = () => {
  router.push("/inventory/list");
};

const confirmLogout = () => {
  Swal.fire({
    title: "¿Seguro quieres cerrar sesión?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Si,cerrar sesión",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      handleLogout();
    }
  });
};

const handleLogout = () => {
  userStore.logout();
  router.push("/");
};
</script>

<style scoped>
.title {
  display: flex;
  margin-top: 2%;
  justify-content: center;
  font-size: 2rem;
  color: #009c8c;
}
.drawer {
  max-width: 155px;
}
.buttons {
  color: #009c8c;
}
.app-bar {
  display: none;
}
.footer-bottom {
  margin-bottom: 10px;
  font-size: 14px;
}
.footer {
  display: flex;
  justify-content: center;
  margin-top: 2%;
  color: #009c8c;
}
@media (max-width: 1024px) {
  .title {
    display: none;
  }
  .app-bar {
    display: flex;
  }
  .title-toolbar {
    margin-left: 30%;
  }
}
@media (max-width: 540px) {
  .title-toolbar {
    margin-left: 20%;
  }
}
@media (max-width: 430px) {
  .title {
    display: none;
  }
  .app-bar {
    display: flex;
  }
  .title-toolbar {
    font-size: 5vw;
    margin-left: 13%;
  }
  .footer-bottom{
    font-size: 5vw;
  }
}
</style>
