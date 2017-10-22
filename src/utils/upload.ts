<<<<<<< HEAD
/*import Storage from '@google-cloud/storage';
const bucketName = "dating-app";


	const inname = "matt2"
=======
import Storage = require('@google-cloud/storage');
const fs = require('fs');

const bucketName = "dating-app";

export default function uploadToGoogle(inname : string) {
	
	const storage = Storage({
		projectId: 'reliable-mode-183603',
		keyFilename: 'dateapp-4138fa62cb84.json'
	});

>>>>>>> 904ee4382678152b6e2893d6f7b17d34047580a1
	// The name of the local file to upload, e.g. "./local/path/to/file.txt"
	const filename = "./uploads/" + inname;

	return new Promise((resolve, reject) => {
		// Uploads a local file to the bucket
		storage
			.bucket(bucketName)
			.upload(filename)
			.then(() => {
				//  return `https://storage.googleapis.com/${CLOUD_BUCKET}/${filename}`;

				console.log(`${filename} uploaded to ${bucketName}.`);
				resolve(inname);
				fs.unlink(filename, (err) => {
					if (err) throw err;
					console.log('successfully deleted file');
					return;
				});
			})
			.catch(err => {
				console.error('ERROR:', err);
				reject();
				fs.unlink(filename, (err) => {
					if (err) throw err;
					console.log('successfully deleted file');
					return;
				});
			});
	});
*/