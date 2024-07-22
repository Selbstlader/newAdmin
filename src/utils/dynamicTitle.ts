import store from '../store';
import { appDefaultConfig } from '../config/app-config';
import useSettingsStore from '../store/modules/settings';

/**
 * 动态修改标题
 */
export function useDynamicTitle() {
    const settingsStore = useSettingsStore();
    if (settingsStore.dynamicTitle) {
        document.title = settingsStore.title + ' - ' + appDefaultConfig.websiteName;
    } else {
        document.title = appDefaultConfig.websiteName;
    }
}
