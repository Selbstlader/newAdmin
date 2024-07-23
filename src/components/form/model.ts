import * as Api from '/@/api'
/* #region ************************************************************* 表单配置 *************************************************************  */
export class ZlFormOthers<T> {
    formData?: T;                                   // 数据
    showDelete?: boolean = false;                   // 是否显示删除按钮   
    showSubmit?: boolean = true;                    // 是否提交删除按钮   
    constructor(configs?: {[key: string]: any}) {
        if (!configs) return
        for (let key in this) if (configs.hasOwnProperty(key)) this[key] = configs[key];
    }
    setOthers(others: {[key: string]: any}) {
        for (let key in this) this[key] = others[key];
    }
}

/** ZlFormV2Create类
 * @author CC
 * @DateTime 2022-09-27
 * @version 1.0
 * @param {boolean} visible [可选]弹窗开关 
 * @param {string} title 弹窗标题 
 * @param {ZlFormV2ColumnsCreate} columns 表单配置
 */
export class ZlForm<T> extends ZlFormOthers<T> {
    visible?: boolean;                              // 弹窗开关
    private title: string = '';                             // 弹窗标题
    private loading: boolean = false;                       // 提交按钮loading
    private type: string = '';                              // 弹窗类型
    columns: {[key: string]: ZlFormColumns} = {};   // 表单配置
    constructor() { super() }
    createColumns(field: string, title: string, type: string, placeholder: string, config?: ZlFormColumnsOthers) {
        this.columns[field] = new ZlFormColumns({title, type, placeholder, ...config});
        return this
    }
    // 打开表单
    open(title: string, type: string, others: { [key: string]: any }) {
        this.title = title;
        this.type = type;
        this.visible = true;
        for (let key in this) if (others.hasOwnProperty(key)) this[key] = others[key];
        return this
    }
    // 关闭表单
    close() {
        this.title = ''
        this.formData = undefined;
        this.type = '';
        this.loading = false;
        this.visible = false;
        return this
    }
    // 提交表单
    async submit(formData: T) {}
    // loading
    setLoading(loading: boolean) {
        this.loading = loading;
        return this
    }
}




/** ZlFormV2Columns设置类
 * @author CC
 * @DateTime 2024-06-14
 * @version 1.0
 * @param {number} span [可选]宽度，默认为24，24为一行的宽度
 * @param {boolean} hidden [可选]是否显示，默认为true
 * @param {string} slot [可选]插槽绑定的名称
 * @param {boolean} filterable [可选]当type是select的否是否开启筛选，默认false
 * @param {boolean} disabled [可选]是否禁用，默认false
 * @param {boolean} clearable [可选]是否开启清除，默认false
 * @param {boolean} allowCreate [可选]是否可以创建，默认false
 * @param {boolean} multiple [可选]当type是select的时候，是否开启多选，默认false
 * @param {string} size [可选]大小，默认是'default'
 * @param {boolean} showClose [可选]当type是singleUpload,是否开启图片右上删除图标
 * @param {number} hight [可选]当type是singleUpload，高度
 * @param {number} width [可选]当type是singleUpload，宽度
 * @param {boolean} showHdCamera [可选]当type是singleUpload,是否开启高拍仪
 * @param {boolean} identifyType [可选]当type是singleUpload,是否开启自动识别，识别的自定义字段名
 * @param {string} remindType [可选]当type是title，是否有提醒文字，类型
 * @param {string} remindContent [可选]当type是title，开启提醒，内容
 * @param {string} remindID [可选]当type是title，开启提醒，保存到缓存的id，只有设定了remindID才能保存
 * @param {string} remindID [可选]当type是title，开启提醒，保存到缓存的id，只有设定了remindID才能保存
 * @param {boolean| any} rule [可选]表单验证，true为开启，可以传表单验证的方法
 * @param {ZlFormV2ColumnsSelectOptionsCreate[]} options [可选]当type是select，可以选择选项
 */
export class ZlFormColumnsOthers {
    span?: number; // 宽度，默认为24，24为一行的宽度
    hidden?: boolean; // 是否显示，默认为true
    slot?: string; // 插槽绑定的名称
    filterable?: boolean; // 当type是select的否是否开启筛选
    disabled?: boolean; // 是否禁用
    clearable?: boolean; // 是否开启清除
    allowCreate?: boolean; // 是否可以创建
    multiple?: boolean;// 当type是select的时候，是否开启多选
    showClose?: boolean; // 当type是singleUpload,是否开启图片右上删除图标
    identifyType?: string; // 当type是singleUpload,是否开启自动识别，识别的自定义字段名
    remindType?: string; // 当type是title，是否有提醒文字，类型
    remindContent?: string; // 当type是title，开启提醒，内容
    remindID?: string; // 当type是title，开启提醒，保存到缓存的id，只有设定了remindID才能保存
    rule?: boolean| any; // 表单验证，true为开启，可以传表单验证的方法
    options?: ZlFormColumnsOptions[]; // 当type是select，可以选择选项
    zltagShow?:boolean | any; // form表单新增弹窗判断是否显示
    // collapse-tags?:any | undefined;
    upload?: boolean | any;
    shape?: string;
    rows?: number;
    autosize?: any;
    same?: object; // 显示同
    shortcuts?: any[]; // 时间选择器快速选择
    innerSlot?: string; // 内部插槽
    // ZlSingleUpload
    height?: string; // 当type是singleUpload，高度
    width?: string; // 当type是singleUpload，宽度
    radius?: string; // 圆角
    background?: string; // 背景颜色
    uploadType?: string; // 上传的类型
    group?: string;// 上传的文件夹
    size?: string; // 大小，默认是'default'
    showPreview?:boolean ; // 显示预览
    showDelete?:boolean; // 显示删除
    thumbnail?: boolean; // 图片压缩
    showHdCamera?: boolean; // 显示高拍仪
    fileSize?: number; // 文件大小限制，单位MB，默认2MB
    fileType?: string[]; // 文件类型限制 图片:image 视频:video 
    closeCompress?: boolean; // 图片压缩
    ocr?: string; // OCR识别类型,为空不识别
    showDownload?: boolean; // 是否显示下载
    showPermission?: string; // 查看权限
    savePermission?: string; // 操作权限
    unShow?: boolean; // 是否v-show
    unShowItem?: boolean; // 是否显示el-form-item内部的
    hightBorder?: string; // 是否高亮select边框，描述内容
    // numberCount
    min?: number; // number最小
    max?: number; // number最大
    step?: number; // number步长
    labelWidth?: string; // 

    multipleLimit?: number;        // 多选限制
    inactiveText?: string;         // 
    activeText?: string;           //
    inactiveColor?: string;         // 
    activeColor?: string;           //

    showTip?: boolean = true;
    constructor(params: {[key: string]: any}) {
        for (let key in this) if (params.hasOwnProperty(key)) this[key] = params[key];
    }
}

/** ZlFormV2Columns设置类
 * @author CC
 * @DateTime 2022-09-27
 * @version 1.0
 * @param {string} field 字段
 * @param {string} title 字段名
 * @param {string} type 类型
 * @param {string} placeholder [可选]默认显示
 */
export class ZlFormColumns extends ZlFormColumnsOthers{
    field: string | undefined;      // 字段
    title: string | undefined;      // 字段名
    type: string | undefined;       // 类型
    placeholder?: string ;          // placeholder
    constructor(params: {[key: string]: any}) {
        super(params)
        for (let key in this) if (params.hasOwnProperty(key)) this[key] = params[key];
        if (params.options && params.options.length) this.options = params.options.map((item: any) => new ZlFormColumnsOptions(item));
    }
}

/** ZlFormColumnsOptions
 * @author CC
 * @DateTime 2022-09-27
 * @version 1.0
 * @param {string} label 显示
 * @param {any} value 值
 */
export class ZlFormColumnsOptions {
    label: string = '';             // 显示
    value: any = undefined;         // 值
    original: any = undefined;      // 值
    constructor(params: {[key: string]: any}) {
        for (let key in this) if (params.hasOwnProperty(key)) this[key] = params[key];
    }
}
/* #endregion */
