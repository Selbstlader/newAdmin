export interface DialogProps {
  formID: string, // 表单ID
  visible: boolean, // 是否打开表格
  zlvalue: any, // 表格数据
  canEsc: boolean, // 是否能够通过ESC关闭
  width: number,
  showDelete: boolean, // 是否展示删除按钮
  deleteContent: string, // 删除按钮展示
  showSubmit: boolean, // 是否显示提交
  deleteDetail: string, // 删除确认框中间提示的内容
  deleteConfirm: boolean, // 删除确认框中的确认位置内容
  submitContent: string, // 提交按钮的内容
  submitDisabled: boolean, // 提交按钮禁用
  closeContent: string, // 提交按钮的内容
  change: boolean, // 刷新
  sameDisabled: boolean, // 同，禁用
  deleteColor: string,
  permission: string,
}