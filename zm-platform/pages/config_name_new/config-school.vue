<template>
  <div class="config-school">
    <div class="tabs">
      <p
        :class="activeIndex === index ? 'active': ''"
        v-for="(item, index) in district"
        :key="index"
        @click="handleClick(index, item)"
      >{{item.itemName}}</p>
    </div>
    <div class="school-container">
      <div class="school-item">
        <div
          v-for="(item, index) in schoolItems"
          :key="index"
          :class="item.choose ? 'selected': ''"
          @click="handlerSelectSchool(index, item)"
        >
          <span>{{item.lable}}</span>
        </div>
      </div>
    </div>
    <el-dialog
      title="新增学校"
      :modal="modal"
      size="small"
      top="5%"
      v-model="addModel"
      class="parttime-form"
      @close="handlerCancle"
    >
      <el-form
        ref="form"
        :model="schoolForm"
        label-width="80px"
        :label-position="labelPosition"
        size="small"
      >
        <el-form-item label="学校名称">
          <div v-for="(item, index) in schoolForm.schoolName" :key="index">
            <el-input
              v-model="schoolForm.schoolName[index]"
              placeholder="最多50字"
              style="width:190px;"
            ></el-input>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handlerCancle">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    entryConfigId: {
      type: Number,
      default: null
    },
    bu: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      activeIndex: 0,
      modal: false,
      areaCode: "",
      area: "",
      district: [],
      schoolItems: [],
      addModel: false,
      schoolForm: {
        region: "",
        schoolName: [""]
      },
      labelPosition: "right",
      newSchoolVal: ""
    };
  },
  methods: {
    /**
     * 获取区域数据源
     */

    async getDistrictData() {
      await this.$Fetch({
        url: `/api/dict/getDictByGroupCode?groupCode=MAP_AREA&bu=${this.bu}`,
        method: "post"
      })
        .then(res => {
          const { code, data, message } = res;
          if (code === "0" && data) {
            this.district = data;
            this.areaCode = data[0]["itemCode"];
            this.area = data[0]["itemName"];
            if (this.areaCode) this.getSchoolData();
          } else {
            this.$Message({ message });
          }
        })
        .catch(err => {
          this.$Message({ message: err });
        });
    },

    /**
     * 获取对应区域下的学校
     */

    async getSchoolData() {
      await this.$Fetch({
        url: "/api/zm-teacher-recruit-web/api/1.0.0/recruitEntryConfig/getEntryConfig",
        method: "post",
        data: {
          entryConfigId: this.entryConfigId,
          entryConfigType: 1,
          bu: this.bu,
          areaCode: this.areaCode
        }
      })
        .then(res => {
          const { msgCode, msgContent, data } = res;
          if (msgCode === "200" && data) {
            this.schoolItems = data.option;
          } else {
            this.$Message({ msgContent });
          }
        })
        .catch(err => {
          this.$Message({ message: err });
        });
    },
    /**
     * 选择tabs
     */
    handleClick(index, item) {
      this.activeIndex = index;
      this.areaCode = item.itemCode;
      this.area = item.itemName;
      this.getSchoolData();
    },
    /**
     * 选择学校
     */
    handlerSelectSchool(index, item) {
      item.choose = !item.choose;
      this.schoolItems[index] = item;
    },
    /**
     * 新增学校弹出层交互
     */
    handleShowDialog() {
      this.addModel = true;
    },
    /**
     * 删除学校
     */
    handlerClickDele(index) {
      this.schoolItems.splice(index, 1);
    },
    /**
     * 取消新增学校
     */
    handlerCancle() {
      this.schoolForm = {
        region: "",
        schoolName: [""]
      };
      this.addModel = false;
    },
    /**
     * 新增学校调api
     */
    handlerAddSchool(data) {
      this.$Fetch({
        url: "/api/1.0.0/recruitEntryConfig/addSchoolDictionary",
        method: "post",
        data: data
      })
        .then(res => {
          const { code, message, data } = res;
          if (code === "0" && data) {
            this.$Message({
              message,
              duration: 1000,
              onClose: () => {
                this.addModel = false;
                this.schoolItems = [...this.schoolItems, data];
                this.schoolForm.schoolName = [""];
              }
            });
          }
        })
        .catch(err => {
          this.$Message({ message: err });
        });
    },
    /**
     * 确定新增学校
     */
    handleConfirm() {
      let option = {
        areaCode: this.areaCode,
        bu: this.bu,
        lable: this.schoolForm.schoolName[0]
      };
      if (this.schoolForm.schoolName[0]) this.handlerAddSchool(option);
    },
    /**
     * 确认按钮交互
     */
    handlerClickConfirm() {
      this.$Fetch({
        url: "/api/zm-teacher-recruit-web/api/1.0.0/recruitEntryConfig/updateEntryDetailConfig",
        method: "post",
        data: {
          entryConfigId: this.entryConfigId,
          entryConfigType: 1,
          areaCode: this.areaCode,
          area: this.area,
          option: this.schoolItems
        }
      })
        .then(res => {
          const { msgCode, msgContent,data } = res;
          if (msgCode === "200") {
            this.$Message({ message:data });
          }
        })
        .catch(err => {
          this.$Message({ message: err });
        });
    },
    /**
     * 重置数据
     */
    handlerReset() {
      this.activeIndex = 0;
    }
  }
};
</script>

<style scoped>
.tabs {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  border-bottom: 1px solid #d0cdc7;
}
.tabs > p {
  color: #333333;
  font-size: 15px;
  padding: 5px 15px;
}
.tabs > p:hover {
  cursor: pointer;
}
.tabs > p.active {
  color: #007fff;
  border-bottom: 2px solid #007fff;
}
.school-container {
  width: 96%;
  margin: 10px auto;
}
.school-item {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.school-item > div {
  padding: 10px 25px;
  background-color: #d7d7d7;
  margin: 15px 10px 15px 0;
  font-size: 15px;
  position: relative;
}
.school-item > div:hover {
  cursor: pointer;
  /* color: #00B5FF; */
}
.school-item > div.selected {
  background-color: #00b5ff;
  color: #fff;
}
.school-item > div:hover i {
  display: inline-block;
}
.school-item > div > i {
  display: none;
  position: absolute;
  right: -6px;
  top: -8px;
  font-size: 18px;
}
.add-btn {
  margin-left: 20px;
}
</style>