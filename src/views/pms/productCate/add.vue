<template> 
  <product-cate-detail :is-edit='false'></product-cate-detail>
</template>
<script>
  //传了is-edit='false'，设置编辑的状态进入./components/ProductCateDetail'，添加的时候标记为false，
  import ProductCateDetail from './components/ProductCateDetail'
  export default {
    name: 'addProductCate',
    components: { ProductCateDetail }
  }
</script>
<style>
</style>


