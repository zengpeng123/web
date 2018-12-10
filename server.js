const express = require('express');
const static = require('express-static');
const mysql = require('mysql');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const multer = require('multer');
const consolidate = require('consolidate');
const expressRoute = require('express-route');



var server = express();
server.listen(8888);

// 连接池
// const db =  mysql.createPool({
//  host: 'localhost',
//  user: 'root',
//  password: '123456',
//  database: 'web'
// });

// 1.获取请求数据
server.use(bodyParser.urlencoded());
server.use(multer({ dest: './static/upload/' }).any());

// 2.cookie、session
server.use(cookieParser());
(function () {
  var keys = [];
  for (var i = 0; i < 100000; i++) {
    keys[i] = 'a_' + Math.random();
  }
  server.use(cookieSession({
    name: 'sess_id',
    keys: keys,
    maxAge: 20*60*1000  // 20min
  }))
})();

// 3.模板
server.engine('html', consolidate.ejs);
server.set('views', './template');
server.set('view engine', 'html');

// 4.route
server.use('/', require('./route/web.js')());
server.use('/admin', require('./route/admin/index.js')());

// 5.default:static
server.use(static('./static'));
