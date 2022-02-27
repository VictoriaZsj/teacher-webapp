const dsn = 'https://f77558852232469587491c981d5b32c1@log-sentry.zmlearn.com/60';
const rate = 50;
export default {
    dsn,
    rate,
    options: {
        environment: process.env.NODE_ENV,
        whitelistUrls: []
    },
    reportFn: function fn() {
        if (process.env.NODE_ENV === 'production') {
            return true;
        }
        return true;
    }
};
