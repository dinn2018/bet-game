<template>
  <div id="app">
    <v-app v-if="isMainNet == true">
      <AccountDrawer :drawer="drawer"></AccountDrawer>
      <v-toolbar dark app>
        <v-card-actions style="font-weight: bold;font-size:25px" flat>Who's Legend</v-card-actions>
        <v-btn v-bind:class="{'active-tab':selected == 0 }" flat @click="all">All</v-btn>
        <v-btn
          v-bind:class="{'active-tab':selected == 1 }"
          flat
          @click="individualMatches"
        >Your Matches</v-btn>
        <v-btn v-bind:class="{'active-tab':selected == 2 }" flat @click="about">About</v-btn>
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
    <v-app v-else>
      <v-content
        style="text-align: center;display: flex;align-items: center;justify-content: center;font-weight: bold;background-color: chocolate;"
      >
        <div style="color:white">Not supported on current network, please check your network</div>
      </v-content>
    </v-app>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import AccountDrawer from "@/components/AccountDrawer.vue";
import DB, { ZeroAddress } from "@/database";
import { GlobalEvent, Events } from "@/GlobalEvent";
import { zero, mainNet } from "@/config";
@Component({
  components: {
    AccountDrawer
  }
})
export default class App extends Vue {
  drawer = false;
  isDestroyed = false;
  selected = 0;
  isMainNet = false;

  clickRightMenu() {
    this.drawer = !this.drawer;
  }

  all() {
    this.selected = 0;
    this.$router.push({
      name: "root"
    });
  }

  individualMatches() {
    this.selected = 1;
    this.$router.push({
      name: "individualmatches"
    });
  }
  about() {
    this.selected = 2;
    this.$router.push({
      name: "about"
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
    let genesis = await connex.thor.genesis.id;
    this.isMainNet = genesis == mainNet;
    if (this.isMainNet) {
      this.$router.push({
        name: "root"
      });
      let ticker = connex.thor.ticker();
      do {
        console.log("app emit TickerStart");
        GlobalEvent.$emit(Events.TickerStart);
        GlobalEvent.$emit(Events.AccountTickerStart);
        await ticker.next();
      } while (!this.isDestroyed);
    }
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

.active-tab {
  background-color: darkgoldenrod !important;
}
</style>