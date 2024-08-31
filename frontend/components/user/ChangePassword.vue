<template>
  <div>
    <h1 style="display: flex; color: #009c8c; justify-content: center; margin-top: 2%">
      Cambiar Contraseña
    </h1>
    <v-card
      class="mx-auto pa-12 pb-8"
      elevation="8"
      max-width="350"
      rounded="lg"
    >
      <div style="color:#009c8c ;">Nueva Contraseña</div>
      <v-text-field
      style="color:#009c8c ;"
        v-model="newPassword"
        :type="visible ? 'text' : 'password'"
        placeholder="Inserta tu nueva contraseña"
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="togglePasswordVisibility"
      ></v-text-field>

      <v-btn
        class="mb-8"
        color="#009c8c"
        size="large"
        variant="tonal"
        block
        @click.prevent="changePassword"
      >
        Cambiar
      </v-btn>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';
import { useAuth } from '~/store/auth';

const CONFIG = useRuntimeConfig();
const router = useRouter();
const newPassword = ref('');
const visible = ref(false);
const auth = useAuth();

const changePassword = async () => {
  try {
    const response = await fetch(`${CONFIG.public.API_BASE_URL}auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`,
      },
      body: JSON.stringify({
        newPassword: newPassword.value,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: data.message,
      });
      router.push('/');
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: data.message,
      });
    }
  } catch (error) {
    console.error('Error changing password', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al cambiar la contraseña. Inténtalo de nuevo.',
    });
  }
};

const togglePasswordVisibility = () => {
  visible.value = !visible.value;
};
</script>
