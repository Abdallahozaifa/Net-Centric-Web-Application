function gettool(req, res) {
	var fileName = gettool.root +req.path;
  	res.sendFile(fileName, function (err) {
	    if (err) {
	      console.log(err);
	      res.status(err.status).end();
	    }
	    else {
	      console.log('Sent:', req.path);
	    }
	});

}


exports.gettool = gettool;
