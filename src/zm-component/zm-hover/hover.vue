<template>
    <transition name="fade">
        <div @mouseenter="Menter" @mouseleave="Mleave" class="zm-hover" v-bind:style="{ left: leftPX, top: topPX, bottom: bottomPX }" v-show="visible">
            <i :class="vertureP" class="triangleRight"></i>
            <i :class="vertureP" class="triangleRightBlock"></i>
            <slot :data="contentData"></slot>
        </div>
    </transition>
</template>
<script>
    export default {
        name: 'Hover',
        data () {
            return {
                contentData:null,
                visible:false,
                over:false,
                left:0,
                top:0,
                bottom:0,
                vertureP:'vertureTop'
            };
        },
        computed:{
            topPX () {
                if(typeof this.top == 'number'){
                    return this.top + 'px';
                }
                return this.top;
            },
            bottomPX () {
                if(typeof this.bottom == 'number'){
                    return this.bottom + 'px';
                }
                return this.bottom;
            },
            leftPX () {
                if(typeof this.left == 'number'){
                    return this.left + 'px';
                }
                return this.left;
            }
        },
        methods:{
            Menter () {
                this.over = true;
            },
            Mleave () {
                this.over = false;
                this.visible = false;
            }
        }
    };
</script>
<style scoped="">
  .zm-hover{
    position: fixed;
    top:0;
    left:0;
    padding: 5px;
    min-height: 60px;
    z-index: 9999;
    border-radius: 5px;
    border:1px solid #1f2d3d;
    background-color: #ffffff;
  }
  .triangleRight{
    position: absolute;
    width: 0;
    height: 0;
    border-top: 5px solid transparent;
    border-right: 10px solid #1f2d3d;
    border-bottom: 5px solid transparent;
    left:-11px;
  }
  .triangleRightBlock{
    position: absolute;
    width: 0;
    height: 0;
    border-top: 5px solid transparent;
    border-right: 10px solid white;
    border-bottom: 5px solid transparent;
    left:-9px;
  }
  .vertureTop{
    top:12px;
  }
  .vertureBottom{
    bottom:12px;
  }
</style>
