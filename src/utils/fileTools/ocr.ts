import * as Api from '/@/api'
import {ElMessage } from 'element-plus'
import * as Utils from '/@/utils'

/* #region ********************************** 行驶证接口 ************************************** */
// 行驶证主页
export interface DrivingLicenseFront {
    // 主页
    Address?: string;                // 住址
    EngineNo?: string;               // 发动机号码
    IssueDate?: string;              // 发证日期
    Model?: string;                  // 品牌型号
    Owner?: string;                  // 所有人
    PlateNo?: string;                // 车牌号
    RegisterDate?: string;           // 注册日期（上户日期）
    Seal?: string;                   // 发证机关
    UseCharacter?: string;           // 使用性质
    VehicleType?: string;            // 车辆类型
    Vin?: string;                    // 车辆识别代号（车架号）
    

}
export const DrivingLicenseFrontDic: DrivingLicenseFront = {
    Address: '住址',
    EngineNo: '发动机号码',
    IssueDate: '发证日期',
    Model: '品牌型号',
    Owner: '所有人',
    PlateNo: '车牌号',
    RegisterDate: '注册日期',
    Seal: '发证机关',
    UseCharacter: '使用性质',
    VehicleType: '车辆类型',
    Vin: '车辆识别代号',
}
// 行驶证副页
export interface DrivingLicenseBack {
    AllowNum?: string;               // 核定载人数
    CurbWeight?: string;             // 整备质量
    ExternalSize?: string;           // 外廓尺寸
    FileNo?: string;                 // 档案编号
    LoadQuality?: string;            // 核定载质量
    Marks?: string;                  // 备注
    Record?: string;                 // 记录
    TotalMass?: string;              // 总质量
    TotalQuasiMass?: string;         // 准牵引总质量
}
export const DrivingLicenseBackDic: DrivingLicenseBack = {
    AllowNum: '核定载人数',
    CurbWeight: '整备质量',
    ExternalSize: '外廓尺寸',
    FileNo: '档案编号',
    LoadQuality: '核定载质量',
    Marks: '备注',
    Record: '记录',
    TotalMass: '总质量',
    TotalQuasiMass: '准牵引总质量',
}
/* #endregion */

/* #region ********************************** 居民身份证接口 ************************************** */
// 居民身份证正面
export interface IDCardFront {
    // 主页
    IdNum?: string;               // 身份证号
    Name?: string;                   // 姓名
    Address?: string;                // 身份证地址
    Birth?: string;                  // 出生年月
    Nation?: string;                 // 民族
    Sex?: string;                    // 性别
}
export const IDCardFrontDic: IDCardFront = {
    IdNum: '身份证号',
    Name: '姓名',
    Address: '身份证地址',
    Birth: '出生年月',
    Nation: '民族',
    Sex: '性别',
}
// 居民身份证背面
export interface IDCardBack {
    // 主页
    Authority?: string;               // 发证机关
    ValidDate?: string;               // 身份证有效期
}
export const IDCardBackDic: IDCardBack = {
    Authority: '发证机关',
    ValidDate: '身份证有效期',
}
/* #endregion */

/* #region ********************************** 机动车驾驶证接口 ************************************** */
// 机动车驾驶证主页
export interface DriverDrivingLicenseFront {
    // 主页
    CardCode?: string;               // 驾驶证编号
    Name?: string;                   // 姓名
    Address?: string;                // 身份证地址
    DateofBirth?: string;            // 出生年月
    Class?: string;                  // 驾照类型
    IssuingAuthority?: string;       // 发证机关
    Nationality?: string;            // 国籍
    Sex?: string;                    // 性别
    StartDate?: string;              // 开始日期
    EndDate?: string;                // 到期日期
    DateOfFirstIssue?: string;       // 首次领证日期
}
export const DriverDrivingLicenseFrontDic: DriverDrivingLicenseFront = {
    CardCode: '驾驶证编号',
    Name: '姓名',
    Address: '身份证地址',
    DateofBirth: '出生年月',
    Class: '驾照类型',
    IssuingAuthority: '发证机关',
    Nationality: '国籍',
    Sex: '性别',
    StartDate: '开始日期',
    EndDate: '到期日期',
    DateOfFirstIssue: '首次领证日期',
}
// 机动车驾驶证副页
export interface DriverDrivingLicenseBack {
    // 主页
    ArchivesCode?: string;               // 档案编号
}
export const DriverDrivingLicenseBackDic: DriverDrivingLicenseBack = {
    ArchivesCode: '档案编号',
}
/* #endregion */

export const ZlOcr = {
    /** 识别行驶证后的处理
     * @param info 识别的行驶证信息
     * @param formData 表单数据，不要拷贝
     */
    setDrivingLicense (API: any, type: string,info: any, formData: any, fileID: string) {
        if (!formData || !info) return
        // 证照信息
        const certificateForm = new API.Certificate(formData.certificateForms['机动车行驶证'] || undefined)
        certificateForm.certificateDrivingLicense(type, info, fileID, formData)
        formData.certificateForms['机动车行驶证'] = certificateForm

        // 主页
        if (info.PlateNo) formData.licensePlate = info.PlateNo            // 车牌号
        if (info.Vin) formData.vehicleIdentificationNumber = info.Vin                     // 车架号
        if (info.EngineNo) formData.engineNumber = info.EngineNo          // 发动机号
        if (info.RegisterDate){                                           // 上户日期
            formData.registerDate = info.RegisterDate
        }     

        // 副页
        if (info.AllowNum) formData.seatingCapacity = info.AllowNum            // 准载人数
    },
    setDrivingLicenseCertificate (type: string,info: any, formData: any, fileID: string) {
        if (!formData) return
        formData.certificateDrivingLicense(type, info, fileID, formData)
    },
    /** 识别居民身份证后的处理
     * @param info 识别的身份证信息
     * @param formData 表单数据，不要拷贝
     */
    setIDCard (API: any,type: string, info: any, formData: any, fileID: string) {
        if (!formData) return
        // 证照信息
        let certificateForm = new API.Certificate(formData.certificateForms['居民身份证'] || undefined)
        certificateForm.certificateIDCard(type, info, fileID, formData)
        formData.certificateForms['居民身份证'] = certificateForm

        // 其它
        if (!info) return
        if (info.IdNum) formData.idCardNumber = info.IdNum                                                                                          // 身份证号
        if (info.Name) formData.driverName = info.Name                                                                                              // 驾驶员姓名
        if (info.Birth) formData.birthDate = Utils.TimeTools.Format('yyyy/MM/dd', new Date(info.Birth))                                                // 生日
        if (info.Nation) formData.ethnicGroups = info.Nation                                                                                        // 民族
        if (info.Sex) formData.gender = info.Sex     
        if (info.Address) formData.idCardAddress = info.Address                                                                                               // 性别
        if (info.ValidDate) {
            formData.idCardEndDate = info.ValidDate.split('-')[1] == '长期' ? '2099/12/31' : Utils.TimeTools.Format('yyyy/MM/dd', new Date(info.ValidDate.split('-')[1]))                   // 有效期
            formData.idCardStartDate = Utils.TimeTools.Format('yyyy/MM/dd', new Date(info.ValidDate.split('-')[0]))
        }

    },
    setIDcardCertificate(type: string, info: any, formData: any, fileID: string) {
        if (!formData) return
        formData.certificateIDCard(type, info, fileID, formData)
    },
    /** 识别机动车驾驶证
     * @param info 识别的驾驶证信息
     * @param formData 表单数据，不要拷贝
     */
    setDriverDrivingLicenseCertificate(API: any, type: string, info: any, formData: any, fileID: string) {
        if (!formData) return
        // 证照信息
        let certificateForm = new API.Certificate(formData.certificateForms['机动车驾驶证'] || undefined)
        certificateForm.certificateDriverDrivingLicense(type, info, fileID, formData)
        formData.certificateForms['机动车驾驶证'] = certificateForm

        // 其它
        if (!info) return
        if (info.Class) formData.permittedDriverTypes = info.Class                                                                                          // 准驾类型
        if (info.StartDate) formData.driverLicenseStartDate = Utils.TimeTools.Format('yyyy/MM/dd', new Date(info.StartDate))                                                // 生日
        if (info.EndDate) formData.driverLicenseExpireDate = info.EndDate == '长期' ? '2099/12/31' : Utils.TimeTools.Format('yyyy/MM/dd', new Date(info.EndDate))                   // 有效期
    },
    /*识别*/
    async getOcr(type: string, filePath: string) {
        switch (type) {
            case '居民身份证正面': 
                return await this.OcrIDCardFront(filePath)
            case '居民身份证背面': 
                return await this.OcrIDCardBack(filePath)
            case '机动车行驶证主页': 
                return await this.OcrDrivingPermitFront(filePath)
            case '机动车行驶证副页': 
                return await this.OcrDrivingPermitBack(filePath)
            case '机动车驾驶证主页': 
                return await this.OcrDrivingLicenseFront(filePath)
            case '机动车驾驶证副页': 
                return await this.OcrDrivingLicenseBack(filePath)
            case '驾驶员服务证主页': 
                return await this.OcrZlCertificateIdentifyk(filePath)
            default:
                return undefined
        }
    },
    /** 身份证正面 */
    async OcrIDCardFront (filePath: string) {
        const res = await Api.Common.PostOcrZlIDCardFront(filePath);
        if (res.code == 1) {
            return res.data
        } else {
            ElMessage.error(`请上传正确图片`)
        }
    },
    /** 身份证背面 */
    async OcrIDCardBack (filePath: string) {
        const res = await Api.Common.PostOcrZlIDCardBack(filePath);
        if (res.code == 1) {
            return res.data
        } else {
            ElMessage.error(`请上传正确图片`)
        }
    },
    /** 行驶证主页 */
    async OcrDrivingPermitFront (filePath: string) {
        const res = await Api.Common.PostOcrZlDrivingPermitFront(filePath);
        if (res.code == 1) {
            return res.data
        } else {
            ElMessage.error(`请上传正确图片`)
        }
    },
    /** 行驶证副页 */
    async OcrDrivingPermitBack (filePath: string) {
        const res = await Api.Common.PostOcrZlDrivingPermitBack(filePath);
        if (res.code == 1) {
            return res.data
        } else {
            ElMessage.error(`请上传正确图片`)
        }
    },
    /** 驾驶证主页 */
    async OcrDrivingLicenseFront (filePath: string) {
        const res = await Api.Common.PostOcrZlDrivingLicenseFront(filePath);
        if (res.code == 1) {
            return res.data
        } else {
            ElMessage.error(`请上传正确图片`)
        }
    },
    /** 驾驶证副页 */
    async OcrDrivingLicenseBack (filePath: string) {
        const res = await Api.Common.PostOcrZlDrivingLicenseBack(filePath);
        if (res.code == 1) {
            return res.data
        } else {
            ElMessage.error(`请上传正确图片`)
        }
    },
    /** 服务证 */
    async OcrZlCertificateIdentifyk (filePath: string) {
        const res = await Api.Common.PostOcrZlCertificateIdentify(filePath);
        if (res.code == 1) {
            return res.data
        } else {
            ElMessage.error(`请上传正确图片`)
        }
    },
}


export const getInfoValue = (info: any, key: string) => {
    if (!info) return '--'
    for (let infoKey in info) if (infoKey == key) return info[key]
    return '--'
} 
