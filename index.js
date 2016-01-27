var express = require('express'),
    connect = require('connect'),
    auth = require('./auth');
    https = require('https');
    http = require('http');
    cors = require('cors');
    fs = require('fs');

var options = {
  key: fs.readFileSync('/usr/local/etc/nginx/ssl/server.key'),
  cert: fs.readFileSync('/usr/local/etc/nginx/ssl/server.crt')
};

var app = express();

app.use(cors());

app.configure(function() {
  app.use(express.logger());
  app.use(connect.compress());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({ key: 'ACCESS_TOKEN', secret: "won't tell because it's secret", cookie: {httpOnly: false}  }));
  app.use(auth.initialize());
  app.use(auth.session());
});



app.post('/', auth.protected, function (req, res){
    res.end("Hello " + req.session.passport.user);
});

app.get('/', auth.protected, function (req, res){
	  res.end("Hello" + req.session.passport.user);
    res.send({
    "access_token": "d7b7b093-821d-3ed5-ad8b-e91f2ae669d5",
    "expires_in": 3600,
    "scope": "sungevity.com",
    "refresh_token": "827af4a2-6dc7-3c75-8bd7-36b7823857fb",
    "token_type": "Bearer"
  });
});

app.post('/login/callback', auth.authenticate('saml', { failureRedirect: '/', failureFlash: true }), function (req, res) {
    res.redirect('/');
  }
);

app.get('/login', auth.authenticate('saml', { failureRedirect: '/', failureFlash: true }), function (req, res) {
    res.redirect('/');
  }
);

app.post('/login', auth.authenticate('saml', { failureRedirect: '/', failureFlash: true }), function (req, res) {
    res.redirect('/');
  }
);

https.createServer({
     key: options.key,
     cert: options.cert
   }, app).listen(process.env.PORT || 3000, function() {
      console.log("Server started");
   });

