import Storage = require('@google-cloud/storage');
const bucketName = "dating-app";


const inname = "matt2"

const fs = require('fs');

export default function uploadToGoogle(inname : string) {
	
	const storage = Storage({
		projectId: 'reliable-mode-183603',
		keyFilename: 'DatingApp-e90d8b4108c7.json'
	});

	// The name of the local file to upload, e.g. "./local/path/to/file.txt"
	const filename = "./uploads/" + inname;

	return new Promise((resolve, reject) => {
		// Uploads a local file to the bucket
		storage
			.bucket(bucketName)
			.upload(filename)
			.then(() => {
				//  return `https://storage.googleapis.com/dating-app/0b309ade7f23bce987618739a5fb733d`;
				var url = `https://storage.googleapis.com/${bucketName}/${inname}`;
				resolve(url);
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
}