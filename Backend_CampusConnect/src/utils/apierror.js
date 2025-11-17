class ApiError extends Error{
    // Constructor to initialize the error with a message and status code
    constructor(statusCode,message = "Internal Server Error Occur !",errors=[],stack="")
    {
    super(message)// Call the parent constructor with the error message
    this.statusCode = statusCode
    this.data = null
    this.message = message
    this.errors = errors
    this.success = false
    this.stack = stack

    if(stack){
        // set the stack trace for corresponding error
        this.stack = stack
    }else {

    }
       Error.captureStackTrace(this,this.constructor)
    }


}

export {ApiError}





