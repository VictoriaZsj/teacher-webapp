<template>
  <el-dialog title="查看链接" v-model="dialogVisible" width="100%">
    <el-row style="overflow:hidden;">
      <el-col :span="4">兼职链接：</el-col>
      <el-col :span="16" class="linkbox">{{url.parttimeShareUrl}}</el-col>
      <el-col :span="4"><el-button size="small" type="text" @click="getUrl(url.parttimeShareUrl,'兼职链接')">下载邀请码</el-button></el-col>
    </el-row><br>
    <el-row style="overflow:hidden;">
      <el-col :span="4">全职链接：</el-col>
      <el-col :span="16" class="linkbox">{{url.fulltimeShareUrl}}</el-col>
      <el-col :span="4"><el-button size="small" type="text" @click="getUrl(url.fulltimeShareUrl,'全职链接')">下载邀请码</el-button></el-col>
    </el-row><br>
    <el-row style="overflow:hidden;">
      <el-col :span="4">校招全职的链接：</el-col>
      <el-col :span="16" class="linkbox">{{url.schoolFulltimeShareUrl}}</el-col>
      <el-col :span="4"><el-button size="small" type="text" @click="getUrl(url.schoolFulltimeShareUrl,'校招全职的链接')">下载邀请码</el-button></el-col>
    </el-row><br><br>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      url: {}
    };
  },
  methods: {
    show(row) {
      this.dialogVisible = true;
      const {
        fulltimeShareUrl,
        parttimeShareUrl,
        schoolFulltimeShareUrl
      } = row;
      this.url = { fulltimeShareUrl, parttimeShareUrl, schoolFulltimeShareUrl };
    },
    getUrl(imgurl,imgname) {
      let _this = this;
      const url = `/api/zm-teacher-recruit-web/api/agentMember/genarateQRCode`;
      let xhr = new XMLHttpRequest();
      xhr.open("POST", url);
      xhr.responseType = "blob";
      _this.progressState = true;
      xhr.onprogress = function(e) {};
      xhr.onload = function() {
        _this.progressState = false;
        if (this.status === 200) { 
          let blob = new Blob([this.response], {
              type: "application/force-download"
            }),
            fileName = `${imgname}.jpg`;
          _this.downFile(blob, fileName);
        }
      };
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify({url:imgurl}));
    },
    downFile(blob, fileName) {
      var link = document.createElement("a");
      if (window.webkitURL.createObjectURL) {
        link.href = window.webkitURL.createObjectURL(blob);
      } else {
        link.href = window.URL.createObjectURL(blob);
      }
      link.download = fileName;
      document.body.appendChild(link);
      link.style.display = "none";
      link.click();
      window.URL.revokeObjectURL(link.href);
    },
  }
};
</script>

<style lang='less' scoped>
.linkbox{
  word-wrap:break-word;
}
</style>
