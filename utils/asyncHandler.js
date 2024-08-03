const asyncHandler = (func) => async (req, res, next) => {
    try {
        await func(req, res, next)
    } catch (error) {
        if(error?.errors?.length){
            res.status(error.statusCode || 500).json({
                statusCode: error.statusCode,
                success: false,
                message: error.message,
                validation: error.errors
            })
        }else{
            res.status(error.statusCode || 500).json({
                statusCode: error.statusCode,
                success: false,
                message: error.message
            })
        }
    }
}

module.exports = { asyncHandler }