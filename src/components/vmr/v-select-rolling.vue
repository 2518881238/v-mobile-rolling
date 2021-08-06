<template>
  <div class="content" style="border: 1px solid #d3d3d3; height: 250px">
    <!--选中区域-->
    <span class="date-select-box"></span>

    <v-mobile-rolling :horizontal="false" :roll-by-unit="rollUnit" :height-horizontal="250" :init-position="position" @touchEnd="handleTouchEnd">

      <div class="date">

        <!--选中项添加样式-->
        <span class="date-item" :class="selectIndex === index ? 'date-select':''" v-for="(item,index) in dateList":key="index">
            {{item.name}}
        </span>

      </div>

    </v-mobile-rolling>

  </div>
</template>

<script>
  import VMobileRolling from "./v-mobile-rolling.vue";

  export default {
    name: "v-select-rolling",
    components: {VMobileRolling},
    props: {
      //需要滚动的数据列表
      dateList: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    data() {
      return {
        selectIndex: 5,//默认选择项
        rollUnit: '50',//纵向选择滚动需要按照固定单位长度滚动，以获取选择值
        position:0
      }
    },
    methods: {

      //滚动结束触发回调，返回滚动长度计算选中项
      handleTouchEnd(event, touchDistance) {

        //设置延迟是应为滚动结束有800ms动画，等待动画结束再渲染
        setTimeout(() => {

          this.selectIndex = Math.abs(touchDistance / this.rollUnit) + 2;
          this.$emit('selectItem', this.dateList[this.selectIndex])

        }, 800)

      }
    },
    created() {

      //初始化返回选中值
      this.position = - Number(this.rollUnit) * (this.selectIndex);
      this.$emit('selectItem', this.dateList[this.selectIndex+2])

    }
  }
</script>

<style lang="scss" scoped>
  .content {
    width: 100%;
    margin: 50px 0;
    position: relative;

    .date {
      width: 100%;
      height: 100%;

      .date-item {
        width: 100%;
        height: 50px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #8A8A8A;
      }

      .date-select {
        color: #424242;
      }

    }

    .date-select-box {
      width: 100%;
      height: 50px;
      box-sizing: border-box;
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      background: #E5E5E5;
    }

  }
</style>
