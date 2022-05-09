<template>
  <div id="main-wrapper" class="rounded-bottom mb-2">
      <div class="d-flex justify-content-between px-5 py-3">
          <div>
              <button @click="reset_broken" class="btn btn-light font-weight-bold">تفريم البكس المحطمة</button>
              <div class="font-weight-bold mt-2" style="text-align:center;">البكس المحطمة <span>{{ -broken_boxes }}</span> بكسة</div>
          </div>
          <h4>البُكس المتبقية في المخزن <span>{{ remaining_balance }}</span> بكسة</h4>
          <div>
              <button @click="reset_lost" class="btn btn-light font-weight-bold">تصفير البكس غير معروفة المصير</button>
              <div class="font-weight-bold mt-2" style="text-align:center;">البكس المفقودة <span>{{ -lost_boxes }}</span> بكسة</div>
          </div>
      </div>
      <hr class="my-0">
      <div class="d-flex justify-content-between align-items-center px-1 py-2">
          <!-- <div class="font-weight-bold">البكس المصنعة <span>{{ manufactured_boxes }}</span> بكسة</div> -->
          <div>
              <button class="btn btn-light" @click="deleteSelectedItems">حذف المحدد</button>
          </div>
          <div class="d-flex align-items-center">
              <div class="ml-2">تاريخ الانشاء: </div>
              <div>
                  <div class="mb-2"><input type="date" class="form-control" v-model="From_date_created" @change="get_storage_entries"></div>
                  <div><input type="date" class="form-control" v-model="To_date_created" @change="get_storage_entries"></div>
              </div>
          </div>
          <div class="d-flex align-items-center">
              <div class="ml-2">تاريخ التعديل: </div>
              <div>
                  <div class="mb-2"><input type="date" class="form-control" v-model="From_date_updated" @change="get_storage_entries"></div>
                  <div><input type="date" class="form-control" v-model="To_date_updated" @change="get_storage_entries"></div>
              </div>
          </div>
          <div>
            <div class="font-weight-bold">بكس الصيادين <span>{{ fsellers_balance }}</span> بكسة</div>
            <div class="font-weight-bold">بكس التجار <span>{{  fishermen_balance }}</span> بكسة</div>
          </div>
      </div>

    <div class="table-wrapper-scroll-y my-custom-scrollbar">
      <table class="table table-hover table-bordered text-center">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">المسبب</th>
            <th scope="col">نوع القيد</th>
            <th scope="col">الكمية</th>
            <th scope="col">تاريخ الانشاء</th>
            <th scope="col">تاريخ التعديل</th>
            <th scope="col">ملاحظات</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in items"
            :key="item.number"
            style="height: fit-content"
          >
            <td scope="row">
              <input type="checkbox" v-model="item.isChecked" class="form-control m-0" />
            </td>
            <td>{{ caused_by_map[item.caused_by] }}</td>
            <td>{{ entry_types? entry_types.find(x => x.id == item.type).name: '' }}</td>
            <td>{{ item.quantity_diff > 0? item.quantity_diff: -item.quantity_diff }}</td>
            <td>{{ item.date_created }}</td>
            <td>{{ item.date_updated }}</td>
            <td>{{ item.comment }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="d-flex justify-content-between align-items-center py-3">
        <div class="d-flex align-items-center border-left">
            <label for="add_boxes" class="ml-2 font-weight-bold">إضافة بُكس مصنعة للمخزن: </label>
            <input type="text" v-model="add_manufactured_boxes" class="form-control" style="width:30%;display:inline-block;" placeholder="أدخل عدد البكس">
            <span class="mr-2"><button class="btn btn-light" @click="add_storage_entry">إضافة</button></span>
        </div>
        <div class="border-left" style="text-align:center;">مجموع البكس المعروضة في الجدول <span>{{ sum_items_balance }}</span></div>
        <div class="d-flex align-items-center justify-content-end">
            <label for="add_boxes" class="ml-2 font-weight-bold">تبليغ عن بُكس محطمة</label>
            <input v-model="num_of_broken_bexes_to_add" type="text" class="form-control" style="width:30%;display:inline-block;" placeholder="أدخل عدد البكس">
            <span @click="tell_about_broken_bexes" class="mr-2"><button class="btn btn-light">إضافة</button></span>
        </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      fishermen_balance: 0,
      fsellers_balance: 0,
      num_of_broken_bexes_to_add: null,
      entry_types: [],
      date: null,
      remaining_balance: 0,
      broken_boxes: 0,
      lost_boxes: 0,
      manufactured_boxes: 0,
      From_date_created: this.getDateNow(),
      To_date_created: this.getDateNow(),
      From_date_updated: this.getDateNow(),
      To_date_updated: this.getDateNow(),
      add_manufactured_boxes: null,
      caused_by_map: {
        1: 'الآدمن'
      },
      overFlow: null,
      fishermen: [],
      sellers: [],
      formData: {
          quantity: '',
          price: '',
          seller: '',
          notes: '',
          fisherman: '',
      },
      dataFields: { value: 'name' },
      items: [],
    };
  },
  methods: {
    ...mapActions(['setHasIntries']),
    reset_broken(){
      if(!confirm('هل تريد بالفعل تفريم البكس المحطمة؟')){
        return;
      }
      axios
      .put('http://127.0.0.1:8000/api/reset-broken/', {} ,{
        headers: { Authorization: `Token ${this.getToken}` }
      })
      .then((res) => {
        console.log(res);
        this.get_storage_balance();
        this.get_broken_boxes();
        this.get_storage_entries();
      })
      .catch((err) => console.log(err));
    },
    reset_lost(){
      if(!confirm('هل تريد بالفعل تفريم البكس المفقودة؟')){
        return;
      }
      axios
      .put('http://127.0.0.1:8000/api/reset-lost/', {} ,{
        headers: { Authorization: `Token ${this.getToken}` }
      })
      .then((res) => {
        console.log(res);
        this.get_storage_balance();
        this.get_lost_boxes();
        this.get_storage_entries();
      })
      .catch((err) => console.log(err));
    },
    get_storage_balance(){
      axios
      .get('http://127.0.0.1:8000/api/get-storage_balance/', {
        headers: { Authorization: `Token ${this.getToken}` }
      })
      .then((res) => {
        console.log(res);
        this.remaining_balance = res.data.balance;
      })
      .catch((err) => console.log(err));
    },
    get_entry_types(){
      axios
      .get('http://127.0.0.1:8000/api/get-entry_type/', {
        headers: { Authorization: `Token ${this.getToken}` },
      })
      .then((res) => {
        console.log(res);
        this.entry_types = res.data.item;
      })
      .catch((err) => console.log(err));
    },
    get_broken_boxes(){
      axios
      .get('http://127.0.0.1:8000/api/get-broken/', {
        headers: { Authorization: `Token ${this.getToken}` }
      })
      .then((res) => {
        console.log(res);
        this.broken_boxes = res.data.broken;
      })
      .catch((err) => console.log(err));
    },
    get_lost_boxes(){
      axios
      .get('http://127.0.0.1:8000/api/get-lost/', {
        headers: { Authorization: `Token ${this.getToken}` }
      })
      .then((res) => {
        console.log(res);
        this.lost_boxes = res.data.lost;
      })
      .catch((err) => console.log(err));
    },
    get_number_of_manufactured_boxes(){
      axios
      .get('http://127.0.0.1:8000/api/get-number_manufactured/', {
        headers: { Authorization: `Token ${this.getToken}` }
      })
      .then((res) => {
        console.log(res);
        this.manufactured_boxes = res.data.number_manufactured;
      })
      .catch((err) => console.log(err));
    },
    tell_about_broken_bexes(){
      if(!this.num_of_broken_bexes_to_add){
        alert('يجب إضافة عدد البكس أولا...');
        return;
      }
      axios.post('http://127.0.0.1:8000/api/add-storage-entry/',
      {
          type: 11,
          caused_by: 1,
          quantity_diff: -1*this.num_of_broken_bexes_to_add,
          comment: ''
      },
      {headers: { Authorization: `Token ${this.getToken}` }})
      .then(res => {
          console.log(res);
          this.num_of_broken_bexes_to_add = null;
          this.get_storage_balance();
          this.get_storage_entries();
          this.get_broken_boxes();
      })
      .catch(err => {
          console.log(err);
      });
    },
    get_caused_by(user_type){
      return this.caused_by_map[user_type]
    },
    add_storage_entry(){
      if(!this.add_manufactured_boxes){
        alert('يجب إدخال عدد البكس');
        return;
      }
      axios.post('http://127.0.0.1:8000/api/add-storage-entry/', 
      {
          type: 22,
          caused_by: 1,
          quantity_diff: this.add_manufactured_boxes,
          comment: ''
      },
      {headers: { Authorization: `Token ${this.getToken}` }})
      .then(res => {
          console.log(res);
          this.add_manufactured_boxes = null;
          this.get_storage_balance();
          this.get_storage_entries();
      })
      .catch(err => {
          console.log(err);
      });
    },
    deleteSelectedItems() {
      let result = [];
      for (let i = 0; i < this.items.length; i++) {
        if (!this.items[i].isChecked) {
          result.push(this.items[i]);
        }
      }
      this.items = result;
    },
    get_storage_entries(){
      if(!this.From_date_created || !this.To_date_created || !this.From_date_updated || !this.To_date_updated){
        return;
      }
      axios
      .get('http://127.0.0.1:8000/api/get-storage-entries/', {
        params: {
          From_date_created: this.From_date_created,
          To_date_created: this.To_date_created,
          From_date_updated: this.From_date_updated,
          To_date_updated: this.To_date_updated
        },
        headers: { Authorization: `Token ${this.getToken}` }
      })
      .then((res) => {
        console.log(res);
        this.items = res.data.data;
      })
      .catch((err) => console.log(err));
    },
    getDateNow(){
      var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;

        return [year, month, day].join('-');
    },
    addEntry() {
      if(!this.formData.fisherman){
        alert('اختر الصياد أولا!');
        return;
      }
      let length = this.items.length;
      let overflowValue = (this.remainBalance > 0)? this.formData.quantity - this.remainBalance : this.formData.quantity;
      this.items.push({
        id: length+1,
        quantity: this.formData.quantity,
        price: this.formData.price,
        seller: this.formData.seller,
        notes: (overflowValue < 0)? this.formData.notes : `بيع زيادة ${overflowValue}`,
        isChecked: false
      });
      if(this.formData.quantity > this.remainBalance){
        this.overFlow.set(length+1, overflowValue);
      }
      this.formData.quantity = '';
      this.formData.price = '';
      this.formData.seller = '';
      this.formData.notes = '';
    },
  },
  created() {
    this.overFlow = new Map();

    axios
    .get('http://127.0.0.1:8000/api/get-Seller-balances/', {
      headers: { Authorization: `Token ${this.getToken}` },
    })
    .then((res) => {
      console.log(res);
      this.fishermen_balance = res.data.balances;
    })
    .catch((err) => console.log(err));
    
    axios
    .get('http://127.0.0.1:8000/api/get-fisherman-balances/', {
      headers: { Authorization: `Token ${this.getToken}` },
    })
    .then((res) => {
      console.log(res);
      this.fsellers_balance = res.data.balances;
    })
    .catch((err) => console.log(err));

    this.get_entry_types();
    this.get_storage_balance();
    this.get_storage_entries();
    this.get_broken_boxes();
    this.get_lost_boxes();
    this.get_number_of_manufactured_boxes();
    this.setHasIntries(false);
  },
  computed: {
    ...mapGetters(['getToken']),
    sum_items_balance(){
      let sum = this.items? this.items.reduce((a, b) => a + (b.quantity_diff > 0? b.quantity_diff: -1*b.quantity_diff) , 0) : 0;
      return sum;
    },
  },
  watch: {
    items(){
      if(this.items.length > 0){
        this.setHasIntries(true);
      }else{
        this.setHasIntries(false);
      }
    }
  }
};
</script>

<style scoped>
@import url('https://cdn.syncfusion.com/ej2/material.css');

#main-wrapper {
  width: 100%;
  max-height: 200vh;
  background-color: #eee;
}

div.h80 {
  height: 10vh;
  display: table;
}

h3 {
  display: table-cell;
  vertical-align: middle;
}

.table {
  min-height: 60vh;
}

.my-custom-scrollbar {
  height: 60vh;
}

.table-wrapper-scroll-y {
  min-height: 60vh;
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
</style>
