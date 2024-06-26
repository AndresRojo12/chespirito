<template>
  <div>
    <h1 style="display: flex; justify-content: center;">Chespirito</h1>
    <v-card>
      <v-layout>
        <v-navigation-drawer
        v-model="drawer"
        :rail="rail"
        permanent
        @click="rail = false"
        >
        <v-list-item
        prepend-icon="mdi-account-circle"
        :title="`${userStore.user ? userStore.user.role : 'Usuario'}`"
        nav
        >
        <template v-slot:append>
          <v-btn
          icon="mdi-chevron-left"
          variant="text"
          @click.stop="rail = !rail"
          ></v-btn>
        </template>
      </v-list-item>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-home-city" title="Home" value="home"></v-list-item>
            <v-list-item prepend-icon="mdi-account" title="My Account" value="account"></v-list-item>
            <v-list-item
            @click.prevent="confirmLogout"
            prepend-icon="mdi-logout"
            title="Salir">
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-main style="height: 250px"></v-main>
    </v-layout>
  </v-card>
</div>
<div style="margin-left:10%; margin-top: 2%; display: flex; flex-wrap: wrap;">
  <div v-for="cate in categories" :key="cate.id" style="flex: 1 1 22%; max-width: 22%; margin: 1%; box-sizing: border-box; text-align: center;">
    <div>
      <img style="width: 100%;" :src="getImageUrl(cate.imagePath)" />
    </div>
    <button style="width: 100%; padding: 10px; margin-top: 10px; background-color: #007BFF; color: white; border: none; border-radius: 5px; cursor: pointer;">
      <h3 style="margin: 0;">{{ cate.name }}</h3>
      <p style="margin: 0;">{{ cate.description }}</p>
    </button>
  </div>
</div>


</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { useAuth } from "~/store/auth";
  import Swal from "sweetalert2";
  const CONFIG = useRuntimeConfig();

  const drawer = ref(true);
  const rail = ref(true);

  const router = useRouter();
  const userStore = useAuth();

  const categories = ref([]);

  const getCategories = async () => {
    try {
      const { data, error } = await useFetch(
        `${CONFIG.public.API_BASE_URL}categories`,
        {
          method:'GET'
        }
      )
      categories.value = data.value;
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  const getImageUrl = (imagePath) => {
    return imagePath;
  };

  onMounted(async () => {
    await getCategories();
  })

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

const handleLogout = () => {
  userStore.logout();
  router.push("/");
};
</script>

