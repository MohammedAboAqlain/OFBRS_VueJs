<template>
  <div id="main-wrapper" class="rounded-bottom mb-2">
      <div class="d-flex justify-content-between px-5 py-3">
          <div>
              <button class="btn btn-light font-weight-bold">تفريم البكس المحطمة</button>
              <div class="font-weight-bold mt-2" style="text-align:center;">البكس المحطمة <span>0</span> بكسة</div>
          </div>
          <h4>البُكس المتبقية في المخزن <span>{{ remaining_balance }}</span> بكسة</h4>
          <div>
              <button class="btn btn-light font-weight-bold">تصفير البكس غير معروفة المصير</button>
              <div class="font-weight-bold mt-2" style="text-align:center;">البكس المفقودة <span>0</span> بكسة</div>
          </div>
      </div>
      <hr class="my-0">
      <div class="d-flex justify-content-between align-items-center px-1 py-2">
          <div class="font-weight-bold">البكس المصنعة <span>0</span> بكسة</div>
          <div>
              <button class="btn btn-light">حذف المحدد</button>
          </div>
          <div class="d-flex align-items-center">
              <div class="ml-2">تاريخ الانشاء: </div>
              <div>
                  <div class="mb-2"><input type="date"></div>
                  <div><input type="date"></div>
              </div>
          </div>
          <div class="d-flex align-items-center">
              <div class="ml-2">تاريخ التعديل: </div>
              <div>
                  <div class="mb-2"><input type="date"></div>
                  <div><input type="date"></div>
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
            <td>{{ item.caused_by }}</td>
            <td>{{ item.entry_type }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.created_at }}</td>
            <td>{{ item.updated_at }}</td>
            <td>{{ item.notes }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="d-flex justify-content-between align-items-center py-3">
        <div class="d-flex align-items-center border-left">
            <label for="add_boxes" class="ml-2 font-weight-bold">إضافة بُكس مصنعة للمخزن: </label>
            <input type="text" class="form-control" style="width:30%;display:inline-block;" placeholder="أدخل عدد البكس">
            <span class="mr-2"><button class="btn btn-light">إضافة</button></span>
        </div>
        <div class="border-left" style="text-align:center;">مجموع البكس المعروضة في الجدول <span>0</span></div>
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
            {headers: { Authorization: `Bearer ${this.getToken}` }
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
              {headers: { Authorization: `Bearer ${this.getToken}` }
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
    deleteSelectedItems(){
      let result = []
      for(let i = 0; i < this.items.length; i++){
        if(!this.items[i].isChecked){
          result.push(this.items[i]);
        }
      }
      this.items = result;
    },
  },
  created() {
    this.overFlow = new Map();
    // get storage balance
    axios
      .get('https://127.0.0.1:8000/api/get-storage_balance', {
        headers: { Authorization: `Bearer ${this.getToken}` }
      })
      .then((res) => {
        console.log(res);
        this.remaining_balance = res.data;
      })
      .catch((err) => console.log(err));


      this.setHasIntries(false);
  },
  computed: {
    ...mapGetters(['getToken']),
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
