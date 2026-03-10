
export const hrOptions = {
    grid: {
        left: "0%",
        top: "10%",
        right: "0%",
        bottom: "0%",
    },
    xAxis: {
        type: "time",
        data: [],
        // splitNumber: 12,
        interval: 1,
        min: function (value: any) {
            return value.min;
        },
        max: function (value: any) {
            return value.max;
        },
        axisLabel: {
            color: "#9296AF",
            formatter: "{HH}:{mm}",
            // interval:5
            hideOverlap: true,
            showMaxLabel: true
        },
        axisLine: {
            lineStyle: {
                color: "#EEEEEE",
            },
        },
        axisTick: {
            show: true,
            alignWithLabel: true,
            lineStyle: {
                color: "#9296AF",
            },
        },
    },
    yAxis: {
        type: "value",
        axisLabel: {
            color: "#9296AF",
        },
        splitLine: {
            lineStyle: {
                color: "#EEEEEE",
            },
        },
        min: 0,
        max: 180,
        interval: 30,
    },
    backGroundColor: "#000000",
    series: [
        {
            data: <any>[],
            type: "line",
            connectNulls: false,
            lineStyle: {
                color: "#9296AF",
                width: "2",
            },
            symbol: "none",
        },
        {
            data: <any>[],
            type: "line",
            connectNulls: false,
            lineStyle: {
                color: "#07C160",
                width: "2",
            },
            symbol: "none",
        },
    ],
};