<template>
  <div v-if="totalPages > 0">
    <PageButton
      v-for="(button, key) in buttons"
      :key="key"
      :html="button.html"
      :active="button.active"
      :disabled="button.disabled"
      @page-change="$emit('page-change', button.page)"
    />
  </div>
</template>

<script lang='ts'>
import PageButton from "./PageButton.vue";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { type } from "os";

@Component({
  components: {
    PageButton
  }
})
export default class Pagination extends Vue {
  @Prop() page!: number;
  @Watch("page") pageChange(page: number) {
    if (page >= this.totalPages) {
      throw new Error(
        "page may be maximum the total number of pages minus one"
      );
    }
    this.rangeChange();
  }

  @Prop() itemsPerPage!: number;
  @Watch("itemsPerPage") itemsPerPageChanged() {
    this.rangeChange();
  }

  @Prop() totalItems!: number;
  @Watch("totalItems") totalItemsChanged() {
    this.rangeChange();
  }

  @Prop() maxVisiblePages!: number;

  rangeChange() {
    this.$emit("range-change", this.start, this.end);
  }

  get start() {
    return this.page * this.itemsPerPage;
  }

  get end() {
    let end = this.start + this.itemsPerPage;

    return this.totalItems < end ? this.totalItems : end;
  }

  get totalPages() {
    if (this.itemsPerPage === 0) {
      return 0;
    }

    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get pages() {
    let filteredPages = this.filteredPages;
    let pages = filteredPages
      ? [
          filteredPages[0] - 1 === 1 ? 1 : "...",
          ...filteredPages,
          filteredPages[filteredPages.length - 1] + 1 === this.totalPages - 2
            ? this.totalPages - 2
            : "..."
        ]
      : Array.from(Array(this.totalPages - 2).keys()).map(page => page + 1);

    return [this.page - 1, 0, ...pages, this.totalPages - 1, this.page + 1];
  }

  get filteredPages() {
    let diff = this.maxVisiblePages / 2;

    let toFilterPages = Array.from(Array(this.totalPages).keys()).slice(2, -2);

    if (toFilterPages.length > this.maxVisiblePages) {
      let diffFirst = this.page - toFilterPages[0];
      let diffLast = this.page - toFilterPages[toFilterPages.length - 1];

      if (diffFirst < diff) {
        return toFilterPages.slice(0, this.maxVisiblePages);
      } else if (diffLast >= -diff) {
        return toFilterPages.slice(-this.maxVisiblePages);
      } else {
        return toFilterPages.filter(page => {
          let diffPage = this.page - page;

          return diffPage < 0 ? Math.abs(diffPage) <= diff : diffPage < diff;
        });
      }
    }
  }

  get buttons() {
    return this.pages.map((page, key) => {
      return {
        page,
        active: page === this.page,
        disabled: this.disabled(page, key),
        html: this.html(page, key)
      };
    });
  }

  html(page: number | string, key: number) {
    if (key === 0) {
      return '<i class="fa fa-angle-left"></i>';
    }

    if (key === this.pages.length - 1) {
      return '<i class="fa fa-angle-right"></i>';
    }

    if (page === "...") {
      return page;
    }
    if (typeof page == "string") {
      return parseInt(page) + 1 + "";
    }
    return page + 1 + "";
  }

  disabled(page: number | string, key: number) {
    return (
      (key === 0 && this.page === 0) ||
      (key === this.pages.length - 1 && this.page === this.totalPages - 1) ||
      page === "..."
    );
  }

  title(key: number) {
    if (key === 0) {
      return "previous";
    }

    if (key === this.pages.length - 1) {
      return "next";
    }

    return "";
  }
}
</script>
