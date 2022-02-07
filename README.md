# msal-vue

> MSAL Layer for VueJS

> By Braedon Wooding

Because the alternatives are pretty mediocre... this is a very simple layer that has;
- Typescript support
- Error handling (i.e. if popup fails you can spawn a button to trigger popup, which is more likely to work if you are in some browsers)
- Amongst just a cleaner implementation with less heavy dependencies (no lodash/axios dependency, only msal-browser)

It however, is very lite in terms of extensive features, and doesn't explicitly support things like MSGraph.

## Installation

Add the msal-vue dependency to your project using yarn or npm.  We require a peer dependency of Vue3.

```
npm install msal-vue
```

or

```
yarn add msal-vue
```

## Usage

```ts
import MsalPlugin from 'msal-vue'
 
Vue.use(MsalPlugin, {
    auth: {
        clientId: '<client id>',
        authority: '<url>',
        redirectUri: '<url>'
    },
    cache: {
        cacheLocation: 'localStorage', // Options are localStorage, sessionStorage, memoryStorage
    },
});
 
new Vue({
  // ... vue options as usual
})
```

Configuration is as follows here: [Browser Configuration](https://azuread.github.io/microsoft-authentication-library-for-js/ref/modules/_azure_msal_browser.html#browserconfiguration).

To authenticate it's as simple as follows.

```ts
// Optional scope set can be passed
// default is new ScopeSet(['user.read', 'openid', 'profile', 'email']\
await this.$msal.loginPopup();
// returns an AuthenticationResult which is a standard type in MSAL
// details here: https://azuread.github.io/microsoft-authentication-library-for-js/ref/modules/_azure_msal_common.html#authenticationresult
// but most likely you'll just want to access the `account`

// at any time you can request for it to acquire a new token (in case of 401's)
// as follows... takes in an optional scope set
// default is just new ScopeSet(['user.read']) though
await this.$msal.acquireToken();
// (just returns the access token)

// you can access the user at any time through `.user()`
const user = this.$msal.user();

// are we authenticated?
if (this.$msal.isAuthenticated()) {
  // we can finally also forcefully logout
  this.$msal.logout();
}
```

That covers every bit of functionality in this.  The code itself is also quite readable and overall is just a light layer ontop of msal.

### Advanced Usage

You can access the underlying MSAL library through the `.instance` getter.  This gives you full access to MSAL.

## Nuxt Usage

No clue, I don't use Nuxt; happy for someone to come along and add information here, I doubt it's very complicated (just don't have time to test).

## Contributions

I don't want to maintain a massive library here, so I will be cautious about accepting massive PRs that add extra features such as MS Graph support and so on.
