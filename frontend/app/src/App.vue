<script setup>
import { useQuery, gql } from '@urql/vue'
import ProgressSpinner from 'primevue/progressspinner';
import FieldFilters from './components/FieldFilters.vue'
import ResultsTable from './components/ResultsTable.vue'

// GraphQL introspection query to get the fields of the User type
const INTROSPECTION_QUERY = gql`
  query {
    __type(name: "User") {
      name
      fields {
        name
        description
      }
    }
  }
`

// Execute the query
const { data, fetching, error } = useQuery({
  query: INTROSPECTION_QUERY
})
</script>

<template>
  <div class="flex justify-content-center">
    <div class="grid fixed-width">
      <div class="col-12">
        <ProgressSpinner v-if="fetching" />
        <div v-else-if="error">Error: {{ error.message }}</div>
        <div v-else>
          <h1>Users</h1>
          <FieldFilters :fields="data?.__type?.fields" />
          <hr />
          <ResultsTable :fields="data?.__type?.fields" />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

.fixed-width {
  width: 1280px;
  background: #f9f9f9;
  padding: 1rem;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* Optional for better design */
  border-radius: 8px; /* Optional rounded corners */
}
</style>
