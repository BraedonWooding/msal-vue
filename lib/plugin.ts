import { Configuration } from '@azure/msal-browser';
import Vue, { VueConstructor } from 'vue';
import { MsalLayer } from './main';

declare module 'vue/types/vue' {
    interface Vue {
        $msal: MsalLayer,
    }
}

class MsalPlugin {
    static install(Vue: VueConstructor<Vue>, options: Configuration, customConfig: { method?: string | undefined } | undefined): void {
        Vue.prototype.$msal = new MsalLayer(options, customConfig);
    }
}

export {MsalPlugin, MsalLayer, Configuration};
