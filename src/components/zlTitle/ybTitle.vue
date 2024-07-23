<template>
    <!-- 标题组件 -->
    <div class="zltitle_box" :class="props.showHover ? 'showHover' : ''" :style="`border-bottom: ${getBottomLine};cursor: ${getActive};padding: 0 ${props.padding};`">
        <div v-if="props.dot" class="zltitle_dot" :style="`background-color: ${getColor};`"></div>
        <div class="zltitle_content" :style="`color: ${getFontColor};font-size: ${getFontSize};font-weight: ${getFontWeight}`">
            <slot></slot>
        </div>
        <div v-if="showActive" class="zltitle_icon">
            <ArrowDownBold v-if="props.active" style="width: 1em; height: 1em;" :color="variables.cjFontColor" />
            <ArrowRightBold v-else style="width: 1em; height: 1em;" :color="variables.cjFontColor" />
        </div>
    </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import variables from '/@/assets/styles/export.module.scss';

const props = defineProps({
    dot: { type: Boolean, default: false },     // 是否显示小圆点
    type: { // 颜色类型
        type: String,
        default: () => 'primary',
    },
    color: { // 颜色，优先级高于type
        type: String,
        default: () => ''
    },
    fontColor: { // 字体颜色
        type: String,
        default: () => ''
    },
    fontSize: { // 字体大小
        type: String,
        default: () => ''
    },
    fontWeight: { // 字体粗细
        type: String,
        default: () => '700'
    },
    showLine: { // 是否有下划线
        type: Boolean,
        default: () => false
    },
    showActive: { // 是否有点击效果
        type: Boolean,
        default: () => false
    },
    active: { // 是否选择
        type: Boolean,
        default: () => false
    },
    showHover: { // 是否有Hover效果
        type: Boolean,
        default: () => false
    },
    padding: { // 内间距
        type: String,
        default: () => '6px'
    },
})
// 设置颜色
const getColor = computed<string>(() => {
    return props.color ? props.color : variables[props.type]
})
// 设置字体颜色
const getFontColor = computed<string>(() => {
    return props.fontColor ? props.fontColor : variables.titleColor
})
// 设置字体大小
const getFontSize = computed<string>(() => {
    return props.fontSize ? props.fontSize : variables.mainFontSize
})
// 设置字体粗细
const getFontWeight = computed<string>(() => {
    return props.fontWeight
})
// 是否有下划线
const getBottomLine = computed<string>(() => {
    return props.showLine ? variables.mainLine : 'none';
})
// 是否点击效果
const getActive = computed<string>(() => {
    return props.showActive ? 'pointer' : 'default';
})
</script>
<style lang="scss" scoped>
.zltitle_box {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        border-radius: $mainRadius;
    }

    .zltitle_dot {
        height: 16px;
        width: 3px;
        margin-right: 12px;
    }

    .zltitle_content {
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
    }

    .zltitle_icon {
        height: 100%;
        display: flex;
        align-items: center;
    }
}

.showHover:hover {
    // background-color: $menuHover;
}
</style>
