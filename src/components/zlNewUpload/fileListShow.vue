i<template>
    <div class="warps zl_dialog">
        <transition>
            <div class="fileList" v-if="fileList.length > 0">
                <div class="listItem" v-for="item in fileList" :key="item.id">
                    <div class="align-center">
                        <div class="center" v-if="fileType(item.fileName) == 'image'" style="width: 40px;height:50px">
                            <el-image style="width: 28.8px; height: 35.49px;border-radius: 3px;" :src="item.url" :preview-src-list="[item.url]" preview-teleported
                            :initial-index="0" fit="cover" />
                        </div>
                        <svgicon v-else :name="fileType(item.fileName)" style="width:40px;height:50px"/>
                    </div>
                    <div class="fileContent flex-column">
                        <span class="fileName" @click="downLoadOrViewFile(item, '下载')">{{ item.fileName }}</span>
                        
                        <div class="align-center"
                            style="text-align: start;  line-height: 1;margin-top: 6px;font-size: 12px;">
                            <span style="font-size: 12px;">{{ item['createTime']?Utils.TimeTools.Format('yyyy/MM/dd',new Date(item.createTime)):'' }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="fileList" v-else>
                <div class="listItem">
                    暂无附件信息
                </div>
            </div>
        </transition>
        <el-dialog v-model="dialogVisible" title="预览" append-to-body>
            <div class="filePreview">
                <video autoplay controls v-if="previewInfo.type == 'video'" :src="previewInfo.url"></video>
                <img v-if="previewInfo.type == 'image'" :src="previewInfo.url" alt="加载失败"/>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import {  ref, reactive, toRefs, onMounted, watch } from "vue";
import {
    ElMessage,
} from "element-plus";
import { download } from './utils'
import * as Api from '/@/api'
// 方法相关
import * as Utils from '/@/utils'


const emit = defineEmits(["update:modelValue", 'change']);
const props = defineProps({
    modelValue: {
        type: String,
        default: () => '',
    },
    type: {
        type: String,
        default: () => 'unknowType',
    },
    key: {
        type: String,
        default: () => 'unknowKey',
    },
    disabled: {
        type: Boolean,
        default: () => false,
    },
    closeCompress: { //图片是否压缩 默认压缩
        type: Boolean,
        default: () => false,
    }
});

const loading = ref(false)




const pageData = reactive<any>({
    fileList: [] as any,
    isUploading: false,
    previewInfo: {
        type: "image",
        url: ''
    },
})
const { isUploading, fileList, previewInfo } = toRefs(pageData)


onMounted(() => {
    let fileIDStr = props.modelValue
    console.log('fileIDStr', fileIDStr)
    // console.log('fileIDStr',fileIDStr)
    if (!fileIDStr) return

    let fileIDlist = fileIDStr.constructor == String ? fileIDStr.split(',') : []
    if (!fileIDlist.length) return

    queryFile(fileIDlist)

})
watch(() => props.modelValue, (n, o) => {
    let fileIDStr = props.modelValue
    if (!fileIDStr) return
    let fileIDlist = fileIDStr.constructor == String ? fileIDStr.split(',') : []
    if (!fileIDlist.length) return

    queryFile(fileIDlist)
})
const queryFile = async (fileIDList: string[]) => { 
    const res = await Api.SystemApi.PostQueryFile(fileIDList)
    if (res.code == 1) {
        let raw = Utils.DataTools.deepCopy(res.data) || []
        let fileList: any = []
        let effectiveFileIDList: any = [] //有效的fileID
        if (raw.length) {
            raw.forEach((o: any) => {
            let time = new Date()
            let timeStamp = time.getTime()
            let type = props.type
            if (type == o.fileType) {
                effectiveFileIDList.push(o.fileID)
                fileList.push({
                    fileName: o.fileName,
                    url: Api.COSHost + o.filePath + '?timeStamp=' + timeStamp,
                    id: o.fileID,
                    createTime: o.createTime ? Utils.TimeTools.Format('yyyy-MM-dd hh:mm:ss') : ''
                })
            }

        })
        }
        // console.log('fileList', fileList)
        pageData.fileList = fileList
    } else {
        if (res.error) ElMessage.error(res.error)
    }
}
const dialogVisible = ref(false)

// 下载附件
const downLoadOrViewFile = (e: any, name: string) => {
    let url = e.url
    if (name == '下载') {
        download(url, e.fileName)
        return
    }
    let type = Utils.FileTools.getFileType(e?.fileName || '')
    if (type == 'video' || type == 'image') {
        pageData.previewInfo = {
            type,
            url
        }
        dialogVisible.value = true
    }
}

// 动态计算文件类型
const fileType = (fileName: string): any => {
    let type = Utils.FileTools.getFileType(fileName)
    return type
}
</script>

<style lang="scss" scoped>
.warps {
    width: 100%;
    margin: 0 auto;

    .btn {
        display: flex;
        justify-content: center;
        outline: 1px solid $mainBg;
        background-color: $mainBg;
        border-radius: 4px;

        &:hover {
           // outline: 1px solid $menuHover;
           // background-color: $menuHover;
        }
    }

    .progress {
        flex: 1;
        padding-top: 12px;
        box-sizing: border-box;
    }

    .fileList {
        width: 100%;
        box-sizing: border-box;
    }

    .listItem {
        width: fit-content;
        display: flex;
        align-items: center;
        left: -12px;
        padding: 6px 12px;
        margin: 0 auto;
        &:hover {
            background-color: $mainBg;
            border-radius: 6px;
            cursor: pointer;
        }

        &:hover .downLoad {
            width: 26px;
            display: block;
            font-size: 12px;
        }

        &:hover .fileIcon {
            margin-left: 0.7rem;
            opacity: 1;
        }

        .fileContent {
            padding: 0 12px;
            width: 80%;
            overflow: hidden;
            text-overflow: ellipsis;
            /* 弹性伸缩盒子模型显示 */
            display: -webkit-box;
            /* 限制在一个块元素显示的文本的行数 */
            -webkit-line-clamp: 1;
            /* 设置或检索伸缩盒对象的子元素的；排列方式 */
            -webkit-box-orient: vertical;
        }
    }

    .fileIcon {
        opacity: 0;
    }
}

.filePreview {
    img,
    video {
        width: 100%;
        height: 100%;
    }
}

.fileName {
    line-height: 1;
    &:hover {
        cursor: pointer;
        color: #409eff;
    }
}

.downLoad {
    display: none;
    font-size: 12px;
}
 
.viewDialog {
    background: red;
}
</style>
