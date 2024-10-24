<template>
  <div v-if="userStore.loading">
    <LoadingSpinner />
  </div>
  <div v-if="userStore.isAuthenticated">
    <div>
      <v-app-bar-nav-icon
        class="icon-navbar"
        @click="toggleDrawer"
        v-if="showAppBar"
        app
      ></v-app-bar-nav-icon>
      <h1 class="title">ANTIGÜEDADES CHESPIRITO</h1>
      <v-app>
        <v-navigation-drawer
          v-model="drawer"
          app
          fixed
          :width="drawerWidth"
          :rail="isRail"
          :expand-on-hover="isLargeScreen"
          :temporary="!isLargeScreen"
          @mouseenter="handleMouseEnter"
          @mouseleave="handleMouseLeave"
        >
          <v-list>
            <v-list-item
              class="buttons"
              :title="`${user ? user.role : 'Usuario'}`"
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

        <v-main
          :class="{ 'main-expanded': isRail, 'main-collapsed': !isRail }"
          app
        >
          <v-container fluid>
            <slot />
          </v-container>
        </v-main>
      </v-app>

      <footer class="footer">
        <div>
          <div class="footer-bottom">
            {{ new Date().getFullYear() }} —
            <strong>Antigüedades Chespirito</strong>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useAuth } from "~/store/auth";
import { useRouter, useRoute } from "vue-router";
import { useDisplay } from "vuetify";
import Swal from "sweetalert2";

import LoadingSpinner from "~/components/LoadingSpinner.vue";

const CONFIG = useRuntimeConfig();
const userStore = useAuth();
const user = ref(null);
const router = useRouter();
const route = useRoute();
const { mdAndUp } = useDisplay();

const drawer = ref(false);
const isRail = ref(true);
const isLargeScreen = computed(() => mdAndUp.value);
const drawerWidth = computed(() => (isRail.value ? 55 : 155));

onMounted(() => {
  userStore.loadUserFromStorage();
  drawer.value = isLargeScreen.value && userStore.isAuthenticated;
});

const fetchUserData = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${CONFIG.public.API_BASE_URL}auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    user.value = data;
  } catch (error) {
    console.log(error);
  }
};

onMounted(async () => {
  await fetchUserData();
});

const handleMouseEnter = () => {
  isRail.value = false;
};

const handleMouseLeave = () => {
  isRail.value = true;
};

const showAppBar = computed(() => {
  const routesWithAppBar = [
    "/user/gestion",
    "/product/list",
    "/sales/list",
    "/inventory/list",
  ];
  return routesWithAppBar.includes(route.path);
});

const toggleDrawer = () => {
  drawer.value = !drawer.value;
  isRail.value = !drawer.value;
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
.main-expanded {
  transition: margin-left 0.3s;
}
.main-collapsed {
  transition: margin-left 0.3s;
}
.title {
  display: flex;
  margin-top: 1%;
  margin-bottom: 2%;
  justify-content: center;
  font-size: 2rem;
  background-image: linear-gradient(to bottom, #009c8c, #00b7a2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: "Arial", sans-serif;
}
.buttons {
  color: black;
}
.icon-navbar {
  display: none;
}
.footer {
  display: flex;
  justify-content: center;
}
.footer-bottom {
  background-image: linear-gradient(to bottom, #009c8c, #00b7a2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: "Arial", sans-serif;
}

@media (max-width: 1024px) {
  .title {
    display: flex;
    margin-top: 0%;
    font-size: 4vw;
  }
  .main-navbar {
    display: flex;
  }
  .icon-navbar {
    display: flex;
    font-size: 2vw;
  }
}

@media (max-width: 540px) {
  .title {
    display: none;
  }
  .icon-navbar {
    font-size: 3vw;
  }
}

@media (max-width: 430px) {
  .title {
    display: none;
  }
  .icon-navbar {
    display: flex;
    font-size: 5vw;
  }
  .footer-bottom {
    font-size: 5vw;
  }
}
</style>
