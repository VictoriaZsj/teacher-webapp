<template>
  <div class="train-time-period">
    <div class="search">
      <div class="btns" v-if="activeTab === '1'">
        <div ref="day1" class="active" @click="handleDay(1)">明天</div>
        <div ref="day2" @click="handleDay(2)">后天</div>
      </div>
      <div class="btns" v-else>
        <div ref="day7" class="active" @click="handleDay(7)">下周</div>
        <div ref="day14" @click="handleDay(14)">下下周</div>
      </div>
      <el-date-picker
        class="date"
        v-model="date"
        type="date"
        placeholder="选择日期"
        @change="handleDateChange"
      >
      </el-date-picker>
      <el-button type="primary" class="search-btn" @click="handleSearch"
        >查询</el-button
      >
    </div>
    <div class="tab" :class="{ 'first-tab': activeTab === '1' }">
      <div
        v-for="(item, index) in tabs"
        :key="index"
        class="tab-item"
        :class="{ active: activeTab === item.value }"
        @click="handleClick(item)"
      >
        {{ item.label }}
      </div>
    </div>

    <div
      style="
            padding-top: 40px;
            color: #ccc;
            height: 70%;
            width: 100%;
            text-align: center;
          "
      v-show="
        (activeTab === '1' && !interviewLimitPeriodCountDtoList.length) ||
          (activeTab === '2' && !trainLimitPeriodCountDtoList.length)
      "
    >
      <img src="~zm-images/no-content.png" />
      <p>暂无数据</p>
    </div>

    <div v-if="activeTab === '1'" style="max-height: 372px; overflow: auto;">
      <div
        class="tagData"
        v-for="(item, index) in interviewLimitPeriodCountDtoList"
        :key="index"
      >
        <div class="tag-name">{{ item.name }}</div>
        <div v-if="Array.isArray(item.timeCountLimitDtoList)" class="tag-data">
          <div
            class="tag-date"
            v-for="(child, n) in item.timeCountLimitDtoList"
            :key="n"
          >
            <div class="tag-time">{{ `${child.from}-${child.to}` }}</div>
            <div class="tag-count">
              <span
                :class="child.curCount / child.limit >= 0.9 ? 'color-red' : ''"
                >{{ child.curCount }}</span
              >/{{ child.limit }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="activeTab === '2'">
      <div
        class="tagData"
        v-for="(item, index) in trainLimitPeriodCountDtoList"
        :key="index"
      >
        <div class="tag-name">{{ item.name }}</div>
        <div v-if="Array.isArray(item.timeCountLimitDtoList)" class="tag-data">
          <div
            class="tag-date"
            v-for="(child, n) in item.timeCountLimitDtoList"
            :key="n"
          >
            <div class="tag-time">{{ `${child.from}-${child.to}` }}</div>
            <div class="tag-count">
              <span
                :class="child.curCount / child.limit >= 0.9 ? 'color-red' : ''"
                >{{ child.curCount }}</span
              >/{{ child.limit }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment';
import authMixins from './mixins/auth';

import {
  getInterviewLimitView,
  getTrainLimitView,
} from '../../../api/workbench';

export default {
  name: 'TrainTimePeriod',
  mixins: [authMixins],
  data() {
    return {
      hasData: null,
      interviewLimitPeriodCountDtoList: [],
      trainLimitPeriodCountDtoList: [],
      date: moment()
        .add(1, 'days')
        .locale('zh-cn')
        .format('YYYY-MM-DD'),
      day: 1,
      activeTab: '1',
      tabs: [
        {
          label: '已约面数据',
          value: '1',
        },
        {
          label: '已约培数据',
          value: '2',
        },
      ],
      isHanleDay: false,
    };
  },
  methods: {
    checkPermission(permissionName) {
      return (
        (this.$store.getters.permissionList || []).indexOf(permissionName) > -1
      );
    },
    handleDay(day) {
      this.day = day;
      this.date = moment(new Date())
        .add(day, 'days')
        .locale('zh-cn')
        .format('YYYY-MM-DD');
      this.isHanleDay = true;
    },
    handleDateChange(val) {
      this.date = val;
      this.handleSearch();
    },
    handleSearch() {
      this.controlBtn();
      if (this.activeTab === '1') {
        this.getInterviewLimitViewData({
          targetDate: this.date + ' 00:00:00',
        });
      } else {
        this.getTrainLimitViewData({
          dateType: this.isHanleDay ? 1 : 0,
          targetDate: this.date + ' 00:00:00',
        });
      }
    },
    controlBtn() {
      if ((this.$refs.day1 || this.$refs.day7) && this.isHanleDay) {
        if (this.day === 1) {
          this.$refs.day1.className = 'active';
          this.$refs.day2.className = '';
        } else if (this.day === 2) {
          this.$refs.day1.className = '';
          this.$refs.day2.className = 'active';
        } else if (this.day === 7) {
          this.$refs.day7.className = 'active';
          this.$refs.day14.className = '';
        } else if (this.day === 14) {
          this.$refs.day7.className = '';
          this.$refs.day14.className = 'active';
        }
      }
    },
    getInterviewLimitViewData(params) {
      getInterviewLimitView(params)
        .then(res => {
          if (res.data.code === '0') {
            this.interviewLimitPeriodCountDtoList =
              res.data.data.interviewLimitPeriodCountDtoList || [];
          } else {
            this.$message.warning(res.data.message);
          }
          this.isHanleDay = false;
        })
        .catch(err => {
          this.isHanleDay = false;
        });
    },
    getTrainLimitViewData(params) {
      getTrainLimitView(params)
        .then(res => {
          if (res.data.code === '0') {
            this.trainLimitPeriodCountDtoList =
              res.data.data.trainLimitPeriodCountDtoList || [];
          } else {
            this.$message.warning(res.data.message);
          }
          this.isHanleDay = false;
        })
        .catch(err => {
          this.isHanleDay = false;
        });
    },
    handleClick(item) {
      this.activeTab = item.value;
      if (item.value === '1') {
        this.handleDay(1);
      } else {
        this.handleDay(7);
      }
    },
  },
};
</script>
<style lang="less">
.train-time-period {
  min-width: 650px;
  height: 100%;
  .search {
    position: absolute;
    top: -44px;
    right: 0;
    display: flex;
    align-items: center;
    .search-btn {
      margin-right: 10px;
      height: 32px;
      padding: 8px 15px;
      border-radius: 4px;
    }
    .btns {
      display: flex;
      align-items: center;
      div {
        padding: 4px 10px;
        border: 1px solid #e4e7ed;
        border-radius: 20px;
        margin-right: 10px;
        cursor: pointer;
      }
      div.active {
        color: #409eff;
        background: #ecf5ff;
        border-color: #b3d8ff;
      }
    }
  }
  .content {
    height: 83%;
  }

  .todo-tip {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 15px 15px 0;
    font-size: 14px;
    margin-right: 10px;
    .all-report {
      font-size: 14px;
      color: #1d91fc;
      cursor: pointer;
      margin-right: 10px;
    }
    span {
      font-weight: 500;
      color: #1d91fc;
      margin-left: 5px;
      font-size: 15px;
      cursor: pointer;
    }
  }

  .todo-container {
    padding: 10px 20px 20px;
  }
  .tab {
    padding: 10px 20px 20px;
    display: flex;
    margin-bottom: 20px;
    &.first-tab {
      padding: 10px 20px 0;
    }
    .tab-item {
      cursor: pointer;
      position: relative;
      margin-right: 33px;
      font-size: 14px;
      color: #4a4a4a;
      &.active {
        color: #1d91fc;
        &::after {
          position: absolute;
          content: '';
          height: 2px;
          width: 80%;
          background: #1d91fc;
          bottom: -8px;
          left: 10%;
        }
      }
    }
  }
  .tagData {
    font-size: 14px;
    overflow: hidden;
    border-bottom: 1px solid #e4e7ed;
    margin: 10px;
    margin-top: 0;
    padding-bottom: 10px;
    .tag-name {
      width: 160px;
      float: left;
      margin-right: 20px;
    }
    .color-red {
      color: red;
    }
    .tag-data {
      float: left;
      max-width: 400px;
      .tag-date {
        display: flex;
        align-items: center;
        .tag-time {
          width: 100px;
          margin-right: 20px;
        }
      }
    }
  }
}
</style>
