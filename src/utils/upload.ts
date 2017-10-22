import Storage from '@google-cloud/storage';
const bucketName = "dating-app";

function toGoogle(inname) {
	
	// The name of the local file to upload, e.g. "./local/path/to/file.txt"
	const filename = "./uploads/" + inname;

	// Instantiates a client
	const storage = Storage();

	// Uploads a local file to the bucket
	storage
	  .bucket(bucketName)
	  .upload(filename)
	  .then(() => {
	    console.log(`${filename} uploaded to ${bucketName}.`);
	  })
	  .catch(err => {
	    console.error('ERROR:', err);
	  });

	//Does deletion of original file
	const fs = require('fs');

	fs.unlink(filename, (err) => {
  	if (err) throw err;
  	console.log('successfully deleted ' + filename);
	});
}