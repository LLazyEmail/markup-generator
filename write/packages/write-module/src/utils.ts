
const catchErrorTraceOutput = (error:any) => {
    // we need to test how it actually work
    const callerLine = error.stack.split('\n')[4];
    if(callerLine){
        const index = callerLine.indexOf('at ');
        // eslint-disable-next-line no-unused-vars
        const clean = callerLine.slice(index + 2, callerLine.length);
      
        throw error;
    }    
};


// @TODO enable it later
// const ERROR_NO_CONTENT = 'content variable is empty';

// @TODO enable it later
// const ERROR_TYPE_NOT_STRING = 'content variable is not a string';  

export default catchErrorTraceOutput