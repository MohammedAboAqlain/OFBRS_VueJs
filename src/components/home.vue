<template>
    <div class="row text-center mx-0 rownded">
        <router-link dir="ltr" v-for="value in homeData" :key="value.name" :to="value.path" class="col-sm-6 col-md-4 col-lg-3 bg-light">
            <span>
                <img :src="value.imgSrc" class="w-25" alt="cannot load image">
                <h6>{{ value.name }}</h6>
            </span>
        </router-link>
    </div>
</template>

<script>
    import marketIcon from '../assets/icons/Market.png'
    import fishermanInputReportIcon from '../assets/icons/FishermanInputReport.png'
    import entriesIcon from '../assets/icons/entries.png'
    import restoreIcon from '../assets/icons/restore.png'
    import fishermanIcon from '../assets/icons/Fisherman.png'
    import sellerReportIcon from '../assets/icons/SellerReport.png'
    import warehouseIcon from '../assets/icons/Warehouse.png'
    import helpIcon from '../assets/icons/help.png'
    import sellerIcon from '../assets/icons/seller.png'
    import fishermanReportIcon from '../assets/icons/FishermanReport.png'
    import trashIcon from '../assets/icons/Trash.png'
    import CopyRightIcon from '../assets/icons/copyright.png'
    export default{
        data(){
            return {
                homeData: [
                    {name: 'الأسواق', imgSrc: marketIcon, path: '/Markets'},
                    {name: 'تبييض كشف صياد', imgSrc: fishermanInputReportIcon, path: '/FishermanInputReport'},
                    {name: 'القيود', imgSrc: entriesIcon, path: '/AllEntries'},
                    {name: 'النسخ الاحتياطي', imgSrc: restoreIcon, path: '/Backup'},
                    {name: 'الصيادين', imgSrc: fishermanIcon, path: '/Users/Fishermen'},
                    {name: 'كشف استلام', imgSrc: sellerReportIcon, path: '/InAndOutRecord/Receive'},
                    {name: 'المخزن', imgSrc: warehouseIcon, path: '/Storage'},
                    {name: 'مساعدة', imgSrc: helpIcon, path: '/Markets'},
                    {name: 'التجار', imgSrc: sellerIcon, path: '/Users/Sellers'},
                    {name: 'كشف تسليم', imgSrc: fishermanReportIcon, path: '/InAndOutRecord/Send'},
                    {name: 'سلة المحذوفات', imgSrc: trashIcon, path: '/Markets'},
                    {name: 'حقوق الطبع', imgSrc: CopyRightIcon, path: '/dashboard'},
                ]
            }
        }
    }
</script>

<style scoped>
    .row{
        height: 90vh;
    }
    .col-sm-6.col-md-4.col-lg-3{
        border-radius: 5px;
    }
    .col-sm-6.col-md-4.col-lg-3 {
        display: table;
        text-align: center;
        border: 1px solid var(--color-grey);
    }
    span {
        display: table-cell;
        vertical-align: middle;
    }
    .col-sm-6.col-md-4.col-lg-3:hover{
        background-color: var(--color-light-grey) !important;
        cursor: pointer;
        text-decoration: none;
    }
    h6{
        color: black;
    }
    @media screen and (max-width: 991px) {
        .row{
            height: 120vh;
        }
    }
    @media screen and (max-width: 750px) {
        .row{
            height: 140vh;
        }
    }
    @media screen and (max-width: 575px) {
        .row{
            height: 250vh;
        }
    }
</style>