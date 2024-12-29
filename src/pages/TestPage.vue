
<template>
  <div class="q-pa-md q-gutter-sm">
    <!-- eslint-disable vue/html-indent -->
    <q-markdown>
```js
var foo = function (bar) {
  return bar++;
};

console.log(foo(5));

```
    </q-markdown>
    <!-- eslint-enable vue/html-indent -->
  </div>
</template>

<script setup>
import {  ref } from 'vue'
import { QMarkdown } from '@quasar/quasar-ui-qmarkdown'
import '@quasar/quasar-ui-qmarkdown/dist/index.css'

const model = ref(false), model2 = ref(false), model3 = ref(false)

</script>
