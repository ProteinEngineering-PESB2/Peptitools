import Plot from "react-plotly.js"
interface Props{
  data: any[];
  learning_curve: {
    training: {
      x: number[];
    }
  };
  title: string
}
export default function LearningCurve({data, learning_curve, title}: Props) {
  return (
  <>
    <Plot
      data={data}
      layout={{
        autosize: true,
        height: 400,
        title: title,
        xaxis: {
          title: "Training Examples",
          range: [
            learning_curve.training.x[0],
            learning_curve.training.x[learning_curve.training.x.length - 1],
          ],
        },
        font: {
          size: 15,
        },
        yaxis: { title: "Score" },
      }}
      config={{ responsive: true, displaylogo: false}}
      useResizeHandler={true}
      style={{ width: "100%", height: "100%" }}
    />
  </>
  );
}
