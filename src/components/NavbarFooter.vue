<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

const selectedItem = computed(() => {
  let ret = router.currentRoute.value.name;
  if (ret === '' || ret === 'response') {
    ret = 'Home';
  }
  return ret;
});

const footerItems = [
  { label: 'Home', icon: 'home' },
  { label: 'Explore', icon: 'explore' },
  { label: 'History', icon: 'history' },
];

const selectItem = (item: string) => {
  if (item === 'Explore') {
    router.push({ name: 'Explore' });
  } else if (item === 'Home') {
    router.push({ name: 'Home' });
  } else {
    router.push({ name: 'History' });
  }
};
</script>

<template>
  <div class="footer bg-primary">
    <q-list class="navbar-list">
      <q-item
        clickable
        v-for="item in footerItems"
        :key="item.label"
        class="text-warning navbar-item"
        :class="{ 'footer-item': selectedItem === item.label }"
        @click="selectItem(item.label)"
      >
        <div class="nav-icon">
          <q-icon
            :name="item.icon"
            :color="selectedItem === item.label ? 'accent' : 'info'"
            size="sm"
          />
          <div :class="{ 'text-info': selectedItem === item.label }">
            {{ item.label }}
          </div>
        </div>
      </q-item>
    </q-list>
  </div>
</template>

<style scoped>
.footer {
  padding: 10px;
}
.nav-icon {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.footer-item {
  display: flex;
  justify-content: center;
  gap: 0;
}
.navbar-list {
  display: flex;
  justify-content: space-around;
  padding: 0 1rem;
}
.slected-item {
  border-radius: 50px;
}
</style>
