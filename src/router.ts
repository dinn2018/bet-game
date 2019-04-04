import { Vue } from 'vue-property-decorator';
import Router from 'vue-router';
import MatchList from './views/MatchList.vue';
import IndividualMatchList from './views/IndividualMatchList.vue';
import MatchDetails from './views/MatchDetails.vue';
import IndividualMatchDetails from './views/IndividualMatchDetails.vue';
import About from './views/About.vue';


Vue.use(Router);

const router = new Router({
    mode: 'hash',
    routes: [
        {
            name: 'root',
            redirect: { name: 'matches' },
            path: '/',
        },
        {
            name: 'matches',
            component: MatchList,
            path: '/matches',
        },
        {
            name: 'individualmatches',
            component: IndividualMatchList,
            path: '/individualmatches',
        },
        {
            name: 'matchDetail',
            component: MatchDetails,
            path: '/matches/:matchId',
            props: true,
        },
        {
            name: 'individualMatchDetails',
            component: IndividualMatchDetails,
            path: '/individualmatches/:matchId',
            props: true,
        },
        {
            name: 'about',
            component: About,
            path: '/about',
        },
    ],
});

export default router;
