<template>
  <div id="main-wrapper" class="rounded-bottom mb-2">
    <div class="mx-auto" style="width: fit-content">
      <div class="h80">
        <h3>تبييض كشف صياد</h3>
      </div>
    </div>
    <div class="table-wrapper-scroll-y my-custom-scrollbar">
      <table class="table table-hover table-bordered text-center">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">الرقم</th>
            <th scope="col">العدد</th>
            <th scope="col">السعر</th>
            <th scope="col">التاجر</th>
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
            <td>{{ item.id }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.price }}</td>
            <td>{{ item.seller }}</td>
            <td>{{ item.notes }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="row py-2 text-center text-md-right no-gutters border-bottom">
      <div class="col-md-6 col-lg-2">
        <div class="mr-2">
          <button @click="deleteSelectedItems" class="btn btn-light mb-3 mb-md-0">حذف المحدد</button>
        </div>
      </div>
      <div class="col-md-6 col-lg-3 px-4 my-3 my-md-2 my-lg-0">
        <ejs-autocomplete
          id="searchFishermen"
          v-model="formData.fisherman"
          :dataSource="fishermen"
          :fields="dataFields"
          autofill="true"
          placeholder="ابحث عن الصياد"
          :highlight="true"
        >
        </ejs-autocomplete>
      </div>
      <div class="col-md-6 col-lg-3">
        الرصيد المتبقي للصياد:
        <span>{{ (remainBalance > 0)? remainBalance : 0 }}</span>
      </div>
      <div class="col-md-6 col-lg-3">
        العدد الإجمالي للبكس غير المعتمدة:
        <span>{{ numOfBoxes }}</span>
      </div>
      <div class="col-lg-1 text-left">
        <div class="ml-2">
          <button @click="confirmAction" class="btn btn-light">اعتماد</button>
        </div>
      </div>
    </div>
    <div class="mx-4 px-4">
      <div
        class="row py-2 text-center align-items-baseline text-md-right no-gutters"
      >
        <div class="col-md-5 col-lg-2">
          <div class="form-group">
            <label for="quantity">العدد: </label>
            <input
              v-model="formData.quantity"
              class="w-50 mr-3 form-control d-inline-block"
              type="text"
              id="quantity"
            />
          </div>
        </div>
        X
        <!-- <div class="col-2 col-md-1 text-center">X</div> -->
        <div class="col-md-5 col-lg-2">
          <div class="form-group mr-3">
            <label for="quantity">السعر: </label>
            <input
              v-model="formData.price"
              class="w-50 mx-3 form-control d-inline-block"
              type="text"
              id="quantity"
            />
          </div>
        </div>
        <label class="col-2 col-lg-1 text-left pl-3" for="quantity"
          >التاجر:
        </label>
        <div class="col-9 col-md-3 col-lg-2">
          <ejs-autocomplete
            id="searchFishermen"
            v-model="formData.seller"
            :dataSource="sellers"
            :fields="dataFields"
            autofill="true"
            placeholder="ابحث عن تاجر"
            :highlight="true"
          >
          </ejs-autocomplete>
        </div>
        <div class="col-md-6 col-lg-3 my-3 my-md-0">
          <input
            v-model="formData.notes"
            type="text"
            class="w-75 form-control mx-auto mx-md-3"
            placeholder="أضف ملاحظة"
          />
        </div>
        <div class="col-md-6 col-lg-1 text-center text-md-left">
          <div class="ml-2">
            <button @click="addEntry" class="btn btn-light mt-3 mt-md-0">
              اضافة
            </button>
          </div>
        </div>
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
          axios.post('https://fisher.foxytech.xyz/api/add-entry', entry, 
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
            axios.post('https://fisher.foxytech.xyz/api/add-entry', entry, 
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
    // get all fishermen
    axios
      .get('https://fisher.foxytech.xyz/api/get-all-fisherman', {
        headers: { Authorization: `Bearer ${this.getToken}` }
      })
      .then((res) => {
        console.log(res);
        let result = [];
        for (let i = 0; i < res.data.data.length; i++) {
          result.push({
            id: res.data.data[i].id,
            darsh_key: res.data.data[i].darsh_key,
            name: res.data.data[i].name,
            phone: res.data.data[i].phone,
            balance: res.data.data[i].balance
          });
          this.fishermen = result;
        }
      })
      .catch((err) => console.log(err));

    // get all sellers
    axios
      .get('https://fisher.foxytech.xyz/api/get-all-seller', {
        headers: { Authorization: `Bearer ${this.getToken}` },
      })
      .then((res) => {
        console.log(res);
        let result = [];
        for (let i = 0; i < res.data.data.length; i++) {
          result.push({
            id: res.data.data[i].id,
            darsh_key: res.data.data[i].darsh_key,
            name: res.data.data[i].name,
            phone: res.data.data[i].phone,
            balance: res.data.data[i].balance
          });
          this.sellers = result;
        }
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
  background-color: var(--color-cyan);
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
