var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const swaggerUi = require('swagger-ui-express'),
swaggerDocument = require('./swagger.json');
const rateLimit = require('express-rate-limit')
const promMid = require('express-prometheus-middleware')

const db = require('./queries');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


//rate-limit

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.use(limiter)


// metric
app.use(promMid({
  metricsPath: '/metrics',
  collectDefaultMetrics: true,
  requestDurationBuckets: [0.1, 0.5, 1, 1.5],
  requestLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
  responseLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
  /**
   * Uncomenting the `authenticate` callback will make the `metricsPath` route
   * require authentication. This authentication callback can make a simple
   * basic auth test, or even query a remote server to validate access.
   * To access /metrics you could do:
   * curl -X GET user:password@localhost:9091/metrics
   */
  // authenticate: req => req.headers.authorization === 'Basic dXNlcjpwYXNzd29yZA==',
  /**
   * Uncommenting the `extraMasks` config will use the list of regexes to
   * reformat URL path names and replace the values found with a placeholder value
  */
  // extraMasks: [/..:..:..:..:..:../],
  /**
   * The prefix option will cause all metrics to have the given prefix.
   * E.g.: `app_prefix_http_requests_total`
   */
  // prefix: 'app_prefix_',
  /**
   * Can add custom labels with customLabels and transformLabels options
   */
  // customLabels: ['contentType'],
  // transformLabels(labels, req) {
  //   // eslint-disable-next-line no-param-reassign
  //   labels.contentType = req.headers['content-type'];
  // },
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  '/api-docs',
  swaggerUi.serve, 
  swaggerUi.setup(swaggerDocument)
);

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/users', db.getUsers);
app.get('/users/:id', db.getUserById);
app.post('/users', db.createUser);
app.put('/users/:id', db.updateUser);
app.delete('/users/:id', db.deleteUser);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
