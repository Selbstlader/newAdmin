<template>
    <div class="zl_dialog">
        <el-dialog title="附件采集" v-model="props.visible" width="450px" :close-on-click-modal="false" :before-close="bindClose">
            <!-- v-if="hirDialogo.show" 影响时间 -->
            <div class="xform">
                <img v-if="isOnline" style="width: 100%; height: 300px;" id="streamimage" 
                    src="http://127.0.0.1:38088/?video=stream&camidx=0" />
                <div v-else class="offLine_box">{{onlineLoading ? '没有检测到高拍仪' : '高拍仪连接中...'}}</div>
            </div>
            <template #footer>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="bindClose">取 消</el-button>
                    <el-button v-if="isOnline" type="primary" :loading="isLoading" @click="bindSub">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script lang="ts" setup>
/* #region ********************************************** 引入 ******************************************************** */
import { computed, ref, watch, onMounted, toRefs, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import * as Api from "/@/api";
import * as Utils  from '/@/utils';

/* #endregion */

/* #region ********************************************** 数据准备 ***************************************************** */

/** 父组件传入和导出 */
const props = defineProps({
    visible: { type: Boolean, default: false}, // 开关
    type: { type: String, default: '' }, // 显示的名字
    group: { type: String, default: '' }, // 上传的文件夹的名称
    fileName: { type: String, default: '' }, // 文件名
    closeCompress: { type: Boolean, default: false }, //图片是否压缩 默认压缩
    savePermission: { type: String, default: '' }, // 保存权限
})
const emit = defineEmits(['close','change']);
/* */

/** 数据 */
const state = reactive<any>({
    isOnline: false,
    onlineLoading: false,// 启动的loading
    isLoading: false, // 提交的loading
    timer: null
})
const { isOnline, isLoading, onlineLoading } = toRefs(state)
/* */

/** 加载、监听和自动计算 */
watch(() => props.visible, (newValue: any, oldValue: any) => {
    if (newValue) {
        state.isOnline = newValue;
        opneService();
    }
}, { deep: true })
/* */
/* #endregion */

/* #region ********************************** 操作 *********************************************** */
/** 检查链接高拍仪 */
const opneService = () => {
    let key = 'video=status';
    httpPostOpenCameraService(key);
}
const httpPostOpenCameraService = async (key: any) => {
    state.isOnline = false;
    state.onlineLoading = false
    setTimeout(() => {
        state.onlineLoading = true;
    }, 3000);
    const res: any = await Api.Common.PostOpenCameraService(key);
    if (res.data.code == 0) {
        if (res.data.video0 === 'no') {
            ElMessage.warning('请检查是否连接高拍仪');
            state.isOnline = false;
        }
        if (res.data.video0 === 'ok' || res.data.video0 == 'run') {
            state.isOnline = true;
        }
    } else {
        ElMessage.warning('请开启CameraService');
        state.isOnline = false;
    }
    state.onlineLoading = true;
}
/* */

/** 关闭 */
const bindClose = () => {
    emit('close');
}
/* */

/** 确认 */
const bindSub = () => {
    state.isLoading = true;
    let key = 'video=grabimage'; // 拍摄
    let param = {
        "camidx": "0", // 文档设备
        "image_process_info": {
            "cut_type": "1", //自动切边
            // multi_object: '1' //是否开启多张 默认 0不开，1开启
        },
    }
    httpPostCameraService(key, param);
}
const httpPostCameraService = async (key: string, param: any) => {
    if (state.timer) {
        clearTimeout(state.timer);
    }
    // 设立新定时器
    state.timer = setTimeout(function () {
        state.isLoading = false;
    }, 6000);
    const res: any = await Api.Common.PostCameraService(key, param);
    if (res.data.code == 0) {
        let raw = res.data.images;
        let imgSrc = 'data:image/jpeg;base64,' + raw[0].base64;
        let fileName = props.fileName;
        let newFils = Utils.FileTools.base64ToFile(imgSrc, fileName);
        // let resUp: any = await Utils.FileTools.ZlCosUpload.UploadAsync(newFils, filePermission[props.savePermission].path, props.group)
        let resUp: any = await Utils.FileTools.ZlCosUpload.UploadAsync(newFils, '高拍仪', props.group)
        let param = resUp.success
        param.size = newFils.size
        emit('change', param)
    } else {
        ElMessage.error(res.message);
    }
}
/* */

/* #endregion */

</script>
<style lang="scss" scoped> 
.xform {
    padding: $smallPadding;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    .offLine_box {
        width: 100%;
        height: 300px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        border-radius: 5px;
    }
}

</style>