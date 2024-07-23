<template>
    <!-- fileListUpload 多个上传组件 -->
    <div class="fileListUpload_box">
      <!-- 上传顶部 -->
      <div class="title_box">
            <el-upload :key="props.key" :disabled="props.disabled " action="" multiple :before-upload="bindBeforeUpload" :http-request="bindUpload"
                :show-file-list="false" >
                <el-tooltip effect="light" content="点击上传" placement="top">
                    <div :class="{btn: true}" :id="props.rowKey">
                        <Plus  style="height: 20px;width: 20px;" />
                    </div>
                </el-tooltip>
            </el-upload>
            <!-- 高拍仪 -->
            <div v-if="props.showHdCamera" class="hdCamera_box" :class="{cursor_d: props.disabled, cursor_p: !props.disabled}" @click="bindOpenHdCamera" >
                <Camera style="width: 12px; height: 12px;" />
                <span class="hdCamera_content">高拍仪</span>
            </div>
            <ZlHdCamera :visible="hdCameraData.visible" :group="props.group || 'fileListUpload'" :type="props.type || '无类型'" :savePermission="props.savePermission" :fileName="hdCameraData.fileName" :closeCompress="props.closeCompress" @close="bindCloseHdCamera" @change="bindChangeHdCamera"/>
            <div class="progress_box">
                <el-progress v-if="loading" :percentage="Number(percent.toFixed(2))" :status="Number(percent) == 100 ? 'success': ''"/>
            </div>
        </div>
        <!-- 下部附件List -->
        <transition>
            <div class="fileList">
                <div class="listItem" v-for="item,index in filesInfo" :key="item.fileID">
                    <div class="align-center">
                        <div class="center" v-if="Utils.FileTools.getFileType(item.fileName||'') == 'image'" style="width: 40px;height:50px">
                            <el-image style="width: 28.8px; height: 35.49px;border-radius: 3px;" :src="item.fullUrl + (props.thumbnail ?  '/thumbnail':'')"
                                :preview-src-list="[item.fullUrl!]" :initial-index="4" fit="cover" />
                        </div>
                        <svgicon v-else :name="Utils.FileTools.getFileType(item.fileName||'')" style="width:40px;height:50px"/>
                    </div>
                    <div class="fileContent flex-column">
                        <span class="mainColor">{{ item.fileName }}</span>
                        <div class="align-center"
                            style="text-align: start;  line-height: 1;margin-top: 6px;font-size: 12px;">
                            <span class="smallFont cjColor" >{{ item.createTime }}</span>
                            <span class="smallFont cjColor margin-l12" >{{ getLength(Number(item.length) || 0) }}</span>
                            <!-- <el-link class="downLoad" type="primary" >下载
                            </el-link> -->
                        </div>
                    </div>
                    <div class="fileIconDownload">
                        <el-icon><Download @click="bindDownLoad(item)" :id="`${props.rowKey}download${index}`"/></el-icon>
                    </div>
                    <div v-if="props.showDelete" class="fileIconDelete">
                        <el-icon :class="{cursor_d: props.disabled }"><Delete @click="bindDeleteFile(item, index)" :id="`${props.rowKey}delete${index}`"/></el-icon>
                    </div>
                    <!-- <div v-if="!filePermission.hasOwnProperty(props.showPermission)" class="noPermission">暂无查看权限</div> -->
                </div>
            </div>
        </transition>
    </div>
</template>
  
<script setup lang="ts">
/* #region ********************************************** 引入 ******************************************************** */
import { reactive, onMounted, ref, toRefs, watch, computed } from "vue";
import { ElMessage, ElUpload, UploadRawFile, UploadRequestOptions,ElMessageBox } from "element-plus";
// 组件
import { ZlHdCamera } from '../index'
import type { UploadProps, UploadUserFile } from 'element-plus'
// 接口
import * as Api from "/@/api";
import { ShowFileListUploadFiles } from './model'
// 方法相关
import * as Utils from '/@/utils'
import { download } from './utils'
// 其它
// import useStore from "@/store/store";

/* #endregion */

/* #region ********************************************** 数据准备 ******************************************************** */
// 全局变量
// const { permission } = useStore();
// let filePermission = permission.file
// console.log('filePermission', filePermission)

/** 父组件传入和导出 */
const props = defineProps({
    modelValue: { type: String, default: '' }, // 传入的值
    rowKey: { type: String, default: '' },          // ID
    type: { type: String, default: '' }, // 显示的名字和上传的type
    group: { type: String, default: '' }, // 分组
    key: { type: String, default: 'unKnownKey', }, // 传入的key
    thumbnail: { type: Boolean, default: true }, // 是否开启缩略图
    showHdCamera: { type: Boolean, default: true }, // 是否显示高拍仪
    showDelete: { type: Boolean, default: true }, // 是否显示删除
    showPreview: { type: Boolean, default: true }, // 是否显示预览
    showDownload: { type: Boolean, default: true }, // 是否显示下载
    fileSize: { type: Number, default: 2 }, // 文件大小限制
    fileType: { type: Array, default: [] }, // 文件类型限制 图片:image 视频:video 
    closeCompress: { type: Boolean, default: false }, // 图片是否压缩 默认压缩
    disabled: { type: Boolean, default: false }, // 是否禁用
    showPermission: { type: String, default: '' }, // 查看权限
    savePermission: { type: String, default: '' }, // 保存权限
});
const emit = defineEmits(['change']);
/* */



/** 数据 */
const state = reactive({
    sizeHW: { // size大小的默认高宽
        default: { height: '146px', width: '233px' },
        small: { height: '117px', width: '187px' },
    },
    filesInfo: [] as ShowFileListUploadFiles[], // 附件数据信息
    uploadDisabled: false, // 是否能够上传
    loading: false, // 上传加载
    // percent: computed(() => Utils.uploadPercent.percent),
    percent: 0,
    hdCameraData: {
        visible: false,
        fileName: ''
    }
});
const { 
    filesInfo,
    uploadDisabled,
    loading,
    percent,
    hdCameraData
} = toRefs(state);
/* */

/** 加载、监听和自动计算 */ 
onMounted(() => {
    if (props.modelValue) {
        let param = props.modelValue.split(',')
        httpPostFileQueryfile(param)
    }
    
})

watch(() => props.modelValue, (nl: any, ol: any) => {
    if (nl && typeof(nl) == 'string') {
        let param = nl.split(',')
        httpPostFileQueryfile(param)
    }
    
})

// // 计算高和宽
// const getHeightWidth = () => {
//     return `height: ${props.height || state.sizeHW[props.size].height};width: ${props.width || state.sizeHW[props.size].width};`
// }

// // 计算背景颜色
// const getBackground = () => {
//     return props.background ? `background: ${props.background};` : ``
// }

/* */

/** 查询附件 */
const httpPostFileQueryfile = async (param: string[]) => {
  const res: Api.SystemApi.QueryFilesResponse = await Api.SystemApi.PostQueryFile(param)
  if (res.code == 200) {
    let showData: ShowFileListUploadFiles[] = []
    if (res.data.length > 0) {
        res.data.forEach((item: Api.SystemApi.FilesItem) => showData.push(new ShowFileListUploadFiles(item)))
    }
    state.filesInfo = showData
  } else {
    if (res.error) ElMessage.error(res.error)
  }
}
/* */

/* #endregion */

/* #region ********************************** 操作 *********************************************** */

/** 上传相关 */
// 上传前
const bindBeforeUpload = (file: UploadRawFile) => {
    // 判断文件类型
    if (props.fileType.length > 0) {
        // let fileType = Utils.getFileType(file.name)
        // if (!props.fileType.toString().includes(fileType)) {
        //     let content: string[] = []
        //     props.fileType.forEach((item: any) => { 
        //         if (item == 'image') content.push('图片')
        //         if (item == 'video') content.push('视频')
        //     })
        //     ElMessage.warning(`上传文件类型只能为：${content.toString()}`);
        //     return false
        // }
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
    state.filesInfo.push(new ShowFileListUploadFiles(res.success, {
        fullUrl: () => Api.COSHost + res.success.filepath + '?key=' + Number(new Date()).toString(),
        filePath: () => res.success.filepath,
        fileID: () => res.success.id,
        type: () => '赢家',
        length: () => options.file.size,
        createTime: () => Utils.TimeTools.Format('yyyy/MM/dd hh:mm')
    }))
    // if (props.ocr) { // 是否进行识别
        //     let path = encodeURI(Api.COSHost + res.success.filepath)
        //     state.filesInfo[state.filesInfo.length - 1].orcInfo = await Utils.ZlOcr.getOcr(props.ocr, path)
        // } 
    let ids: string[] = []
    state.filesInfo.forEach((el: ShowFileListUploadFiles)=> { if (el.fileID) ids.push(el.fileID)})
    let param = {
        fileIDs: ids.toString(),
        fileList: state.filesInfo
    }
    emit('change', param)
    setTimeout(() => {
        loading.value = false     
    }, 1000);
}
/* */

// 获取长度
const getLength = (value: number) => {
    return value >= 1048576 ? `${(value / 1048576).toFixed(2)}M` : `${(value / 1024).toFixed(2)}KB`
}

/** 下载附件 */
const bindDownLoad = (e: ShowFileListUploadFiles) => {
    download(e.fullUrl || '', e.fileName || '')
}
/* */

/** 删除 */
const bindDeleteFile = (item: ShowFileListUploadFiles, index: number) => {
    if (props.disabled) return
    ElMessageBox.confirm( `确认删除吗?`, '删除', {
        confirmButtonText:  '确定',
        cancelButtonText: '取消',
        type: 'warning',
        draggable: true,
        confirmButtonClass:'ExitConfirmButton',
    }).then(() => {
        state.filesInfo.splice(index, 1)
        let ids: string[] = []
        if (state.filesInfo && state.filesInfo.length) state.filesInfo.forEach((el: ShowFileListUploadFiles)=> { if (el.fileID) ids.push(el.fileID)})
        let param = {
            fileIDs: ids.toString(),
            fileList: state.filesInfo
        }
        emit("change", param);
    })
    
}
/* */

/* #endregion */

/* #region ********************************** 高拍仪 *********************************************** */
/** 打开高拍仪 */
const bindOpenHdCamera = () => {
    if (props.disabled) return
    state.hdCameraData.fileName = props.type + '_' + Number(new Date()).toString() + '.jpg'
    state.hdCameraData.visible = true
}
/* */

/** 关闭高拍仪 */
const bindCloseHdCamera = () => {
    state.hdCameraData.visible = false
}
/* */

/** 获取高拍仪数据 */
const bindChangeHdCamera = async (res: any) => {
    state.filesInfo.push(new ShowFileListUploadFiles(res.success, {
        fullUrl: () => Api.COSHost + res.filepath + '?key=' + Number(new Date()).toString(),
        filePath: () => res.filepath,
        fileID: () => res.id,
        type: () => props.type,
        length: () => res.size
    }))
    // if (props.ocr) { // 是否进行识别
    //     let path = encodeURI(Api.COSHost + res.filepath)
    //     state.filesInfo[state.filesInfo.length - 1].orcInfo = await Utils.ZlOcr.getOcr(props.ocr, path)
    // } 
    let ids: string[] = []
    state.filesInfo.forEach((el: ShowFileListUploadFiles)=> { if (el.fileID) ids.push(el.fileID)})
    let param = {
        fileIDs: ids.toString(),
        fileList: state.filesInfo
    }
    emit('change', param)
    state.hdCameraData.visible = false
}
/* */

/* #endregion */
</script>

<style lang="scss" scoped>
.fileListUpload_box {
    width: 100%;
    .title_box {
        display: flex;
        align-items: center;
        width: 100%;
        margin-bottom: 6px;
        .btn {
            // width: 60px;
            color: $cjFontColor;
            display: flex;
            justify-content: center;
            padding: 5px;
            //outline: 1px solid pink;
            background-color: $inputBg;
            box-shadow: 0 0 0 1px var(--el-input-border-color,var(--el-border-color)) inset;
            border-radius: 4px;

            &:hover {
                color: #409EFF;
               // outline: 1px solid $menuHover;
                //background-color: $menuHover;
            }
        }
        .btnNone {
            cursor:not-allowed;
            color: $cjFontColor;
            display: flex;
            justify-content: center;
            padding: 5px;
            //outline: 1px solid $menuHover;
            //background-color: $menuHover;
            border-radius: 4px;
        }
        .hdCamera_box { // 高拍仪
            margin-left: 6px;
            height: fit-content;
            display: flex;
            padding: 5px 8px;
            box-sizing: border-box;
            color: $primary;
            align-items: center;
            .hdCamera_content {
                line-height: 16px;
                margin-left: 6px;
                font-size: 12px;
                
            }
            &:hover {
               // background: pink;
                border-radius: 3px;
            }
        }
        .progress_box {
            height: 100%;
            flex: 1;
            // padding-top: 12px;
            box-sizing: border-box;
            align-items: center;
        }

    }
    
    .fileList {
        width: 100%;
        box-sizing: border-box;
        .listItem {
            width: fit-content;
            display: flex;
            align-items: center;
            position: relative;
            left: -12px;
            padding: 3px 6px;
            box-sizing: border-box;
            margin-bottom: 3px;
            
            &:hover {
                background-color: pink;
                border-radius: 5px;
                cursor: pointer;
            }

            &:hover .downLoad {
                display: block;
                font-size: 12px;
                margin-left: 1.5rem;
            }

            &:hover .fileIconDownload {
                margin-left: 0.7rem;
                opacity: 1;
                color: #409EFF;
                
            }
            &:hover .fileIconDelete {
                margin-left: 0.7rem;
                opacity: 1;
                color: #f56c6c;
                
            }

            .fileContent {
                height: 100%;
                padding: 0 12px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }
            .fileIconDownload {
                opacity: 0;
                color: #bfbfbf;
                &:hover {
                    color: #3a4fff;
                }
            }
            .fileIconDelete {
                opacity: 0;
                color: #bfbfbf;
                &:hover {
                    color: #ff3838;
                }
            }
            .noPermission{
                position: absolute;
                width: 100%;
                height: 100%;
                left: 0;
                top: 0;
               // background: $menuHover;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 5px;
            }
        }
    }
}
// 各种颜色
.hoverColor:hover { // hover字体颜色
  color: $primary;
}
</style>
  