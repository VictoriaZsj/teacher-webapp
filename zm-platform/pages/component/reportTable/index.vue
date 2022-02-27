<template>
  <div class="wrapper">
    <div class="report-table1">
      <table
        cellspacing="0">
        <thead>
          <tr>
            <th rowspan="2"><cell></cell></th>
            <th v-for="(item, index) in mergeHeader" :colspan="item.subjectTexts.length" :key="index">{{item.subjectsClassifyText}}</th>
          </tr>
          <tr>
              <th v-for="(item, index) in headers" :key="index">{{item.columnCnName}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in rows" :key="index">
            <td v-for="(item, index) in row" :key="index"> {{item}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="report-table2">
      <table
        cellspacing="0">
        <thead>
          <tr>
            <th rowspan="2"><cell></cell></th>
            <th v-for="(item, index) in mergeHeader" :colspan="item.subjectTexts.length" :key="index">{{item.subjectsClassifyText}}</th>
            <th rowspan="2">总计</th>
          </tr>
          <tr>
              <template v-for="(item, index) in headers">
                  <th v-if="index != headers.length - 1" :key="index">{{item.columnCnName}}</th>
              </template>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in rows" :key="index">
            <td v-for="(item, index) in row" :key="index"> {{item}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
  </div>
</template>

<script>
  import cell from '../reportTable/cell'
  export default {
    components: {
      cell
    },
    props: {
        headers: {
            type: Array,
            default: function() {
                return [];
            }
        },
        mergeHeader: {
            type: Array,
            default: function() {
                return [];
            }
        },
        rows: {
            type: Array,
            default: function() {
                return [];
            }
        }
    },
    data() {
      return {
        thData: [],
        tdData: [],
        search: ''
      }
    }
  }
</script>

<style scoped lang="less">
  .wrapper{
    background-color: #fff;
    margin: 20px 0;
    padding:0 10px;
    box-sizing: border-box;
    position: relative;
    .report-table1,
    .report-table2{
      width: 100%;
      overflow-x: scroll;
      thead{
        tr{
          width: 100%;
          th{
            min-width: 120px;
            height: 50px;
            border: 1px solid #e5e5e5;
            border-left: 0;
            box-sizing: border-box;
          }
          th:first-child{
            min-width: 120px;
          }
        }
      }
      tbody{
        tr{
          width: 100%;
          overflow: auto;
          td{
            min-width: 120px;
            border: 1px solid #e5e5e5;
            border-top: 0;
            box-sizing: border-box;
            text-align: center;
            padding: 10px 0;
          }
          td:not(:first-child){
            border-left: 0;
          }
          td:first-child{
            min-width: 120px;
          }
        }
      }
    }
    .report-table1{
      position: absolute;
      left: 10px;
      top: 0;
      overflow: hidden;
      z-index: 3;
      thead{
        tr{
          th:not(:first-child){
            visibility: hidden;
          }
          th:first-child{
            background-color: #fff;
          }
          &:nth-child(2) {
              th:first-child {
                  visibility: hidden;
              }
          }
        }
      }
      tbody{
        tr{
          td:not(:first-child){
            visibility: hidden;
          }
          td:first-child{
            background-color: #fff;
          }
        }
      }
    }
  }
</style>