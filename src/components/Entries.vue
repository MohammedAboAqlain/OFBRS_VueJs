<template>
    <div class="main-wrapper rounded-bottom">
        <div class="mx-auto" style="width:fit-content">
            <div class="h80">
                <div class="middle">
                    <div class="row justify-content-center align-items-center">
                        <!-- <button class="btn btn-light">تعديل التفاصيل</button> -->
                        <h6 class="ml-5">الرصيد:
                            <span class="ml-2">{{storage_balance}}</span>
                            <span>بكسة</span>
                        </h6>
                        <h1 class="mx-5">
                            جميع القيود
                        </h1>
                        <button class="btn btn-light mr-5">إضافة بكس من المخزن</button>
                    </div>
                </div>
            </div>
        </div>

        <hr color="white" class="my-0">

        <div class="row py-2 text-center text-md-right align-items-center">
            <div class="col-md-6 font-weight-bold">
                &nbsp;&nbsp;تاريخ الإنشاء: 
                <div class="row">
                    <div class="col-6">
                        <input v-model="created_from" type="date" class="form-control mr-2 w-75">
                    </div>
                    <div class="col-6">
                        <input v-model="created_to" type="date" class="form-control ml-2 w-75">
                    </div>
                </div>
                &nbsp;&nbsp;تاريخ التعديل: 
                <div class="row">
                    <div class="col-6">
                        <input v-model="updated_from" type="date" class="form-control mr-2 w-75">
                    </div>
                    <div class="col-6">
                        <input v-model="updated_to" type="date" class="form-control ml-2 w-75">
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="row justify-content-around mt-3">
                    <div class="col-6">
                        <button @click="deleteSelectedItems" class="btn btn-light w-75 mb-3">حذف المحدد</button>
                    </div>
                    <div class="col-6">
                        <button class="btn btn-light w-75 mb-3">تقرير يومي للمعروض</button>
                    </div>
                    <div class="col-6">
                        <select name="entry_types" id="entry_types_select" class="form-control w-75">
                            <option selected value="null">فلتر حسب نوع القيد</option>
                            <option v-for="type in entry_types" :key="type.id" :value="type.id">{{ type.name }}</option>
                        </select>
                    </div>
                    <div class="col-6">
                        <select name="entry_types" id="entry_types_select" class="form-control w-75">
                            <option selected value="null">فلتر حسب الحالة</option>
                            <option v-for="state in entry_states" :key="state" :value="state">{{ state }}</option>
                        </select>
                    </div>
                </div>
                <div class="mr-2">
                </div>
            </div>
        </div>

        <table class="table table-hover table-bordered text-center">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">المعطي</th>
                    <th scope="col">المتلقي</th>
                    <th scope="col">نوع القيد</th>
                    <th scope="col">الكمية</th>
                    <th scope="col">السعر</th>
                    <th scope="col">تاريخ الانشاء</th>
                    <th scope="col">تاريخ التعديل</th>
                    <th scope="col">ملاحظات</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in items"
                    :key="item.number">
                    <td scope="row"><input v-model="item.isChecked" type="checkbox" class="form-control"></td>
                    <td>{{ item.giver }}</td>
                    <td>{{ item.taker }}</td>
                    <td>{{ item.entry_type }}</td>
                    <td>{{ item.quantity }}</td>
                    <td>{{ item.price }}</td>
                    <td>{{ item.date_created }}</td>
                    <td>{{ item.date_updated }}</td>
                    <td>{{ item.notes }}</td>
                </tr>
            </tbody>
        </table>

        <div style="height:15px"></div>
    </div>
</template>

<script>

import axios from 'axios'
import { mapGetters } from 'vuex';

export default{
    data(){
        return {
            storage_balance: 0,
            entry_types : [
                {
                    id: 1,
                    name: 'استلام'
                },
                {
                    id: 1,
                    name: 'تسليم'
                },
                {
                    id: 1,
                    name: 'بيع'
                },
                {
                    id: 1,
                    name: 'بيع زيادة'
                },
                {
                    id: 1,
                    name: '...'
                }
            ],
            entry_states : [
                'حالة 1',
                'حالة 2',
                'حالة 3',
                'حالة 4'
            ],
            created_from: null,
            created_to: null,
            updated_from: null,
            updated_to: null,
            items: [
                {
                    isChecked: false,
                    giver: 'الحج ابراهيم',
                    taker: 'محمد',
                    entry_type: 'بيع',
                    quantity: 5,
                    price: 60,
                    date_created: '2021-12-21',
                    date_updated: '2021-12-21',
                    notes: 'ملاحظات هنا...'
                },
                {
                    isChecked: false,
                    giver: 'الحج ابراهيم',
                    taker: 'محمد',
                    entry_type: 'بيع',
                    quantity: 5,
                    price: 60,
                    date_created: '2021-12-21',
                    date_updated: '2021-12-21',
                    notes: 'ملاحظات هنا...'
                },
                {
                    isChecked: false,
                    giver: 'الحج ابراهيم',
                    taker: 'محمد',
                    entry_type: 'بيع',
                    quantity: 5,
                    price: 60,
                    date_created: '2021-12-21',
                    date_updated: '2021-12-21',
                    notes: 'ملاحظات هنا...'
                },
                {
                    isChecked: false,
                    giver: 'الحج ابراهيم',
                    taker: 'محمد',
                    entry_type: 'بيع',
                    quantity: 5,
                    price: 60,
                    date_created: '2021-12-21',
                    date_updated: '2021-12-21',
                    notes: 'ملاحظات هنا...'
                },
                {
                    isChecked: false,
                    giver: 'الحج ابراهيم',
                    taker: 'محمد',
                    entry_type: 'بيع',
                    quantity: 5,
                    price: 60,
                    date_created: '2021-12-21',
                    date_updated: '2021-12-21',
                    notes: 'ملاحظات هنا...'
                },
                {
                    isChecked: false,
                    giver: 'الحج ابراهيم',
                    taker: 'محمد',
                    entry_type: 'بيع',
                    quantity: 5,
                    price: 60,
                    date_created: '2021-12-21',
                    date_updated: '2021-12-21',
                    notes: 'ملاحظات هنا...'
                },
                {
                    isChecked: false,
                    giver: 'الحج ابراهيم',
                    taker: 'محمد',
                    entry_type: 'بيع',
                    quantity: 5,
                    price: 60,
                    date_created: '2021-12-21',
                    date_updated: '2021-12-21',
                    notes: 'ملاحظات هنا...'
                },
                {
                    isChecked: false,
                    giver: 'الحج ابراهيم',
                    taker: 'محمد',
                    entry_type: 'بيع',
                    quantity: 5,
                    price: 60,
                    date_created: '2021-12-21',
                    date_updated: '2021-12-21',
                    notes: 'ملاحظات هنا...'
                },
                {
                    isChecked: false,
                    giver: 'الحج ابراهيم',
                    taker: 'محمد',
                    entry_type: 'بيع',
                    quantity: 5,
                    price: 60,
                    date_created: '2021-12-21',
                    date_updated: '2021-12-21',
                    notes: 'ملاحظات هنا...'
                },
                {
                    isChecked: false,
                    giver: 'الحج ابراهيم',
                    taker: 'محمد',
                    entry_type: 'بيع',
                    quantity: 5,
                    price: 60,
                    date_created: '2021-12-21',
                    date_updated: '2021-12-21',
                    notes: 'ملاحظات هنا...'
                },
                {
                    isChecked: false,
                    giver: 'الحج ابراهيم',
                    taker: 'محمد',
                    entry_type: 'بيع',
                    quantity: 5,
                    price: 60,
                    date_created: '2021-12-21',
                    date_updated: '2021-12-21',
                    notes: 'ملاحظات هنا...'
                },
                {
                    isChecked: false,
                    giver: 'الحج ابراهيم',
                    taker: 'محمد',
                    entry_type: 'بيع',
                    quantity: 5,
                    price: 60,
                    date_created: '2021-12-21',
                    date_updated: '2021-12-21',
                    notes: 'ملاحظات هنا...'
                },
                {
                    isChecked: false,
                    giver: 'الحج ابراهيم',
                    taker: 'محمد',
                    entry_type: 'بيع',
                    quantity: 5,
                    price: 60,
                    date_created: '2021-12-21',
                    date_updated: '2021-12-21',
                    notes: 'ملاحظات هنا...'
                },
                {
                    isChecked: false,
                    giver: 'الحج ابراهيم',
                    taker: 'محمد',
                    entry_type: 'بيع',
                    quantity: 5,
                    price: 60,
                    date_created: '2021-12-21',
                    date_updated: '2021-12-21',
                    notes: 'ملاحظات هنا...'
                },
                {
                    isChecked: false,
                    giver: 'الحج ابراهيم',
                    taker: 'محمد',
                    entry_type: 'بيع',
                    quantity: 5,
                    price: 60,
                    date_created: '2021-12-21',
                    date_updated: '2021-12-21',
                    notes: 'ملاحظات هنا...'
                },
                {
                    isChecked: false,
                    giver: 'الحج ابراهيم',
                    taker: 'محمد',
                    entry_type: 'بيع',
                    quantity: 5,
                    price: 60,
                    date_created: '2021-12-21',
                    date_updated: '2021-12-21',
                    notes: 'ملاحظات هنا...'
                }
            ]
        }
    },
    methods: {
        deleteSelectedItems(){
            let result = []
            for(let i = 0; i < this.items.length; i++){
                if(!this.items[i].isChecked){
                    result.push(this.items[i]);
                }
            }
            this.items = result;
        }
    },
    computed: mapGetters(['getToken']),
    created(){
        let date = new Date(Date.now());
        this.created_from = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
        this.created_to = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
        this.updated_from = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
        this.updated_to = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();

        // get storage balance
        axios.get('https://127.0.0.1:8000/api/get-storage_balance',{
            headers: { Authorization: `Bearer ${this.getToken}` }
        })
        .then(res => {
            this.storage_balance = res.data;
        })
        .catch(err => console.log(err));
    }
}
</script>

<style scoped>
    .main-wrapper{
        width: 100%;
        background-color: var(--color-caprice-yellow);
    }

    div.h80{
        height: 10vh;
        display: table;
    }

    .middle{
        display: table-cell;
        vertical-align: middle;
    }

    .table{
        min-height: 55vh;
    }

    thead{
        background-color: var(--color-light-grey);
    }

    td{
        padding: 3px;
    }
    tr:hover{
        cursor: pointer;
    }

    .rounded-bottom{
        border-bottom-left-radius: 15px;
        border-bottom-right-radius: 15px;
    }
</style>