class ApiResponse {
    constructor(statusCode, data, message = "Success"){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
    }
}

export { ApiResponse }


// How to use this class

// const apiResponse = new ApiResponse(200, { key: "value" }, "Data retrieved successfully");

// console.log(apiResponse.statusCode); // 200
// console.log(apiResponse.data); // { key: "value" }
// console.log(apiResponse.message); // "Data retrieved successfully"
// console.log(apiResponse.success); // true
