<template>
 <v-form>
    <v-text-field
      v-model="localProduct.name"
      label="Nombre"
      required
    />
    <v-textarea
      v-model="localProduct.description"
      label="Descripción"
      rows="3"
      required
    />
    <v-text-field
      v-model="localProduct.price"
      label="Precio"
      required>
    </v-text-field>
    <v-file-input
      v-model="localProduct.image"
      label="Seleccionar imagen"
      accept="image/*"
      prepend-icon="mdi-image"
    />
    <v-btn color="green" @click="updateProduct">Guardar</v-btn>
  </v-form>
</template>

<script setup>
  import { ref, watch } from 'vue';
  import { defineProps, defineEmits } from 'vue';
  import Swal from "sweetalert2";
  const CONFIG = useRuntimeConfig();
  const image = ref(null);

  const props = defineProps({
    product: Object
  });

  const emit = defineEmits(['save']);
  const localProduct = ref({ ...props.product });

  

  watch(() => props.product, (newProduct) => {
    localProduct.value = { ...newProduct };
  });

  const updateProduct = async () => {
    isReactive(localProduct)
  try {
    const formData = new FormData();
    formData.append('name', localProduct.value.name);
    formData.append('description', localProduct.value.description);
    formData.append('price', localProduct.value.price);

    if (image.value) {
      formData.append('image', image.value);
    }

    const response = await useFetch(`${CONFIG.public.API_BASE_URL}products/${props.product.id}`, {
      method: 'PATCH',
      body: {
        name:localProduct.value.name,
        description:localProduct.value.description,
        price:localProduct.value.price,
      },
    });

    if (response != null) {

      Swal.fire({
        title:'Se actualizo',
        text:'Actualizada correctamente',
        icon:'success',
        confirmButtonText:'Aceptar'
      });
      emit('save',true, localProduct.value.id, localProduct.value.name);
    }else {
      Swal.fire({
        title:'error',
        text:'No se pudo Actualizar',
        icon:'error',
        confirmButtonText:'Aceptar'
      });
      emit('save',false, null);
    }
  } catch (error) {
    console.log('Error', error);
  }
};
</script>
