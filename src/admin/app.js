import AuthLogo from 'assets/logo-won-dark.svg'
import MenuLogo from 'assets/logo_won.svg'
import FaviconHead from 'assets/favicon.png'

export default {
  config: {
    auth: {
      logo: AuthLogo,
    },
    menu: {
      logo: MenuLogo,
    },
    head: {
      favicon: FaviconHead,
    },
    tutorials: false,
    locales: [
      // 'ar',
      // 'fr',
      // 'cs',
      // 'de',
      // 'dk',
      // 'es',
      // 'he',
      // 'id',
      // 'it',
      // 'ja',
      // 'ko',
      // 'ms',
      // 'nl',
      // 'no',
      // 'pl',
      // 'pt-BR',
      // 'pt',
      // 'ru',
      // 'sk',
      // 'sv',
      // 'th',
      // 'tr',
      // 'uk',
      // 'vi',
      // 'zh-Hans',
      // 'zh',
    ]
    // menu:{
    //   logo:'./extensions/logo-won.svg'
    // }
  },
  bootstrap(app) {
    // console.log(app);
  },
};
