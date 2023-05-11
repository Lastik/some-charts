import {NumericPoint} from "../geometry";

class PercentileHelper {

  public calculateMinY(percentile25: number, percentile75: number): number {
    return percentile25 - 1.5 * (percentile75 - percentile25);
  }

  public calculateMaxY(percentile25: number, percentile75: number): number {
    return percentile75 + 1.5 * (percentile75 - percentile25);
  }

  public calculate25Percentile(dataPoints: Array<NumericPoint>): number{
    return this.calculatePercentile(dataPoints, 25);
  }

  public calculate75Percentile(dataPoints: Array<NumericPoint>): number{
    return this.calculatePercentile(dataPoints, 75);
  }

  public calculate50Percentile(dataPoints: Array<NumericPoint>): number{
    return this.calculatePercentile(dataPoints, 50);
  }

  private calculatePercentile(dataPoints: Array<NumericPoint>, percentilePercent: number): number{
    this.checkForEmptyDataPoints(dataPoints);
    let dataPointsCount = dataPoints.length;
    let percentileIndex = Math.max(Math.round(percentilePercent / 100 * dataPointsCount) - 1, 0);
    return dataPoints[percentileIndex].y;
  }

  private checkForEmptyDataPoints(dataPoints: Array<NumericPoint>){
    if(dataPoints.length === 0){
      throw new Error('Array of dataPoints shouldn\'t be empty!');
    }
  }
}

const percentileHelper = new PercentileHelper();

export {percentileHelper as PercentileHelper};
