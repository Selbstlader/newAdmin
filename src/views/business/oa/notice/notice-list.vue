<!--
  * 通知  管理列表
  * 
  * @Author:    1024创新实验室-主任：卓大 
  * @Date:      2022-08-21 19:52:43 
  * @Wechat:    zhuda1024 
  * @Email:     lab1024@163.com 
  * @Copyright  1024创新实验室 （ https://1024lab.net ），Since 2012 
-->

<template>
  <div class="bg">
    <div class="header-card">
      <el-icon><RefreshLeft /></el-icon>职工门诊清算审核
    </div>

    <div>
      <Form.Form :visible="form.visible" labelWidth="140px" :zlvalue="form" :showDelete="form.showDelete" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, onMounted } from 'vue';

import { FormData } from '/@/components/form/module/index';
import { Form } from '/@/components/index';
import { RoleForm } from '../enterprise/components/module/roleForm';
const state = reactive({
  form: {
    title: '企业类型',
    visible: true,
    type: '',
    formData: new RoleForm()
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
      .createColumns('ocr', ' 营业执照', 'ZlFileListUpload', '请上传营业执照', { span: 24, rule: true }) as RoleForm,
    showSubmit: true,
    showDelete: false,
  } as FormData,
  isEdit: true,
});
const { form, isEdit } = toRefs(state);
</script>

<style lang="less" scoped>
.bg {
  background: @gray-1;
  height: 100%;
  border-radius: 8px;
  .header-card {
    padding: 14px 14px 0 14px;
  }
}
</style>
