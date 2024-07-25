<template>
  <div class="LineFrom">
    <Form.Form
      :visible="form.visible"
      labelWidth="140px"
      :zlvalue="form"
      :width="900"
      :showDelete="form.showDelete"
      @submit="submitForm"
      @close="closeForm"
    />
  </div>
</template>

<script lang="ts" setup>
/* #region *************************************************************** 引入 *******************************************************************  */
// 公用
import { reactive, onMounted, toRefs, computed, watch, ref } from 'vue';
import isEqual from 'lodash/isequal';
// 组件
import { Form } from '/@/components/index';
// import Dialog from '/@/components/dialog/dialog.vue';
import { RoleForm } from './module/roleForm';
// import ZlUpload from '/@/utils/fileTools';
/* #endregion */

/* #region *************************************************************** 数据准备 ****************************************************************  */
// 数据
const state = reactive({
  // 新增/编辑
  form: new RoleForm()
    .createColumns('enterpriseName', '企业名称', 'input', '无内容', { span: 24, rule: true, autosize: { minRows: 3 } })
    .createColumns('cySlot', '课程期数', ' ', '请选择课程期数', { span: 24, rule: true })
    .createColumns('logo', ' 企业logo', 'ZlSingleUpload', '企业logo', { span: 24, rule: true })
    .createColumns('type', '企业类型', 'select', '企业类型', {
      span: 24,
      rule: true,
      filterable: true,
      options: [
        { label: '在线', value: 1, original: undefined },
        { label: '离线', value: 0, original: undefined },
      ],
    })
    .createColumns('unifiedSocialCreditCode', '统一社会信用代码', 'input', '统一社会信用代码', { span: 24, rule: true })
    .createColumns('contact', '联系人', 'input', '联系人', { span: 24, rule: true })
    .createColumns('contactPhone', '联系人电话', 'input', '电话', { span: 24, rule: true })
    .createColumns('email', '邮箱', 'input', '邮箱', { span: 24, rule: true })
    .createColumns('disabledFlag', '状态', 'select', '状态', {
      span: 24,
      rule: true,
      options: [
        { label: '在线', value: 1, original: undefined },
        { label: '离线', value: 0, original: undefined },
      ],
    })
    .createColumns('ocr', ' 营业执照', 'ZlFileListUpload', '请上传营业执照', { span: 24, rule: true }),
  dialogVisible: false,
  dialogRef: null,
});
const { form, dialogVisible, dialogRef } = toRefs(state);
// 传入传出
const props = defineProps({
  formConfig: { type: Object, default: {} }, // 表单配置
  visible: { type: Boolean, default: false }, // 表单开关
});
const emit = defineEmits(['close', 'submit', 'change', 'delete']);
const isEdit = ref(false);
/* #endregion */

/* #region *************************************************************** 初始化 ******************************************************************  */
// 监听是否打开表单
watch(
  () => props.visible,
  async (nl, ol) => {
    if (!nl) return state.form.close();
    // 设置表格
    state.form.open(props.formConfig.title, props.formConfig.type, {
      formData: props.formConfig.formData,
      showDelete: props.formConfig.showDelete,
      showSubmit: props.formConfig.showSubmit,
    });
    debugger;
    if (!isEqual(props.formConfig.formData, {})) {
      isEdit.value = true;
    } else {
      isEdit.value = false;
    }
  }
);

/* #endregion */

/* #region *************************************************************** 表单操作 **************************************************************  */
const submitForm = () => {
  let result: any;
  if (isEdit.value) {
    result = state.form.QueryUpdateRole(state.form.formData!);
  } else {
    result = state.form.add(state.form.formData!);
  }
  setTimeout(() => {
    if (result) emit('submit');
  }, 1000);
};
const closeForm = () => {
  console.log(false);

  emit('submit');
};
/* #endregion */
onMounted(() => {
  console.log(form.value.visible, 'form.visible');
});
</script>

<style lang="scss" scoped>
.LineFrom {
  .geofenceSlot_box {
    width: 100%;
    height: 600px;
    padding: 12px 20px;
    border-radius: 5px;
    box-sizing: border-box;
  }
}
</style>
