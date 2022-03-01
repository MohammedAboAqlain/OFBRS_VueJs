<template>
    <div class="w-50 mx-auto" style="margin-top:7rem;">
        <div class="text-right px-4 text-white bg-secondary rounded">
            <h2 class="text-center py-4 border-bottom">تسجيل دخول</h2>
            <form class="needs-validation" novalidate>
                <div class="form-row">
                    <div class="col-12 mb-3">
                        <label for="validationTooltip01">رقم الجوال</label>
                        <input type="text" v-model="phone" class="form-control" id="validationTooltip01" value="" placeholder="أدخل الاسم " required>
                        <div class="valid-tooltip">
                            Looks good!
                        </div>
                    </div>
                    <div class="col-12 mb-3">
                        <label for="validationTooltip02">كلمة المرور</label>
                        <input type="password" v-model="password" class="form-control" id="validationTooltip02" value="" placeholder="أدخل البريد الالكتروني" required>
                        <div class="valid-tooltip">
                            Looks good!
                        </div>
                    </div>
                </div>
                <div class="text-center py-4">
                    <button @click.prevent="signIn" class="btn btn-primary mx-auto px-4 font-weight-bold" type="submit">دخول</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import { mapActions } from 'vuex'
    export default {
        data(){
            return {
                phone: '',
                password: ''
            }
        },
        methods: {
            signIn(){
                // sign in here
                axios.post('http://fisher.foxytech.xyz/api/login', {
                    phone: this.phone,
                    password: this.password
                })
                .then(res => {
                    console.log(res);
                    this.setToken(res.data.access_token);
                    res.data.user.balance = res.data.balance;
                    this.setUser(res.data.user);
                    if(res.data.user.type_id == '0'){
                        this.$router.push('/dashboard');
                        this.setAdmin(true);
                    }else{
                        this.$router.push('/userProfile');
                    }
                    this.login();
                })
                .catch(err => {
                    console.log(err);
                    alert('هنالك خطأ ما في رقم الجوال أو كلمة المرور');
                });
            },
            ...mapActions(['login', 'setAdmin', 'setToken', 'setUser', 'fetchMarkets'])
        },
        mounted(){
            this.fetchMarkets();
        }
    }
</script>
