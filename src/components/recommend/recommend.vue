<template>
  <div class="recommend" ref="recommend">
   <!-- 注意初始化scroll的时间点， :data="discList"-->
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <div>
<!--
        v-if="recommends.length"这个确保了得到了数据然后再渲染样式及，不然数据还没有mout里面得数就执行了，这就会报错
-->
        <div v-if="recommends.length" class="slider-wrapper" ref="sliderWrapper">
          <slider>
            <div v-for="item in recommends">
              <a :href="item.linkUrl">
                <img :src="item.picUrl"  class="needsclick" @load="loadImage">
              </a>
            </div>
          </slider>
        </div>
        <div class=""recommend-list>
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
           <li v-for="item in discList" class="item">
             <div class="icon">
              <!-- 这个类needsclick，发现有这个类fastclick就不会拦截-->
               <img width="60" height="60" v-lazy="item.imgurl" class="needsclick">
             </div>
             <div class="text">
               <h2 class="name" v-html="item.creator.name"></h2>
               <p class="desc" v-html="item.dissname" ></p>
             </div>
           </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>

  </div>
</template>

<script>
  import {getRecommend,getDiscList} from "api/recommend";
  import {ERR_OK} from "api/config";
  import Slider from 'base/slider/slider'
  import Loading from 'base/loading/loading'
  import Scroll from 'base/scroll/scroll'
  import {playlistMixin} from  'common/js/mixin'
  import {mapMutations} from 'vue'

  export default {
        name: "recommend",
        mixin:[playlistMixin],
    data(){
          return{
            recommends:[],
            discList:[]
          }
    },

      created(){
        //在该钩子函数中获取数据,哪怕推荐部分是后渲染说出来的，也能一滑到底，因为有loadImage()函数确定了刷新的时间点
    /*    setTimeout(()=>{
          this._getRecommend()
        },2000)*/
        this._getRecommend(),
          //获取歌单
          this._getDiscList()
      },
      methods:{
          handlePlaylist(playlist){
            const bottom = playlist.length > 0 ? '60px' : ''
            this.$refs.recommend.style.bottom=bottom
            this.$refs.scroll.refresh()
          },
        loadImage(){
            //这个判断条件只是为了节约资源，质押一个图片有了，其他的图片就不用再判断了
            if(!this.checkloaded){
              this.checkloaded=true
              this.$refs.scroll.refresh()
            }
        },
        selectItem(item){
            this.$router.push({
              path:'/recommmend/${item.dissid}'
            })
          this.setDisc(item)
        },
          _getRecommend(){
            getRecommend().then((res)=>{
              if(res.code===ERR_OK){
                this.recommends=res.data.slider
              }
            })
          },
        _getDiscList(){
            getDiscList().then((res)=>{
              if(res.code===ERR_OK){
                this.discList=res.data.list
              }
            })
        },
        ...mapMutations({
          setDisc:'SET_DISC'
        })
      },
    components:{
          SLider,
          Loading,
      Scroll
    }
    }


</script>

<style scoped lang="stylus"  rel="stylesheet/stylus" >
  @import "~common/stylus/variable"
  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)

</style>
