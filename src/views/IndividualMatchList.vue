<template>
  <div style="background-color: chocolate;">
    <v-layout row fluid>
      <v-flex xs1 sm1>
        <v-layout column d-flex align-center fill-height>
          <v-flex
            style="text-align: center;display: flex;align-items: center;justify-content: center;"
          >
            <div style="height:400px">
              <v-layout column>
                <v-flex>
                  <div class="content_center" style="height:100px;">
                    <v-card
                      hover
                      v-bind:class="{'active_stage_color':selectedMatchStatus == 0, 'inactive_stage_color': selectedMatchStatus != 0}"
                      style="width:50px;height:50px; display: flex;align-items: center;justify-content: center; border-radius:25px;font-size:10px"
                      @click="allList"
                    >All</v-card>
                  </div>
                </v-flex>
                <v-flex>
                  <div class="content_center" style="height:100px;">
                    <v-card
                      hover
                      v-bind:class="{'active_stage_color':selectedMatchStatus == 1 , 'inactive_stage_color': selectedMatchStatus != 1}"
                      style="width:50px;height:50px; display: flex;align-items: center;justify-content: center; border-radius:25px;font-size:10px"
                      @click="activeList"
                    >Active</v-card>
                  </div>
                </v-flex>
                <v-flex>
                  <div class="content_center" style="height:100px;">
                    <v-card
                      hover
                      style="width:50px;height:50px; display: flex;align-items: center;justify-content: center; border-radius:25px;font-size:10px"
                      v-bind:class="{'active_stage_color':selectedMatchStatus == 4 , 'inactive_stage_color': selectedMatchStatus != 4}"
                      @click="finishedList"
                    >Finished</v-card>
                  </div>
                </v-flex>
                <v-flex>
                  <div class="content_center" style="height:100px;">
                    <v-card
                      hover
                      v-bind:class="{'active_stage_color':selectedMatchStatus == 2, 'inactive_stage_color': selectedMatchStatus != 2}"
                      style="width:50px;height:50px; display: flex;align-items: center;justify-content: center; border-radius:25px;font-size:10px"
                      @click="lockedList"
                    >Locked</v-card>
                  </div>
                </v-flex>
              </v-layout>
            </div>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs10 sm10>
        <v-layout column>
          <v-flex xs12 sm12>
            <v-card dark>
              <v-layout row>
                <v-flex sm2>
                  <div class="content_center">Match Name</div>
                </v-flex>
                <v-flex sm2>
                  <div class="content_center">Combatants</div>
                </v-flex>
                <v-flex sm1>
                  <div class="content_center">Score</div>
                </v-flex>
                <v-flex sm2>
                  <div class="content_center">Bonus Pool(VET)</div>
                </v-flex>
                <v-flex sm2>
                  <div class="content_center">Your Bet(VET)</div>
                </v-flex>
                <v-flex sm2>
                  <div class="content_center">Date</div>
                </v-flex>
                <v-flex sm1 align-self-center>
                  <div class="content_center">Stage</div>
                </v-flex>
              </v-layout>
            </v-card>
          </v-flex>
          <v-flex sm12>
            <v-list
              v-if="matchViews.length>0"
              id="individual-list"
              style="background-color: chocolate;"
            >
              <IndividualMatchCard
                v-for="(mv,i) in matchViews"
                :key="`#${i}-${mv.id.toString()}`"
                :matchView="mv"
              ></IndividualMatchCard>
            </v-list>
            <div v-else-if="isLoading == true" class="content_center" style="height:720px">
              <v-progress-circular :size="70" indeterminate color="green"></v-progress-circular>
            </div>
            <div
              v-else-if="hasAccount == false"
              class="content_center"
              style="font-size:30px;height:720px;color: white;"
            >Please register an account in the menu</div>
            <div
              v-else
              class="content_center"
              style="font-size:30px;height:720px;color: white;"
            >No More Matches</div>
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
      </v-flex>
    </v-layout>
  </div>
</template>
<script lang="ts">
import IndividualMatchCard from "@/components/IndividualMatchCard.vue";
import Pagination from "@/components/Pagination.vue";
import DB, { ZeroAddress } from "@/database";
import { Vue, Component, Prop } from "vue-property-decorator";
import { GlobalEvent, Events } from "@/GlobalEvent";
import { MatchView, MatchStatus } from "@/models/Match";
import {
  contractAddr,
  MethodTopics,
  MethodABI,
  HttpHost,
  zero
} from "@/config";

@Component({
  components: {
    IndividualMatchCard,
    Pagination
  }
})
export default class IndividualMatchList extends Vue {
  matchViews: Array<MatchView> = [];
  page = 0;
  page_size = 10;
  isLoading = true;
  selectedMatchStatus = 0;
  hasAccount = false;
  count = 0;

  private async created() {
    try {
      await this.loadMatchViews();
      GlobalEvent.$on(Events.AccountChanged, async () => {
        this.page = 0;
        await this.loadMatchViews();
      });
    } catch (err) {
      console.log(err.message);
    }
  }

  private async loadMatchViews() {
    this.isLoading = true;
    this.matchViews = [];
    this.matchViews = await this.getMatchViews(this.selectedMatchStatus);
    this.isLoading = false;
  }

  private async finishedList() {
    console.log("finishedList");
    this.page = 0;
    this.selectedMatchStatus = MatchStatus.finished;
    await this.loadMatchViews();
  }

  private async activeList() {
    console.log("activeList");
    this.page = 0;
    this.selectedMatchStatus = MatchStatus.active;
    await this.loadMatchViews();
  }

  private async lockedList() {
    console.log("invalidList");
    this.page = 0;
    this.selectedMatchStatus = MatchStatus.locked;
    await this.loadMatchViews();
  }

  private async allList() {
    console.log("allList");
    this.page = 0;
    this.selectedMatchStatus = 0;
    await this.loadMatchViews();
  }

  private destroyed() {
    console.log("IndividualMatchList destroyed");
    GlobalEvent.$off(Events.AccountChanged);
  }

  private async getMatchViews(status: number) {
    const main = await DB.getMainAccount();
    this.hasAccount = main.address !== ZeroAddress;
    if (!this.hasAccount) {
      return [];
    }
    const matchViews: Array<MatchView> = [];
    try {
      const res = await this.$http.get(
        HttpHost +
          "/api/player?page=" +
          this.page +
          "&pagesize=" +
          this.page_size +
          "&player=" +
          main.address +
          (status == 0 ? "" : "&stage=" + status)
      );
      const data = await res.json();
      this.count = data.count;
      console.log(data);
      for (const match of data.data) {
        matchViews.push({
          id: parseInt(match._id),
          oneLogo: HttpHost + match.leftLogo,
          twoLogo: HttpHost + match.rightLogo
        });
      }
    } catch (err) {
      console.log(err.message);
    }
    return matchViews;
  }

  async pageChanged(page: number) {
    console.log(page);
    this.page = page;
    await this.loadMatchViews();
  }
}
</script>
<style>
.content_center {
  height: 50px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: bold;
}

#individual-list {
  height: 720px;
  overflow-y: auto;
}
.active_stage_color {
  color: white !important;
  background-color: yellowgreen !important;
}
.inactive_stage_color {
  color: black !important;
  background-color: white !important;
}
</style>
