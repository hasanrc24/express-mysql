const asyncHandler = (func) => async (req, res, next) => {
    try {
        await func(req, res, next)
    } catch (error) {
        res.status(error.statusCode || 500).json({
            statusCode: error.statusCode,
            success: false,
            message: error.message
        })
    }
}

module.exports = { asyncHandler }