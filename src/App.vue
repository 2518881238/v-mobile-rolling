<template>
  <div id="app">
    <div class="content" style="background: #d3d3d3;border: 1px solid #ffffff">

      <!--横向滚动demo-->
      <v-mobile-rolling :distance-more="700">

        <div class="item-box">
          <div class="item" v-for="(item,index) in list" :key="index">
            {{item.name}}
          </div>
        </div>

      </v-mobile-rolling>

    </div>


    <div class="content" style="background: #d3d3d3;border: 1px solid #ffffff">

      <!--纵向滚动demo-->
      <v-mobile-rolling :horizontal="false" roll-by-unit="50">

        <div class="item-box1">
          <span class="item1" v-for="(item,index) in list" :key="index">
            {{item.name}}
          </span>
        </div>

      </v-mobile-rolling>

    </div>


    <div class="content">

        <v-mobile-rolling :distance-more="700">

          <!--移动端表格滚动-->
          <div class="table">

            <div class="table-item" v-for="(item,index) in tableListTitle" :key="index">
              <div class="table-title">{{item.name}}</div>
              <div class="table-content" v-for="(ite,idx) in tableList" :key="idx">{{ite[`${item.id}`]}}</div>
            </div>

          </div>
        </v-mobile-rolling>

    </div>

    <!--显示select项-->
    <div style="width: 100%;text-align: center;padding: 5px 0">{{this.selectItemValue.name}}</div>

    <!--滚动选择组件-->
    <v-select-rolling :date-list="list" @selectItem="handleSelectItem"></v-select-rolling>

  </div>
</template>

<script>

import vMobileRolling from './components/vmr/v-mobile-rolling.vue'
import VSelectRolling from "./components/vmr/v-select-rolling.vue";

export default {
  components:{VSelectRolling, vMobileRolling},
  name: 'app',
  data () {
    return {
      selectItemValue:'默认值',
      tableListTitle:[
        {id:'num',name:'序号'},
        {id:'name',name:'姓名'},
        {id:'age',name:'年龄'},
        {id:'sex',name:'性别'},
        {id:'school',name:'学校'},
        {id:'weight',name:'体重'},
        {id:'height',name:'身高'},
      ],
      tableList:[],
      list: [
        {name: '测试1'},
        {name: '测试2'},
        {name: '测试3'},
        {name: '测试4'},
        {name: '测试5'},
        {name: '测试6'},
        {name: '测试7'},
        {name: '测试8'},
        {name: '测试9'},
        {name: '测试10'},
        {name: '测试11'},
        {name: '测试12'},
        {name: '测试13'},
        {name: '测试14'},
        {name: '测试15'},
        {name: '测试16'},
        {name: '测试17'},
        {name: '测试18'},
        {name: '测试19'},
      ],
    }
  },
  methods:{

    //日期组件选择回调
    handleSelectItem(val){
      this.selectItemValue = val;
    }

  },
  mounted() {

    //模拟异步请求数据，因为横向滚动时会根据异步数据填充DOM
    setTimeout(()=>{
      this.tableList = [
        {num:1,name:'张三',age:18,sex:'男',school:'加里敦大学',weight:'75',height:'175'},
        {num:2,name:'张三',age:18,sex:'男',school:'加里敦大学',weight:'75',height:'175'},
        {num:3,name:'张三',age:18,sex:'男',school:'加里敦大学',weight:'75',height:'175'},
        {num:4,name:'张三',age:18,sex:'男',school:'加里敦大学',weight:'75',height:'175'},
        {num:5,name:'张三',age:18,sex:'男',school:'加里敦大学',weight:'75',height:'175'},
        {num:6,name:'张三',age:18,sex:'男',school:'加里敦大学',weight:'75',height:'175'},
      ]
    },500)
  }
}
</script>

<style lang="scss">

.content{
  width: 100%;
  margin: 50px 0;
  position: relative;

  .item-box{
    width: 100%;
    height: 100%;
    display: flex;

    .item {
      width: 200px;
      height: 200px;
      text-align: center;
    }

  }

  .item-box1{
    width: 100%;
    height: 100%;

    .item1 {
      width: 100%;
      height: 50px;
      border: 1px solid #dddddd;
      box-sizing: border-box;
      text-align: center;
      display: inline-block;
    }

  }

  .table{

    width: 100%;
    display: flex;
    background: #FFFFF0;
    color: #616161;

    .table-item{
      width: 200px;

      .table-title{
        background: #FFEFD5;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px 0;
      }

      .table-content{
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px 0;
        line-height: 20px;
      }

      .table-content:nth-child(even){
        background: #FCFCFC;
      }

    }

    .table-item:nth-child(even){
      background: #FFFAFA;
    }

    .table-item:nth-child(odd){
      background: #F8F8FF;
    }

  }
  .date{
    width: 100%;
    height: 100%;
    .date-item{
      width: 100%;
      height: 50px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
