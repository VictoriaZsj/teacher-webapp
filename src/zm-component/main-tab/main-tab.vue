<template>
    <div class="main-tab">
        <div v-for="(item,index) in titleList" :key="index" @click="tabClick(item,index)"
            :class="{
                'main-tab-nav':true,
                'is-active':active == index
            }">
            {{ item }}
        </div>
        <slot></slot>
    </div>
</template>
<script>
    import Emitter from '../../mixins/emitter';
    export default {
        name: 'MainTab',
        componentName: 'MainTab',
        mixins:[Emitter],
        props: {
            titleList:{
                type:Array,
                default:[{
                    item:'',
                    index:0
                }]
            },
            // titlePlusList:{
            //     type:Array,
            //     default:[]
            // },
            onTabClick: {
                type:Function,
                default:function(){}
            },
            // onTabPlusClick: {
            //     type:Function,
            //     default:function(){}
            // },
            activeIndex: {
                type:Number,
            }
        },
        data(){
            return {};
        },
        computed:{
            active:function(){
                return this.activeIndex;
            }
        },
        methods: {
            tabClick (item,index){
                if (this.active == index) return;
                this.$emit('onTabClick',{item,index});
            }
        },
        mounted() {
        }
    };
</script>
