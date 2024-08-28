<template>
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

  <v-select
    v-model="pageSize"
    class="page-select"
    :items="[10, 20, 30, 40, 50]"
    label="Seleccionar categorías por página"
    @change="getCategories"
  ></v-select>

  <div class="category-container">
    <div
      class="category-item"
      v-for="cate in filteredCategories.data || []"
      :key="cate.id"
    >
      <div>
        <img class="category-image" :src="getImageUrl(cate.imagePath)" />
      </div>
      <nuxt-link :to="`/categories/${cate.id}`">
        <button class="category-button">
          <h3 class="button-text">{{ cate.name }}</h3>
          <p class="button-text">{{ cate.description }}</p>
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
    <v-dialog v-model="showEditDialog" max-width="300px">
      <v-card class="edit-dialog">
        <v-card-title style="color: #009c8c" class="headline"
          >Editar Categoría</v-card-title
        >
        <v-card-text>
          <CategoriesProductUpdate
            :category="editingCategory"
            @save="handleSave"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn style="color: #009c8c" text @click="showEditDialog = false"
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
import CategoriesProductUpdate from "../categories/CategoriesProductUpdate.vue";
import CategoryDelete from "../categories/CategoryDelete.vue";

const CONFIG = useRuntimeConfig();
const router = useRouter();

const page = ref(1);
const pageSize = ref(10);
const showEditDialog = ref(false);
const showDeleteDialog = ref(false);
const editingCategory = ref(null);
const categoryToDelete = ref(null);

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

const category = () => {
  router.push("/categories/register");
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
  margin-top: 5%;
  margin-left: 13%;
  color: white;
  background-color: #009c8c;
}
.search-field {
  max-width: 300px;
  margin-top: 3%;
  margin-right: 5%;
}
.page-select {
  max-width: 300px;
  margin-left: 13%;
  margin-top: 5%;
}
.category-container {
  margin-left: 10%;
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
.button-text {
  margin: 0;
}
.edit-dialog {
  background-color: white;
  border-style: groove;
  border-radius: 6%;
  border-color: #009c8c;
}

@media (max-width: 430px) {
  .header-container {
    display: inline;
  }
  .register-button {
    width: 97%;
    font-size: 5vw;
    margin-left: 1.5%;
    margin-top: 20%;
  }
  .search-field {
    max-width: 100%;
    margin-right: 0%;
    padding: 2%;
  }
  .page-select {
    max-width: 100%;
    margin-left: 0;
    padding: 2%;
  }
  .category-container {
    margin-left: 0%;
  }
  .category-item {
    flex: 1 1 100%;
    max-width: 100%;
  }
  .button-text {
    font-size: 5vw;
  }
}
</style>
