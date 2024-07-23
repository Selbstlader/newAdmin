import * as Api from '/@/api';
import * as Utils from '/@/utils';
import { Form } from '/@/components/index'

/* #region ************************************************************* 客户管理表单 *************************************************************  */

// 企业管理单数据
export class RoleFormData {
  enterpriseName?: string;
  type?: string;
  contact?: string;
  contactPhone?: string;
  unifiedSocialCreditCode?: string;
  email?: string;
  // 启用状态
  disabledFlag?: boolean;
  constructor(item?: any) {
    // Utils.DataTools.NewMap.ConstructorObjDefault(this, item);
    // let cySlot = [] as any
    // if (item.courseName) cySlot[0] = item.courseName
    // if (item.courseId) cySlot[1] = item.courseId+''
    // this.cySlot = cySlot
    // console.log('cySlot', cySlot, item)
  }
}
// 企业管理表格
export class RoleForm extends Form.ZlForm<RoleFormData> {
  constructor() { super() }
  async add(params: RoleFormData) {
    return new Promise((resolve, reject) => {
      Api.RoleApi.QueryAddRole(params).then(res => {
        if (res.code === 0) {
          resolve(true);
        }
      })
    })
  }
  async QueryUpdateRole(params: RoleFormData) {
    return new Promise((resolve, reject) => {
      Api.RoleApi.QueryUpdateRole(params).then(res => {
        if (res.code === 0) {
          resolve(true);
        }
      })
    })
  }
}
/* #endregion */