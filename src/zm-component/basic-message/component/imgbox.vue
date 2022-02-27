<template>
    <div class="imgbox" :class="(computedImgSrc === 'static/noImg.svg')?'':'imgbox-hover'">
        <img :src='computedImgSrc' class="img" @click="showImg()">
        <el-input v-model="computedImgSrc" v-show="false"></el-input>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                toggleImg:false,
                defaultImg:'../assets/image/noImg.svg'
            }
        },
        props:{
            imgsrc:{
                default:'',
                type:String
            }
        },
        computed:{
            computedImgSrc:function() {
                if (!this.imgsrc) {
                    return this.defaultImg;
                } else {
                    return this.imgsrc;
                }
            }
        },
        methods:{
            showImg() {
                if (this.computedImgSrc === 'static/noImg.svg') return;
                this.$root.$children[0].showBigImg(this.computedImgSrc);
            }
        }
    }
</script>
<style lang="less" scoped>
    .imgbox{
        width:64px;
        max-height:114px;
        overflow:hidden;
        cursor:pointer;
        border-radius:5px;
        &-hover{
            box-shadow:0 2px 2px 0 rgba(0,0,0,0.16), 0 0 0 1px rgba(0,0,0,0.08);
            transition:all 0.2s;
            &:hover{
                box-shadow:0 3px 8px 0 rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.08);
            }
        }
        .img{
            display:block;
            width:100%;
        }
        .img-dialog{
            text-align:center;
            .inner-img{
                width:375px;
            }
        }
    }
</style>
