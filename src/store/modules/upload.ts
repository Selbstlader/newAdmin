import { defineStore } from "pinia";
import http from '@/api/api';
import * as MainApi from '@/api';
import * as Utils from '@/utils'

interface UploadState  {
    percent: number ; // 上传百分比
}


const useUploadStore = defineStore({
  id: "upload",
  state: (): UploadState => ({
    percent: 0,
  }),
  actions: {
    /** 设置上传百分比
     * @param percentIn 百分比，number
     */
    setPercent(percentIn: number) {
        let percentNumber = percentIn
        if (percentNumber > 100) percentNumber = 100
        if (percentNumber < 0) percentNumber = 0
        this.percent = percentNumber
    },
  }
})

export default useUploadStore;
