import { boot } from 'quasar/wrappers';

let my_router = null;
export default boot(({ router, app }) => {
  console.log('started router boot');
  my_router = router;
  console.log('router boot', my_router);
});
export { my_router };
