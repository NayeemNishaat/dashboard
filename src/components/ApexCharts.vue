<template>
  <div ref="el"></div>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  onBeforeUnmount,
  watch,
  h,
  onBeforeMount,
  nextTick
} from "vue";
import ApexCharts from "apexcharts";

export default defineComponent({
  props: {
    options: {
      type: Object
    },
    type: {
      type: String
    },
    series: {
      type: Array,
      required: true,
      default: () => []
    },
    width: {
      default: "100%"
    },
    height: {
      default: "auto"
    }
  },
  setup(props, ctx) {
    const el = ref(null);
    const chart = ref<ApexCharts | null>(null);

    const isObject = (item: any) => {
      return (
        item && typeof item === "object" && !Array.isArray(item) && item != null
      );
    };

    const extend = (target: any, source: any) => {
      if (typeof Object.assign !== "function") {
        (function() {
          Object.assign = function(target: any) {
            // We must check against these specific cases.
            if (target === undefined || target === null) {
              throw new TypeError("Cannot convert undefined or null to object");
            }

            let output = Object(target);
            for (let index = 1; index < arguments.length; index++) {
              let source = arguments[index];
              if (source !== undefined && source !== null) {
                for (let nextKey in source) {
                  if (Object.prototype.hasOwnProperty.call(source, nextKey)) {
                    output[nextKey] = source[nextKey];
                  }
                }
              }
            }
            return output;
          };
        })();
      }

      let output = Object.assign({}, target);
      if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
          if (isObject(source[key])) {
            if (!(key in target)) {
              Object.assign(output, {
                [key]: source[key]
              });
            } else {
              output[key] = extend(target[key], source[key]);
            }
          } else {
            Object.assign(output, {
              [key]: source[key]
            });
          }
        });
      }
      return output;
    };

    const init = async () => {
      await nextTick();

      const newOptions = {
        chart: {
          type: props.type || (props?.options?.chart?.type ?? "line"),
          height: props.height || "350px",
          width: props.width || "100%",
          events: {}
        },
        series: props.series
      };

      // Object.keys(ctx.listeners).forEach((evt) => {
      //     newOptions.chart.value.events[evt] = ctx.listeners[evt];
      // });

      const config = extend(props.options, newOptions);
      chart.value = new ApexCharts(el.value, config);
      return chart.value.render();
    };

    const refresh = () => {
      destroy();
      return init();
    };

    const destroy = () => {
      if (chart.value) {
        chart.value.destroy();
      }
    };

    const updateSeries = (newSeries: any, animate: boolean) => {
      if (chart.value) {
        return chart.value.updateSeries(newSeries, animate);
      }
    };

    const updateOptions = (
      newOptions: any,
      redrawPaths: boolean,
      animate: boolean,
      updateSyncedCharts: boolean
    ) => {
      if (chart.value) {
        return chart.value.updateOptions(
          newOptions,
          redrawPaths,
          animate,
          updateSyncedCharts
        );
      }
    };

    const toggleSeries = (seriesName: string) => {
      if (chart.value) {
        return chart.value.toggleSeries(seriesName);
      }
    };

    const showSeries = (seriesName: string) => {
      if (chart.value) {
        chart.value.showSeries(seriesName);
      }
    };

    const hideSeries = (seriesName: string) => {
      if (chart.value) {
        chart.value.hideSeries(seriesName);
      }
    };

    const appendSeries = (newSeries: any, animate: boolean) => {
      if (chart.value) {
        return chart.value.appendSeries(newSeries, animate);
      }
    };

    const resetSeries = () => {
      if (chart.value) {
        chart.value.resetSeries();
      }
    };

    const toggleDataPointSelection = (
      seriesIndex: number,
      dataPointIndex: number
    ) => {
      if (chart.value) {
        chart.value.toggleDataPointSelection(seriesIndex, dataPointIndex);
      }
    };

    const appendData = (newData: any) => {
      if (chart.value) {
        return chart.value.appendData(newData);
      }
    };

    // const addText = (options: any) => {
    //   if (chart.value) {
    //     chart.value.addText(options);
    //   }
    // };

    const dataURI = () => {
      if (chart.value) {
        return chart.value.dataURI();
      }
    };

    const setLocale = (localeName: string) => {
      if (chart.value) {
        return chart.value.setLocale(localeName);
      }
    };

    const addXaxisAnnotation = (options: any, pushToMemory: boolean) => {
      if (chart.value) {
        chart.value.addXaxisAnnotation(options, pushToMemory);
      }
    };

    const addYaxisAnnotation = (options: any, pushToMemory: boolean) => {
      if (chart.value) {
        chart.value.addYaxisAnnotation(options, pushToMemory);
      }
    };

    const addPointAnnotation = (options: any, pushToMemory: boolean) => {
      if (chart.value) {
        chart.value.addPointAnnotation(options, pushToMemory);
      }
    };

    const removeAnnotation = (id: string, options: any) => {
      if (chart.value) {
        chart.value.removeAnnotation(id, options);
      }
    };

    const clearAnnotations = () => {
      if (chart.value) {
        chart.value.clearAnnotations();
      }
    };

    onBeforeMount(() => {
      (window as any).ApexCharts = ApexCharts;
    });

    onMounted(() => {
      init();
    });

    onBeforeUnmount(() => {
      if (!chart.value) {
        return;
      }
      destroy();
    });

    watch(
      () => props.options,
      () => {
        if (!chart.value && props.options) {
          init();
        } else {
          if (chart.value) {
            chart.value.updateOptions(props.options);
          }
        }
      }
    );

    watch(
      () => props.series,
      () => {
        if (!chart.value && props.series) {
          init();
        } else {
          if (chart.value) {
            chart.value.updateSeries(props.series as any);
          }
        }
      }
    );

    watch(
      () => props.type,
      () => {
        refresh();
      }
    );

    watch(
      () => props.width,
      () => {
        refresh();
      }
    );

    watch(
      () => props.height,
      () => {
        refresh();
      }
    );

    return { el };
  }
});
</script>
