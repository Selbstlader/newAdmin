import vue from '@vitejs/plugin-vue';

import createLazyImport from './lazy-import';
import { PluginOption } from 'vite';
import createSvgIcon from './svg-icon';
import createCompression from './compression';
export default function createVitePlugins(viteEnv: Record<string, string>, isBuild = false) {
    const vitePlugins: PluginOption[] = [vue()];
    vitePlugins.push(createLazyImport());
    vitePlugins.push(createSvgIcon(isBuild));
    isBuild && vitePlugins.push(...createCompression(viteEnv));
    return vitePlugins;
}
