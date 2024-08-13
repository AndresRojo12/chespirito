<template>
  <div>
    <v-card style="max-height: 10rem">
      <h1
        style="
          display: flex;
          background-color: #aeb0b3;
          justify-content: center;
        "
      >
        Chespirito
      </h1>
      <v-data-iterator :items="filteredCategories.data" style="margin-top: 2%">
        <template v-slot:header>
          <v-text-field
            v-model="search"
            density="comfortable"
            placeholder="Buscar categorías"
            prepend-inner-icon="mdi-magnify"
            style="max-width: 300px; margin-left: 75%"
            variant="solo"
            clearable
            hide-details
          ></v-text-field>
          <v-row>
            <v-btn @click.prevent="category" style="margin-left: 10%"
              >Registrar categoría</v-btn
            >
          </v-row>
        </template>
      </v-data-iterator>
      <v-layout>
        <v-navigation-drawer
          style="background-color: #aeb0b3; max-width: 155px"
          expand-on-hover
          rail
        >
          <v-list>
            <v-list-item
              prepend-icon="mdi-account-circle"
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
              title="Productos"
              @click.prevent="products"
            ></v-list-item>

            <v-list-item
              prepend-icon="mdi-cash"
              title="Inventarios"
              @click.prevent="inventories"
            ></v-list-item>
            <v-list-item
              prepend-icon="mdi-elevation-rise"
              title="Ventas"
              @click.prevent="sales"
            >
            </v-list-item>

            <v-list-item
              @click.prevent="confirmLogout"
              prepend-icon="mdi-logout"
              title="Salir"
            ></v-list-item>
          </v-list>
        </v-navigation-drawer>

        <v-main style="height: 250px"></v-main>
      </v-layout>
    </v-card>
    <v-select
      v-model="pageSize"
      style="max-width: 300px; margin-left: 12%; margin-top: 2%"
      :items="[10, 20, 30, 40, 50]"
      label="Seleccionar categorías por página"
      @change="getCategories"
    ></v-select>
  </div>
  <div style="margin-left: 10%; margin-top: 2%; display: flex; flex-wrap: wrap">
    <div
      v-for="cate in filteredCategories.data"
      :key="cate.id"
      style="
        flex: 1 1 22%;
        max-width: 22%;
        margin: 1%;
        box-sizing: border-box;
        text-align: center;
      "
    >
      <div>
        <img style="width: 100%" :src="getImageUrl(cate.imagePath)" />
      </div>
      <nuxt-link :to="`/categories/${cate.id}`">
        <button
          style="
            width: 100%;
            padding: 10px;
            margin-top: 10px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          "
        >
          <h3 style="margin: 0">{{ cate.name }}</h3>
          <p style="margin: 0">{{ cate.description }}</p>
        </button>
      </nuxt-link>
      <v-tooltip text="">
        <template v-slot:activator="{ props }">
          <v-icon v-bind="props" @click="editCategory(cate)">
            mdi-pencil
          </v-icon>
        </template>
      </v-tooltip>
      <v-tooltip text="Eliminar">
        <template v-slot:activator="{ props }">
          <v-icon v-bind="props" @click="confirmDelete(cate)">
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
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
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

const handleDelete = (categoryId) => {
  filteredCategories.value.data = filteredCategories.value.data.findIndex(
    (item) => item.id === categoryId,
  );
  filteredCategories.value.splice(index, 1);
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
