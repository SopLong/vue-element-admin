<template>
    <div>
        <el-button @click="generarePayroll">生成工资单</el-button>
        <full-calendar :events="monthData" class="test-fc" lang="zh"
            first-day='1' locale="fr"
            @changeMonth="changeMonth"
            @eventClick="eventClick"
            @dayClick="dayClick"
            @moreClick="moreClick"></full-calendar>
        <el-dialog
        title="工作时长"
        :visible.sync="dialogVisible"
        width="30%"
        :close-on-click-modal="false"
        :before-close="handleClose">
        <el-input v-model="duration"></el-input>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveWorkPoint">确 定</el-button>
        </span>
        </el-dialog>

        <el-dialog
        title="工作时长"
        :visible.sync="payRoll"
        width="30%"
        :close-on-click-modal="false"
        :before-close="handleClose">
        你确定要生成{{month}}的工资单吗?
        <span slot="footer" class="dialog-footer">
            <el-button @click="payRoll = false">取 消</el-button>
            <el-button type="primary" @click="generarePayroll1">确 定</el-button>
        </span>
        </el-dialog>

        <el-dialog
        title="工资单"
        :visible.sync="showTable"
        width="60%"
        :before-close="handleClose">
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="normalFee"
            label="正常工资"
            width="180">
          </el-table-column>
          <el-table-column
            prop="normalOverFee"
            label="正常加班工资"
            width="180">
          </el-table-column>
          <el-table-column
            prop="weekFee"
            label="周末工资">
          </el-table-column>
          <el-table-column
            prop="weekOverFee"
            label="周末加班工资">
          </el-table-column>
          <el-table-column
            prop="allFee"
            label="总工资">
          </el-table-column>
        </el-table>
        </el-dialog>
    </div>
</template>
<script>
import { FullCalendar } from 'vue-fullcalendar';
import * as workPointService from '@/api/workPoint';
export default {
  components: {
    FullCalendar,
    workPointService,
    'full-calendar': require('vue-fullcalendar')
  },
  data() {
    return {
      dialogVisible: false,
      payRoll: false,
      duration: 0,
      showTable: false,
      day: '',
      month: '',
      tableData: [],
      monthData: [
        // {
        //   title: '8小时', // 事件内容
        //   start: '2019-08-11', // 事件开始时间
        //   end: '2019-08-11', // 事件结束时间
        //   cssClass: 'red' // 事件的样式   class名（由后台返回数据）  red为自己定义的class名
        // }
      ]
    };
  },
  methods: {
    async generarePayroll1() {
      const res = await workPointService.generarePayroll(this.month);
      if (res.data !== null) {
        this.$set(this, 'tableData', []);
        this.tableData.push(res.data);
        this.showTable = true;
      }
      this.payRoll = false;
    },
    generarePayroll() {
      this.$set(this, 'payRoll', true);
    },
    // 选择月份
    changeMonth(start, end, current) {
      this.$set(this, 'month', this.$moment(current).format('YYYY-MM'));
      this.refreshData(current.substring(0, 7));
    },
    async refreshData(date) {
      const res = await workPointService.getMonthInfo(date);
      this.monthData = res.data;
    },
    // 点击事件
    eventClick(event, jsEvent, pos) {
    },
    // 点击当天
    dayClick(day, jsEvent) {
      this.$set(this, 'day', day);
      this.$set(this, 'dialogVisible', true);
    },
    async saveWorkPoint() {
      const res = await workPointService.saveWorkPoint(this.$moment(this.day).format('YYYY-MM-DD'), this.duration);
      if (res.code === 20000) {
        this.$set(this, 'duration', 0);
        this.dialogVisible = false;
        this.refreshData(this.$moment(this.month).format('YYYY-MM'));
      }
    },
    // 查看更多
    moreClick(day, events, jsEvent) {
    },
    handleClose(done) {
      this.$set(this, 'dialogVisible', false);
      this.$set(this, 'dialogVisible1', false);
      this.$set(this, 'showTable', false);
    }
  }
};
</script>

<style>
.red {
  background: red;
}
.blue {
  background: blue;
}
</style>
