<script setup>
import { defineProps, ref, computed, onMounted, watch } from 'vue';
import { useQuery, gql } from '@urql/vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Paginator from 'primevue/paginator';
import ProgressSpinner from 'primevue/progressspinner';
import eventBus from '../eventBus';

const props = defineProps({
  fields: {
    type: Array,
    required: true
  }
});

const activeFields = ref(props.fields.map(item => item.name));
const currentPage = ref(1);
const pageSize = ref(5);

// Reactive GraphQL query
const query = ref(gql`
  query ($page: Int!, $first: Int!) {
    users(page: $page, first: $first) {
      data {
        ${activeFields.value.join('\n')}
      }
      paginatorInfo {
        total
        perPage
        currentPage
        lastPage
      }
    }
  }
`);

/*
const q = () => {
  return query.value;
}
*/

let { data, fetching, error, executeQuery } = useQuery({
  // Use the reactive query - must be called like this
  // Passing q as a function reference (without ()) allows to reactively track changes to query.value.
  // Found by accident..! :D
  // query: q,
  query: () => query.value, // simplified.
  variables: {
    page: currentPage,
    first: pageSize
  },
  requestPolicy: 'network-only'
});

onMounted(() => {
  eventBus.on('active-fields-changed', (fields) => {
    activeFields.value = fields.value;
  });
});

// Watch `activeFields` and rebuild query
watch(activeFields, (newFields) => {
  // Update the query dynamically
  query.value = gql`
    query ($page: Int!, $first: Int!) {
      users(page: $page, first: $first) {
        data {
          ${newFields.join('\n')}
        }
        paginatorInfo {
          total
          perPage
          currentPage
          lastPage
        }
      }
    }
  `;

  executeQuery({ requestPolicy: 'network-only' });
});

// Compute columns dynamically
const columns = computed(() => {
  return props.fields.filter(field => activeFields.value.includes(field.name)).map(item => ({
    field: item.name,
    header: item.name.replace(/_/g, ' ')
  }));
});

// Get pagination data from API response
const pagination = computed(() => data?.value?.users?.paginatorInfo || { total: 0 });

// Handle pagination change
const handlePageChange = (event) => {
  currentPage.value = event.page + 1;
  pageSize.value = event.rows;

  executeQuery({
    variables: { page: currentPage.value, first: pageSize.value },
    requestPolicy: 'network-only'
  });
};
</script>

<template>
  <div>
    <ProgressSpinner v-if="fetching" />
    <div v-else-if="error">Error: {{ error.message }}</div>

    <div v-if="!fetching && !error">
      <DataTable :value="data?.users?.data">
        <Column v-for="col in columns" :key="col.field" :field="col.field" :header="col.header" />
      </DataTable>
      <Paginator
        :rows="pagination.perPage"
        :totalRecords="pagination.total"
        :rowsPerPageOptions="[5, 10, 20]"
        @page="handlePageChange"
      />
    </div>
  </div>
</template>
