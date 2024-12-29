import { boot } from 'quasar/wrappers';
import { VueReCaptcha } from 'vue-recaptcha-v3';

export default boot(({ app }) => {
  app.use(VueReCaptcha, {
    siteKey: '6Ld16KMpAAAAAENrA7CKtlDw0zWKeDG5HgIkOXq2',
    loaderOptions: {
      autoHideBadge: true,
    },
  });
});
