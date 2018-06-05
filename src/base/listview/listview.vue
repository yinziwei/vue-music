<template>
<!--  :data数据更新时就刷新组件,这里的listenScroll设置为true就可以派发滚动事件了-->
<scroll class="listview"
        :data="data"
         ref="listview"
         listenScroll="listenScroll"
    @scroll="scroll"
    :probeType="probeType">
  <ul>
    <li v-for="group in data" class="list-group" ref="listGroup">
      <h2 class="list-group-title">{{group.title}}</h2>
      <ul>
        <li v-for="item in group.items" class="list-group-item"></li>
        <img class="avatar" v-lazy="item.avatar">
        <span calss="name">{{item.name}}</span>
      </ul>
    </li>
  </ul>
  <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
    <ul>
      <li v-for="(item,index) in shortcutList"
           class="item"
          :data-index="index"
           :class="{'current':currentIndex===index}">
        {{item}}

      </li>
    </ul>
  </div>
  <div class="list-fixed" v-show="fixedTitle" ref="fixed">
    <h1 class="fixed-title">{{fixedTitle}}</h1>
  </div>
  <div v-show="!data.length" class="loading-container">
<loading></loading>
  </div>
</scroll>
</template>

<script>
  import Scroll from 'base/scroll'
  import {getData} from 'common/js/dom'
  import loading from 'base.loading.loading'
  const ANCHOR_HEIGHT=18//这个高度时样式里面定义来的
  const TITLE_HEIGHT=30

    export default {
        name: "listview",
      created(){
          this.touch={}
          this.listenScroll=true
        this.listHeight=[]
        this.probeType=3
      },
      data(){
          return{
            scrollY:-1,
            currentIndex:0,
            //表示滚动的差距是多少，顶部的标题会会改变
            diff:-1

          }
      },
      props:{
          data:{
            type:Array,
            default:[]
          }
      },
      computed:{
          shortcutList(){
            return this.data.map((group)=>{
              return group.title.substr(0,1)
            })
          },
        fixedTitle(){
            if(this.scrollY>0){
              return ''
            }
            return this.data[this.crrentIndex] ? this.data[this.currentIndex].title:''
        }
      },
      methods:{
          //此时点击右边的入口时，左边的歌手列表能到相应为的位置
        onShortcutTouchStart(e){
           let anchorindex=getData(e.target,'index')
          let firstTouch=e.touches[0]//第一个手指触摸的位置，这个在两个函数里面功效那个
          this.touch.y1=firtTouch.pageY
          this.touch.anchorIndex=anchorindex//记录刚开始触摸时是第几个索引
          this._scrollTo(anchorindex)

        }
      },
      //能拖着右边的菜单进行滚动
      onShortcutTouchMove(e){
          let firstTouch=e.touches[0]
        this.touch.y2=firstTouch.pageY
        let delta=(this.touch.y2-this.touch.y1)/ANCHOR_HEIGHT//y轴上的偏移
        let anchorIndex=parseInt(this.touch.anchorIndex)+delta
      },
      //实时获取到scrolly，现在求到底落在那个位置
      scroll(pos){
          this.scrollY=pos.y
      },
      //得到滑动后菜单滚动的位置
      _scrollTo(index){
          //scrollToElement该函数第二个参数是说是否需要有动画的效果
        //这里的判断就是因为当到右边菜单的最顶部的时候，点击没有效果，所以这时候就应该直接return掉
        if(!index&&index!==0){
          return
        }
        //处理index的边界情况，因为onShortcutTouchMove事件一直在执行，所以会对计算scrollY有干扰
        if(index<0){
          index=0
        }else if(index>this.listHeight.length-2){
          index=this.listHeight.length-2
        }
        //因为这个时候scrollY监听不到变化，所以必须手动的添加变化
        this.scrollY=-this.listHeight[index]
        //scrollToElement也需做边界处理，但是better-scroll已经帮我们做了处理
        this.$refs.listview.scrollToElement(this.$refs.listGroup[anchorindex],0)
      },
      //发生变化的高度,判断右边菜单滑动时，目录栏落在那个空间
      _calculateHeight(){
         this.listHeight=[]
        const list=this.$refs.listGroup
        let height=0
        this.listHeigt.push(height)
        for(let i=0;i<list.length;i++){
           let item=list[i]
          height+=item.clientHeight
          this.listHeight.push(height)
        }
      },
      watch:{
          data(){
            //一般都有一个延迟，这样不同的浏览器，手机都回有个兼容性的问题
            setTimeout(()=>{
              this._calculateHeight()
            },20)
          },
        scrollY(newY){
            //这里因为是向上滚动，所以要弄成-newY，这里是通过比较一个列表的上限和下限是落在那个区间上
            const listHeight=this.listHeight
          //当滚动到顶部的时候，newY》0
          if(newY>0){
              this.current=0
            return
          }
          //在中间部分滚动
          for(let i=0;i<listHeight.length;i++){
              let height1=listHeight[i]
            let height2=listHeight[i+1]
            if(-newY>=height1&&-newY<height2){
                this.currentIndex=i
              this.diff=height2+newY
              return
            }

          }
          //当滚动在底部的时候，且-newY大于最后一个元素的上线

          this.currentIndex=listHeight.length-2
        },
        diff(newVal){
            let fixedTop=(newVal>0&&newVal<TITLE_HEIGHT )? newVal-TITLE_HEIGHT:0
          //这里有一个判断，当不需要操作的时候就不操作，这样可以提高性能
          if(this.fixedTop===fixedTop){
              return
          }
          //修改偏移
          this.fixedTop=fixedTop
          this.$refs.fixed.style.transform='translate3d(0,${fixedTop}px,0)'

        }
      },
      components:{
          Scroll,
          loading
      }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)

</style>
