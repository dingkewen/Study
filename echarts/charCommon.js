/**
* echarts 基础类
* echarstInit
* @param {any} div id
* @param {any} 参数值 object类型 对应echarts格式
*/
var chartsDic = {};
function echartsInit(id, params) {
	var myChart = echarts.init(document.getElementById(id));

//对颜色进行相关的设置
var colorList;
if (params.color == undefined) {
	colorList = ['#167ce0'];
} else if (params.color.length <= 1) {
	colorList = [params.color[0], params.color[0]]
} else {
	colorList = params.color;
}
// 指定图表的配置项和数据
var option = {
color: colorList,
title: {
id: '', //组件id
show: false, //是否显示标题组件
text: '', //主标题文本
subtext: '', //副标题文本
itemGap: 10, //主副标题之间的间距 
textStyle: {
color: '#fff' //主标题的颜色设置
},
subtextStyle: {
color: '#fff' //副标题的颜色设置
},
textAlign: 'left', //主副标题的水平对齐方式
left: 'left' //标题的显示位置
},
legend: {
type: 'plain', //plain是普通图例，scroll 是可滚动翻页的图例
show: true,
left: 'left', //距离左侧的距离 ['left', 'center', 'right'] 
top: 'bottom', //距离上侧的距离 ['top', 'middle', 'bottom'] 
orient: 'horizontal', //图例的布局朝向['horizontal','vertical']
icon: 'roundRect', //图例项的icon ['circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none']
padding: [0, 25], //图例内边距
itemGap: 15, //图例每项之间的间隔
itemWidth: 10,
itemHeight: 10,
textStyle: { //图例的公用文本样式
color: '#737373'
},
data: ''
},
grid: {
left: '5%', //距离容器左侧的距离
top: '10%', //距离容器上侧的距离
right: '5%', //距离容器右侧的距离
bottom: '10%', //距离容器下侧的距离
containLabel: true //是否包含坐标轴的刻度标签
},
xAxis: [
{
type: 'category', //坐标轴类型['value' 数值轴; 'category' 类目轴; 'time' 时间轴; 'log' 对数轴]
name: '', //坐标轴名称
nameLocation: 'end', //坐标轴名称显示位置 ['start', 'middle' 或者 'center', 'end']
nameTextStyle: { //坐标轴名称的文字样式
color: '#959698'
},
nameGap: 20, //坐标轴名称与轴线之间的距离
nameRotate: '', //坐标轴名字旋转，角度值
boundaryGap: true, //坐标轴两边留白策略
axisLine: { //坐标轴轴线相关设置
lineStyle: {
color: '#737373'
}
},
axisTick: { //x轴刻度相关设置
alignWithLabel: true, //刻度线和标签对齐的对齐方式 
inside: false, //坐标轴刻度是否朝内 [false=朝外, true=朝内]
lineStyle: { // x轴刻度线的相关设置
color: '#737373', //刻度线的颜色
type: 'solid' //坐标轴刻度线的类型 ['solid', 'dashed', 'dotted' ]
}
},
axisLabel: { //x轴坐标轴刻度标签的相关设置
interval: 'auto', //坐标轴刻度的显示间隔 [设置成 0 强制显示所有标签;]
inside: false, //坐标轴刻度是否朝内 [false=朝外, true=朝内]
rotate: '0', //刻度标签旋转的角度
margin: 8, //刻度标签与轴线之间的距离
color: '#959698', //刻度标签文字的颜色
fontSize: '11'
},
splitLine: {
show: false, //是否显示分隔线 [true=显示分割线； false=不显示分割线]
},
data: ''
}
],
yAxis: [
{
type: 'value', //坐标轴类型 ['value' 数值轴; 'category' 类目轴; 'time' 时间轴; 'log' 对数轴]
name: '', //坐标轴名称
nameLocation: 'end', //坐标轴名称显示位置 ['start', 'middle' 或者 'center', 'end']
nameTextStyle: { //坐标轴名称的文字样式
color: '#959698'
},
nameGap: 20, //坐标轴名称与轴线之间的距离
nameRotate: '', //坐标轴名字旋转，角度值
boundaryGap: true, //坐标轴两边留白策略
scale: true, //只在数值轴中（type: 'value'）有效; 是否是脱离 0 值比例，当设置成 true 后坐标刻度不会强制包含零刻度
axisLine: { //坐标轴轴线相关设置
lineStyle: {
color: '#737373'
}
},
axisTick: { //y轴刻度相关设置
alignWithLabel: true, //刻度线和标签对齐的对齐方式 
inside: false, //坐标轴刻度是否朝内 [false=朝外, true=朝内]
lineStyle: { // y轴刻度线的相关设置
color: '#737373', //刻度线的颜色
type: 'solid' //坐标轴刻度线的类型 ['solid', 'dashed', 'dotted' ]
}
},
axisLabel: { //y轴坐标轴刻度标签的相关设置
interval: 'auto', //坐标轴刻度的显示间隔 [设置成 0 强制显示所有标签;]
inside: false, //坐标轴刻度是否朝内 [false=朝外, true=朝内]
rotate: '0', //刻度标签旋转的角度
margin: 8, //刻度标签与轴线之间的距离
color: '#959698', //刻度标签文字的颜色
fontSize: '11'
},
splitLine: { //设置y轴的分割线
show: true, //是否显示分隔线 [true=显示分割线； false=不显示分割线]
lineStyle: {
color: '#33353b', //分割线颜色
width: 1, //分隔线线宽
type: 'dashed', //分隔线线的类型 ['solid', 'dashed', 'dotted']
}
},
data: ''
}
],
dataZoom: { //区域缩放
type: 'slider', // [ inside:内置型数据区域缩放组件; slider:滑动条型数据区域缩放组件 ]
start: 0,
end: 100,
realtime: true, //是否实时刷新
show: false //是否显示组件 [true=显示； false=不显示]
},
tooltip: {
show: true,
trigger: 'axis', //触发类型 ['item':数据项图形触发; 'axis':坐标轴触发; 'none':什么都不触发;]
formatter: '', //提示框浮层内容格式器
axisPointer: { //坐标轴指示器配置项
type: 'shadow', //指示器类型 ['line':直线指示器; 'shadow':阴影指示器; 'none':无指示器; 'cross' 十字准星指示器] 
label: { //坐标轴指示器的文本标签
show: false,
backgroundColor: '#f00'
},
lineStyle: { //当axisPointer.type=line 时有效
color: '#999', //设置线的颜色值
width: '1',//设置线宽
type: 'dashed' //设置线的类型 ['solid' 'dashed' 'dotted']
},
shadowStyle: {}, //当axisPointer.type=shadow 时有效
crossStyle: {}, //当axisPointer.type=cross 时有效
animation: false //是否开启动画 
}
},
toolbox: {
show: false,
orient: 'horizontal', //工具栏 icon 的布局朝向 ['horizontal', 'vertical']
itemSize: 20, //工具栏 icon 的大小
itemGap: 15, //工具栏 icon 每项之间的间隔
feature: { //各工具配置项
dataView: { //数据视图工具
title: '数据展示'
},
magicType: { //图表动态类型切换
show: true,
type: ['line', 'bar', 'stack', 'tiled'], //启用的动态类型 [ 包括'line'=切换为折线图, 'bar'=切换为柱状图, 'stack'=切换为堆叠模式, 'tiled'=切换为平铺模式 ]
title: {
line: '折线图',
bar: '柱状图',
stack: '堆叠图',
tiled: '平铺图'
}
},
saveAsImage: { //保存为图片
show: true,
type: 'png', //保存的图片格式, 支持 'png' 和 'jpeg' 
title: '下载该图片'
},
//dataZoom: { //数据区域缩放
// show: true,
// title: {
// zoom: '区域缩放',
// back: '区域还原',
// yAxisIndex: 'none'
// }
//},
brush: { //选框组件的控制按钮
type: ['rect', 'polygon', 'lineX', 'lineY', 'keep', 'clear'], // [ 'rect'=开启矩形选框选择功能; 'polygon'=开启任意形状选框选择功能; 'lineX'=开启横向选择功能; 'lineY'=开启纵向选择功能; 'keep'=切换『单选』和『多选』模式; 'clear'清空所有选框
},
restore: { //配置项还原
show: true,
title: '重置'
}
}
},
series: [
{
type: '', //定义图表的类型 [line=折线； bar=柱状； pie=饼图; effectScatter=带有涟漪的散点图；map=地图；gauge=仪表盘图；custom=自定义系列 ] 
name: '',
label: { //图形上的文本标签
show: false,
position: ['50%', '10%'], //标签的位置 [默认值是'inside' ]
rotate: '0', //标签旋转 [从 -90 度到 90 度；正值是逆时针 ]
formatter: '{a}\n{c}',
color: '#a6a6a6',
fontSize: 12,
align: 'center' //文字水平对齐方式 ['left', 'center', 'right']
},
itemStyle: {
color: function (params) { //图形的显示颜色设置
return colorList[params.dataIndex];
}
},
emphasis: {}, //高亮的图形及标签样式设置
stack: '', //数据堆叠
barWidth: 'auto', //柱条的宽度

// areaStyle: {}, //当series[i]-line.areaStyle有效，区域填充样式 
hoverAnimation: false, //series[i]-line.hoverAnimation 有效，hover效果
avoidLabelOverlap: false, // series[i]-pie.avoidLabelOverlap有效，是否启用防止标签重叠策略 [true:开启，false关闭]
labelLine: { //series[i]-pie.labelLine有效，标签的视觉引导线样式
show: true //是否显示视觉引导线
},
center: ['50%', '50%'], //series[i]-pie.center有效，饼图的中心（圆心）坐标，数组的第一项是横坐标，第二项是纵坐标
radius: ['55%', '70%'], //series[i]-pie.radius有效，饼图的半径
data: ''
}
]
};
$.extend(true, option, params); // 使用刚指定的配置项和数据显示图表。
myChart.setOption(option);
chartsDic[id] = myChart;
}
function barInit(id, params) {
var barSeries = {
yAxis: [{
nameGap: '12'
}],
series: [{
type: 'bar'
}]
}
$.extend(true, params, barSeries);
return echartsInit(id, params);
}
function pieInit(id, params) {
var barSeries = {
xAxis: [{
show: false
}],
yAxis: [{
show: false
}],
series: [{
type: 'pie',
label: {
show: true
}
}]
}
$.extend(true, params, barSeries);
return echartsInit(id, params);
}
function lineInit(id, params) {
var barSeries = {
yAxis: [{
nameGap: '12'
}],
tooltip: {
axisPointer: {
type: 'cross',
}
},
series: [{
type: 'line'
}]
}
$.extend(true, params, barSeries);
return echartsInit(id, params);
}
function gaugeChart(id, params) {
var myChart = echarts.init(document.getElementById(id));
var option = {
title: {
text: '',
left: 'center',
y: 'bottom',
textStyle: {
color: '#e4fdff', //主标题的颜色设置
fontSize: '16',
fontWeight: 'normal'
},
},
tooltip: {
formatter: "{a} <br/>{b} : {c}%"
},
series: [
{
name: '',
type: 'gauge',
detail: {
formatter: '{value}%', //仪表盘显示数据
fontSize: '20'
},
data: '',
axisLine: { //仪表盘轴线样式
lineStyle: {
width: '18'
}
},
splitLine: { //分割线样式
length: 22
}
//,
//markPoint: {
// symbol: 'circle',
// symbolSize: 6,
// data: [{
// //跟你的仪表盘的中心位置对应上，颜色可以和画板底色一样
// x: 'center',
// y: 'center',
// itemStyle: { color: '#FFF' }
// }]
//}
}
]
};
$.extend(true, option, params);
myChart.setOption(option);
}
function radarChart(id, params) {
var myChart = echarts.init(document.getElementById(id));
var option = {
title: {
text: '',
textStyle: {
color: '#fff',
fontSize: '16'
},
textAlign: 'left',
left: 'left'
},
radar: {
name: {
textStyle: {
color: '#e4fdff'
}
},
indicator: ''
},
series: [{
name: '',
type: 'radar',
data: ''
}]
};
$.extend(true, option, params);
myChart.setOption(option);
}
//地图
function mapChart(id, jsonDataUrl) {
var mapBox = echarts.init(document.getElementById(id));
mapBox.showLoading();
$.getJSON(jsonDataUrl, function (geoJson) {
mapBox.hideLoading();
echarts.registerMap('HF', geoJson);
var mapOption = {
tooltip: {
trigger: 'item',
formatter: '{b}<br/>{c} (p / km2)'
},
series: [{
type: 'map',
name: '合肥市地图区域',
roam: true,
mapType: 'HF', // 自定义扩展图表类型
selectedMode: false,//single 表示单选;multiple表示多选 默认flase不选
itemStyle: {
normal: {
label: { show: true },
areaColor: '#4375ee',
itemStyle: {
color: '#fff'
},
borderWidth: 1,
borderColor: '#dbdfe8'
},
emphasis: {
label: { show: true }
}
}
}]
};
mapBox.setOption(mapOption);
});
}
window.onresize = function () {
//window.location.reload();
$.each(chartsDic,function(index,item){
item.resize();
})
}
s