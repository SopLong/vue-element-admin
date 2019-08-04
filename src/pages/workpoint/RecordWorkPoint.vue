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
        :before-close="handleClose">
        你确定要生成{{month}}的工资单吗?
        <span slot="footer" class="dialog-footer">
            <el-button @click="payRoll = false">取 消</el-button>
            <el-button type="primary" @click="generarePayroll1">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>
<script>
import { FullCalendar } from 'vue-fullcalendar';
import * as loginService from '@/api/login';
export default {
  components: {
    FullCalendar,
    loginService,
    'full-calendar': require('vue-fullcalendar')
  },
  data() {
    return {
      dialogVisible: false,
      payRoll: false,
      duration: 0,
      day: '',
      month: '',
      monthData: [
        {
          title: '8小时', // 事件内容
          start: '2019-08-11', // 事件开始时间
          end: '2019-08-11', // 事件结束时间
          cssClass: 'red' // 事件的样式   class名（由后台返回数据）  red为自己定义的class名
        }
      ]
    };
  },
  methods: {
    generarePayroll1() {
      loginService.generarePayroll(this.month);
    },
    generarePayroll() {
    //   console.log(this.month);
      this.$set(this, 'payRoll', true);
    },
    // 选择月份
    changeMonth(start, end, current) {
    //   console.log('changeMonth', start.format(), end.format(), current.format());
    //   alert(current);
      this.$set(this, 'month', current.substring(0, 7));
    },
    // 点击事件
    eventClick(event, jsEvent, pos) {
    //   console.log('eventClick', event, jsEvent, pos);
    },
    // 点击当天
    dayClick(day, jsEvent) {
    //   console.log(day);
      this.$set(this, 'day', day);
      this.$set(this, 'dialogVisible', true);
    },
    saveWorkPoint() {
      loginService.saveWorkPoint(this.day, this.duration);
      this.$set(this, 'duration', '');
    },
    // 查看更多
    moreClick(day, events, jsEvent) {
    //   console.log('moreCLick', day, events, jsEvent);
    },
    handleClose(done) {
    //   this.$confirm('确认关闭？')
    //     .then(_ => {
    //       done();
    //     })
    //     .catch(_ => {});
      this.$set(this, 'dialogVisible', false);
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
