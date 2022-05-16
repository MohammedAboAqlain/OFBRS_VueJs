<template>
    <div>
        <h1 class="text-center mb-5 pt-4">مرحبا {{ getUser.name.split(" ")[0]}}</h1>
        <div class="row text-right mx-3 my-4">
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
                        <input type="text" disabled :value="(getAllMarkets.find(x => x.id == getUser.market) || {}).name">
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

        <h4 style="color:blue;" class="text-right mx-2 pb-3">قيود المستخدم:</h4>

        <div class="mx-2 pb-2">
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
                    <tr v-for="item in items" :key="item.number">
                    <td scope="row">
                        <input
                        v-model="item.isChecked"
                        type="checkbox"
                        class="form-control"
                        />
                    </td>
                    <td style="min-width:120px;">{{ item.giver_name }}</td>
                    <td style="min-width:120px;">{{ item.taker_name }}</td>
                    <td>{{ entry_types.find(x => x.id == item.type).name }}</td>
                    <td>{{ item.quantity }}</td>
                    <td>{{ item.unit_price? item.unit_price : '-' }}</td>
                    <td>{{ item.date_created? item.date_created.split("T")[0] : null }}</td>
                    <td>{{ item.date_updated? item.date_updated.split("T")[0] : null }}</td>
                    <td>{{ item.comment }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import axios from 'axios'
    export default {
        data(){
            return {
                getAllMarkets: [],
                entry_types: [
                    {
                    id: 1,
                    name: 'تسليم'
                    },
                    {
                    id: 2,
                    name: 'بيع'
                    },
                    {
                    id: 3,
                    name: 'ارجاع'
                    },
                    {
                    id: 5,
                    name: 'قيد تصحيحي'
                    },
                    {
                    id: 7,
                    name: 'قيد مراجعة'
                    },
                    {
                    id: 9,
                    name: 'ارجاع زيادة'
                    },
                    {
                    id: 10,
                    name: 'بيع زيادة'
                    },
                ],
                items: [],
            }
        },
        computed: mapGetters(['getUser', 'getToken']),
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
        created(){
            // getting markets
            axios.get('http://127.0.0.1:8000/api/index-market/')
                .then(res => {
                    let result = [];
                    for (let i = 0; i < res.data.item.length; i++) {
                        result.push({name:res.data.item[i].name, id: res.data.item[i].id});
                    }
                    this.getAllMarkets = result;
                    console.log(res.data.item);
                })
                .catch(err => console.log(err));

            axios
            .get(`http://127.0.0.1:8000/api/get-entries/${this.getUser.id}/`, {
                params: {
                    From_date_created: '2022-02-01',
                    To_date_created: '2028-05-31',
                    From_date_updated: '2022-03-17',
                    To_date_updated: '2028-05-31',
                },
                headers: { Authorization: `Token ${this.getToken}` },
                })
                .then(res => {
                console.log(res);
                this.items = res.data.data;
                })
                .catch((err) => console.log(err));
            

            // this.items.push(
            //     {
            //         id: 1,
            //         giver_name: 'giver',
            //         taker_name: 'taker',
            //         type: 3,
            //         quantity: 10,
            //         unit_price: 0,
            //         date_created: '2022-03-08',
            //         date_updated: '2022-03-08',
            //         comment: 'comment'
            //     }
            // );
        },
    }
</script>

<style scoped>
.main-wrapper {
  width: 100%;
  background-color: var(--color-caprice-yellow);
}

div.h80 {
  height: 10vh;
  display: table;
}

.middle {
  display: table-cell;
  vertical-align: middle;
}

.table {
  min-height: 55vh;
}

thead {
  background-color: var(--color-light-grey);
}

td {
  padding: 3px;
}
tr:hover {
  cursor: pointer;
}

.rounded-bottom {
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
}
</style>
