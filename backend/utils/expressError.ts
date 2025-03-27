class expressError extends Error {
    status: number;
    errMsg: string;
  
    constructor(status: number, errMsg: string) {
      super();
      this.status = status;
      this.errMsg = errMsg;
    }
  }
  
  export default expressError;
  