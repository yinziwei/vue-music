<template>
  <div id="app">
      <m-header></m-header>
    <tab></tab>
  <!--  改标签将内容缓存，这样相互切换tab的时候就不用再次刷新了-->
    <keep-alive>
    <router-view></router-view>
    </keep-alive>

  </div>
</template>

<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header'
import Tab from 'components/tab/tab'

  export default {
    components:{
      //注册该组件
      MHeader,
      Tab
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
#app
  background: black
</style>
