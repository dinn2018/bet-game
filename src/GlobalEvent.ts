import Vue from 'vue'
export const GlobalEvent = new Vue();
export enum Events {
    TickerStart = "Events.TickerStart",
    AccountChanged = "account-changed"
}