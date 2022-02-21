<template>
    <div>
        <h1 class="text-center mb-5 pt-4">مرحبا {{ getUser.name}}</h1>
        <div class="row text-right mx-4 my-4">
            <div class="col-md-6 mb-2">
                <div class="row no-gutters">
                    <div class="col-4">
                        <label for="name" class="ml-3">اسم المستخدم: </label>
                    </div>
                    <div class="col-6">
                        <input type="text" disabled :value="getUser.name">
                    </div>
                </div>
            </div>
            <div class="col-md-6 mb-2">
                <div class="row no-gutters">
                    <div class="col-4">
                        <label for="name" class="ml-3">رقم الجوال: </label>
                    </div>
                    <div class="col-6">
                        <input type="text" disabled :value="getUser.phone">
                    </div>
                </div>
            </div>
            <div class="col-md-6 mb-2">
                <div class="row no-gutters">
                    <div class="col-4">
                        <label for="name" class="ml-3">نوع المستخدم: </label>
                    </div>
                    <div class="col-6">
                        <input type="text" disabled :value="getUserType(getUser.type_id)">
                    </div>
                </div>
            </div>
            <div class="col-md-6 mb-2">
                <div class="row no-gutters">
                    <div class="col-4">
                        <label for="name" class="ml-3">الرصيد: </label>
                    </div>
                    <div class="col-6">
                        <input type="text" disabled :value="(getUser.balance)? getUser.balance : 0">
                    </div>
                </div>
            </div>
            <div v-if="getUser.type_id == 1" class="col-md-6 mb-2">
                <div class="row no-gutters">
                    <div class="col-4">
                        <label for="name" class="ml-3">السوق: </label>
                    </div>
                    <div class="col-6">
                        <input type="text" disabled :value="getAllMarkets[getUser.market_id]">
                    </div>
                </div>
            </div>
            <div class="col-md-6 mb-2">
                <div class="row no-gutters">
                    <div class="col-4">
                        <label for="name" class="ml-3">تاريخ انشاء الحساب: </label>
                    </div>
                    <div class="col-6">
                        <input type="text" disabled :value="getUser.created_at.split('T')[0]">
                    </div>
                </div>
            </div>
            <div class="col-md-6 mb-2">
                <div class="row no-gutters">
                    <div class="col-4">
                        <label for="name" class="ml-3">تاريخ اخر تعديل: </label>
                    </div>
                    <div class="col-6">
                        <input type="text" disabled :value="getUser.updated_at.split('T')[0]">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    export default {
        computed: mapGetters(['getUser', 'getAllMarkets']),
        methods: {
            getUserType(type_id){
                if(type_id == 1){
                    return 'تاجر'
                } else if (type_id == 5){
                    return 'صياد لنش'
                } else {
                    return 'صياد حسكة'
                }
            }
        },
        mounted(){
            console.log(this.getAllMarkets);
        }
    }
</script>