<style scoped>
    .context{
        font-size: 32px;
        text-align:center;
        line-height: 80vh;
    }
</style>

<template>
    <div class="context">
        <template>
            招师管理系统1.1
        </template>
        <!-- <template v-if="isOldUrl">
            招师管理系统1.1
        </template> -->
        <!-- <template v-else>
            招师系统已迁移至新地址，请访问 
            <a href="//portal.zmlearn.com/teacher" target="_self">招师管理系统1.0</a>
        </template> -->
    </div>
</template>
<script>
export default {
    data () {
        return {
            // isOldUrl: location.href.indexOf('portal') > -1 || location.href.indexOf('b.zmlearn.com') > -1
        };
    }
}
</script>
