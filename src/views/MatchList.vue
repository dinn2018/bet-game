<template>
  <div style="background-color: chocolate;">
    <v-layout column>
      <v-flex xs12 sm12>
        <v-item-group v-if="matchViews.length > 0">
          <v-container fluid grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 v-for="(mv,i) in matchViews" :key="`${i}-${mv.id.toString()}`">
                <MatchCard :matchView="mv"></MatchCard>
              </v-flex>
            </v-layout>
          </v-container>
        </v-item-group>
        <div v-else-if="isLoading == true" class="content_center" style="height:720px">
          <v-progress-circular :size="70" indeterminate color="green"></v-progress-circular>
        </div>
        <div
          v-else
          class="content_center"
          style="font-size:30px;height:720px;color: white;"
        >NO More Matches</div>
      </v-flex>
      <v-flex align-self-center xs12 sm12>
        <Pagination
          :totalItems="count"
          :page="page"
          :itemsPerPage="page_size"
          :maxVisiblePages="5"
          @page-change="pageChanged"
        ></Pagination>
      </v-flex>
    </v-layout>
  </div>
</template>
<script lang="ts">
import BigNumber from "bignumber.js";
import { contractAddr, MethodTopics, EventABI, HttpHost } from "@/config";
import MatchCard from "@/components/MatchCard.vue";
import Pagination from "@/components/Pagination.vue";
import { Vue, Component, Prop } from "vue-property-decorator";
import { GlobalEvent, Events } from "@/GlobalEvent";
import { MatchView } from "@/models/Match";

@Component({
  components: { MatchCard, Pagination }
})
export default class MatchList extends Vue {
  matchViews: Array<MatchView> = [];
  page = 0;
  page_size = 6;
  isLoading = true;
  count = 0;

  private async created() {
    try {
      await this.loadMatchViews();
      GlobalEvent.$on(Events.TickerStart, async () => {
        if (this.page === 0) {
          console.log("MatchCard on TickerStart");
          await this.reloadMatchViews();
        }
      });
    } catch (err) {
      console.log(err.message);
    }
  }

  private destroyed() {
    console.log("MatchList destroyed");
    GlobalEvent.$off(Events.TickerStart);
  }

  private async getMatchViews() {
    const matches: Array<MatchView> = [];
    try {
      const res = await this.$http.get(
        HttpHost +
          "/api/quizs?page=" +
          this.page +
          "&pagesize=" +
          this.page_size
      );
      const data = await res.json();
      this.count = data.count;
      for (const m of data.data) {
        matches.push({
          id: parseInt(m._id),
          oneLogo: HttpHost + m.leftLogo,
          twoLogo: HttpHost + m.rightLogo
        });
      }
    } catch (err) {
      console.log(err);
    }
    return matches;
  }

  private async loadMatchViews() {
    this.matchViews = [];
    this.isLoading = true;
    this.matchViews = await this.getMatchViews();
    this.isLoading = false;
  }

  private async reloadMatchViews() {
    this.page = 0;
    this.matchViews = await this.getMatchViews();
  }

  async pageChanged(page: number) {
    console.log(page);
    this.page = page;
    await this.loadMatchViews();
  }
}
</script>
