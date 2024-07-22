import { lazyImport, VxeResolver } from 'vite-plugin-lazy-import';
import { PluginOption } from 'vite';
export default function createLazyImport() {
    const plugin: PluginOption[] = [];
    plugin.push(
        lazyImport({
            resolvers: [
                VxeResolver({
                    libraryName: 'vxe-table'
                }),
                VxeResolver({
                    libraryName: 'vxe-pc-ui'
                })
            ]
        })
    );
    return plugin;
}
