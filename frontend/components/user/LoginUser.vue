<template>
  <div>
    <h1 style="display: flex; justify-content: center; margin-top: 2%">
      Iniciar sesión
    </h1>
  </div>
  <div style="margin-top:2%">
    <v-card
      class="mx-auto pa-12 pb-8"
      elevation="8"
      max-width="350"
      rounded="lg"
    >
      <div class="text-subtitle-1 text-medium-emphasis">Correo electronico</div>

      <v-text-field
        v-model="email"
        density="compact"
        placeholder="Dirección de correo"
        prepend-inner-icon="mdi-email-outline"
        variant="outlined"
      ></v-text-field>

      <div
        class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
      >
        Contraseña

        <a
          class="text-caption text-decoration-none text-blue"
          href="#"
          rel="noopener noreferrer"
          target="_blank"
        >
          olvido su contraseña?</a
        >
      </div>

      <v-text-field
        v-model="password"
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="visible ? 'text' : 'password'"
        density="compact"
        placeholder="Inserta tu contraseña"
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
        @click:append-inner="togglePasswordVisibility"
      ></v-text-field>

      <v-btn class="mb-8" color="blue" size="large" variant="tonal" block @click.prevent="login">
        Iniciar
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
const email = ref('');
const password = ref('');
const visible = ref(false);
const auth = useAuth();

const login = async () => {
  try {
    const response = await fetch(`${CONFIG.public.API_BASE_URL}auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      auth.login(data.token, data.user);
      router.push('/user/gestion');
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: data.message,
      });
    }
  } catch (error) {
    console.error('Error logging in', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al iniciar sesión. Inténtalo de nuevo.',
    });
  }
};

const togglePasswordVisibility = () => {
  visible.value = !visible.value;
};

</script>
