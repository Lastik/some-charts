import {DataSetChange, EventBase} from "../../index";
import {DataSetEventType} from "./data-set-event-type";

export class DataSetChangedEvent<XDimensionType extends number | string | Date,
  YDimensionType extends number | string | Date | undefined = undefined> implements EventBase<DataSetEventType> {

  /**
   * Event type;
   */
  readonly type: DataSetEventType;

  public readonly change: DataSetChange<XDimensionType, YDimensionType>;

  /**
   * Creates event of DataSet change.
   */
  constructor(change: DataSetChange<XDimensionType, YDimensionType>) {
    this.type = DataSetEventType.Changed;
    this.change = change;
  }
}
