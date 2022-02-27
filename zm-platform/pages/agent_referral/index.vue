<template>
    <div>
        <zmTable :titleList="titleList"></zmTable>
    </div>
</template>

<script>
import zmTable from './zm-table.vue';
export default {
    data() {
        return {
            titleList:['兼职','全职']
        }
    },
    components:{
        zmTable
    }
}
</script>
