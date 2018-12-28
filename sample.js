//const http = require('http');
//
//const hostname = '127.0.0.1';
//const port = 3000;
//
//const server = http.createServer((req, res) => {
//  res.statusCode = 200;
//  res.setHeader('Content-Type', 'text/plain');
//  res.end('Hello World\n');
//});
//
//server.listen(port, hostname, () => {
//  console.log(`Server running at http://${hostname}:${port}/`);
//});
//
//var result = someJavaMethod('Ian', 'Bull');
//console.log(result);
//function someJavaMethod(name1, name2)
//{
//	return 'Hello mr '+name1+', '+name2;
//}
//

function resolveURL(url) {
    //console.log(" read url "+ url );
    var isWin = !!process.platform.match(/^win/);
    // console.log(isWin);
    if (!isWin) return url;
    return url.replace(/\//g, '\\');
}

// Please use HTTPs on non-localhost domains.
var isUseHTTPs = true;

// var port = 443;
var port = process.env.PORT || 9001;

var fs = require('fs');
var path = require('path');

// see how to use a valid certificate:
var options = {
    key: fs.readFileSync(path.join(__dirname, resolveURL('fake-keys/privatekey.pem'))),
    cert: fs.readFileSync(path.join(__dirname, resolveURL('fake-keys/certificate.pem')))
};
// console.log("read options "+options);
// force auto reboot on failures
var autoRebootServerOnFailure = false;
var serverIp = "127.0.0.1";

// skip/remove this try-catch block if you're NOT using "config.json"
//E://Work//careconnectRTC//config.json
try {
    var config = require('./config.json');
    // console.log(config.port);
    if ((config.port || '').toString() !== '9001') {
        port = parseInt(config.port);
    }

    if ((config.autoRebootServerOnFailure || '').toString() !== true) {
        autoRebootServerOnFailure = false;
    }
    if ((config.serverIp || '').toString() !== '127.0.0.1') {
        serverIp = config.serverIp;
    }
    // console.log(config.autoRebootServerOnFailure);
} catch (e) {
    console.log(e);
}

// You don't need to change anything below

var server = require(isUseHTTPs ? 'https' : 'http');
var url = require('url');

function serverHandler(request, response) {
	 console.log('serverHandler');
	 console.log(path.resolve(__dirname));
    try {
        var uri = url.parse(request.url).pathname;
        console.log(uri);
        var localPath = process.cwd();
        console.log(localPath);
        var filename = path.join(path.resolve(__dirname), uri);
        console.log(filename);

//        console.log(filename);
//        console.log(filename.search(/server.js|Scalable-Broadcast.js|Signaling-Server.js/g));
        if (filename && filename.search(/server.js|sample.js|Scalable-Broadcast.js|Signaling-Server.js/g) !== -1) 
        {
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });
            response.write('404 Not Found js: ' + path.join('/', uri) + '\n');
            response.end();
            return;
        }

        var stats;
        
        try {
            stats = fs.lstatSync(filename);
            console.log("stats");
            if (filename && filename.search(/index.html/g) === -1 && stats.isDirectory()) 
            {
                response.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                response.write('<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=/index.html"></head><body></body></html>');
                response.end();
                return;
            }
        }
        catch (e) 
        {
            console.log(e);
        	response.writeHead(404, {
                'Content-Type': 'text/plain'
            });
            response.write('404 Not Found my file: ' + path.join('/', uri) + '\n');
            response.end();
            return;
        }

        if (fs.statSync(filename).isDirectory()) {
        	 console.log('fs.statSync(filename)');
            response.writeHead(404, {
                'Content-Type': 'text/html'
            });

            if (filename.indexOf(resolveURL('/demos/MultiRTC/')) !== -1) {
                filename = filename.replace(resolveURL('/demos/MultiRTC/'), '');
                filename += resolveURL('/demos/MultiRTC/index.html');
            } else if (filename.indexOf(resolveURL('/demos/')) !== -1) {
                filename = filename.replace(resolveURL('/demos/'), '');
                filename += resolveURL('/demos/index.html');
            } else {
                filename += resolveURL('/demos/index.html');
            }
        }

        var contentType = 'text/plain';
        if (filename.toLowerCase().indexOf('.html') !== -1) {
            contentType = 'text/html';
        }
        if (filename.toLowerCase().indexOf('.css') !== -1) {
            contentType = 'text/css';
        }
        if (filename.toLowerCase().indexOf('.png') !== -1) {
            contentType = 'image/png';
        }

        fs.readFile(filename, 'binary', function(err, file) {
        	console.log('fs.readFile(filename,');
            if (err) {
                response.writeHead(500, {
                    'Content-Type': 'text/plain'
                });
                response.write('404 Not Found binary: ' + path.join('/', uri) + '\n');
                response.end();
                return;
            }

            response.writeHead(200, {
                'Content-Type': contentType
            });
            response.write(file, 'binary');
            response.end();
        });
    } catch (e) {
        response.writeHead(404, {
            'Content-Type': 'text/plain'
        });
        response.write('<h1>Unexpected error:</h1><br><br>' + e.stack || e.message || JSON.stringify(e));
        response.end();
    }
}

var app;

if (isUseHTTPs) {
    app = server.createServer(options, serverHandler);
} else {
    app = server.createServer(serverHandler);
}

function cmd_exec(cmd, args, cb_stdout, cb_end) {
	console.log('cmd_exec');
    var spawn = require('child_process').spawn,
        child = spawn(cmd, args),
        me = this;
    me.exit = 0;
    me.stdout = "";
    child.stdout.on('data', function(data) {
        cb_stdout(me, data)
    });
    child.stdout.on('end', function() {
        cb_end(me)
    });
}

function log_console() {
	console.log('log_console');
    console.log(foo.stdout);

    try {
        var pidToBeKilled = foo.stdout.split('\nnode    ')[1].split(' ')[0];
        console.log('------------------------------');
        console.log('Please execute below command:');
        console.log('\x1b[31m%s\x1b[0m ', 'kill ' + pidToBeKilled);
        console.log('Then try to run "server.js" again.');
        console.log('------------------------------');

    } catch (e) {
        console.log(e)
    }
}

function runServer() {
	console.log('runServer');
    app.on('error', function(e) {
        if (e.code == 'EADDRINUSE') {
            console.log(e);
            if (e.address === '0.0.0.0') {
                e.address = 'localhost';
            } else {
                e.address = serverIp;
            }

            console.log(e.address);
            var socketURL = (isUseHTTPs ? 'https' : 'http') + '://' + e.address + ':' + e.port + '/';

            console.log('------------------------------');
            console.log('\x1b[31m%s\x1b[0m ', 'Unable to listen on port: ' + e.port);
            console.log('\x1b[31m%s\x1b[0m ', socketURL + ' is already in use. Please kill below processes using "kill PID".');
            console.log('------------------------------');

            foo = new cmd_exec('lsof', ['-n', '-i4TCP:9001'],
                function(me, data) {
                    me.stdout += data.toString();
                },
                function(me) {
                    me.exit = 1;
                }
            );

            setTimeout(log_console, 250);
        }
    });

    app = app.listen(port, process.env.IP || '0.0.0.0', function(error) {
        var addr = app.address();
        //console.log(addr);
        if (addr.address === '0.0.0.0') {
            addr.address = serverIp;
        } else {
            addr.address = "localhost";
        }
        console.log(addr.address);
        var domainURL = (isUseHTTPs ? 'https' : 'http') + '://' + addr.address + ':' + addr.port + '/';

        console.log('------------------------------');

        console.log('socket.io is listening at: ' + domainURL);
        // console.log('\x1b[31m%s\x1b[0m ', '\t' + domainURL);

        // console.log('\n');

        // console.log('Your web-browser (HTML file) MUST set this line:');
        // console.log('\x1b[31m%s\x1b[0m ', 'connection.socketURL = "' + domainURL + '";');

        if (addr.address != serverIp && !isUseHTTPs) {
            console.log('Warning:');
            console.log('\x1b[31m%s\x1b[0m ', 'Please set isUseHTTPs=true to make sure audio,video and screen demos can work on Google Chrome as well.');
        }
    });

    require('./Signaling-Server.js')(app, function(socket) {
    	console.log('require(./Signaling-Server.js');
        try {
            var params = socket.handshake.query;

            // "socket" object is totally in your own hands!
            // do whatever you want!

            // in your HTML page, you can access socket as following:
            // connection.socketCustomEvent = 'custom-message';
            // var socket = connection.getSocket();
            // socket.emit(connection.socketCustomEvent, { test: true });

            if (!params.socketCustomEvent) {
                params.socketCustomEvent = 'custom-message';
            }

            socket.on(params.socketCustomEvent, function(message) {
                try {
                    socket.broadcast.emit(params.socketCustomEvent, message);
                } catch (e) {}
            });
        } catch (e) {
            console.log(e)
        }
    });
}

if (autoRebootServerOnFailure) {
    // auto restart app on failure
    var cluster = require('cluster');
    if (cluster.isMaster) {
        cluster.fork();

        cluster.on('exit', function(worker, code, signal) {
            cluster.fork();
        });
    }

    if (cluster.isWorker) {
        runServer();
    }
} else {
    runServer();
}
