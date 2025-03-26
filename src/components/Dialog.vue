<script setup>
import {ref, onUnmounted, onMounted} from 'vue';
import {Close} from "@vicons/ionicons5"
// 接收父组件传来的props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  checkedCarData: {
    type: Object,
  },
  checkedPointData: {
    type: Object,
  },
  position: {
    type: Object,
    default: {top: 100, left: 100}
  },
  selectType: {
    type: String
  }
});

onMounted(()=>{
  console.log(props);
})
// 向父组件发出事件
const emit = defineEmits(['update:visible']);
const closeDialog = () => {
  emit('update:visible', false);
};

function bgClass(battery) {
  if (battery >= 30) {
    return 'success'
  } else if (battery >= 15) {
    return 'warning'
  } else if (battery >= 1) {
    return 'danger'
  } else {
    return 'danger'
  }
}

let connectStatus = ref(''), connectImage = ref('')

import {online, offline, alarm} from "@/assets/imageList"

function connectClass(status) {
  switch (status) {
    case 0:
      connectStatus.value = '离线'
      connectImage.value = offline
      return 'offline'
    case 1:
      connectStatus.value = '在线'
      connectImage.value = online
      return 'normal'
    default:
      connectStatus.value = '告警'
      connectImage.value = alarm
      return 'warning'
  }
}

// 弹窗位置
const position = ref({top: 100, left: 100});
position.value = props.position;
// 弹窗拖拽的处理函数
const isDragging = ref(false);
const dragOffset = ref({x: 0, y: 0});
const handleMouseDown = (event) => {
  isDragging.value = true;
  dragOffset.value = {
    x: event.clientX - position.value.left,
    y: event.clientY - position.value.top,
  };
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
};
const handleMouseMove = (event) => {
  if (!isDragging.value) return;
  let DialogHeader = document.getElementsByClassName('dialog-header')
  DialogHeader[0].style.cursor = 'move';
  position.value = {
    top: event.clientY - dragOffset.value.y,
    left: event.clientX - dragOffset.value.x,
  };
};
const handleMouseUp = () => {
  isDragging.value = false;
  let DialogHeader = document.getElementsByClassName('dialog-header')
  DialogHeader[0].style.cursor = 'default';
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
};
// 在组件卸载时移除事件监听器
onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
});

let pointTask = [
  {
    robotCode: "AGV-001",
    taskMode: "入库",
    taskStatus: "正在执行",
    startPos: "制绒上-001",
    endPosition: "制绒下-001",
    taskCode: "172738263197"
  },
  {
    robotCode: "AGV-001",
    taskMode: "入库",
    taskStatus: "正在执行",
    startPos: "制绒上-001",
    endPosition: "制绒下-001",
    taskCode: "172738263197"
  }
]

</script>

<template>
<!--  <teleport to="body">-->
    <div class="map_dialog" :style="{ top: `${position.top}px`, left: `${position.left}px` }">
      <div class="header_container" @mousedown="handleMouseDown">
        <div class="dialog-header">
          <!--          状态信息-->
          <div class="dialog_header_status">
            <!--            小车在线状态-->
            <div v-if="props.selectType === 'car'" class="dialog_header_status_connect">
              <span class="status" :class="connectClass(checkedCarData['status'])"></span>
              <span class="status_text">{{ connectStatus }}</span>
            </div>
            <!--            关闭弹窗按钮-->
            <div class="dialog_header_close_btn">
              <n-icon class="dialog_header_close_btn_button" :size="20" color="white" @click="closeDialog"
                      style="cursor:pointer;">
                <Close/>
              </n-icon>
            </div>
          </div>
          <!--基本信息,如编号等-->
          <div class="point_message">
            <div v-if="props.selectType === 'car'" class="point_message_item robot_code">
              <img :src="connectImage" style="transform: rotate(-90deg)" :width="40" alt="none"/>
              <div style="font-size: 20px;font-weight: 800">
                {{ checkedCarData['robotCode'] }}
              </div>
            </div>
            <div v-if="props.selectType === 'car'" class="point_message_item robot_battery"
                 :class="bgClass(checkedCarData['battery'])">
              <div class="panel" style="transform: rotate(-90deg)">
                <div class="remainder" :style="{width: checkedCarData['battery'] +'%'}"/>
              </div>
              <div class="battery_text">
                {{ checkedCarData['battery'] }}%
              </div>
            </div>

            <div v-if="props.selectType === 'point'" class="point_message_item point_code">
              <div style="font-size: 20px;font-weight: 800">
                {{ checkedPointData['id'] }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="dialog-body">
        <!--小车报警信息-->
        <div class="warning_message"><span v-if="props.selectType === 'car'">{{ checkedCarData['statusMessage'] }}</span></div>
        <!--        小车信息-->
        <div v-if="props.selectType === 'car'" class="car_message_container">
          <n-scrollbar>
            <n-grid class="car_message_wrapper" :cols="2">
              <n-gi>
                <div class="car_message_item-1">
                  <div class="car_message_item_label">设备IP</div>
                  <div class="car_message_item_content">{{ checkedCarData['ip'] }}</div>
                </div>
              </n-gi>
              <n-gi>
                <div class="car_message_item-1">
                  <div class="car_message_item_label">执行状态</div>
                  <div class="car_message_item_content">{{ checkedCarData['isTask'] ? "任务执行中" : "任务空闲" }}</div>
                </div>
              </n-gi>
              <n-gi>
                <div class="car_message_item-2">
                  <div class="car_message_item_label">起点位置</div>
                  <div class="car_message_item_content">
                    {{ checkedCarData['originPos'] }}
                  </div>
                </div>
              </n-gi>
              <n-gi>
                <div class="car_message_item-2">
                  <div class="car_message_item_label">目标位置</div>
                  <div class="car_message_item_content">
                    {{ checkedCarData['finishPos'] }}
                  </div>
                </div>
              </n-gi>
              <n-gi>
                <div class="car_message_item-1">
                  <div class="car_message_item_label">当前位置</div>
                  <div class="car_message_item_content">
                    {{ checkedCarData['posx'] }},{{ checkedCarData['posy'] }}
                  </div>
                </div>
              </n-gi>
              <n-gi>
                <div class="car_message_item-1">
                  <div class="car_message_item_label">任务编号</div>
                  <div class="car_message_item_content">
                    {{ checkedCarData['taskCode'] }}
                  </div>
                </div>
              </n-gi>
              <n-gi>
                <div class="car_message_item-2">
                  <div class="car_message_item_label">花篮数量</div>
                  <div class="car_message_item_content">
                    {{ checkedCarData['basketNums'] }}
                  </div>
                </div>
              </n-gi>
              <n-gi>
                <div class="car_message_item-2">
                  <div class="car_message_item_label">是否可用</div>
                  <div class="car_message_item_content">
                    {{ checkedCarData['status'] === 1 ? "是" : "否" }}
                  </div>
                </div>
              </n-gi>
            </n-grid>
          </n-scrollbar>
        </div>
        <div v-if="props.selectType === 'point'" class="point_task_message_wrapper">
          <n-scrollbar>
            <table class="point_task_message">
              <thead>
              <tr>
                <th>设备编号</th>
                <th>任务类型</th>
                <th>任务状态</th>
                <th>起始位置</th>
                <th>目标位置</th>
                <th>任务编号</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(e,i) in pointTask" :key="i">
                <td v-for="(ee) in e">
                  <n-performant-ellipsis style="max-width: 65px">
                    {{ ee }}
                  </n-performant-ellipsis>
                </td>
              </tr>
              </tbody>
            </table>
          </n-scrollbar>
        </div>

        <!-- 小车操作按钮区域 -->
        <div v-if="props.selectType === 'car'" class="car_operate">
          <div class="operate_item">
            <n-button strong secondary>取消任务</n-button>
          </div>
          <div class="operate_item">
            <n-button strong secondary>暂停</n-button>
          </div>
          <div class="operate_item">
            <n-button strong secondary>恢复</n-button>
          </div>
          <div class="operate_item">
            <n-button strong secondary>移动</n-button>
          </div>
        </div>
      </div>
    </div>
<!--  </teleport>-->
</template>

<style scoped>
.map_dialog {
  position: fixed;
  width: 420px;
  height: 360px;
  box-sizing: border-box;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  user-select: none; /* 标准 */
  -webkit-user-select: none; /* 针对WebKit浏览器 */
  -ms-user-select: none; /* 针对Internet Explorer/Edge */
  -moz-user-select: none; /* 针对Firefox */
}

.header_container {
  width: 100%;
  height: 100px;
  box-sizing: border-box;
  position: relative;
}

.dialog-header {
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
  background-color: rgba(51, 61, 87, .5);
  color: white;
}

.dialog-header:after, .dialog-header:before {
  content: "";
  display: block;
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: -1;
  background-position: bottom;
  background-size: cover;
  background-color: rgb(247, 247, 247);
}

.dialog-header:before {
  left: 0;
  right: 50%;
  background-image: url('/src/assets/img/bg-login-left.png ');
}

.dialog-header:after {
  left: 50%;
  right: 0;
  background-image: url('/src/assets/img/bg-login-right.png ');
}

.dialog_header_status {
  width: 100%;
  height: 20px;
  box-sizing: border-box;
}

/*小车的连接状态*/
.dialog_header_status_connect {
  height: 100%;
  float: left;
  display: flex;
  align-items: center;
}

.status {
  width: 5px;
  height: 5px;
  border-radius: 5px;
  margin-right: 8px;
}

.status.normal {
  background-color: rgb(20, 162, 130);
}

.status.offline {
  background-color: rgb(133, 133, 133);
}

.status.warning {
  background-color: red;
}

.status_text {
  height: 20px;
  line-height: 20px;
}

.dialog_header_close_btn {
  float: right;
}

.dialog_header_close_btn_button:hover {
  border-radius: 50%;
  background-color: rgba(51, 61, 87, .5);
}

.point_message {
  width: 100%;
  height: 60px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
}

.point_message_item {
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

/*电池*/
.panel {
  box-sizing: border-box;
  width: 32px;
  height: 18px;
  position: relative;
  border: 2px solid #ccc;
  padding: 1px;
  border-radius: 3px;
}

.panel::before {
  content: '';
  border-radius: 0 1px 1px 0;
  height: 8px;
  background: #ccc;
  width: 3px;
  position: absolute;
  top: 50%;
  right: -4px;
  transform: translateY(-50%);
}

.remainder {
  border-radius: 1px;
  height: 100%;
  background: #fff;
}

.battery_text {
  text-align: center;
  width: 42px;
  font-size: 20px;
  font-weight: 800;
}

.robot_battery.success .remainder {
  background: #13ce66;
}

.robot_battery.warning .panel {
  border-color: #ffba00;
}

.robot_battery.warning .panel::before {
  background: #ffba00;
}

.robot_battery.warning .remainder {
  background: #ffba00;
}

.robot_battery.danger .panel {
  border-color: #ff4949;
}

.robot_battery.danger .panel::before {
  background: #ff4949;
}

.robot_battery.danger .remainder {
  background: #ff4949;
}

.robot_battery.danger .battery_text {
  color: #ff4949;
}

.dialog-body {
  width: 100%;
  height: 260px;
  padding: 0 20px;
  box-sizing: border-box;
  background-color: rgb(247, 247, 247);
}

.warning_message {
  color: #d41010;
  font-weight: bold;
  font-size: 10px;
  height: 20px;
}

.point_task_message_wrapper{
  width: 100%;
  height: 200px;
  background-color: rgb(223,225,230);
}
.point_task_message{
  width: 100%;
}
.point_task_message>thead{
  font-size: 10px;
  background-color: rgb(190, 193, 201);
}
.point_task_message>tbody>tr>td{
  text-align: center;
  border: 1px solid rgb(255, 255, 255);
  font-size: 10px;
  padding: 0;
}

.car_message_container{
  width: 100%;
  height: 150px;
}

.car_message_wrapper {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  border: 1px solid rgb(206, 211, 209);
}

.car_message_item-1 {
  background-color: rgb(224, 226, 231);
}

.car_message_item-1, .car_message_item-2 {
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
}

.car_message_item_label {
  width: 40%;
  box-sizing: border-box;
}

.car_message_item_content {
  width: 60%;
  box-sizing: border-box;
  font-weight: 800;
}

.car_message_item_label, .car_message_item_content {
  height: 30px;
  border: 1px solid rgb(206, 211, 209);
  padding: 5px 0 5px 10px;
  line-height: 20px;
  font-size: 10px;
}

.car_operate {
  width: 100%;
  height: 60px;
  box-sizing: border-box;
  display: flex;
  justify-content: left;
}

.operate_item {
  height: 31px;
  padding: 5px;
  font-size: 10px;
  box-sizing: border-box;
}

:deep(.operate_item>.n-button) {
  font-size: 10px;
  width: 100%;
  height: 100%;
  min-width: 55px;
  padding: 3px 6px;
  background-color: rgb(224, 226, 231);
}

:deep(.operate_item>.n-button:hover) {
  border: 1px solid rgb(51, 61, 87);
  background-color: rgb(224, 226, 231, .7);
}

:deep(.n-button:focus) {
  outline: none;
}

</style>
