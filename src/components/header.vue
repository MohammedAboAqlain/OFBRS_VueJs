<template>
    <nav class="navbar navbar-light bg-secondary rounded shadow">
        <form v-if="!isAuthinticated" class="form-inline mx-auto mx-md-0">
            <button @click="$router.push('/');" class="btn btn-primary mb-3 mb-sm-0 mx-auto mr-sm-1 px-3 py-1 font-weight-bold">تسجيل الدخول</button>
            <span style="width:10px"></span>
            <button @click="$router.push('/SignUp');" class="btn btn-primary mb-3 mb-sm-0 mx-auto mr-sm-1 px-3 py-1 font-weight-bold">تسجيل الاشتراك</button>
        </form>
        <form v-else class="form-inline mx-auto mx-md-0">
            <button @click="logout" class="btn btn-primary mb-3 mb-sm-0 mx-auto mr-sm-1 px-3 py-1 font-weight-bold">تسجيل خروج</button>
        </form>
        <div class="navbar-brand mx-auto mx-md-0">
            <router-link :to="isAdmin? '/dashboard' : '/'" class="mr-2 px-3 py-1 font-weight-bold text-decoration-none text-white">الصفحة الرئيسية</router-link>
        </div>
    </nav>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    export default {
        computed: mapGetters(['isAuthinticated', 'isAdmin']),
        methods: {
            ...mapActions(['setToken', 'setAdmin']),
            logout(){
                this.setToken(null);
                this.setAdmin(false);
                this.$router.push('/');
            }
        }
    }
</script>