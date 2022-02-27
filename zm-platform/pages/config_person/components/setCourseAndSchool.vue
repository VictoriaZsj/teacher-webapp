<template>
<div>
    <el-dialog :title="'编辑负责'+title" v-model="showDialog" size="small" @close="closeDialog">
        <el-tabs type="border-card">
            <el-tab-pane v-for="(item,index) in tabContent" :key="index" :label="item.label">
                <div v-if="!!item.children">
                    <el-checkbox v-model="checkedAllBtn[item.value]" @change="checkedAll(item.value)">全选</el-checkbox><br><br>
                    <el-checkbox-group v-model="valueList[item.value]" @change="checkedItem($event,item.value,item.children.length)" size="small">
                        <el-checkbox class="checkbox" v-for="item_children in item.children" :label="item_children.label" :key="item_children.label">{{item_children.label}}</el-checkbox>
                    </el-checkbox-group><br><br>
                </div>
                <div class="btnbox">
                    <el-button @click="closeDialog">取消</el-button>
                    <el-button type="primary" @click="sureBtn">确定</el-button>
                </div>
            </el-tab-pane>
        </el-tabs>
    </el-dialog>
</div>
</template>

<script>
import getSchool from '../../../api/select/getSchool';
export default {
    data(){
        return{
            showDialog:false,
            tabContent:[],
            checkedAllBtn:{
                ZM_1_2_1:false,
                ZM_CHILD:false
            },
            valueList:{
                ZM_1_2_1:[],
                ZM_CHILD:[]
            },
            setType:{
                UNIVERSITIES:["chargeOfSchool","schools","学校"],
                RESERVATIONS_COURSE:["chargeOfSubject","subjects","科目"]
            },
            saveValueList:{},
            id:'',
            bu:'',
            code:'',
            title:'',
        }
    },
    methods:{
        async open(code,id){
            this.id = id;
            this.code = code;//学校/科目 code
            this.showDialog = true;
            this.title = this.setType[code][2]
            getSchool({//字典
                page:"config_person",
                params:[{
                    "dictCode": "ZM_BU",
                    "strategy": 1
                },{
                    "dictCode": code,
                    "strategy": 1
                }]
            })
            .then(data => {
                this.tabContent = data.children.filter(item=>{
                    return item.label!=='掌门陪练'
                });
                this.getCommissionerPartTimeConfig();//初始化值
            }).catch(message => {
                this.$Message({
                    message
                });
            });
        },
        getCommissionerPartTimeConfig(){
            this.$Fetch({
                url: '/api/1.0.0/teacherEntryCommissioner/getCommissionerPartTimeConfig?id=' + this.id,
                method: 'get'
            }).then((result) => {
                const _data1 = result.filter(item => {//1对1 初始值
                    return item.bu ==1;
                });
                const _data2 = result.filter(item => {//少儿 初始值
                    return item.bu ==2;
                });
                const key = this.setType[this.code][0];
                let _values_obj = {}; //旧保存 数据
                _values_obj.ZM_1_2_1 = _data1.length>0&&_data1[0][key]&&_data1[0][key]!='' ? _data1[0][key].split(',') : [];//1对1 初始值（=> array）
                _values_obj.ZM_CHILD = _data2.length>0&&_data2[0][key]&&_data2[0][key]!='' ? _data2[0][key].split(',') : [];//少儿 初始值（=> array）

                let _tab_obj = {}; //字典 数据
                this.tabContent.forEach(item => {
                    if(item.value=='ZM_1_2_1') _tab_obj.ZM_1_2_1 = item.children.map(item=>item.label);
                    if(item.value=='ZM_CHILD') _tab_obj.ZM_CHILD = item.children.map(item=>item.label);
                });

                //求交集
                const ZM_1_2_1_value = this.intersectionFun(_tab_obj.ZM_1_2_1,_values_obj.ZM_1_2_1);
                const ZM_CHILD_value = this.intersectionFun(_tab_obj.ZM_CHILD,_values_obj.ZM_CHILD);
                 //-> 判断 初始全选按钮 是否选中
                this.checkedAllBtn.ZM_1_2_1 = ZM_1_2_1_value.length >= _tab_obj.ZM_1_2_1.length;
                this.checkedAllBtn.ZM_CHILD = ZM_CHILD_value.length >= _tab_obj.ZM_CHILD.length;
                 //-> 页面数据
                this.valueList = {
                    ZM_1_2_1:ZM_1_2_1_value,
                    ZM_CHILD:ZM_CHILD_value
                };

                //求差集 保存没有配置出的数据
                // const ZM_1_2_1_save = this.differenceFun(ZM_1_2_1_value,_values_obj.ZM_1_2_1);
                // const ZM_CHILD_save = this.differenceFun(ZM_CHILD_value,_values_obj.ZM_CHILD);
                // this.saveValueList = {ZM_1_2_1_save,ZM_CHILD_save};

            }).catch((error,message) => {
                console.error(error);
                this.$Message({
                    message
                });
            });
        },
        //数组-交集 fun
        intersectionFun(arr1,arr2){
            const arr1_set = new Set(arr1);
            let _value = [];
            arr2.forEach(item=>{
                if(arr1_set.has(item)){
                    _value.push(item);
                }
            });
            return _value;
        },
        //数组-差集 fun
        differenceFun(arr1,arr2){
            const arr1_set = new Set(arr1);
            let _value = [];
            arr2.forEach(item=>{
                if(!arr1_set.has(item)){
                    _value.push(item);
                }
            });
            return _value;
        },
        //选单个
        checkedItem(value,key,length) {
            const newListLength = value.length;
            this.checkedAllBtn[key] = newListLength >= length; //全选按钮 是否选中

            this.valueList[key] = value;
        },
        //全选
        checkedAll(key){
            const checkedAllStatus = this.checkedAllBtn[key];
            let valueList_item = null;
            if(checkedAllStatus){
                const filterData = this.tabContent.filter(item=>{
                    return item.value == key
                });
                valueList_item = filterData[0].children.map(item=>{
                    return item.label
                });
            }else{
                valueList_item = []
            };
            this.valueList[key] = valueList_item;
        },
        //提交
        sureBtn(){
            this.$Fetch({
                url: '/api/1.0.0/teacherEntryCommissioner/editCommissionerPartTimeConfig' ,
                method: 'post',
                data:{
                    commissionerId: this.id,
                    configs: [
                        {
                            [this.setType[this.code][1]]: this.valueList.ZM_1_2_1.join(','),
                            teaBu: "1"
                        },
                        {
                            [this.setType[this.code][1]]: this.valueList.ZM_CHILD.join(','),
                            teaBu: "2"
                        },
                    ]
                }
            }).then((res) => {
                const {message} = res.data;
                this.$Message({
                    message
                });
                this.showDialog = false;
            }).catch(message => {
                this.$Message({
                    message
                });
            });
        },
        //取消
        closeDialog(){
            this.valueList = {
                ZM_1_2_1:[],
                ZM_CHILD:[]
            }
            this. checkedAllBtn = {
                ZM_1_2_1:false,
                ZM_CHILD:false
            },
            this.showDialog = false;
        }
    }
};
</script>

<style lang="less" scoped>
.checkbox{
    margin-right:20px;
}
.btnbox{
    text-align: right;
}
.el-checkbox{
    min-width: 150px;
}
</style>

