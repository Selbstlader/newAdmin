import * as Api from '/@/api';
import * as Utils from '/@/utils';
import { Table } from '/@/components';
import { ElMessage } from 'element-plus';
/* #region ********************************** 人员管理展示 ****************************************** */

// 角色管理实例
export class ShowRoleList {
  /**
   * 姓名
   */
  roleName?: string;
  /**
   * 手机号
   */
  remark?: string;


  // Api.YjApi.QueryCourseInfoListRes
  constructor(item?: Api.RoleApi.QueryRoleListReq) {

    if (item) for (const key in this) this[key] = Utils.DataTools.NewMap.ConstructorObjDefault(this, item);
  }
}
export class roleList extends Table.ZlVXETableData<ShowRoleList> {
  constructor() { super(); }

  // 获取查询参数
  search(params: any, isReset?: boolean): roleList {
    this.searchTable?.getSearch(params, isReset);
    return this;
  }
  // 搜索
  async query(): Promise<boolean> {

    this.searchTable.loading = true;
    const params = new Api.RoleApi.QueryRoleListReq(this.searchTable);
    const res = await Api.RoleApi.QueryRoleList(params);
    const { code, msg, rows, total, data, dataType } = res;

    if (code === 0) {
      data as Api.RoleApi.RoleList[];
      this.tableData = data;
      this.count = data.length || 0;
    } else {
      ElMessage.error(msg);
    }
    return true;
  }

}