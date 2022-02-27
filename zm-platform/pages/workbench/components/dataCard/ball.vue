<template>
	<canvas ref="canvas" width="116" height="116"></canvas>
</template>
<script>
export default {
  name: 'CanvasBall',
  props: ['num'],
  watch: {
    num() {
      this.renderBall(this.num);
    },
  },
  mounted() {
    this.renderBall(this.num);
  },
  methods: {
    renderBall(per = 0) {
      let canvas = this.$refs['canvas'];
      let ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, 116, 116);
      if (per === 0) {
        return;
      }
      let t = 116 * (1 - per);
      let perw = 116 / 3;

      ctx.beginPath();
      ctx.moveTo(0, t);
      if (per < 1) {
        ctx.bezierCurveTo(perw + 10, t - 20, 2 * perw - 10, t + 20, 116, t + 5);
      } else {
        ctx.lineTo(116, 0);
      }

      ctx.lineTo(116, 116);
      ctx.lineTo(0, 116);
      ctx.lineTo(0, t);
      ctx.fillStyle = '#CAE6FF';
      ctx.fill();
      ctx.save();
    },
  },
};
</script>
