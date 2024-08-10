const asyncHandler = (func) => async (req, res, next) => {
    try {
        await func(req, res, next)
    } catch (error) {
        res.status(error.statusCode || 500).json({
            statusCode: error.statusCode,
            success: false,
            message: error.message,
            ...(error.errors.length && {
                validation: error.errors
            }),
        })
    }
}

module.exports = { asyncHandler }