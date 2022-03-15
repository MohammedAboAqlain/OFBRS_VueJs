<template>
  <div class="main-wrapper rounded-bottom">
    <div class="mx-auto" style="width: fit-content">
      <div class="h80">
        <div class="middle">
          <div class="row justify-content-center align-items-center">
            <!-- <button class="btn btn-light">تعديل التفاصيل</button> -->
            <h6 class="ml-5">
              الرصيد:
              <span class="ml-2">{{ remaining_balance }}</span>
              <span>بكسة</span>
            </h6>
            <h1 class="mx-5">جميع القيود</h1>
            <button class="btn btn-light mr-5">إضافة بكس من المخزن</button>
          </div>
        </div>
      </div>
    </div>

    <hr color="white" class="my-0" />

    <div class="row py-2 text-center text-md-right align-items-center">
      <div class="col-md-6 font-weight-bold">
        &nbsp;&nbsp;تاريخ الإنشاء:
        <div class="row">
          <div class="col-6">
            <input
              v-model="From_date_created"
              @change="get_all_entries"
              type="date"
              class="form-control mr-2 w-75"
            />
          </div>
          <div class="col-6">
            <input
              v-model="To_date_created"
              @change="get_all_entries"
              type="date"
              class="form-control ml-2 w-75"
            />
          </div>
        </div>
        &nbsp;&nbsp;تاريخ التعديل:
        <div class="row">
          <div class="col-6">
            <input
              v-model="From_date_updated"
              @change="get_all_entries"
              type="date"
              class="form-control mr-2 w-75"
            />
          </div>
          <div class="col-6">
            <input
              v-model="To_date_updated"
              @change="get_all_entries"
              type="date"
              class="form-control ml-2 w-75"
            />
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="row justify-content-around mt-3">
          <div class="col-6">
            <select
              name="entry_types"
              id="entry_types_select"
              class="form-control w-75"
              v-model="selected_type"
            >
              <option selected value="null">فلتر حسب نوع القيد</option>
              <option
                v-for="type of entry_types"
                :key="type"
                :value="type"
              >
                {{ type }}
              </option>
            </select>
          </div>
          <div class="col-6">
            <select
              name="entry_types"
              id="entry_types_select"
              class="form-control w-75"
            >
              <option selected value="null">فلتر حسب الحالة</option>
              <option v-for="state in entry_states" :key="state" :value="state">
                {{ state }}
              </option>
            </select>
          </div>
        </div>
        <div class="mr-2"></div>
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
        <tr v-for="item in items" :key="item.number">
          <td scope="row">
            <input
              v-model="item.isChecked"
              type="checkbox"
              class="form-control"
            />
          </td>
          <td>{{ item.giver_id }}</td>
          <td>{{ item.taker_id }}</td>
          <td>{{ entry_types[item.type] }}</td>
          <td>{{ item.quantity }}</td>
          <td>{{ item.unit_price }}</td>
          <td>{{ item.date_created }}</td>
          <td>{{ item.date_updated }}</td>
          <td>{{ item.comment }}</td>
        </tr>
      </tbody>
    </table>

    <div style="height: 15px"></div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
        selected_type: null,
      remaining_balance: 0,
      entry_types: {
          1: 'تسليم',
          2: 'بيع',
          3: 'ارجاع',
          4: 'غير معروف المصير',
          5: 'قيد تصحيحي',
          6: 'توبة تاجر',
          7: 'قيد مراجعة',
          8: 'استيلاء الاحتلال',
          9: 'ارجاع زيادة',
          10: 'بيع زيادة',
          11: 'مكسر',
          12: 'إضافة بٌكس إلى المخزن',
          13: 'أخذ بُكس من المخزن',
          14: 'تصفير'
      },
      entry_states: ['حالة 1', 'حالة 2', 'حالة 3', 'حالة 4'],
      From_date_created: this.getDateNow(),
      To_date_created: this.getDateNow(),
      From_date_updated: this.getDateNow(),
      To_date_updated: this.getDateNow(),
      items: []
    };
  },
  methods: {
    deleteSelectedItems() {
      let result = [];
      for (let i = 0; i < this.items.length; i++) {
        if (!this.items[i].isChecked) {
          result.push(this.items[i]);
        }
      }
      this.items = result;
    },
    getDateNow() {
      var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      return [year, month, day].join('-');
    },
    get_all_entries() {
      if (
        !this.From_date_created ||
        !this.To_date_created ||
        !this.From_date_updated ||
        !this.To_date_updated
      ) {
        return;
      }
      axios
        .get('http://127.0.0.1:8000/api/get-entries/', {
          params: {
            From_date_created: this.From_date_created,
            To_date_created: this.To_date_created,
            From_date_updated: this.From_date_updated,
            To_date_updated: this.To_date_updated,
          },
          headers: { Authorization: `Token ${this.getToken}` },
        })
        .then((res) => {
          console.log(res);
          this.items = res.data.data;
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
  },
  computed: mapGetters(['getToken']),
  created() {
    this.get_all_entries();
    this.get_storage_balance();
  },
};
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
