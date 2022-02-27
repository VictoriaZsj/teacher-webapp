<template>
  <el-dialog
    :title="title || '表单自定义'"
    v-model="dialogVisible"
    @open="open"
    custom-class="transfer-form"
    width="100%">
    <div class="wrap">
      <div class="left">
        <h3>{{leftTitle || ''}}</h3>
        <section>
          <div
            class="checkbox-wrap"
            v-for="(item, i) in sourceList"
            :key="item.title"
          >
            <div class="top">
              <span class="title">{{item.groupName}}</span>
              <check-box
                v-show="showAll"
                :check="item"
                @change="handleSelectAll($event, i)"
              ></check-box>
            </div>
            <check-box
              v-for="(child, j) in item.nodeList"
              :key="child.value"
              :ref="`checkBox_${i}_${j}`"
              :check="child"
              :width='100'
              :isMax='isMax'
              :disabled="disabledArr.includes(child.value)"
              border
              @change="handleChecked($event)"
            ></check-box>
          </div>
        </section>
      </div>
      <div class="mid">
        <i class="el-icon-arrow-right"></i>
      </div>
      <div class="right">
        <h3>{{rightTitle || ''}}</h3>
        <section>
          <draggable v-model="selectedList">
            <transition-group>
              <el-tag
                v-for="item in selectedList"
                :key="item.text"
                :closable="!disabledArr.includes(item.value)"
                @close="handleClose(item)"
              >{{item.text}}</el-tag>
            </transition-group>
          </draggable>
        </section>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSave">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import draggable from 'vuedraggable'
import ElDialog from '../../dialog';
import ElTag from '../../tag';
import ElButton from '../../button';
import CheckBox from './check-box.vue';

export default {
  props: {
    titleArr: Array,
    leftList: Array,
    rightList: Array,
    disabledArr: {
      type: Array,
      default: [],
    },
    maxNum: {
      type: Number,
      default: 1000,
    },
    showAll: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      dialogVisible: false,
      sourceList: [],
      selectedList: [],
    }
  },
  computed: {
    title() {
      return this.titleArr[0] || '';
    },
    leftTitle() {
      return this.titleArr[1] || '';
    },
    rightTitle() {
      return this.titleArr[2] || '';
    },
    isMax() {
      return this.selectedList.length === this.maxNum;
    }
  },
  methods: {
    open() {
      this.sourceList = this.leftList.map(item => {return item});
      this.selectedList = this.rightList.map(item => {return item});
      const sourceList = this.sourceList;
      const selectedList = this.selectedList;
      for (const i in sourceList) {
        sourceList[i].i = Number(i);
        for (const j in sourceList[i].nodeList) {
          sourceList[i].nodeList[j].checked = false;
          // 设置选中项
          for (const k in selectedList) {
            if (selectedList[k].value === sourceList[i].nodeList[j].value) {
              sourceList[i].nodeList[j].checked = true;
              selectedList[k].i = Number(i);
              selectedList[k].j = Number(j);
            }
          }
          sourceList[i].nodeList[j].i = Number(i);
          sourceList[i].nodeList[j].j = Number(j);
        }
        this.checkSelectAll(sourceList[i]);
      }
      // console.log('open', this.sourceList);
    },
    // 全选
    handleSelectAll(item, i) {
      const list = this.sourceList[item.i].nodeList;
      for(const j in list) {
        if (item.checked) {
          if (!list[j].checked && !this.disabledArr.includes(list[j].value)) {
            this.$refs[`checkBox_${i}_${j}`][0].check.checked = true;
            this.selectedList.push(list[j]);
          };
        } else {
          if (list[j].checked && !this.disabledArr.includes(list[j].value)) {
            this.$refs[`checkBox_${i}_${j}`][0].check.checked = false;
            this.removeNode(list[j]);
          }
        }
      }
    },
    // 校验全选
    checkSelectAll(item) {
      const allLength = this.sourceList[item.i].nodeList.length;
      const selectedLength = this.sourceList[item.i].nodeList.filter(node => node.checked).length;
      this.sourceList[item.i].checked = allLength === selectedLength;
    },
    // 左侧操作
    handleChecked(item) {
      // console.log(item, this.sourceList[item.i]);
      this.checkSelectAll(item);
      if (item.checked) {
        this.selectedList.push(item);
      } else {
        this.removeNode(item);
      }
    },
    // 右侧操作
    handleClose(item) {
      // console.log(item, this.sourceList[item.i]);
      this.sourceList[item.i].nodeList[item.j].checked = false;
      this.checkSelectAll(item);
      this.removeNode(item);
    },
    // 移除选中项
    removeNode(item) {
      for(const i in this.selectedList) {
        if (this.selectedList[i].text === item.text) {
          this.selectedList.splice(i, 1);
          return
        }
      }
    },
    // 保存
    handleSave() {
      this.selectedList.forEach(item => {
        if (item.checked) delete item.checked;
        if (item.i || item.i === 0) delete item.i;
        if (item.j || item.j === 0) delete item.j;
      });
      this.$emit('save', this.selectedList);
    },
  },
  components: {
    draggable,
    ElDialog,
    CheckBox,
    ElTag,
    ElButton,
  }
}
</script>

<style lang="scss">
.transfer-form {
  width: 70%;
  .el-dialog__body {
    background: #fff;
  }
  .el-dialog__footer {
    background: #fff;
  }
  .el-tag {
    cursor: pointer;
    margin: 0 10px 10px 0;
    background: #fff;
    color: #409eff;
    border-color: #409eff;
  }
}
</style>

<style lang="scss" scoped>
.wrap {
  display: flex;
  align-items: center;
  .left,.right {
    flex: 1;
    h3 {
      margin: 0 0 10px;
      font-size: 14px;
      font-weight: 500;
    }
    section {
      padding: 10px;
      height: 500px;
      overflow-y: auto;
      border: 1px solid #eee;
      border-radius: 2px;
      .checkbox-wrap {
        margin-top: 10px;
        .top {
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
          .title {
            font-size: 14px;
            font-weight: 500;
          }
        }
      }
    }
  }
  .mid {
    margin: 0 5px;
    display: inline-block;
    font-size: 20px;
    color: #409EFF;
  }
}
</style>