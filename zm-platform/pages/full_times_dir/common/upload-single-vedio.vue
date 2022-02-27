<template>
    <div>
        <el-dialog title="上传老师视频" v-model="dialogVisible" width="530px"
            @close="handleClose" :close-on-click-modal="false">
            <upload-common :action="action" :limit="1" :uploadData="uploadData" @callback="callback" ref="uploadCommon" />
            <div slot="footer" class="dialog-footer">
                <!-- <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="reset">重置</el-button>
                <el-button type="primary" @click="sure">确定</el-button> -->
                <el-button @click="handleClose">关 闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import uploadCommon from './uploadCommon.vue'
export default {
    data () {
        return {
            uploadData: {
                name: null,
                type: '10',
                teaId: ''
            },
            dialogVisible: false,
            responesList: [],
            action: `/api/teacher-web/api/uploadTeacherFile/singleFileStream`
        }
    },
    methods: {
        handleClose () {
            this.$refs.uploadCommon.reset()
            this.dialogVisible= false
        },
        sure () {
            if (this.responesList.length===0) {
                this.$Message.warning(`上传文件不能为空`);
                return
            }
        },
        callback (list, res) {
            if (res.code==='0') {
                this.responesList = list
                this.$Message.success(`${res.message}`);
                this.$emit('uploadSuccess', list)
            } else {
                this.$refs.uploadCommon.reset()
                this.$Message.error(res.message)
            }
        },
        reset () {
            this.$refs.uploadCommon.reset()
            this.responesList = []
        }
    },
    components: { uploadCommon }
    
}
</script>
<style>
</style>