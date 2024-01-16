import Plot from "react-plotly.js"
interface Props {
  data: any[];
  title: string;
}

export default function Sensibility({data, title}: Props) {
  return (
    <Plot
      data={data}
      layout={{
        autosize: true,
        height: 500,
        barmode: "group",
        title: title,
        font: {
          size: 15,
        },
      }}
      config={{ responsive: true, displaylogo: false}}
      useResizeHandler={true}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
