<template>
  <div class="home-layout">
    <div class="home-title">Home Layout</div>
    <router-view />
  </div>
</template>
<style scoped lang="css">
.home-layout {
  background: green;
  padding: 10px;

  & .home-title {
    font-weight: bold;
    color: #fff;
    line-height: 50px;
  }
}
</style>
