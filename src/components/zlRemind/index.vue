<template>
    <div :style="`padding: ${getPadding}`">
        <div v-if="getType == 'icon'">
        <el-tooltip
            :effect="getEffect"
            :placement="getPlacement"
        >
            <template #content> 
                <slot name="content"></slot>
                <slot ></slot>
            </template>
            <QuestionFilled v-if="getIconType == 'QuestionFilled'" class="icon" :style="`color: ${getIconColor}`"  @click="changeType('card')"/>
            <WarningFilled v-if="getIconType == 'WarningFilled'" class="icon" :style="`color: ${getIconColor}`"  @click="changeType('card')"/>
            <Warning v-if="getIconType == 'Warning'" class="icon" :style="`color: ${getIconColor}`"  @click="changeType('card')"/>
            <SuccessFilled v-if="getIconType == 'SuccessFilled'" class="icon" :style="`color: ${getIconColor}`"  @click="changeType('card')"/>
        </el-tooltip>
        </div>
    <div v-else-if="getType == 'card'">
        <ZlTag :type="getCardType" :heightFit="true" tagType="tag">
            <QuestionFilled v-if="getIconType == 'QuestionFilled'" class="icon" style="" :style="`color: ${getIconColor}`"  />
            <WarningFilled v-if="getIconType == 'WarningFilled'" class="icon" :style="`color: ${getIconColor}`" />
            <Warning v-if="getIconType == 'Warning'" class="icon" :style="`color: ${getIconColor}`"  />
            <SuccessFilled v-if="getIconType == 'SuccessFilled'" class="icon" :style="`color: ${getIconColor}`"/>
            <slot></slot>
            <Close class="closeIcon" :style="`color: ${getIconColor}`"  @click="changeType('icon')"/>
        </ZlTag>
    </div>
    </div>
    
</template>
<script lang="ts" setup>
import { computed,ref } from 'vue';
import variables from '/@/assets/styles/export.module.scss';
import {ZlTag} from '../index'

const props = defineProps({
    effect: {
        type: String,
        default: () => 'light'
    },
    placement: {
        type: String,
        default: () => 'top'
    },
    iconType: {
        type: String,
        default: () => 'QuestionFilled'
    },
    iconColor: {
        type: String,
        default: () => '#e6a23c'
    },
    type:  {
        type: String,
        default:() => 'icon'
    },
    id: {
        type: String,
        default: () => ''
    },
    cardType: {
        type: String,
        default: () => 'warning'
    },
    padding: {
        type: String,
        default: () => '0 6px'
    }
})
// 设置padding
const getPadding = computed<string>(() => {
    return props.padding ? props.padding : '0 6px'
})

// 设置类型
const showType = ref('')
const getType = computed<string>(() => {
    let res:string = ''
    if (showType.value) { // 是否是点击过切换
        res = showType.value
    } else { // 正常走
        if (props.id) {
            let param: any = {}
            if (!localStorage.getItem('ZlRemain')) {
                res = props.type ? props.type : 'icon'
                param[props.id] = res
                localStorage.setItem('ZlRemain', JSON.stringify(param))
            } else {
                let ZlRemain = localStorage.getItem('ZlRemain')
                param = ZlRemain ? JSON.parse(ZlRemain) : {}
                if (param[props.id]) {
                    res = param[props.id]
                } else {
                    res = props.type ? props.type : 'icon'
                    param[props.id] = res
                    localStorage.setItem('ZlRemain', JSON.stringify(param))
                }
            }
        } else {
            res = props.type ? props.type : 'icon'
        }
    }
    
    return res
})
// 切换展示方式
const changeType = (type: string) => {
    if (props.id) {
        let param: any = {}
        if (!localStorage.getItem('ZlRemain')) {
            param[props.id] = type
            localStorage.setItem('ZlRemain', JSON.stringify(param))
        } else {
            let ZlRemain = localStorage.getItem('ZlRemain')
            param = ZlRemain ? JSON.parse(ZlRemain) : {}
            if (param[props.id]) {
                param[props.id] = type
                localStorage.setItem('ZlRemain', JSON.stringify(param))
            } else {
                param[props.id] = type
                localStorage.setItem('ZlRemain', JSON.stringify(param))
            }
        }
    }
    showType.value = type
}

// 设置颜色
const getEffect = computed<string>(() => {
    return props.effect ? props.effect : 'light'
})
// 设置出现位置
const getPlacement = computed<any>(() => {
    return props.placement ? props.placement : 'top'
})
//  设置图片类型
const getIconType = computed<string>(() => {
    return props.iconType ? props.iconType : 'QuestionFilled'
})
const getIconColor = computed<string>(() => {
    let res: string = 'QuestionFilled'
    if (props.iconColor) {
        res = props.iconColor
        if (props.iconColor == 'primary') res = variables.primary
        if (props.iconColor == 'success') res = variables.success
        if (props.iconColor == 'warning') res = variables.warning
        if (props.iconColor == 'danger') res = variables.danger
        if (props.iconColor == 'info') res = variables.info 
    }
    return res
})

// 设置卡片类型的颜色类型
const getCardType = computed<string>(() => {
    return props.cardType ? props.cardType == 'primary' ? 'default': props.cardType :'warning'
})
</script>
<style lang="scss" scoped>
.icon {
    cursor: pointer;
    width: 1em; 
    height: 1em;
    margin-right: 6px;
}
.closeIcon {
    cursor: pointer;
    height: 1em;
    width: 1em;
    margin-left: 6px
}
</style>
