import { Configuration } from "@azure/msal-browser";
import { MsalLayer } from "./main";
import { isVue2, isVue3 } from "vue-demi";

declare module "@vue/types/vue" {
  interface Vue {
    $msal: MsalLayer;
  }
}
declare module "vue" {
  interface ComponentCustomProperties {
    $msal: MsalLayer;
  }
}

class MsalPlugin {
  // to annoying to type Vue since it's supporting both vue2 and vue
  static install(Vue: any, options: Configuration): void {
    if (isVue2) {
      Vue.prototype.$msal = new MsalLayer(options);
    } else if (isVue3) {
      Vue.config.globalProperties.$msal = new MsalLayer(options);
    } else {
      throw "Should either be vue2 or vue3, can't detect either";
    }
  }
}

export { MsalPlugin, MsalLayer, Configuration };
