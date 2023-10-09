import { useMemo } from "react";
import DataJSON from "../Wine-Data.json";

type meanMediumMode = (data: number[]) => number;

const wineDataJSON: {
  Alcohol: number | string;
  "Malic Acid": number | string;
  Ash: number | string;
  "Alcalinity of ash": number | string;
  Magnesium: number | string;
  "Total phenols": number | string;
  Flavanoids: number | string;
  "Nonflavanoid phenols": number | string;
  Proanthocyanins: string | number;
  "Color intensity": number | string;
  Hue: number | string;
  "OD280/OD315 of diluted wines": number | string;
  Unknown: number;
  Gamma?: number;
}[] = structuredClone(DataJSON);


const mean: meanMediumMode = (data) => {
  const total = data.reduce((prev, next) => prev + next, 0);
  return total / data.length;
};
const median: meanMediumMode = (data: number[]) => {
  const mid = Math.floor(data.length / 2),
    nums = [...data].sort((a, b) => a - b);
  return data.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};
const mode: meanMediumMode = (data: number[]) => {
  let object: Record<string, number> = {};

  for (let i = 0; i < data.length; i++) {
    if (object[data[i]]) {
      object[data[i]] += 1;
    } else {
      object[data[i]] = 1;
    }
  }
  let biggestValue = -1;
  let biggestValuesKey: number = 0;
  Object.keys(object).forEach((key) => {
    let value = object[key];
    if (value > biggestValue) {
      biggestValue = value;
      biggestValuesKey = parseInt(key);
    }
  });

  return data[biggestValuesKey];
};

const MeanMediumMode: React.FC = () => {
  const winesByClass = useMemo(() => {
    const flavanoidsGamma: {
      class: number | string;
      flavanoidsData: number[];
      gammaData: number[];
      flavanoidsmean?: string;
      flavanoidsmedian?: string;
      flavanoidsmode?: string;
      gammaMean?: string;
      gammaMedian?: string;
      gammaMode?: string;
    }[] = [];
    //adding Gamma property
    for (const wineElement of wineDataJSON) {
      const { Ash, Hue, Magnesium } = wineElement;
      wineElement.Gamma = (Number(Ash) * Number(Hue)) / Number(Magnesium);
    }
    for (const wineElement of wineDataJSON) {
      const { Alcohol } = wineElement;

      const existsAlready = flavanoidsGamma.findIndex(
        (element) => element?.class === Alcohol
      );
      if (existsAlready === -1) {
        flavanoidsGamma.push({
          class: wineElement.Alcohol,
          flavanoidsData: [Number(wineElement.Flavanoids)],
          gammaData: [Number(wineElement?.Gamma)],
        });
      } else {
        flavanoidsGamma[existsAlready].flavanoidsData.push(
          Number(wineElement.Flavanoids)
        );
        flavanoidsGamma[existsAlready].gammaData.push(
          Number(wineElement.Gamma)
        );
      }
    }
    for (const flavanoidGammaElement of flavanoidsGamma) {
      flavanoidGammaElement.flavanoidsmean = mean(
        flavanoidGammaElement.flavanoidsData
      ).toFixed(3);
      flavanoidGammaElement.flavanoidsmedian = median(
        flavanoidGammaElement.flavanoidsData
      ).toFixed(3);
      flavanoidGammaElement.flavanoidsmode = mode(
        flavanoidGammaElement.flavanoidsData
      ).toFixed(3);
      flavanoidGammaElement.gammaMean = mean(flavanoidGammaElement.gammaData).toFixed(3);
      flavanoidGammaElement.gammaMedian = median(
        flavanoidGammaElement.gammaData
      ).toFixed(3);
      flavanoidGammaElement.gammaMode = mode(flavanoidGammaElement.gammaData).toFixed(3);
    }
    return flavanoidsGamma;
  }, [wineDataJSON]);
  return (
    <div id="table-scroll" className="table-scroll">
      <center> flavanoids Data</center>
      <table id="main-table" className="main-table">
        <thead>
          <tr>
            <th scope="col">Measure</th>
            {winesByClass?.map((wineElement) => (
              <th key={wineElement?.class} scope="col">
                class {wineElement?.class}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Flavanoids Mean</th>

            {winesByClass?.map((wineElement) => (
              <th key={wineElement?.class} scope="col">
                {wineElement?.flavanoidsmean}
              </th>
            ))}
          </tr>
          <tr>
            <th>Flavanoids Median</th>
            {winesByClass?.map((wineElement) => (
              <th key={wineElement?.class} scope="col">
                {wineElement?.flavanoidsmedian}
              </th>
            ))}
          </tr>
          <tr>
            <th>Flavanoids Mode</th>

            {winesByClass?.map((wineElement) => (
              <th key={wineElement?.class} scope="col">
                {wineElement?.flavanoidsmode}
              </th>
            ))}
          </tr>
        </tbody>
      </table>
      <br></br><br></br>
      <center>Gamma Data</center>
      <table id="main-table" className="main-table">
        <thead>
          <tr>
            <th scope="col">Measure</th>
            {winesByClass?.map((wineElement) => (
              <th key={wineElement?.class} scope="col">
                class {wineElement?.class}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Gamma Mean</th>

            {winesByClass?.map((wineElement) => (
              <th key={wineElement?.class} scope="col">
                {wineElement?.gammaMean}
              </th>
            ))}
          </tr>
          <tr>
            <th>Gamma Median</th>
            {winesByClass?.map((wineElement) => (
              <th key={wineElement?.class} scope="col">
                {wineElement?.gammaMedian}
              </th>
            ))}
          </tr>
          <tr>
            <th>Gamma Mode</th>

            {winesByClass?.map((wineElement) => (
              <th key={wineElement?.class} scope="col">
                {wineElement?.gammaMode}
              </th>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};
export { MeanMediumMode };
