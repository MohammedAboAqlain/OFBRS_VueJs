<template>
    <div class="container main-container">
        <app-header></app-header>
        <div class="row mx-0">
            <div class="col-12 px-0">
                <transition name="slide" mode="out-in">
                    <router-view class="shadow"></router-view>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
    import Header from './components/header.vue'
    export default {
        data(){
            return {
                // selectedComponent: 'appHome'
            }
        },
        components: {
            appHeader: Header
        }
    }
</script>

<style>
    .main-container{
        height: 100vh;
    }

    .slide-enter-active {
        animation: slide-in 300ms ease-out forwards;
    }

    .slide-leave-active {
        animation: slide-out 300ms ease-out forwards;
    }

    @keyframes slide-in {
        from {
            transform: translateX(-30px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slide-out {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(-30px);
            opacity: 0;
        }
    }
</style>
