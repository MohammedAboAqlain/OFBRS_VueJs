<template>
    <div class="w-75 mx-auto my-5 text-right px-4 text-white bg-secondary rounded">
        <h2 class="text-center py-4 border-bottom">تسجيل اشتراك</h2>
        <form class="needs-validation" novalidate>
            <div class="form-row">
                <div class="col-md-6 mb-3">
                    <label for="validationTooltip01">الاسم </label>
                    <input type="text" v-model="formdata.name" class="form-control" id="validationTooltip01" value="" placeholder="أدخل الاسم " required>
                    <div class="valid-tooltip">
                        Looks good!
                    </div>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="validationTooltip03">رقم الجوال</label>
                    <input type="number" v-model="formdata.phone" class="form-control" id="validationTooltip03" placeholder="أدخل رقم الجوال" required>
                    <div class="invalid-tooltip">
                        Please provide a valid phone number.
                    </div>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="validationTooltip04">هل أنت صياد أم تاجر؟</label>
                    <select class="custom-select" v-model="formdata.type" id="validationTooltip04" required>
                        <option selected disabled value="null">اختر...</option>
                        <option v-for="item in userTypes" :key="item.id" :value="item.id">{{item.name}}</option>
                    </select>
                    <div class="invalid-tooltip">
                        Please select a valid state.
                    </div>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="password">كلمة المرور </label>
                    <input type="password" v-model="formdata.password" class="form-control" id="password" placeholder="أدخل الاسم " required>
                    <div class="valid-tooltip">
                        Looks good!
                    </div>
                </div>
                <div v-if="formdata.type == 1" class="col-md-6 mb-3">
                    <label for="validationTooltip04">اختر السوق</label>
                    <select class="custom-select" v-model="formdata.market" id="validationTooltip04" required>
                        <option selected disabled value="null">اختر...</option>
                        <option v-for="item in markets" :key="item.id" :value="item.id">{{item.name}}</option>
                    </select>
                    <div class="invalid-tooltip">
                        Please select a valid state.
                    </div>
                </div>
            </div>
            <div class="text-center py-4">
                <button @click.prevent="signUp" class="btn btn-primary mx-auto px-4 font-weight-bold" type="submit">تسجيل</button>
            </div>
        </form>
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        data(){
            return {
                formdata: {
                    name : '',
                    phone: '',
                    type: null,
                    password: '',
                    market: null
                },
                userTypes: [],
                markets: []
            }
        },
        methods: {
            signUp(){
                const user = {
                    name : this.formdata.name,
                    phone: this.formdata.phone,
                    type_id: this.formdata.type,
                    password: this.formdata.password,
                    market_id: this.formdata.market
                }
                axios.post('http://127.0.0.1:8000/api/signup', user)
                    .then(res => {
                        console.log(res);
                        this.$router.push('/');
                    })
                    .catch(err => console.log(err));
            }
        },
        created(){
            axios.get('http://127.0.0.1:8000/api/index-user-type')
            .then(res => {
                console.log(res);
                for (let i = 1; i < res.data.item.length; i++) {
                    this.userTypes.push({id: res.data.item[i].id, name: res.data.item[i].name});
                }
                console.log(this.userTypes);
            });
            axios.get('http://127.0.0.1:8000/api/index-market')
            .then(res => {
                for (let i = 0; i < res.data.item.length; i++) {
                    this.markets.push({ id: res.data.item[i].id, name: res.data.item[i].name});
                }
                console.log(res.data.item);
            })
            .catch(err => console.log(err));
        }
    }
</script>

