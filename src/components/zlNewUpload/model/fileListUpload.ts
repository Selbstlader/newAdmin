import * as Api from "/@/api";
import * as Utils from '/@/utils' 

/* #region ********************************** fileList展示 *************************************** */
export class ShowFileListUploadFiles {
    tenantID?: number;
    createTime?: string;
    createUserID?: string;
    createUserName?: string;
    deleted?: boolean;
    editTime?: string;
    editUserID?: string;
    editUserName?: string;
    fileID?:  string;
    fileName?: string;
    filePath?: string;
    length?: number;
    memo?: string;
    type?: string;
    userName?: string;

    fullUrl?: string;
    orcInfo?: any;
    constructor(item?: Api.SystemApi.FilesItem, func?: any){
        const obj = item ? Utils.TimeTools.ShowYYYYMMDDHHMMSSTime(item, 0) : undefined
        Utils.DataTools.NewMap.ConstructorObjDefault(this, obj, func);
        if (item?.filePath) this.fullUrl = Api.COSHost + item?.filePath
    }
}

/* #endregion */