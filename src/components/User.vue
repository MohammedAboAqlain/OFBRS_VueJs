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
                                <td>{{ type == 'Fishermen'? getUserType(item.type_id) : getUserType(item.market_id) }}</td>
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
    import { mapGetters, mapActions } from 'vuex'
    export default {
        data(){
            return {
                items: [],
                filteredItems: [],
                getAllMarkets: null,
                searchValue: '',
                type: this.$route.params.type,
                marKetOrUserType: ''
            }
        },
        created(){
            // getting markets
            axios.get('http://127.0.0.1:8000/api/index-market/')
                .then(res => {
                    console.log(res);
                    this.getAllMarkets = res.data.item;
                })
                .catch(err => console.log(err));


            if(this.type == 'Fishermen'){
                this.marKetOrUserType = 'نوع المركبة';
                axios.get('http://127.0.0.1:8000/api/get-all-fisherman/',
                    {headers: { Authorization: `Token ${this.getToken}` }}
                ).then(res => {
                    console.log(res);
                    this.items = res.data.data;
                    this.filteredItems = res.data.data;
                }).catch(
                    err => console.log(err)
                );
            } else if (this.type == 'Sellers'){
                this.marKetOrUserType = 'السوق';
                axios.get('http://127.0.0.1:8000/api/get-all-seller/',
                    {headers: { Authorization: `Token ${this.getToken}` }}
                ).then(res => {
                    console.log(res);
                    this.items = res.data.data;
                    this.filteredItems = res.data.data;
                }).catch(
                    err => console.log(err)
                );
            }
        },
        methods: {
            ...mapActions(['fetchMarkets']),
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
                    return this.getAllMarkets.find(x => x.id == type_id).name;
                }
            },
            search(){
                if(!this.searchValue){
                    this.filteredItems = this.items;
                    return;
                }
                this.filteredItems = this.items.filter(item => {
                    // TODO: handle search by darsh_key
                    // return item.darsh_key.toString().includes(this.searchValue) ||
                    //         item.name.toString().includes(this.searchValue) ||
                    //         item.phone.toString().includes(this.searchValue)
                    return  item.name.toString().includes(this.searchValue) ||
                            item.phone.toString().includes(this.searchValue)
                });
            }
        },
        computed: mapGetters(['getToken'])
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
