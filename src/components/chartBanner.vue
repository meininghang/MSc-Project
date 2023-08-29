<template>
  <div class="charts-banner__main">
    <div class="storage-roseType" style="width: 100%;height: 100%;z-index: 10">
      <div class="pie" ref="chart" style="width: 924px;height: 260px"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "chartShow",
  data () {
    return {
      usedNumber: undefined,
      totalNumber: undefined,
      ARNumber: undefined,
    }
  },
  methods: {
    inOrigin (usedNumber, totalNumber) {
      this.usedNumber = usedNumber
      this.totalNumber = this.formatTotalNumber(totalNumber)
      this.ARNumber = Math.round(((totalNumber / 1024) / 0.76) * 100) / 100
      let myChart = this.$echarts.init(this.$refs.chart);
      let option = {
        title: {
          text: 'Storage chart'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.001]
        },
        yAxis: {
          type: 'category',
          data: ['USED', 'TOTAL']
        },
        series: [
          {
            name: 'MB',
            type: 'bar',
            data: [this.usedNumber, totalNumber]
          }
        ]
      };
      myChart.setOption(option);
    },
    formatTotalNumber(number) {
      const formatN = Math.round(number / 1024 * 100) / 100
      if (formatN > 1) {
        return formatN
      } else {
        return number
      }
    }
  }
}
</script>

<style lang="scss">
.charts-banner__main {
  width: 100%;
  height: 300px;
  background: #f5f5f5;
  border-radius: 20px;
  .storage-roseType {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>