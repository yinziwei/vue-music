<template>
    <div ref="wrapper">
      <slot></slot>
    </div>
</template>

<script>
  import BScroll from 'better-scroll'
    export default {
        name: "scroll",
      props:{
          probeType:{
            type:Number,
            default:1
          },
        click:{
            type:Boolean,
            default:true,

        },
        data:{
            type:Array,
          default:null
        }
      },
      //监听滚动事件
      listenScroll:{

      },
      mounted(){
          setTimeout(()=>{
            this._initScroll()
          },20)

      },
      methods:{
          _initScroll(){
            if(!this.$ref.wrapper){
              return
            }
            this.scroll=new BScroll(this.$ref.wrapper,{
              probeType:this.probeType,
              click:this.click
            })
            if(this.listenScroll){
              let me=this//因为这里的this默认只想scroll，所以要保留this，使实例能派发事件
              this.scroll.on('scroll',(pos)=>{
                this.$emit('scroll',pos)//派发这个滚动那个参数
              })
            }
          },
        enable(){
            this.scroll&&this.scroll.enable()
        },
        disable(){
          this.scroll&&this.scroll.disable()
        },
        //命令式刷新
        refresh(){
            this.scroll&&this.scroll.refresh()
        }
      },
      scroll(){
          this.scroll && this.scrollTo.apply(this.scroll,arguments)
      },
      scrollToElement(){
          this.scroll && this.scrollToElemenr.apply(this.scroll,arguments)
      },
      //自动刷新
      watch:{
          data(){
        setTimeout(()=>{
          this.refresh()
        },20)
          }
      }
    }
</script>

<style scoped>

</style>
