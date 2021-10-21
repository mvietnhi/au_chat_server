export default async function returnSuccess(status, res, message, data) {
    return res.status(status).json({
        success: true,
        message: message,
        data: data,
    })
}