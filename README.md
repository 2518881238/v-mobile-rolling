# js前端无滚动条滑动组件实现
##应用背景
&emsp;&emsp;
一般在日常web页面开发中，经常会遇到滑动区域的操作，pc端开发滚动区域时大都会采用滚动条的形式，而移动端则大多时候滚动条时多余的。
当然，可以想方设法把滚动条隐藏，但是有更多关于滚动限制或者封装组件逻辑时，不是很方便处理。
&emsp;&emsp;
故本文通过css的transform来滑动区域，使用transition来实现滑动过渡。其中包含弹性滑动，快速滑动和慢速滑动，横向滑动，纵向滑动等方案实现。

##技术方案
&emsp;&emsp;
css布局采用外层一个壳子,内层一个绝对定位的待滑动区域即可。滑动时计算好滑动距离，利用css transform来滑动区域，使用transition来实现滑动过渡。
```
transition: transform 100ms cubic-bezier(0.165, 0.84, 0.44, 1) 0s;
transform: translateX();
```
&emsp;&emsp;
另外，在滚动区域需要三个事件触发函数，分别是touchstart，touchmove和touchend。还需要几个计算滚动长度的参数。总体思路就是滑动开始记录滑动位置startX，
滑动过程中叠加滑动距离moveX并且赋值给transform: translateX()。下一次滑动时基于上一次滑动，故需要allMove累计滑动距离。弹性滑动则是滑动时允许超出一段距离，
滑动结束后则减去超出这段距离。即maxUpBounce - maxUp 或者 maxDownBounce - maxDown即可。快速滑动和慢速滑动则是通过计算滑动结束时的速度来计算，速度高，则在实际
滑动距离的基础上加上多余滑动距离值。当然，这个多余滑动距离值和速度呈线性相关。
```$xslt
startX: 0,//鼠标开始滑动的距离
moveX: 0,//鼠标移动的距离
allMove: 0,//鼠标累计移动的距离

maxUpBounce: 0,//最大向上反弹距离
maxDownBounce: 0,//最大向下反弹的距离

maxUp: 0,//最大向右滑动的距离
maxDown: 0,//最大向左滑动的距离

moveTime: 0,//滑动时间
moveDistance: 0,//记录移动距离用于计算滑动结束时的速度
```

```$xslt
sljfl
dlfja
dfjalf
fjalsfj
dakfj
fjal
```
| 左对齐 | 右对齐 | 居中对齐 |
| :-----| ----: | :----: |
| 单元格 | 单元格 | 单元格 |
| 单元格 | 单元格 | 单元格 |

