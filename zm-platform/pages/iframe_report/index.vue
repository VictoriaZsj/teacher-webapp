<template>
  <div class="report-iframe">
    <iframe id="report-iframe" v-if="!error" :src="reportUrl"></iframe>
    <div v-if="error">加载失败 请稍后再试</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      error: false
    };
  },
  computed: {
    reportUrl() {
      try {
        let report_url =
          process.env.NODE_ENV === 'development'
            ? 'http://p-test.zmlearn.com'
            : '';
        let url = this.$route.meta.path + '?t=' + +new Date();
        return report_url + url;
      } catch (err) {
        this.error = true;
      }
    }
  },
  watch: {
    reportUrl(val) {
      console.log(val);
      this.$nextTick(() => {
        console.log('reload');
        document.getElementById('report-iframe').contentWindow.location.reload(true);
      });
    }
  }
};
</script>
<style lang="less">
.report-iframe {
  iframe {
    min-width: 100vw;
    min-height: 100vh;
    border: none;
  }
}
</style>
