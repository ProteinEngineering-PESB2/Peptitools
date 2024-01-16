import Plot from "react-plotly.js"
interface Props {
  data: any[];
  title: string;
}

export default function ConfusionMatrix({data, title}: Props) {
  
  return (
    <>
    <Plot
      data={data}
      layout={{
        autosize: true,
        height: 500,
        title: title,
        xaxis: { title: "Real Values" },
        yaxis: { title: "Predicted Values" },
        font: { size: 15 }
      }}
      config={{ responsive: true , displaylogo: false}}
      useResizeHandler={true}
      style={{ width: "100%", height: "100%" }}
    /></>
  );
}
