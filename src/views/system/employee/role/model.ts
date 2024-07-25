import * as Api from '/@/api';
import * as Utils from '/@/utils';
import { Table } from '/@/components';
import { useTable } from '/@/hooks/userTable';
/* #region ********************************** 人员管理展示 ****************************************** */

// 角色管理实例
export class ShowRoleList {
  /**
   * 企业名称
   */
  enterpriseName?: string;
  /**
     * 统一社会信用代码
     */
  unifiedSocialCreditCode?: string;
  /**
     * 企业类型
     */
  type?: string;
  /**
   * 联系人
   */
  contact?: string
  /**
     * 联系人电话
     */
  contactPhone?: Number
  /**
     * 邮箱
     */
  email?: string
  /**
     * 状态
     */
  disabledFlag?: boolean
  /**
     * 创建人
     */
  createUserName?: string
  /**
     * 创建时间
     */
  createTime?: string

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
    let params = new Api.RoleApi.QueryRoleListReq(this.searchTable);
    params.pageNum = 1;
    // useTable(Api.RoleApi.QueryRoleList, props.initParam, props.pagination, props.dataCallback, props.requestError);
    // const res = await Api.RoleApi.QueryRoleList(params);
    // // 表格操作 Hooks
    useTable(
      Api.RoleApi.QueryRoleList,
      params,
    ).getTableList().then(res => {
      console.log(res);
      this.tableData = res?.list;
      this.count = res?.count || 0
    })


    return true;
  }
}