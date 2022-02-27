<!-- 兼职个人报表筛选小插件 -->
<template>
    <div>
        <el-input v-model="searchData.commissionerName" placeholder="XXXXXXX"></el-input>
        <el-button size="mini" type="text" @click="cancel">取消</el-button>
        <el-button type="primary" size="mini" @click="sure">确定</el-button>
    </div>
</template>
<script>
export default {
    name: 'filter-form-data',
    props: {},
    data () {
        return {
            searchData: {
                commissionerName: ''
            }
        }
    },
    methods: {
        cancel () {
            console.log('取消')
        },
        sure () {
            console.log('确定')
        }
    }
}
</script>

