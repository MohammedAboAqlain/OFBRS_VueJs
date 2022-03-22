<template>
    <div class="row text-center mx-0 rownded bg-light">
        <div class="col-12 d-flex justify-content-center align-items-center">
            <form>
                <div class="form-group">
                    <label for="market-name" class="font-weight-bold">اسم السوق:</label>
                    <select class="custom-select" v-model="market" id="validationTooltip04" required>
                        <option selected disabled value="null">اختر...</option>
                        <option v-for="item in markets" :key="item.id" :value="item.id">{{item.name}}</option>
                    </select>
                </div>
            </form>
        </div>
        <div class="col-12 d-flex justify-content-center align-items-end">
            <button @click="deleteMarket" class="btn btn-primary ml-2 px-5 mb-3">
                حذف السوق المحدد
            </button>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { mapGetters } from 'vuex'
    export default {
        data(){
            return {
                market: null,
                markets: []
            }
        },
        methods: {
            deleteMarket(){
                if(this.market == null){
                    alert('يجب تحديد سوق أولا');
                    return;
                }
                axios.delete(`http://127.0.0.1:8000/api/delete-market/${this.market}`,
                {headers: { Authorization: `Token ${this.getToken}` }}
                )
                    .then(res => {
                        console.log(res);
                        this.$router.push('/Markets');
                    })
                    .catch(err => console.log(err));
            }
        },
        created(){
            axios.get('http://127.0.0.1:8000/api/index-market')
            .then(res => {
                let result = [];
                for (let i = 0; i < res.data.item.length; i++) {
                    result.push({name:res.data.item[i].name, id: res.data.item[i].id});
                }
                this.markets = result;
                console.log(res.data.item);
            })
            .catch(err => console.log(err));
        },
        computed: mapGetters(['getToken'])
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
        border: 1px solid var(--color-grey);
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