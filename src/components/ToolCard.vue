<script setup lang="ts">
interface Tool {
  tool_id: string;
  tool_name: string;
  tool_desc: string;
  tool_image: string;
  sub_tools: any[];
}

interface Props {
  tools: Tool[];
  toolClicked: (
    tool_id: string,
    tool_name: string,
    tool_image: string,
    sub_tools: any[]
  ) => void;
}

const props = withDefaults(defineProps<Props>(), {
  tools: () => [],
});
</script>

<template>
  <div
    v-for="tool in props.tools"
    class="tool-card bg-primary"
    :key="tool.tool_id"
    @click="
      toolClicked(tool.tool_id, tool.tool_name, tool.tool_image, tool.sub_tools)
    "
  >
    <q-avatar size="64px" style="margin: 0.6rem">
      <img
        :src="tool.tool_image"
        :alt="tool.tool_name"
        style="object-fit: cover"
      />
    </q-avatar>

    <div class="card-section">
      <div class="card-section-item text-info">
        <h6>{{ tool.tool_name }}</h6>
      </div>
      <div class="card-section-item text-warning">
        <p>{{ tool.tool_desc }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tool-card {
  display: inline-block;
  min-width: 9rem;
  max-width: 9rem;
  height: 200px;
  overflow: hidden;
  border-radius: 16px;

  padding: 0.5rem;

  box-shadow: 20px -5px 43px -25px rgba(0, 0, 0, 0.34);
  -webkit-box-shadow: 20px -5px 43px -25px rgba(0, 0, 0, 0.34);
  -moz-box-shadow: 20px -5px 43px -25px rgba(0, 0, 0, 0.34);
}

.card-section {
  display: flex;
  flex-direction: column;
  margin: 0 10px 10px 10px;
}

.card-section-item {
  display: inline-block;
}

.card-section-item > p {
  display: -webkit-box;
  -webkit-line-clamp: 3; /* number of lines to display */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  font-family: Roboto, serif;
  font-size: 11px;
  font-weight: 400;
  line-height: 13px;
  text-align: left;
}

.card-section-item > h6 {
  font-family: Roboto, serif;
  font-size: 13px;
  font-weight: 700;
  line-height: 12px;
  letter-spacing: 0;
  text-align: left;
  padding-top: 10px;
  padding-bottom: 10px;
}
</style>
