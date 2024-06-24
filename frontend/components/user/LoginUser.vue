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
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="visible ? 'text' : 'password'"
        density="compact"
        placeholder="Inserta tu contraseña"
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
        @click:append-inner="visible = !visible"
      ></v-text-field>

      <v-btn class="mb-8" color="blue" size="large" variant="tonal" block>
        Iniciar
      </v-btn>
    </v-card>
  </div>
</template>

<script setup></script>
