<template>
  <div id="app">
    <v-app>
      <AccountDrawer :drawer="drawer"></AccountDrawer>
      <v-toolbar dark app>
        <v-card-actions style="font-weight: bold;font-size:25px" flat>LegendaryGambling</v-card-actions>
        <v-btn @click="backHome">All</v-btn>
        <v-btn @click="individualMatches">your matches</v-btn>
        <v-spacer></v-spacer>
        <div>{{mainAccount}}</div>
        <v-toolbar-side-icon @click.stop="clickRightMenu">
          <v-icon>fas fa-bars</v-icon>
        </v-toolbar-side-icon>
      </v-toolbar>
      <v-content style="background-color: chocolate;">
        <router-view></router-view>
      </v-content>
    </v-app>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import AccountDrawer from "@/components/AccountDrawer.vue";
import DB, { ZeroAddress } from "@/database";
import { GlobalEvent, Events } from "@/GlobalEvent";
import { zero } from "@/config";
@Component({
  components: {
    AccountDrawer
  }
})
export default class App extends Vue {
  drawer = false;
  isDestroyed = false;

  clickRightMenu() {
    this.drawer = !this.drawer;
  }

  backHome() {
    this.$router.push({
      name: "root"
    });
  }

  individualMatches() {
    this.$router.push({
      name: "individualmatches"
    });
  }

  get mainAccount() {
    let addr = this.$store.state.mainAccount.address;
    if (addr === "") {
      return "";
    }
    return addr.substr(0, 8) + "...." + addr.substr(36, 6);
  }

  async created() {
    this.$router.push({
      name: "root"
    });
    let ticker = connex.thor.ticker();
    do {
      console.log("app emit TickerStart");
      GlobalEvent.$emit(Events.TickerStart);
      await ticker.next();
    } while (!this.isDestroyed);
  }

  destroyed() {
    console.log("app destroyed");
    GlobalEvent.$off(Events.TickerStart);
    this.isDestroyed = true;
  }
}
</script>
<style>
html {
  height: 100vh;
}

body {
  min-width: 1280px;
  height: 100%;
}

.router-view {
  height: 100%;
  overflow: auto;
}
</style>