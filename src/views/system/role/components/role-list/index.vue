<template>
  <a-card class="role-container" style="padding: 0">
    <Table.Table
      :zlvalue="{ ...table, ...tableConfig }"
      :showSearch="true"
      :allSelect="true"
      @getSearch="queryData"
      :pager="false"
      :showSearchRight="false"
      :custom="true"
      :export="true"
    >
      <template #left>
        <div class="default">
          <div class="flex-center">
            <ZlTag style="margin-right: 12px" tagType="button" type="primary" effect="light" size="small" @click="addRole">
              <PlusOutlined /> 新增</ZlTag
            >
          </div>
        </div>
      </template>

      <template #operation="{ row }">
        <el-button link type="primary" @click="roleEdit(row)">编辑</el-button>
        <el-button link type="danger" @click="roleDelete(row)">删除</el-button>
      </template>
    </Table.Table>
    <!-- 新增和编辑 -->
    <Form.Form :visible="form.visible" labelWidth="140px" :zlvalue="form" :showDelete="form.showDelete" @close="close" @submit="submit" />
  </a-card>
</template>
<script setup lang="ts">
import { message, Modal } from 'ant-design-vue';
import _ from 'lodash';
import { computed, onMounted, ref, reactive, toRefs } from 'vue';
// import { h } from 'vue';
// import { DeleteOutlined, EditOutlined } from '@ant-design/icons-vue';
// import { roleApi } from '/@/api/system/role/role-api';
import { SmartLoading } from '/@/components/framework/smart-loading';
import { RoleTreeList } from '/@/views/system/role/index.ts';
import { Table, ZlTag } from '/@/components';

import { Form } from '/@/components/index';
import { FormData } from '/@/components/form/module/index';
import { RoleForm } from '/@/views/system/role/module/roleForm.ts';
import { PlusOutlined } from '@ant-design/icons-vue';

import { ElMessage } from 'element-plus';
// ----------------------- 角色列表显示 ---------------------

// 数据
const state = reactive({
  tableConfig: new Table.ZlVXETable('index', 'roleIndex')
    // .createColumns('', '', '20', { type: 'checkbox', fixed: 'left' })
    .createColumns('index', '序号', '60')
    .createColumns('roleName', '角色', '180', { searchType: 'input' })
    .createColumns('roleRisk', '风险点', '170')
    .createColumns('remark', '备注', '170')
    .createColumns('', '操作', '120', {
      slots: { default: 'operation' },
      fixed: 'right',
    }),
  table: {} as RoleTreeList,
  form: {
    title: '企业类型',
    visible: false,
    type: '',
    formData: new RoleForm()
      .createColumns('roleName', '角色名称', 'input', '请输入', { span: 24, rule: true, autosize: { minRows: 3 } })
      .createColumns('roleCode', '角色编码', 'input', '请输入角色编码', { span: 24, autosize: { minRows: 3 } })
      .createColumns('roleRisk', '风险点', 'textarea', '请输入风险点', { span: 24, autosize: { minRows: 3 } })
      .createColumns('remark', '备注', 'input', '请输入备注', { span: 24 }) as RoleForm,
    showSubmit: true,
    showDelete: false,
  } as FormData,
});
const { tableConfig, table, form } = toRefs(state);

// 查询列表
// 获取list
const queryData = async (params?: any, isReset?: boolean) => {
  state.table.search(params, isReset).query();
};
onMounted(() => {
  state.table = new RoleTreeList();
  queryData();
});

// ----------------------- 添加、修改、删除 ---------------------------------
const addRole = () => {
  state.form.formData.formData = {};
  form.value.visible = true;
};
const close = () => {
  form.value.visible = false;
};
// 提交
const submit = (formData: any) => {
  if (!formData.roleId) {
    // 如果是新增
    state.form.formData.add(formData).then((res) => {
      if (res)
        ElMessage.success({
          message: '新建角色成功',
        });
    });
  } else {
    state.form.formData.QueryUpdateRole(formData).then((res) => {
      if (res)
        ElMessage.success({
          message: '编辑角色成功',
        });
    });
  }
  form.value.visible = false;
  queryData();
};
// 编辑
const roleEdit = (row) => {
  state.form.formData.updateFormData(row);
  form.value.visible = true;
};
// 删除角色
function deleteRole(roleId) {
  if (!roleId) {
    return;
  }
  Modal.confirm({
    title: '提示',
    content: '确定要删除该角色么？',
    okText: '确定',
    okType: 'danger',
    async onOk() {
      SmartLoading.show();
      try {
        await roleApi.deleteRole(roleId);
        message.info('删除成功');
        queryAllRole();
      } catch (e) {
        smartSentry.captureError(e);
      } finally {
        SmartLoading.hide();
      }
    },
    cancelText: '取消',
    onCancel() {},
  });
}

// ----------------------- 以下是暴露的方法内容 ----------------------------
</script>
<style scoped lang="less">
.role-container {
  height: 100%;

  :deep(.ant-card-body) {
    padding: 5px;
  }
}
.ant-menu-inline,
.ant-menu-vertical,
.ant-menu-vertical-left {
  border-right: none;
}
</style>
