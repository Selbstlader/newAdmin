/*
 * 项目启动入口方法
 *
 * @Author:    1024创新实验室-主任：卓大
 * @Date:      2022-09-06 20:59:23
 * @Wechat:    zhuda1024
 * @Email:     lab1024@163.com
 * @Copyright  1024创新实验室 （ https://1024lab.net ），Since 2012
 */
import * as antIcons from '@ant-design/icons-vue';
import Antd, { message } from 'ant-design-vue';
import lodash from 'lodash';
import { createApp } from 'vue';
import JsonViewer from 'vue3-json-viewer';
import 'vue3-json-viewer/dist/index.css';
import App from './App.vue';
import { smartSentry } from '/@/lib/smart-sentry';
import { loginApi } from '/@/api/system/login/login-api';
import constantsInfo from '/@/constants/index';
import { privilegeDirective } from '/@/directives/privilege';
import i18n from '/@/i18n/index';
import privilegePlugin from '/@/plugins/privilege-plugin';
import smartEnumPlugin from '/@/plugins/smart-enums-plugin';
import { buildRoutes, router } from '/@/router/index';
import { store } from '/@/store/index';
import { useUserStore } from './store/modules/system/user';
import 'ant-design-vue/dist/reset.css';
import 'vue3-tabs-chrome/dist/vue3-tabs-chrome.css';
import '/@/theme/index.less';
import { getTokenFromCookie } from '/@/utils/cookie-util';

import Cookies from 'js-cookie';
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn'

// import '@/assets/styles/index.scss'; // global css
// element css
import 'element-plus/es/components/message/style/css';
import 'element-plus/es/components/message-box/style/css';
import 'element-plus/es/components/notification/style/css';
import 'element-plus/es/components/loading/style/css';
import 'element-plus/dist/index.css';
// VXETable
import VXETable from 'vxe-table'
import VXETablePluginExportXLSX from 'vxe-table-plugin-export-xlsx'
import 'vxe-table/lib/style.css'

// svg图标
import 'virtual:svg-icons-register';
// import SvgIcon from '/@/components/SvgIcon/index.vue';
// import svgIcon from './components/svgIcon.vue';
// import elementIcons from '/@/components/SvgIcon/svgicon';

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import { PAGE_PATH_404, PAGE_PATH_LOGIN } from '/@/constants/common-const';

import { clearAllCoolies } from '/@/utils/cookie-util';
/*
 * -------------------- ※ 着重 解释说明下这里的初始化逻辑 begin ※ --------------------
 *
 * 1、很多框架都是 直接调用vue方法，创建vue实例，然后挂载路由router、状态管理store等等，但是关于router这块是有问题的；
 * 2、现在大部分路由都是从后台返回的，直接挂载，这个时候前端是没有从后端请求到所有路由的，所以只能写到路由拦截器里，这也很绕很不清晰；
 *    比如做法流程应该是：
 *      2.1）如果存在登录信息，则先ajax请求用户的所有路由，然后加载，再去创建vue实例和挂载路由
 *      2.2）如果不存在路由信息，则创建vue实例和挂载路由（此时的路由应该只有login页面，因为用户拥有哪些路由是登录之后才知道的）
 *
 * -------------------- ※ 着重 解释说明下这里的初始化逻辑 end ※ --------------------
 */

/**
 * 获取用户信息和用户权限对应的路由，构建动态路由
 */
async function getLoginInfo() {
  try {
    //获取登录用户信息
    const res = await loginApi.getLoginInfo();
    //构建系统的路由
    let menuRouterList = res.data.menuList.filter((e) => e.path || e.frameUrl);
    buildRoutes(menuRouterList);
    initVue();
    //更新用户信息到pinia
    useUserStore().setUserLoginInfo(res.data);
  } catch (e) {
    message.error(e);
    smartSentry.captureError(e);
    //  长时间未登录跳转登录页面
    if (e.data.code == 30012) {

      clearAllCoolies();
      router.push(PAGE_PATH_LOGIN);
    }

  }
}

function initVue() {
  let vueApp = createApp(App);
  let app = vueApp.use(router).use(store).use(i18n).use(Antd).use(smartEnumPlugin, constantsInfo).use(privilegePlugin).use(JsonViewer).use(ElementPlus, {
    // locale: locale,
    locale: zhCn,
    // 支持 large、default、small
    size: Cookies.get('size') || 'default',
  });

  app.use(VXETable)
  VXETable.use(VXETablePluginExportXLSX)
  //注入权限
  app.directive('privilege', {
    mounted(el, binding) {
      privilegeDirective(el, binding);
    },
  });
  // 注册图标组件
  Object.keys(antIcons).forEach((key) => {
    app.component(key, antIcons[key]);
  });
  // const app = createApp(App)
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
  // app.use(elementIcons);
  // app.component('SvgIcon', SvgIcon);
  // app.component('Svgicon', svgIcon);
  //全局
  app.config.globalProperties.$antIcons = antIcons;
  app.config.globalProperties.$lodash = lodash;
  //挂载
  app.mount('#app');
}

//不需要获取用户信息、用户菜单、用户菜单动态路由，直接初始化vue即可
let token = getTokenFromCookie();
if (!token) {
  initVue();
} else {
  getLoginInfo();
}
