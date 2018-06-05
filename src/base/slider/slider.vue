//组件分为基础组件和业务组件
<template>
<div class="slider" ref="slider">
  <div class="slider-group" ref="sliderGroup">
    <slot></slot>
  </div>
  <div class="dots">
    <span class="dots" :class="{active:currentPageIndex===index}" v-for="(item,index) in dots"></span>
  </div>
</div>
</template>

<script type="text/ecmascript-6">
  import {addClass} from 'commom/js/dom'
  import BScroll from 'better-scroll'
    export default {
        name: "slider",
      props:{
          //是否为循环轮播
           loop:{
             type:Boolean,
             default:true
           },
        //是否为自动播放
           autoPlay:{
             type:Boolean,
             default:true
           },
        //间隔多少播放
        interval:{
             type:Number,
          default:4000
        },
      },
      data(){
          return{
            dots:[],
            //表示当前是第几页
            currentPageIndex:0
          }
      },
      mounted(){
          setTimeout(()=> {
            //设置宽度
            this._setSliderWidth()
          //初始化点
            this._initDots()
            this._initSilder()
            if (this.autoPlay) {
              this._play()
            }
          } ,20)
        //传isResize参数是为了当串口大小变化时，能够自适应
        window.addEventListener('resize',()=>{
          if(!this.slider){
            return
          }
          this._setSliderWidth(true)
          //重新刷新
          this.slider.refresh()
        })

      },
      activated(){
          if(this.autoPlay){
            this._play()
          }
      },
      //当组件中有计时器这种资源的时候，销毁组件事最好把计时器给取消掉，以免对后面程序造成影响
      deactivated(){
          clearTimeout(this,timer)
      },
      methods:{
        //传isResize参数是为了当串口大小变化时， 如果是因为窗口大小变化而来的，那就 width+=2*sliderWidth不能在执行了
          _serSliderWidth(isResize){
            this.children=this.$refs.sliderGroup.children
            let width=0
            //父容器的宽度，这个宽度是被父容器撑开
            let sliderWidth=this.$refs.slider.clientWidth
            for(let i=0;i<this.children.length;i++){
              let child=this.children[i]
              addClass(child,'slider-item')
              child.style.width=sliderWidth+'px'
              width+=sliderWidth
            }
            //better-scroll会克隆两个dom，保证循环切换
            if(this.loop&&!isResize){
              width+=2*sliderWidth
            }
            this.$refs.sliderGroup.style.width=width+'px'

          },
        //这时就初始化轮播图，这样才能滚动
        _initSlider(){
            this.slider=new BScroll(this.$refs.slider,{
              scroll:true,
              scrollY:false,
              momentum:false,
              snap:true,
              snapLoop:this.loop,
              snapThreshold:0.3,
              snapSpeed:400,
              //这个与fastclick想矛盾
               //click:true
            })
          //监听一个事件，当切换到下一个得时候获得pageIndex，getCurrentPage()是better-scroll中有的方法
          this.slider.on('scrollEnd',()=>{
            let pageIndex=this.slider.getCurrentPage().pageX
            if(this.loop){
              pageIndex-=1
            }
            this.currentPageIndex=pageIndex
            //自动播放
            if(this.autoPlay){
              //取消掉计数器，是为了防止在手动拖的时候它自己轮播了，体验感不好
              clearTimeout(this.timer)
              this._play()
            }
          })
        },
        _initDots(){
            this.dots=new Array(this.children.length)
        },
        _play(){
            let pageIndex=this.currentPageIndex+1
          if(this.loop){
              //因为最开始的时候有个副本（BS得原因）
              pageIndex+=1
          }
          this.timer=setTimeout(()=>{
            //goToPage这个是BS提供的
            this.slider.goToPage(pageIndex,0,400)
          },this.interval)
        }
      }
    }
</script>

<style scoped lang="stylus"  rel="stylesheet/stylus">
   @import "~common.stylus/variable"
   .slider
     min-height: 1px
     .slider-group
       position: relative
       overflow: hidden
       white-space: nowrap
       .slider-item
         float: left
         box-sizing: border-box
         overflow: hidden
         text-align: center
         a
           display: block
           width: 100%
           overflow: hidden
           text-decoration: none
         img
           display: block
           width: 100%
     .dots
       position: absolute
       right: 0
       left: 0
       bottom: 12px
       text-align: center
       font-size: 0
       .dot
         display: inline-block
         margin: 0 4px
         width: 8px
         height: 8px
         border-radius: 50%
         background: $color-text-l
         &.active
           width: 20px
           border-radius: 5px
           background: $color-text-ll


</style>
