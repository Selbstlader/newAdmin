// export { default as RoleForm } from './RoleForm.vue';
export * from '../../../views/business/oa/enterprise/components/forms';


export interface FormData {
    // 表单数据
    formData: any;
    title: string;
    type: string;
    showSubmit: boolean;
    showDelete: boolean;
    visible: boolean;
}
