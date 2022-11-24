import {NumericPoint} from "../geometry";

export class PercentileHelper {

  public static calculateMinY(percentile25: number, percentile75: number): number {
    return percentile25 - 1.5 * (percentile75 - percentile25);
  }

  public static calculateMaxY(percentile25: number, percentile75: number): number {
    return percentile75 + 1.5 * (percentile75 - percentile25);
  }

  public static calculate25Percentile(dataPoints: Array<NumericPoint>): number{
    return PercentileHelper.calculatePercentile(dataPoints, 25);
  }

  public static calculate75Percentile(dataPoints: Array<NumericPoint>): number{
    return PercentileHelper.calculatePercentile(dataPoints, 75);
  }

  public static calculate50Percentile(dataPoints: Array<NumericPoint>): number{
    return PercentileHelper.calculatePercentile(dataPoints, 50);
  }

  private static calculatePercentile(dataPoints: Array<NumericPoint>, percentilePercent: number): number{
    PercentileHelper.checkForEmptyDataPoints(dataPoints);
    let dataPointsCount = dataPoints.length;
    let percentileIndex = Math.max(Math.round(percentilePercent / 100 * dataPointsCount) - 1, 0);
    return dataPoints[percentileIndex].y;
  }

  private static checkForEmptyDataPoints(dataPoints: Array<NumericPoint>){
    if(dataPoints.length === 0){
      throw new Error('Array of dataPoints shouldn\'t be empty!');
    }
  }
}
