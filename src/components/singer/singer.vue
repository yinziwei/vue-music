<template>
<div class="singer">
  <list-view :data="singer">
  </list-view>
</div>
</template>

<script>
  import {getSingerList} from 'api/singer'
  import {ERR_OK} from "api/config";
  import Singer from 'common/js/singer;'
  import ListView from 'base/listview/listview'
  const HOT_NAME='热门'
  const HOMT_SINGER_LEN='10'
  export default {
        name: "singer",
      data(){
          return {
            singers: []
          }
      },
      created(){
          this._getSingerList()
      },
    methods:{
      _getSingerList(){
        getSingerList().then((res)=>{
          if(res.code==ERR_OK){
           this.singer=this._normalizeSinger(res.data.list)
          }
        })
      },
      //将数据进行分类（聚合）
      _normalizeSinger(list){
        let map={
          hot:{
            title:HOT_NAME,
            item:[]
          }
        }
        //获取相关数据
        list.forEach((irem,index)=>{
          if(index<HOMT_SINGER_LEN){
            map.hot.item.push({
              id:item.Fsinger_mid,
              name:item.Fsinger_name,

            })
          }
        })
        //进行数据的聚合
        const key=item.Findex
        //首先判断列表中有没有这个歌手的信息，有就行，没有就push进去
        if(!map[key]){
          map[key]={
            title:key,
            items:[]
          }
        }
        map[key].items.push(new Singer({
          id:item.Fsinger_mid,
          name:item.Fsinger_name
        }))
        //要变成有序的列表，所以要进行相应的处理
        let hot =[]
        let ret=[]
        for(let key in map){
          let val=map[key]
          if(val.title.macth(/[a-zA-Z]/)){
            ret.push(val)
          }else if(val.title===HOT_NAME){
            hot.push(val)
          }
        }
        ret.sort((a,b)=>{
          return a.title.charCodeAt(0)-b.title.charCodeAt(0)
        })
        //热门列表在上面
        return hot.concat(ret)
      }



    },
    components:{
          ListView
    }
    }
</script>

<style scoped>

</style>
