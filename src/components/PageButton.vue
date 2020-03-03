<template>
  <v-btn hover dark :class="buttonClasses" :disabled="disabled" @click="pageChange">
    <span v-html="html"/>
  </v-btn>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class PageButton extends Vue {
  @Prop() page!: number | string;
  @Prop() active!: boolean;
  @Prop() disabled!: boolean;
  @Prop() html!: string;

  get buttonClasses() {
    return {
      "active-page": this.active,
      "inactive-page": !this.active
    };
  }

  pageChange() {
    if (this.page === "..." || this.disabled || this.active) {
      return;
    }
    this.$emit("page-change");
  }
}
</script>
<style>
.active-page {
  background-color: cornflowerblue !important;
  color: white !important;
}
.inactive-page {
  background-color: rgb(212, 204, 193) !important;
  color: black !important;
}
</style>

