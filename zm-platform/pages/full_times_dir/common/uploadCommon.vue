<template>
    <div class="uploadth ff-upload-2">
        <!-- :before-remove="beforeRemove" -->
        <!-- 注意: FfUpload采用elementUi 2.9.1上传组件, 如有api上面的问题，请参考element-ui-2.9.1___upload -->
        <el-upload class="upload-demo" ref="upload" :data="uploadData"
            :action="action"
            :on-exceed="handleExceed"
            :on-remove="handleRemove"
            :before-upload="beforeUpload"
            :on-success="handleSuccess"
            :file-list="fileList"
            :limit="limit"
            multiple>
            <span v-if="isButton">
                <el-button type="primary" :disabled="overLimit">上传附件</el-button> <span style="font-size: 12px;">{{tipsComputed}}</span>
            </span>
            <span v-else>
                <span class="Cf27274"><span v-if="!overLimit" class="el-icon-upload"> 上传附件</span> </span>
                <span slot="tip" class="el-upload__tip"><span v-if="overLimit" class="el-icon-upload"> 上传附件</span> {{tipsComputed}}</span>
            </span>
        </el-upload>
    </div>
</template>

<script>
export default {
    props: {
        isButton: {
            default: true,
            type: Boolean
        },
        limit: {
            default: 5,
            type: Number
        },
        bigSize: {
            default: 20,
            type: Number
        },
        tips: {
            default: '',
            type: String
        },
        aboutType: {
            type: Array,
            default () {
                return ['mp4']
                // return ['gif', 'jpeg', 'jpg', 'png', 'bmp', 'doc', 'docx', 'ppt', 'pdf', 'txt',
                // 'pptx', 'xls', 'xlsx', 'mp4', 'ogv', 'webm', 'flv', 'wmv', 'mp3', 'oga', 'ogg']
            }
        },
        action: {
            default: "/api/teacher-web/api/uploadTeacherFile/singleFileStream",
            type: String
        },
        uploadData: {
            default: {
                name: null
            },
            type: Object
        }
    },
    components: {},
    data () {
        return {
            // action: `https://portal-test.zmlearn.com/api/teacher-web/api/uploadTeacherFile/singleFileStream`,
            fileList: []
        }
    },
    computed: {
        overLimit () {
            return this.fileList.length >= this.limit
        },
        tipsComputed () {
            return (this.tips==='') ? `(最多上传${this.limit}个附件, 单个文件最大${this.bigSize}M)` : this.tips
        }
    },
    methods: {
        reset () {
            this.fileList = []
        },
        handleRemove(file, fileList) {
            this.fileList = fileList;
            this.$emit('callback', fileList);
        },
        handleExceed(files, fileList) {
            this.$Message.warning(`当前限制选择 ${this.limit} 个文件`);
        },
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${ file.name }？`);
        },
        beforeUpload (file) {
            const filetype = file.name.substring(file.name.lastIndexOf('.') + 1);
            const isType = this.aboutType.includes(filetype)
            const isSize = (file.size / 1024 / 1024) < this.bigSize;
            if (!isType) {
                this.$Message.error('上传仅支持mp4文件格式')
                return false
            }
            if (!isSize) {
                this.$Message.error(`上传文件大小不能超过${this.bigSize}MB!`);
            };
            this.uploadData.name = file.name
            return isType && isSize;
        },
        handleSuccess (response, file, fileList) {
            let arr = []
            for (let item of fileList) {
                if (item.response && item.response.data) {
                    arr.push(item.response.data)
                }
            }
            this.fileList = fileList;
            this.$emit('callback', arr, response);
        }
    }
}
</script>
<style lang="less" scoped>
.uploadth {
    .Cf27274{
        font-size: 12px;
        color: #f27274;
    }
    .Cfb3b2b2{
        font-size: 12px;
        color: #b3b2b2;
    }
}
</style>
