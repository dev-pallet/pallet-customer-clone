function createResponse(data) {
  return {
    status: "SUCCESS",
    data,
  };
}

function createErrorResponse(error) {
  return {
    status: "ERROR",
    code: error.code || error.status || 500,
    message: error.message || error || "Something went wrong",
  };
}

function createNewError(error) {
  return {
    status: error.code || error.status || 500,
    code: error.code || error.status || 500,
    message: error.message || error || "Something went wrong",
  };
}
module.exports = { createErrorResponse, createResponse, createNewError };
