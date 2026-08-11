<script setup lang="ts">

</script>

<template>
  <div class="container-loader">
    <div class="loader"></div>
  </div>
</template>

<style scoped lang="scss">
  .container-loader {
    position: absolute;
    inset: 0;
    
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(2px);
  }

  .loader {
    width: 50px;
    aspect-ratio: 1;
    border-radius: 50%;
    border: 8px solid rgb(24.4, 33.8, 43.5);
    border-right-color: #0a4682;
    animation: l2 1s infinite linear;
  }

  @keyframes l2 {to{transform: rotate(1turn)}}
</style>
