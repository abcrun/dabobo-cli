<template>
  <div class="main-layout">
    <div class="main-title">
      Main Layout
      <span>Current ENV VARS IN .env -> {{env.domain}}</span>
    </div>
    <div class="content">
      <div class="top">
        <router-link to="/home/index">home</router-link>
        <router-link to="/about">about</router-link>
        <router-link to="/1/detail">detail:1</router-link>
        <router-link to="/2/detail">detail:2</router-link>
      </div>
      <div class="wrapper">
        <router-view />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'MainLayout',
  computed: {
    env() {
      return process.env.VARS;
    },
  },
};
</script>
<style scoped lang="css">
.main-layout {
  background: #ccc;

  & .main-title {
    line-height: 50px;

    & span {
      color: red;
      font-weight: bold;
    }
  }

  & .top {
    line-height: 50px;

    & > a {
      padding: 10px;
      margin: 0 5px;
      background: blue;
      text-decoration: none;
      color: #fff;
    }
  }
}
</style>
