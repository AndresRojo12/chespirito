<template>
  <div>
    <div class="header-container">
      <v-btn @click.prevent="category" class="register-button"
        >Registrar categoría</v-btn
      >
      <v-text-field
        class="search-field"
        v-model="search"
        density="comfortable"
        placeholder="Buscar categorías"
        prepend-inner-icon="mdi-magnify"
        variant="solo"
        clearable
        hide-details
      ></v-text-field>
    </div>

    <v-select
      v-model="pageSize"
      class="page-select"
      :items="[10, 20, 30, 40, 50]"
      label="Seleccionar categorías por página"
      @change="getCategories"
    ></v-select>

    <div v-if="!isLoading && noRecordsFound" style="text-align: center">
      <v-alert color="#009c8c" type="warning">
        No se encontraron registros.
      </v-alert>
    </div>

    <div v-else class="category-container">
      <div
        class="category-item"
        v-for="cate in filteredCategories.data || []"
        :key="cate.id"
      >
        <div>
          <img class="category-image" :src="getImageUrl(cate.imagePath)" />
        </div>
        <nuxt-link :to="`/categories/${cate.id}`">
          <button class="category-info">
            <h3>{{ cate.name }}</h3>
            <p>{{ cate.description }}</p>
          </button>
        </nuxt-link>
        <v-tooltip text="Editar">
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
                :length="filteredCategories.totalPages || 1"
                class="my-4"
                @input="getCategories"
              ></v-pagination>
            </v-container>
          </v-col>
        </v-row>
      </v-container>

      <v-dialog class="dialog" v-model="showEditDialog">
        <v-card>
          <h1 class="dialog-title">Editar Categoría</h1>
          <v-card-text>
            <CategoriesProductUpdate
              :category="editingCategory"
              @save="handleSave"
            />
          </v-card-text>
          <v-card-actions>
            <v-btn class="cancel-button" text @click="showEditDialog = false"
              >Cancelar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog class="dialog" v-model="showDeleteDialog">
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
  </div>

  <v-container v-if="isLoading">
    <LoadingSpinner />
  </v-container>
</template>

<script setup>
import debounce from "lodash/debounce";
import { ref, onMounted, watch, nextTick } from "vue";

import CategoriesProductUpdate from "../categories/CategoriesProductUpdate.vue";
import CategoryDelete from "../categories/CategoryDelete.vue";
import LoadingSpinner from "../LoadingSpinner.vue";

const CONFIG = useRuntimeConfig();
const router = useRouter();
const isLoading = ref(false);
const search = ref("");
const noRecordsFound = ref(false);

const page = ref(1);
const pageSize = ref(10);
const showEditDialog = ref(false);
const showDeleteDialog = ref(false);
const editingCategory = ref(null);
const categoryToDelete = ref(null);
const categories = ref([]);
const filteredCategories = ref({ data: [], totalPages: 1 });

const getCategories = async () => {
  isLoading.value = true;
  try {
    const { data } = await useFetch(
      `${CONFIG.public.API_BASE_URL}categories?page=${page.value}&pageSize=${pageSize.value}`,
    );
    if (data.value) {
      categories.value = data.value.data;
      filteredCategories.value = data.value;
    } else {
      throw new Error("No se recibieron datos válidos");
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
    filteredCategories.value = { data: [], totalPages: 1 };
  } finally {
    isLoading.value = false;
  }
};

const getImageUrl = (imagePath) => {
  return imagePath;
};

onMounted(async () => {
  await nextTick();
  await getCategories();
});

const debouncedFetchCategories = debounce(async (newSearch) => {
  await getCategories();

  if (!newSearch.trim()) {
    filteredCategories.value = {
      data: categories.value,
      totalPages: filteredCategories.value.totalPages,
    };
    noRecordsFound.value = categories.value.length === 0;
    return;
  }

  try {
    const response = await fetch(
      `${CONFIG.public.API_BASE_URL}categories/search?query=${encodeURIComponent(newSearch.trim())}`,
    );
    const data = await response.json();
    filteredCategories.value = { data, totalPages: 1 };
    noRecordsFound.value = data.length === 0;
  } catch (error) {
    console.error("Error fetching filtered categories:", error);
    filteredCategories.value = { data: [], totalPages: 1 };
    noRecordsFound.value = true;
  }
}, 500);

watch(search, (newSearch) => {
  debouncedFetchCategories(newSearch);
});

watch(page, async () => {
  await getCategories();
});

watch(pageSize, async () => {
  await getCategories();
});

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
  const index = filteredCategories.value.data.findIndex(
    (item) => item.id === categoryId,
  );

  if (index !== -1) {
    filteredCategories.value.data.splice(index, 1);
  }
  await getCategories();
  showDeleteDialog.value = false;
};

const category = async () => {
  await nextTick();
  await router.push("/categories/register");
};

const confirmDelete = async (category) => {
  categoryToDelete.value = category;
  showDeleteDialog.value = true;
};
</script>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
}
.register-button {
  color: white;
  background: linear-gradient(to bottom, #009c8c, #00b7a2);
  font-family: "Arial", sans-serif;
}
.search-field {
  max-width: 300px;
}
.page-select {
  max-width: 300px;
  margin-top: 2%;
}
.category-container {
  display: flex;
  flex-wrap: wrap;
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
.category-info {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  background: linear-gradient(to bottom, #009c8c, #00b7a2);
  color: white;
  font-family: "Arial", sans-serif;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.dialog {
  max-width: 500px;
}
.dialog-title {
  align-self: center;
  background-image: linear-gradient(to bottom, #009c8c, #00b7a2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-top: 10px;
  font-family: "Arial", sans-serif;
}
.cancel-button {
  background-image: linear-gradient(to bottom, #009c8c, #00b7a2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: "Arial", sans-serif;
}

@media (max-width: 1024px) {
  .dialog {
    margin-bottom: 40%;
  }
}

@media (max-width: 540px) {
  .header-container {
    display: inline;
  }
  .register-button {
    width: 100%;
    font-size: 4vw;
  }
  .search-field {
    max-width: 100%;
    margin-top: 3%;
  }
  .page-select {
    max-width: 100%;
  }
  .category-item {
    flex: 1 1 80%;
    max-width: 100%;
  }
  .dialog {
    margin-bottom: 0%;
  }
  .dialog-title {
    font-size: 6vw;
  }
}

@media (max-width: 430px) {
  .header-container {
    display: inline;
  }
  .register-button {
    width: 100%;
    font-size: 5vw;
  }
  .search-field {
    max-width: 100%;
  }
  .page-select {
    max-width: 100%;
  }
  .category-item {
    flex: 1 1 100%;
    max-width: 100%;
  }
  .dialog {
    margin-bottom: 0%;
  }
  .dialog-title {
    margin-top: 5%;
    font-size: 6vw;
  }
  .cancel-button {
    width: 100%;
    font-size: 4vw;
    margin-bottom: 5%;
  }
}
</style>
