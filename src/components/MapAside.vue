<script setup>
import {LaptopChromebookRound, SpeedFilled, InsertChartOutlined, KeyboardDoubleArrowRightFilled, ExitToAppOutlined} from "@vicons/material"
import {reactive, ref, watch, onMounted} from "vue";

const props = defineProps({
  robotData: {
    type: Object,
    default: {}
  },
  selectCarId: {
    type: String
  },
  carGlowShow: {
    type: Boolean
  },
  viewBox: {
    type: Object
  }
});
// 当前需要显示的内容,monitor: 小车状态监控; control: 小车一些全局操作; calculate: 对小车数据的统计
let messageType = ref('monitor')
//选中要显示的信息
function ChoseMessage(messageName) {
  messageType.value = messageName
  if (messageName === 'calculate'){
    setTimeout(()=>{
      SetEquipmentChart()
    }, 10)
  } else {
    if (myChart.value){
      myChart.value.dispose(chartRef.value)
    }
  }
}
// 设置按钮样式
function SetBtnStyle(btn) {
  if (btn === messageType.value) {
    return {color: 'rgb(46,108,244)'}
  }
}

// 设置侧边栏是否展开
let asideOpen = ref(true)
// 展开边框
function SetAsideOpen() {
  asideOpen.value = !asideOpen.value
}
// 设置展开按钮样式
function SetAsideOpenBtnStyle(status) {
  return {
    transform: `rotate(${status ? 0 : 180}deg)`,
    transition: 'transform 0.3s ease'
  };
}
// 设置边框宽度
function SetMapAsideStyle(status) {
  return {width: `${status ? '340px' : '40px'}`, transition: `width 0.3s linear`}
}

onMounted(()=>{
  SetMonitorData()
  CalculateQuantity()
})

let monitorData = reactive({}), onlineData = reactive({}), offlineData = reactive({}), anomalousData = reactive({}),
    excludeData = reactive({})
monitorData = props.robotData

function SetMonitorData() {
  let obj1 = reactive({}), obj2 = reactive({}), obj3 = reactive({}), obj4 = reactive({}), obj5 = reactive({})
  for (let i in props.robotData) {
    if (props.robotData[i]['status'] === 0) {
      obj3[i] = props.robotData[i]
    } else if (props.robotData[i].status === 2 || props.robotData[i].status === 3) {
      obj4[i] = props.robotData[i]
    } else if (props.robotData[i].status === 4) {
      obj5[i] = props.robotData[i]
    } else {
      obj2[i] = props.robotData[i]
    }
  }
  onlineData = obj2
  offlineData = obj3
  anomalousData = obj4
  excludeData = obj5
}

watch(() => props.robotData, () => {
  SetMonitorData()
  CalculateQuantity()
})

// 设置当前展示的数据内容
let activeTab = ref('all')
// 点击标签
function TabClick(tab) {
  activeTab.value = tab
}
// 设置选中的标签className
function SetActiveTab(tab) {
  if (activeTab.value === tab) {
    return 'active'
  }
}
// 监控选中标签的值,如果发生改变就改变需要显示的小车数据
watch(() => activeTab.value, (newValue) => {
  if (newValue === 'all') {
    monitorData = props.robotData
  } else if (newValue === 'online') {
    monitorData = onlineData
  } else if (newValue === 'offline') {
    monitorData = offlineData
  } else if (newValue === 'anomalous') {
    monitorData = anomalousData
  } else if (newValue === 'exclude') {
    monitorData = excludeData
  }
})

// 向父组件发出事件
const emit = defineEmits(['update:selectCarId', 'update:carGlowShow', 'update:viewBox']);
let checkedRowKey = ref(''), lastClickTime = ref(0), lastClickCar = ref('')
function CheckRobot(robotCode) {
  let clickTime = new Date().getTime()
  if (clickTime - lastClickTime.value < 500 && lastClickCar.value === robotCode) {
    emit('update:viewBox', {
      x: props.robotData[robotCode].posx - (props.viewBox.width / 2),
      y: props.robotData[robotCode].posy - (props.viewBox.height / 2),
      width: props.viewBox.width,
      height: props.viewBox.height
    })
  } else {
    checkedRowKey.value = robotCode
    emit('update:selectCarId', robotCode)
    emit('update:carGlowShow', true)
    lastClickTime.value = clickTime
    lastClickCar.value = robotCode
  }
}
// 平均电量
let averageQuantity = ref(0)
// 计算平均电量
function CalculateQuantity() {
  let quantity = ref(0)
  for (let i in props.robotData){
    quantity.value += props.robotData[i].battery
  }
  averageQuantity.value = Math.round(quantity.value/Object.keys(props.robotData).length)
}
// 根据平均电量的数值设置电池样式
function SetBatteryStyle(){
  if (averageQuantity.value > 70) {
    return 'linear-gradient(to right, rgb(20, 162, 130), rgb(64, 214, 54))'
  } else if (averageQuantity.value >= 50){
    return 'linear-gradient(to right, yellow, orange)'
  } else {
    return 'linear-gradient(to right, #FF4015, red)'
  }
}

import * as echarts from 'echarts';
import {useUserInfoStore} from "@/store/Store.js";
let chartRef = ref(null), myChart = ref(null)
function SetEquipmentChart(){
  myChart.value = echarts.init(chartRef.value);
  let option = {
    series: [
      {
        name: '设备统计',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        labelLine: {
          show: false
        },
        data: [
          { value: Object.keys(onlineData).length, name: '在线', itemStyle: {color: 'lightblue'}},
          { value: Object.keys(offlineData).length, name: '离线', itemStyle:{color: 'gray'}},
          { value: Object.keys(excludeData).length, name: '排除', itemStyle:{color: 'orange'}},
          { value: Object.keys(anomalousData).length, name: '异常', itemStyle:{color: 'red' }}
        ]
      }
    ],
    graphic: {
      type: 'text',
      left: 'center',
      top: 'center',
      style: {
        text: Object.keys(props.robotData).length,
        textAlign: 'center',
        fill: '#000',
        fontSize: 20,
        fontWeight: 'bold'
      }
    }
  };
  option && myChart.value.setOption(option);
}

// 退出
function Exit(){
  useUserInfoStore().logout()
}

// // 检查浏览器是否支持通知
// if ("Notification" in window) {
//   // 请求权限
//   Notification.requestPermission().then(permission => {
//     if (permission === "granted") {
//       // 创建并显示通知
//       const options = {
//         body: "这是通知的内容",
//         icon: "path/to/icon.png", // 可选，通知图标
//         requireInteraction: true // 使通知一直显示，直到用户与之交互
//       };
//
//       const notification = new Notification("这是通知标题", options);
//
//       // 添加点击事件
//       notification.onclick = function() {
//         window.focus(); // 点击通知后，聚焦到当前页面
//       };
//     } else {
//       console.log("通知权限未被授予");
//     }
//   });
// } else {
//   console.log("浏览器不支持通知");
// }
</script>

<template>
  <div class="map_aside_wrapper" :style="SetMapAsideStyle(asideOpen)">
    <div class="control_side">
      <div class="control_side_item" @click="ChoseMessage('monitor')" :style="SetBtnStyle('monitor')">
        <n-icon :size="25">
          <LaptopChromebookRound/>
        </n-icon>
        <div class="control_btn_text">监控</div>
      </div>
      <br>
      <div class="control_side_item" @click="ChoseMessage('control')" :style="SetBtnStyle('control')">
        <n-icon :size="25">
          <SpeedFilled/>
        </n-icon>
        <div class="control_btn_text">控制</div>
      </div>
      <br>
      <div class="control_side_item" @click="ChoseMessage('calculate')" :style="SetBtnStyle('calculate')">
        <n-icon :size="25">
          <InsertChartOutlined/>
        </n-icon>
        <div class="control_btn_text">统计</div>
      </div>
      <div class="aside_open_control" @click="SetAsideOpen">
        <n-icon class="aside_open_control_btn" :style="SetAsideOpenBtnStyle(asideOpen)" :size="25">
          <KeyboardDoubleArrowRightFilled/>
        </n-icon>
      </div>
      <div class="exit" style="rotate: 180deg;cursor: pointer" @click="Exit">
        <n-icon :size="25">
          <ExitToAppOutlined/>
        </n-icon>
      </div>
    </div>
    <div class="map_aside_content">
      <div v-show="messageType==='monitor'" class="content_item monitor">
        <div class="monitor_head">
          <div class="monitor_head_title">设备列表</div>
          <div class="monitor_head_tabs">
            <div class="tabs" @click="TabClick('all')" :class="SetActiveTab('all')">
              全部
              <br>
              {{ Object.keys(props.robotData).length }}
            </div>
            <div class="tabs" @click="TabClick('online')" :class="SetActiveTab('online')">
              在线
              <br>
              {{ Object.keys(onlineData).length }}
            </div>
            <div class="tabs" @click="TabClick('offline')" :class="SetActiveTab('offline')">
              离线
              <br>
              {{ Object.keys(offlineData).length }}
            </div>
            <div class="tabs" @click="TabClick('anomalous')" :class="SetActiveTab('anomalous')">
              异常
              <br>
              {{ Object.keys(anomalousData).length }}
            </div>
            <div class="tabs" @click="TabClick('exclude')" :class="SetActiveTab('exclude')">
              排除
              <br>
              {{ Object.keys(excludeData).length }}
            </div>
          </div>
        </div>
        <div class="monitor_content">
          <div class="monitor_content_head">
            <div class="th">设备编号</div>
            <div class="th">状态</div>
            <div class="th">设备编号</div>
            <div class="th">电量</div>
          </div>
          <div class="monitor_content_body" v-for="(e,i) in monitorData" :key="i"
               :class="i === checkedRowKey ? 'active' : ''" @click="CheckRobot(i)">
            <div class="td">{{ e['robotCode'] }}</div>
            <div class="td">{{ e['status'] }}</div>
            <div class="td">{{ e['statusMessage'] }}</div>
            <div class="td">{{ e['battery'] }}%</div>
          </div>
        </div>
      </div>
      <div v-show="messageType==='control'" class="content_item control">b</div>
      <div v-show="messageType==='calculate'" class="content_item calculate">
        <div class="battery_calculate">
          <div class="battery_calculate_title title">平均电量</div>
          <div class="average_battery">
            <div class="battery">
              <div class="quantity" :style="{width: averageQuantity +'%', background: SetBatteryStyle()}"></div>
            </div>
            <div class="average_battery_text">
              <div style="font-size:28px;font-weight: 1000">{{averageQuantity}}%</div>
              <div style="font-size: 12px">平均电量</div>
            </div>
          </div>
        </div>

        <div class="equipment_calculate">
          <div class="equipment_calculate_title title">设备统计</div>
          <div class="equipment_chart_wrapper">
            <div ref="chartRef" class="equipment_chart" id="equipment_chart"></div>
            <div class="equipment_chart_legend">
              <div class="legend_item">
                <div class="legend_example" style="background-color: lightblue"></div><div>&nbsp;在线</div><div>{{Object.keys(onlineData).length}}</div>
              </div>
              <div class="legend_item">
                <div class="legend_example" style="background-color: gray"></div><div>&nbsp;离线</div><div>{{Object.keys(offlineData).length}}</div>
              </div>
              <div class="legend_item">
                <div class="legend_example" style="background-color: red"></div><div>&nbsp;异常</div><div>{{Object.keys(anomalousData).length}}</div>
              </div>
              <div class="legend_item">
                <div class="legend_example" style="background-color: orange"></div><div>&nbsp;排除</div><div>{{Object.keys(excludeData).length}}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="task_calculate">
          <div class="task_calculate_title title">任务统计</div>
          <div>
            <div style="text-align: left">正在执行 &nbsp;&nbsp;&nbsp;&nbsp;   37</div>
            <div style="text-align: left">等待执行 &nbsp;&nbsp;&nbsp;&nbsp;   6</div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.map_aside_wrapper {
  height: 100%;
  background-color: rgb(241, 242, 246);
  overflow: hidden;
  display: flex;
  align-items: center;
  user-select: none; /* 标准 */
  -webkit-user-select: none; /* 针对WebKit浏览器 */
  -ms-user-select: none; /* 针对Internet Explorer/Edge */
  -moz-user-select: none; /* 针对Firefox */
}

.control_side {
  height: 100%;
  width: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center; /* 添加这一行以竖直居中 */
  align-items: center;
  box-sizing: border-box;
  position: relative;
}
.control_side_item {
  width: 40px;
  height: 40px;
  text-align: center;
  box-sizing: border-box;
  color: rgb(165, 170, 182);
}
.control_btn_text {
  width: 100%;
  height: 20px;
  margin-top: -10px;
  font-size: 12px;
}
.control_side_item:hover {
  color: rgba(46, 108, 244, .6);
  background-color: rgba(165, 170, 182, 0.1);
}
.aside_open_control {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 0;
  color: rgba(45, 140, 240, .6);
}
.exit{
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  color: rgb(115, 116, 120);
}
.map_aside_content {
  height: 100%;
  width: 300px;
  box-sizing: border-box;
  background-color: rgb(255, 255, 255);
}

.content_item {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.monitor_head {
  width: 100%;
  height: 100px;
  background-color: rgba(51, 61, 87, .8);
  box-sizing: border-box;
  padding: 10px;
  position: relative;
}
.monitor_head_title {
  font-size: 20px;
  font-weight: 800;
  color: white;
  text-align: left;
}
.monitor_head_tabs {
  width: 100%;
  display: flex;
  justify-content: center;
  position: absolute;
  left: 0;
  bottom: 0;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.2);
}
.tabs {
  width: 52px;
  height: 44px;
  font-size: 12px;
  color: rgb(220, 220, 220);
  display: flex;
  justify-content: center;
  align-items: center;
}
.tabs.active {
  font-size: 16px;
  color: white;
}
.monitor_content_head, .monitor_content_body {
  width: 100%;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
}
.monitor_content_head {
  padding: 5px 0;
  font-size: 12px;
  background-color: rgba(255, 238, 163, 0.38);
}
.th {
  width: 75px;
}
.monitor_content_body {
  font-size: 15px;
  padding: 5px 0;
}
.td {
  width: 75px;
}
.monitor_content_body.active {
  background-color: rgba(255, 238, 163, 0.38);
}

.calculate{
  padding: 10px;
}
.battery_calculate {
  width: 100%;
}
.average_battery{
  width: 100%;
  height: 140px;
  background-color: rgba(51, 61, 87, .8);
  display: flex;
  align-items: center;
  justify-content: center;
}
.battery{
  width: 100px;
  height: 50px;
  background-color: rgba(51, 61, 87, .8);
  position: relative;
}
.battery:before{
  content: '';
  width: 5px;
  height: 30px;
  border-radius: 0 2px 2px 0;
  background-color: rgba(51, 61, 87, .8);
  position: absolute;
  top: 25px;
  right: -5px;
  transform: translateY(-50%);
}
.quantity{
  height: 100%;
}
.average_battery_text{
  width: 100px;
  height: 70px;
  color: white;
}


.equipment_calculate{
  width: 100%;
}

.equipment_chart_wrapper{
  width: 100%;
  height: 140px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}
.equipment_chart{
  width: 140px;
  height: 140px;
}
.equipment_chart_legend{
  width: 140px;
  height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.legend_item{
  display: flex;
  align-items: center;
}
.legend_example{
  width: 20px;
  height: 4px;
}




.title{
  font-size: 30px;
  font-weight: 2000;
  text-align: left;
  padding: 20px 0;
}
</style>