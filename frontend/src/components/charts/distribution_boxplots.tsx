import Plot from "react-plotly.js";

interface Props{
  data: any;
  title: string;
  height: number;
  rows: number;
  columns: number;
}

export default function DistributionBoxplots({ data, title, height, rows, columns }: Props) {
  const dataBoxplot =  data.targets.map((res: string, index: number) => {
    if (index == 0){
      return {
      type: "box",
      x: data[res].x,
      y: data[res].y,
      name: res
      }
    }
    else{
      return {
      type: "box",
      x: data[res].x,
      y: data[res].y,
      name: res,
      xaxis: `x${index+1}`,
      yaxis: `y${index+1}`
      }
    }
  });
  const layoutBoxplot = {
    autosize: true,
    height: height,
    title: title,
    grid: { rows: rows, columns: columns, pattern: "independent" }
  };

  return (
    <Plot
      data={dataBoxplot}
      layout={layoutBoxplot}
      config={{ responsive: true }}
      useResizeHandler={true}
      style={{ width: "100%", height: "100%" }}
      />
  );
};