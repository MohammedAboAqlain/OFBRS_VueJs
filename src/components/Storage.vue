<template>
  <div id="main-wrapper" class="rounded-bottom mb-2">
      <div class="d-flex justify-content-between px-5 py-3">
          <div>
              <button class="btn btn-light font-weight-bold">تفريم البكس المحطمة</button>
              <div class="font-weight-bold mt-2" style="text-align:center;">البكس المحطمة <span>{{ broken_boxes }}</span> بكسة</div>
          </div>
          <h4>البُكس المتبقية في المخزن <span>{{ remaining_balance }}</span> بكسة</h4>
          <div>
              <button class="btn btn-light font-weight-bold">تصفير البكس غير معروفة المصير</button>
              <div class="font-weight-bold mt-2" style="text-align:center;">البكس المفقودة <span>{{ lost_boxes }}</span> بكسة</div>
          </div>
      </div>
      <hr class="my-0">
      <div class="d-flex justify-content-between align-items-center px-1 py-2">
          <div class="font-weight-bold">البكس المصنعة <span>{{ manufactured_boxes }}</span> بكسة</div>
          <div>
              <button class="btn btn-light" @click="deleteSelectedItems">حذف المحدد</button>
          </div>
          <div class="d-flex align-items-center">
              <div class="ml-2">تاريخ الانشاء: </div>
              <div>
                  <div class="mb-2"><input type="date" v-model="From_date_created" @change="get_storage_entries"></div>
                  <div><input type="date" v-model="To_date_created" @change="get_storage_entries"></div>
              </div>
          </div>
          <div class="d-flex align-items-center">
              <div class="ml-2">تاريخ التعديل: </div>
              <div>
                  <div class="mb-2"><input type="date" v-model="From_date_updated" @change="get_storage_entries"></div>
                  <div><input type="date" v-model="To_date_updated" @change="get_storage_entries"></div>
              </div>
          </div>
          <div>
              <button class="btn btn-light">نوع القيد</button>
          </div>
          <div>
            <div class="font-weight-bold">بكس الصيادين <span>0</span> بكسة</div>
            <div class="font-weight-bold">بكس التجار <span>0</span> بكسة</div>
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
            <td>{{ entry_type_map[item.type] }}</td>
            <td>{{ item.quantity_diff }}</td>
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
            <input type="text" v-model="add_manufacured_boxes" class="form-control" style="width:30%;display:inline-block;" placeholder="أدخل عدد البكس">
            <span class="mr-2"><button class="btn btn-light" @click="add_storage_entry">إضافة</button></span>
        </div>
        <div class="border-left" style="text-align:center;">مجموع البكس المعروضة في الجدول <span>{{ sum_items_balance }}</span></div>
        <div class="d-flex align-items-center justify-content-end">
            <label for="add_boxes" class="ml-2 font-weight-bold">تبليغ عن بُكس محطمة</label>
            <input type="text" class="form-control" style="width:30%;display:inline-block;" placeholder="أدخل عدد البكس">
            <span class="mr-2"><button class="btn btn-light">إضافة</button></span>
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
      date: null,
      remaining_balance: 0,
      broken_boxes: 0,
      lost_boxes: 0,
      manufactured_boxes: 0,
      From_date_created: null,
      To_date_created: null,
      From_date_updated: null,
      To_date_updated: null,
      add_manufacured_boxes: null,
      caused_by_map: {
        1: 'المسئول'
      },
      entry_type_map: {
        1: 'تسليم',
        2: 'بيع',
        3: 'ارجاع',
        22: 'إضافة بٌكس إلى المخزن',
        24: 'تصفير'
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
    get_caused_by(user_type){
      return this.caused_by_map[user_type]
    },
    add_storage_entry(){
      if(!this.add_manufacured_boxes){
        alert('يجب إدخال عدد البكس');
        return;
      }
      axios.post('http://127.0.0.1:8000/api/add-storage-entry/', 
      {
          type: 22,
          caused_by: 1,
          quantity_diff: this.add_manufacured_boxes,
          comment: 'comment'
      },
      {headers: { Authorization: `Token ${this.getToken}` }})
      .then(res => {
          console.log(res);
          this.add_manufacured_boxes = null
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
    confirmAction(){
      if(this.items.length == 0){
        alert('لا يوجد قيود لاعتمادها!');
        return;
      }
      if(confirm(`
          عدد البكس المضافة = ${this.numOfBoxes}، عدد القيود = ${this.items.length}
          هل تريد اعتماد البيانات المدخلة؟
        `)){
        console.log('confirmed..');

        let giver_id;
        let taker_id;

        for(let i = 0; i < this.items.length; i++){
          for(let j = 0; j < this.sellers.length; j++){
            if(this.sellers[j].name.includes(this.items[i].seller)){
              taker_id = this.sellers[j].id;
              break;
            }
          }
          for(let j = 0; j < this.fishermen.length; j++){
            if(this.fishermen[j].name.includes(this.formData.fisherman)){
              giver_id = this.fishermen[j].id;
              break;
            }
          }

          let entry = {
            entry_type_id: 2,
            giver_id,
            taker_id,
            quantity: this.items[i].quantity,
            unit_price: this.items[i].price,
            comment: this.items[i].notes
          }
          console.log(entry);
          axios.post('https://127.0.0.1:8000/api/add-entry', entry, 
            {headers: { Authorization: `Token ${this.getToken}` }
          })
          .then(res => {
            console.log(res);
          })
          .catch(err => console.log(err));

          // handle 'بيع زيادة'
          let item;
          if(this.overFlow){
            item = this.overFlow.get(this.items[i].id);
          }
          
          if(item){
            entry = {
              entry_type_id: 10,
              giver_id: 0,
              taker_id: giver_id,
              quantity: item,
              unit_price: this.items[i].price,
              comment: 'بيع الصياد بكس زيادة عن ما أخذ'
            }
            console.log(entry);
            axios.post('https://127.0.0.1:8000/api/add-entry', entry, 
              {headers: { Authorization: `Token ${this.getToken}` }
            })
            .then(res => {
              console.log(res);
            })
            .catch(err => console.log(err));
          }

        }
        

        this.formData.fisherman = '';
        this.items = [];
      } else {
        console.log('canceled...');
      }
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
    // get storage balance
    axios
      .get('http://127.0.0.1:8000/api/get-storage_balance/', {
        headers: { Authorization: `Token ${this.getToken}` }
      })
      .then((res) => {
        console.log(res);
        this.remaining_balance = res.data.balance;
      })
      .catch((err) => console.log(err));

      axios
      .get('http://127.0.0.1:8000/api/get-broken/', {
        headers: { Authorization: `Token ${this.getToken}` }
      })
      .then((res) => {
        console.log(res);
        this.broken_boxes = res.data.broken;
      })
      .catch((err) => console.log(err));
      
      axios
      .get('http://127.0.0.1:8000/api/get-lost/', {
        headers: { Authorization: `Token ${this.getToken}` }
      })
      .then((res) => {
        console.log(res);
        this.lost_boxes = res.data.lost;
      })
      .catch((err) => console.log(err));

      axios
      .get('http://127.0.0.1:8000/api/get-number_manufactured/', {
        headers: { Authorization: `Token ${this.getToken}` }
      })
      .then((res) => {
        console.log(res);
        this.manufactured_boxes = res.data.number_manufactured;
      })
      .catch((err) => console.log(err));


      this.setHasIntries(false);
  },
  computed: {
    ...mapGetters(['getToken']),
    sum_items_balance(){
      let sum = this.items? this.items.reduce((a, b) => ({quantity_diff: a.quantity_diff + b.quantity_diff}), {quantity_diff: 0}) : {quantity_diff: 0};
      return sum.quantity_diff;
    },
    selectedFishermanBalance(){
      let result = 0;
      for(let i = 0; i < this.fishermen.length; i++){
        if(this.fishermen[i].name == this.formData.fisherman){
          result = this.fishermen[i].balance;
          break;
        }
      }
      return result;
    },
    remainBalance(){
      return this.formData.fisherman? this.selectedFishermanBalance - this.numOfBoxes : 0;
    },
    numOfBoxes(){
      return this.items.reduce(function(current, previous) { 
          return current + parseInt(previous.quantity)
        }, 0);
    }
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
