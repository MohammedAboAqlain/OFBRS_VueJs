<template>
    <div class="row text-center mx-0 rownded">
        <router-link v-for="market in markets" :key="market.id" :to="'/MarketReport/' + market.id" class="col-sm-6 col-md-4 bg-light">
            <span>
                <h6>{{ market.name }}</h6>
            </span>
        </router-link>
        <div class="col-12 d-flex justify-content-center align-items-end">
            <router-link to="/Markets/addNewMarket" class="btn btn-primary ml-2" tag="button">
                إضافة سوق جديد
            </router-link>
            <router-link to="/Markets/deleteMarket" class="btn btn-primary ml-2" tag="button">
                حذف سوق
            </router-link>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import axios from 'axios'
    export default {
        data(){
            return {
                markets: []
            }
        },
        // created(){
        //     this.fetchMarkets();
        // },
        mounted(){
            axios.get('http://127.0.0.1:8000/api/index-market',
            {headers: { Authorization: `Token ${this.getToken}` }})
            .then(res => {
                let result = [];
                for (let i = 0; i < res.data.item.length; i++) {
                    result.push({name:res.data.item[i].name, id: res.data.item[i].id});
                }
                this.markets = result;
                console.log(res.data.item);
            })
            .catch(err => console.log(err));
            //remove undefined entries
            let temp = []
            for (let i = 0; i < this.markets.length; i++) {
                if(this.markets[i]){
                    temp.push({id: i, name: this.markets[i]});
                }
            }
            this.markets = temp;
        },
        // methods: {
        //     ...mapActions(['fetchMarkets'])
        // },
        computed: mapGetters(['getAllMarkets', 'getToken'])
    }
</script>

<style scoped>
    .row{
        height: 90vh;
    }
    .col-sm-6.col-md-4{
        border-radius: 5px;
    }
    .col-sm-6.col-md-4 {
        display: table;
        text-align: center;
        border: 1px solid #999; /* var(--color-grey); */
    }
    span {
        display: table-cell;
        vertical-align: middle;
    }
    .col-sm-6.col-md-4:hover{
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