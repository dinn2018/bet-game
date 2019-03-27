import Vue from 'vue';
export const GlobalEvent = new Vue();
export enum Events {
    TickerStart = 'TickerStart',
    AccountChanged = 'account-changed',
    AccountTickerStart = 'AccountTickerStart',
}
