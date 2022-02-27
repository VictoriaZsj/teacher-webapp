<template>
  <div class="stationList">
    <el-form :inline="true" :model="form" >
      <el-form-item label="岗位名称">
        <el-input v-model="form.stationName" placeholder="岗位ID/岗位名称"></el-input>
      </el-form-item>
      <el-form-item label="岗位状态">
        <el-select v-model="form.stationState" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="正常" value="1"></el-option>
          <el-option label="停用" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">搜索</el-button>
      </el-form-item>
    </el-form>
    <div class="batchBtn">
      <el-button plain  @click="addTag" v-if="checkPermission('tea:addStation')">+ 添加岗位</el-button>
      <el-button plain @click="countTag" v-if="checkPermission('tea:stationCount')">岗位配比</el-button>
       <el-button plain @click="copyTag" v-if="checkPermission('tea:copyStation')">复制岗位</el-button>
    </div>
     <el-table
      :data="tableData"
      stripe
      style="width: 100%">
      <el-table-column
        prop="stationNumber" align="center"
        label="岗位编号"
        width="180">
      </el-table-column>
      <el-table-column
      align="center"
        prop="stationName"
        label="岗位名称"
        width="180">
      </el-table-column>
      <el-table-column
      align="center"
        label="岗位配置" >
        <template scope="prop">
             <el-button type="text" size="mini" @click="showTag(prop.row)">具体配置</el-button>
          </template>
      </el-table-column>
      <el-table-column
      align="center"
        label="岗位要求">
        <template scope="prop">
             <el-button type="text" size="mini" @click="showTag(prop.row)">具体要求</el-button>
          </template>
      </el-table-column>
      <el-table-column
        prop="stationCount"
        align="center"
        label="岗位配额">
      </el-table-column>
      <el-table-column
        prop="stationRateDesc"
        align="center"
        label="岗位配比" :render-header="renderHeaderFun">
      </el-table-column>
      <!-- <el-table-column
        prop="dateFrom"
        align="center"
        label="统计时间">
      </el-table-column> -->
      <el-table-column
        prop="remark"
        align="center"
        label="备注">
      </el-table-column>
      <el-table-column
        prop="stationState"
        align="center"
        label="岗位状态">
        <template scope="prop">
          {{prop.row.stationState==0?'停用':'正常'}}
        </template>
      </el-table-column>
      <el-table-column
       label="操作"
          width="230"
          align="center">
        <template scope="prop">
          <el-button type="text" @click="stateHandle(prop.row.id)" size="mini" v-if="checkPermission('tea:putOnStation')">{{prop.row.stationState==0?'上架':'下架'}}</el-button>
          <el-button type="text" @click="editTag(prop.row)" size="mini" v-show='prop.row.stationState==0' v-if="checkPermission('tea:editStation')">编辑</el-button>
          <el-button type="text" @click="openRecord(prop.row.stationNumber)" size="mini">标签版本记录</el-button>
        </template>
      </el-table-column>
  </el-table>
  <div >
    <el-pagination
      style="text-align:center"
      background
       :current-page="form.pageNo"
       :page-sizes="[10, 20, 30, 40,100]"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      layout="total,prev, pager, next,jumper"
      :total="total">
    </el-pagination>
  </div>
    <tea-station-tag  ref="teaStationTag" @success="success" ></tea-station-tag>
    <el-dialog
      title="配置岗位比例"
      v-model="countVisible"
      :before-close="handleClose">
      <p style="color:red">注意：可直接设置岗位配额，上架后，系统自动计算岗位配比=配额份数/配额份数之和*100%</p>
      <br>
      <el-table
        :data="tableData_stationCount" border
        style="width: 100%">
        <el-table-column
          :prop="item.prop"
          :label="item.label"
          v-for="(item,index) in config" :key="index">
        </el-table-column>
        <el-table-column prop="item.stationCount" label="岗位配额">
          <template scope="prop">
            <div @mouseover='handleMouseOver(prop.row)' @mouseout='prop.row.isMouse=false'>
            <el-input v-model="prop.row.stationCount" style="width:100%;padding-right:=15px" :ref="prop.row.stationNumber"
              placeholder="请输入岗位配额" @change="handleChange($event,prop.row)" @blur='onBlur(prop.row)' @focus='onFocus(prop.row)'></el-input >
                <img class="edit" v-show="prop.row.isMouse&&prop.row.isEdit" src='../../../src/images/edit.jpg' @click="getFocus(prop.row.stationNumber)"></img>
                <img class="edit" v-show="prop.row.stationCount!=''&&prop.row.isMouse&&!prop.row.isEdit" @click='saveStationCount(prop.row)' src='../../../src/images/save.jpg'></img>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
      style="text-align:center"
      background
       :current-page="pageNo_count"
       :page-sizes="[10, 20, 30, 40,100]"
      @size-change="handleSizeChange3"
      @current-change="handleCurrentChange3"
      layout="total,prev, pager, next,jumper"
      :total="total_count">
    </el-pagination>
    </el-dialog>


     <el-dialog
      title="岗位变更记录"
      v-model="logVisible"
      width="30%"
      :before-close="handleClose">
      <el-table
        :data="tableData_log"
        border
        style="width: 100%">
        <el-table-column
          align="center"
          :prop="item.prop"
          :label="item.label"
         v-for="(item,key) in config2" :key="key">
        </el-table-column>
       <el-table-column
        align="center"
          label="详情">
          <template scope="prop">

            <el-button type='text' v-if='prop.row.operateType!=1' @click="getDetail(prop.row)">变更详情</el-button>
            <span v-else>{{prop.row.operateContent}}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
      style="text-align:center"
      background
       :current-page="pageNo_log"
       :page-sizes="[10, 20, 30, 40,100]"
      @size-change="handleSizeChange2"
      @current-change="handleCurrentChange2"
      layout="total,prev, pager, next,jumper"
      :total="total_log">
    </el-pagination>
    </el-dialog>
  </div>
</template>

<script>

import teaStationTag from './component/teaStationTag'

export default {
  components:{
    teaStationTag
  },
  data() {
    return {
      currentStationNumber:'',
      total_count:0,
      pageNo_count:0,
      pageSize_count:10,
      countVisible:false,
      logVisible:false,
      config:[
        {
          prop:'stationNumber',
          label:' 岗位编号'
        },
        {
          prop:'stationName',
          label:' 岗位名称'
          }
      ],
      config2:[
        {
          prop:'createTime',
          label:' 操作时间'
        },
        {
          prop:'createdBy',
          label:' 操作人'
          },
          {
          prop:'operateName',
          label:' 操作名称'
          }
      ],
      form:{
        stationName:'',
        stationState:'',
        pageNo:1,
        pageSize:10,
        stationList:[]
      },
      tableData:[],
      tableData_stationCount:[],
      total:0,
      tableData_log:[],
      pageNo_log:1,
       pageSize_log:10,
       total_log:0
    };
  },
  mounted(){
    this.getData();
  },
  methods: {
    renderHeaderFun(h, { column, $index }) {
      const { label } = column;
      return h('span', {}, [
        h('span', {}, label),
        h(
          'el-popover',
          {
            props: {
              placement: 'right',
              width: '200',
              trigger: 'click',
              'popper-class': 'table-head-popper',
            },
          },
          [
            h(
              'div',
              {},
              '配额份数/配额份数之和*100%（只对岗位状态=正常的进行计算）'
            //   headTip[label].map(item => {
            //     return h('p', {}, item);
            //   })
            ),
            h('i', { slot: 'reference', class: 'iconfont icon-wen' }, ''),
          ]
        ),
      ]);
    },
    getDetail(row){
      this.$refs.teaStationTag.init('show',row,true)
    },
    getFocus(stationNumber){

      this.$refs[stationNumber].$el.querySelector('input').focus()
    },
    getStationCountList(){
       this.$Fetch({
            url: `/api/teacherStation/stationCountList`,
            method: 'get',
            params:{
              pageNo:this.pageNo_count,
              pageSize:this.pageSize_count
            }
        }).then((res) => {
           this.tableData_stationCount=res.data.list
           this.total_count=res.data.total
           this.tableData_stationCount.forEach(item=>{
                      this.$set(item,'isEdit',true)
                      this.$set(item,'isMouse',false)
                      this.$set(item,'isBlur',true)
                  })
        }).catch(err=>{
            this.$Message.error('err:'+err)
        })
    },
    onBlur(row){
                row.isBlur=true
            },
    onFocus(row){
        row.isBlur=false
    },
    handleMouseOver(row){
        row.isMouse=true;
    },
    saveStationCount(row){
        this.$Fetch({
            url: `/api/teacherStation/updateStationCount`,
            method: 'post',
            data: {
              "stationCount": row.stationCount,
              "stationNumber": row.stationNumber,
              "version": row.version
            }
        }).then((res) => {
            const { code, data, message } = res;
            row.isEdit=true
            this.$Message.success('保存成功')

        }).catch(err=>{
            this.$Message.error('err:'+err)
        })
    },
    handleChange(val,row){
        if(val){
            row.isEdit=false
        }else{
            row.isEdit=true
        }


    },
    stateHandle(id){
       this.$Fetch({
        url: `/api/teacherStation/changeState`,
        method: "post",
        data:{
          id:id
        },

      })
        .then(result => {
          this.getData()
        })
        .catch(message => {
          this.$Message.error(
            message && message.length > 100 ? "接口出错" : message
          );
        });
    },
    handleClose(){

    },
    openRecord(stationNumber){
      this.currentStationNumber=stationNumber;
      this.logVisible=true
       this.$Fetch({
        url: `/api/teacherStation/logs`,
        method: "get",
        params:{
          stationNumber:stationNumber,
          pageSize:this.pageSize_log,
          pageNum:this.pageNo_log
        }
      })
        .then(result => {

          this.tableData_log=result.data.list

          this.total_log=result.data.total
        })
        .catch(message => {
          this.$Message.error(
            message && message.length > 100 ? "接口出错" : message
          );
        });
    },
     success(){
        this.getData()
     },
    editTag(row){
        this.$refs.teaStationTag.init('edit',row)
    },
    showTag(row){
        this.$refs.teaStationTag.init('show',row)
    },

    addTag(){
        this.$refs.teaStationTag.init('add')
    },

    copyTag(){
        this.$refs.teaStationTag.init('copy')
    },
    countTag(){
        this.countVisible=true;
        this.getStationCountList()
    },
    handleSizeChange(pageSize) {
        this.form.pageSize = pageSize;
        this.form.pageNo = 1;
        this.getData();
      },
      handleCurrentChange(currentPage) {
        this.form.pageNo = currentPage;
        this.getData();
      },
      handleSizeChange2(pageSize) {
        this.pageSize_log = pageSize;
        this.pageNo_log = 1;
        this.openRecord(this.currentStationNumber);
      },
      handleCurrentChange2(currentPage) {
        this.pageNo_log = currentPage;
        this.openRecord(this.currentStationNumber);
      },
      handleSizeChange3(pageSize) {
        this.pageSize_count = pageSize;
        this.pageNo_count = 1;

        this.getStationCountList();
      },
      handleCurrentChange3(currentPage) {
        this.pageNo_count= currentPage;
        this.getStationCountList();
      },
    onSubmit(){
      this.getData();
    },
    checkPermission(permissionName){
        return ((this.$store.getters.permissionList || []).indexOf(permissionName)>-1);
    },
    getData(){
      this.$Fetch({
        url: "/api/teacherStation/stationListPage",
        method: "get",
        params:this.form
      })
        .then(result => {
          this.tableData =result.data.list
          this.total=result.data.total
        })
        .catch(message => {
          this.$Message.error(
            message && message.length > 100 ? "接口出错" : message
          );
        });
    },
    edit(id){
      this.$refs.editComponent.init(id,'edit');
    },
    show(id){
      // this.$refs.editComponent.init(id,'show');
    },
    filterTime(val){
     return this.$DateTool.format(val, "yyyy-MM-dd HH:mm:ss")
    }
  }
};
</script>
<style lang="less" >

.stationList {
  .table-head-popper {
    font-size: 14px;
    color: #fff;
    background: rgba(0, 0, 0, 0.8);
    text-align: justify;
    &.el-popover .popper__arrow::after {
      border-right-color: rgba(0, 0, 0, 0.8);
      border-left-color: rgba(0, 0, 0, 0.8);
    }

  }
  .batchBtn{
    text-align: right;
    margin-bottom: 10px;
  }
  .icon-wen:before {
      content: "\E71F";
      color: #409eff;
      font-size:14px
  }
  .el-dialog__body{
      background-color: #ffffff;
    }
  background-color: #fff;
  padding: 20px;
  table {
    border: 1px solid #f1f1f1;

    tr {
      td,
      th {
        height: 40px;
        text-align: center;
        border-bottom: 1px solid #f1f1f1;
        border-right: 1px solid #f1f1f1;
      }
      th {
        background-color: #f4f5f5;
      }
      .des-box{
        margin:0 auto;
        width:200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .edit{
      position: absolute;
      right: 68px;
      top:14px;
      width: 20px;
      height: 20px;
      cursor: pointer;
      margin-right: 3px;
      z-index: 0;
  }
  .stationCountStyle{
    overflow: hidden;
    word-break: break-all;word-wrap: break-word;
  }
}
</style>
