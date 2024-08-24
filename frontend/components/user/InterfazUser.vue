<template>
  <div class="container">
    <div class="card-container">
      <h1 class="card-title">ANTIGÜEDADES CHESPIRITO</h1>

      <div class="header-container">
        <v-btn @click.prevent="category" class="register-button"
          >Registrar categoría</v-btn
        >
        <v-text-field
          v-model="search"
          density="comfortable"
          placeholder="Buscar categorías"
          prepend-inner-icon="mdi-magnify"
          class="search-field"
          variant="solo"
          clearable
          hide-details
        ></v-text-field>
      </div>

      <v-layout class="layout">
        <v-navigation-drawer
          class="nav-drawer"
          v-model="drawer"
          app
          fixed
          :rail="isLargeScreen"
          :expand-on-hover="isLargeScreen"
          :temporary="!isLargeScreen"
        >
          <v-list>
            <v-list-item
              prepend-icon="mdi-account-circle"
              :title="`${userStore.user ? userStore.user.role : 'Usuario'}`"
              class="buttons"
            ></v-list-item>
          </v-list>

          <v-divider></v-divider>

          <v-list density="compact" nav>
            <v-list-item
              prepend-icon="mdi-home-city"
              title="Inicio"
              class="buttons"
              @click="goHome"
            ></v-list-item>

            <v-list-item
              prepend-icon="mdi-cash"
              title="Productos"
              class="buttons"
              @click.prevent="products"
            ></v-list-item>

            <v-list-item
              prepend-icon="mdi-cash"
              title="Inventarios"
              class="buttons"
              @click.prevent="inventories"
            ></v-list-item>
            <v-list-item
              prepend-icon="mdi-elevation-rise"
              title="Ventas"
              class="buttons"
              @click.prevent="sales"
            >
            </v-list-item>

            <v-list-item
              @click.prevent="confirmLogout"
              prepend-icon="mdi-logout"
              title="Salir"
              class="buttons"
            ></v-list-item>
          </v-list>
        </v-navigation-drawer>

        <v-app-bar app class="app-bar">
          <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>
          <v-toolbar-title>Antigüedades Chespirito</v-toolbar-title>
        </v-app-bar>

        <v-main class="main-content"></v-main>
      </v-layout>
    </div>
  </div>
  <div class="select-container">
    <v-select
      v-model="pageSize"
      class="page-select"
      :items="[10, 20, 30, 40, 50]"
      label="Seleccionar categorías por página"
      @change="getCategories"
    ></v-select>
  </div>
  <div class="category-container">
    <div
      v-for="cate in filteredCategories.data"
      :key="cate.id"
      class="category-item"
    >
      <div>
        <img class="category-image" :src="getImageUrl(cate.imagePath)" />
      </div>
      <nuxt-link :to="`/categories/${cate.id}`">
        <button class="category-button">
          <h3 class="category-title">{{ cate.name }}</h3>
          <p class="category-description">{{ cate.description }}</p>
        </button>
      </nuxt-link>
      <v-tooltip text="">
        <template v-slot:activator="{ props }">
          <v-icon
            v-bind="props"
            @click="editCategory(cate)"
            style="color: rgba(228, 192, 11, 0.663)"
          >
            mdi-pencil
          </v-icon>
        </template>
      </v-tooltip>
      <v-tooltip text="Eliminar">
        <template v-slot:activator="{ props }">
          <v-icon
            v-bind="props"
            @click="confirmDelete(cate)"
            style="color: darkslategrey"
          >
            mdi-delete
          </v-icon>
        </template>
      </v-tooltip>
    </div>
  </div>
  <div class="text-center">
    <v-container>
      <v-row justify="center">
        <v-col cols="8">
          <v-container class="max-width">
            <v-pagination
              v-model="page"
              :length="filteredCategories.totalPages"
              class="my-4"
              @input="getCategories"
            ></v-pagination>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="showEditDialog" max-width="600px">
      <v-card>
        <v-card-title class="headline">Editar Categoría</v-card-title>
        <v-card-text>
          <CategoriesProductUpdate
            :category="editingCategory"
            @save="handleSave"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="showEditDialog = false">
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>

  <div class="text-center">
    <v-dialog v-model="showEditDialog" max-width="600px">
      <v-card>
        <v-card-title class="headline">Editar Categoría</v-card-title>
        <v-card-text>
          <CategoriesProductUpdate
            :category="editingCategory"
            @save="handleSave"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="showEditDialog = false"
            >Cancelar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showDeleteDialog" max-width="600px">
      <v-card>
        <v-card-text>
          <CategoryDelete
            :category="categoryToDelete"
            @deleted="handleDelete"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="showDeleteDialog = false">
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
  <footer class="footer">
    <div>
      <div class="footer-bottom">
        {{ new Date().getFullYear() }} —
        <strong>Antigüedades Chespirito</strong>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, onBeforeMount } from "vue";
import { useAuth } from "~/store/auth";
import Swal from "sweetalert2";
import CategoriesProductUpdate from "../categories/CategoriesProductUpdate.vue";
import CategoryDelete from "../categories/CategoryDelete.vue";
const CONFIG = useRuntimeConfig();

const drawer = ref(true);
const rail = ref(true);
const page = ref(1);
const pageSize = ref(10);
const router = useRouter();
const userStore = useAuth();
const showEditDialog = ref(false);
const editingCategory = ref(null);
const categoryToDelete = ref(null);
const showDeleteDialog = ref(false);

const categories = ref([]);
const filteredCategories = ref({ data: [], totalPages: 1 });
const search = ref("");

const isLargeScreen = ref(true);

const checkScreenSize = () => {
  if (typeof window !== "undefined") {
    isLargeScreen.value = window.innerWidth > 430;
    drawer.value = !isLargeScreen.value;
  }
};

const updateDrawerState = () => {
  if (window.innerWidth < 430) {
    drawer.value = false;
  } else {
    drawer.value = true;
  }
};

const toggleDrawer = () => {
  if (!isLargeScreen.value) {
    drawer.value = !drawer.value;
  }
};

onMounted(() => {
  checkScreenSize();
  updateDrawerState();
  window.addEventListener("resize", checkScreenSize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", checkScreenSize);
});

const getCategories = async () => {
  try {
    const { data } = await useFetch(
      `${CONFIG.public.API_BASE_URL}categories?page=${page.value}&pageSize=${pageSize.value}`,
      {
        method: "GET",
      },
    );
    categories.value = data.value.data;
    filteredCategories.value = data.value;
  } catch (error) {
    console.error("Error fetching categories:", error);
    filteredCategories.value = { data: [], totalPages: 1 };
  }
};

const getImageUrl = (imagePath) => {
  return imagePath;
};

onMounted(async () => {
  await nextTick();
  await getCategories();
});

watch(search, async (newSearch) => {
  if (!newSearch.trim()) {
    filteredCategories.value = {
      data: categories.value,
      totalPages: filteredCategories.value.totalPages,
    };
    return;
  }

  try {
    const response = await fetch(
      `${CONFIG.public.API_BASE_URL}categories/search?query=${encodeURIComponent(newSearch.trim())}`,
    );
    const data = await response.json();
    filteredCategories.value = { data, totalPages: 1 };
  } catch (error) {
    console.error("Error fetching filtered categories:", error);
    filteredCategories.value = { data: [], totalPages: 1 };
  }
});

watch(page, async () => {
  await getCategories();
});

watch(pageSize, async () => {
  await getCategories();
});

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
const editCategory = (cate) => {
  if (cate && cate.id) {
    editingCategory.value = { ...cate };
    showEditDialog.value = true;
  } else {
    console.error("La categoría no tiene una propiedad id válida.");
  }
};

const handleSave = async (updatedCategory) => {
  if (updatedCategory) {
    const index = filteredCategories.value.data.findIndex(
      (item) => item.id === updatedCategory.id,
    );
    if (index !== -1) {
      filteredCategories.value.data[index] = updatedCategory;
    }
  }

  await getCategories();

  showEditDialog.value = false;
};

const handleDelete = async (categoryId) => {
  filteredCategories.value.data = filteredCategories.value.data.findIndex(
    (item) => item.id === categoryId,
  );
  filteredCategories.value.splice(index, 1);
  await getCategories();
};

const handleLogout = () => {
  userStore.logout();
  router.push("/");
};

const goHome = () => {
  router.push("/user/gestion");
};

const products = () => {
  router.push("/product/list");
};

const inventories = () => {
  router.push("/inventory/list");
};

const category = () => {
  router.push("/categories/register");
};

const sales = () => {
  router.push("/sales/list");
};

const confirmDelete = async (category) => {
  categoryToDelete.value = category;
  showDeleteDialog.value = true;
};
</script>

<style scoped>
.card-container {
  height: 11rem;
  border-bottom: 1px solid #aeb8b8;
}
.card-title {
  display: flex;
  justify-content: center;
  font-size: 2rem;
  color: #009c8c;
}
.header-container {
  flex-direction: row;
}
.search-field {
  max-width: 300px;
  margin-left: 75%;
}
.register-button {
  margin-left: 10%;
  margin-top: 2%;
  color: #009c8c;
}
.layout {
  height: 250px;
}
.nav-drawer {
  max-width: 155px;
}
.page-select {
  max-width: 300px;
  margin-left: 12%;
  margin-top: 2%;
  color: #009c8c;
}
.category-container {
  margin-left: 10%;
  margin-top: 2%;
  display: flex;
  flex-wrap: wrap;
  padding: 2%;
}
.category-item {
  flex: 1 1 22%;
  max-width: 22%;
  margin: 1%;
  box-sizing: border-box;
  text-align: center;
}
.category-image {
  width: 100%;
}
.category-button {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  background-color: #009c8c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.category-title,
.category-description {
  margin: 0;
}
.main-content {
  height: 250px;
}
.buttons {
  color: #009c8c;
}
.footer-bottom {
  margin-top: 10px;
  font-size: 14px;
}
.footer {
  display: flex;
  justify-content: center;
  margin-top: 2%;
  color: #009c8c;
}

@media (max-width: 430px) {
  .card-title {
    font-size: 10vw;
    display: none;
  }
  .card-container {
    height: 8rem;
  }
  .header-container {
    padding: 10px;
    margin-top: 18%;
  }
  .register-button {
    width: 100%;
    font-size: 5vw;
    margin-left: 0%;
    margin-bottom: 5%;
  }
  .search-field {
    max-width: 100%;
    margin-left: 0%;
  }
  .app-bar {
    display: flex;
  }
  .page-select {
    max-width: 100%;
    margin-left: 0;
    padding: 2%;
  }
  .category-item {
    flex: 1 1 100%;
    max-width: 100%;
  }
  .layout {
    height: auto;
  }
  .category-container {
    margin-left: 0%;
  }
}
@media (min-width: 431px) {
  .app-bar {
    display: none;
  }
}
</style>
