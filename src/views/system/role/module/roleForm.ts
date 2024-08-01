import * as Api from '/@/api';
import * as Utils from '/@/utils';
import { Table } from '/@/components';
import { roleApi } from '/@/api/system/role/role-api';
import { useTable } from '/@/hooks/userTable';
import { Form } from '/@/components/index'
/* #region ************************************************************* 客户管理表单 *************************************************************  */

// 企业管理单数据
export class RoleTreeData {
  roleId?: number;
  roleName?: string;
  remark?: string;
  roleCode?: string;
  roleRisk?: string;
}
// 企业管理表格
// export class RoleForm {
//   constructor(item?: Api.RoleApi.QueryRoleListReq) {

//     if (item) for (const key in this) this[key] = Utils.DataTools.NewMap.ConstructorObjDefault(this, item);
//   }
// }
export class RoleTreeList extends Table.ZlVXETableData<RoleTreeData> {
  constructor() { super(); }

  // 获取查询参数
  search(params: any, isReset?: boolean): RoleTreeList {
    this.searchTable?.getSearch(params, isReset);
    return this;
  }
  // 搜索
  async query(): Promise<boolean> {
    this.searchTable.loading = true;
    let params = new Api.RoleApi.QueryRoleListReq(this.searchTable);
    // // 表格操作 Hooks
    useTable(
      roleApi.queryAll,
      params,
    ).getTableList().then(res => {
      this.tableData = res?.list as RoleTreeData[];
      this.count = res?.count || 0
    })


    return true;
  }
}
export class RoleForm extends Form.ZlForm<RoleTreeData> {
  constructor() { super() }
  async add(param: RoleTreeData) {
    return new Promise((resolve, reject) => {
      Api.RoleApi.QueryAddRole(param).then(res => {
        if (res.code === 0) {
          resolve(true);
        }
      })
    })
  }
  async QueryUpdateRole(params: RoleTreeData) {
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