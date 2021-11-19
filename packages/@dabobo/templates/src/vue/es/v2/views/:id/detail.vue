<template>
  <div class="detail">
    detail page
    <span>(ID:{{ id }})</span>
  </div>
</template>
<script>
export default {
  name: 'Detail',
  computed: {
    id() {
      return this.$route.params.id;
    },
  },
};
</script>
<style lang="css" scoped>
.detail {
  padding: 20px;
  background: yellow;

  & > span {
    font-weight: bold;
  }
}
</style>
