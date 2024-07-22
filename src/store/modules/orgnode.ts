import { defineStore } from "pinia";
import http from '@/api/api';
import * as MainApi from '@/api';
import * as Utils from '@/utils'

interface OrgnodeState  {
    tree: any;          // 组织架构树
    treeDic: any ;      // 组织架构字典
}


const useOrgnodeStore = defineStore({
  id: "upload",
  state: (): OrgnodeState => ({
    tree: {},
    treeDic: {}
  }),
  actions: {
    init() {
        console.log('123')
        httpQueryOrgnodeTree({} as any);
    }
  }
})

// 获取组织架构树
const httpQueryOrgnodeTree = async (param: MainApi.YjApi.QueryOrgnodeTreeReq) => {
    const {} = await MainApi.YjApi.QueryOrgnodeTree(param);
}

const getTreeDic = (tree: any) => {
    
}

export default useOrgnodeStore;
