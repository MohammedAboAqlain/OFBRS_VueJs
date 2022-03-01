import Home from './components/home.vue';
import Markets from './components/markets.vue';
import AddNewMarket from './components/addNewMarket.vue';
import SignUp from './components/SignUp.vue';
import SignIn from './components/SignIn.vue';
import UserProfile from './components/UserProfile.vue';
import DeleteMarket from './components/deleteMarket.vue';
import FishermanInputReport from './components/FishermanInputReport.vue';
import User from './components/User.vue';
import MarketReport from './components/MarketReport.vue';
import InAndOutRecord from './components/InAndOutRecord.vue';
import Backup from './components/Backup.vue';
import Entries from './components/Entries.vue';
import Storage from './components/Storage.vue';
import FAQ from './components/FAQ.vue';
import RecycleBin from './components/RecycleBin.vue';


export const routes = [
    {path: '/', component: SignIn},
    {path: '/dashboard', component: Home},
    {path: '/Markets', component: Markets},
    {path: '/Markets/addNewMarket', component: AddNewMarket},
    {path: '/SignUp', component: SignUp},
    {path: '/SignIn', component: SignIn},
    {path: '/userProfile', component: UserProfile},
    {path: '/Markets/deleteMarket', component: DeleteMarket},
    {path: '/FishermanInputReport', component: FishermanInputReport},
    {path: '/Users/:type', component: User},
    {path: '/MarketReport/:id', component: MarketReport},
    {path: '/InAndOutRecord/:type', component: InAndOutRecord},
    {path: '/Backup', component: Backup},
    {path: '/AllEntries', component: Entries},
    {path: '/Storage', component: Storage},
    {path: '/faq', component: FAQ},
    {path: '/recycle-bin', component: RecycleBin}
];
