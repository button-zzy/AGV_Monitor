<script setup>
import {reactive, ref} from "vue";
import axios from 'axios';
import Dialog from "./Dialog.vue";
import {AddSharp, RemoveSharp, ContractOutline, ExpandOutline} from "@vicons/ionicons5";
import {MapIdentify} from "@vicons/carbon"
import MapAside from "./MapAside.vue";
import {mapInfoStore} from "@/store/Store.js";

const elementList = ref({});
const imagesContext = import.meta.glob('@/assets/AGV/*.{png,gif}');
for (const path in imagesContext) {
  const fileName = path.split('/').pop().split('.')[0]; // 获取文件名（不含扩展名）
  imagesContext[path]().then((module) => {
    elementList.value[fileName] = module.default;
  });
}

let pointData
pointData = mapInfoStore().mapData
// 获取小车数据函数
let robotData = reactive({
  "AGV-001": {
    "robotCode": "AGV-001", // 编码
    "ip": "192.168.33.100", // IP
    "battery": 70, // 电量
    "isTask": true, // 是否有任务
    "taskCode": "TASK00001", // 任务编码
    "exclude": false, // 是否排除, 排除后不可接收任务
    "excludeMessage": "", // 排除后的提示信息
    "basketNums": 10, // 花篮数量
    "basketPosition": 1, // 花篮位置, 0:无, 1:上层, 2:下层, 3:上下层
    "posx": 2881.3, // X位置
    "posy": 5985.5, // Y位置
    "dir": 90, // 方向
    "obstacle": false, // 是否遇障
    "obstacleDir": 0, // 遇障方向 0:前, 1:后, 2:左, 3:右
    "path": [
      [101, 101],
      [102, 102],
    ], // 任务路径
    "originPos": "P-ZRS-001", // 任务起点
    "finishPos": "P-ZRX-001", // 任务终点
    "mapCode": "AAA", // 地图编码,如果有多地图可以按地图编码获取
    "area": "AA", // 小车划分执行的区域
    "type": 1,   // 小车类型, 如一体式:1,环境监测:2,非标发片小车:3,
    "status": 0,// 0:关机,1:正常,2:暂停,3:报警,4:排除,5:充电中, 若有其他状态,请补全
    "statusMessage": "遇障", // 状态信息
    "plc": {
      "origin": "制绒上001号接驳口",
      "finish": "制绒下001号缓存位",
      "rfid": [
        "rfid01", "rfid02", "rfid03", "rfid04", "rfid05",
        "rfid06", "rfid07", "rfid08", "rfid09", "rfid10"
      ],
    }
  },
  "AGV-002": {
    "robotCode": "AGV-002", // 编码
    "ip": "192.168.33.100", // IP
    "battery": 90, // 电量
    "isTask": true, // 是否有任务
    "taskCode": "TASK00001", // 任务编码
    "exclude": false, // 是否排除, 排除后不可接收任务
    "excludeMessage": "", // 排除后的提示信息
    "basketNums": 10, // 花篮数量
    "basketPosition": 1, // 花篮位置, 0:无, 1:上层, 2:下层, 3:上下层
    "posx": 3081.3, // X位置
    "posy": 5985.5, // Y位置
    "dir": 90, // 方向
    "obstacle": false, // 是否遇障
    "obstacleDir": 0, // 遇障方向 0:前, 1:后, 2:左, 3:右
    "path": [
      [101, 101],
      [102, 102],
    ], // 任务路径
    "originPos": "P-ZRS-001", // 任务起点
    "finishPos": "P-ZRX-001", // 任务终点
    "mapCode": "AAA", // 地图编码,如果有多地图可以按地图编码获取
    "area": "AA", // 小车划分执行的区域
    "type": 1,   // 小车类型, 如一体式:1,环境监测:2,非标发片小车:3,
    "status": 3,// 0:关机,1:正常,2:暂停,3:报警,4:排除,5:充电中, 若有其他状态,请补全
    "statusMessage": "遇障", // 状态信息
    "plc": {
      "origin": "制绒上001号接驳口",
      "finish": "制绒下001号缓存位",
      "rfid": [
        "rfid01", "rfid02", "rfid03", "rfid04", "rfid05",
        "rfid06", "rfid07", "rfid08", "rfid09", "rfid10"
      ],
    }
  }

})
let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'http://172.16.10.197:8083/rcms-dps/rest/queryAgvStatus',
  headers: {
    'Content-Type': 'application/json'
  },
  data: JSON.stringify({"mapShortName": "AA"})
};

function getRobotData() {
  axios.request(config).then((response) => {
    let data = response.data.data
    for (let i in data) {
      let carPosition = SetCarPosition({x: data[i].posX, y: data[i].posY})
      robotData[data[i].robotCode] = {
        "robotCode": data[i].robotCode, // 编码
        "ip": data[i]['robotIp'], // IP
        "battery": data[i].battery, // 电量
        "isTask": true, // 是否有任务
        "taskCode": "TASK00001", // 任务编码
        "exclude": false, // 是否排除, 排除后不可接收任务
        "excludeMessage": "", // 排除后的提示信息
        "basketNums": 10, // 花篮数量
        "basketPosition": 1, // 花篮位置, 0:无, 1:上层, 2:下层, 3:上下层
        "posx": carPosition.x, // X位置
        "posy": carPosition.y, // Y位置
        "dir": data[i]['robotDir'], // 方向
        "obstacle": false, // 是否遇障
        "obstacleDir": 0, // 遇障方向 0:前, 1:后, 2:左, 3:右
        "path": data[i].path, // 任务路径
        "originPos": "P-ZRS-001", // 任务起点
        "finishPos": "P-ZRX-001", // 任务终点
        "mapCode": "AAA", // 地图编码,如果有多地图可以按地图编码获取
        "area": "AA", // 小车划分执行的区域
        "type": 1,   // 小车类型, 如一体式:1,环境监测:2,非标发片小车:3,
        "status": 1,// 0:关机,1:正常,2:暂停,3:报警,4:排除,5:充电中, 若有其他状态,请补全
        "statusMessage": "", // 状态信息
        "plc": {
          "origin": "制绒上001号接驳口",
          "finish": "制绒下001号缓存位",
          "rfid": [
            "rfid01", "rfid02", "rfid03", "rfid04", "rfid05",
            "rfid06", "rfid07", "rfid08", "rfid09", "rfid10"
          ],
        }
      }
    }
    if (selectCarId.value !== '') {
      SetRunningPath(robotData[selectCarId.value].path)
    }
  }).catch((error) => {
    console.log(error);
  });
}

// getRobotData()
// setInterval(() => {
//   getRobotData()
// }, 200)

let pointList = reactive([]), pathList = reactive({})
SetMapNodes(pointData)

/**
 * 点位信息的value代表点位类型
 * 10:工作区 11:充电区 13:旋转区 15:自动门 16:高速区 19:暂驻区 21:缓冲交接区
 */
function SetMapNodes(pointData) {
  for (let i in pointData) {
    let startPosition = setPosition({x: pointData[i]['xpos'], y: pointData[i]['ypos']})
    // 采集点
    if (pointList.indexOf(pointData[i].id) === -1) {
      pointList.push({
        id: pointData[i].id,
        x: startPosition.x,
        y: startPosition.y,
        type: pointData[i]['value']
      })
    }
    // 生成路线
    let neighborsId = reactive([]), ctrlPoint = reactive([])
    neighborsId = Array.isArray(pointData[i]['NeighbInfo'].id) ? pointData[i]['NeighbInfo'].id : [pointData[i]['NeighbInfo'].id];
    ctrlPoint = Array.isArray(pointData[i]['NeighbInfo']['CtrlPoint']) ? pointData[i]['NeighbInfo']['CtrlPoint'] : [pointData[i]['NeighbInfo']['CtrlPoint']];
    for (let neighborId of neighborsId) {
      if (neighborId) {
        const pathId = `${pointData[i].id}TO${neighborId}`;
        const revPathId = `${neighborId}TO${pointData[i].id}`;
        const endPosition = setPosition({
          x: pointData[neighborId]['xpos'],
          y: pointData[neighborId]['ypos']
        });
        const ctrlPoints = setPosition(ctrlPoint[neighborsId.indexOf(neighborId)]);
        if (revPathId in pathList) {
          pathList[revPathId].type = 1;
        } else if (!(pathId in pathList)) {
          pathList[pathId] = {
            d: getLinePoints(startPosition, endPosition, ctrlPoints),
            start: startPosition,
            end: endPosition,
            type: 0   // 0: 单向, 1: 双向
          };
        }
      }
    }
  }
}

// 设置路线的路径
function getLinePoints(start, end, ctlPoint) {
  if (ctlPoint) {
    // 只能加两个控制点，SVG内最多只能画三阶贝塞尔曲线
    return `M${start.x} ${start.y} C${ctlPoint[1].x} ${ctlPoint[1].y}, ${ctlPoint[2].x} ${ctlPoint[2].y}, ${end.x} ${end.y}`;
  } else {
    return `M${start.x} ${start.y} L${end.x} ${end.y}`;
  }
}

// 坐标转换
function setPosition(point) {
  if (!point || point.length === 0) {
    return "";
  } else if (point.Pos) {
    let array = reactive([])
    for (let i in point.Pos){
      array.push({
        x: Math.round((point.Pos[i]['@attributes']['xpos'] - 70) * 1000) / 10,
        y: Math.round((170 - point.Pos[i]['@attributes']['ypos']) * 1000) / 10
      });
    }
    return array
    // return point.Pos.map(p => ({
    //   x: Math.round((p['@attributes']['_xpos'] - 70) * 1000) / 10,
    //   y: Math.round((170 - p['@attributes']['_ypos']) * 1000) / 10
    // }));
  } else {
    return {
      x: Math.round((point.x - 70) * 1000) / 10,
      y: Math.round((170 - point.y) * 1000) / 10
    };
  }
}

function SetCarPosition(car) {
  return {x: car.x / 10 - 7000, y: 17000 - (car.y / 10)}
}

// 判断当前车状况来引入不同图片
function currentCar(carData) {
  switch (carData.status) {
    case 0:
      return elementList.value['offline']
    case 1:
      return elementList.value['online']
    default:
      return elementList.value['alarm']
  }
}

// 计算小车的旋转角度
function DirCalculate(carData) {
  // 角度,旋转中心点的坐标
  return `rotate(${carData.dir},${carData.posx},${carData.posy})`;
}

/**
 * 针对地图svg的背景图设置
 */
// 初始 viewBox 设置, 单位为厘米
let viewBox = ref({
  x: 2000,
  y: 4000,
  width: 7000,
  height: 5000,
});
let zoomFactor = 1.1; // 放大/缩小倍率
// 滚动放大
function OnMouseWheel(event) {
  event.preventDefault();
  let svgRect = event.currentTarget.getBoundingClientRect();
  let mouseX = event.clientX - svgRect.left;
  let mouseY = event.clientY - svgRect.top;
  let svgX = (mouseX / svgRect.width) * viewBox.value.width + viewBox.value.x;
  let svgY = (mouseY / svgRect.height) * viewBox.value.height + viewBox.value.y;
  // 滚轮方向：向上放大，向下缩小
  if (event.deltaY < 0) {
    // 放大
    viewBox.value.width /= zoomFactor;
    viewBox.value.height /= zoomFactor;
  } else {
    // 缩小
    viewBox.value.width *= zoomFactor;
    viewBox.value.height *= zoomFactor;
  }
  // 调整 viewBox 位置以保持鼠标为中心
  viewBox.value.x = svgX - (mouseX / svgRect.width) * viewBox.value.width;
  viewBox.value.y = svgY - (mouseY / svgRect.height) * viewBox.value.height;
}

// 开始拖动的标识变量
let isDragging = ref(false);
// 拖动的起点坐标
let startX = ref(0), startY = ref(0);

// 鼠标按下时设置状态为可拖拽,并记录xy坐标
function MouseDown(event) {
  isDragging.value = true;
  startX.value = event.clientX;
  startY.value = event.clientY;

  const svg = event.currentTarget;
  // 获取屏幕坐标到 SVG 坐标系的变换矩阵
  const point = svg.createSVGPoint();
  point.x = event.clientX;
  point.y = event.clientY;
  // 将屏幕坐标转换为 SVG 坐标
  const ctm = svg.getScreenCTM().inverse();
  const svgPoint = point.matrixTransform(ctm);

  // 更新相对于 SVG 坐标系的坐标
  if (pointGlowShow.value && (Math.abs(svgPoint.x - pointList[selectPointId.value].x) > 16 || Math.abs(svgPoint.y - pointList[selectPointId.value].y) > 16)) {
    pointGlowShow.value = false
  }
}

let mapX = ref(0), mapY = ref(0), mouseX = ref(0), mouseY = ref(0), showCoords = ref(false);

// 拖动函数
function MouseMove(event) {
  const svg = event.currentTarget;
  // 创建一个SVGPoint对象
  const point = svg.createSVGPoint();
  point.x = event.clientX;
  point.y = event.clientY;
  mouseX.value = event.clientX
  mouseY.value = event.clientY;
  // 转换为SVG内部坐标
  const ctm = svg.getScreenCTM().inverse();
  const svgPoint = point.matrixTransform(ctm);
  mapX.value = Math.round(svgPoint.x / 10) / 10;
  mapY.value = Math.round(svgPoint.y / 10) / 10;
  showCoords.value = true;

  if (!isDragging.value) return;    // 如果鼠标没有按下就不能拖拽
  event.currentTarget.style.cursor = 'move'
  let dx = (startX.value - event.clientX) * (viewBox.value.width / event.currentTarget.clientWidth);
  let dy = (startY.value - event.clientY) * (viewBox.value.height / event.currentTarget.clientHeight);
  viewBox.value.x += dx;
  viewBox.value.y += dy;
  startX.value = event.clientX;
  startY.value = event.clientY;
}

// 鼠标抬起就结束拖拽
function MouseUp(event) {
  showCoords.value = false;
  event.currentTarget.style.cursor = 'default'
  isDragging.value = false;
}

/**
 * 鼠标点击元素事件
 *
 * firstClickTime: 保存鼠标的点击时间; selectItemId: 上一次选中元素的ID
 * selectPointId, selectCarId: 选中点/车的编号; checkedPointId, checkedCarId: 选择弹窗的点/小车ID
 * carGlowShow, pointGlowShow: 控制节点选中效果显示的变量
 * ModalShow: 控制弹窗显示的变量;  type: 选中元素类型, point为节点, car为小车
 * dialogPosition: 弹窗的显示位置跟随鼠标
 */
let firstClickTime = ref(0), selectItemId = ref(''), selectPointId = ref(""), selectCarId = ref(""),
    checkedPointId = ref(''), checkedCarId = ref(''),
    carGlowShow = ref(false), pointGlowShow = ref(false), ModalShow = ref(false), selectType = ref('')
let dialogPosition = ref({top: 100, left: 100})

function handleClick(type, id, data) {
  selectItemId.value = id
  let clickTime = new Date().getTime()
  // 双击唤醒弹窗
  if ((selectItemId.value === id) && (clickTime - firstClickTime.value < 500)) {
    ModalShow.value = false   // 先关
    // 设置弹窗的显示位置
    dialogPosition.value.left = startX.value
    dialogPosition.value.top = startY.value
    if (type === 'point') {
      checkedPointId.value = id
    } else if (type === 'car') {
      checkedCarId.value = id
    }
    console.log(data);
    selectType.value = type
    firstClickTime.value = 0
    setTimeout(() => {
      ModalShow.value = true    //后
    }, 10)
  } else {
    firstClickTime.value = clickTime
    if (type === 'point') {
      selectPointId.value = id
      pointGlowShow.value = true
    } else {
      selectCarId.value = id
      carGlowShow.value = true
    }
  }
}

// 小车运行路线显示函数
let runningPath = reactive([])

function SetRunningPath(data) {
  let array = reactive([])
  for (let i = 0; i < data.length - 1; i++) {
    let startPosition = {
      x: Math.round(((JSON.parse(data[i])[0] / 10) - 7000) * 10) / 10,
      y: Math.round((17000 - (JSON.parse(data[i])[1] / 10)) * 10) / 10
    }
    let endPosition = {
      x: Math.round(((JSON.parse(data[i + 1])[0] / 10) - 7000) * 10) / 10,
      y: Math.round((17000 - (JSON.parse(data[i + 1])[1] / 10)) * 10) / 10
    }
    if (Math.abs(endPosition.x - startPosition.x) > 2 && Math.abs(endPosition.y - startPosition.y) > 2) {
      for (let ii in pathList) {
        if (AroundPoint(startPosition, pathList[ii].start) && AroundPoint(pathList[ii].end, endPosition)) {
          array.push(pathList[ii])
        }
      }
    }
  }
  runningPath = array
}

// 允许起点与终点差值在±2之内
function AroundPoint(a, b) {
  return (Math.abs(a.x - b.x) < 2) && (Math.abs(a.y - b.y) < 2)
}

// 工具栏的位置
let toolBarPosition = ref({top: 20, right: 25});
// let toolBarIsDragging = ref(false);
// // 鼠标定位于元素定位之间的差值
// let toolBarDragOffset = ref({x: 0, y: 0});
// function ToolBarMouseDown(event){
//   toolBarIsDragging.value = true
//   toolBarDragOffset.value = {
//     x: event.clientX - toolBarPosition.value.left,
//     y: event.clientY - toolBarPosition.value.top,
//   };
// }
// function ToolBarMouseMove(event){
//   if (!toolBarIsDragging.value) return;
//   toolBarPosition.value = {
//     top: event.clientY - toolBarDragOffset.value.y,
//     left: event.clientX - toolBarDragOffset.value.x,
//   };
// }
// function ToolBarMouseUp(){
//   toolBarIsDragging.value = false
//   let toolBar = document.getElementById('toolBar')
//   toolBar.style.cursor = 'move';
// }

let fullScreen = ref(false)
let screenElement = ref(null)

// 设置全屏显示
function SetFullScreen() {
  if (!fullScreen.value) {
    screenElement.value.requestFullscreen()
    fullScreen.value = true
  } else {
    document.exitFullscreen();
    fullScreen.value = false
  }
}

// 点击放大/缩小
function SetZoom(enlarge) {
  if (enlarge) {
    viewBox.value.x += (viewBox.value.width - viewBox.value.width / zoomFactor) / 2
    viewBox.value.y += (viewBox.value.height - viewBox.value.height / zoomFactor) / 2
    viewBox.value.width /= zoomFactor;
    viewBox.value.height /= zoomFactor;
  } else {
    viewBox.value.x -= (viewBox.value.width * zoomFactor - viewBox.value.width) / 2
    viewBox.value.y -= (viewBox.value.height * zoomFactor - viewBox.value.height) / 2
    viewBox.value.width *= zoomFactor;
    viewBox.value.height *= zoomFactor;
  }
}

// 重置视口为初始状态
function ResetViewBox() {
  viewBox.value = {
    x: 2000,
    y: 4000,
    width: 7000,
    height: 5000,
  }
}
</script>

<template>
  <div ref="screenElement" class="map_container">
    <div class="map_wrapper" @mousewheel="OnMouseWheel">
      <div class="map_aside">
        <MapAside v-model:robotData="robotData" v-model:selectCarId="selectCarId" v-model:viewBox="viewBox"
                  v-model:carGlowShow="carGlowShow"/>
      </div>
      <svg id="map_svg" :viewBox="`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`"
           @mousedown="MouseDown"
           @mousemove="MouseMove" @mouseup="MouseUp" @mouseleave="MouseUp">
        <!-- 定义符号 -->
        <defs>
          <marker id='arrow' refX='18' orient='auto' markerHeight='1' markerWidth='2' refY='5'
                  viewBox='0 0 10 10'>
            <polygon transform="translate(4.000000, 5.000000) scale(-1, 1) translate(-4.000000, -5.000000) "
                     points="7 2 5.66666667 5 7 8 1 5"></polygon>
          </marker>
          <marker id='reversal' refX='18' orient='auto-start-reverse' markerHeight='1' markerWidth='2' refY='5'
                  viewBox='0 0 10 10'>
            <polygon transform="translate(4.000000, 5.000000) scale(-1, 1) translate(-4.000000, -5.000000) "
                     points="7 2 5.66666667 5 7 8 1 5"></polygon>
          </marker>
          <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" style="stop-color: #FF6315; stop-opacity:1.5"/>
            <stop offset="100%" style="stop-color:orange;stop-opacity:0.3"/>
          </radialGradient>
        </defs>
        <!--地图连接线-->
        <path v-for="(line, index) in pathList" :d="line.d" :key="index" stroke="rgb(244,244,248)" stroke-width="20"
              stroke-linecap="round" fill="transparent" :marker-start="line.type===1?'url(#reversal)':''"
              marker-end="url(#arrow)"/>
        <!--小车运行路径-->
        <path v-for="(line, index) in runningPath" :d="line.d" :key="index" stroke="#2d8cf0" stroke-width="6"
              stroke-linecap="round"
              fill="transparent"/>
        <!--地图点位-->
        <image v-for="(point) in pointList" :key="point.id" :x="point.x - 15" :y="point.y - 15"
               :href="elementList['element_' + point.type]" width="30" height="30"
               @click="handleClick('point', point.id, point)"/>
        <!--点位选中效果-->
        <rect v-if="pointGlowShow" width="32" height="32" :x="pointList[selectPointId].x-16"
              :y="pointList[selectPointId].y-16"
              fill="rgba(237,125,234, 0.6)" stroke-width="2" stroke="rgb(220,0,223)"
              @click="handleClick('point', selectPointId, pointList[selectPointId])"/>
        <!-- 小车光晕效果 -->
        <circle
            v-if="carGlowShow"
            :cx="robotData[selectCarId].posx"
            :cy="robotData[selectCarId].posy"
            r="80"
            fill="url(#grad1)"
        />
        <!-- 小车图标 -->
        <image v-for="(e, i) in robotData" :id="e.robotCode" :key="i" :x="e.posx-40" :y="e.posy-30"
               :href="currentCar(e)" width="80" height="60" :transform="DirCalculate(e)"
               @click="handleClick('car', e.robotCode, e)"/>
      </svg>

      <div id="toolBar" class="tool_container"
           :style="{ top: `${toolBarPosition.top}px`, right: `${toolBarPosition.right}px`}">
        <n-grid style="width: 100%;height: 100%" :cols="4">
          <!--设置视图全屏显示-->
          <n-gi>
            <n-button @click="SetFullScreen">
              <template #icon>
                <n-icon>
                  <ExpandOutline v-if="!fullScreen"/>
                  <ContractOutline v-if="fullScreen"/>
                </n-icon>
              </template>
            </n-button>
          </n-gi>
          <!--放大/缩小视图-->
          <n-gi>
            <n-button @click="SetZoom(true)">
              <template #icon>
                <n-icon>
                  <AddSharp/>
                </n-icon>
              </template>
            </n-button>
          </n-gi>
          <n-gi>
            <n-button @click="SetZoom(false)">
              <template #icon>
                <n-icon>
                  <RemoveSharp/>
                </n-icon>
              </template>
            </n-button>
          </n-gi>
          <!--重置视图-->
          <n-gi>
            <n-button @click="ResetViewBox">
              <template #icon>
                <n-icon>
                  <MapIdentify/>
                </n-icon>
              </template>
            </n-button>
          </n-gi>
        </n-grid>
      </div>
    </div>

    <Dialog v-if="ModalShow" v-model:visible="ModalShow" v-model:checkedCarData="robotData[checkedCarId]"
            v-model:checkedPointData="pointList[checkedPointId]"
            v-model:position="dialogPosition" v-model:selectType="selectType"/>
    <p v-if="mapX>-20 && mapX<220 && mapY>35 && mapY<110 && !isDragging && showCoords" class="mouse_position"
       :style="{ top: `${mouseY + 5}px`, left: `${mouseX - 10}px` }">{{ mapX }},{{ mapY }}</p>
  </div>
</template>

<style scoped>
.map_container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.map_wrapper {
  width: 100%;
  height: 100%;
  background-color: rgb(216, 222, 231);
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.map_aside {
  height: 98%;
  box-sizing: border-box;
  position: absolute;
  top: 1%;
  left: 10px;
}

svg {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.tool_container {
  position: absolute;
  z-index: 100;
  width: 160px;
  height: 30px;
  box-sizing: border-box;
  background-color: rgb(254, 254, 254);
  border-radius: 7px;
}

.n-button {
  width: 100%;
  height: 30px;
}

.mouse_position {
  position: fixed;
  width: 60px;
  height: 12px;
  box-sizing: border-box;
  border-radius: 3px;
  line-height: 12px;
  background-color: rgb(244, 244, 248);
  font-size: 10px;
  user-select: none; /* 标准 */
  -webkit-user-select: none; /* 针对WebKit浏览器 */
  -ms-user-select: none; /* 针对Internet Explorer/Edge */
  -moz-user-select: none; /* 针对Firefox */
}

:deep(.n-button:focus) {
  outline: none;
}
</style>
