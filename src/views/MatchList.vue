<template>
  <div style="background-color: chocolate;">
    <v-layout row>
      <v-flex xs1 sm1 align-self-center>
        <div
          v-show="page > 0 && ((matchViews.length > 0) ||( isLoading == false && matchViews.length == 0))"
          class="content_center"
        >
          <v-icon style="font-size:20px" @click="lastpage">fas fa-arrow-left</v-icon>
        </div>
      </v-flex>
      <v-flex align-self-center>
        <v-item-group v-if="matchViews.length > 0">
          <v-container fluid grid-list-md>
            <v-layout wrap>
              <v-flex xs12 md6 v-for="(mv,i) in matchViews" :key="`${i}-${mv.id.toString()}`">
                <MatchCard :matchView="mv"></MatchCard>
              </v-flex>
            </v-layout>
          </v-container>
        </v-item-group>
        <div v-else-if="isLoading == true" class="content_center" style="height:720px">
          <v-icon style="font-size:30px">fas fa-spinner</v-icon>
        </div>
        <div
          v-else
          class="content_center"
          style="font-size:30px;height:720px;color: white;"
        >NO More Matches</div>
      </v-flex>
      <v-flex xs1 sm1 align-self-center>
        <div v-show="matchViews.length == page_size" class="content_center">
          <v-icon style="font-size:25px" @click="nextpage">fas fa-arrow-right</v-icon>
        </div>
      </v-flex>
    </v-layout>
  </div>
</template>
<script lang="ts">
import { contractAddr, MethodTopics, EventABI, HttpHost } from "../config";
import MatchCard from "../components/MatchCard.vue";
import { Vue, Component, Prop } from "vue-property-decorator";
import BigNumber from "bignumber.js";
import { GlobalEvent, Events } from "../GlobalEvent";
import { MatchView } from "../models/Match";

@Component({
  components: { MatchCard }
})
export default class MatchList extends Vue {
  matchViews: Array<MatchView> = [];
  page = 0;
  page_size = 10;
  isLoading = true;

  async created() {
    try {
      await this.loadMatchViews();
      GlobalEvent.$on(Events.TickerStart, async () => {
        if (this.page == 0) {
          console.log("MatchCard on TickerStart");
          await this.reloadMatchViews();
        }
      });
    } catch (err) {
      console.error(err);
    }
  }

  destroyed() {
    console.log("MatchList destroyed");
    GlobalEvent.$off(Events.TickerStart);
  }

  async lastpage() {
    this.page--;
    if (this.page < 0) {
      this.page = 0;
    }
    await this.loadMatchViews();
  }

  async nextpage() {
    this.page++;
    await this.loadMatchViews();
  }

  async getMatchViews() {
    let matches = [];
    try {
      let res = await this.$http.get(
        HttpHost +
          "/api/quizs?page=" +
          this.page +
          "&pagesize=" +
          this.page_size
      );
      let data = await res.json();
      for (let m of data) {
        matches.push(
          new MatchView(
            new BigNumber(m._id),
            HttpHost + m.leftLogo,
            HttpHost + m.rightLogo
          )
        );
      }
    } catch (err) {
      console.error("err", err);
    }
    return matches;
  }

  async loadMatchViews() {
    this.matchViews = [];
    this.isLoading = true;
    this.matchViews = await this.getMatchViews();
    this.isLoading = false;
  }

  async reloadMatchViews() {
    this.page = 0;
    this.matchViews = await this.getMatchViews();
  }
}
</script>
