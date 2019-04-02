<template>
  <v-dialog v-model="show" width="500" hide-overlay persistent>
    <v-card dark height="300">
      <v-layout column fill-height>
        <v-flex xs12 sm12>
          <v-layout row>
            <v-flex xs8 sm8 offset-xs1>
              <div class="text_left">Total bet for {{seedName}} (VET):</div>
            </v-flex>
            <v-flex xs4 sm4>
              <div class="text_right_bold">{{totalValue}}</div>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs12 sm12>
          <v-layout row>
            <v-flex xs8 offset-xs1>
              <div class="text_left" style="margin-top:-20px;">You have bet for {{seedName}} (VET):</div>
            </v-flex>
            <v-flex xs4>
              <div class="text_right_bold" style="margin-top:-20px;">{{yourBet}}</div>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs12>
          <v-layout row>
            <v-flex xs1></v-flex>
            <v-flex xs10>
              <v-text-field
                single-line
                placeholder="How much VET do you want to bet?"
                v-model="bet"
                validate-on-blur
                style="height:60px; margin-top:-20px;"
                :rules="blanceRules"
              ></v-text-field>
            </v-flex>
            <v-flex xs1></v-flex>
          </v-layout>
        </v-flex>
        <v-spacer></v-spacer>
        <v-flex xs12>
          <v-layout row justify-space-around>
            <v-flex xs4>
              <v-card
                hover
                style="height:50px; text-align: center;display: flex;align-items: center;justify-content: center; font-size: 20px; font-weight:bold;"
                @click.stop="ok"
              >OK</v-card>
            </v-flex>
            <v-flex xs4>
              <v-card
                hover
                dark
                style="height:50px; text-align: center;display: flex;align-items: center;justify-content: center; font-size: 20px; font-weight:bold;"
                @click.stop="cancel"
              >Cancel</v-card>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import BigNumber from "bignumber.js";
import { Match, MatchSeedIds } from "@/models/Match";
import DB, { Account, AccountLevel, ZeroAddress } from "@/database";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { GlobalEvent, Events } from "@/GlobalEvent";
import { contractAddr, MethodABI, unit, zero } from "@/config";
import sweetAlert from "sweetalert";

@Component
export default class BetDialog extends Vue {
  @Prop() showBet!: boolean;
  @Prop() betSeedId!: number;
  @Prop() match!: Match;
  @Prop() yourBet!: string;
  bet: string = "";
  show = false;
  @Watch("showBet")
  onShowBetChanged(val: boolean) {
    this.show = val;
    this.bet = "";
  }

  private blanceRules = [
    (value: string) => {
      if (value != "") {
        const v = new BigNumber(value);
        const temp = v.multipliedBy(unit);
        if (!temp.isInteger() || temp.isNegative()) {
          return `${value} field is invalid (positive number and limited to 18 decimal places).`;
        }
      }
      return "";
    }
  ];

  private get seedName() {
    if (this.betSeedId === MatchSeedIds.one) {
      return this.match.oneSeedName;
    } else if (this.betSeedId === MatchSeedIds.two) {
      return this.match.twoSeedName;
    }
  }

  private async created() {
    console.log("BetDialog created");
  }

  private destroyed() {
    console.log("BetDialog destroyed");
  }

  private get totalValue() {
    if (this.betSeedId === MatchSeedIds.one) {
      return this.match.oneSeedBonusPool;
    } else if (this.betSeedId === MatchSeedIds.two) {
      return this.match.twoSeedBonusPool;
    }
    return 0;
  }

  private async ok() {
    try {
      const acc = await DB.getMainAccount();
      if (acc.address === ZeroAddress) {
        return sweetAlert({
          title: "No account available!",
          text: "Please register an account from the menu",
          icon: "warning",
          dangerMode: true
        });
      }
      const betForSeed = new BigNumber(this.bet);
      if (!betForSeed.isGreaterThanOrEqualTo(100)) {
        return sweetAlert({
          title: "Bet is too low!",
          text: "100 VET at least!",
          icon: "warning",
          dangerMode: true
        });
      }
      const betTx = connex.vendor.sign("tx").signer(acc.address);
      const betMethod = connex.thor.account(contractAddr).method(MethodABI.bet);
      const clause = betMethod
        .value(betForSeed.multipliedBy(unit).toString(10))
        .asClause(this.match.id, this.betSeedId);
      const result = await betTx.request([
        {
          comment:
            "You will bet " + this.bet + " VET for " + this.seedName + " !",
          ...clause
        }
      ]);
      await this.commitAccount({
        address: result.signer,
        createdTime: Date.now(),
        level: AccountLevel.Main
      });
      console.log("betTx result", result);
      this.dismiss();
      return sweetAlert({
        title: this.bet + " VET for " + this.seedName,
        text: "Wait the transaction packed!",
        icon: "success"
      });
    } catch (err) {
      console.log(err.message);
    }
  }

  private dismiss() {
    this.$emit("dismiss_dialog", false);
  }

  private async commitAccount(acc: Account) {
    await DB.setMainAccount(acc);
    const accs = await DB.accounts.toArray();
    await this.$store.commit("put", accs);
    await this.$store.commit("setMain", acc);
  }

  private async cancel() {
    this.dismiss();
  }
}
</script>
<style>
.text_left {
  height: 80px;
  text-align: left;
  display: flex;
  align-items: center;
  font-size: 15px;
}

.text_right_bold {
  height: 80px;
  text-align: right;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
}

.total_bet {
  position: absolute !important;
  top: 20px;
  left: 30px;
  width: 50%;
  height: 40px;
  font-size: 18px;
  text-align: left;
}

.total_bet_value {
  position: absolute !important;
  top: 20px;
  right: 30px;
  width: 50%;
  height: 40px;
  font-size: 18px;
  text-align: right;
}

.your_bet {
  position: absolute !important;
  top: 70px;
  left: 30px;
  width: 50%;
  height: 30px;
  font-size: 18px;
  text-align: left;
}

.your_bet_value {
  position: absolute !important;
  top: 70px;
  right: 30px;
  width: 50%;
  height: 40px;
  font-size: 18px;
  text-align: right;
}

.bet_value {
  position: absolute !important;
  top: 100px;
  left: 30px;
  right: 30px;
  height: 40px;
  font-size: 20px;
  text-align: center;
}

.bet_ok {
  position: absolute !important;
  top: 180px;
  left: 67px;
  width: 150px;
  height: 40px;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.bet_cancel {
  position: absolute !important;
  top: 180px;
  right: 67px;
  width: 150px;
  height: 40px;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
</style>
