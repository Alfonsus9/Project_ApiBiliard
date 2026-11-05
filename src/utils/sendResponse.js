export const sendErrorResponse = (res, code, errorMessage) => res.status(code).send({
    status: 'error',
    error: errorMessage
});

export const sendSuccessResponse = (res, code, data, message = 'Successful') => res.status(code).send({
    status: 'success',
    data,
    message
});