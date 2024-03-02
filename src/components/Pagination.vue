<template>
  <div class="pagination-container">
    <ul class="pagination">
      <template
        v-for="(page, index) in visiblePages"
        :key="
          page.startsWithSeparator
            ? `separator-${index}`
            : `page-${page.number}`
        "
      >
        <li v-if="page.startsWithSeparator" class="pagination-separator">
          ...
        </li>
        <li v-else :class="{ active: current === page.number }">
          <button @click="setCurrent(page.number)">
            {{ page.number }}
          </button>
        </li>
      </template>
    </ul>
  </div>
</template>

<script lang="ts">
import { useRoute } from "vue-router";

export default {
  props: {
    total: { type: Number, required: true },
    limit: { type: Number, required: true },
    modelValue: { type: Number, required: true },
  },
  data() {
    return {
      current: 1,
    };
  },
  mounted() {
     const route = useRoute();
     this.current = this.modelValue;
     if (!this.current && route.query.page)
        this.current = parseInt(route.query.page.toString())
     console.log(`Paginator current page ${this.current}`)
   },
     
  computed: {
    pages() {
      return Math.ceil(this.total / this.limit);
    },

    visiblePages() {
      const pagesCount = Math.ceil(this.total / this.limit);
      const pageThreshold = 10;

      // Show all pages if total pages count <= pageThreshold
      if (pagesCount <= pageThreshold) {
        return Array.from({ length: pagesCount }, (_, i) => {
          return {
            number: i + 1,
            startsWithSeparator: false,
          };
        });
      }

      let visiblePages = [];

      // Always include the first and current page
      visiblePages.push(1, this.current);

      // Include up to (pageThreshold - 2) pages from current page
      for (
        let i = this.current + 1;
        i < this.current + pageThreshold - 2 && i < pagesCount;
        i++
      ) {
        visiblePages.push(i);
      }

      // Always include the last page
      visiblePages.push(pagesCount);

      // Remove duplicates
      visiblePages = [...new Set(visiblePages)];

      // Sort pages
      visiblePages.sort((a, b) => a - b);

      return visiblePages.map((page, index, array) => {
        return {
          number: page,
          startsWithSeparator: index > 0 && array[index - 1] !== page - 1,
        };
      });
    },
  },
  methods: {
    setCurrent(page: number) {
      if (this.current !== page) {
        this.current = page;
        this.$emit("update:modelValue", page);
      }
    },
  },
};
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: center;
}

.pagination {
  display: flex;
  list-style: none;
}
.pagination li {
  margin-right: 10px;
}

.pagination li button {
  cursor: pointer;
  background-color: #f8f9fa;
  padding: 10px 15px;
  border-radius: 5px;
}

.pagination li.active button {
  font-weight: bold;
  background-color: #a8a9ff;
}

.pagination-separator {
  margin-right: 5px;
}
</style>
