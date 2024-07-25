<template>
  <div class="zlFormV2">
    <el-dialog
      v-model="dialogVisible"
      destroy-on-close
      :close-on-press-escape="props.canEsc"
      :title="props?.zlvalue?.title"
      :close-on-click-modal="false"
      :width="props.width"
      :before-close="closeDialog"
    >
      <!-- 表单数据 -->
      <slot name="body-top"></slot>
      <slot></slot>
      <slot name="body-bottom"></slot>
      <!-- footer区域 -->
      <template #footer>
        <div class="zlFormV2_footer_box">
          <div class="zlFormV2_footer_box_l">
            <el-button
              v-if="props.showDelete"
              :id="`${props.formID}delete`"
              :v-permission="props.permission"
              :type="props.deleteColor ? props.deleteColor : 'danger'"
              @click="deleteClick"
              >{{ props.deleteContent }}</el-button
            >
            <slot name="footer-left" :form="form.formData"></slot>
          </div>
          <div class="zlFormV2_footer_box_r">
            <slot name="footer-right"></slot>
            <el-button type="info" :id="`${props.formID}close`" @click="closeDialog">{{ props.closeContent }}</el-button>
            <el-button
              v-if="props.showSubmit"
              :id="`${props.formID}submit`"
              :loading="form.loading"
              :disabled="props.submitDisabled"
              type="primary"
              @click="submitClick(formRef)"
              >{{ props.submitContent }}</el-button
            >
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { DialogProps } from './interface';
import { reactive, toRefs, ref, watch, onMounted } from 'vue';
import * as Utils from '/@/utils';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance } from 'element-plus';
const props = withDefaults(defineProps<DialogProps>(), {
  formID: '', // 表单ID
  zlvalue: {},
  canEsc: false,
  visible: false,
  width: 500,
  showDelete: true, // 是否展示删除按钮
  deleteContent: '删除', // 删除按钮展示
  showSubmit: true, // 是否显示提交
  deleteDetail: '', // 删除确认框中间提示的内容
  deleteConfirm: true, // 删除确认框中的确认位置内容
  submitContent: '提交', // 提交按钮的内容
  submitDisabled: false, // 提交按钮禁用
  closeContent: '取消', // 提交按钮的内容
  change: false, // 刷新
  sameDisabled: false, // 同，禁用
  deleteColor: '',
  permission: '',
});
// 数据
const state = reactive({
  form: {
    title: props.zlvalue.title,
    loading: props.zlvalue.loading,
    formData: props.zlvalue.formData,
    columns: props.zlvalue.columns,
    menuDataList: props.zlvalue.menuDataList,
    zltagShow: props.zlvalue.zltagShow,
  },
  toNextTick: true,
  dialogVisible: false,
});
const {
  form,
  dialogVisible,
  // manageRangeOption
} = toRefs(state);
/* #region *************************************************************** 初始化 ******************************************************************  */
// 监听是否打开表单
// watch(
//   () => props.visible,
//   async (nl, ol) => {
//     console.log(nl, 'newV');

//     dialogVisible.value = nl;
//   },
//   { deep: true }
// );
// 传出
const emit = defineEmits(['close', 'change', 'submit', 'delete', 'checkMenu', 'changeMenu']);
/** 关闭弹窗
 *
 */
const closeDialog = () => {
  emit('close');
};
/**
 * 删除
 */
/** 删除
 *
 * @param id
 */
const deleteClick = Utils.debounce(() => {
  if (props.deleteConfirm) {
    ElMessageBox.confirm(`${props.deleteDetail}确认${props.deleteContent}吗?`, props.deleteContent, {
      confirmButtonText: props.deleteContent,
      cancelButtonText: '取消',
      type: 'warning',
      draggable: true,
      confirmButtonClass: 'ExitConfirmButton',
    }).then(() => {
      emit('delete', state.form.formData);
    });
  } else {
    emit('delete', state.form.formData);
  }
}, 500);
/**
 * 完成
 */

// 表单ref
const formRef = ref<FormInstance>();
const submitClick = Utils.debounce(async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  try {
    await formEl.validate((valid: any, fields: any) => {
      if (valid) {
        emit('submit', state.form.formData);
      } else {
        console.log('error submit!', fields);
      }
    });
  } catch (error) {
    console.log('error', error);
  }
}, 500);
onMounted(() => {
  console.log(props.visible, 'visible');
});
</script>

<style lang="scss" scoped>
/*Dialog主题样式*/
.zlFormV2 {
  :deep(.el-dialog) {
    border-radius: 5px;
    // background: #262626 !important;
    background: #262626 !important;
    padding: 0;
  }

  :deep(.el-dialog__header) {
    background: $formTitleBg !important;
    margin-right: 0;
    border-radius: 5px 5px 0 0;
    padding: $formPadding;
    box-sizing: border-box;

    .el-dialog__title {
      color: $mainFontColor !important;
    }
  }

  .el-input.is-disabled .el-input__wrapper {
    background-color: none !important;
  }

  :deep(.el-tabs__item) {
    color: $cjFontColor;
  }

  :deep(.el-dialog__body) {
    background: $formBodyBg !important;
    padding: $formPadding 0 !important;
    padding: 0 !important;

    .el-form-item__label {
      color: $mainFontColor;
    }
    .hightBorder {
      position: relative;
      .el-input__wrapper {
        background: $inputBg;
        border: 1px solid #e6a23c;
        box-sizing: border-box;
        .el-input__inner {
          color: $mainFontColor;
        }
      }
      .hightBorder_content {
        position: absolute;
        top: -24px;
        left: 0px;
        display: flex;
        align-items: center;
      }
    }
    .el-input__wrapper {
      background: $inputBg;
      border: $inputBorder;
      // box-shadow: none;
      .el-input__inner {
        color: $mainFontColor;
      }
    }
    .el-select {
      width: 100% !important;
    }

    .el-select-v2__wrapper {
      background: $inputBg;
      // box-shadow: none;
      .el-input__inner {
        color: $mainFontColor;
      }
    }

    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 100% !important;

      .el-input__wrapper {
        width: 100% !important;
        box-sizing: border-box;
      }
    }

    .el-input__wrapper:hover {
      //  background: pink;
      box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
    }

    .el-input-group__append {
      // background: red;
      background-color: transparent;
      border: none;
      // box-shadow: none;
      position: absolute;
      right: 0;
    }

    .el-textarea__inner {
      background: $inputBg;
    }
    // textarea禁用的样式
    .el-textarea.is-disabled {
      background: $inputDisabled !important;
      .el-textarea__inner {
        background: $inputBg;
        // box-shadow: none ;
        &:hover {
          box-shadow: 0 0 0 1px #e4e7ed inset;
        }
      }
    }
    // input禁用
    .el-input.is-disabled .el-input__wrapper {
      background: $inputDisabled;
    }
  }

  :deep(.el-dialog__footer) {
    background: $formFooterBg;
    padding: $formPadding;
    box-sizing: border-box;
    border-radius: 0 0 5px 5px;
  }

  .zlFormV2_body_box {
    padding: $formPadding;
    box-sizing: border-box;
    width: 100%;
    height: auto;

    .hidden {
      height: 0 !important;
      visibility: hidden !important;
      display: none;
    }

    .inputstyle {
      background: red;
    }

    .range_box {
      width: 100%;
      padding-bottom: $mainPadding $mainPadding 0 $mainPadding;
      box-sizing: border-box;
      flex-wrap: wrap;
      display: flex;
      justify-content: start;
      position: relative;
      .range_disabled {
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        z-index: 999;
        position: absolute;
        background: rgba($color: #000000, $alpha: 0);
        cursor: not-allowed;
      }
    }
  }

  .zlFormV2_footer_box {
    display: flex;
    justify-content: space-between;

    .zlFormV2_footer_box_l {
      display: flex;
    }

    .zlFormV2_footer_box_r {
      display: flex;
    }
  }
}
</style>
