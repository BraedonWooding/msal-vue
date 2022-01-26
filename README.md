# msal-vue

> MSAL Layer for VueJS

> By Braedon Wooding

Because the alternatives are pretty mediocre... this is a very simple layer that has;
- Typescript support
- Error handling (i.e. if popup fails you can spawn a button to trigger popup, which is more likely to work if you are in some browsers)
- Amongst just a cleaner implementation

## Installation

Add the msal-vue dependency to your project using yarn or npm.

```
npm install msal-vue
```

or

```
yarn add msal-vue
```

## Usage

```ts
import msal from 'msal-vue'
 
Vue.use(msal, {
    auth: {
      clientId: '<YOUR CLIENT ID HERE>'
    }
});
 
new Vue({
  // ... vue options as usual
})
```

## Nuxt Usage

No clue, I don't use Nuxt; happy for someone to come along and add information here, I doubt it's very complicated (just don't have time to test).

## Login/Authentication
