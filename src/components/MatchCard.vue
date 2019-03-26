<template>
  <v-card dark height="260" @click="selected">
    <v-layout column>
      <!-- <v-flex sm12>
        <v-icon
          style="height: 10px;display: flex;align-items: left;justify-content: left; font-size: 10px;"
        >fas fa-star</v-icon>
      </v-flex>-->
      <v-flex sm12>
        <div
          style="height:60px; text-align: center;display: flex;align-items: center;justify-content: center; font-size: 25px; font-weight:bold;"
        >{{match.name}}</div>
      </v-flex>
      <v-flex sm12>
        <v-layout row>
          <v-flex xs5 sm5>
            <v-layout column>
              <v-flex xs12 sm12 align-self-center>
                <v-img :width="60" :height="60" :src="match.view.oneLogo"></v-img>
              </v-flex>
              <v-flex xs12 sm12 align-self-center>
                <div style="height:40px;font-size: 20px;">{{match.oneSeedName}}</div>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex sm2 align-self-center>
            <div
              v-if="match.status != 1"
              style="text-align:center; font-size: 20px; font-weight:bold;"
            >{{match.oneScore}} : {{match.twoScore}}</div>
            <div v-else style="text-align:center; font-size: 20px; font-weight:bold;">VS</div>
          </v-flex>
          <v-flex sm5>
            <v-layout column>
              <v-flex xs12 sm12 align-self-center>
                <v-img :width="60" :height="60" :src="match.view.twoLogo"></v-img>
              </v-flex>
              <v-flex xs12 sm12 align-self-center>
                <div style="height:40px;font-size: 20px;">{{match.twoSeedName}}</div>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex sm12>
        <v-layout row fill-height>
          <v-flex sm5 align-self-center>
            <div
              style="height:60px; text-align: center;font-size: 25px; font-weight:bold;display: flex;align-items:center;justify-content: center;"
            >{{match.oneSeedBonusPool}}</div>
          </v-flex>
          <v-flex sm2 align-self-center>
            <v-layout row>
              <v-flex xs1 sm1 align-self-center>
                <v-icon
                  v-show="match.status == 1 || match.status == 2"
                  style="display: flex;align-items:center;justify-content: center;font-size: 10px;"
                >far fa-clock</v-icon>
                <v-icon
                  v-show="match.status == 3"
                  style="display: flex;align-items:center;justify-content: center;font-size: 10px;"
                >fas fa-ban</v-icon>
                <v-icon
                  v-show="match.status == 4"
                  style="display: flex;align-items:center;justify-content: center;font-size: 10px;"
                >fas fa-power-off</v-icon>
              </v-flex>
              <v-flex xs11 sm11 align-self-center>
                <div
                  style="height:50px; text-align: center; display: flex;align-items:center;justify-content: center;"
                >{{match.dateTime}}</div>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex sm5 align-self-center>
            <div
              style="height:60px;display: flex;align-items:center;justify-content: center; text-align: center; font-size: 20px; font-weight:bold;"
            >{{match.twoSeedBonusPool}}</div>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script lang="ts">
import BigNumber from "bignumber.js";
import { Match, MatchView, MatchStatus } from "@/models/Match";
import DB, { Account, ZeroAddress } from "@/database";
import { Vue, Component, Prop } from "vue-property-decorator";
import { contractAddr, MethodABI, unit, zero } from "@/config";
import { GlobalEvent, Events } from "@/GlobalEvent";

@Component
export default class MatchCard extends Vue {
  @Prop() private matchView!: MatchView;
  match: Match = new Match(
    this.matchView.id,
    "",
    0,
    0,
    "-",
    "-",
    0,
    0,
    new BigNumber(0),
    new BigNumber(0)
  );

  private async created() {
    this.match = await this.getMatch();
    console.log("MatchCard created");
    GlobalEvent.$on(Events.TickerStart, async () => {
      console.log("MatchCard on TickerStart");
      this.match = await this.getMatch();
    });
  }

  private destroyed() {
    console.log("MatchCard destroyed");
    GlobalEvent.$off(Events.TickerStart);
  }

  private async getMatch() {
    const getmatchMethod = connex.thor
      .account(contractAddr)
      .method(MethodABI.getMatch);
    let output = await getmatchMethod.call(this.matchView.id);
    let decoded = output.decoded as any;
    return new Match(
      new BigNumber(decoded.id),
      decoded.gameName,
      parseFloat(decoded.startTime),
      parseInt(decoded.stage),
      decoded.leftName,
      decoded.rightName,
      parseInt(decoded.leftScore),
      parseInt(decoded.rightScore),
      new BigNumber(decoded.leftBet),
      new BigNumber(decoded.rightBet),
      {
        id: new BigNumber(decoded.id),
        oneLogo: this.matchView.oneLogo,
        twoLogo: this.matchView.twoLogo
      }
    );
  }

  private selected() {
    this.$router.push({
      name: "matchDetail",
      params: { matchId: this.match.id.toString() }
    });
  }
}
</script>