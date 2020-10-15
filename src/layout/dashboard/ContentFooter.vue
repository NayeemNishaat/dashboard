<template>
  <footer class="footer">
    <div class="container-fluid d-flex flex-wrap justify-content-between">
      <nav>
        <ul>
          <li>
            <router-link :to="{ path: '/admin' }">Dashboard</router-link>
          </li>
        </ul>
      </nav>
      <div class="copyright d-flex flex-wrap">
        DataCue
      </div>
    </div>
  </footer>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({});
</script>
<style></style>
