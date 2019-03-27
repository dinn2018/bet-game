<template>
  <div>
    <BetDialog
      :showBet="shoudShowBet"
      :betSeedId="selectedSeedId"
      :oneBet="oneSeedBet.toString(10)"
      :twoBet="twoSeedBet.toString(10)"
      :match="match"
      @dismiss_dialog="dismissDialog"
    ></BetDialog>
    <v-layout column>
      <v-flex xs12 sm12>
        <div class="text_center_bold">{{match.name}}</div>
      </v-flex>
      <v-flex xs12 sm12>
        <v-layout row>
          <v-flex xs4 sm4>
            <v-layout column>
              <v-flex xs12 sm12 align-self-center>
                <v-img :width="100" :height="100" :src="match.view.oneLogo"></v-img>
              </v-flex>
              <v-flex xs12 sm12 align-self-center>
                <div class="text_center_bold">{{match.oneSeedName}}</div>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs4 sm4>
            <div
              class="text_center_bold"
              style="height:160px"
            >{{match.oneScore}} : {{match.twoScore}}</div>
          </v-flex>
          <v-flex xs4 sm4>
            <v-layout column>
              <v-flex xs12 sm12 align-self-center>
                <v-img :width="100" :height="100" :src="match.view.twoLogo"></v-img>
              </v-flex>
              <v-flex xs12 sm12 align-self-center>
                <div class="text_center_bold">{{match.twoSeedName}}</div>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 sm12>
        <v-layout row>
          <v-flex xs4 sm4>
            <div class="text_center_bold">{{match.oneSeedBonusPool}}</div>
          </v-flex>
          <v-flex xs4 sm4>
            <div class="text_center">Bonus Pool</div>
          </v-flex>
          <v-flex xs4 sm4>
            <div class="text_center_bold">{{match.twoSeedBonusPool}}</div>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs4 sm4>
            <div class="text_center">{{oneSeedBet.toString(10)}}</div>
          </v-flex>
          <v-flex xs4 sm4>
            <div class="text_center">Your Bet</div>
          </v-flex>
          <v-flex xs4 sm4>
            <div class="text_center">{{twoSeedBet.toString(10)}}</div>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 sm12>
        <div class="text_center" v-if="match.status == 1">{{match.leftTime}}</div>
        <div class="text_center" v-else-if=" match.status == 2 || match.leftTime == ''">
          <v-icon style="font-size: 10px;">far fa-clock</v-icon>
          {{match.dateTime}}
        </div>
        <div class="text_center" v-else-if="match.status == 3 || match.leftTime ==''">
          <v-icon style="font-size: 10px;">fas fa-ban</v-icon>
          {{match.dateTime}}
        </div>
        <div class="text_center" v-else-if="match.status == 4 || match.leftTime ==''">
          <v-icon style="font-size: 10px;">fas fa-power-off</v-icon>
          {{match.dateTime}}
        </div>
      </v-flex>
      <v-flex xs12 sm12>
        <v-layout row>
          <v-flex xs1 sm1></v-flex>
          <v-flex xs10 sm10>
            <v-card dark v-if="match.status == 1">
              <v-layout row>
                <v-flex xs4 sm4>
                  <v-layout column>
                    <v-flex xs8 sm8>
                      <div class="text_center_bold">Bet More</div>
                    </v-flex>
                    <v-flex>
                      <v-layout row>
                        <v-flex xs6 sm6 style="height:60px">
                          <v-btn
                            block
                            @click="betOneSeed"
                            class="text_center_bold"
                            style="height:100%;background-color: coral;margin-top:0px;"
                            hover
                          >{{match.oneSeedName}}</v-btn>
                        </v-flex>
                        <v-flex xs6 sm6 style="height:60px">
                          <v-btn
                            block
                            @click="betTwoSeed"
                            class="text_center_bold"
                            style="height:100%;background-color: burlywood;margin-top:0px;"
                            hover
                          >{{match.twoSeedName}}</v-btn>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-spacer></v-spacer>
                <v-flex xs4 sm4>
                  <v-layout column>
                    <v-flex>
                      <div class="text_center_bold">Withdraw your bet</div>
                    </v-flex>
                    <v-flex>
                      <v-layout row>
                        <v-flex xs6 sm6 style="height:60px">
                          <v-btn
                            dark
                            block
                            :disabled="oneSeedBet.isEqualTo(0)"
                            @click="withdrawBetOneSeed"
                            class="text_center_bold"
                            style="height:100%;background-color: coral;margin-top:0px;"
                            hover
                          >{{match.oneSeedName}}</v-btn>
                        </v-flex>
                        <v-flex xs6 sm6 style="height:60px">
                          <v-btn
                            block
                            :disabled="twoSeedBet.isEqualTo(0)"
                            @click="withdrawBetTwoSeed"
                            class="text_center_bold"
                            style="height:100%;background-color: burlywood;margin-top:0px;"
                            hover
                          >{{match.twoSeedName}}</v-btn>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-card>
            <v-card
              dark
              tile
              v-else-if="match.status == 2"
              class="text_center_bold"
              style="display: flex;align-items: center;justify-content: center;"
            >This match is {{match.stage}}, please wait the match ending!</v-card>
            <v-card
              tile
              v-else-if="match.status == 3 || (match.status == 4 && match.oneScore == match.twoScore)"
            >
              <v-layout row>
                <v-flex xs8 sm8 v-if="match.status == 3">
                  <div
                    class="text_center_bold"
                  >This match is cancelled, please you can withdraw your bet</div>
                </v-flex>
                <v-flex xs8 sm8 v-else>
                  <div class="text_center_bold">This match ended in a draw, please withdraw your bet</div>
                </v-flex>
                <v-flex xs2 sm2 style="height:60px">
                  <v-btn
                    block
                    :disabled="oneSeedBet.isEqualTo(0)"
                    dark
                    @click="withdrawBetOneSeed"
                    class="text_center_bold"
                    style="height:100%;background-color: coral;margin-top:0px;"
                    hover
                  >{{match.oneSeedName}}</v-btn>
                </v-flex>
                <v-flex xs2 sm2 style="height:60px">
                  <v-btn
                    block
                    :disabled="twoSeedBet.isEqualTo(0)"
                    @click="withdrawBetTwoSeed"
                    class="text_center_bold"
                    style="height:100%;background-color: burlywood;margin-top:0px;"
                    hover
                  >{{match.twoSeedName}}</v-btn>
                </v-flex>
              </v-layout>
            </v-card>
            <v-card dark tile v-else-if="match.status == 4">
              <v-layout row>
                <v-flex xs8 sm8>
                  <div class="text_center_bold">This match is over!</div>
                </v-flex>
                <v-flex xs4 sm4 style="height:60px">
                  <div
                    v-if="isLoadingWithdraw == true"
                    style="display: flex;align-items: center;justify-content: center;"
                  >
                    <v-progress-circular :size="40" indeterminate color="green"></v-progress-circular>
                  </div>
                  <v-card
                    v-else-if="hasWithdraw == true"
                    dark
                    class="text_center_bold"
                    style="font-size:18px; display: flex;align-items: center;justify-content: center;"
                  >You have withdrew the bonus</v-card>
                  <v-btn
                    dark
                    block
                    @click="withdrawBonus"
                    class="text_center_bold"
                    style="height:100%;background-color: coral;margin-top:0px;"
                    hover
                    v-else-if="canIWithdrawBonus == true"
                  >Withdraw Bonus</v-btn>
                  <v-card
                    dark
                    class="text_center_bold"
                    style="display: flex;align-items: center;justify-content: center;"
                    v-else
                  >Sorry you failed your bet</v-card>
                </v-flex>
              </v-layout>
            </v-card>
          </v-flex>
          <v-flex xs1 sm1></v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs1 sm1 align-self-center>
            <div
              class="content_center"
              v-show="offset > 0 && ((betRecords.length > 0) ||( isLoading == false && betRecords.length == 0))"
            >
              <v-icon style="font-size:20px" @click="lastpage">fas fa-arrow-left</v-icon>
            </div>
          </v-flex>
          <v-flex align-self-center>
            <v-list v-if="betRecords.length > 0" style="background-color: chocolate;">
              <BetRecordCard
                v-for="(br,i) in betRecords"
                :key="`${i}-${br.address}`"
                :betRecord="br"
              ></BetRecordCard>
            </v-list>
            <div v-else-if="isLoading == true" class="v-list content_center">
              <v-progress-circular :size="40" indeterminate color="green"></v-progress-circular>
            </div>
            <div v-else class="v-list content_center" style="color: white;">No More Records</div>
          </v-flex>
          <v-flex xs1 sm1 align-self-center>
            <div class="content_center" v-show="betRecords.length == limit">
              <v-icon style="font-size:20px" @click="nextpage">fas fa-arrow-right</v-icon>
            </div>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </div>
</template>
<script lang="ts">
import BigNumber from "bignumber.js";
import { Vue, Component, Prop } from "vue-property-decorator";
import { Match, MatchView, MatchStatus, MatchSeedIds } from "@/models/Match";
import { BetRecord } from "@/models/BetRecord";
import DB, { AccountLevel, Account, ZeroAddress } from "@/database";
import BetDialog from "@/components/BetDialog.vue";
import BetRecordCard from "@/components/BetRecordCard.vue";
import { GlobalEvent, Events } from "@/GlobalEvent";
import swal from "sweetalert";
import { abi } from "thor-devkit";
import {
  contractAddr,
  MethodABI,
  EventABI,
  unit,
  zero,
  MethodTopics,
  HttpHost
} from "@/config";

@Component({
  components: { BetDialog, BetRecordCard }
})
export default class IndividualMatchDetails extends Vue {
  @Prop() matchId!: string;
  offset = 0;
  limit = 10;
  isLoading = true;
  betRecords: Array<BetRecord> = [];
  shoudShowBet = false;
  selectedSeedId = 0;
  oneSeedBet = zero;
  twoSeedBet = zero;
  match: Match = new Match(
    new BigNumber(this.matchId),
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

  isLoadingWithdraw = true;
  canIWithdrawBonus = false;
  hasWithdraw = false;

  private betOneSeed() {
    this.shoudShowBet = true;
    this.selectedSeedId = MatchSeedIds.one;
  }

  private dismissDialog(val: boolean) {
    this.shoudShowBet = val;
  }

  private betTwoSeed() {
    this.shoudShowBet = true;
    this.selectedSeedId = MatchSeedIds.two;
  }

  private async created() {
    console.log("IndividualMatchDetails created");
    await this.reload();
    await this.loadBetRecords();
    GlobalEvent.$on(Events.TickerStart, async () => {
      console.log("IndividualMatchDetails on TickerStart");
      await this.reload();
      if (this.match.status == MatchStatus.active && this.offset == 0) {
        await this.reloadBetRecords();
      }
    });
    GlobalEvent.$on(Events.AccountChanged, async () => {
      console.log("IndividualMatchDetails on AccountChanged");
      await this.updateYourBet();
    });
  }

  private async withdrawBonus() {
    try {
      const main = await DB.getMainAccount();
      if (main.address == ZeroAddress) {
        return swal({
          title: "No account available!",
          text: "Please register an account from the menu",
          icon: "warning",
          dangerMode: true
        });
      }
      const withdrawBonusTx = connex.vendor.sign("tx").signer(main.address);
      const clause = connex.thor
        .account(contractAddr)
        .method(MethodABI.withdrawBonus)
        .asClause(this.match.id);
      const result = await withdrawBonusTx.request([
        {
          comment:
            "Withdraw your bouns for the match (" +
            this.match.fullTime +
            " " +
            this.match.name +
            " " +
            this.match.oneSeedName +
            " VS " +
            this.match.twoSeedName +
            ")",
          ...clause
        }
      ]);
      await this.commitAccount({
        address: result.signer,
        createdTime: Date.now(),
        level: AccountLevel.Main
      });
      console.log("withdrawBonusTx result", result);
      return swal({
        title: "Withdraw bonus!",
        text:
          "Bonus will send to " +
          main.address +
          " , Check balance of your account",
        icon: "success"
      });
    } catch (err) {
      console.log(err.message);
    }
  }

  private async updateYourBet() {
    this.isLoadingWithdraw = true;
    let bet = await this.getBet(this.match.id, MatchSeedIds.one);
    this.oneSeedBet = bet.dividedBy(unit);
    bet = await this.getBet(this.match.id, MatchSeedIds.two);
    this.twoSeedBet = bet.dividedBy(unit);
    if (this.match.status == MatchStatus.finished) {
      if (
        (this.match.oneScore > this.match.twoScore &&
          this.oneSeedBet.isGreaterThan(zero)) ||
        (this.match.oneScore < this.match.twoScore &&
          this.twoSeedBet.isGreaterThan(zero))
      ) {
        const acc = await DB.getMainAccount();
        if (acc.address == ZeroAddress) {
          return;
        }
        const getBetMethod = connex.thor
          .account(contractAddr)
          .method(MethodABI.getBonus);
        const output = await getBetMethod
          .caller(acc.address)
          .call(this.matchId);
        const decoded = output.decoded as any;
        this.hasWithdraw = new BigNumber(decoded["0"]).isEqualTo(zero);
        this.canIWithdrawBonus = true;
      }
      this.isLoadingWithdraw = false;
    }
  }

  private async getBet(matchId: BigNumber, seedId: number) {
    const acc = await DB.getMainAccount();
    if (acc.address == ZeroAddress) {
      return zero;
    }
    const getBetMethod = connex.thor
      .account(contractAddr)
      .method(MethodABI.getBet);
    const output = await getBetMethod.caller(acc.address).call(matchId, seedId);
    const decoded = output.decoded as any;
    return new BigNumber(decoded["0"]);
  }

  private async reloadBetRecords() {
    this.betRecords = await this.getBetRecords();
  }

  private async loadBetRecords() {
    this.betRecords = [];
    this.isLoading = true;
    this.betRecords = await this.getBetRecords();
    this.isLoading = false;
  }

  private async getBetRecords() {
    const matchIdTopic =
      "0x" + new BigNumber(this.matchId).toString(16).padStart(64, "0");
    const events = await connex.thor
      .filter("event")
      .criteria([
        {
          address: contractAddr,
          topic0: MethodTopics.joinBet,
          topic1: matchIdTopic
        },
        {
          address: contractAddr,
          topic0: MethodTopics.withdrawBet,
          topic1: matchIdTopic
        }
      ])
      .order("desc")
      .apply(this.offset, this.limit);
    const joinEvent = new abi.Event(EventABI.joinBet as any);
    const withdrawBetEvent = new abi.Event(EventABI.withdrawBet as any);
    const brs = [];
    for (const event of events) {
      const meta = event.meta as any;
      if (event.topics[0] == MethodTopics.joinBet) {
        const decoded = joinEvent.decode(event.data, event.topics) as any;
        const seedId = decoded.combatant;
        const seedName = this.match.seedNameById(seedId);
        brs.push(
          new BetRecord(
            decoded._id,
            decoded.player,
            seedId,
            seedName,
            new BigNumber(decoded.stakes),
            meta.blockTimestamp
          )
        );
      } else {
        const decoded = withdrawBetEvent.decode(
          event.data,
          event.topics
        ) as any;
        const seedId = decoded.combatant;
        const seedName = this.match.seedNameById(seedId);
        brs.push(
          new BetRecord(
            decoded._id,
            decoded.player,
            seedId,
            seedName,
            new BigNumber(decoded.stakes).negated(),
            meta.blockTimestamp
          )
        );
      }
    }
    return brs;
  }

  private async lastpage() {
    this.offset -= this.limit;
    if (this.offset < 0) {
      this.offset = 0;
    }
    await this.loadBetRecords();
  }

  private async nextpage() {
    this.offset += this.limit;
    await this.loadBetRecords();
  }

  private async reload() {
    this.match = await this.getMatch();
    await this.updateYourBet();
  }

  private async withdrawBetOneSeed() {
    await this.withdrawBet(MatchSeedIds.one, this.match.oneSeedName);
  }

  private async withdrawBetTwoSeed() {
    await this.withdrawBet(MatchSeedIds.two, this.match.twoSeedName);
  }

  private async withdrawBet(seedId: MatchSeedIds, seedName: string) {
    try {
      const main = await DB.getMainAccount();
      if (main.address == ZeroAddress) {
        return swal({
          title: "No account available!",
          text: "Please register an account from the menu",
          icon: "warning",
          dangerMode: true
        });
      }
      const withdrawBetTx = connex.vendor.sign("tx").signer(main.address);
      const clause = connex.thor
        .account(contractAddr)
        .method(MethodABI.withdrawBet)
        .asClause(this.match.id, seedId);
      const result = await withdrawBetTx.request([
        {
          comment: "Withdraw your bet for " + seedName,
          ...clause
        }
      ]);
      await this.commitAccount({
        address: result.signer,
        createdTime: Date.now(),
        level: AccountLevel.Main
      });
      console.log("withdrawBetTx result", result);
      return swal({
        title: "Withdraw bet!",
        text:
          "Your bet will send to " +
          main.address +
          " , Check balance of your account",
        icon: "success"
      });
    } catch (err) {
      console.log(err.message);
    }
  }

  private async commitAccount(acc: Account) {
    const main = await DB.getMainAccount();
    await DB.setMainAccount(acc);
    const accs = await DB.accounts.toArray();
    await this.$store.commit("setMain", acc);
    await this.$store.commit("put", accs);
    if (main.address != acc.address) {
      await GlobalEvent.$emit(Events.AccountChanged);
    }
  }

  private destroyed() {
    console.log("IndividualMatchDetails destroyed");
    GlobalEvent.$off(Events.TickerStart);
    GlobalEvent.$off(Events.AccountChanged);
  }

  private async getMatch() {
    const getmatchMethod = connex.thor
      .account(contractAddr)
      .method(MethodABI.getMatch);
    const output = await getmatchMethod.call(new BigNumber(this.matchId));
    const decoded = output.decoded as any;
    const match = new Match(
      new BigNumber(decoded.id),
      decoded.gameName,
      parseFloat(decoded.startTime),
      parseInt(decoded.stage),
      decoded.leftName,
      decoded.rightName,
      parseInt(decoded.leftScore),
      parseInt(decoded.rightScore),
      new BigNumber(decoded.leftBet),
      new BigNumber(decoded.rightBet)
    );
    try {
      const res = await this.$http.get(HttpHost + "/api/quiz/" + this.matchId);
      const data = await res.json();
      match.view = {
        id: new BigNumber(decoded.id),
        oneLogo: HttpHost + data.leftLogo,
        twoLogo: HttpHost + data.rightLogo
      };
    } catch (err) {
      console.log(err.message);
    }
    return match;
  }
}
</script>

