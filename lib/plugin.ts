import { Configuration } from '@azure/msal-browser';
import Vue, { VueConstructor } from 'vue';
import { MsalLayer } from './main';

declare module 'vue/types/vue' {
    interface Vue {
        $msal: MsalLayer,
    }
}

class MsalPlugin {
    static install(Vue: VueConstructor<Vue>, options: Configuration): void {
        Vue.prototype.$msal = new MsalLayer(options);
    }
}

export {MsalPlugin, MsalLayer, Configuration};
