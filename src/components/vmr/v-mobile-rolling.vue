<template>

  <!-- 纵向滚动时，利用MutationObserver观测DOM变化动态获取高度-->
  <div class="v-m-box" ref="VMBox" :style="{height: horizontal ? heightDom : heightHorizontal+'px'}">

    <!--纵向滚动需要定宽，横向滚动需要定高-->
    <div class="v-m-roll" :class="horizontal ? '' : 'width100'" ref="VMRoll" @touchstart.stop.prevent="handleTouchStart"
         @touchmove.stop.prevent="handleTouchMove"
         @touchend.stop.prevent="handleTouchStop">

      <slot></slot>

    </div>

  </div>

</template>

<script>
  export default {
    name: "v-mobile-rolling",
    props: {
      //是否横向滚动
      horizontal: {
        type: Boolean,
        default: true
      },
      //横向滚动时高度，因为是横向滚动，故需要设置定高
      heightHorizontal:{
        type:Number,
        default:200
      },
      //是否滚动后按照单位距离停留，多退少补
      rollByUnit: {
        type: String,
        default: ''
      },
      //快速滑动时补充滑动的距离
      distanceMore:{
        type:Number,
        default: 500
      },
      //最大向左滑动的距离
      maxDown: {
        type:Number,
        default:50
      },
      initPosition:{
        type:Number,
        default:0
      }
    },
    data() {
      return {

        isRolling: false,//是否滚动

        startX: 0,//鼠标开始滑动的距离
        moveX: 0,//鼠标移动的距离
        allMove: 0,//鼠标累计移动的距离

        maxUpBounce: 0,//最大向上反弹距离
        maxDownBounce: 0,//最大向下反弹的距离

        maxUp: 0,//最大向右滑动的距离

        moveTime: 0,//滑动时间
        moveDistance: 0,//滑动距离

        offsetDir: 'offsetWidth',//offset方向
        clientDir: 'clientX',//滑动方向距离
        translateDir: 'translateX',//动画方向

        heightDom:0,//初始化元素高度，动态监听

        observer:null//观测DOM改变
      }
    },

    created() {

      //垂直滚动还是水平滚动
      if (this.horizontal === false) {

        this.offsetDir = 'offsetHeight';
        this.clientDir = 'clientY';
        this.translateDir = 'translateY';

      }

    },

    beforeDestroy() {
      // 停止观测
      this.observer.disconnect();
    },

    mounted() {

      //获取滚动窗口的大小和滚动内容的大小
      this.$nextTick(() => {

        //利用MutationObserver来监听dom填充以及该变，动态获取内部元素高度
        this.heightDom = this.$refs['VMRoll'].offsetHeight+'px';

        //设置observer的配置选项
        let config = { attributes: true, childList: true, subtree: true };

        //创建一个observer示例与回调函数相关联，监测dom变化，比如通过异步请求滚动区域内的数据
        this.observer = new MutationObserver(()=>{
          this.heightDom = this.$refs['VMRoll'].offsetHeight+'px';
        });

        //使用配置文件对目标节点进行观测
        this.observer.observe(this.$refs['VMRoll'], config);

        //检测内容是否大于父元素，不大于则不滚动
        this.isRolling = (this.$refs['VMRoll'][this.offsetDir] - this.$refs['VMBox'][this.offsetDir]) > 0

        if (this.isRolling) {

          this.maxDownBounce = -(this.$refs['VMRoll'][this.offsetDir] - this.$refs['VMBox'][this.offsetDir]);
          this.maxUp = -(this.$refs['VMRoll'][this.offsetDir] - this.$refs['VMBox'][this.offsetDir] + this.maxDown);

        }

        //默认滚动到某个位置
        this.$refs['VMRoll'].style.transition = "transform 100ms cubic-bezier(.165, .84, .44, 1) 0s";
        this.$refs['VMRoll'].style.transform = `${this.translateDir}(${this.initPosition}px)`;

      })

    },
    methods: {

      //滚动是按单位长度滚动，不足的则补上滚长度
      getUnitValue(num, dir) {

        if (this.rollByUnit === '' || !(/(^[1-9]\d*$)/.test(this.rollByUnit))) {
          return num;
        }

        let val = Math.abs(num % this.rollByUnit);

        if (dir > 0) {
          return num + val;
        } else {
          return num - (this.rollByUnit - val);
        }

      },

      //开始滚动触发
      handleTouchStart(event) {

        if (!this.isRolling) {
          return;
        }

        //记录开始位置
        this.startX = event.touches[0][this.clientDir];

        //记录开始的时间
        this.moveTime = new Date().getTime();

        //记录移动距离
        this.moveDistance = this.startX;

        //开始滑动时触发回调
        this.$emit('touchStart', event);

      },

      //滚动中触发
      handleTouchMove(event) {

        if (!this.isRolling) {
          return;
        }

        //滑动时移动了多少距离
        this.moveX = event.touches[0][this.clientDir] - this.startX;

        //当前鼠标累计移动了多少距离
        this.$refs['VMRoll'].style.transition = "none";

        let disMove = this.allMove + this.moveX;

        //如果当前鼠标累计移动了的距离大于最大向右可移动的距离，则不能再向右移动,左边反之
        disMove = disMove > this.maxDown ? this.maxDown : this.maxUp;

        //利用动画实现滑动效果
        this.$refs['VMRoll'].style.transition = "transform 100ms cubic-bezier(.165, .84, .44, 1) 0s";
        this.$refs['VMRoll'].style.transform = `${this.translateDir}(${disMove}px)`;

        //计算时间戳，大于300属于慢速滑动，小于300则属于快速滑动
        if (new Date().getTime() - this.moveTime > 300) {
          this.moveTime = new Date().getTime();
          this.moveDistance = event.touches[0][this.clientDir];
        }

        //滑动过程中触发回调
        this.$emit('touchMove', event);

      },

      //滚动停止时触发
      handleTouchStop(event) {

        if (!this.isRolling) {
          return;
        }

        //算出滑动开始到滑动结束的距离，往左边滑动为负数，往右边滑动为正数
        let m = event.changedTouches[0][this.clientDir] - this.startX;

        //累计距离
        this.allMove = this.allMove + m;

        //计算滑动速度
        let v = Math.abs((event.changedTouches[0][this.clientDir] - this.moveDistance) / (new Date().getTime() - this.moveTime))

        //经测试，滑动速度大于0.6计算为快滑动
        if (m > 0) { //往右边滑动时，加上多余滑动的距离,距离随着速度梯度变化
          this.allMove = this.allMove + v > 0.6 ? Math.abs(this.distanceMore * v) : v > 0.2 ? 100 : 0;
        } else if(m < 0) { //往左边滑动时，减去多余滑动的距离,距离随着速度梯度变化
          this.allMove = this.allMove - v > 0.6 ? Math.abs(this.distanceMore * v) : v > 0.2 ? 100 : 0;
        }

        //是否按照规定的单位长度的倍数滑动，不足补齐，多了减去
        this.allMove = this.getUnitValue(this.allMove, m > 0 ? 1 : -1);

        // 让两次滑动的距离不超过设置的边界值
        this.allMove = this.allMove >= this.maxUpBounce ? this.maxUpBounce : this.maxDownBounce;

        //利用动画实现滑动效果
        this.$refs['VMRoll'].style.transition = "transform 800ms cubic-bezier(.165, .84, .44, 1) 0s";
        this.$refs['VMRoll'].style.transform = `${this.translateDir}(${this.allMove}px)`;

        //滑动结束触发回调
        this.$emit('touchEnd', event,this.allMove);

      }
    }
  }
</script>

<style lang="scss" scoped>
  .v-m-box {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;

    .v-m-roll {
      position: absolute;
      left: 0;
      top: 0;
    }

    .hei100 {
      height: 100%;
    }

    .width100{
      width: 100%;
    }

  }
</style>
