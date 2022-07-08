import {EventBase} from "../../../model";
import {DataSetEventType} from "./data-set-event-type";

export class DataSetChangedEvent implements EventBase<DataSetEventType> {

  /**
   * Event type;
   */
  readonly type: DataSetEventType;

  /**
   * Creates event of DataSet change.
   */
  constructor(){
    this.type = DataSetEventType.Changed;
  }
}
