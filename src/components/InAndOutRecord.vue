<template>
  <div class="main-wrapper rounded-bottom mb-2">
    <div class="mx-auto" style="width: fit-content">
      <div class="h80">
        <h3>
          كشف {{ viewType == 'Receive' ? 'استلام من تاجر' : 'تسليم لصياد' }}
        </h3>
      </div>
    </div>
    <div class="table-wrapper-scroll-y my-custom-scrollbar">
      <table class="table table-hover table-bordered text-center">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">العدد</th>
            <th scope="col">رقم {{ user_type }}</th>
            <th scope="col">اسم {{ user_type }}</th>
            <th scope="col">ملاحظات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td scope="row">
              <input
                v-model="item.isChecked"
                type="checkbox"
                class="form-control m-2"
              />
            </td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.userNumber }}</td>
            <td>{{ item.user }}</td>
            <td>{{ item.notes }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div
      class="row py-2 justify-content-center text-center text-md-right no-gutters border-bottom"
    >
      <div class="col-md-6 col-lg-2">
        <div class="mr-2">
          <button
            @click="deleteSelectedItems"
            class="btn btn-light mb-3 mb-md-0"
          >
            حذف المحدد
          </button>
        </div>
      </div>
      <div class="col-md-6 col-lg-3">
        العدد الإجمالي للبكس غير المعتمدة:
        <span>{{ numOfBoxes }}</span>
      </div>
      <div class="col-md-6 col-lg-1 text-left">
        <div class="ml-2">
          <button @click="confirmAction" class="btn btn-light">اعتماد</button>
        </div>
      </div>
    </div>
    <div class="mx-4 px-4">
      <div
        class="row py-2 text-center text-md-right no-gutters justify-content-between"
      >
        <div class="col-md-6 col-lg-2">
          <div class="form-group">
            <label for="quantity">العدد: </label>
            <input
              v-model="formData.quantity"
              class="w-50 mr-4 form-control d-inline-block"
              type="text"
              id="quantity"
            />
          </div>
        </div>
        <div class="col-md-6 col-lg-4">
          <div class="form-group row">
            <label for="quantity" class="col-3 ml-2">{{ user_type }}</label>
            <ejs-autocomplete
              v-if="viewType == 'Receive'"
              width="150"
              id="searchFishermen"
              v-model="formData.user"
              :dataSource="sellers"
              :fields="dataFields"
              autofill="true"
              placeholder="ابحث عن التاجر"
              :highlight="true"
            >
            </ejs-autocomplete>
            <ejs-autocomplete
              v-else
              width="150"
              id="searchSellers"
              v-model="formData.user"
              :dataSource="fishermen"
              :fields="dataFields"
              autofill="true"
              placeholder="ابحث عن الصياد"
              :highlight="true"
            >
            </ejs-autocomplete>
          </div>
        </div>
        <div class="col-md-6 col-lg-3">
          <input
            v-model="formData.notes"
            type="text"
            class="w-75 form-control mx-auto mx-md-0"
            placeholder="ملاحظة"
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
        user: '',
        notes: '',
      },
      viewType: this.$route.params.type,
      dataFields: { value: 'name' },
      items: [],
    };
  },
  methods: {
    ...mapActions(['setHasIntries']),
    deleteSelectedItems() {
      let result = [];
      for (let i = 0; i < this.items.length; i++) {
        if (!this.items[i].isChecked) {
          result.push(this.items[i]);
        }
      }
      this.items = result;
    },
    confirmAction() {
      if (this.items.length == 0) {
        alert('لا يوجد قيود لاعتمادها!');
        return;
      }
      if (
        confirm(`
                    عدد البكس المضافة = ${this.numOfBoxes}، عدد القيود = ${this.items.length}
                    هل تريد اعتماد البيانات المدخلة؟
                    `)
      ) {
        console.log('confirmed..');

        let giver_id;
        let taker_id;

        if (this.viewType == 'Receive') {
          // seller
          taker_id = 0;
          for (let i = 0; i < this.items.length; i++) {
            for (let j = 0; j < this.sellers.length; j++) {
              if (this.sellers[j].name.includes(this.items[i].user)) {
                giver_id = this.sellers[j].id;
                break;
              }
            }

            let entry = {
              entry_type_id: 3,
              giver_id,
              taker_id,
              quantity: this.items[i].quantity,
              unit_price: 0,
              comment: this.items[i].notes,
            };
            console.log(entry);
            let entry_id;

            // send entry
            axios
              .post('https://127.0.0.1:8000/api/add-entry', entry, {
                headers: { Authorization: `Bearer ${this.getToken}` },
              })
              .then((res) => {
                entry_id = res.data.entry_id;
                console.log(res);

                // send storage positive entry

                let storage_entry = {
                  entry_id,
                  entry_type: 12,
                  quantity_diff: entry.quantity,
                  comment: entry.comment,
                };

                axios
                  .post(
                    'https://127.0.0.1:8000/api/add-storage_entry',
                    storage_entry,
                    {
                      headers: { Authorization: `Bearer ${this.getToken}` },
                    }
                  )
                  .then((res) => console.log(res))
                  .catch((err) => console.log(err));

                // handle 'ارجاع زيادة'
                let item;
                if (this.overFlow) {
                  item = this.overFlow.get(this.items[i].id);
                }
                if (item) {
                  storage_entry = {
                    entry_id,
                    entry_type: 9,
                    quantity_diff: item,
                    comment: 'ارجاع التاجر بكس زيادة عن ما أخذ',
                  };
                  console.log(entry);
                  axios
                    .post(
                      'https://127.0.0.1:8000/api/add-storage_entry',
                      storage_entry,
                      {
                        headers: { Authorization: `Bearer ${this.getToken}` },
                      }
                    )
                    .then((res) => console.log(res))
                    .catch((err) => console.log(err));
                }
              })
              .catch((err) => console.log(err));
          }
        } else {
          // fisherman
          giver_id = 0;
          for (let i = 0; i < this.items.length; i++) {
            for (let j = 0; j < this.fishermen.length; j++) {
              if (this.fishermen[j].name.includes(this.items[i].user)) {
                taker_id = this.fishermen[j].id;
                break;
              }
            }

            let entry = {
              entry_type_id: 1,
              giver_id,
              taker_id,
              quantity: this.items[i].quantity,
              unit_price: 0,
              comment: this.items[i].notes,
            };
            console.log(entry);
            let entry_id;

            // send entry
            axios
              .post('https://127.0.0.1:8000/api/add-entry', entry, {
                headers: { Authorization: `Bearer ${this.getToken}` },
              })
              .then((res) => {
                entry_id = res.data.entry_id;
                console.log(res);

                // send storage negative entry

                let storage_entry = {
                  entry_id,
                  entry_type: 13,
                  quantity_diff: -1 * entry.quantity,
                  comment: entry.comment,
                };

                axios
                  .post(
                    'https://127.0.0.1:8000/api/add-storage_entry',
                    storage_entry,
                    {
                      headers: { Authorization: `Bearer ${this.getToken}` },
                    }
                  )
                  .then((res) => console.log(res))
                  .catch((err) => console.log(err));
              })
              .catch((err) => console.log(err));
          }
        }

        this.formData.user = '';
        this.items = [];
      } else {
        console.log('canceled...');
      }
    },
    addEntry() {
      if (!this.formData.user) {
        alert(`اختر ${this.user_type} أولا`);
        return;
      }
      let length = this.items.length;
      let userNumber;
      if (this.viewType == 'Receive') {
        for (let i = 0; i < this.sellers.length; i++) {
          if (this.sellers[i].name == this.formData.user) {
            userNumber = this.sellers[i].id;
          }
        }
        let overflowValue =
          this.userBalance > 0
            ? this.formData.quantity - this.userBalance
            : this.formData.quantity;
        this.items.push({
          id: length + 1,
          quantity: this.formData.quantity,
          userNumber,
          user: this.formData.user,
          notes:
            overflowValue < 0
              ? this.formData.notes
              : `ارجاع زيادة ${overflowValue}`,
          isChecked: false,
        });
        if (this.formData.quantity > this.userBalance) {
          this.overFlow.set(length + 1, overflowValue);
        }
      } else {
        for (let i = 0; i < this.fishermen.length; i++) {
          if (this.fishermen[i].name == this.formData.user) {
            userNumber = this.fishermen[i].id;
          }
        }
        this.items.push({
          id: length + 1,
          quantity: this.formData.quantity,
          userNumber,
          user: this.formData.user,
          notes: this.formData.notes,
          isChecked: false,
        });
      }
      this.formData.quantity = '';
      this.formData.price = '';
      this.formData.seller = '';
      this.formData.fisherman = '';
      this.formData.notes = '';
    },
  },
  computed: {
    ...mapGetters(['getToken']),
    user_type() {
      return this.viewType == 'Receive' ? 'التاجر' : 'الصياد';
    },
    numOfBoxes() {
      return this.items.reduce(function (current, previous) {
        return current + parseInt(previous.quantity);
      }, 0);
    },
    userBalance() {
      for (let i = 0; i < this.sellers.length; i++) {
        if (this.sellers[i].name == this.formData.user) {
          console.log(this.sellers[i].balance);
          return this.sellers[i].balance;
        }
      }
      return 0;
    },
  },
  created() {
    this.overFlow = new Map();

    if (this.$route.params.type == 'Receive') {
      // get all sellers
      axios
        .get('https://127.0.0.1:8000/api/get-all-seller', {
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
              balance: res.data.data[i].balance,
            });
            this.sellers = result;
          }
        })
        .catch((err) => console.log(err));
    } else {
      // get all fishermen
      axios
        .get('https://127.0.0.1:8000/api/get-all-fisherman', {
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
              balance: res.data.data[i].balance,
            });
          }
          this.fishermen = result;
        })
        .catch((err) => console.log(err));
    }

    this.setHasIntries(false);
  },
  watch: {
    items() {
      if (this.items.length > 0) {
        this.setHasIntries(true);
      } else {
        this.setHasIntries(false);
      }
    },
  },
};
</script>

<style scoped>
.main-wrapper {
  width: 100%;
  max-height: 90vh;
  background-color: var(--color-grey);
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

@media screen and (max-width: 991px) {
  .main-wrapper {
    max-height: 150vh;
  }
}
</style>
