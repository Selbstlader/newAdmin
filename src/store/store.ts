import useUserStore from './modules/user'
import useAppStore from './modules/app'
// import usePermissionStore from './modules/permission'
import useSettingStore from './modules/settings'
import useTagsViewStore from './modules/tagsView'
import useUploadStore from './modules/upload'
import useOrgnodeStore from './modules/orgnode'

const useStore = () => ({
  user: useUserStore(), // 判断权限
  app: useAppStore(), //
  // permission: usePermissionStore(), //路由整合，拿到需要路由
  setting: useSettingStore(), //用户设置方法
  tagsView: useTagsViewStore(), // keepAlive 缓存页面
  upload: useUploadStore(), // 上传
  orgnopde: useOrgnodeStore(), // 组织架构
})

export default useStore

