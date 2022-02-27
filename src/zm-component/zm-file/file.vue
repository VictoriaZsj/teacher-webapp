<template>
    <div>
      <span style="cursor:pointer;" v-show="fileIDs.length == 0" @click="add()">增加</span>
      <div v-for="(item,index) in fileIDs" class="file-item">
        <input @change="selectFile(item.id,index)" type="file" :id="item.id" value="">
        <span class="filename">{{item.name}}</span>
        <span class="filecontrol" @click="del(item,index)">删除</span>
        <span class="filecontrol" @click="add(item,index)">增加</span>


      </div>
      <span style="color:red;display: block;">注:单个附件大小不可以超过2兆,附件总和不可以超过8兆</span>
    </div>
</template>
<script>
    export default {
        name: 'file',
        data () {
            return {
              fileIDs:[]
            };
        },
        methods:{
          clearData(){
            this.fileIDs = [];
          },
          selectFile(ID,index){
            let file = document.getElementById(ID).files.item(0);
            if(file){
              this.fileIDs[index].name = file.name;
              document.getElementById(ID).style.display="none";
            }
          },
          del(item,index){
              this.fileIDs.splice(index,1);
          },
          add(item,index){
              let _time = new Date().getTime();
              let id = 'file_' + _time;
              this.fileIDs.push({
                  id:id,
                  name:'添加附件'
              });
          }
        }
    };
</script>
<style scoped="">
  .file-item{
    position: relative;
  }
  .file-item input[type='file']{
    opacity: 0;
    position: absolute;
    width:65px;
    cursor: pointer;
  }
  .file-item .filename{
    margin-right: 20px;
    padding: 10px;
    cursor: pointer;
  }
  .file-item .filecontrol{
    margin-right: 20px;
    padding: 10px;
    cursor: pointer;
  }
</style>
