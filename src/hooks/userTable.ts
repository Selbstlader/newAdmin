import { Table } from "./interface";
import { reactive, computed, toRefs } from "vue";
import { ElMessage } from 'element-plus';
/**
 * @description table 页面操作方法封装
 * @param {Function} api 获取表格数据 api 方法 (必传)
 * @param {Object} initParam 获取数据初始化参数 (非必传，默认为{})
 * */
export const useTable = (
  api?: (params: any) => Promise<any>,
  initParam: object = {},
) => {
  const state = reactive<Table.StateProps>({
    // 表格数据
    tableData: [],
    // 分页数据
    pageTable: {
      // 当前页数
      page: 1,
      // 每页显示条数
      pageSize: 10,
      // 总条数
      total: 0
    },
    // 查询参数(只包括查询)
    searchParam: {},
    // 初始化默认的查询参数
    searchInitParam: {},
    // 总参数(包含分页和查询参数)
    totalParam: {}
  });

  /**
   * @description 分页查询参数(只包括分页和表格字段排序,其他排序方式可自行配置)
   * */
  const pageParam = computed({
    get: () => {
      return {
        page: state.pageTable.page,
        pageSize: state.pageTable.pageSize
      };
    },
    set: (newVal: any) => {
      console.log("我是分页更新之后的值", newVal);
    }
  });

  /**
   * @description 获取表格数据
   * @return void
   * */
  const getTableList = async () => {
    if (!api) return;
    try {
      // 先把初始化参数和分页参数放到总参数里面
      Object.assign(state.totalParam, initParam);
      let res = await api({ ...state.searchInitParam, ...state.totalParam });
      const { code, data, msg } = res;
      if (code === 0) {
        // 确保list是数组，total是数字
        const processedData = {
          list: Array.isArray(data) ? data : [],
          count: data.total || 0,
        };
        return processedData;
      } else {
        ElMessage.error(msg);
        // 可以选择抛出错误或者返回一个错误状态的对象
        throw new Error(msg); // 或者 return { error: true, message: msg };
      }

    } catch (error) {
      // requestError && requestError(error);
    }
  };


  /**
   * @description 表格数据查询
   * @return void
   * */
  const searchList = () => {
    state.pageTable.page = 1;
    getTableList();
  };

  /**
   * @description 表格数据重置
   * @return void
   * */
  const reset = () => {
    state.pageTable.page = 1;
    // 重置搜索表单的时，如果有默认搜索参数，则重置默认的搜索参数
    state.searchParam = { ...state.searchInitParam };

    getTableList();
  };

  /**
   * @description 每页条数改变
   * @param {Number} val 当前条数
   * @return void
   * */
  const handleSizeChange = (val: number) => {
    state.pageTable.page = 1;
    state.pageTable.pageSize = val;
    getTableList();
  };

  /**
   * @description 当前页改变
   * @param {Number} val 当前页
   * @return void
   * */
  const handleCurrentChange = (val: number) => {
    state.pageTable.page = val;
    getTableList();
  };

  return {
    ...toRefs(state),
    getTableList,
    searchList,
    reset,
    handleSizeChange,
    handleCurrentChange,
  };
};
