import Plot from "react-plotly.js";

interface Props {
  title: string;
  data: any[];
  xlabels: string,
  ylabels: string
}

export default function ScatterPlot({ title, data, xlabels, ylabels }: Props) {
  console.log(data)
  return (
    <Plot
      data={data}
      layout={{
        title: title,
        autosize: true,
        height: 800,
        font: {
          size: 15,
        },
        xaxis: {
          showgrid: false,
          showline: true,
          title: xlabels
        },
        yaxis: {
          showgrid: false,
          showline: true,
          title: ylabels
        }
      }}
      config={{
        responsive: true,
        displayModeBar: true,
        autosizable: true,
        displaylogo: false
      }}
      useResizeHandler
      className="w-full h-full"
    />
  );
}
