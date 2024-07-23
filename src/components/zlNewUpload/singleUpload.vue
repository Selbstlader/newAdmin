<template>
    <!-- singleUpload 单个上传组件 -->
    <div :key="props.key" class="singleUpload_box"  >
        <div class="singleUpload_inner">
        <!-- 上传组件 -->
        <el-upload v-loading="loading" ref="singleUploadRef" :style="`border-radius: ${props.radius};` + getHeightWidth() + getBackground()" :disabled="(uploadDisabled || props.disabled) " action="" class="singleUpload_upload" :show-file-list="false" 
        :before-upload="bindBeforeUpload" :http-request="bindUpload">
            <template #default>
            <div :id="props.rowKey" :style="`border-radius: ${props.radius};` + getHeightWidth() + getBackground()" class="singleUpload_template hoverColor">
                    <img v-if="fileInfo?.fullUrl" :src="fileInfo?.fullUrl" class="singleUpload_template__img" :style="`border-radius: ${props.radius};`"/>
                    <div v-else class="noFullUrl">
                        <Plus class="_Plus" />
                        <span >{{ props.placeholder }}</span>
                    </div>
                    
                <!-- 工具条 -->
                <div v-if="fileInfo?.fullUrl" class="singleUpload_template__tools" >
                    <!-- 预览图标 -->
                    <el-tooltip effect="light" content="预览" placement="top">
                        <el-image v-if="props.showPreview && fileInfo?.fullUrl" class="singleUpload_template__preview" :src="preview" :preview-src-list="[fileInfo?.fullUrl]" :initial-index="0" fit="cover" :preview-teleported="true" @mouseover="bindMouseover" @mouseleave="bindMouseleave"/>
                    </el-tooltip>
                    <!-- 删除图标 -->
                    <el-icon v-if="props.showDelete && fileInfo?.fullUrl && !props.disabled" class="singleUpload_template__delete" :class="{cursor_d: props.disabled}"
                        @click.stop="bindDeleteFile">
                        <el-tooltip effect="light" :content="props.disabled?'禁用删除':'删除'" placement="top">
                            <CloseBold />
                        </el-tooltip>
                    </el-icon>
                </div>
            </div>
            </template>
        </el-upload>
        <!-- <div v-else :style="`border-radius: ${props.radius};` + getHeightWidth() + getBackground()" class="singleUpload_no">暂无查看权限</div> -->
        <!-- 高拍仪 -->
        <div v-if="props.showHdCamera && !props.disabled" class="hdCamera_box" :class="{cursor_d: props.disabled, cursor_p: !props.disabled}" @click="bindOpenHdCamera" >
        <!-- <div class="hdCamera_box" :class="{cursor_d: props.disabled, cursor_p: !props.disabled}" @click="bindOpenHdCamera" > -->
            <svgicon name="hdCamera"  class="_hdCamera"/>
            <span>启动高拍仪</span>
        </div>
        <ZlHdCamera :visible="hdCameraData.visible" :group="props.group || ''" :type="props.type || ''" isOne :savePermission="props.savePermission" :fileName="hdCameraData.fileName" :closeCompress="props.closeCompress" @close="bindCloseHdCamera" @change="bindSubmitHdCamera"/>
        </div>
        <div v-if="props.showTip" class="singleUpload_pager"><span class="cjColor miniFont">请上传10MB以内的bmp .png .jpg .gif .jpeg格式图</span></div>
    </div>
</template>
  
<script setup lang="ts">
/* #region ********************************************** 引入 ******************************************************** */
import { reactive, onMounted, ref, toRefs, watch, computed, onUpdated,onDeactivated } from "vue";
import { ElMessage, ElUpload, UploadRawFile, UploadRequestOptions, } from "element-plus";
// 组件
import { ZlHdCamera } from '../index'
// 接口
import * as Api from "/@/api";
import { ShowSingleUploadFiles } from './model'
// 方法相关
import * as Utils from '/@/utils'
// 引入图片
import preview from '/@/assets/icons/yulan.svg'
/* #endregion */

/* #region ********************************************** 数据准备 ******************************************************** */

/** 父组件传入和导出 */
const props = defineProps({
    rowKey: {type: String, default: ''},           // ID
    modelValue: { type: String, default: '' }, // 传入的值
    placeholder: { type: String, default: '', }, // 显示的字
    type: { type: String, default: '' }, // 显示的名字和上传的type
    group: { type: String, default: '' }, // 组名
    key: { type: String, default: 'unKnownKey', }, // 传入的key
    size: { type: String, default: 'default', }, // 大小
    height: { type: String, default: '', },// 高度（优先级高于size）
    width: { type: String, default: '', }, // 宽度（优先级高于size）
    radius: { type: String, default: '0px', }, // 圆角
    background: { type: String, default: '' }, // 背景颜色
    thumbnail: { type: Boolean, default: true }, // 是否开启缩略图
    showHdCamera: { type: Boolean, default: true }, // 是否显示高拍仪
    showDelete: { type: Boolean, default: true }, // 是否显示删除
    showPreview: { type: Boolean, default: true }, // 是否显示预览
    fileSize: { type: Number, default: 10 }, // 文件大小限制
    fileType: { type: Array, default: ['image'] }, // 文件类型限制 图片:image 视频:video 
    closeCompress: { type: Boolean, default: false }, // 图片是否压缩 默认压缩
    ocr: { type: String, default: '' }, // orc类型，为空不识别
    disabled: { type: Boolean, default: false }, // 是否禁用
    showPermission: { type: String, default: '' }, // 查看权限
    savePermission: { type: String, default: '' }, // 保存权限
    showTip: { type: Boolean, default: true }, // 是否展示上传的Tip
});
const emit = defineEmits(['change']);
/* */

/** 数据 */
const state = reactive({
    sizeHW: { // size大小的默认高宽
        default: { height: '146px', width: '233px' },
        small: { height: '117px', width: '187px' },
    } as any,
    fileInfo: {} as ShowSingleUploadFiles, // 附件数据信息
    uploadDisabled: false, // 是否能够上传
    loading: false, // 上传加载
    hdCameraData: {
        visible: false,
        fileName: ''
    }
});
const { 
    fileInfo,
    uploadDisabled,
    loading,
    hdCameraData
} = toRefs(state);
/* */

/** 加载、监听和自动计算 */ 
onMounted(() => {
    if (props.modelValue) {
        let param = props.modelValue.toString().split(',')
        httpPostFileQueryfile(param)
        
    }
})

watch(() => props.modelValue, (nl: any, ol: any) => {
    if (nl) {
        let param = nl.toString().split(',')
        httpPostFileQueryfile(param)
    }
    
})



// 计算高和宽
const getHeightWidth = () => {
    return `height: ${props.height || state.sizeHW[props.size].height};width: ${props.width || state.sizeHW[props.size].width};`
}

// 计算背景颜色
const getBackground = () => {
    return props.background ? `background: ${props.background};` : ``
}

/* */

/** 查询附件 */
const httpPostFileQueryfile = async (param: string[]) => {
  const res: Api.SystemApi.QueryFilesResponse = await Api.SystemApi.PostQueryFile(param)
  if (res.code == 1) {
    state.fileInfo = new ShowSingleUploadFiles(res.data.find((o: Api.SystemApi.FilesItem) => o.fileType + o.fileGroup == '赢家' + props.group))
  } else {
    if (res.error) ElMessage.error(res.error)
  }
}
/* */

/* #endregion */

/* #region ********************************** 操作 *********************************************** */

/** 预览阻止upload触发 */
// 预览鼠标移入
const bindMouseover = () => {
    state.uploadDisabled = true
}
// 预览鼠标移出
const bindMouseleave = () => {
    state.uploadDisabled = false
}
/* */

/** 上传相关 */
// 上传前
const bindBeforeUpload = (file: UploadRawFile) => {
    // 判断文件类型
    let fileType = Utils.FileTools.getFileType(file.name)
    // if (props.fileType.length > 0 && !props.fileType.toString().includes(fileType)) {
    if (props.fileType.length > 0 && fileType != 'image') {
        let content: string[] = []
        props.fileType.forEach((item: any) => { 
            if (item == 'image') content.push('图片')
            if (item == 'video') content.push('视频')
        })
        ElMessage.warning(`上传文件类型只能为：${content.toString()}`);
        return false
    }
    // 判断文件大小
    let limit = file.size / 1024 / 1024 > props.fileSize;
    if (props.fileSize == 0) limit = false
    if (limit){
        ElMessage.warning(`上传文件不能大于${props.fileSize}M`);
        return false
    }
    return true;
}

// 上传
const bindUpload = async (options: UploadRequestOptions) => {
    state.loading = true
    let res: any = await Utils.FileTools.ZlCosUpload.UploadAsync(options.file, '赢家', props.group)
    state.fileInfo = new ShowSingleUploadFiles(res.success, {
        fullUrl: () => Api.COSHost + res.success.filepath + '?key=' + Number(new Date()).toString(),
        filePath: () => res.success.filepath,
        fileID: () => res.success.id,
        fileType: () => '赢家',
        length: () => options.file.size
    })
    if (props.ocr) { // 是否进行识别
        let path = encodeURI(Api.COSHost + res.success.filepath)
        state.fileInfo.orcInfo = await Utils.FileTools.ZlOcr.getOcr(props.ocr, path)
        emit("change", state.fileInfo);
    } else {
        emit("change", state.fileInfo);
    }
    loading.value = false
}
/* */

/** 删除 */
const bindDeleteFile = () => {
  if (props.disabled) return
  state.fileInfo = {} as ShowSingleUploadFiles
  emit("change", state.fileInfo);
}
/* */

/* #endregion */

/* #region ********************************** 高拍仪 *********************************************** */
/** 打开高拍仪 */
const bindOpenHdCamera = () => {
    if (props.disabled) return
    state.hdCameraData.fileName = '高拍仪' + new Date().getTime() + '.jpg'
    state.hdCameraData.visible = true
}
/* */

/** 关闭高拍仪 */
const bindCloseHdCamera = () => {
    state.hdCameraData.visible = false
}
/* */

/** 获取高拍仪数据 */
const bindSubmitHdCamera = async (fileIDs: any, res: ShowSingleUploadFiles[]) => {
    state.fileInfo = res[0]
    // if (props.ocr) { // 是否进行识别
    //     let path = encodeURI(Api.MainHost + res[0].filepath)
    //     state.fileInfo.orcInfo = await Utils.ZlOcr.getOcr(props.ocr, path)
    //     emit("change", state.fileInfo);
    // } else {
        emit("change", state.fileInfo);
    // }
    state.hdCameraData.visible = false
}
/* */

/* #endregion */
</script>

<style lang="scss" scoped>
.singleUpload_box {
    display: flex;
    flex-direction: column;
    .singleUpload_inner {
        display: flex;
        .singleUpload_upload {
          //  background: pink;
            .singleUpload_template { // 上传和图片显示
               // background-color: pink;
                font-style: normal;
                font-size: $smallFontSize;
                //border: 1px dashed pink;
                color: $cjFontColor;
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
                box-sizing: border-box;
                .noFullUrl {
                    height: 100%;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    ._Plus {
                        height: 24px;
                        width: 24px;
                        color: #3370FF;
                        
                    }
                }
                &:hover {
                    color: #409eff;
                }
                &__img {
                    height: 100%;
                    width: 100%;
                }
                &__tools {
                    position: absolute;
                    height: 18px;
                    width: 100%;
                    top: 0;
                    background: rgba(0,0,0,0.6);
                    border-radius: 5px 5px 0 0;
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                }
                &__delete { // 删除
                    font-size: 16px;
                    color: #ff4d51 !important;
                    // margin-top: 0px !important;
                    // position: absolute;
                    // right: 6px;
                    // top: 6px;
                    margin-right: 6px;
                    color: #409eff;
                    &:hover {
                        font-size: 18px;
                    }
                }
                &__preview { // 预览
                    height: 12px;
                    width: 12px;
                    // margin-top: 0px !important;
                    // position: absolute;
                    // right: 32px;
                    // top: 8px;
                    margin-right: 6px;
                    font-weight: bold;
                    &:hover {
                        height: 14px;
                        width: 14px;
                    }
                }
            }
            
        }
        .singleUpload_no {
                background-color: pink;
                border: 1px dashed pink;
                box-sizing: border-box;
                font-style: normal;
                font-size: $smallFontSize;
                color: $cjFontColor;
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
                cursor: not-allowed;
            }
        .hdCamera_box { // 高拍仪
            background-color: pink;
            font-style: normal;
            font-size: $smallFontSize;
            border: 1px dashed pink;
            margin-left: 12px;
            width: 100px;
            height: 100px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            color: $cjFontColor;
            ._hdCamera{
                height: 24px;
                width: 24px;
                color: $primary;
            }
            &:hover {
                // background: pink;
                color:#409eff;
                // border-radius: 3px;
            }
        }
    }
    .singleUpload_pager {
        display: flex;
    }
}
// 各种颜色
.hoverColor:hover { // hover字体颜色
  color: $primary;
}
</style>
  