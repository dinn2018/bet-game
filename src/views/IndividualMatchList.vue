<template>
  <div style="background-color: chocolate;">
    <v-layout row fluid>
      <v-flex xs1 sm1 align-self-center>
        <div
          v-show="page > 0 && ((matchViews.length > 0) ||( isLoading == false && matchViews.length == 0 ))"
          class="content_center"
        >
          <v-icon style="font-size:20px" @click="lastpage">fas fa-arrow-left</v-icon>
        </div>
      </v-flex>
      <v-flex xs10 sm10>
        <v-flex sm12>
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
            v-else
            class="content_center"
            style="font-size:30px;height:720px;color: white;"
          >No More Matches</div>
        </v-flex>
      </v-flex>
      <v-flex xs1 sm1 align-self-center>
        <div v-show="matchViews.length == page_size" class="content_center">
          <v-icon style="font-size:25px" @click="nextpage">fas fa-arrow-right</v-icon>
        </div>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs2 sm2></v-flex>
      <v-flex xs8 sm8>
        <v-layout row>
          <v-flex xs3 sm3>
            <div class="content_center" style="height:100px;">
              <v-card
                hover
                v-bind:class="{'active_stage_color':isAllSelected, 'inactive_stage_color': !isAllSelected}"
                style="width:60px;height:60px; display: flex;align-items: center;justify-content: center; border-radius:30px;"
                @click="allList"
              >All</v-card>
            </div>
          </v-flex>
          <v-flex xs3 sm3>
            <div class="content_center" style="height:100px;">
              <v-card
                hover
                v-bind:class="{'active_stage_color':isActiveSelected , 'inactive_stage_color': !isActiveSelected}"
                style="width:60px;height:60px; display: flex;align-items: center;justify-content: center; border-radius:30px;"
                @click="activeList"
              >Active</v-card>
            </div>
          </v-flex>
          <v-flex xs3 sm3>
            <div class="content_center" style="height:100px;">
              <v-card
                hover
                style="width:60px;height:60px; display: flex;align-items: center;justify-content: center; border-radius:30px;"
                v-bind:class="{'active_stage_color':isOverSelected , 'inactive_stage_color': !isOverSelected}"
                @click="overedList"
              >Overd</v-card>
            </div>
          </v-flex>
          <v-flex xs3 sm3>
            <div class="content_center" style="height:100px;">
              <v-card
                hover
                v-bind:class="{'active_stage_color':isLockedSelected, 'inactive_stage_color': !isLockedSelected}"
                style="width:60px;height:60px; display: flex;align-items: center;justify-content: center; border-radius:30px;"
                @click="lockedList"
              >Locked</v-card>
            </div>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs2 sm2></v-flex>
    </v-layout>
  </div>
</template>
<script lang="ts">
import IndividualMatchCard from "@/components/IndividualMatchCard.vue";
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
    IndividualMatchCard
  }
})
export default class IndividualMatchList extends Vue {
  matchViews: Array<MatchView> = [];
  page = 0;
  page_size = 10;
  isLoading = true;

  isOverSelected = false;
  isActiveSelected = true;
  isLockedSelected = false;
  isAllSelected = false;
  selectedMatchStatus = MatchStatus.active;

  private async created() {
    try {
      this.isActiveSelected = true;
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

  private async overedList() {
    console.log("overedList");
    this.isOverSelected = true;
    this.isActiveSelected = false;
    this.isLockedSelected = false;
    this.isAllSelected = false;
    this.page = 0;
    this.selectedMatchStatus = MatchStatus.finished;
    await this.loadMatchViews();
  }

  private async activeList() {
    console.log("activeList");
    this.isOverSelected = false;
    this.isActiveSelected = true;
    this.isLockedSelected = false;
    this.isAllSelected = false;
    this.page = 0;
    this.selectedMatchStatus = MatchStatus.active;
    await this.loadMatchViews();
  }

  private async lockedList() {
    console.log("invalidList");
    this.isOverSelected = false;
    this.isActiveSelected = false;
    this.isLockedSelected = true;
    this.isAllSelected = false;
    this.page = 0;
    this.selectedMatchStatus = MatchStatus.locked;
    await this.loadMatchViews();
  }

  private async allList() {
    console.log("allList");
    this.isOverSelected = false;
    this.isActiveSelected = false;
    this.isLockedSelected = false;
    this.isAllSelected = true;
    this.page = 0;
    this.selectedMatchStatus = 0;
    await this.loadMatchViews();
  }

  private destroyed() {
    console.log("IndividualMatchList destroyed");
    GlobalEvent.$off(Events.AccountChanged);
  }

  private async lastpage() {
    this.page--;
    if (this.page < 0) {
      this.page = 0;
    }
    await this.loadMatchViews();
  }

  private async nextpage() {
    this.page++;
    await this.loadMatchViews();
  }

  private async getMatchViews(status: number) {
    const main = await DB.getMainAccount();
    if (main.address === ZeroAddress) {
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
      for (const match of data) {
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
