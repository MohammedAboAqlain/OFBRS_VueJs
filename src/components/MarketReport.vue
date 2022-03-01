<template>
    <div class="bg-light">
        <h1 class="text-center py-4">تقرير {{market_name}}</h1>
        <div class="row text-center">
            <div class="col-md-3">
                <input type="search" v-model="searchValue" @input="search" placeholder="بحث" class="form-control mx-md-3 mb-5">
            </div>
            <div class="col-md-9">
                <div class="table-wrapper-scroll-y my-custom-scrollbar">
                    <table class="table table-hover table-bordered text-center w-100">
                        <thead>
                            <tr>
                            <th scope="col"><input type="checkbox" class="form-control"></th>
                            <th scope="col">رقم التاجر</th>
                            <th scope="col">اسم التاجر</th>
                            <th scope="col">الجوال</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in filteredItems"
                                :key="item.number">
                                <td scope="row"><input type="checkbox" class="form-control"></td>
                                <td>{{ item.darsh_key }}</td>
                                <td>{{ item.name }}</td>
                                <td>{{ item.phone }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div style="width: 100%;height:20px"></div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { mapGetters } from 'vuex'
    export default {
        data(){
            return {
                market_id: this.$route.params.id,
                items: [],
                filteredItems: [],
                searchValue: ''
            }
        },
        computed: {
            ...mapGetters(['getToken', 'getAllMarkets']),
            market_name(){
                return this.getAllMarkets[this.market_id];
            }
        },
        methods: {
            search(){
                if(!this.searchValue){
                    this.filteredItems = this.items;
                    return;
                }
                this.filteredItems = this.items.filter(item => {
                    return item.darsh_key.toString().includes(this.searchValue) ||
                            item.name.toString().includes(this.searchValue) ||
                            item.phone.toString().includes(this.searchValue)
                });
            }
        },
        mounted(){
            axios.get(`https://127.0.0.1:8000/api/get-all-sellerByMarket/${this.market_id}`,
                {headers: { Authorization: `Bearer ${this.getToken}` }})
                .then(res => {
                    let result = [];
                    for (let i = 0; i < res.data.item.length; i++) {
                        result.push({
                            darsh_key: res.data.item[i].darsh_key,
                            name: res.data.item[i].name,
                            phone: res.data.item[i].phone
                        });
                    }
                    this.items = result;
                    this.filteredItems = result;
                })
                .catch(err => console.log(err));
        }
    }
</script>

<style scoped>
    .my-custom-scrollbar {
        height: 90vh;
    }

    .table-wrapper-scroll-y {
        min-height: 70vh;
    }
</style>
