<template>
  <div class="division-list-container">
    <h3 class="title">Division List</h3>

    <div class="actions-container">
      <q-input
        dense
        filled
        v-model="searchQuery"
        placeholder="Search..."
        class="search-input"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <div class="table-container">
      <table class="division-table">
        <thead>
          <tr>
            <th>Division</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(division, index) in filteredDivisions" :key="index" @click="$emit('navigate')">
            <td>{{ division.name }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: "",
      divisions: [
        { name: "Division 1" },
        { name: "Division 2" },
        { name: "Division 3" },
      ],
    };
  },
  computed: {
    filteredDivisions() {
      return this.divisions.filter((division) =>
        division.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
};
</script>

<style scoped>
.division-list-container {
  padding: 20px;
  background: #f9f9f9;
}

.title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.actions-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 10px;
}

.search-input {
  width: 250px;
}

.table-container {
  overflow-x: auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.division-table {
  width: 100%;
  border-collapse: collapse;
}

.division-table th, .division-table td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}

.division-table th {
  background: #e0e0e0;
  font-weight: bold;
}

.division-table tr:hover {
  background-color: #f0f0f0;
  cursor: pointer;
}
</style>
