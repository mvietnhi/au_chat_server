export default (err, req, res, next) => {
    console.log(err)
    return res.status(err.status || 400).json({
        isSuccess: false,
        message: err.message || 'Unknown error happened'
    });
};