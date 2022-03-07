<template>
    <div class="bg-light">
        <h1 class="text-center py-4">{{ type == 'Fishermen'? 'الصيادين' : 'التجار' }}</h1>
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
                            <th scope="col">الرقم</th>
                            <th scope="col">الاسم</th>
                            <th scope="col">الجوال</th>
                            <th scope="col">الرصيد</th>
                            <th scope="col">{{ marKetOrUserType }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in filteredItems"
                                :key="item.number">
                                <td scope="row"><input type="checkbox" class="form-control"></td>
                                <td>{{ item.darsh_key }}</td>
                                <td>{{ item.name }}</td>
                                <td>{{ item.phone }}</td>
                                <td>{{ item.balance }}</td>
                                <td>{{ item.user_type }}</td>
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
                items: [],
                filteredItems: [],
                searchValue: '',
                type: this.$route.params.type,
                marKetOrUserType: ''
            }
        },
        created(){
            if(this.type == 'Fishermen'){
                this.marKetOrUserType = 'نوع المركبة';
                axios.get('https://127.0.0.1:8000/api/get-all-fisherman',
                    {headers: { Authorization: `Token ${this.getToken}` }}
                ).then(res => {
                    console.log(res);
                    let result = [];
                    for (let i = 0; i < res.data.data.length; i++) {
                        result.push({
                            darsh_key: res.data.data[i].darsh_key,
                            name: res.data.data[i].name,
                            phone: res.data.data[i].phone,
                            balance: res.data.data[i].balance,
                            user_type: this.getUserType(res.data.data[i].type_id)
                        });
                    }
                    this.items = result;
                    this.filteredItems = result;
                }).catch(
                    err => console.log(err)
                );
            } else if (this.type == 'Sellers'){
                this.marKetOrUserType = 'السوق';
                axios.get('https://127.0.0.1:8000/api/get-all-seller',
                    {headers: { Authorization: `Token ${this.getToken}` }}
                ).then(res => {
                    console.log(res);
                    let result = [];
                    for (let i = 0; i < res.data.data.length; i++) {
                        result.push({
                            darsh_key: res.data.data[i].darsh_key,
                            name: res.data.data[i].name,
                            phone: res.data.data[i].phone,
                            balance: res.data.data[i].balance,
                            user_type: this.getUserType(res.data.data[i].market_id)
                        });
                    }
                    this.items = result;
                    this.filteredItems = result;
                }).catch(
                    err => console.log(err)
                );
            }
        },
        methods: {
            getUserType(type_id){
                if(this.type == 'Fishermen'){
                    if(type_id == 5){
                        return 'صياد لنش';
                    }else if(type_id == 6){
                        return 'صياد حسكة';
                    }else{
                        return 'تاجر';
                    }
                } else{
                    console.log('getting market...')
                    return this.getAllMarkets[type_id];
                }
            },
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
        computed: mapGetters(['getToken', 'getAllMarkets'])
    }
</script>

<style scoped>
    .my-custom-scrollbar {
        height: 70vh;
    }

    .table-wrapper-scroll-y {
        min-height: 70vh;
    }
</style>
