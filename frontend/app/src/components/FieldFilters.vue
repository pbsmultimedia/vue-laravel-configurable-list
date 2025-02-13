<script setup>
import { ref, watch, defineProps } from 'vue';
import Checkbox from 'primevue/checkbox';
import Popover from 'primevue/popover';
import Button from 'primevue/button';
import eventBus from '../eventBus';

const props = defineProps({
  fields: {
    type: Array,
    required: true
  }
});

// Extract names from fields
const activeFields = ref(props.fields.map(field => field.name));

// Watch for changes in activeFields
watch(activeFields, (newValue, oldValue) => {
  if (newValue.length === 0) {
    // Restore the last removed field
    activeFields.value = [...oldValue];
    alert('at least one field must be selected');
  }

  eventBus.emit('active-fields-changed', activeFields);
});

const op = ref();

const toggle = (event) => {
  op.value.toggle(event);
}
</script>

<template>
  <div>
    <div class="flex justify-content-end">
      <Button type="button" icon="pi pi-list-check" label="fields" @click="toggle" />
    </div>
    <Popover ref="op">
        <div class="flex flex-col gap-4">
          <ul>
            <li v-for="(field, key) in props.fields" :key="key" class="flex items-center gap-2">
              <Checkbox :value="field.name" v-model="activeFields" :inputId="'field-' + key" />
              <label :for="'field-' + key">
                {{ field.name.replace(/_/g, ' ') }} - {{ field.description }}
              </label>
            </li>
          </ul>
        </div>
      </Popover>
  </div>
</template>

<style scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

li {
  padding: 8px 0;
}
</style>
